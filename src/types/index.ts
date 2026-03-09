export type ToolCategory =
  | "marketing"
  | "content-creation"
  | "customer-support"
  | "operations"
  | "sales"
  | "admin"
  | "analytics";

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  marketing: "Marketing",
  "content-creation": "Content Creation",
  "customer-support": "Customer Support",
  operations: "Operations",
  sales: "Sales",
  admin: "Admin & Productivity",
  analytics: "Analytics & Data",
};

export const CATEGORY_ICONS: Record<ToolCategory, string> = {
  marketing: "Megaphone",
  "content-creation": "Palette",
  "customer-support": "Headphones",
  operations: "Settings",
  sales: "TrendingUp",
  admin: "FolderKanban",
  analytics: "BarChart3",
};

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  monthlyCost: number;
  hasFreeTier: boolean;
  freeTierLimits?: string;
  useCaseTags: string[];
  website: string;
  tier: "essential" | "recommended" | "nice-to-have";
  /** Tools in the same competitor group are mutually exclusive — only one will be selected */
  competitorGroup?: string;
}

export interface CategoryAnalysis {
  category: ToolCategory;
  relevanceScore: number; // 0-100
  reasoning: string;
  suggestedTasks: string[];
}

// --- Business Breakdown types ---

export interface PlaybookSection {
  department: string;
  priority: "critical" | "high" | "medium" | "low";
  overview: string;
  weeklyTasks: string[];
  monthlyTasks: string[];
  kpis: string[];
  howToStart: string;
}

export interface ActionItem {
  task: string;
  timeline: string; // e.g. "Week 1-2", "Month 1", "Month 2-3"
  priority: "critical" | "high" | "medium";
  department: string;
}

export interface BusinessBreakdown {
  executiveSummary: string;
  revenueStrategy: string;
  growthStrategy: string;
  operationsPlaybook: PlaybookSection[];
  ninetyDayPlan: ActionItem[];
  keyMetrics: string[];
  teamRecommendations: string;
  risks: string[];
}

// ---

export interface BusinessAnalysis {
  businessType: string;
  businessSummary: string;
  categories: CategoryAnalysis[];
  keyAutomationOpportunities: string[];
  businessBreakdown: BusinessBreakdown;
}

export interface SelectedTool extends AITool {
  relevanceScore: number;
  whyRecommended: string;
}

export interface StackRecommendation {
  analysis: BusinessAnalysis;
  selectedTools: SelectedTool[];
  totalMonthlyCost: number;
  budgetUsedPercent: number;
  isOverBudget: boolean;
}

export interface AnalyzeRequest {
  businessIdea: string;
  budget: number;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: StackRecommendation;
  error?: string;
}
