"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Layers, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === "signup") {
      const { error } = await signUp(email, password);
      setLoading(false);
      if (error) {
        setError(error);
      } else {
        setSuccess("Check your email to confirm your account, then sign in.");
        setMode("signin");
      }
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        setError(error);
      } else {
        router.push("/");
      }
    }
  }

  return (
    <div className="min-h-screen landing-grid flex items-center justify-center px-4">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-background/70 backdrop-blur-2xl border-b border-border/10 z-50 flex items-center">
        <div className="max-w-5xl mx-auto px-6 w-full flex items-center">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-primary/10 ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground text-base tracking-tight">
              AI<span className="text-primary">ToolPlanner</span>
            </span>
          </a>
        </div>
      </nav>

      {/* Ambient glow */}
      <div className="hero-orbs" />

      <div className="relative w-full max-w-md animate-hero-reveal">
        {/* Card */}
        <div className="border-gradient rounded-2xl">
          <div className="rounded-[calc(1.25rem-1px)] bg-card/60 backdrop-blur-sm p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center mx-auto mb-4">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-xl font-display font-bold text-foreground">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-sm text-muted-foreground font-body">
                {mode === "signin"
                  ? "Sign in to access your AI business dashboard."
                  : "Sign up to build your AI automation stack."}
              </p>
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={async () => {
                setError(null);
                const { error } = await signInWithGoogle();
                if (error) setError(error);
              }}
              className="w-full h-12 rounded-xl border border-border/20 bg-background/40 font-body font-medium text-sm btn-lift flex items-center justify-center gap-3 hover:bg-background/60 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/15" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card/60 px-3 text-muted-foreground/60 font-body">or</span>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                <p className="text-sm text-red-400 font-body">{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <p className="text-sm text-emerald-400 font-body">{success}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground/70 font-body block mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="w-full bg-background/30 border border-border/15 rounded-xl pl-10 pr-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground/70 font-body block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
                    required
                    minLength={6}
                    className="w-full bg-background/30 border border-border/15 rounded-xl pl-10 pr-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-foreground text-background font-body font-semibold text-sm btn-lift disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {mode === "signin" ? "Sign In" : "Create Account"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle */}
            <div className="text-center">
              <button
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError(null);
                  setSuccess(null);
                }}
                className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors"
              >
                {mode === "signin" ? (
                  <>Don&apos;t have an account? <span className="text-primary font-medium">Sign up</span></>
                ) : (
                  <>Already have an account? <span className="text-primary font-medium">Sign in</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
