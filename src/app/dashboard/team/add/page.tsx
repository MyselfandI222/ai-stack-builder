"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addEmployee } from "@/lib/team-storage";
import { recommendToolsForEmployee } from "@/lib/employee-recommender";
import {
  EmployeeProfile,
  EmployeeRole,
  EMPLOYEE_ROLE_LABELS,
} from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentLinks, ExtractedDocument } from "@/components/document-links";
import {
  Layers,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Check,
  Zap,
  Target,
  Microscope,
  UserPlus,
  SkipForward,
} from "lucide-react";

// --- Answer type ---

interface EmpAnswers {
  name: string;
  email: string;
  role: EmployeeRole | "";
  department: string;
  documents: ExtractedDocument[];
  responsibilities: string;
  dailyTasks: string;
  currentTools: string;
  biggestChallenge: string;
  skills: string;
  experienceLevel: string;
  communicationStyle: string;
  learningStyle: string;
  workHours: string;
  goals: string;
  automateFirst: string;
}

const INITIAL: EmpAnswers = {
  name: "",
  email: "",
  role: "",
  department: "",
  documents: [],
  responsibilities: "",
  dailyTasks: "",
  currentTools: "",
  biggestChallenge: "",
  skills: "",
  experienceLevel: "",
  communicationStyle: "",
  learningStyle: "",
  workHours: "",
  goals: "",
  automateFirst: "",
};

// --- Step definitions ---

type StepKey = keyof EmpAnswers;

interface StepDef {
  key: StepKey;
  title: string;
  subtitle: string;
  optional?: boolean;
}

const ALL_STEPS: StepDef[] = [
  { key: "name", title: "What's this employee's name?", subtitle: "First and last name." },
  { key: "email", title: "What's their email?", subtitle: "For sending tool invites." },
  { key: "role", title: "What's their primary role?", subtitle: "Pick the closest match." },
  { key: "department", title: "What department are they in?", subtitle: "e.g. Marketing, Engineering, Sales..." },
  { key: "documents", title: "Have any documents about this role?", subtitle: "Paste links to job descriptions, org charts, performance reviews, or anything relevant. We'll extract the info.", optional: true },
  { key: "responsibilities", title: "What are their main responsibilities?", subtitle: "Describe what they do day-to-day." },
  { key: "dailyTasks", title: "What tasks do they repeat daily or weekly?", subtitle: "These are prime candidates for AI automation." },
  { key: "currentTools", title: "What tools do they currently use?", subtitle: "Software, apps, platforms — anything they work with.", optional: true },
  { key: "biggestChallenge", title: "What's their biggest bottleneck?", subtitle: "What slows them down the most?" },
  { key: "skills", title: "What are their top skills?", subtitle: "e.g. Writing, data analysis, project management...", optional: true },
  { key: "experienceLevel", title: "What's their experience level?", subtitle: "How senior are they?" },
  { key: "communicationStyle", title: "How do they prefer to communicate?", subtitle: "Helps recommend the right tools." },
  { key: "learningStyle", title: "How do they learn best?", subtitle: "Video, docs, hands-on? Affects onboarding.", optional: true },
  { key: "workHours", title: "What are their typical work hours?", subtitle: "e.g. 9-5, flexible, night shift...", optional: true },
  { key: "goals", title: "What should this employee accomplish in the next 90 days?", subtitle: "These will become goals on their dashboard.", optional: true },
  { key: "automateFirst", title: "If you could automate one thing for them, what would it be?", subtitle: "What eats up most of their time?", optional: true },
];

// --- Depth modes ---

type Depth = "quick" | "standard" | "detailed";

const QUICK_KEYS: StepKey[] = ["name", "email", "role", "department", "responsibilities"];
const STANDARD_KEYS: StepKey[] = [
  "name", "email", "role", "department", "documents", "responsibilities",
  "dailyTasks", "currentTools", "biggestChallenge", "skills",
];
const DETAILED_KEYS: StepKey[] = ALL_STEPS.map((s) => s.key);

const DEPTH_MAP: Record<Depth, StepKey[]> = {
  quick: QUICK_KEYS,
  standard: STANDARD_KEYS,
  detailed: DETAILED_KEYS,
};

const EXPERIENCE_LEVELS = ["Junior (0-2 years)", "Mid-Level (2-5 years)", "Senior (5-10 years)", "Lead / Manager", "Executive"];
const COMM_STYLES = ["Async (Slack, Email)", "Sync (Calls, Meetings)", "Written docs / wikis", "Mix of everything"];
const LEARNING_STYLES = ["Video tutorials", "Written documentation", "Hands-on trial and error", "1-on-1 coaching", "Self-paced courses"];

const ROLES = Object.entries(EMPLOYEE_ROLE_LABELS) as [EmployeeRole, string][];

export default function AddEmployeePage() {
  const router = useRouter();
  const [depth, setDepth] = useState<Depth | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<EmpAnswers>(INITIAL);

  const activeKeys = depth ? DEPTH_MAP[depth] : [];
  const activeSteps = activeKeys.map((key) => ALL_STEPS.find((s) => s.key === key)!);
  const currentStep = activeSteps[step];
  const totalSteps = activeSteps.length;
  const progress = totalSteps > 0 ? ((step + 1) / totalSteps) * 100 : 0;
  const isOptional = currentStep?.optional === true;

  function update<K extends keyof EmpAnswers>(key: K, value: EmpAnswers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function canAdvance(): boolean {
    if (!currentStep) return false;
    switch (currentStep.key) {
      case "name": return answers.name.trim().length >= 2;
      case "email": return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email);
      case "role": return answers.role !== "";
      case "department": return answers.department.trim().length >= 2;
      case "documents": return true; // always optional
      case "responsibilities": return answers.responsibilities.trim().length >= 10;
      case "dailyTasks": return answers.dailyTasks.trim().length >= 10;
      case "biggestChallenge": return answers.biggestChallenge.trim().length >= 10;
      case "experienceLevel": return answers.experienceLevel !== "";
      case "communicationStyle": return answers.communicationStyle !== "";
      default: return true;
    }
  }

  function handleNext() {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Done — create the employee
      const role = answers.role as EmployeeRole;
      // Merge document text into answers so the recommender can use it
      const enrichedAnswers = { ...answers } as Record<string, unknown>;
      if (answers.documents.length > 0) {
        const docText = answers.documents.map((d) => d.text).join("\n");
        enrichedAnswers.responsibilities = `${answers.responsibilities}\n\nFrom documents: ${docText}`;
        enrichedAnswers.dailyTasks = `${answers.dailyTasks}\n\nFrom documents: ${docText}`;
      }
      const tools = recommendToolsForEmployee(role, enrichedAnswers);

      // Parse goals from the text answer
      const goalTexts = answers.goals
        .split(/[,;\n]/)
        .map((g) => g.trim())
        .filter((g) => g.length > 0);

      const employee: EmployeeProfile = {
        id: crypto.randomUUID(),
        name: answers.name.trim(),
        email: answers.email.trim(),
        role,
        department: answers.department.trim(),
        answers: { ...answers },
        recommendedTools: tools,
        goals: goalTexts.map((title) => ({
          id: crypto.randomUUID(),
          title,
          description: "",
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "not-started" as const,
          createdAt: new Date().toISOString(),
        })),
        activityLog: [],
        createdAt: new Date().toISOString(),
      };

      addEmployee(employee);
      router.push(`/dashboard/team/${employee.id}`);
    }
  }

  function handleSkip() {
    if (step < totalSteps - 1) setStep(step + 1);
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
    else { setDepth(null); setStep(0); }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey && canAdvance()) {
      e.preventDefault();
      handleNext();
    }
  }

  // --- Render helpers ---

  type StringKeys = Exclude<keyof EmpAnswers, "documents" | "role">;

  function renderTextInput(key: StringKeys, placeholder: string) {
    return (
      <input
        type="text"
        className="w-full bg-background/50 border border-border/30 rounded-xl p-4 text-base font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
        placeholder={placeholder}
        value={answers[key]}
        onChange={(e) => update(key, e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    );
  }

  function renderTextarea(key: StringKeys, placeholder: string) {
    return (
      <textarea
        className="w-full resize-y bg-background/50 border border-border/30 rounded-xl p-4 text-base leading-relaxed font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
        placeholder={placeholder}
        value={answers[key]}
        onChange={(e) => update(key, e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        style={{ minHeight: "100px" }}
      />
    );
  }

  function renderSingleSelect(key: StringKeys, options: string[]) {
    return (
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => update(key, option)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-body font-medium transition-all duration-200 border ${
              answers[key] === option
                ? "bg-foreground text-background border-foreground"
                : "bg-background/30 border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }

  function renderStepContent() {
    if (!currentStep) return null;
    switch (currentStep.key) {
      case "name": return renderTextInput("name", "e.g. Sarah Johnson");
      case "email": return renderTextInput("email", "e.g. sarah@company.com");
      case "role":
        return (
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map(([value, label]) => (
              <button
                key={value}
                onClick={() => update("role", value)}
                className={`px-4 py-3 rounded-xl text-sm font-body font-medium text-left transition-all duration-200 border ${
                  answers.role === value
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background/30 border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        );
      case "department": return renderTextInput("department", "e.g. Marketing, Engineering, Product...");
      case "documents":
        return (
          <DocumentLinks
            documents={answers.documents}
            onChange={(docs) => update("documents", docs)}
          />
        );
      case "responsibilities": return renderTextarea("responsibilities", "e.g. Manages paid ad campaigns, writes blog content, tracks marketing KPIs...");
      case "dailyTasks": return renderTextarea("dailyTasks", "e.g. Writes 2-3 social media posts, responds to customer emails, updates CRM with leads...");
      case "currentTools": return renderTextarea("currentTools", "e.g. Google Docs, Slack, HubSpot, Figma, Notion...");
      case "biggestChallenge": return renderTextarea("biggestChallenge", "e.g. Spends too much time writing reports manually, can't keep up with support tickets...");
      case "skills": return renderTextInput("skills", "e.g. Copywriting, Data analysis, Project management, Design...");
      case "experienceLevel": return renderSingleSelect("experienceLevel", EXPERIENCE_LEVELS);
      case "communicationStyle": return renderSingleSelect("communicationStyle", COMM_STYLES);
      case "learningStyle": return renderSingleSelect("learningStyle", LEARNING_STYLES);
      case "workHours": return renderTextInput("workHours", "e.g. 9-5 EST, Flexible, Night shift...");
      case "goals": return renderTextarea("goals", "e.g. Close 20 deals this quarter, Reduce response time to under 1 hour, Launch 3 blog posts per week... (separate with commas or new lines)");
      case "automateFirst": return renderTextarea("automateFirst", "e.g. Writing weekly status reports, scheduling social media, customer follow-up emails...");
    }
  }

  // --- Depth selector ---

  if (depth === null) {
    return (
      <div className="min-h-screen">
        <nav className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border/20 z-50 flex items-center">
          <div className="max-w-3xl mx-auto px-6 w-full flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <Layers className="h-5 w-5 text-primary" />
              <span className="font-display font-bold text-foreground text-base tracking-tight">
                AI<span className="text-primary">Stack</span>
              </span>
            </a>
            <button onClick={() => router.push("/dashboard/team")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-body transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Team
            </button>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-6 pt-28 pb-12 space-y-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-primary" />
              Add New Employee
            </h1>
            <p className="text-muted-foreground font-body mt-1">
              Choose how much detail you want to provide. More detail = better AI tool recommendations.
            </p>
          </div>

          <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 space-y-3">
              {[
                { mode: "quick" as Depth, label: "Quick", count: QUICK_KEYS.length, desc: "Name, email, role. Fast setup with broad recommendations.", icon: Zap },
                { mode: "standard" as Depth, label: "Standard", count: STANDARD_KEYS.length, desc: "Tasks, tools, skills. Better-tailored tool assignments.", icon: Target, recommended: true },
                { mode: "detailed" as Depth, label: "Detailed", count: DETAILED_KEYS.length, desc: "Full profile with goals, learning style, automation targets.", icon: Microscope },
              ].map(({ mode, label, count, desc, icon: Icon, recommended }) => (
                <button
                  key={mode}
                  onClick={() => { setDepth(mode); setStep(0); setAnswers(INITIAL); }}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 group ${
                    recommended
                      ? "border-primary/40 bg-primary/5 hover:border-primary/60 hover:bg-primary/10"
                      : "border-border/30 bg-background/30 hover:border-primary/30 hover:bg-background/60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 p-2.5 rounded-lg transition-colors ${recommended ? "bg-primary/15 text-primary" : "bg-secondary/50 text-muted-foreground group-hover:text-foreground"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-body font-semibold text-foreground text-base">{label}</span>
                        <span className="text-xs font-body font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">{count} questions</span>
                        {recommended && (
                          <span className="text-xs font-body font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Recommended</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground font-body mt-1">{desc}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-foreground mt-1 transition-colors" />
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // --- Question steps ---

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border/20 z-50 flex items-center">
        <div className="max-w-3xl mx-auto px-6 w-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <Layers className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-foreground text-base tracking-tight">
              AI<span className="text-primary">Stack</span>
            </span>
          </a>
          <button onClick={() => router.push("/dashboard/team")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-body transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Team
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-12">
        <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-muted-foreground font-body font-medium tabular-nums">
                {step + 1}/{totalSteps}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-display">{currentStep?.title}</CardTitle>
              {isOptional && (
                <span className="text-xs font-body text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">optional</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground font-body mt-1">{currentStep?.subtitle}</p>
          </CardHeader>

          <CardContent className="space-y-5">
            {renderStepContent()}

            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="h-12 px-5 rounded-full border border-border/30 text-muted-foreground hover:text-foreground hover:border-foreground/30 font-body font-medium text-sm transition-all duration-300 flex items-center gap-1.5">
                <ChevronLeft className="h-4 w-4" /> Back
              </button>

              {isOptional && (
                <button onClick={handleSkip} className="h-12 px-5 rounded-full border border-border/30 text-muted-foreground hover:text-foreground hover:border-foreground/30 font-body font-medium text-sm transition-all duration-300 flex items-center gap-1.5">
                  Skip <SkipForward className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={!canAdvance()}
                className="flex-1 h-12 rounded-full bg-foreground text-background font-body font-semibold text-sm btn-lift disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {step < totalSteps - 1 ? (
                    <> Next <ChevronRight className="h-4 w-4" /> </>
                  ) : (
                    <> <Check className="h-4 w-4" /> Create Employee Profile </>
                  )}
                </span>
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
