"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  StackRecommendation,
  ToolCategory,
  CATEGORY_LABELS,
  PlaybookSection,
  ActionItem,
} from "@/types";
import { CategorySection } from "./category-section";
import { BudgetProgress } from "./budget-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Lightbulb,
  RotateCcw,
  BookOpen,
  TrendingUp,
  Rocket,
  Target,
  Calendar,
  BarChart3,
  Users,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Wrench,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultsDashboardProps {
  result: StackRecommendation;
  budget: number;
  onReset: () => void;
}

type Tab = "breakdown" | "tools";

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  low: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <Badge
      variant="outline"
      className={`${PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium} rounded-full text-xs font-body`}
    >
      {priority}
    </Badge>
  );
}

function PlaybookCard({ section }: { section: PlaybookSection }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-display">
                {section.department}
              </CardTitle>
              <PriorityBadge priority={section.priority} />
            </div>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            {section.overview}
          </p>
        </CardHeader>
      </button>

      {expanded && (
        <CardContent className="pt-0 space-y-4">
          {/* How to Start */}
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1.5 font-body">
              First Step
            </p>
            <p className="text-sm text-foreground/80 font-body">
              {section.howToStart}
            </p>
          </div>

          {/* Weekly Tasks */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 font-body">
              Weekly Tasks
            </p>
            <ul className="space-y-1">
              {section.weeklyTasks.map((task, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-foreground/80 font-body"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                  {task}
                </li>
              ))}
            </ul>
          </div>

          {/* Monthly Tasks */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 font-body">
              Monthly Tasks
            </p>
            <ul className="space-y-1">
              {section.monthlyTasks.map((task, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-foreground/80 font-body"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400/60 shrink-0" />
                  {task}
                </li>
              ))}
            </ul>
          </div>

          {/* KPIs */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 font-body">
              KPIs to Track
            </p>
            <div className="flex flex-wrap gap-1.5">
              {section.kpis.map((kpi, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="text-xs rounded-full font-body"
                >
                  {kpi}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function NinetyDayTimeline({ items }: { items: ActionItem[] }) {
  // Group by timeline
  const groups = new Map<string, ActionItem[]>();
  for (const item of items) {
    const list = groups.get(item.timeline) || [];
    list.push(item);
    groups.set(item.timeline, list);
  }

  return (
    <div className="space-y-4">
      {[...groups.entries()].map(([timeline, tasks]) => (
        <div key={timeline}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-display font-semibold text-foreground">
              {timeline}
            </span>
          </div>
          <div className="ml-6 border-l border-border/30 pl-4 space-y-2">
            {tasks.map((task, i) => (
              <div key={i} className="flex items-start gap-2">
                <PriorityBadge priority={task.priority} />
                <div>
                  <p className="text-sm text-foreground/80 font-body">
                    {task.task}
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    {task.department}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ResultsDashboard({
  result,
  budget,
  onReset,
}: ResultsDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("breakdown");
  const {
    analysis,
    selectedTools,
    totalMonthlyCost,
    budgetUsedPercent,
    isOverBudget,
  } = result;
  const breakdown = analysis.businessBreakdown;

  // Group tools by category
  const toolsByCategory = new Map<ToolCategory, typeof selectedTools>();
  for (const tool of selectedTools) {
    const list = toolsByCategory.get(tool.category) || [];
    list.push(tool);
    toolsByCategory.set(tool.category, list);
  }

  // Sort categories by relevance score
  const sortedCategories = [...analysis.categories]
    .filter((c) => c.relevanceScore >= 10)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Your Business Breakdown
          </h2>
          <p className="text-muted-foreground font-body">
            Complete playbook for your{" "}
            <span className="gradient-text font-medium">
              {analysis.businessType}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onReset} size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Start Over
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-secondary/30 rounded-full w-fit">
        <button
          onClick={() => setActiveTab("breakdown")}
          className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all ${
            activeTab === "breakdown"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4 inline mr-1.5 -mt-0.5" />
          Business Plan
        </button>
        <button
          onClick={() => setActiveTab("tools")}
          className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all ${
            activeTab === "tools"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Wrench className="h-4 w-4 inline mr-1.5 -mt-0.5" />
          AI Tool Stack
        </button>
      </div>

      {activeTab === "breakdown" ? (
        <div className="space-y-6">
          {/* Executive Summary */}
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 font-display">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 font-body leading-relaxed">
                {breakdown.executiveSummary}
              </p>
            </CardContent>
          </Card>

          {/* Revenue & Growth Strategy */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-border/30 bg-card/50 backdrop-blur-sm card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 font-display">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  Revenue Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 font-body leading-relaxed">
                  {breakdown.revenueStrategy}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/30 bg-card/50 backdrop-blur-sm card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 font-display">
                  <Rocket className="h-4 w-4 text-violet-400" />
                  Growth Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 font-body leading-relaxed">
                  {breakdown.growthStrategy}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Operations Playbook */}
          <div>
            <h3 className="text-lg font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Operations Playbook
            </h3>
            <p className="text-sm text-muted-foreground font-body mb-4">
              Department-by-department guide. Click each section to expand.
            </p>
            <div className="space-y-3">
              {breakdown.operationsPlaybook.map((section, i) => (
                <PlaybookCard key={i} section={section} />
              ))}
            </div>
          </div>

          {/* 90-Day Action Plan */}
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 font-display">
                <Calendar className="h-4 w-4 text-sky-400" />
                90-Day Action Plan
              </CardTitle>
              <p className="text-sm text-muted-foreground font-body">
                Your prioritized roadmap for the next 3 months.
              </p>
            </CardHeader>
            <CardContent>
              <NinetyDayTimeline items={breakdown.ninetyDayPlan} />
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 font-display">
                <BarChart3 className="h-4 w-4 text-cyan-400" />
                Key Metrics to Track
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-2">
                {breakdown.keyMetrics.map((metric, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-3 rounded-xl bg-background/30 border border-border/20"
                  >
                    <span className="mt-1 w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <span className="text-sm text-foreground/80 font-body">
                      {metric}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Recommendations */}
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 font-display">
                <Users className="h-4 w-4 text-indigo-400" />
                Team Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 font-body leading-relaxed">
                {breakdown.teamRecommendations}
              </p>
            </CardContent>
          </Card>

          {/* Risks */}
          {breakdown.risks.length > 0 && (
            <Card className="border-red-500/10 bg-red-500/5 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 font-display">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  Risks & Pitfalls to Watch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {breakdown.risks.map((risk, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground/80 font-body"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      {risk}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Automation Opportunities */}
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 font-display">
                <Zap className="h-4 w-4 text-amber-400" />
                Top Automation Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {analysis.keyAutomationOpportunities.map((opp, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Zap className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground/80 font-body">
                    {opp}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Budget Progress */}
          <BudgetProgress
            totalCost={totalMonthlyCost}
            budget={budget}
            budgetUsedPercent={budgetUsedPercent}
            isOverBudget={isOverBudget}
            toolCount={selectedTools.length}
          />

          {/* Relevant Categories */}
          <Card className="border-border/30 bg-card/50 backdrop-blur-sm card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display">
                Category Relevance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {sortedCategories.map((cat) => (
                  <Badge
                    key={cat.category}
                    variant="secondary"
                    className="text-xs"
                  >
                    {CATEGORY_LABELS[cat.category as ToolCategory]} (
                    {cat.relevanceScore}%)
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tool Recommendations by Category */}
          <div className="space-y-8">
            {sortedCategories.map((cat) => {
              const tools =
                toolsByCategory.get(cat.category as ToolCategory) || [];
              return (
                <CategorySection
                  key={cat.category}
                  category={cat.category as ToolCategory}
                  tools={tools}
                  relevanceScore={cat.relevanceScore}
                  reasoning={cat.reasoning}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground font-body mb-2">
            This business breakdown and tool stack were built by AI based on
            your specific answers.
          </p>
          <p className="text-xs text-muted-foreground font-body">
            Use this as a starting point — adapt it as you learn more about your
            market. Tool prices are estimates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
