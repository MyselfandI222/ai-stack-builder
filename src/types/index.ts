export type ToolCategory =
  | "marketing"
  | "content-creation"
  | "customer-support"
  | "operations"
  | "sales"
  | "admin"
  | "analytics"
  | "development";

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  marketing: "Marketing",
  "content-creation": "Content Creation",
  "customer-support": "Customer Support",
  operations: "Operations",
  sales: "Sales",
  admin: "Admin & Productivity",
  analytics: "Analytics & Data",
  development: "Web Development & Coding",
};

export const CATEGORY_ICONS: Record<ToolCategory, string> = {
  marketing: "Megaphone",
  "content-creation": "Palette",
  "customer-support": "Headphones",
  operations: "Settings",
  sales: "TrendingUp",
  admin: "FolderKanban",
  analytics: "BarChart3",
  development: "Code2",
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
  pros?: string[];
  cons?: string[];
  /** Who this tool is ideal for */
  bestFor?: string;
  /** When to avoid this tool */
  avoidIf?: string;
  /**
   * Business prerequisites — tool is only recommended when the business meets
   * at least one of these conditions. If empty/undefined, the tool is universal.
   *
   * Values: "ecommerce", "saas", "agency", "marketplace", "physical-products",
   *         "sales-team", "content-heavy", "enterprise", "has-website",
   *         "has-app", "b2b", "b2c", "any"
   */
  suitableFor?: string[];
  /**
   * Business types where this tool should NEVER be recommended.
   */
  notSuitableFor?: string[];
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
  answers?: Record<string, unknown>;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: StackRecommendation;
  error?: string;
}

export interface ToolRanking {
  toolId: string;
  score: number;
  reason: string;
}

// --- Dashboard types ---

export type DashboardPanelId =
  | "operations-overview"
  | "growth-marketing"
  | "automation-hub"
  | "strategy-competition";

export interface PanelSubSection {
  label: string;
  status: "good" | "warning" | "action";
  insights: string[];
  actions: string[];
}

export interface DashboardPanel {
  id: DashboardPanelId;
  title: string;
  description: string;
  icon: string;
  color: string;
  toolCategories: ToolCategory[];
  relevantAnswerKeys: string[];
}

export interface BusinessPlanEdits {
  executiveSummary?: string;
  revenueStrategy?: string;
  growthStrategy?: string;
  teamRecommendations?: string;
}

export interface SavedDashboardData {
  id: string;
  result: StackRecommendation;
  answers: Record<string, unknown>;
  savedAt: string;
  planEdits?: BusinessPlanEdits;
}

export interface ProjectSummary {
  id: string;
  businessType: string;
  toolCount: number;
  monthlyCost: number;
  createdAt: string;
}

/** @deprecated Use DashboardPanelId instead */
export type DashboardFeatureId = DashboardPanelId;
/** @deprecated Use DashboardPanel instead */
export type DashboardFeature = DashboardPanel;

// --- Employee / Team types ---

export type EmployeeRole =
  | "marketing"
  | "sales"
  | "customer-support"
  | "operations"
  | "engineering"
  | "design"
  | "finance"
  | "hr"
  | "executive"
  | "content"
  | "other";

export const EMPLOYEE_ROLE_LABELS: Record<EmployeeRole, string> = {
  marketing: "Marketing",
  sales: "Sales",
  "customer-support": "Customer Support",
  operations: "Operations",
  engineering: "Engineering / Dev",
  design: "Design",
  finance: "Finance / Accounting",
  hr: "HR / People Ops",
  executive: "Executive / Leadership",
  content: "Content / Media",
  other: "Other",
};

export interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  department: string;
  answers: Record<string, unknown>;
  recommendedTools: EmployeeToolAssignment[];
  goals: EmployeeGoal[];
  activityLog: ActivityEntry[];
  createdAt: string;
}

export interface EmployeeToolAssignment {
  toolId: string;
  toolName: string;
  category: ToolCategory;
  website: string;
  monthlyCost: number;
  whyAssigned: string;
  invited: boolean;
  invitedAt?: string;
}

export interface EmployeeGoal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: "not-started" | "in-progress" | "completed";
  createdAt: string;
}

export interface ActivityEntry {
  id: string;
  toolName: string;
  action: string;
  timestamp: string;
}

export interface EnterpriseSubscription {
  toolId: string;
  toolName: string;
  website: string;
  seats: number;
  seatsUsed: number;
  monthlyCost: number;
}

export interface TeamData {
  employees: EmployeeProfile[];
  subscriptions: EnterpriseSubscription[];
}
