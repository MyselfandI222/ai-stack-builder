import { BusinessAnalysis, DashboardPanelId, PanelSubSection, SelectedTool } from "@/types";

export function generatePanelData(
  panelId: DashboardPanelId,
  answers: Record<string, unknown>,
  tools: SelectedTool[],
  analysis?: BusinessAnalysis
): PanelSubSection[] {
  const toolNames = tools.map((t) => t.name);
  const breakdown = analysis?.businessBreakdown;

  switch (panelId) {
    case "operations-overview":
      return generateOperationsData(answers, tools, toolNames, breakdown);
    case "growth-marketing":
      return generateGrowthData(answers, toolNames, breakdown, analysis);
    case "automation-hub":
      return generateAutomationData(answers, toolNames, breakdown, analysis);
    case "strategy-competition":
      return generateStrategyData(answers, toolNames, breakdown, analysis);
    default:
      return [];
  }
}

function generateOperationsData(
  answers: Record<string, unknown>,
  tools: SelectedTool[],
  toolNames: string[],
  breakdown?: BusinessAnalysis["businessBreakdown"]
): PanelSubSection[] {
  const budget = (answers.budget as number) || 0;
  const totalToolCost = tools.reduce((sum, t) => sum + t.monthlyCost, 0);
  const currentTools = (answers.currentTools as string) || "";

  // Pull AI-generated ops departments
  const opsDepts = breakdown?.operationsPlaybook?.filter(
    (d) => ["Operations", "Finance & Admin", "Finance", "Admin"].some(
      (k) => d.department.toLowerCase().includes(k.toLowerCase())
    )
  ) || [];

  // Pull relevant 90-day items
  const opsActions = breakdown?.ninetyDayPlan?.filter(
    (item) => ["Operations", "Finance", "Admin"].some(
      (k) => item.department.toLowerCase().includes(k.toLowerCase())
    )
  ) || [];

  // Pull relevant KPIs
  const opsMetrics = breakdown?.keyMetrics?.filter(
    (m) => /cost|expense|burn|budget|margin|cash|revenue|profit|overhead/i.test(m)
  ) || [];

  const sections: PanelSubSection[] = [];

  // Business Health — from AI breakdown
  if (opsDepts.length > 0) {
    const dept = opsDepts[0];
    sections.push({
      label: dept.department,
      status: dept.priority === "critical" ? "action" : dept.priority === "high" ? "warning" : "good",
      insights: [
        dept.overview,
        ...dept.kpis.slice(0, 2).map((k) => `KPI: ${k}`),
        toolNames.length > 0
          ? `Powered by: ${toolNames.slice(0, 2).join(" & ")}`
          : "No operations tools selected yet",
      ],
      actions: [
        dept.howToStart,
        ...dept.weeklyTasks.slice(0, 2),
      ],
    });
  }

  // Cash Flow & Revenue — from AI metrics + answers
  sections.push({
    label: "Cash Flow & Budget",
    status: totalToolCost <= budget ? "good" : budget > 0 ? "warning" : "action",
    insights: [
      `Monthly AI tool budget: $${budget}`,
      `Recommended stack cost: $${totalToolCost}/mo`,
      `Budget utilization: ${budget > 0 ? Math.round((totalToolCost / budget) * 100) : 0}%`,
      ...opsMetrics.slice(0, 2),
      currentTools ? `Current tools: ${currentTools}` : "No existing tools listed",
    ].slice(0, 5),
    actions: opsActions.length > 0
      ? opsActions.slice(0, 3).map((a) => `[${a.timeline}] ${a.task}`)
      : [
          "Check for free tier eligibility on recommended tools",
          "Audit all current subscriptions for overlap",
          "Set quarterly vendor review reminders",
        ],
  });

  // Additional ops departments from AI
  for (const dept of opsDepts.slice(1, 3)) {
    sections.push({
      label: dept.department,
      status: dept.priority === "critical" ? "action" : dept.priority === "high" ? "warning" : "good",
      insights: [
        dept.overview,
        ...dept.kpis.slice(0, 2).map((k) => `KPI: ${k}`),
      ],
      actions: [
        dept.howToStart,
        ...dept.weeklyTasks.slice(0, 2),
      ],
    });
  }

  return sections;
}

function generateGrowthData(
  answers: Record<string, unknown>,
  toolNames: string[],
  breakdown?: BusinessAnalysis["businessBreakdown"],
  analysis?: BusinessAnalysis
): PanelSubSection[] {
  // Pull AI-generated marketing/sales/content departments
  const marketingDept = breakdown?.operationsPlaybook?.find(
    (d) => d.department.toLowerCase().includes("marketing")
  );
  const salesDept = breakdown?.operationsPlaybook?.find(
    (d) => d.department.toLowerCase().includes("sales")
  );
  const contentDept = breakdown?.operationsPlaybook?.find(
    (d) => d.department.toLowerCase().includes("content")
  );

  // Pull growth-related 90-day items
  const growthActions = breakdown?.ninetyDayPlan?.filter(
    (item) => ["Marketing", "Sales", "Content", "Growth"].some(
      (k) => item.department.toLowerCase().includes(k.toLowerCase())
    )
  ) || [];

  const sections: PanelSubSection[] = [];

  // Marketing section — AI-generated
  if (marketingDept) {
    sections.push({
      label: "Marketing Strategy",
      status: marketingDept.priority === "critical" ? "action" : marketingDept.priority === "high" ? "warning" : "good",
      insights: [
        marketingDept.overview,
        ...marketingDept.kpis.slice(0, 2).map((k) => `KPI: ${k}`),
        toolNames.length > 0
          ? `Powered by: ${toolNames.slice(0, 3).join(", ")}`
          : "No marketing tools in stack",
      ],
      actions: [
        marketingDept.howToStart,
        ...marketingDept.weeklyTasks.slice(0, 2),
      ],
    });
  } else {
    // Fallback if no marketing dept in playbook
    const audience = (answers.targetAudience as string) || "";
    sections.push({
      label: "Marketing",
      status: "action",
      insights: [
        analysis?.businessBreakdown?.growthStrategy || "Growth strategy not yet defined",
        audience ? `Targeting: ${audience}` : "Target audience not defined",
      ],
      actions: growthActions.slice(0, 3).map((a) => `[${a.timeline}] ${a.task}`),
    });
  }

  // Sales section — AI-generated
  if (salesDept) {
    sections.push({
      label: "Sales Pipeline",
      status: salesDept.priority === "critical" ? "action" : salesDept.priority === "high" ? "warning" : "good",
      insights: [
        salesDept.overview,
        ...salesDept.kpis.slice(0, 2).map((k) => `KPI: ${k}`),
      ],
      actions: [
        salesDept.howToStart,
        ...salesDept.weeklyTasks.slice(0, 2),
      ],
    });
  }

  // Content section — AI-generated
  if (contentDept) {
    sections.push({
      label: "Content & Brand",
      status: contentDept.priority === "critical" ? "action" : contentDept.priority === "high" ? "warning" : "good",
      insights: [
        contentDept.overview,
        ...contentDept.kpis.slice(0, 2).map((k) => `KPI: ${k}`),
      ],
      actions: [
        contentDept.howToStart,
        ...contentDept.weeklyTasks.slice(0, 2),
      ],
    });
  }

  // Growth roadmap from 90-day plan
  if (growthActions.length > 0 && sections.length < 4) {
    sections.push({
      label: "Growth Roadmap",
      status: "good",
      insights: [
        breakdown?.growthStrategy || "Growth strategy in progress",
        `${growthActions.length} action items planned for next 90 days`,
      ],
      actions: growthActions.slice(0, 4).map((a) => `[${a.timeline}] ${a.task}`),
    });
  }

  return sections;
}

function generateAutomationData(
  answers: Record<string, unknown>,
  toolNames: string[],
  breakdown?: BusinessAnalysis["businessBreakdown"],
  analysis?: BusinessAnalysis
): PanelSubSection[] {
  const teamSize = (answers.teamSize as string) || "Solo";
  const automate = (answers.automateFirst as string) || "";

  // AI-generated automation opportunities
  const opportunities = analysis?.keyAutomationOpportunities || [];

  // Pull ops/support departments that benefit from automation
  const automationDepts = breakdown?.operationsPlaybook?.filter(
    (d) => ["Operations", "Support", "Customer Support", "Admin"].some(
      (k) => d.department.toLowerCase().includes(k.toLowerCase())
    )
  ) || [];

  // Pull automation-related 90-day items
  const autoActions = breakdown?.ninetyDayPlan?.filter(
    (item) => /automat|workflow|process|integrat|connect|setup|tool/i.test(item.task)
  ) || [];

  const sections: PanelSubSection[] = [];

  // Automation Opportunities — from Claude's analysis
  sections.push({
    label: "Automation Opportunities",
    status: opportunities.length > 0 ? "good" : "action",
    insights: opportunities.length > 0
      ? opportunities.slice(0, 4)
      : [
          automate ? `Priority: ${automate}` : "No automation priorities identified",
          `Team size: ${teamSize}`,
        ],
    actions: autoActions.length > 0
      ? autoActions.slice(0, 3).map((a) => `[${a.timeline}] ${a.task}`)
      : [
          toolNames.length > 0
            ? `Build your first automation in ${toolNames[0]}`
            : "Add Zapier or Make.com to your stack",
          "Map your top 5 manual processes end-to-end",
        ],
  });

  // Department-specific automation from AI playbook
  for (const dept of automationDepts.slice(0, 2)) {
    sections.push({
      label: `${dept.department} Automation`,
      status: dept.priority === "critical" ? "action" : dept.priority === "high" ? "warning" : "good",
      insights: [
        dept.overview,
        ...dept.kpis.slice(0, 2).map((k) => `KPI: ${k}`),
        toolNames.length > 0
          ? `Tools: ${toolNames.join(", ")}`
          : "No automation tools selected",
      ],
      actions: [
        dept.howToStart,
        ...dept.weeklyTasks.slice(0, 2),
      ],
    });
  }

  // Tool integration section
  if (toolNames.length > 1) {
    sections.push({
      label: "Integration Plan",
      status: "good",
      insights: [
        `${toolNames.length} tools in your stack to connect`,
        `Team size: ${teamSize}`,
        automate ? `First priority: ${automate}` : "Set your first automation target",
      ],
      actions: [
        `Connect ${toolNames.slice(0, 2).join(" and ")} as your first integration`,
        ...breakdown?.operationsPlaybook
          ?.flatMap((d) => d.weeklyTasks)
          .filter((t) => /automat|connect|sync|integrat/i.test(t))
          .slice(0, 2) || [],
      ].slice(0, 3),
    });
  }

  return sections;
}

function generateStrategyData(
  answers: Record<string, unknown>,
  toolNames: string[],
  breakdown?: BusinessAnalysis["businessBreakdown"],
  analysis?: BusinessAnalysis
): PanelSubSection[] {
  const competitors = (answers.competitors as string) || "";
  const differentiator = (answers.differentiator as string) || "";
  const topGoal = (answers.topGoal as string) || "";

  // AI-generated risks
  const risks = breakdown?.risks || [];

  // Pull strategy-related 90-day items
  const strategyActions = breakdown?.ninetyDayPlan?.filter(
    (item) => item.priority === "critical" || item.priority === "high"
  ) || [];

  // Pull analytics department
  const analyticsDept = breakdown?.operationsPlaybook?.find(
    (d) => d.department.toLowerCase().includes("analytics")
  );

  const sections: PanelSubSection[] = [];

  // Strategic Priorities — from AI
  sections.push({
    label: "Strategic Priorities",
    status: topGoal ? "good" : "action",
    insights: [
      topGoal ? `#1 Goal: ${topGoal}` : "No primary goal set",
      breakdown?.executiveSummary
        ? breakdown.executiveSummary.split(".").slice(0, 2).join(".") + "."
        : "Business summary not available",
      breakdown?.revenueStrategy
        ? breakdown.revenueStrategy.split(".")[0] + "."
        : "Revenue strategy not defined",
    ],
    actions: strategyActions.length > 0
      ? strategyActions.slice(0, 3).map((a) => `[${a.timeline}] ${a.task}`)
      : ["Define your #1 goal for the next 90 days"],
  });

  // Competitive Position — from AI + answers
  sections.push({
    label: "Competitive Position",
    status: competitors || differentiator ? "good" : "action",
    insights: [
      competitors ? `Tracking: ${competitors}` : "No competitors identified",
      differentiator ? `Your edge: ${differentiator}` : "Differentiator not defined",
      analysis?.businessType ? `Business type: ${analysis.businessType}` : "",
      toolNames.length > 0
        ? `Monitoring with: ${toolNames.join(", ")}`
        : "No monitoring tools set up",
    ].filter(Boolean),
    actions: analyticsDept
      ? [analyticsDept.howToStart, ...analyticsDept.weeklyTasks.slice(0, 2)]
      : [
          "Set up Google Alerts for competitor brand names",
          "Create a monthly competitor comparison scorecard",
        ],
  });

  // Risks & Pitfalls — from AI
  if (risks.length > 0) {
    sections.push({
      label: "Risks & Pitfalls",
      status: "warning",
      insights: risks.slice(0, 4),
      actions: [
        "Review and mitigate each risk this quarter",
        breakdown?.teamRecommendations
          ? breakdown.teamRecommendations.split(".")[0] + "."
          : "Assess team capacity for risk mitigation",
      ],
    });
  }

  // Key Metrics — from AI
  const strategyMetrics = breakdown?.keyMetrics?.filter(
    (m) => /growth|retention|churn|ltv|cac|conversion|revenue|market/i.test(m)
  ) || [];

  if (strategyMetrics.length > 0) {
    sections.push({
      label: "Key Metrics to Track",
      status: "good",
      insights: strategyMetrics.slice(0, 4),
      actions: [
        "Set up weekly tracking for your top 3 metrics",
        "Create a dashboard connecting all metric sources",
      ],
    });
  }

  return sections;
}

/** Compute the worst status across all sub-sections */
export function worstStatus(sections: PanelSubSection[]): "good" | "warning" | "action" {
  if (sections.some((s) => s.status === "action")) return "action";
  if (sections.some((s) => s.status === "warning")) return "warning";
  return "good";
}
