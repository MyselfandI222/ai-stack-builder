"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { saveDashboardData } from "@/lib/dashboard-storage";
import { AnalyzeResponse } from "@/types";
import {
  Layers,
  Sparkles,
  BarChart3,
  Wrench,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const STEPS = [
  { label: "Analyzing your business model...", icon: BarChart3 },
  { label: "Identifying automation opportunities...", icon: TrendingUp },
  { label: "Selecting the best AI tools...", icon: Wrench },
  { label: "Building your custom playbook...", icon: Calendar },
  { label: "Finalizing your dashboard...", icon: CheckCircle2 },
];

export default function GeneratingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  // Cycle through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Run the analysis
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth");
      return;
    }
    if (started.current) return;
    started.current = true;

    const raw = sessionStorage.getItem("vapi-answers");
    if (!raw) {
      router.push("/");
      return;
    }
    sessionStorage.removeItem("vapi-answers");

    const params = JSON.parse(raw);

    // If this is a fallback (no structured data from Vapi), still try to analyze
    // with a generic prompt — the conversation happened, we just missed the structured data
    if (params._fallback) {
      (async () => {
        try {
          const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              businessIdea: "General business consultation completed via voice call",
              budget: 500,
              answers: {},
            }),
          });
          const data: AnalyzeResponse = await response.json();
          if (!data.success || !data.data) {
            throw new Error(data.error || "Analysis failed");
          }
          await saveDashboardData(data.data, {});
          router.push("/dashboard");
        } catch (err) {
          setError("Something went wrong. Please try the call again.");
        }
      })();
      return;
    }

    const businessIdea = String(params.description || "");
    const budget = Number(params.budget) || 500;
    const { description: _d, budget: _b, ...answers } = params;

    (async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessIdea, budget, answers }),
        });

        const data: AnalyzeResponse = await response.json();

        if (!data.success || !data.data) {
          throw new Error(data.error || "Analysis failed");
        }

        await saveDashboardData(data.data, answers);
        router.push("/dashboard");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      }
    })();
  }, [user, authLoading, router]);

  return (
    <div className="min-h-screen landing-grid flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-background/70 backdrop-blur-2xl border-b border-border/10 z-50 flex items-center">
        <div className="max-w-5xl mx-auto px-6 w-full">
          <a href="/" className="flex items-center gap-2.5 group w-fit">
            <div className="p-1.5 rounded-lg bg-primary/10 ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground text-base tracking-tight">
              AI<span className="text-primary">ToolPlanner</span>
            </span>
          </a>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 pt-16">
        {error ? (
          <div className="max-w-md w-full text-center space-y-4 animate-hero-reveal">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 space-y-4">
              <p className="text-sm text-red-400 font-body">{error}</p>
              <button
                onClick={() => router.push("/?new=1")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-body font-semibold text-sm btn-lift"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-3xl mx-auto space-y-10">
            {/* Header */}
            <div className="text-center space-y-3 animate-hero-reveal">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: "2s" }} />
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 ring-1 ring-primary/20">
                  <Sparkles className="h-7 w-7 text-primary animate-pulse" />
                </div>
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Building Your AI Plan
              </h1>
              <p className="text-sm text-muted-foreground font-body">
                Crafting your personalized dashboard — this takes about ten seconds
              </p>
            </div>

            {/* Progress steps */}
            <div className="space-y-2 animate-hero-reveal-delay-1">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const done = i < stepIndex;
                const active = i === stepIndex;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${
                      active
                        ? "bg-primary/5 ring-1 ring-primary/20"
                        : done
                        ? "opacity-60"
                        : "opacity-20"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-500 ${
                        done
                          ? "bg-emerald-500/10"
                          : active
                          ? "bg-primary/10"
                          : "bg-foreground/5"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      )}
                    </div>
                    <span
                      className={`text-sm font-body transition-colors duration-500 ${
                        active ? "text-foreground" : done ? "text-muted-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                    {active && (
                      <div className="ml-auto flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Skeleton dashboard preview */}
            <div className="rounded-2xl border border-border/15 bg-card/30 p-6 space-y-5 animate-hero-reveal-delay-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400/50" />
                <span className="text-xs text-muted-foreground/60 font-body">Dashboard preview</span>
              </div>

              {/* Skeleton stat cards */}
              <div className="grid grid-cols-3 gap-3">
                {[DollarSign, Wrench, TrendingUp].map((Icon, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border border-border/10 bg-background/30 p-4 space-y-2 transition-all duration-700 ${
                      stepIndex > i + 1 ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground/30" />
                    <div
                      className={`h-5 rounded-md ${
                        stepIndex > i + 1 ? "bg-foreground/8 w-16" : "animate-shimmer w-20"
                      }`}
                    />
                    <div className="h-3 rounded bg-foreground/4 w-12" />
                  </div>
                ))}
              </div>

              {/* Skeleton tool list */}
              <div className="space-y-2">
                <div className="h-3 rounded bg-foreground/4 w-24 mb-3" />
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border border-border/8 bg-background/20 transition-all duration-700 ${
                      stepIndex > 2 ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${stepIndex > 2 ? "bg-foreground/6" : "animate-shimmer"}`} />
                    <div className="flex-1 space-y-1.5">
                      <div className={`h-3 rounded ${stepIndex > 2 ? "bg-foreground/8 w-32" : "animate-shimmer w-24"}`} />
                      <div className="h-2 rounded bg-foreground/3 w-48" />
                    </div>
                    <div className={`h-4 rounded ${stepIndex > 2 ? "bg-foreground/6 w-14" : "animate-shimmer w-12"}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
