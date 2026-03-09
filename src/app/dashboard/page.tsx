"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadDashboardData } from "@/lib/dashboard-storage";
import { DASHBOARD_FEATURES } from "@/lib/dashboard-features";
import {
  SavedDashboardData,
  SelectedTool,
  ToolCategory,
  CATEGORY_LABELS,
  DashboardFeatureId,
} from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  DollarSign,
  Users,
  Search as UserSearch,
  Megaphone,
  TrendingUp,
  Receipt,
  Radar,
  Workflow,
  FileText,
  Layers,
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

const ICON_MAP: Record<string, typeof Activity> = {
  Activity,
  DollarSign,
  Users,
  UserSearch,
  Megaphone,
  TrendingUp,
  Receipt,
  Radar,
  Workflow,
  FileText,
};

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/20",
    badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/20",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  pink: {
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    border: "border-pink-500/20",
    badge: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
    badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  red: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  sky: {
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    border: "border-sky-500/20",
    badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
};

// --- Generate insights based on feature + user answers + tools ---

function generateInsights(
  featureId: DashboardFeatureId,
  answers: Record<string, unknown>,
  tools: SelectedTool[]
): { status: "good" | "warning" | "action"; insights: string[]; actions: string[] } {
  const toolNames = tools.map((t) => t.name);

  switch (featureId) {
    case "health-score": {
      const stage = (answers.stage as string) || "Unknown";
      const customers = (answers.currentCustomerCount as string) || "0";
      const challenge = (answers.biggestChallenge as string) || "";
      const isEarly = stage.includes("idea") || stage.includes("Pre-launch");
      return {
        status: isEarly ? "warning" : "good",
        insights: [
          `Business stage: ${stage}`,
          `Current customers: ${customers}`,
          challenge ? `Top challenge: ${challenge}` : "No major challenges flagged",
          toolNames.length > 0
            ? `Track health via ${toolNames.slice(0, 2).join(" & ")}`
            : "No analytics tools selected yet",
        ],
        actions: [
          "Set up weekly KPI tracking dashboard",
          toolNames.length > 0
            ? `Connect ${toolNames[0]} to monitor core metrics`
            : "Add an analytics tool to your stack",
          "Define 5 health indicators specific to your business",
        ],
      };
    }

    case "cash-flow": {
      const budget = (answers.budget as number) || 0;
      const revenueModel = (answers.revenueModel as string) || "";
      const pricePoint = (answers.pricePoint as string) || "Not set";
      const revenueGoal = (answers.revenueGoal as string) || "Not set";
      return {
        status: revenueModel ? "good" : "warning",
        insights: [
          `Monthly AI tool budget: $${budget}`,
          `Revenue model: ${revenueModel || "Not defined"}`,
          `Price point: ${pricePoint}`,
          `12-month target: ${revenueGoal}`,
        ],
        actions: [
          "Build a 90-day cash flow projection spreadsheet",
          `Set spending alerts for your $${budget}/mo tool budget`,
          toolNames.length > 0
            ? `Use ${toolNames[0]} to track revenue trends`
            : "Set up financial tracking tools",
        ],
      };
    }

    case "task-manager": {
      const teamSize = (answers.teamSize as string) || "Solo";
      const ops = (answers.operations as string[]) || [];
      const automate = (answers.automateFirst as string) || "";
      return {
        status: ops.length > 0 ? "good" : "action",
        insights: [
          `Team size: ${teamSize}`,
          `Active departments: ${ops.length > 0 ? ops.join(", ") : "None selected"}`,
          automate ? `Priority automation: ${automate}` : "No automation target set",
        ],
        actions: [
          toolNames.length > 0
            ? `Set up ${toolNames[0]} for task tracking and assignments`
            : "Choose a project management tool",
          "Create SOPs for your top 3 repeated tasks",
          teamSize !== "Solo (just me)"
            ? "Set up weekly team standups with automated summaries"
            : "Create a daily personal task review routine",
        ],
      };
    }

    case "customer-intel": {
      const audience = (answers.targetAudience as string) || "";
      const customerCount = (answers.currentCustomerCount as string) || "0";
      const acquisition = (answers.customerAcquisition as string) || "";
      const support = (answers.supportCurrently as string) || "";
      return {
        status: audience ? "good" : "warning",
        insights: [
          `Target: ${audience || "Not defined"}`,
          `Current customers: ${customerCount}`,
          acquisition ? `Acquisition: ${acquisition}` : "No acquisition channel defined",
          support ? `Support: ${support}` : "No support setup",
        ],
        actions: [
          toolNames.length > 0
            ? `Set up ${toolNames[0]} to track customer interactions`
            : "Add a customer support tool",
          "Create customer segments based on behavior and value",
          "Build a churn risk scoring system",
        ],
      };
    }

    case "marketing-autopilot": {
      const channels = (answers.marketingChannels as string[]) || [];
      const content = (answers.contentTypes as string[]) || [];
      const audience = (answers.targetAudience as string) || "";
      return {
        status: channels.length > 0 ? "good" : "action",
        insights: [
          `Active channels: ${channels.length > 0 ? channels.join(", ") : "None selected"}`,
          `Content types: ${content.length > 0 ? content.join(", ") : "None selected"}`,
          audience ? `Targeting: ${audience}` : "Target audience not defined",
          toolNames.length > 0
            ? `Powered by: ${toolNames.join(", ")}`
            : "No marketing tools in stack",
        ],
        actions: [
          toolNames.length > 0
            ? `Automate content scheduling with ${toolNames[0]}`
            : "Add a marketing automation tool",
          "Set up A/B testing for your top-performing channel",
          "Create a monthly content calendar with AI-generated drafts",
        ],
      };
    }

    case "sales-coach": {
      const salesProcess = (answers.salesProcess as string) || "";
      const pricePoint = (answers.pricePoint as string) || "";
      const acquisition = (answers.customerAcquisition as string) || "";
      return {
        status: salesProcess ? "good" : "action",
        insights: [
          `Sales process: ${salesProcess || "Not defined"}`,
          pricePoint ? `Deal size: ${pricePoint}` : "Price point not set",
          acquisition ? `Lead source: ${acquisition}` : "No lead source defined",
          toolNames.length > 0
            ? `Pipeline tools: ${toolNames.join(", ")}`
            : "No sales tools selected",
        ],
        actions: [
          toolNames.length > 0
            ? `Set up lead scoring in ${toolNames[0]}`
            : "Add a CRM/sales tool to your stack",
          "Define your pipeline stages and conversion targets",
          "Create email templates for each stage of the funnel",
        ],
      };
    }

    case "expense-optimizer": {
      const budget = (answers.budget as number) || 0;
      const currentTools = (answers.currentTools as string) || "";
      const totalToolCost = tools.reduce((sum, t) => sum + t.monthlyCost, 0);
      return {
        status: totalToolCost <= budget ? "good" : "warning",
        insights: [
          `Monthly tool budget: $${budget}`,
          `Recommended stack cost: $${totalToolCost}/mo`,
          `Budget used: ${budget > 0 ? Math.round((totalToolCost / budget) * 100) : 0}%`,
          currentTools ? `Current tools: ${currentTools}` : "No existing tools listed",
        ],
        actions: [
          "Audit all current subscriptions for overlap",
          "Check for free tier eligibility on recommended tools",
          "Set quarterly vendor review reminders",
        ],
      };
    }

    case "competitor-radar": {
      const competitors = (answers.competitors as string) || "";
      const differentiator = (answers.differentiator as string) || "";
      return {
        status: competitors ? "good" : "action",
        insights: [
          competitors ? `Tracking: ${competitors}` : "No competitors identified",
          differentiator ? `Your edge: ${differentiator}` : "Differentiator not defined",
          toolNames.length > 0
            ? `Monitor via: ${toolNames.join(", ")}`
            : "No monitoring tools set up",
        ],
        actions: [
          "Set up Google Alerts for competitor brand names",
          toolNames.length > 0
            ? `Use ${toolNames[0]} to track competitor SEO and ad strategies`
            : "Add an analytics/marketing tool for competitive intelligence",
          "Create a monthly competitor comparison scorecard",
        ],
      };
    }

    case "workflow-builder": {
      const ops = (answers.operations as string[]) || [];
      const automate = (answers.automateFirst as string) || "";
      const currentTools = (answers.currentTools as string) || "";
      return {
        status: automate ? "good" : "action",
        insights: [
          `Departments to automate: ${ops.length > 0 ? ops.join(", ") : "None selected"}`,
          automate ? `First automation: ${automate}` : "No priority automation set",
          currentTools ? `Existing tools to connect: ${currentTools}` : "No tools to integrate yet",
          toolNames.length > 0
            ? `Automation platform: ${toolNames.join(", ")}`
            : "No workflow tools selected",
        ],
        actions: [
          toolNames.length > 0
            ? `Build your first automation in ${toolNames[0]}`
            : "Add Zapier or Make.com to your stack",
          "Map your top 5 manual processes end-to-end",
          "Estimate time saved per automation (aim for 5+ hrs/week)",
        ],
      };
    }

    case "weekly-brief": {
      const topGoal = (answers.topGoal as string) || "";
      const stage = (answers.stage as string) || "";
      const challenge = (answers.biggestChallenge as string) || "";
      return {
        status: "good",
        insights: [
          topGoal ? `#1 Goal: ${topGoal}` : "No primary goal set",
          stage ? `Stage: ${stage}` : "Stage not defined",
          challenge ? `Watch out for: ${challenge}` : "No blockers flagged",
          `Your brief will cover ${toolNames.length} tools and all active departments`,
        ],
        actions: [
          "Schedule a Monday 9 AM brief review slot",
          "Connect all tools to a central dashboard for data pull",
          "Set weekly/monthly targets to measure against",
        ],
      };
    }

    default:
      return { status: "good", insights: [], actions: [] };
  }
}

// --- Status icon helper ---

function StatusIcon({ status }: { status: "good" | "warning" | "action" }) {
  switch (status) {
    case "good":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    case "warning":
      return <AlertCircle className="h-4 w-4 text-amber-400" />;
    case "action":
      return <Clock className="h-4 w-4 text-blue-400" />;
  }
}

const STATUS_LABEL: Record<string, string> = {
  good: "On Track",
  warning: "Needs Attention",
  action: "Action Required",
};

// --- Feature Card ---

function FeatureCard({
  feature,
  tools,
  answers,
}: {
  feature: (typeof DASHBOARD_FEATURES)[0];
  tools: SelectedTool[];
  answers: Record<string, unknown>;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICON_MAP[feature.icon] || Activity;
  const colors = COLOR_MAP[feature.color] || COLOR_MAP.emerald;
  const { status, insights, actions } = generateInsights(feature.id, answers, tools);

  return (
    <Card
      className={`border-border/30 bg-card/50 backdrop-blur-sm transition-all duration-300 ${
        expanded ? `${colors.border} border` : ""
      }`}
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl ${colors.bg}`}>
                <Icon className={`h-5 w-5 ${colors.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-base font-display">{feature.title}</CardTitle>
                  <div className="flex items-center gap-1">
                    <StatusIcon status={status} />
                    <span className="text-xs font-body text-muted-foreground">
                      {STATUS_LABEL[status]}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-body mt-1 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
            <div className="ml-2 mt-1">
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardHeader>
      </button>

      {expanded && (
        <CardContent className="pt-0 space-y-5">
          {/* Your Data Insights */}
          <div>
            <p className={`text-xs font-medium uppercase tracking-wide mb-2 font-body ${colors.text}`}>
              Your Business Context
            </p>
            <div className="space-y-1.5">
              {insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-foreground/80 font-body">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${colors.bg.replace("/10", "/60")}`} />
                  {insight}
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Tools for this Feature */}
          {tools.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 font-body">
                AI Tools Powering This Feature
              </p>
              <div className="grid gap-2">
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background/30 border border-border/20"
                  >
                    <Zap className={`h-4 w-4 shrink-0 ${colors.text}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-body font-medium text-foreground">
                          {tool.name}
                        </span>
                        <Badge variant="outline" className={`text-[10px] rounded-full ${colors.badge}`}>
                          {CATEGORY_LABELS[tool.category]}
                        </Badge>
                        {tool.monthlyCost === 0 ? (
                          <Badge variant="secondary" className="text-[10px] rounded-full">
                            Free
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground font-body">
                            ${tool.monthlyCost}/mo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-body mt-0.5 truncate">
                        {tool.whyRecommended}
                      </p>
                    </div>
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Steps */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 font-body">
              Next Steps
            </p>
            <div className="space-y-2">
              {actions.map((action, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-background/30 border border-border/20"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold font-body shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground/80 font-body">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// --- Main Dashboard Page ---

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<SavedDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = loadDashboardData();
    setData(saved);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-3 text-center">
          <Sparkles className="h-8 w-8 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground font-body">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="border-border/30 bg-card/50 backdrop-blur-sm max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-xl font-display text-center">No Business Data Yet</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground font-body">
              Complete the business questionnaire first to unlock your personalized AI dashboard.
            </p>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-body font-semibold text-sm btn-lift"
            >
              <Sparkles className="h-4 w-4" />
              Start Questionnaire
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { result, answers } = data;
  const { analysis, selectedTools, totalMonthlyCost } = result;

  // Build a lookup: for each feature, find the tools that match its categories
  function getToolsForFeature(feature: (typeof DASHBOARD_FEATURES)[0]): SelectedTool[] {
    return selectedTools.filter((tool) =>
      feature.toolCategories.includes(tool.category as ToolCategory)
    );
  }

  // Calculate overall health
  const featuresWithTools = DASHBOARD_FEATURES.filter(
    (f) => getToolsForFeature(f).length > 0
  ).length;
  const healthScore = Math.round((featuresWithTools / DASHBOARD_FEATURES.length) * 100);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border/20 z-50 flex items-center">
        <div className="max-w-5xl mx-auto px-6 w-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <Layers className="h-5 w-5 text-primary transition-opacity group-hover:opacity-80" />
            <span className="font-display font-bold text-foreground text-base tracking-tight">
              AI<span className="text-primary">Stack</span>
            </span>
          </a>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-body transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Builder
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-12 space-y-8">
        {/* Dashboard Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Your AI Business Dashboard
          </h1>
          <p className="text-muted-foreground font-body mt-1">
            Personalized for your{" "}
            <span className="gradient-text font-medium">{analysis.businessType}</span>
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-emerald-400">{healthScore}%</p>
              <p className="text-xs text-muted-foreground font-body mt-1">Coverage Score</p>
            </CardContent>
          </Card>
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-primary">{selectedTools.length}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">AI Tools Active</p>
            </CardContent>
          </Card>
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-cyan-400">${totalMonthlyCost}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">Monthly Cost</p>
            </CardContent>
          </Card>
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-amber-400">
                {DASHBOARD_FEATURES.length}
              </p>
              <p className="text-xs text-muted-foreground font-body mt-1">Features Available</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Manager Quick Access */}
        <button
          onClick={() => router.push("/dashboard/team")}
          className="w-full text-left"
        >
          <Card className="border-indigo-500/20 bg-indigo-500/5 backdrop-blur-sm card-hover">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-indigo-500/10">
                <Users className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-foreground">Employee Manager</p>
                <p className="text-sm text-muted-foreground font-body">
                  Add employees, assign AI tools, set goals, and track their productivity.
                </p>
              </div>
              <ChevronDown className="h-5 w-5 text-muted-foreground rotate-[-90deg]" />
            </CardContent>
          </Card>
        </button>

        {/* Feature Cards */}
        <div className="space-y-3">
          <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Features
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Each feature is powered by the AI tools recommended for your business. Click to expand.
          </p>
          <div className="space-y-3 mt-4">
            {DASHBOARD_FEATURES.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                tools={getToolsForFeature(feature)}
                answers={answers}
              />
            ))}
          </div>
        </div>

        {/* Tool Stack Summary */}
        <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Your Complete AI Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedTools.map((tool) => (
                <a
                  key={tool.id}
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/40 border border-border/20 text-sm font-body text-foreground/80 hover:text-foreground hover:border-primary/30 transition-all"
                >
                  {tool.name}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground font-body pt-4">
          <p>
            Dashboard insights are based on your questionnaire answers and AI-recommended tool stack.
          </p>
          <p className="mt-1">Update your business profile to refine recommendations.</p>
        </div>
      </main>
    </div>
  );
}
