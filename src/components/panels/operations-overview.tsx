"use client";

import { SelectedTool, PanelSubSection, CATEGORY_LABELS } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PanelToolCard } from "@/components/panel-tool-card";
import {
  Activity,
  DollarSign,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  ExternalLink,
} from "lucide-react";

const SUB_ICONS = [Activity, DollarSign, Receipt];

function StatusIcon({ status }: { status: "good" | "warning" | "action" }) {
  switch (status) {
    case "good": return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
    case "warning": return <AlertCircle className="h-3.5 w-3.5 text-amber-400" />;
    case "action": return <Clock className="h-3.5 w-3.5 text-blue-400" />;
  }
}

const STATUS_LABEL: Record<string, string> = {
  good: "On Track", warning: "Needs Attention", action: "Action Required",
};

interface Props {
  sections: PanelSubSection[];
  tools: SelectedTool[];
  totalMonthlyCost: number;
  budget: number;
}

export function OperationsOverview({ sections, tools, totalMonthlyCost, budget }: Props) {
  const budgetUsed = budget > 0 ? Math.round((totalMonthlyCost / budget) * 100) : 0;
  const isOver = totalMonthlyCost > budget;

  return (
    <div className="space-y-6">
      {/* Budget Bar */}
      <Card className="card-glow glow-emerald border-border/20 bg-card/60">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-display font-semibold text-foreground">Budget Utilization</span>
            <span className={`text-sm font-body font-medium ${isOver ? "text-red-400" : "text-emerald-400"}`}>
              {budgetUsed}% used
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-border/20 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${isOver ? "bg-red-500" : budgetUsed > 90 ? "bg-amber-500" : "bg-emerald-500"}`}
              style={{ width: `${Math.min(budgetUsed, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground font-body">
            <span>${totalMonthlyCost}/mo of ${budget}/mo budget</span>
            <span>{tools.length} tools</span>
          </div>
        </CardContent>
      </Card>

      {/* Sub-sections */}
      {sections.map((section, idx) => {
        const Icon = SUB_ICONS[idx] || Activity;
        return (
          <Card key={section.label} className="border-border/20 bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <Icon className="h-4 w-4 text-emerald-400" />
                {section.label}
                <div className="flex items-center gap-1 ml-auto">
                  <StatusIcon status={section.status} />
                  <span className="text-xs text-muted-foreground font-body">{STATUS_LABEL[section.status]}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                {section.insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-foreground/80 font-body">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/60 shrink-0" />
                    {insight}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide font-body">Next Steps</p>
                {section.actions.map((action, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-background/30 border border-border/20">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold font-body shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground/80 font-body">{action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Tools for this panel */}
      {tools.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 font-body flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />Tools Powering Operations
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {tools.map((tool) => (
              <PanelToolCard key={tool.id} tool={tool} accentColor="emerald" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
