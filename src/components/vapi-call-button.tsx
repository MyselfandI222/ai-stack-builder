"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Mic, MicOff, Phone, PhoneOff, Loader2, MessageSquare } from "lucide-react";

type CallStatus = "idle" | "connecting" | "active" | "error";

interface TranscriptLine {
  role: string;
  text: string;
}

function safeParseArgs(raw: unknown): Record<string, unknown> | null {
  if (!raw) return null;
  if (typeof raw === "object") return raw as Record<string, unknown>;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}

function extractSubmitAnswers(message: any): Record<string, unknown> | null {
  // Format 1: function-call
  if (message.type === "function-call" && message.functionCall?.name === "submitAnswers") {
    return safeParseArgs(message.functionCall.parameters) || {};
  }

  // Format 2: tool-calls (handles both toolCallList and toolCalls)
  if (message.type === "tool-calls") {
    const list = message.toolCallList ?? message.toolCalls ?? [];
    for (const tc of list) {
      if (tc?.function?.name === "submitAnswers") {
        return safeParseArgs(tc.function.arguments) || {};
      }
    }
  }

  // Format 3: Direct tool-call (singular)
  if (message.type === "tool-call" && message.function?.name === "submitAnswers") {
    return safeParseArgs(message.function.arguments) || {};
  }

  // Format 4: Check for submitAnswers anywhere in the message via deep search
  const str = JSON.stringify(message);
  if (str.includes("submitAnswers")) {
    const fc = message.functionCall || message.function_call || message.toolCall?.function;
    if (fc?.parameters) return safeParseArgs(fc.parameters);
    if (fc?.arguments) return safeParseArgs(fc.arguments);

    for (const key of Object.keys(message)) {
      const val = message[key];
      if (typeof val === "object" && val !== null && (val.description || val.budget || val.businessType)) {
        return val;
      }
    }
    console.warn("[Vapi] Found submitAnswers in message but couldn't extract params:", message);
  }

  return null;
}

const ANSWER_LABELS: Record<string, string> = {
  description: "Business Description",
  businessModel: "Business Model",
  budget: "Monthly AI Budget",
  targetAudience: "Target Audience",
  teamSize: "Team Size",
  operations: "Areas Needing Help",
  topGoal: "Top Goal",
  biggestChallenge: "Biggest Challenge",
  aiExperience: "AI Experience",
  aiToolsUsed: "AI Tools Used",
  aiUsageFrequency: "AI Usage Frequency",
  existingPlatforms: "Platform Accounts",
  preferredAccessMethod: "Preferred Access",
  productService: "Product/Service",
  stage: "Business Stage",
  hasWebsite: "Has Website",
  websiteUrl: "Website URL",
  websiteQuality: "Website Quality",
  revenueModel: "Revenue Model",
  marketingChannels: "Marketing Channels",
  salesProcess: "Sales Process",
  currentCustomerCount: "Customer Count",
  currentTools: "Current Tools",
  differentiator: "Key Differentiator",
  competitors: "Competitors",
  revenueGoal: "Revenue Goal",
  contentTypes: "Content Types",
  automateFirst: "Automate First",
  pricePoint: "Price Point",
  supportCurrently: "Support Handling",
  customerAcquisition: "Customer Acquisition",
  signupIssues: "Signup Issues",
};

export function VapiCallButton() {
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [finalTranscripts, setFinalTranscripts] = useState<TranscriptLine[]>([]);
  const [answers, setAnswers] = useState<Record<string, unknown> | null>(null);
  const [showRecap, setShowRecap] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const vapiRef = useRef<any>(null);
  const submittedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRef = useRef(0);
  const allMessagesRef = useRef<any[]>([]);

  const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

  const handleSubmitAnswers = useCallback(
    (params: Record<string, unknown>) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      console.log("[Vapi] submitAnswers received:", params);
      sessionStorage.setItem("vapi-answers", JSON.stringify(params));

      // Show recap panel instead of immediately redirecting
      setAnswers(params);
      setShowRecap(true);

      if (vapiRef.current) {
        try { vapiRef.current.stop(); } catch {}
        vapiRef.current = null;
      }
      if (timerRef.current) clearInterval(timerRef.current);
      setStatus("idle");
    },
    []
  );

  const handleContinueFromRecap = useCallback(() => {
    router.push("/generating");
  }, [router]);

  const startCall = useCallback(async () => {
    if (!publicKey || !assistantId) {
      setError("Voice agent not configured.");
      return;
    }
    if (!user) {
      router.push("/auth");
      return;
    }
    try {
      setStatus("connecting");
      setError(null);
      setTranscript("");
      setFinalTranscripts([]);
      setAnswers(null);
      setShowRecap(false);
      setSeconds(0);
      submittedRef.current = false;

      const Vapi = (await import("@vapi-ai/web")).default;
      const vapi = new Vapi(publicKey);
      vapiRef.current = vapi;

      vapi.on("call-start", () => {
        console.log("[Vapi] Call started");
        setStatus("active");
        secondsRef.current = 0;
        allMessagesRef.current = [];
        timerRef.current = setInterval(() => {
          secondsRef.current += 1;
          setSeconds((s) => s + 1);
        }, 1000);
      });

      vapi.on("call-end", () => {
        console.log("[Vapi] Call ended, submitted:", submittedRef.current, "duration:", secondsRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        vapiRef.current = null;

        if (submittedRef.current) return; // already showing recap or redirecting

        // If the call was long enough, Elliot likely collected answers
        if (secondsRef.current >= 45) {
          console.log("[Vapi] Call was long enough, checking stored messages for data...");
          for (const msg of allMessagesRef.current) {
            try {
              const params = extractSubmitAnswers(msg);
              if (params) {
                handleSubmitAnswers(params);
                return;
              }
            } catch {}
          }
          // No structured data found — show recap with fallback
          console.log("[Vapi] No structured data found, showing recap with transcript fallback");
          submittedRef.current = true;
          sessionStorage.setItem("vapi-answers", JSON.stringify({ _fallback: true }));
          setAnswers({});
          setShowRecap(true);
          setStatus("idle");
          return;
        }

        setStatus("idle");
      });

      // Listen for ALL events to catch call ending
      const allEvents = [
        "speech-start", "speech-end", "volume-level",
        "call-start", "call-end", "message", "error",
        "hang", "metadata", "close",
      ];
      for (const evt of allEvents) {
        if (evt === "call-start" || evt === "call-end" || evt === "error") continue; // already handled
        vapi.on(evt as any, (data: any) => {
          if (evt !== "volume-level") {
            console.log(`[Vapi] Event: ${evt}`, data);
          }
        });
      }

      vapi.on("message", (message: any) => {
        console.log("[Vapi] Message:", message.type, message);
        allMessagesRef.current.push(message);

        // 1) Collect final transcripts
        if (message.type === "transcript" && message.transcriptType === "final") {
          setTranscript(message.transcript);
          setFinalTranscripts((prev) => [
            ...prev,
            { role: message.role || "unknown", text: message.transcript },
          ]);
        }

        // 2) Handle tool-calls — the primary way submitAnswers arrives
        if (message.type === "tool-calls") {
          const list = message.toolCallList ?? message.toolCalls ?? [];
          for (const tc of list) {
            const name = tc?.function?.name;
            if (name === "submitAnswers") {
              const args = safeParseArgs(tc.function.arguments);
              console.log("[Vapi] submitAnswers args:", args);
              if (args && Object.keys(args).length > 0) {
                handleSubmitAnswers(args);
              } else {
                // Still show recap but indicate it was empty
                submittedRef.current = true;
                sessionStorage.setItem("vapi-answers", JSON.stringify({ _fallback: true }));
                setAnswers({});
                setShowRecap(true);
                if (vapiRef.current) {
                  try { vapiRef.current.stop(); } catch {}
                  vapiRef.current = null;
                }
                if (timerRef.current) clearInterval(timerRef.current);
                setStatus("idle");
              }
              return;
            }
          }
        }

        // 3) Detect end-of-call-report — means call is definitely over
        //    Vapi's structuredDataPlan extracts fields here as a backup
        if (message.type === "end-of-call-report") {
          console.log("[Vapi] End of call report received", message);

          // First: check for structuredData from Vapi's analysisPlan
          if (!submittedRef.current) {
            const structuredData = message.analysis?.structuredData
              ?? message.structuredData
              ?? message.artifact?.structuredData;

            if (structuredData && typeof structuredData === "object" && Object.keys(structuredData).length > 0) {
              console.log("[Vapi] Found structuredData in end-of-call-report:", structuredData);
              handleSubmitAnswers(structuredData as Record<string, unknown>);
              return;
            }
          }

          // Second: re-scan stored messages for a tool call we may have missed
          if (!submittedRef.current && secondsRef.current >= 45) {
            for (const msg of allMessagesRef.current) {
              try {
                const p = extractSubmitAnswers(msg);
                if (p) { handleSubmitAnswers(p); return; }
              } catch {}
            }
            submittedRef.current = true;
            sessionStorage.setItem("vapi-answers", JSON.stringify({ _fallback: true }));
            setAnswers({});
            setShowRecap(true);
            if (timerRef.current) clearInterval(timerRef.current);
            setStatus("idle");
          }
          return;
        }

        // 4) Detect hang event
        if (message.type === "hang") {
          console.log("[Vapi] Hang detected");
          if (!submittedRef.current) {
            if (timerRef.current) clearInterval(timerRef.current);
            setStatus("idle");
          }
          return;
        }

        // 5) Fallback: try to extract from any other message format
        try {
          const params = extractSubmitAnswers(message);
          if (params) {
            handleSubmitAnswers(params);
          }
        } catch (err) {
          console.error("[Vapi] Failed to extract submitAnswers:", err);
        }
      });

      vapi.on("error", (e: any) => {
        console.error("[Vapi] Error:", e);
        console.error("[Vapi] Error details:", JSON.stringify(e, null, 2));
        if (timerRef.current) clearInterval(timerRef.current);
        const msg = e?.message || e?.error?.message || e?.errorMessage || "";
        setError(`Call error: ${msg || "Unknown error"}. Check browser console for details.`);
        setStatus("error");
      });

      vapi.start(assistantId);
    } catch (err: any) {
      console.error("Failed to start Vapi call:", err);
      const msg = err?.message || String(err);
      setError(`Failed to start call: ${msg}`);
      setStatus("error");
    }
  }, [publicKey, assistantId, user, router, handleSubmitAnswers]);

  const endCall = useCallback(() => {
    console.log("[Vapi] User ended call, duration:", secondsRef.current);
    if (vapiRef.current) {
      try { vapiRef.current.stop(); } catch {}
      vapiRef.current = null;
    }
    if (timerRef.current) clearInterval(timerRef.current);

    // If the call was long enough, try to extract data and show recap
    if (!submittedRef.current && secondsRef.current >= 45) {
      for (const msg of allMessagesRef.current) {
        try {
          const params = extractSubmitAnswers(msg);
          if (params) {
            handleSubmitAnswers(params);
            return;
          }
        } catch {}
      }
      // No structured data but call was substantial — show recap with fallback
      submittedRef.current = true;
      sessionStorage.setItem("vapi-answers", JSON.stringify({ _fallback: true }));
      setAnswers({});
      setShowRecap(true);
      setStatus("idle");
      return;
    }

    setStatus("idle");
  }, [handleSubmitAnswers]);

  const toggleMute = useCallback(() => {
    if (vapiRef.current) {
      const next = !isMuted;
      vapiRef.current.setMuted(next);
      setIsMuted(next);
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        try { vapiRef.current.stop(); } catch {}
        vapiRef.current = null;
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!publicKey || !assistantId) return null;

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // --- Recap panel after submitAnswers ---
  if (showRecap) {
    const hasAnswers = answers && Object.keys(answers).length > 0 && !("_fallback" in answers);
    const answerEntries = hasAnswers
      ? Object.entries(answers!).filter(([k]) => k !== "_fallback")
      : [];

    return (
      <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto px-6 py-12 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30 mb-2">
              <MessageSquare className="h-7 w-7 text-emerald-400" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Call Recap
            </h2>
            <p className="text-sm text-muted-foreground font-body">
              {hasAnswers
                ? `Elliot captured ${answerEntries.length} fields from your conversation`
                : "Elliot finished the call — generating your plan from the conversation"}
            </p>
          </div>

          {/* Extracted answers */}
          {hasAnswers && (
            <div className="rounded-2xl border border-border/20 bg-card/50 overflow-hidden">
              <div className="px-5 py-3 border-b border-border/15 bg-card/60">
                <h3 className="text-sm font-display font-semibold text-foreground/80">
                  Extracted Answers
                </h3>
              </div>
              <div className="divide-y divide-border/10">
                {answerEntries.map(([key, value]) => (
                  <div key={key} className="px-5 py-3 flex gap-4">
                    <span className="text-xs font-body font-medium text-muted-foreground min-w-[140px] pt-0.5">
                      {ANSWER_LABELS[key] || key}
                    </span>
                    <span className="text-sm font-body text-foreground/90 flex-1">
                      {Array.isArray(value)
                        ? value.join(", ")
                        : typeof value === "object" && value !== null
                          ? JSON.stringify(value)
                          : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transcript summary */}
          {finalTranscripts.length > 0 && (
            <details className="rounded-2xl border border-border/20 bg-card/50 overflow-hidden">
              <summary className="px-5 py-3 cursor-pointer text-sm font-display font-semibold text-foreground/80 hover:bg-card/60 transition-colors">
                Conversation Transcript ({finalTranscripts.length} messages)
              </summary>
              <div className="px-5 pb-4 max-h-64 overflow-y-auto space-y-2">
                {finalTranscripts.map((line, i) => (
                  <div key={i} className="text-sm font-body">
                    <span className={`font-medium ${line.role === "assistant" ? "text-emerald-400" : "text-primary"}`}>
                      {line.role === "assistant" ? "Elliot" : "You"}:
                    </span>{" "}
                    <span className="text-foreground/70">{line.text}</span>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Continue button */}
          <div className="text-center pt-2">
            <button
              onClick={handleContinueFromRecap}
              className="cta-glow inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-base transition-all btn-lift"
            >
              Generate My Plan
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="text-xs text-muted-foreground/50 font-body mt-3">
              Takes about 30 seconds to analyze
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- Full-screen active call overlay ---
  if (status === "active") {
    return (
      <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-6 text-center space-y-8">
          {/* Avatar + pulse rings */}
          <div className="relative mx-auto w-28 h-28">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-2 rounded-full bg-emerald-500/5 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.3s" }} />
            <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500/20 to-primary/10 ring-1 ring-emerald-500/30">
              <MessageSquare className="h-10 w-10 text-emerald-400" />
            </div>
          </div>

          {/* Name + status */}
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Talking to Elliot
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-emerald-400 font-body">Connected</span>
              </div>
              <span className="text-sm text-muted-foreground font-body tabular-nums">
                {formatTime(seconds)}
              </span>
            </div>
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="px-6 py-4 rounded-2xl border border-border/15 bg-card/40">
              <p className="text-sm text-foreground/70 font-body italic leading-relaxed">
                &ldquo;{transcript}&rdquo;
              </p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full transition-all ${
                isMuted
                  ? "bg-red-500/15 text-red-400 ring-1 ring-red-500/30 hover:bg-red-500/25"
                  : "bg-foreground/5 text-muted-foreground ring-1 ring-border/20 hover:bg-foreground/10"
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            <button
              onClick={endCall}
              className="p-4 rounded-full bg-red-500 text-white hover:bg-red-400 transition-all ring-1 ring-red-400/30"
              title="End call"
            >
              <PhoneOff className="h-5 w-5" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground/40 font-body">
            Elliot will wrap up when he has everything he needs
          </p>
        </div>
      </div>
    );
  }

  // --- Idle / connecting / error ---
  return (
    <div className="text-center space-y-3">
      <button
        onClick={startCall}
        disabled={status === "connecting"}
        className="cta-glow group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-display font-bold text-base transition-all btn-lift disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "connecting" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Phone className="h-5 w-5" />
            Talk to Elliot
          </>
        )}
      </button>
      <p className="text-xs text-muted-foreground font-body">
        AI voice consultant — takes ~5 min
      </p>
      {error && <p className="text-sm text-red-400 font-body">{error}</p>}
    </div>
  );
}
