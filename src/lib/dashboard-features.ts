import { DashboardPanel } from "@/types";

export const DASHBOARD_PANELS: DashboardPanel[] = [
  {
    id: "operations-overview",
    title: "Operations Overview",
    description:
      "Financial health, budget utilization, tool costs, and business stage — everything you need to keep the engine running.",
    icon: "Activity",
    color: "emerald",
    toolCategories: ["analytics", "operations", "admin"],
    relevantAnswerKeys: [
      "stage", "topGoal", "biggestChallenge", "teamSize", "currentCustomerCount",
      "budget", "revenueModel", "pricePoint", "revenueGoal", "currentTools",
    ],
  },
  {
    id: "growth-marketing",
    title: "Growth & Marketing",
    description:
      "Your channels, audience, acquisition strategy, sales pipeline, and customer intelligence in one place.",
    icon: "TrendingUp",
    color: "pink",
    toolCategories: ["marketing", "content-creation", "sales", "customer-support", "analytics"],
    relevantAnswerKeys: [
      "marketingChannels", "contentTypes", "targetAudience",
      "salesProcess", "customerAcquisition", "pricePoint", "revenueGoal",
      "currentCustomerCount", "supportCurrently",
    ],
  },
  {
    id: "automation-hub",
    title: "Automation Hub",
    description:
      "Workflow automation opportunities, task management, SOPs, and time-saving integrations for your team.",
    icon: "Workflow",
    color: "sky",
    toolCategories: ["operations", "admin"],
    relevantAnswerKeys: [
      "teamSize", "operations", "automateFirst", "currentTools",
    ],
  },
  {
    id: "strategy-competition",
    title: "Strategy & Competition",
    description:
      "Competitive positioning, market differentiation, strategic priorities, and weekly focus areas.",
    icon: "Radar",
    color: "red",
    toolCategories: ["analytics", "marketing"],
    relevantAnswerKeys: [
      "competitors", "differentiator", "topGoal", "stage", "biggestChallenge",
    ],
  },
];

/** @deprecated Use DASHBOARD_PANELS instead */
export const DASHBOARD_FEATURES = DASHBOARD_PANELS;
