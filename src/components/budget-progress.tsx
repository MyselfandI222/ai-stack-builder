"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, PiggyBank } from "lucide-react";

interface BudgetProgressProps {
  totalCost: number;
  budget: number;
  budgetUsedPercent: number;
  isOverBudget: boolean;
  toolCount: number;
}

export function BudgetProgress({
  totalCost,
  budget,
  budgetUsedPercent,
  isOverBudget,
  toolCount,
}: BudgetProgressProps) {
  const clampedPercent = Math.min(budgetUsedPercent, 100);
  const savings = budget - totalCost;

  let progressColor = "bg-emerald-500";
  if (budgetUsedPercent > 90) progressColor = "bg-amber-500";
  if (isOverBudget) progressColor = "bg-red-500";

  return (
    <Card
      className={`border-border/30 backdrop-blur ${
        isOverBudget ? "bg-red-500/5 border-red-500/20" : "bg-card/50"
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold text-foreground">Budget Summary</span>
          </div>
          <div className="flex items-center gap-1.5">
            {isOverBudget ? (
              <>
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-sm font-medium text-red-400">Over Budget</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Within Budget</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold text-foreground tabular-nums">
                {formatCurrency(totalCost)}
              </span>
              <span className="text-muted-foreground text-sm ml-1">
                / {formatCurrency(budget)} budget
              </span>
            </div>
            <span className="text-sm text-muted-foreground tabular-nums">
              {budgetUsedPercent}% used
            </span>
          </div>

          <div className="relative">
            <Progress value={clampedPercent} className="h-3" />
            <div
              className={`absolute inset-0 h-3 rounded-full ${progressColor} transition-all`}
              style={{ width: `${clampedPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {toolCount} tools selected
            </span>
            {!isOverBudget && savings > 0 && (
              <span className="text-emerald-400 font-medium">
                {formatCurrency(savings)} remaining
              </span>
            )}
            {isOverBudget && (
              <span className="text-red-400 font-medium">
                {formatCurrency(Math.abs(savings))} over budget
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
