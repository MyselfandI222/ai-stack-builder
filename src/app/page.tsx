"use client";

import { useState } from "react";
import { BusinessInput } from "@/components/business-input";
import { ResultsDashboard } from "@/components/results-dashboard";
import { AnalyzeResponse, StackRecommendation } from "@/types";
import { saveDashboardData } from "@/lib/dashboard-storage";
import { Layers } from "lucide-react";

export default function Home() {
  const [businessIdea, setBusinessIdea] = useState("");
  const [budget, setBudget] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StackRecommendation | null>(null);
  const [rawAnswers, setRawAnswers] = useState<Record<string, unknown>>({});

  async function handleGenerate(
    ideaOverride?: string,
    budgetOverride?: number,
    answers?: Record<string, unknown>
  ) {
    const idea = ideaOverride || businessIdea;
    const useBudget = budgetOverride ?? budget;
    setBudget(useBudget);
    if (answers) setRawAnswers(answers);
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessIdea: idea, budget: useBudget }),
      });

      const data: AnalyzeResponse = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data.data);
      // Save to localStorage for the dashboard
      saveDashboardData(data.data, answers || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border/20 z-50 flex items-center">
        <div className="max-w-3xl mx-auto px-6 w-full flex items-center">
          <a href="/" className="flex items-center gap-2 group">
            <Layers className="h-5 w-5 text-primary transition-opacity group-hover:opacity-80" />
            <span className="font-display font-bold text-foreground text-base tracking-tight">
              AI<span className="text-primary">Stack</span>
            </span>
          </a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-12">
        {!result ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative text-center space-y-4 py-4">
              <div className="hero-orbs" />

              <h1 className="animate-hero-reveal-delay-1 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
                Build Your AI{" "}
                <span className="gradient-text">Automation Stack</span>
              </h1>

              <p className="animate-hero-reveal-delay-2 text-base sm:text-lg font-body text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Answer a few questions about your business and get a complete
                operations playbook with a budget-optimized AI tool stack.
              </p>
            </div>

            {/* Input Section */}
            <BusinessInput
              value={businessIdea}
              onChange={setBusinessIdea}
              onSubmit={(combined, b, answers) => handleGenerate(combined, b, answers)}
              isLoading={isLoading}
            />

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground font-body">
                    AI is analyzing your business and building a custom plan...
                  </p>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 rounded-xl animate-shimmer" />
                  ))}
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-sm text-red-400 font-body">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <ResultsDashboard result={result} budget={budget} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-muted-foreground font-body">
          <span>AIStack</span>
          <span>Tool prices are estimates based on standard plans.</span>
        </div>
      </footer>
    </div>
  );
}
