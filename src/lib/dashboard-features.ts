import { DashboardFeature } from "@/types";

export const DASHBOARD_FEATURES: DashboardFeature[] = [
  {
    id: "health-score",
    title: "AI Business Health Score",
    description:
      "Real-time score aggregating financials, customer satisfaction, ops efficiency, and growth metrics with fix recommendations.",
    icon: "Activity",
    color: "emerald",
    toolCategories: ["analytics"],
    relevantAnswerKeys: ["stage", "topGoal", "biggestChallenge", "teamSize", "currentCustomerCount"],
  },
  {
    id: "cash-flow",
    title: "Smart Cash Flow Forecaster",
    description:
      "Predicts cash flow 30/60/90 days out. Alerts before shortfalls and suggests actions to stay healthy.",
    icon: "DollarSign",
    color: "cyan",
    toolCategories: ["analytics", "operations"],
    relevantAnswerKeys: ["budget", "revenueModel", "pricePoint", "revenueGoal"],
  },
  {
    id: "task-manager",
    title: "AI Employee & Task Manager",
    description:
      "Assigns tasks based on capacity and skills. Flags burnout risk, suggests hires, and auto-generates SOPs.",
    icon: "Users",
    color: "indigo",
    toolCategories: ["operations", "admin"],
    relevantAnswerKeys: ["teamSize", "operations", "automateFirst"],
  },
  {
    id: "customer-intel",
    title: "Customer Intelligence Hub",
    description:
      "Analyzes customer behavior, churn risk, and lifetime value. Auto-segments customers with retention strategies.",
    icon: "UserSearch",
    color: "violet",
    toolCategories: ["customer-support", "analytics"],
    relevantAnswerKeys: ["targetAudience", "currentCustomerCount", "customerAcquisition", "supportCurrently"],
  },
  {
    id: "marketing-autopilot",
    title: "Marketing Autopilot",
    description:
      "Generates ad copy, social posts, and campaigns. A/B tests messaging and reallocates budget to top channels.",
    icon: "Megaphone",
    color: "pink",
    toolCategories: ["marketing", "content-creation"],
    relevantAnswerKeys: ["marketingChannels", "contentTypes", "targetAudience"],
  },
  {
    id: "sales-coach",
    title: "AI Sales Pipeline Coach",
    description:
      "Scores leads, predicts close probability, and suggests next actions for every deal in your pipeline.",
    icon: "TrendingUp",
    color: "amber",
    toolCategories: ["sales"],
    relevantAnswerKeys: ["salesProcess", "customerAcquisition", "pricePoint", "revenueGoal"],
  },
  {
    id: "expense-optimizer",
    title: "Expense & Vendor Optimizer",
    description:
      "Scans subscriptions and contracts to find savings. Flags duplicates and suggests cheaper alternatives.",
    icon: "Receipt",
    color: "orange",
    toolCategories: ["operations", "admin"],
    relevantAnswerKeys: ["budget", "currentTools"],
  },
  {
    id: "competitor-radar",
    title: "Competitor Radar",
    description:
      "Monitors competitor pricing, products, reviews, and marketing moves with weekly strategic briefings.",
    icon: "Radar",
    color: "red",
    toolCategories: ["marketing", "analytics"],
    relevantAnswerKeys: ["competitors", "differentiator"],
  },
  {
    id: "workflow-builder",
    title: "AI Operations Workflow Builder",
    description:
      "Identifies repetitive processes and builds automated workflows. Shows hours saved per week.",
    icon: "Workflow",
    color: "sky",
    toolCategories: ["operations"],
    relevantAnswerKeys: ["operations", "automateFirst", "currentTools"],
  },
  {
    id: "weekly-brief",
    title: "Weekly AI Strategy Brief",
    description:
      "Every Monday: what went well, what needs attention, top 3 priorities, and market opportunities.",
    icon: "FileText",
    color: "purple",
    toolCategories: ["analytics", "operations", "marketing"],
    relevantAnswerKeys: ["topGoal", "stage", "biggestChallenge"],
  },
];
