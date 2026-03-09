"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SelectedTool } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { ExternalLink, Check, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Target, ShieldAlert } from "lucide-react";

interface ToolCardProps {
  tool: SelectedTool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasProsOrCons = (tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0);

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

        {hasProsOrCons && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-body w-full"
            >
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {expanded ? "Hide" : "Show"} pros & cons
            </button>

            {expanded && (
              <div className="mt-3 space-y-3 border-t border-border/20 pt-3">
                {tool.pros && tool.pros.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <ThumbsUp className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400 font-display uppercase tracking-wide">Pros</span>
                    </div>
                    <ul className="space-y-1">
                      {tool.pros.map((pro, i) => (
                        <li key={i} className="text-xs text-muted-foreground font-body leading-relaxed pl-4 relative before:content-['+'] before:absolute before:left-0 before:text-emerald-400 before:font-semibold">
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tool.cons && tool.cons.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <ThumbsDown className="h-3.5 w-3.5 text-red-400" />
                      <span className="text-xs font-semibold text-red-400 font-display uppercase tracking-wide">Cons</span>
                    </div>
                    <ul className="space-y-1">
                      {tool.cons.map((con, i) => (
                        <li key={i} className="text-xs text-muted-foreground font-body leading-relaxed pl-4 relative before:content-['-'] before:absolute before:left-0 before:text-red-400 before:font-semibold">
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(tool.bestFor || tool.avoidIf) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {tool.bestFor && (
                      <div className="flex gap-1.5">
                        <Target className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-semibold text-primary font-display">Best for: </span>
                          <span className="text-xs text-muted-foreground font-body">{tool.bestFor}</span>
                        </div>
                      </div>
                    )}
                    {tool.avoidIf && (
                      <div className="flex gap-1.5">
                        <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-semibold text-amber-400 font-display">Avoid if: </span>
                          <span className="text-xs text-muted-foreground font-body">{tool.avoidIf}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
