"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { VapiCallButton } from "@/components/vapi-call-button";
import { loadDashboardData } from "@/lib/dashboard-storage";
import {
  Layers,
  LayoutDashboard,
  Settings,
  Sparkles,
  Mic,
  Brain,
  Rocket,
  BookOpen,
  Wrench,
  Calendar,
  GraduationCap,
  Zap,
  Clock,
  ChevronRight,
  MessageSquare,
  BarChart3,
  Target,
  Activity,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

const BUSINESS_TYPES = [
  "SaaS",
  "Ecommerce",
  "Agencies",
  "Freelancers",
  "Content Creators",
  "Service Businesses",
  "Marketplaces",
  "Non-Profits",
];

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewProject = searchParams.get("new") === "1";
  const { user, loading: authLoading } = useAuth();
  const [checkingSaved, setCheckingSaved] = useState(false);

  const pendingHandled = useRef(false);
  useEffect(() => {
    if (authLoading || !user || pendingHandled.current) return;
    if (isNewProject) {
      pendingHandled.current = true;
      return;
    }
    pendingHandled.current = true;
    setCheckingSaved(true);
    loadDashboardData()
      .then((data) => {
        if (data) router.push("/dashboard");
        else setCheckingSaved(false);
      })
      .catch(() => setCheckingSaved(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  return (
    <div className="min-h-screen landing-grid">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-background/70 backdrop-blur-2xl border-b border-border/10 z-50 flex items-center">
        <div className="max-w-5xl mx-auto px-6 w-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-primary/10 ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground text-base tracking-tight">
              AI<span className="text-primary">ToolPlanner</span>
            </span>
          </a>
          {user ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 font-body transition-all"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={() => router.push("/settings")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 font-body transition-all"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/auth")}
              className="px-5 py-2 rounded-lg bg-foreground/5 border border-border/30 text-foreground/80 hover:text-foreground hover:bg-foreground/10 font-body font-medium text-sm transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        {checkingSaved ? (
          <div className="flex items-center justify-center py-20">
            <div className="space-y-3 text-center">
              <Sparkles className="h-8 w-8 text-primary mx-auto animate-pulse" />
              <p className="text-muted-foreground font-body">Loading your dashboard...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-24">
            {/* ===== HERO ===== */}
            <section className="relative text-center space-y-8 pt-8 pb-4">
              <div className="hero-orbs" />

              <div className="animate-hero-reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 animate-badge-float">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-body font-medium text-primary/80">
                  AI-Powered Business Intelligence
                </span>
              </div>

              <h1 className="animate-hero-reveal-delay-1 font-display text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] font-extrabold tracking-[-0.03em] leading-[1.05]">
                Build Your Complete{" "}
                <br className="hidden sm:block" />
                <span className="gradient-text">AI Business Stack</span>
              </h1>

              <p className="animate-hero-reveal-delay-2 text-lg sm:text-xl font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                One voice conversation with Elliot, our AI consultant.
                <br className="hidden sm:block" />
                <span className="text-foreground/70">
                  Five minutes to a custom playbook, tool stack, and action plan.
                </span>
              </p>

              {/* Business type tags */}
              <div className="animate-hero-reveal-delay-2 flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                {BUSINESS_TYPES.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 rounded-full text-xs font-body text-muted-foreground/70 border border-border/15 bg-card/30"
                  >
                    {type}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="animate-hero-reveal-delay-3 hero-spotlight pt-4">
                <div className="border-gradient inline-block p-8 sm:p-10">
                  <VapiCallButton />
                </div>
              </div>
            </section>

            {/* ===== MEET ELLIOT ===== */}
            <section className="max-w-2xl mx-auto">
              <div className="relative rounded-2xl border border-border/15 bg-card/40 backdrop-blur-sm p-8 sm:p-10 overflow-hidden">
                {/* Subtle glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.03] rounded-full blur-[80px] pointer-events-none" />

                <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  {/* Avatar */}
                  <div className="shrink-0">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-primary/20 ring-1 ring-white/10 flex items-center justify-center">
                        <MessageSquare className="h-8 w-8 text-emerald-400" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-card flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-display font-bold text-foreground text-lg">
                        Meet Elliot
                      </h3>
                      <p className="text-xs text-emerald-400/80 font-body font-medium">
                        AI Business Consultant
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed">
                      Elliot is your AI consultant who learns your business through
                      a natural voice conversation. He asks the right questions about
                      your model, goals, budget, and challenges — then builds a
                      personalized stack from 60+ AI tools. No forms. No typing. Just
                      talk.
                    </p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-1">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 font-body">
                        <Clock className="h-3 w-3" /> 5 min call
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 font-body">
                        <Mic className="h-3 w-3" /> Voice only
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 font-body">
                        <Zap className="h-3 w-3" /> Instant results
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="space-y-10">
              <div className="text-center space-y-3">
                <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-primary/60">
                  Process
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  Three Steps to Your Stack
                </h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 sm:gap-4">
                {[
                  {
                    step: "01",
                    icon: Mic,
                    title: "Talk to Elliot",
                    desc: "A natural voice conversation about your business, goals, and challenges. No forms, no typing.",
                    glow: "glow-emerald",
                    color: "text-emerald-400",
                    connector: true,
                  },
                  {
                    step: "02",
                    icon: Brain,
                    title: "AI Analysis",
                    desc: "Our engine evaluates 60+ tools, matches your needs, and builds a complete business strategy.",
                    glow: "glow-primary",
                    color: "text-primary",
                    connector: true,
                  },
                  {
                    step: "03",
                    icon: Rocket,
                    title: "Your Dashboard",
                    desc: "Business plan, optimized tool stack, 90-day roadmap, and setup guides — ready in seconds.",
                    glow: "glow-violet",
                    color: "text-violet-400",
                    connector: false,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.step}
                      className={`relative card-glow ${item.glow} rounded-2xl border border-border/15 bg-card/60 backdrop-blur-sm p-6 space-y-5 ${item.connector ? "step-connector" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-4xl font-display font-extrabold text-foreground/8 leading-none">
                          {item.step}
                        </span>
                        <div className="p-2.5 rounded-xl bg-background/60 ring-1 ring-border/20">
                          <Icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-foreground text-lg mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-body leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ===== WHAT YOU GET ===== */}
            <section className="space-y-10">
              <div className="text-center space-y-3">
                <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-primary/60">
                  Deliverables
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  Everything You Need to Launch
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: BookOpen,
                    title: "Full Business Plan",
                    desc: "Executive summary, revenue strategy, growth playbook, department guides, team recommendations, and risk analysis.",
                    color: "text-primary",
                    bg: "bg-primary/8",
                    glow: "210 100% 62%",
                  },
                  {
                    icon: Wrench,
                    title: "AI Tool Stack",
                    desc: "Budget-optimized selection from 60+ tools. Each with pros, cons, pricing, and why it fits your business.",
                    color: "text-violet-400",
                    bg: "bg-violet-500/8",
                    glow: "265 80% 62%",
                  },
                  {
                    icon: Calendar,
                    title: "90-Day Action Plan",
                    desc: "Week-by-week prioritized roadmap with clear milestones, organized by department and urgency.",
                    color: "text-sky-400",
                    bg: "bg-sky-500/8",
                    glow: "199 89% 48%",
                  },
                  {
                    icon: GraduationCap,
                    title: "Setup Guides",
                    desc: "Step-by-step tutorials for every tool — click-by-click instructions, action badges, and video walkthroughs.",
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/8",
                    glow: "160 84% 44%",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="feature-card group flex gap-5 p-6 rounded-2xl border border-border/15 bg-card/40 backdrop-blur-sm"
                      style={{ "--glow-color": item.glow } as React.CSSProperties}
                    >
                      <div
                        className={`shrink-0 p-3.5 rounded-2xl ${item.bg} ring-1 ring-white/5 h-fit group-hover:ring-white/10 transition-all`}
                      >
                        <Icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-foreground mb-1.5 flex items-center gap-2">
                          {item.title}
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 group-hover:translate-x-0.5 transition-all" />
                        </h3>
                        <p className="text-sm text-muted-foreground font-body leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ===== STATS ===== */}
            <section>
              <div className="grid grid-cols-3 gap-px rounded-2xl overflow-hidden border border-border/15 bg-border/10">
                {[
                  {
                    icon: Zap,
                    value: "60+",
                    label: "AI Tools Analyzed",
                    color: "text-amber-400",
                  },
                  {
                    icon: BarChart3,
                    value: "8",
                    label: "Business Categories",
                    color: "text-emerald-400",
                  },
                  {
                    icon: Clock,
                    value: "~5 min",
                    label: "To Your Full Plan",
                    color: "text-sky-400",
                  },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="bg-card/60 backdrop-blur-sm p-8 text-center space-y-3"
                    >
                      <Icon className={`h-5 w-5 ${stat.color} mx-auto`} />
                      <p className="text-3xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground font-body tracking-wide uppercase">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ===== DASHBOARD PREVIEW ===== */}
            <section className="space-y-10">
              <div className="text-center space-y-3">
                <p className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-primary/60">
                  Preview
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  What Your Dashboard Looks Like
                </h2>
                <p className="text-muted-foreground font-body max-w-lg mx-auto">
                  After your call with Elliot, everything lands in a personalized
                  dashboard you can explore, edit, and export.
                </p>
              </div>

              {/* Mock dashboard */}
              <div className="rounded-2xl border border-border/20 bg-card/30 backdrop-blur-sm overflow-hidden">
                {/* Mock nav */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/15 bg-card/60">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-background/40 border border-border/10">
                      <Layers className="h-3 w-3 text-primary/50" />
                      <span className="text-[10px] text-muted-foreground/50 font-body">aistack.app/dashboard</span>
                    </div>
                  </div>
                </div>

                {/* Mock content */}
                <div className="p-6 grid grid-cols-12 gap-4">
                  {/* Sidebar mock */}
                  <div className="col-span-3 hidden sm:block space-y-2">
                    {[
                      { icon: BookOpen, label: "Business Plan", color: "text-primary", active: true },
                      { icon: Wrench, label: "Tool Stack", color: "text-violet-400", active: false },
                      { icon: Activity, label: "Operations", color: "text-emerald-400", active: false },
                      { icon: TrendingUp, label: "Growth", color: "text-pink-400", active: false },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-body ${
                            item.active
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "text-muted-foreground/40"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {item.label}
                        </div>
                      );
                    })}
                  </div>

                  {/* Main content mock */}
                  <div className="col-span-12 sm:col-span-9 space-y-3">
                    {/* Title bar */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="h-4 w-32 rounded bg-foreground/10" />
                        <div className="h-2.5 w-48 rounded bg-foreground/5 mt-1.5" />
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-border/15 bg-background/30 p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-3.5 w-3.5 text-amber-400/60" />
                          <div className="h-3 w-24 rounded bg-foreground/8" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-2 w-full rounded bg-foreground/5" />
                          <div className="h-2 w-4/5 rounded bg-foreground/5" />
                          <div className="h-2 w-3/5 rounded bg-foreground/5" />
                        </div>
                      </div>
                      <div className="rounded-xl border border-border/15 bg-background/30 p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-400/60" />
                          <div className="h-3 w-28 rounded bg-foreground/8" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-2 w-full rounded bg-foreground/5" />
                          <div className="h-2 w-3/4 rounded bg-foreground/5" />
                          <div className="h-2 w-5/6 rounded bg-foreground/5" />
                        </div>
                      </div>
                    </div>

                    {/* Tool row */}
                    <div className="flex gap-2">
                      {["ChatGPT", "Notion", "Mailchimp", "Canva"].map((t) => (
                        <div
                          key={t}
                          className="px-2.5 py-1.5 rounded-lg border border-border/15 bg-background/20 text-[10px] text-muted-foreground/40 font-body"
                        >
                          {t}
                        </div>
                      ))}
                      <div className="px-2.5 py-1.5 text-[10px] text-muted-foreground/30 font-body">
                        +8 more
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ===== BOTTOM CTA ===== */}
            <section className="relative text-center space-y-6 py-8">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[600px] h-[300px] bg-primary/[0.04] rounded-full blur-[100px]" />
              </div>
              <h2 className="relative font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Ready to Build Your Stack?
              </h2>
              <p className="relative text-muted-foreground font-body max-w-lg mx-auto leading-relaxed">
                One conversation with Elliot. A complete AI-powered business
                plan and tool stack, custom-fit to your goals and budget.
              </p>
              <div className="relative">
                <VapiCallButton />
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/10">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-muted-foreground/60 font-body">
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-primary/40" />
            <span>AI Tool Planner</span>
          </div>
          <span>Tool prices are estimates based on standard plans.</span>
        </div>
      </footer>
    </div>
  );
}
