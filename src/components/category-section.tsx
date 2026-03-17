"use client";

import { SelectedTool, ToolCategory, CATEGORY_LABELS } from "@/types";
import { ToolCard } from "./tool-card";
import { formatCurrency } from "@/lib/utils";
import {
  Megaphone,
  Palette,
  Headphones,
  Settings,
  TrendingUp,
  FolderKanban,
  BarChart3,
  Code2,
} from "lucide-react";

const CATEGORY_ICON_MAP: Record<ToolCategory, React.ElementType> = {
  marketing: Megaphone,
  "content-creation": Palette,
  "customer-support": Headphones,
  operations: Settings,
  sales: TrendingUp,
  admin: FolderKanban,
  analytics: BarChart3,
  development: Code2,
};

const CATEGORY_COLORS: Record<ToolCategory, string> = {
  marketing: "text-rose-400",
  "content-creation": "text-violet-400",
  "customer-support": "text-sky-400",
  operations: "text-amber-400",
  sales: "text-emerald-400",
  admin: "text-orange-400",
  analytics: "text-cyan-400",
  development: "text-indigo-400",
};

interface CategorySectionProps {
  category: ToolCategory;
  tools: SelectedTool[];
  relevanceScore: number;
  reasoning: string;
}

export function CategorySection({
  category,
  tools,
  relevanceScore,
  reasoning,
}: CategorySectionProps) {
  const Icon = CATEGORY_ICON_MAP[category];
  const colorClass = CATEGORY_COLORS[category];
  const categoryTotal = tools.reduce((sum, t) => sum + t.monthlyCost, 0);

  if (tools.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${colorClass}`} />
          <h3 className="text-lg font-display font-semibold text-foreground">
            {CATEGORY_LABELS[category]}
          </h3>
          <span className="text-xs text-muted-foreground font-body bg-secondary/50 px-2.5 py-1 rounded-full">
            {relevanceScore}% relevant
          </span>
        </div>
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {formatCurrency(categoryTotal)}/mo
        </span>
      </div>

      <p className="text-sm text-muted-foreground -mt-1">{reasoning}</p>

      <div className="grid gap-2">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
