"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/utils";
import { DollarSign } from "lucide-react";

interface BudgetSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}

const BUDGET_PRESETS = [50, 100, 250, 500, 1000, 2000];

export function BudgetSelector({ value, onChange, disabled }: BudgetSelectorProps) {
  return (
    <Card className="border-border/30 bg-card/50 backdrop-blur-sm card-hover">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-display flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Monthly Budget
        </CardTitle>
        <CardDescription className="font-body">
          Set your maximum monthly spend on AI tools. We&apos;ll optimize your stack to stay within budget.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <span className="text-4xl font-display font-bold text-foreground tabular-nums">
            {formatCurrency(value)}
          </span>
          <span className="text-muted-foreground text-sm ml-1 font-body">/month</span>
        </div>

        <Slider
          value={[value]}
          onValueChange={(v) => onChange(v[0])}
          min={0}
          max={2000}
          step={10}
          disabled={disabled}
          className="py-2"
        />

        <div className="flex justify-between text-xs text-muted-foreground font-body">
          <span>$0</span>
          <span>$500</span>
          <span>$1,000</span>
          <span>$1,500</span>
          <span>$2,000</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {BUDGET_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              disabled={disabled}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-300 ${
                value === preset
                  ? "bg-foreground text-background"
                  : "bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:border-primary/20"
              } disabled:opacity-50`}
            >
              {formatCurrency(preset)}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
