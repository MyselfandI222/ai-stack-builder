"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Zap,
  Target,
  Microscope,
  SkipForward,
} from "lucide-react";

interface BusinessInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (combinedText: string, budget: number) => void;
  isLoading: boolean;
}

interface Answers {
  description: string;
  businessModel: string;
  businessModelOther: string;
  budget: number;
  productService: string;
  targetAudience: string;
  teamSize: string;
  operations: string[];
  topGoal: string;
  biggestChallenge: string;
  stage: string;
  customerAcquisition: string;
  revenueModel: string;
  pricePoint: string;
  marketingChannels: string[];
  supportCurrently: string;
  currentTools: string;
  differentiator: string;
  competitors: string;
  revenueGoal: string;
  salesProcess: string;
  contentTypes: string[];
  currentCustomerCount: string;
  automateFirst: string;
}

const INITIAL_ANSWERS: Answers = {
  description: "",
  businessModel: "",
  businessModelOther: "",
  budget: 500,
  productService: "",
  targetAudience: "",
  teamSize: "",
  operations: [],
  topGoal: "",
  biggestChallenge: "",
  stage: "",
  customerAcquisition: "",
  revenueModel: "",
  pricePoint: "",
  marketingChannels: [],
  supportCurrently: "",
  currentTools: "",
  differentiator: "",
  competitors: "",
  revenueGoal: "",
  salesProcess: "",
  contentTypes: [],
  currentCustomerCount: "",
  automateFirst: "",
};

// --- Option lists ---

const BUSINESS_MODELS = [
  "B2B SaaS",
  "DTC Ecommerce",
  "Agency / Consultancy",
  "Marketplace",
  "Service Business",
  "Content / Media",
  "Non-Profit",
  "Other",
];

const TEAM_SIZES = [
  "Solo (just me)",
  "2-5 people",
  "6-15 people",
  "16-50 people",
  "50+ people",
];

const STAGES = [
  "Just an idea",
  "Pre-launch / building",
  "Just launched (< 6 months)",
  "Growing (6 months - 2 years)",
  "Established (2+ years)",
];

const OPERATIONS = [
  { id: "marketing", label: "Marketing & Ads" },
  { id: "content-creation", label: "Content Creation" },
  { id: "customer-support", label: "Customer Support" },
  { id: "operations", label: "Operations & Workflow" },
  { id: "sales", label: "Sales & CRM" },
  { id: "admin", label: "Admin & Productivity" },
  { id: "analytics", label: "Analytics & Data" },
];

const REVENUE_MODELS = [
  "Subscription / recurring",
  "One-time purchases",
  "Freemium + upsell",
  "Commission / marketplace fee",
  "Hourly / project billing",
  "Ad-supported",
  "Not sure yet",
];

const MARKETING_CHANNELS = [
  { id: "social", label: "Social Media" },
  { id: "seo", label: "SEO / Blog" },
  { id: "paid-ads", label: "Paid Ads (Google, Meta)" },
  { id: "email", label: "Email Marketing" },
  { id: "influencer", label: "Influencer / Creator" },
  { id: "referral", label: "Referral / Word of Mouth" },
  { id: "outbound", label: "Cold Outreach / Outbound" },
  { id: "events", label: "Events / Webinars" },
  { id: "partnerships", label: "Partnerships / Affiliates" },
];

const SALES_PROCESSES = [
  "Self-serve (customers buy online)",
  "Demo / sales call required",
  "Outbound prospecting + closing",
  "Inbound leads + nurturing",
  "Freemium → upgrade path",
  "Not sure / haven't built one yet",
];

const CONTENT_TYPES = [
  { id: "blog", label: "Blog / Articles" },
  { id: "social-posts", label: "Social Media Posts" },
  { id: "video", label: "Video Content" },
  { id: "email-campaigns", label: "Email Campaigns" },
  { id: "podcast", label: "Podcast" },
  { id: "case-studies", label: "Case Studies" },
  { id: "ads-copy", label: "Ad Copy" },
  { id: "documentation", label: "Docs / Help Center" },
];

const CUSTOMER_COUNTS = [
  "0 — pre-launch",
  "1-10",
  "11-100",
  "101-1,000",
  "1,000-10,000",
  "10,000+",
];

// --- Step definitions ---

type StepKey = keyof Answers;

interface StepDef {
  key: StepKey;
  title: string;
  subtitle: string;
  optional?: boolean;
}

const ALL_STEPS: StepDef[] = [
  {
    key: "description",
    title: "What does your business do?",
    subtitle: "Describe it in one or two sentences.",
  },
  {
    key: "businessModel",
    title: "What's your business model?",
    subtitle: "Pick the closest match.",
  },
  {
    key: "budget",
    title: "What's your monthly budget for AI tools?",
    subtitle: "We'll optimize your tool stack to fit within this budget.",
  },
  {
    key: "productService",
    title: "What product or service do you sell?",
    subtitle: "Be specific — e.g. 'handmade candles' or 'project management software'.",
  },
  {
    key: "targetAudience",
    title: "Who is your target customer?",
    subtitle: "Be as specific as you can (e.g. 'small restaurant owners in the US').",
  },
  {
    key: "teamSize",
    title: "How big is your team?",
    subtitle: "This helps us recommend the right scale of operations.",
  },
  {
    key: "operations",
    title: "Which areas of your business need help?",
    subtitle: "Select all that apply.",
  },
  {
    key: "topGoal",
    title: "What's your #1 goal for the next 3 months?",
    subtitle: "e.g. 'Get first 100 customers' or 'Launch version 2 of our product'.",
  },
  {
    key: "biggestChallenge",
    title: "What's your biggest challenge right now?",
    subtitle: "What's slowing you down the most?",
  },
  {
    key: "stage",
    title: "What stage is your business at?",
    subtitle: "Where are you on the journey?",
  },
  {
    key: "customerAcquisition",
    title: "How do customers find you currently?",
    subtitle: "Describe your current customer acquisition — even if it's just word of mouth.",
    optional: true,
  },
  {
    key: "revenueModel",
    title: "How do you make money?",
    subtitle: "Pick your revenue model.",
  },
  {
    key: "pricePoint",
    title: "What's your price point or average deal size?",
    subtitle: "e.g. '$29/month', '$5,000 per project', '$15 per item'.",
    optional: true,
  },
  {
    key: "marketingChannels",
    title: "Which marketing channels do you want to use?",
    subtitle: "Select all that you plan to invest in.",
  },
  {
    key: "supportCurrently",
    title: "How do you handle customer support today?",
    subtitle: "e.g. 'Email only', 'Live chat on our site', 'We don't have support yet'.",
    optional: true,
  },
  {
    key: "currentTools",
    title: "What tools or software do you currently use?",
    subtitle: "List anything relevant — even spreadsheets count.",
    optional: true,
  },
  {
    key: "differentiator",
    title: "What makes you different from competitors?",
    subtitle: "Your unique selling point — why should customers choose you?",
    optional: true,
  },
  {
    key: "competitors",
    title: "Who are your top 2-3 competitors?",
    subtitle: "Names or descriptions — helps us understand your market.",
    optional: true,
  },
  {
    key: "revenueGoal",
    title: "What's your revenue goal for the next 12 months?",
    subtitle: "e.g. '$10K/month', '$500K annual', 'Break even'.",
    optional: true,
  },
  {
    key: "salesProcess",
    title: "What does your sales process look like?",
    subtitle: "How do leads become paying customers?",
  },
  {
    key: "contentTypes",
    title: "What types of content do you need to produce?",
    subtitle: "Select all that apply.",
    optional: true,
  },
  {
    key: "currentCustomerCount",
    title: "How many customers or users do you have right now?",
    subtitle: "Helps us calibrate the right scale of operations.",
  },
  {
    key: "automateFirst",
    title: "If you could automate one thing tomorrow, what would it be?",
    subtitle: "Think about what eats up the most time or money.",
    optional: true,
  },
];

// --- Depth modes ---

type DepthMode = "quick" | "standard" | "detailed";

const QUICK_KEYS: StepKey[] = [
  "description",
  "businessModel",
  "budget",
  "targetAudience",
  "teamSize",
  "operations",
  "topGoal",
  "biggestChallenge",
];

const STANDARD_KEYS: StepKey[] = [
  "description",
  "businessModel",
  "budget",
  "productService",
  "targetAudience",
  "teamSize",
  "operations",
  "topGoal",
  "biggestChallenge",
  "stage",
  "customerAcquisition",
  "revenueModel",
  "pricePoint",
  "marketingChannels",
  "supportCurrently",
  "currentTools",
];

const DETAILED_KEYS: StepKey[] = [
  "description",
  "businessModel",
  "budget",
  "productService",
  "targetAudience",
  "teamSize",
  "operations",
  "topGoal",
  "biggestChallenge",
  "stage",
  "customerAcquisition",
  "revenueModel",
  "pricePoint",
  "marketingChannels",
  "supportCurrently",
  "currentTools",
  "differentiator",
  "competitors",
  "revenueGoal",
  "salesProcess",
  "contentTypes",
  "currentCustomerCount",
  "automateFirst",
];

const DEPTH_STEPS: Record<DepthMode, StepKey[]> = {
  quick: QUICK_KEYS,
  standard: STANDARD_KEYS,
  detailed: DETAILED_KEYS,
};

const DEPTH_OPTIONS: {
  mode: DepthMode;
  label: string;
  questions: number;
  description: string;
  icon: typeof Zap;
  recommended?: boolean;
}[] = [
  {
    mode: "quick",
    label: "Quick",
    questions: QUICK_KEYS.length,
    description: "The essentials. Fast overview, broad recommendations.",
    icon: Zap,
  },
  {
    mode: "standard",
    label: "Standard",
    questions: STANDARD_KEYS.length,
    description:
      "Revenue, marketing, support, and tools for a well-tailored plan.",
    icon: Target,
    recommended: true,
  },
  {
    mode: "detailed",
    label: "Detailed",
    questions: DETAILED_KEYS.length,
    description:
      "Competitors, sales, content, revenue goals. Most precise results.",
    icon: Microscope,
  },
];

// --- Build the combined paragraph ---

function buildBusinessIdea(answers: Answers): string {
  const model =
    answers.businessModel === "Other"
      ? answers.businessModelOther
      : answers.businessModel;

  const ops = answers.operations
    .map((id) => OPERATIONS.find((o) => o.id === id)?.label)
    .filter(Boolean)
    .join(", ");

  const channels = answers.marketingChannels
    .map((id) => MARKETING_CHANNELS.find((c) => c.id === id)?.label)
    .filter(Boolean)
    .join(", ");

  const content = answers.contentTypes
    .map((id) => CONTENT_TYPES.find((c) => c.id === id)?.label)
    .filter(Boolean)
    .join(", ");

  const parts = [
    answers.description.trim(),
    model ? `Business model: ${model}.` : "",
    answers.productService.trim()
      ? `Product/service: ${answers.productService.trim()}.`
      : "",
    answers.targetAudience.trim()
      ? `Target audience: ${answers.targetAudience.trim()}.`
      : "",
    answers.teamSize ? `Team size: ${answers.teamSize}.` : "",
    ops ? `Areas that need help: ${ops}.` : "",
    answers.topGoal.trim()
      ? `#1 goal for next 3 months: ${answers.topGoal.trim()}.`
      : "",
    answers.biggestChallenge.trim()
      ? `Biggest challenge: ${answers.biggestChallenge.trim()}.`
      : "",
    answers.stage ? `Stage: ${answers.stage}.` : "",
    answers.customerAcquisition.trim()
      ? `Current customer acquisition: ${answers.customerAcquisition.trim()}.`
      : "",
    answers.revenueModel ? `Revenue model: ${answers.revenueModel}.` : "",
    answers.pricePoint.trim()
      ? `Price point: ${answers.pricePoint.trim()}.`
      : "",
    channels ? `Marketing channels: ${channels}.` : "",
    answers.supportCurrently.trim()
      ? `Current support setup: ${answers.supportCurrently.trim()}.`
      : "",
    answers.currentTools.trim()
      ? `Currently using: ${answers.currentTools.trim()}.`
      : "",
    answers.differentiator.trim()
      ? `Differentiator: ${answers.differentiator.trim()}.`
      : "",
    answers.competitors.trim()
      ? `Competitors: ${answers.competitors.trim()}.`
      : "",
    answers.revenueGoal.trim()
      ? `Revenue goal (12 months): ${answers.revenueGoal.trim()}.`
      : "",
    answers.salesProcess ? `Sales process: ${answers.salesProcess}.` : "",
    content ? `Content types needed: ${content}.` : "",
    answers.currentCustomerCount
      ? `Current customer count: ${answers.currentCustomerCount}.`
      : "",
    answers.automateFirst.trim()
      ? `Would automate first: ${answers.automateFirst.trim()}.`
      : "",
    `Monthly AI tool budget: $${answers.budget}.`,
  ];

  return parts.filter(Boolean).join(" ");
}

// --- Component ---

export function BusinessInput({
  value: _value,
  onChange,
  onSubmit,
  isLoading,
}: BusinessInputProps) {
  const [depth, setDepth] = useState<DepthMode | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);

  const activeStepKeys = depth ? DEPTH_STEPS[depth] : [];
  const activeSteps = activeStepKeys.map(
    (key) => ALL_STEPS.find((s) => s.key === key)!
  );
  const currentStep = activeSteps[step];
  const totalSteps = activeSteps.length;
  const progress = totalSteps > 0 ? ((step + 1) / totalSteps) * 100 : 0;

  const isOptional = currentStep?.optional === true;

  function update<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function canAdvance(): boolean {
    if (!currentStep) return false;
    switch (currentStep.key) {
      case "description":
        return answers.description.trim().length >= 10;
      case "businessModel":
        return (
          answers.businessModel !== "" &&
          (answers.businessModel !== "Other" ||
            answers.businessModelOther.trim().length > 0)
        );
      case "budget":
        return true;
      case "productService":
        return answers.productService.trim().length >= 5;
      case "targetAudience":
        return answers.targetAudience.trim().length >= 5;
      case "teamSize":
        return answers.teamSize !== "";
      case "operations":
        return answers.operations.length > 0;
      case "topGoal":
        return answers.topGoal.trim().length >= 10;
      case "biggestChallenge":
        return answers.biggestChallenge.trim().length >= 10;
      case "stage":
        return answers.stage !== "";
      case "customerAcquisition":
        return answers.customerAcquisition.trim().length >= 5;
      case "revenueModel":
        return answers.revenueModel !== "";
      case "pricePoint":
        return answers.pricePoint.trim().length >= 2;
      case "marketingChannels":
        return answers.marketingChannels.length > 0;
      case "supportCurrently":
        return answers.supportCurrently.trim().length >= 5;
      case "currentTools":
        return true;
      case "differentiator":
        return answers.differentiator.trim().length >= 10;
      case "competitors":
        return answers.competitors.trim().length >= 3;
      case "revenueGoal":
        return answers.revenueGoal.trim().length >= 3;
      case "salesProcess":
        return answers.salesProcess !== "";
      case "contentTypes":
        return answers.contentTypes.length > 0;
      case "currentCustomerCount":
        return answers.currentCustomerCount !== "";
      case "automateFirst":
        return answers.automateFirst.trim().length >= 10;
      default:
        return true;
    }
  }

  function handleNext() {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      const combined = buildBusinessIdea(answers);
      onChange(combined);
      onSubmit(combined, answers.budget);
    }
  }

  function handleSkip() {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  }

  function handleBack() {
    if (step > 0) {
      setStep(step - 1);
    } else {
      setDepth(null);
      setStep(0);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey && canAdvance()) {
      e.preventDefault();
      handleNext();
    }
  }

  // --- Rendering helpers ---

  function renderTextInput(key: keyof Answers, placeholder: string) {
    return (
      <input
        type="text"
        className="w-full bg-background/50 border border-border/30 rounded-xl p-4 text-base font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
        placeholder={placeholder}
        value={answers[key] as string}
        onChange={(e) => update(key, e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        autoFocus
      />
    );
  }

  function renderTextarea(key: keyof Answers, placeholder: string, minH = "100px") {
    return (
      <textarea
        className="w-full resize-y bg-background/50 border border-border/30 rounded-xl p-4 text-base leading-relaxed font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
        placeholder={placeholder}
        value={answers[key] as string}
        onChange={(e) => update(key, e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        autoFocus
        style={{ minHeight: minH }}
      />
    );
  }

  function renderSingleSelect(key: keyof Answers, options: string[], layout: "grid" | "list" = "grid") {
    const containerClass = layout === "grid" ? "grid grid-cols-2 gap-2" : "space-y-2";
    const buttonClass = layout === "list" ? "w-full text-left" : "text-left";
    return (
      <div className={containerClass}>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => update(key, option)}
            disabled={isLoading}
            className={`px-4 py-3 rounded-xl text-sm font-body font-medium transition-all duration-200 border ${buttonClass} ${
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

  function renderMultiSelect(key: keyof Answers, options: { id: string; label: string }[]) {
    const selected = answers[key] as string[];
    return (
      <div className="grid grid-cols-2 gap-2">
        {options.map((op) => {
          const isSelected = selected.includes(op.id);
          return (
            <button
              key={op.id}
              onClick={() => {
                const next = isSelected
                  ? selected.filter((o) => o !== op.id)
                  : [...selected, op.id];
                update(key, next as Answers[typeof key]);
              }}
              disabled={isLoading}
              className={`px-4 py-3 rounded-xl text-sm font-body font-medium text-left transition-all duration-200 border flex items-center gap-2 ${
                isSelected
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background/30 border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              <span
                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                  isSelected ? "bg-background border-background" : "border-current opacity-40"
                }`}
              >
                {isSelected && <Check className="h-3 w-3 text-foreground" />}
              </span>
              {op.label}
            </button>
          );
        })}
      </div>
    );
  }

  function renderBudgetStep() {
    const BUDGET_PRESETS = [50, 100, 250, 500, 1000, 2000];
    return (
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-4xl font-display font-bold text-foreground tabular-nums">
            ${answers.budget.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-sm ml-1 font-body">/month</span>
        </div>
        <input
          type="range"
          min={0}
          max={2000}
          step={10}
          value={answers.budget}
          onChange={(e) => update("budget", Number(e.target.value))}
          disabled={isLoading}
          className="w-full h-2 bg-secondary/50 rounded-full appearance-none cursor-pointer accent-foreground"
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
              onClick={() => update("budget", preset)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                answers.budget === preset
                  ? "bg-foreground text-background"
                  : "bg-secondary/50 text-secondary-foreground hover:bg-secondary"
              } disabled:opacity-50`}
            >
              ${preset.toLocaleString()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- Render step content ---

  function renderStepContent() {
    if (!currentStep) return null;
    switch (currentStep.key) {
      case "description":
        return renderTextarea("description", "e.g. An online platform that connects freelance designers with small businesses...");
      case "businessModel":
        return (
          <div className="space-y-3">
            {renderSingleSelect("businessModel", BUSINESS_MODELS)}
            {answers.businessModel === "Other" && (
              <input
                type="text"
                className="w-full bg-background/50 border border-border/30 rounded-xl p-4 text-base font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                placeholder="Describe your business model..."
                value={answers.businessModelOther}
                onChange={(e) => update("businessModelOther", e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            )}
          </div>
        );
      case "budget":
        return renderBudgetStep();
      case "productService":
        return renderTextInput("productService", "e.g. Handmade soy candles, SaaS project management tool, marketing consulting...");
      case "targetAudience":
        return renderTextInput("targetAudience", "e.g. Small business owners in the US with 1-10 employees...");
      case "teamSize":
        return renderSingleSelect("teamSize", TEAM_SIZES, "list");
      case "operations":
        return renderMultiSelect("operations", OPERATIONS);
      case "topGoal":
        return renderTextInput("topGoal", "e.g. Get first 100 paying customers, Launch our mobile app, Hit $10K MRR...");
      case "biggestChallenge":
        return renderTextarea("biggestChallenge", "e.g. Spending too much time on manual tasks, can't figure out marketing, no consistent sales pipeline...");
      case "stage":
        return renderSingleSelect("stage", STAGES, "list");
      case "customerAcquisition":
        return renderTextarea("customerAcquisition", "e.g. Mostly word of mouth, some Instagram posts, tried Google Ads but it was too expensive...", "80px");
      case "revenueModel":
        return renderSingleSelect("revenueModel", REVENUE_MODELS, "list");
      case "pricePoint":
        return renderTextInput("pricePoint", "e.g. $29/month, $5,000 per project, $15 per item...");
      case "marketingChannels":
        return renderMultiSelect("marketingChannels", MARKETING_CHANNELS);
      case "supportCurrently":
        return renderTextInput("supportCurrently", "e.g. Just email, live chat on website, phone support, nothing yet...");
      case "currentTools":
        return renderTextarea("currentTools", "e.g. Google Sheets, Mailchimp, Slack, Notion, Shopify... (leave blank if none)", "80px");
      case "differentiator":
        return renderTextarea("differentiator", "e.g. We're the only platform that does X, our prices are 50% lower, we focus exclusively on Y market...");
      case "competitors":
        return renderTextarea("competitors", "e.g. Competitor A (big but slow), Competitor B (cheap but limited), Competitor C (direct rival)...", "80px");
      case "revenueGoal":
        return renderTextInput("revenueGoal", "e.g. $10K/month, $500K annual, break even, $1M ARR...");
      case "salesProcess":
        return renderSingleSelect("salesProcess", SALES_PROCESSES, "list");
      case "contentTypes":
        return renderMultiSelect("contentTypes", CONTENT_TYPES);
      case "currentCustomerCount":
        return renderSingleSelect("currentCustomerCount", CUSTOMER_COUNTS, "grid");
      case "automateFirst":
        return renderTextarea("automateFirst", "e.g. Social media scheduling, customer follow-up emails, invoice generation, lead qualification...");
    }
  }

  // --- Depth selector screen ---

  if (depth === null) {
    return (
      <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-display">
            How detailed do you want to go?
          </CardTitle>
          <p className="text-sm text-muted-foreground font-body mt-1">
            More questions means a more specific business breakdown.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {DEPTH_OPTIONS.map(({ mode, label, questions, description, icon: Icon, recommended }) => (
            <button
              key={mode}
              onClick={() => {
                setDepth(mode);
                setStep(0);
                setAnswers(INITIAL_ANSWERS);
              }}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 group ${
                recommended
                  ? "border-primary/40 bg-primary/5 hover:border-primary/60 hover:bg-primary/10"
                  : "border-border/30 bg-background/30 hover:border-primary/30 hover:bg-background/60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`mt-0.5 p-2.5 rounded-lg transition-colors ${
                    recommended
                      ? "bg-primary/15 text-primary"
                      : "bg-secondary/50 text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-body font-semibold text-foreground text-base">
                      {label}
                    </span>
                    <span className="text-xs font-body font-medium text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                      {questions} questions
                    </span>
                    {recommended && (
                      <span className="text-xs font-body font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-body mt-1 leading-relaxed">
                    {description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-foreground mt-1 transition-colors" />
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    );
  }

  // --- Question steps ---

  return (
    <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-1.5 bg-secondary/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-body font-medium tabular-nums">
            {step + 1}/{totalSteps}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-display">
            {currentStep?.title}
          </CardTitle>
          {isOptional && (
            <span className="text-xs font-body text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
              optional
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground font-body mt-1">
          {currentStep?.subtitle}
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {renderStepContent()}

        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            disabled={isLoading}
            className="h-12 px-5 rounded-full border border-border/30 text-muted-foreground hover:text-foreground hover:border-foreground/30 font-body font-medium text-sm transition-all duration-300 flex items-center gap-1.5 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          {isOptional && (
            <button
              onClick={handleSkip}
              disabled={isLoading}
              className="h-12 px-5 rounded-full border border-border/30 text-muted-foreground hover:text-foreground hover:border-foreground/30 font-body font-medium text-sm transition-all duration-300 flex items-center gap-1.5 disabled:opacity-50"
            >
              Skip
              <SkipForward className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={isLoading || !canAdvance()}
            className="flex-1 h-12 rounded-full bg-foreground text-background font-body font-semibold text-sm btn-lift disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Building your business plan...
                </>
              ) : step < totalSteps - 1 ? (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate My Business Breakdown
                </>
              )}
            </span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
