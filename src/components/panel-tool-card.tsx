"use client";

import { useState } from "react";
import { SelectedTool, CATEGORY_LABELS } from "@/types";
import { Badge } from "@/components/ui/badge";
import { getToolTutorial } from "@/lib/tool-tutorials";
import { ToolTutorialSection } from "./tool-tutorial";
import { ExternalLink, GraduationCap, ChevronDown } from "lucide-react";

interface PanelToolCardProps {
  tool: SelectedTool;
  accentColor: string; // e.g. "emerald", "pink", "sky", "red"
}

const ACCENT_STYLES: Record<string, { badge: string }> = {
  emerald: { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  pink: { badge: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  sky: { badge: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  red: { badge: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export function PanelToolCard({ tool, accentColor }: PanelToolCardProps) {
  const tutorial = getToolTutorial(tool.id);
  const accent = ACCENT_STYLES[accentColor] || ACCENT_STYLES.emerald;

  return (
    <div className="rounded-xl bg-card/60 border border-border/20 overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-body font-medium text-foreground">{tool.name}</span>
            <Badge variant="outline" className={`text-[10px] rounded-full ${accent.badge}`}>
              {CATEGORY_LABELS[tool.category]}
            </Badge>
            {tutorial && (
              <span className="inline-flex items-center gap-0.5 text-[9px] text-primary/60 font-body">
                <GraduationCap className="h-2.5 w-2.5" />
                Guide
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-body mt-0.5 truncate">{tool.whyRecommended}</p>
        </div>
        <a href={tool.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      {tutorial && (
        <div className="px-3 pb-3 -mt-1">
          <ToolTutorialSection tutorial={tutorial} toolName={tool.name} />
        </div>
      )}
    </div>
  );
}
