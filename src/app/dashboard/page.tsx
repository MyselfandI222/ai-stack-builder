"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { loadDashboardData, updatePlanEdits } from "@/lib/dashboard-storage";
import { DASHBOARD_PANELS } from "@/lib/dashboard-features";
import { generatePanelData, worstStatus } from "@/lib/dashboard-panel-insights";
import { businessPlanToMarkdown, toolStackToMarkdown } from "@/lib/export-utils";
import { CategorySection } from "@/components/category-section";
import { BudgetProgress } from "@/components/budget-progress";
import { EditableSection } from "@/components/editable-section";
import { OperationsOverview } from "@/components/panels/operations-overview";
import { GrowthMarketing } from "@/components/panels/growth-marketing";
import { AutomationHub } from "@/components/panels/automation-hub";
import { StrategyCompetition } from "@/components/panels/strategy-competition";
import {
  SavedDashboardData,
  SelectedTool,
  ToolCategory,
  CATEGORY_LABELS,
  DashboardPanelId,
  BusinessPlanEdits,
  PlaybookSection,
  ActionItem,
} from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  TrendingUp,
  Workflow,
  Radar,
  Layers,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Wrench,
  Lightbulb,
  Rocket,
  Target,
  Calendar,
  BarChart3,
  AlertTriangle,
  Download,
  RotateCcw,
  Copy,
  CheckCheck,
  Users,
  Settings,
  Plus,
  DollarSign,
  Megaphone,
  Palette,
  Headphones,
  FolderKanban,
  Code2,
} from "lucide-react";

// === View type ===

type ActiveView = DashboardPanelId | "business-plan" | "tool-stack";

// === Icon & color lookups for panels ===

const PANEL_ICONS: Record<string, typeof Activity> = {
  Activity, TrendingUp, Workflow, Radar,
};

const PANEL_COLORS: Record<string, { bg: string; text: string; sidebar: string; accent: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", sidebar: "bg-emerald-500/[0.08] border-emerald-500/30", accent: "bg-emerald-500/20" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-400", sidebar: "bg-pink-500/[0.08] border-pink-500/30", accent: "bg-pink-500/20" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-400", sidebar: "bg-sky-500/[0.08] border-sky-500/30", accent: "bg-sky-500/20" },
  red: { bg: "bg-red-500/10", text: "text-red-400", sidebar: "bg-red-500/[0.08] border-red-500/30", accent: "bg-red-500/20" },
};

const GLOW_MAP: Record<string, string> = {
  emerald: "glow-emerald", pink: "glow-pink", sky: "glow-sky", red: "glow-red",
};

// === Category icon & dot color lookups ===

const CATEGORY_ICON_MAP: Record<ToolCategory, typeof Activity> = {
  marketing: Megaphone,
  "content-creation": Palette,
  "customer-support": Headphones,
  operations: Settings,
  sales: TrendingUp,
  admin: FolderKanban,
  analytics: BarChart3,
  development: Code2,
};

const CATEGORY_DOT_COLORS: Record<ToolCategory, string> = {
  marketing: "bg-rose-400",
  "content-creation": "bg-violet-400",
  "customer-support": "bg-amber-400",
  operations: "bg-emerald-400",
  sales: "bg-blue-400",
  admin: "bg-cyan-400",
  analytics: "bg-indigo-400",
  development: "bg-orange-400",
};

// === Business Plan sub-components ===

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  low: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

const PRIORITY_NODE_COLORS: Record<string, string> = {
  critical: "bg-red-400 ring-red-400/30",
  high: "bg-amber-400 ring-amber-400/30",
  medium: "bg-blue-400 ring-blue-400/30",
  low: "bg-zinc-400 ring-zinc-400/30",
};

function PriorityBadge({ priority }: { priority: string }) {
  return <Badge variant="outline" className={`${PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium} rounded-full text-xs font-body`}>{priority}</Badge>;
}

function PlaybookCard({ section }: { section: PlaybookSection }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-display">{section.department}</CardTitle>
              <PriorityBadge priority={section.priority} />
            </div>
            {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">{section.overview}</p>
        </CardHeader>
      </button>
      {expanded && (
        <CardContent className="pt-0 space-y-4">
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1.5 font-body">First Step</p>
            <p className="text-sm text-foreground/80 font-body">{section.howToStart}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 font-body">Weekly Tasks</p>
            <ul className="space-y-1">{section.weeklyTasks.map((task, i) => <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 font-body"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />{task}</li>)}</ul>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 font-body">Monthly Tasks</p>
            <ul className="space-y-1">{section.monthlyTasks.map((task, i) => <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 font-body"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400/60 shrink-0" />{task}</li>)}</ul>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 font-body">KPIs to Track</p>
            <div className="flex flex-wrap gap-1.5">{section.kpis.map((kpi, i) => <Badge key={i} variant="secondary" className="text-xs rounded-full font-body">{kpi}</Badge>)}</div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function NinetyDayTimeline({ items }: { items: ActionItem[] }) {
  const groups = new Map<string, ActionItem[]>();
  for (const item of items) { const list = groups.get(item.timeline) || []; list.push(item); groups.set(item.timeline, list); }
  const entries = [...groups.entries()];

  return (
    <div className="relative">
      {entries.map(([timeline, tasks], groupIndex) => (
        <div key={timeline} className="relative flex gap-4">
          {/* Vertical line + node */}
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/10 shrink-0 mt-1 z-10" />
            {groupIndex < entries.length - 1 && (
              <div className="w-px flex-1 bg-gradient-to-b from-primary/30 to-border/20 min-h-[2rem]" />
            )}
          </div>

          {/* Content */}
          <div className="pb-6 flex-1">
            <p className="text-sm font-display font-semibold text-foreground mb-2">{timeline}</p>
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-background/30 border border-border/10">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ring-2 ${PRIORITY_NODE_COLORS[task.priority] || PRIORITY_NODE_COLORS.medium}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80 font-body">{task.task}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground font-body">{task.department}</span>
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// === PDF (lazy-loaded) ===

async function handleDownloadPDF(result: SavedDashboardData["result"], budget: number, edits?: BusinessPlanEdits) {
  const { default: jsPDF } = await import("jspdf");
  const { analysis, selectedTools, totalMonthlyCost, budgetUsedPercent } = result;
  const breakdown = analysis.businessBreakdown;
  const get = (field: keyof BusinessPlanEdits, fallback: string) => edits?.[field] || fallback;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  function checkPage(needed: number) { if (y + needed > 270) { doc.addPage(); y = 20; } }
  function heading(text: string) { checkPage(15); doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.text(text, margin, y); y += 10; }
  function subheading(text: string) { checkPage(12); doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text(text, margin, y); y += 8; }
  function body(text: string) { doc.setFontSize(10); doc.setFont("helvetica", "normal"); const lines = doc.splitTextToSize(text, maxWidth); checkPage(lines.length * 5 + 4); doc.text(lines, margin, y); y += lines.length * 5 + 4; }
  function bullet(text: string) { doc.setFontSize(10); doc.setFont("helvetica", "normal"); const lines = doc.splitTextToSize(text, maxWidth - 8); checkPage(lines.length * 5 + 2); doc.text("\u2022", margin + 2, y); doc.text(lines, margin + 8, y); y += lines.length * 5 + 2; }

  doc.setFontSize(22); doc.setFont("helvetica", "bold"); doc.text("AI Tool Planner Business Plan", margin, y); y += 10;
  doc.setFontSize(12); doc.setFont("helvetica", "normal"); doc.text(analysis.businessType, margin, y); y += 6;
  doc.setFontSize(9); doc.text(`Generated ${new Date().toLocaleDateString()} | Budget: $${budget}/mo | Tools: ${selectedTools.length} | Cost: $${totalMonthlyCost}/mo (${budgetUsedPercent}%)`, margin, y); y += 12;

  heading("Executive Summary"); body(get("executiveSummary", breakdown.executiveSummary));
  heading("Revenue Strategy"); body(get("revenueStrategy", breakdown.revenueStrategy));
  heading("Growth Strategy"); body(get("growthStrategy", breakdown.growthStrategy));
  heading("Operations Playbook");
  for (const s of breakdown.operationsPlaybook) {
    subheading(`${s.department} (${s.priority})`); body(s.overview);
    if (s.weeklyTasks.length) { doc.setFontSize(10); doc.setFont("helvetica", "bold"); checkPage(8); doc.text("Weekly:", margin + 4, y); y += 6; for (const t of s.weeklyTasks) bullet(t); }
    if (s.monthlyTasks.length) { doc.setFontSize(10); doc.setFont("helvetica", "bold"); checkPage(8); doc.text("Monthly:", margin + 4, y); y += 6; for (const t of s.monthlyTasks) bullet(t); }
    if (s.kpis.length) { doc.setFontSize(10); doc.setFont("helvetica", "bold"); checkPage(8); doc.text("KPIs:", margin + 4, y); y += 6; for (const k of s.kpis) bullet(k); }
    y += 2;
  }
  heading("90-Day Action Plan"); for (const item of breakdown.ninetyDayPlan) bullet(`[${item.timeline}] ${item.task} — ${item.department} (${item.priority})`);
  heading("Key Metrics"); for (const m of breakdown.keyMetrics) bullet(m);
  heading("Team Recommendations"); body(get("teamRecommendations", breakdown.teamRecommendations));
  if (breakdown.risks.length) { heading("Risks & Pitfalls"); for (const r of breakdown.risks) bullet(r); }
  heading("AI Tool Stack"); doc.setFontSize(10); doc.setFont("helvetica", "normal"); checkPage(8); doc.text(`Total: $${totalMonthlyCost}/mo | Budget used: ${budgetUsedPercent}%`, margin, y); y += 8;
  for (const tool of selectedTools) {
    checkPage(16); doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.text(tool.name, margin + 4, y);
    doc.setFont("helvetica", "normal"); doc.text(`$${tool.monthlyCost}/mo — ${CATEGORY_LABELS[tool.category]}`, margin + 60, y); y += 5;
    const r2 = doc.splitTextToSize(tool.whyRecommended, maxWidth - 8); doc.text(r2, margin + 8, y); y += r2.length * 5 + 4;
  }
  checkPage(20); y += 6; doc.setFontSize(8); doc.setFont("helvetica", "italic"); doc.text("Generated by AI Tool Planner.", margin, y);
  doc.save(`AIToolPlanner-Plan-${analysis.businessType.replace(/\s+/g, "-")}.pdf`);
}

// === Main Page ===

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<SavedDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>("business-plan");
  const [planEdits, setPlanEdits] = useState<BusinessPlanEdits>({});
  const [copied, setCopied] = useState(false);
  const [toolsCopied, setToolsCopied] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth"); return; }
    loadDashboardData().then((saved) => { setData(saved); setPlanEdits(saved?.planEdits || {}); setLoading(false); });
  }, [user, authLoading, router]);

  if (loading) {
    return (
      <div className="min-h-screen landing-grid flex items-center justify-center">
        <div className="space-y-3 text-center animate-hero-reveal">
          <div className="relative mx-auto w-14 h-14">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 ring-1 ring-primary/20">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-muted-foreground font-body">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen landing-grid flex items-center justify-center">
        <div className="animate-hero-reveal">
          <div className="border-gradient rounded-2xl">
            <div className="rounded-[calc(1.25rem-1px)] bg-card/60 backdrop-blur-sm max-w-md w-full mx-4 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center mx-auto">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-display font-bold text-foreground">No Business Data Yet</h2>
              <p className="text-sm text-muted-foreground font-body">Complete the business questionnaire first to unlock your personalized AI dashboard.</p>
              <button onClick={() => router.push("/")} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-body font-semibold text-sm btn-lift">
                <Sparkles className="h-4 w-4" />Start Questionnaire
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { result, answers } = data;
  const { analysis, selectedTools, totalMonthlyCost, budgetUsedPercent, isOverBudget } = result;
  const breakdown = analysis.businessBreakdown;
  const userBudget = (answers.budget as number) || totalMonthlyCost;

  // Tools for each panel
  function getToolsForPanel(panel: (typeof DASHBOARD_PANELS)[0]): SelectedTool[] {
    return selectedTools.filter((t) => panel.toolCategories.includes(t.category as ToolCategory));
  }

  // Tool stack grouping
  const toolsByCategory = new Map<ToolCategory, typeof selectedTools>();
  for (const tool of selectedTools) { const l = toolsByCategory.get(tool.category) || []; l.push(tool); toolsByCategory.set(tool.category, l); }
  const sortedCategories = [...analysis.categories].filter((c) => c.relevanceScore >= 10).sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Health score
  const panelsWithTools = DASHBOARD_PANELS.filter((p) => getToolsForPanel(p).length > 0).length;
  const healthScore = Math.round((panelsWithTools / DASHBOARD_PANELS.length) * 100);

  // Potential cost at scale (free tier tools upgraded to paid)
  const freeToolCount = selectedTools.filter((t) => t.hasFreeTier && t.monthlyCost > 0).length;
  const potentialCost = selectedTools.reduce((sum, t) => sum + t.monthlyCost, 0);

  // Editable plan helpers
  const getEditedField = (field: keyof BusinessPlanEdits, fallback: string) =>
    planEdits[field] || fallback;

  function handlePlanEdit(field: keyof BusinessPlanEdits, value: string) {
    const updated = { ...planEdits, [field]: value };
    setPlanEdits(updated);
    updatePlanEdits({ [field]: value });
  }

  async function handleCopyMarkdown() {
    const md = businessPlanToMarkdown(
      analysis.businessType,
      breakdown,
      selectedTools,
      totalMonthlyCost,
      budgetUsedPercent,
      planEdits
    );
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleCopyToolStack() {
    const md = toolStackToMarkdown(
      analysis.businessType,
      selectedTools,
      totalMonthlyCost,
      budgetUsedPercent,
      analysis.categories
    );
    await navigator.clipboard.writeText(md);
    setToolsCopied(true);
    setTimeout(() => setToolsCopied(false), 2000);
  }

  return (
    <div className="min-h-screen landing-grid flex flex-col">
      {/* Nav — matches homepage premium style */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-background/70 backdrop-blur-2xl border-b border-border/10 z-50 flex items-center">
        <div className="w-full px-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-primary/10 ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground text-base tracking-tight">AI<span className="text-primary">ToolPlanner</span></span>
          </a>
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground font-body hidden sm:block">
              <span className="gradient-text font-medium">{analysis.businessType}</span>
            </p>
            <Button variant="outline" size="sm" className="border-border/20 bg-background/30 h-8 hover:bg-background/50" onClick={handleCopyMarkdown}>
              {copied ? <CheckCheck className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
              {copied ? "Copied!" : "Copy MD"}
            </Button>
            <Button variant="outline" size="sm" className="border-border/20 bg-background/30 h-8 hover:bg-background/50" onClick={() => handleDownloadPDF(result, userBudget, planEdits)}>
              <Download className="h-3.5 w-3.5 mr-1.5" />PDF
            </Button>
            <button onClick={() => router.push("/?new=1")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 font-body transition-all" title="New project">
              <Plus className="h-4 w-4" /><span className="hidden sm:inline">New</span>
            </button>
            <button onClick={() => router.push("/settings")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 font-body transition-all" title="Settings">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 pt-16">
        {/* === Sidebar === */}
        <aside className="fixed top-16 left-0 bottom-0 w-72 border-r border-border/10 bg-background/40 backdrop-blur-2xl overflow-y-auto z-40 hidden lg:block">
          <div className="p-4 space-y-1">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4 px-1">
              <div className="flex flex-col items-center p-2.5 rounded-xl bg-card/40 border border-border/10">
                <div className="relative w-10 h-10 mb-1">
                  <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(160 84% 44% / 0.08)" strokeWidth="10" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(160 84% 44%)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - healthScore / 100)}`} className="transition-all duration-1000 ease-out" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-display font-bold text-emerald-400">{healthScore}%</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-body">Score</p>
              </div>
              <div className="flex flex-col items-center p-2.5 rounded-xl bg-card/40 border border-border/10">
                <p className="text-lg font-display font-bold text-primary">{selectedTools.length}</p>
                <p className="text-[10px] text-muted-foreground font-body">Tools</p>
              </div>
              <div className="flex flex-col items-center p-2.5 rounded-xl bg-card/40 border border-border/10">
                <p className="text-lg font-display font-bold text-cyan-400">${totalMonthlyCost}</p>
                <p className="text-[10px] text-muted-foreground font-body">Monthly</p>
                {potentialCost > totalMonthlyCost && (
                  <p className="text-[9px] text-amber-400 font-body mt-0.5">up to ${potentialCost}</p>
                )}
              </div>
            </div>

            {/* Your Plan */}
            <p className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider px-3 pt-1 pb-2 font-body">Your Plan</p>

            <SidebarButton active={activeView === "business-plan"} onClick={() => setActiveView("business-plan")} icon={<BookOpen className={`h-4 w-4 ${activeView === "business-plan" ? "text-primary" : "text-muted-foreground"}`} />} label="Business Plan" color="primary" />
            <SidebarButton active={activeView === "tool-stack"} onClick={() => setActiveView("tool-stack")} icon={<Wrench className={`h-4 w-4 ${activeView === "tool-stack" ? "text-violet-400" : "text-muted-foreground"}`} />} label="AI Tool Stack" color="violet" />

            <div className="h-px bg-border/10 mx-1 my-2" />

            {/* Panels */}
            <p className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider px-3 pt-1 pb-2 font-body">Insights</p>
            {DASHBOARD_PANELS.map((panel) => {
              const Icon = PANEL_ICONS[panel.icon] || Activity;
              const colors = PANEL_COLORS[panel.color] || PANEL_COLORS.emerald;
              const isActive = activeView === panel.id;
              const panelTools = getToolsForPanel(panel);
              const sections = generatePanelData(panel.id, answers, panelTools);
              const status = worstStatus(sections);

              return (
                <button key={panel.id} onClick={() => setActiveView(panel.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${isActive ? `${colors.sidebar} border` : "hover:bg-card/40 border border-transparent"}`}>
                  <div className={`p-2 rounded-lg ${isActive ? colors.bg : "bg-card/40"} ring-1 ${isActive ? "ring-white/10" : "ring-white/5"} transition-all`}>
                    <Icon className={`h-4 w-4 ${isActive ? colors.text : "text-muted-foreground"} transition-colors`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-body font-medium truncate transition-colors ${isActive ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"}`}>{panel.title}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {status === "warning" && <AlertCircle className="h-3 w-3 text-amber-400" />}
                    {status === "action" && <Clock className="h-3 w-3 text-blue-400" />}
                    {isActive && <ChevronRight className={`h-3.5 w-3.5 ${colors.text}`} />}
                  </div>
                </button>
              );
            })}

            <div className="h-px bg-border/10 mx-1 my-2" />

            {/* Stack mini — improved with category dots */}
            <div className="px-3 py-2">
              <p className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider pb-3 font-body">Your Stack</p>
              <div className="space-y-1">
                {selectedTools.slice(0, 10).map((tool) => (
                  <a key={tool.id} href={tool.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-card/40 transition-all group">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${CATEGORY_DOT_COLORS[tool.category] || "bg-foreground/30"}`} />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground font-body truncate transition-colors">{tool.name}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground/0 group-hover:text-muted-foreground/50 ml-auto shrink-0 transition-all" />
                  </a>
                ))}
                {selectedTools.length > 10 && <p className="text-[11px] text-muted-foreground/40 font-body px-2 pt-1">+{selectedTools.length - 10} more</p>}
              </div>
            </div>
          </div>
        </aside>

        {/* === Mobile Header === */}
        <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-background/70 backdrop-blur-2xl border-b border-border/10">
          <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
            <MobileTab active={activeView === "business-plan"} onClick={() => setActiveView("business-plan")} icon={<BookOpen className="h-3.5 w-3.5" />} label="Plan" color="primary" />
            <MobileTab active={activeView === "tool-stack"} onClick={() => setActiveView("tool-stack")} icon={<Wrench className="h-3.5 w-3.5" />} label="Tools" color="violet" />
            {DASHBOARD_PANELS.map((panel) => {
              const Icon = PANEL_ICONS[panel.icon] || Activity;
              const colors = PANEL_COLORS[panel.color] || PANEL_COLORS.emerald;
              const isActive = activeView === panel.id;
              return (
                <button key={panel.id} onClick={() => setActiveView(panel.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body transition-all ${isActive ? `${colors.sidebar} border ${colors.text}` : "text-muted-foreground hover:text-foreground border border-transparent"}`}>
                  <Icon className="h-3.5 w-3.5" />
                  <span className="whitespace-nowrap">{panel.title.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* === Content === */}
        <main className="flex-1 lg:ml-72 pt-4 lg:pt-0">
          <div className="max-w-4xl mx-auto px-6 py-8 lg:py-10 mt-12 lg:mt-0">

            {/* ===== WELCOME HERO CARD ===== */}
            <div className="mb-8 rounded-2xl border border-border/10 bg-card/30 backdrop-blur-sm p-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                    Your <span className="gradient-text">{analysis.businessType}</span> Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground font-body mt-1">
                    {selectedTools.length} AI tools selected &middot; ${totalMonthlyCost}/mo &middot; {healthScore}% coverage score
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {!isOverBudget ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <AlertTriangle className="h-3.5 w-3.5 text-red-400" />}
                    <span className={`text-xs font-body font-medium ${!isOverBudget ? "text-emerald-400" : "text-red-400"}`}>
                      {!isOverBudget ? "Within Budget" : "Over Budget"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-xs font-body font-medium text-primary">{budgetUsedPercent}% used</span>
                  </div>
                </div>
              </div>
              {/* Mini budget bar */}
              <div className="mt-4 h-1.5 rounded-full bg-foreground/5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    isOverBudget ? "bg-red-500" : budgetUsedPercent > 90 ? "bg-amber-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
                />
              </div>
            </div>

            {/* BUSINESS PLAN */}
            {activeView === "business-plan" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-start gap-4 mb-2">
                  <div className="p-3.5 rounded-2xl bg-primary/10 ring-1 ring-primary/20"><BookOpen className="h-7 w-7 text-primary" /></div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Business Plan</h1>
                    <p className="text-muted-foreground font-body mt-1">Complete playbook for your <span className="gradient-text font-medium">{analysis.businessType}</span></p>
                  </div>
                </div>

                <Card className="card-glow glow-amber border-border/15 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2 font-display"><Lightbulb className="h-4 w-4 text-amber-400" />Executive Summary</CardTitle></CardHeader>
                  <CardContent>
                    <EditableSection
                      value={getEditedField("executiveSummary", breakdown.executiveSummary)}
                      onSave={(v) => handlePlanEdit("executiveSummary", v)}
                    />
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="card-glow glow-emerald border-border/15 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2 font-display"><TrendingUp className="h-4 w-4 text-emerald-400" />Revenue Strategy</CardTitle></CardHeader>
                    <CardContent>
                      <EditableSection
                        value={getEditedField("revenueStrategy", breakdown.revenueStrategy)}
                        onSave={(v) => handlePlanEdit("revenueStrategy", v)}
                      />
                    </CardContent>
                  </Card>
                  <Card className="card-glow glow-violet border-border/15 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2 font-display"><Rocket className="h-4 w-4 text-violet-400" />Growth Strategy</CardTitle></CardHeader>
                    <CardContent>
                      <EditableSection
                        value={getEditedField("growthStrategy", breakdown.growthStrategy)}
                        onSave={(v) => handlePlanEdit("growthStrategy", v)}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-3 flex items-center gap-2"><Target className="h-5 w-5 text-primary" />Operations Playbook</h3>
                  <p className="text-sm text-muted-foreground font-body mb-4">Department-by-department guide. Click each section to expand.</p>
                  <div className="space-y-3">{breakdown.operationsPlaybook.map((s, i) => <PlaybookCard key={i} section={s} />)}</div>
                </div>

                <Card className="card-glow glow-sky border-border/15 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 font-display"><Calendar className="h-4 w-4 text-sky-400" />90-Day Action Plan</CardTitle>
                    <p className="text-sm text-muted-foreground font-body">Your prioritized roadmap for the next 3 months.</p>
                  </CardHeader>
                  <CardContent><NinetyDayTimeline items={breakdown.ninetyDayPlan} /></CardContent>
                </Card>

                <Card className="card-glow glow-cyan border-border/15 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2 font-display"><BarChart3 className="h-4 w-4 text-cyan-400" />Key Metrics to Track</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {breakdown.keyMetrics.map((m, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-background/30 border border-border/10">
                          <span className="mt-1 w-2 h-2 rounded-full bg-cyan-400 shrink-0" /><span className="text-sm text-foreground/80 font-body">{m}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-glow glow-indigo border-border/15 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2 font-display"><Users className="h-4 w-4 text-indigo-400" />Team Recommendations</CardTitle></CardHeader>
                  <CardContent>
                    <EditableSection
                      value={getEditedField("teamRecommendations", breakdown.teamRecommendations)}
                      onSave={(v) => handlePlanEdit("teamRecommendations", v)}
                    />
                  </CardContent>
                </Card>

                {breakdown.risks.length > 0 && (
                  <Card className="card-glow glow-red border-red-500/10 bg-red-500/5 backdrop-blur-sm">
                    <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2 font-display"><AlertTriangle className="h-4 w-4 text-red-400" />Risks & Pitfalls to Watch</CardTitle></CardHeader>
                    <CardContent><div className="space-y-2">{breakdown.risks.map((r, i) => <div key={i} className="flex items-start gap-2 text-sm text-foreground/80 font-body"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />{r}</div>)}</div></CardContent>
                  </Card>
                )}

                <Card className="card-glow glow-orange border-border/15 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2 font-display"><Zap className="h-4 w-4 text-amber-400" />Top Automation Opportunities</CardTitle></CardHeader>
                  <CardContent className="space-y-1.5">
                    {analysis.keyAutomationOpportunities.map((opp, i) => <div key={i} className="flex items-start gap-2"><Zap className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" /><span className="text-sm text-foreground/80 font-body">{opp}</span></div>)}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* TOOL STACK */}
            {activeView === "tool-stack" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 rounded-2xl bg-violet-500/10 ring-1 ring-violet-500/20"><Wrench className="h-7 w-7 text-violet-400" /></div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">AI Tool Stack</h1>
                      <p className="text-muted-foreground font-body mt-1"><span className="text-primary font-medium">{selectedTools.length} tools</span> recommended for your business</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-border/20 bg-background/30 h-8 shrink-0 hover:bg-background/50" onClick={handleCopyToolStack}>
                    {toolsCopied ? <CheckCheck className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
                    {toolsCopied ? "Copied!" : "Copy MD"}
                  </Button>
                </div>
                <BudgetProgress totalCost={totalMonthlyCost} budget={userBudget} budgetUsedPercent={budgetUsedPercent} isOverBudget={isOverBudget} toolCount={selectedTools.length} potentialCost={potentialCost} freeToolCount={freeToolCount} />
                <Card className="border-border/15 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3"><CardTitle className="text-base font-display">Category Relevance</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">{sortedCategories.map((c) => <Badge key={c.category} variant="secondary" className="text-xs">{CATEGORY_LABELS[c.category as ToolCategory]} ({c.relevanceScore}%)</Badge>)}</div>
                  </CardContent>
                </Card>
                <div className="space-y-8">
                  {sortedCategories.map((c) => {
                    const t = toolsByCategory.get(c.category as ToolCategory) || [];
                    return <CategorySection key={c.category} category={c.category as ToolCategory} tools={t} relevanceScore={c.relevanceScore} reasoning={c.reasoning} />;
                  })}
                </div>
              </div>
            )}

            {/* CONSOLIDATED PANELS */}
            {activeView !== "business-plan" && activeView !== "tool-stack" && (() => {
              const panel = DASHBOARD_PANELS.find((p) => p.id === activeView);
              if (!panel) return null;
              const panelTools = getToolsForPanel(panel);
              const sections = generatePanelData(panel.id, answers, panelTools);
              const colors = PANEL_COLORS[panel.color] || PANEL_COLORS.emerald;
              const Icon = PANEL_ICONS[panel.icon] || Activity;
              const status = worstStatus(sections);

              return (
                <div className="animate-fade-in">
                  <div className="flex items-start gap-4 mb-8">
                    <div className={`p-3.5 rounded-2xl ${colors.bg} ring-1 ring-white/5`}><Icon className={`h-7 w-7 ${colors.text}`} /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">{panel.title}</h1>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/40 border border-border/10">
                          {status === "good" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                          {status === "warning" && <AlertCircle className="h-4 w-4 text-amber-400" />}
                          {status === "action" && <Clock className="h-4 w-4 text-blue-400" />}
                          <span className="text-xs font-body text-muted-foreground">
                            {status === "good" ? "On Track" : status === "warning" ? "Needs Attention" : "Action Required"}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground font-body mt-2 leading-relaxed max-w-2xl">{panel.description}</p>
                    </div>
                  </div>

                  {panel.id === "operations-overview" && <OperationsOverview sections={sections} tools={panelTools} totalMonthlyCost={totalMonthlyCost} budget={userBudget} />}
                  {panel.id === "growth-marketing" && <GrowthMarketing sections={sections} tools={panelTools} />}
                  {panel.id === "automation-hub" && <AutomationHub sections={sections} tools={panelTools} />}
                  {panel.id === "strategy-competition" && <StrategyCompetition sections={sections} tools={panelTools} />}
                </div>
              );
            })()}

            <div className="text-center text-xs text-muted-foreground/40 font-body pt-10 pb-4">
              <p>Insights based on your questionnaire answers and AI-recommended tool stack.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// === Sidebar helper components ===

function SidebarButton({ active, onClick, icon, label, color }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; color: string }) {
  const colorMap: Record<string, string> = {
    primary: active ? "bg-primary/[0.08] border-primary/30" : "",
    violet: active ? "bg-violet-500/[0.08] border-violet-500/30" : "",
  };
  const iconBg: Record<string, string> = {
    primary: active ? "bg-primary/10 ring-primary/20" : "bg-card/40 ring-white/5",
    violet: active ? "bg-violet-500/10 ring-violet-500/20" : "bg-card/40 ring-white/5",
  };
  const chevronColor: Record<string, string> = { primary: "text-primary", violet: "text-violet-400" };

  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${active ? `${colorMap[color]} border` : "hover:bg-card/40 border border-transparent"}`}>
      <div className={`p-2 rounded-lg ${iconBg[color]} ring-1 transition-all`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-body font-medium truncate transition-colors ${active ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"}`}>{label}</p>
      </div>
      {active && <ChevronRight className={`h-3.5 w-3.5 ${chevronColor[color]}`} />}
    </button>
  );
}

function MobileTab({ active, onClick, icon, label, color }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; color: string }) {
  const styles: Record<string, string> = {
    primary: active ? "bg-primary/[0.08] border-primary/30 text-primary" : "",
    violet: active ? "bg-violet-500/[0.08] border-violet-500/30 text-violet-400" : "",
  };
  return (
    <button onClick={onClick}
      className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body transition-all ${active ? `${styles[color]} border` : "text-muted-foreground hover:text-foreground border border-transparent"}`}>
      {icon}<span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
