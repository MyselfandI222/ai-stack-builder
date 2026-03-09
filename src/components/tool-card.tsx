"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SelectedTool } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ExternalLink, Check } from "lucide-react";

interface ToolCardProps {
  tool: SelectedTool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const tierColors = {
    essential: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    recommended: "bg-primary/10 text-primary border-primary/20",
    "nice-to-have": "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  };

  return (
    <Card className="border-border/30 bg-card/50 backdrop-blur-sm card-hover group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-display font-semibold text-foreground truncate">{tool.name}</h4>
              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2 font-body">
              {tool.description}
            </p>
            <p className="text-xs text-primary/80 italic mb-3 font-body">{tool.whyRecommended}</p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className={`${tierColors[tool.tier]} rounded-full font-body`}>
                {tool.tier}
              </Badge>
              {tool.hasFreeTier && (
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-full font-body">
                  <Check className="h-3 w-3 mr-1" />
                  Free tier
                </Badge>
              )}
              {tool.useCaseTags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs rounded-full font-body">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-display font-bold text-foreground tabular-nums">
              {tool.monthlyCost === 0 ? "Free" : formatCurrency(tool.monthlyCost)}
            </div>
            {tool.monthlyCost > 0 && (
              <div className="text-xs text-muted-foreground font-body">/mo</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
