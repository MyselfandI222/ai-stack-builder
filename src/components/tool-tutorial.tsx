"use client";

import { useState } from "react";
import { TutorialStep, TutorialSubstep, ToolTutorial } from "@/lib/tool-tutorials";

/**
 * Auto-generates substeps from a step's description when none are manually defined.
 * Splits on sentence boundaries and common instruction patterns.
 */
function generateSubsteps(step: TutorialStep): TutorialSubstep[] {
  const desc = step.description;

  // Split on periods, "then", and "→" which are used as step separators
  const parts = desc
    .split(/(?:\.\s+)|(?:\s+→\s+)|(?:\.\s*$)|(?:\s+[Tt]hen\s+)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  if (parts.length <= 1) {
    // Single sentence — try splitting on commas for multi-action sentences
    // e.g. "Enter your email, create a password, and click Sign Up"
    const commaParts = desc
      .split(/,\s+(?:and\s+)?|,\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    if (commaParts.length > 1) {
      return commaParts.map((text) => ({
        text: text.charAt(0).toUpperCase() + text.slice(1),
        action: inferAction(text),
      }));
    }

    // Can't break it down further
    return [];
  }

  return parts.map((text) => ({
    text: text.charAt(0).toUpperCase() + text.slice(1),
    action: inferAction(text),
  }));
}

function inferAction(text: string): TutorialSubstep["action"] {
  const lower = text.toLowerCase();
  if (/\b(go to|open|visit|navigate|browse|scroll)\b/.test(lower)) return "navigate";
  if (/\b(click|press|tap|hit|select a |choose a |pick)\b/.test(lower)) return "click";
  if (/\b(type|enter|fill|write|paste|input|name your)\b/.test(lower)) return "type";
  if (/\b(select|choose|pick from|dropdown|from the)\b/.test(lower)) return "select";
  if (/\b(toggle|enable|turn on|switch|activate)\b/.test(lower)) return "toggle";
  if (/\b(wait|loading|processing|takes a)\b/.test(lower)) return "wait";
  if (/\b(verify|check|confirm|make sure|you'll see|look for)\b/.test(lower)) return "verify";
  return undefined;
}
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  MousePointerClick,
  Type,
  Navigation,
  ListChecks,
  ToggleRight,
  Clock,
  CheckCircle2,
  Play,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const ACTION_CONFIG: Record<
  TutorialStep["action"],
  { icon: typeof MousePointerClick; label: string; color: string; bg: string }
> = {
  navigate: {
    icon: Navigation,
    label: "Go to",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  click: {
    icon: MousePointerClick,
    label: "Click",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  type: {
    icon: Type,
    label: "Type / Enter",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  select: {
    icon: ListChecks,
    label: "Select",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  toggle: {
    icon: ToggleRight,
    label: "Toggle",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  wait: {
    icon: Clock,
    label: "Wait",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  verify: {
    icon: CheckCircle2,
    label: "Verify",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
};

interface ToolTutorialProps {
  tutorial: ToolTutorial;
  toolName: string;
}

export function ToolTutorialSection({ tutorial, toolName }: ToolTutorialProps) {
  const [expanded, setExpanded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [expandedSubsteps, setExpandedSubsteps] = useState<Set<number>>(new Set());
  const [completedSubsteps, setCompletedSubsteps] = useState<Set<string>>(new Set());

  function toggleStep(index: number) {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function toggleSubstepsExpanded(index: number) {
    setExpandedSubsteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function toggleSubstep(stepIndex: number, subIndex: number) {
    const key = `${stepIndex}-${subIndex}`;
    setCompletedSubsteps((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="mt-3 border-t border-border/20 pt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full text-left group"
      >
        <div className="flex items-center justify-center w-5 h-5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <GraduationCap className="h-3 w-3 text-primary" />
        </div>
        <span className="text-xs font-semibold text-primary font-display uppercase tracking-wide flex-1">
          Setup Guide
        </span>
        <span className="text-[10px] text-muted-foreground font-body mr-1">
          ~{tutorial.setupMinutes} min
        </span>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5 text-primary" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
      </button>

      {expanded && (
        <div className="mt-3 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Quick action bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={tutorial.signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary hover:bg-primary/20 transition-colors font-body"
            >
              <ArrowRight className="h-3 w-3" />
              Open {toolName}
            </a>
            {tutorial.gettingStartedUrl && (
              <a
                href={tutorial.gettingStartedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/20 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors font-body"
              >
                <ExternalLink className="h-3 w-3" />
                Official Docs
              </a>
            )}
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {tutorial.steps.map((step, index) => {
              const config = ACTION_CONFIG[step.action];
              const Icon = config.icon;
              const isCompleted = completedSteps.has(index);

              return (
                <div
                  key={index}
                  className={`relative rounded-xl border transition-all ${
                    isCompleted
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-background/30 border-border/20 hover:border-border/40"
                  }`}
                >
                  <div className="flex items-start gap-3 p-3">
                    {/* Step number / check */}
                    <button
                      onClick={() => toggleStep(index)}
                      className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold font-display transition-all ${
                        isCompleted
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-card/80 border border-border/30 text-muted-foreground hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        index + 1
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-sm font-display font-semibold ${
                            isCompleted
                              ? "text-emerald-400 line-through opacity-70"
                              : "text-foreground"
                          }`}
                        >
                          {step.title}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${config.bg} ${config.color}`}
                        >
                          <Icon className="h-2.5 w-2.5" />
                          {config.label}
                        </span>
                      </div>
                      <p
                        className={`text-xs leading-relaxed font-body ${
                          isCompleted
                            ? "text-muted-foreground/50"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.description}
                      </p>
                      {step.tip && !isCompleted && (
                        <div className="mt-1.5 flex items-start gap-1.5 px-2 py-1.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
                          <span className="text-[10px] text-amber-400 font-bold font-display shrink-0 mt-px">
                            TIP
                          </span>
                          <span className="text-[11px] text-amber-400/80 font-body leading-relaxed">
                            {step.tip}
                          </span>
                        </div>
                      )}

                      {/* Expandable substeps — use manual if available, auto-generate otherwise */}
                      {(() => {
                        if (isCompleted) return null;
                        const subs = step.substeps && step.substeps.length > 0
                          ? step.substeps
                          : generateSubsteps(step);
                        if (subs.length === 0) return null;

                        return (
                          <div className="mt-2">
                            <button
                              onClick={() => toggleSubstepsExpanded(index)}
                              className="flex items-center gap-1 text-[11px] font-medium text-primary/70 hover:text-primary transition-colors font-body"
                            >
                              <ChevronRight
                                className={`h-3 w-3 transition-transform duration-200 ${
                                  expandedSubsteps.has(index) ? "rotate-90" : ""
                                }`}
                              />
                              {expandedSubsteps.has(index) ? "Hide" : "Show"} detailed steps ({subs.length})
                            </button>

                            {expandedSubsteps.has(index) && (
                              <div className="mt-1.5 ml-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                {subs.map((sub, subIdx) => {
                                  const subKey = `${index}-${subIdx}`;
                                  const subDone = completedSubsteps.has(subKey);
                                  const subConfig = sub.action ? ACTION_CONFIG[sub.action] : null;

                                  return (
                                    <div
                                      key={subIdx}
                                      className={`flex items-start gap-2 px-2.5 py-1.5 rounded-lg transition-all ${
                                        subDone
                                          ? "bg-emerald-500/5"
                                          : "bg-background/20 hover:bg-background/40"
                                      }`}
                                    >
                                      <button
                                        onClick={() => toggleSubstep(index, subIdx)}
                                        className={`shrink-0 flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-bold font-display mt-0.5 transition-all ${
                                          subDone
                                            ? "bg-emerald-500/20 text-emerald-400"
                                            : "bg-card/60 border border-border/30 text-muted-foreground/60 hover:border-primary/40"
                                        }`}
                                      >
                                        {subDone ? (
                                          <CheckCircle2 className="h-2.5 w-2.5" />
                                        ) : (
                                          <span className="text-[7px]">{subIdx + 1}</span>
                                        )}
                                      </button>
                                      <span
                                        className={`text-[11px] font-body leading-relaxed flex-1 ${
                                          subDone
                                            ? "text-muted-foreground/40 line-through"
                                            : "text-muted-foreground/80"
                                        }`}
                                      >
                                        {sub.text}
                                      </span>
                                      {subConfig && !subDone && (
                                        <span className={`shrink-0 text-[8px] font-bold uppercase tracking-wider ${subConfig.color} opacity-50`}>
                                          {subConfig.label}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress */}
          {completedSteps.size > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-card/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500/60 transition-all duration-500"
                  style={{
                    width: `${(completedSteps.size / tutorial.steps.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-body tabular-nums">
                {completedSteps.size}/{tutorial.steps.length}
              </span>
            </div>
          )}

          {/* Video tutorials */}
          {tutorial.videos.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 font-display">
                Video Tutorials
              </p>
              <div className="space-y-1.5">
                {tutorial.videos.map((video, i) => (
                  <a
                    key={i}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20 transition-all group"
                  >
                    <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-red-500/15 group-hover:bg-red-500/25 transition-colors">
                      <Play className="h-3.5 w-3.5 text-red-400 ml-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors font-body truncate block">
                        {video.title}
                      </span>
                      <span className="text-[10px] text-red-400/60 font-body">
                        YouTube
                      </span>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
