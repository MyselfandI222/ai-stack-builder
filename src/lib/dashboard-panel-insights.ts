import { DashboardPanelId, PanelSubSection, SelectedTool } from "@/types";

export function generatePanelData(
  panelId: DashboardPanelId,
  answers: Record<string, unknown>,
  tools: SelectedTool[]
): PanelSubSection[] {
  const toolNames = tools.map((t) => t.name);

  switch (panelId) {
    case "operations-overview":
      return generateOperationsData(answers, tools, toolNames);
    case "growth-marketing":
      return generateGrowthData(answers, toolNames);
    case "automation-hub":
      return generateAutomationData(answers, toolNames);
    case "strategy-competition":
      return generateStrategyData(answers, toolNames);
    default:
      return [];
  }
}

function generateOperationsData(
  answers: Record<string, unknown>,
  tools: SelectedTool[],
  toolNames: string[]
): PanelSubSection[] {
  const stage = (answers.stage as string) || "Unknown";
  const customers = (answers.currentCustomerCount as string) || "0";
  const challenge = (answers.biggestChallenge as string) || "";
  const isEarly = stage.includes("idea") || stage.includes("Pre-launch");

  const budget = (answers.budget as number) || 0;
  const revenueModel = (answers.revenueModel as string) || "";
  const pricePoint = (answers.pricePoint as string) || "Not set";
  const revenueGoal = (answers.revenueGoal as string) || "Not set";

  const currentTools = (answers.currentTools as string) || "";
  const totalToolCost = tools.reduce((sum, t) => sum + t.monthlyCost, 0);

  return [
    {
      label: "Business Health",
      status: isEarly ? "warning" : "good",
      insights: [
        `Business stage: ${stage}`,
        `Current customers: ${customers}`,
        challenge ? `Top challenge: ${challenge}` : "No major challenges flagged",
        toolNames.length > 0
          ? `Tracking via ${toolNames.slice(0, 2).join(" & ")}`
          : "No analytics tools selected yet",
      ],
      actions: [
        "Set up weekly KPI tracking dashboard",
        toolNames.length > 0
          ? `Connect ${toolNames[0]} to monitor core metrics`
          : "Add an analytics tool to your stack",
        "Define 5 health indicators specific to your business",
      ],
    },
    {
      label: "Cash Flow",
      status: revenueModel ? "good" : "warning",
      insights: [
        `Monthly AI tool budget: $${budget}`,
        `Revenue model: ${revenueModel || "Not defined"}`,
        `Price point: ${pricePoint}`,
        `12-month target: ${revenueGoal}`,
      ],
      actions: [
        "Build a 90-day cash flow projection",
        `Set spending alerts for your $${budget}/mo tool budget`,
        toolNames.length > 0
          ? `Use ${toolNames[0]} to track revenue trends`
          : "Set up financial tracking tools",
      ],
    },
    {
      label: "Expenses & Tools",
      status: totalToolCost <= budget ? "good" : "warning",
      insights: [
        `Monthly tool budget: $${budget}`,
        `Recommended stack cost: $${totalToolCost}/mo`,
        `Budget utilization: ${budget > 0 ? Math.round((totalToolCost / budget) * 100) : 0}%`,
        currentTools ? `Current tools: ${currentTools}` : "No existing tools listed",
      ],
      actions: [
        "Audit all current subscriptions for overlap",
        "Check for free tier eligibility on recommended tools",
        "Set quarterly vendor review reminders",
      ],
    },
  ];
}

function generateGrowthData(
  answers: Record<string, unknown>,
  toolNames: string[]
): PanelSubSection[] {
  const channels = (answers.marketingChannels as string[]) || [];
  const content = (answers.contentTypes as string[]) || [];
  const audience = (answers.targetAudience as string) || "";
  const salesProcess = (answers.salesProcess as string) || "";
  const pricePoint = (answers.pricePoint as string) || "";
  const acquisition = (answers.customerAcquisition as string) || "";
  const customerCount = (answers.currentCustomerCount as string) || "0";
  const support = (answers.supportCurrently as string) || "";

  return [
    {
      label: "Marketing",
      status: channels.length > 0 ? "good" : "action",
      insights: [
        `Active channels: ${channels.length > 0 ? channels.join(", ") : "None selected"}`,
        `Content types: ${content.length > 0 ? content.join(", ") : "None selected"}`,
        audience ? `Targeting: ${audience}` : "Target audience not defined",
        toolNames.length > 0
          ? `Powered by: ${toolNames.slice(0, 3).join(", ")}`
          : "No marketing tools in stack",
      ],
      actions: [
        toolNames.length > 0
          ? `Automate content scheduling with ${toolNames[0]}`
          : "Add a marketing automation tool",
        "Set up A/B testing for your top-performing channel",
        "Create a monthly content calendar with AI-generated drafts",
      ],
    },
    {
      label: "Sales Pipeline",
      status: salesProcess ? "good" : "action",
      insights: [
        `Sales process: ${salesProcess || "Not defined"}`,
        pricePoint ? `Deal size: ${pricePoint}` : "Price point not set",
        acquisition ? `Lead source: ${acquisition}` : "No lead source defined",
      ],
      actions: [
        toolNames.length > 0
          ? `Set up lead scoring in ${toolNames[0]}`
          : "Add a CRM/sales tool to your stack",
        "Define your pipeline stages and conversion targets",
        "Create email templates for each stage of the funnel",
      ],
    },
    {
      label: "Customer Intelligence",
      status: audience ? "good" : "warning",
      insights: [
        `Target: ${audience || "Not defined"}`,
        `Current customers: ${customerCount}`,
        acquisition ? `Acquisition: ${acquisition}` : "No acquisition channel defined",
        support ? `Support: ${support}` : "No support setup",
      ],
      actions: [
        toolNames.length > 0
          ? `Set up ${toolNames[0]} to track customer interactions`
          : "Add a customer support tool",
        "Create customer segments based on behavior and value",
        "Build a churn risk scoring system",
      ],
    },
  ];
}

function generateAutomationData(
  answers: Record<string, unknown>,
  toolNames: string[]
): PanelSubSection[] {
  const teamSize = (answers.teamSize as string) || "Solo";
  const ops = (answers.operations as string[]) || [];
  const automate = (answers.automateFirst as string) || "";
  const currentTools = (answers.currentTools as string) || "";

  return [
    {
      label: "Workflow Automation",
      status: automate ? "good" : "action",
      insights: [
        `Departments to automate: ${ops.length > 0 ? ops.join(", ") : "None selected"}`,
        automate ? `First automation: ${automate}` : "No priority automation set",
        currentTools ? `Existing tools to connect: ${currentTools}` : "No tools to integrate yet",
        toolNames.length > 0
          ? `Automation platform: ${toolNames.join(", ")}`
          : "No workflow tools selected",
      ],
      actions: [
        toolNames.length > 0
          ? `Build your first automation in ${toolNames[0]}`
          : "Add Zapier or Make.com to your stack",
        "Map your top 5 manual processes end-to-end",
        "Estimate time saved per automation (aim for 5+ hrs/week)",
      ],
    },
    {
      label: "Task Management",
      status: ops.length > 0 ? "good" : "action",
      insights: [
        `Team size: ${teamSize}`,
        `Active departments: ${ops.length > 0 ? ops.join(", ") : "None selected"}`,
        automate ? `Priority automation: ${automate}` : "No automation target set",
      ],
      actions: [
        toolNames.length > 0
          ? `Set up ${toolNames[0]} for task tracking and assignments`
          : "Choose a project management tool",
        "Create SOPs for your top 3 repeated tasks",
        teamSize !== "Solo (just me)"
          ? "Set up weekly team standups with automated summaries"
          : "Create a daily personal task review routine",
      ],
    },
  ];
}

function generateStrategyData(
  answers: Record<string, unknown>,
  toolNames: string[]
): PanelSubSection[] {
  const competitors = (answers.competitors as string) || "";
  const differentiator = (answers.differentiator as string) || "";
  const topGoal = (answers.topGoal as string) || "";
  const stage = (answers.stage as string) || "";
  const challenge = (answers.biggestChallenge as string) || "";

  return [
    {
      label: "Competitive Position",
      status: competitors ? "good" : "action",
      insights: [
        competitors ? `Tracking: ${competitors}` : "No competitors identified",
        differentiator ? `Your edge: ${differentiator}` : "Differentiator not defined",
        toolNames.length > 0
          ? `Monitor via: ${toolNames.join(", ")}`
          : "No monitoring tools set up",
      ],
      actions: [
        "Set up Google Alerts for competitor brand names",
        toolNames.length > 0
          ? `Use ${toolNames[0]} to track competitor SEO and ad strategies`
          : "Add an analytics/marketing tool for competitive intelligence",
        "Create a monthly competitor comparison scorecard",
      ],
    },
    {
      label: "Strategic Priorities",
      status: "good",
      insights: [
        topGoal ? `#1 Goal: ${topGoal}` : "No primary goal set",
        stage ? `Stage: ${stage}` : "Stage not defined",
        challenge ? `Watch out for: ${challenge}` : "No blockers flagged",
        `Your stack covers ${toolNames.length} tools across active departments`,
      ],
      actions: [
        "Schedule a Monday 9 AM weekly review slot",
        "Connect all tools to a central dashboard for data pull",
        "Set weekly/monthly targets to measure against",
      ],
    },
  ];
}

/** Compute the worst status across all sub-sections */
export function worstStatus(sections: PanelSubSection[]): "good" | "warning" | "action" {
  if (sections.some((s) => s.status === "action")) return "action";
  if (sections.some((s) => s.status === "warning")) return "warning";
  return "good";
}
