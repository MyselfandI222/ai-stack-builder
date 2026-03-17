"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Mic, MicOff, Phone, PhoneOff, Loader2, MessageSquare } from "lucide-react";

type CallStatus = "idle" | "connecting" | "active" | "error";

function extractSubmitAnswers(message: any): Record<string, unknown> | null {
  // Format 1: function-call
  if (message.type === "function-call" && message.functionCall?.name === "submitAnswers") {
    return message.functionCall.parameters || {};
  }

  // Format 2: tool-calls with toolCallList
  if (message.type === "tool-calls" && message.toolCallList) {
    for (const toolCall of message.toolCallList) {
      if (toolCall.function?.name === "submitAnswers") {
        const args = toolCall.function.arguments;
        if (typeof args === "string") return JSON.parse(args || "{}");
        if (typeof args === "object" && args !== null) return args;
        return {};
      }
    }
  }

  // Format 3: tool-calls with toolCalls array
  if (message.type === "tool-calls" && message.toolCalls) {
    for (const toolCall of message.toolCalls) {
      if (toolCall.function?.name === "submitAnswers") {
        const args = toolCall.function.arguments;
        if (typeof args === "string") return JSON.parse(args || "{}");
        if (typeof args === "object" && args !== null) return args;
        return {};
      }
    }
  }

  // Format 4: Direct tool-call (singular)
  if (message.type === "tool-call" && message.function?.name === "submitAnswers") {
    const args = message.function.arguments;
    if (typeof args === "string") return JSON.parse(args || "{}");
    if (typeof args === "object" && args !== null) return args;
    return {};
  }

  // Format 5: Check for submitAnswers anywhere in the message via deep search
  const str = JSON.stringify(message);
  if (str.includes("submitAnswers")) {
    // Try to find parameters/arguments in common locations
    const fc = message.functionCall || message.function_call || message.toolCall?.function;
    if (fc?.parameters) return typeof fc.parameters === "string" ? JSON.parse(fc.parameters) : fc.parameters;
    if (fc?.arguments) return typeof fc.arguments === "string" ? JSON.parse(fc.arguments) : fc.arguments;

    // Last resort: look for an object with business-like keys
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

export function VapiCallButton() {
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
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
      if (vapiRef.current) {
        try { vapiRef.current.stop(); } catch {}
        vapiRef.current = null;
      }
      if (timerRef.current) clearInterval(timerRef.current);
      setStatus("idle");
      router.push("/generating");
    },
    [router]
  );

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

        if (submittedRef.current) return; // already redirecting

        // If the call was long enough, Elliot likely collected answers
        // but we missed the tool call — redirect anyway
        if (secondsRef.current >= 45) {
          console.log("[Vapi] Call was long enough, checking stored messages for data...");
          // Try one more time to find submitAnswers in all messages
          for (const msg of allMessagesRef.current) {
            try {
              const params = extractSubmitAnswers(msg);
              if (params) {
                handleSubmitAnswers(params);
                return;
              }
            } catch {}
          }
          // No structured data found, but call was substantial
          // Save transcript as fallback so generating page can use it
          console.log("[Vapi] No structured data found, redirecting with transcript fallback");
          submittedRef.current = true;
          sessionStorage.setItem("vapi-answers", JSON.stringify({ _fallback: true }));
          setStatus("idle");
          router.push("/generating");
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

        if (message.type === "transcript" && message.transcriptType === "final") {
          setTranscript(message.transcript);

          // Detect Elliot's closing phrases — means he's done collecting info
          const lower = (message.transcript || "").toLowerCase();
          const closingPhrases = [
            "thanks for running through this",
            "thank you for running through this",
            "i have everything i need",
            "have everything i need",
            "that's all i need",
            "that's everything i need",
            "i'll put together",
            "i'll get started on",
            "let me put this together",
            "let me build",
            "great talking with you",
            "nice talking with you",
          ];
          const isClosing = closingPhrases.some((phrase) => lower.includes(phrase));
          if (isClosing && !submittedRef.current && secondsRef.current >= 30) {
            console.log("[Vapi] Detected closing phrase, redirecting...");
            // Try to find submitAnswers in stored messages first
            for (const msg of allMessagesRef.current) {
              try {
                const p = extractSubmitAnswers(msg);
                if (p) { handleSubmitAnswers(p); return; }
              } catch {}
            }
            // No structured data but Elliot clearly finished — redirect with fallback
            submittedRef.current = true;
            sessionStorage.setItem("vapi-answers", JSON.stringify({ _fallback: true }));
            if (vapiRef.current) {
              try { vapiRef.current.stop(); } catch {}
              vapiRef.current = null;
            }
            if (timerRef.current) clearInterval(timerRef.current);
            setStatus("idle");
            router.push("/generating");
            return;
          }
        }

        // Detect end-of-call-report — means call is definitely over
        if (message.type === "end-of-call-report") {
          console.log("[Vapi] End of call report received");
          if (!submittedRef.current && secondsRef.current >= 45) {
            // Search all messages one more time
            for (const msg of allMessagesRef.current) {
              try {
                const p = extractSubmitAnswers(msg);
                if (p) { handleSubmitAnswers(p); return; }
              } catch {}
            }
            // Fallback redirect
            submittedRef.current = true;
            sessionStorage.setItem("vapi-answers", JSON.stringify({ _fallback: true }));
            if (timerRef.current) clearInterval(timerRef.current);
            setStatus("idle");
            router.push("/generating");
          }
          return;
        }

        // Detect hang event
        if (message.type === "hang") {
          console.log("[Vapi] Hang detected");
          if (!submittedRef.current) {
            if (timerRef.current) clearInterval(timerRef.current);
            setStatus("idle");
          }
          return;
        }

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
        if (timerRef.current) clearInterval(timerRef.current);
        setError("Call error. Please check your microphone and try again.");
        setStatus("error");
      });

      vapi.start(assistantId);
    } catch (err) {
      console.error("Failed to start Vapi call:", err);
      setError("Failed to start call. Check microphone permissions.");
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

    // If the call was long enough, try to extract data and redirect
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
      // No structured data but call was substantial — redirect with fallback
      submittedRef.current = true;
      sessionStorage.setItem("vapi-answers", JSON.stringify({ _fallback: true }));
      setStatus("idle");
      router.push("/generating");
      return;
    }

    setStatus("idle");
  }, [handleSubmitAnswers, router]);

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
