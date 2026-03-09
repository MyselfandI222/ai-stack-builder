import { EmployeeRole, EmployeeToolAssignment, ToolCategory } from "@/types";
import { AI_TOOLS_DATABASE } from "./ai-tools-db";

// Map each employee role to tool categories they'd use, with relevance weights
const ROLE_TOOL_MAP: Record<EmployeeRole, { category: ToolCategory; weight: number }[]> = {
  marketing: [
    { category: "marketing", weight: 100 },
    { category: "content-creation", weight: 80 },
    { category: "analytics", weight: 60 },
  ],
  sales: [
    { category: "sales", weight: 100 },
    { category: "marketing", weight: 40 },
    { category: "analytics", weight: 50 },
  ],
  "customer-support": [
    { category: "customer-support", weight: 100 },
    { category: "operations", weight: 40 },
  ],
  operations: [
    { category: "operations", weight: 100 },
    { category: "admin", weight: 70 },
    { category: "analytics", weight: 50 },
  ],
  engineering: [
    { category: "operations", weight: 80 },
    { category: "content-creation", weight: 40 },
    { category: "admin", weight: 50 },
  ],
  design: [
    { category: "content-creation", weight: 100 },
    { category: "marketing", weight: 40 },
  ],
  finance: [
    { category: "analytics", weight: 100 },
    { category: "admin", weight: 70 },
    { category: "operations", weight: 50 },
  ],
  hr: [
    { category: "admin", weight: 100 },
    { category: "operations", weight: 60 },
  ],
  executive: [
    { category: "analytics", weight: 90 },
    { category: "admin", weight: 80 },
    { category: "operations", weight: 70 },
    { category: "marketing", weight: 50 },
    { category: "sales", weight: 50 },
  ],
  content: [
    { category: "content-creation", weight: 100 },
    { category: "marketing", weight: 60 },
    { category: "analytics", weight: 30 },
  ],
  other: [
    { category: "admin", weight: 70 },
    { category: "operations", weight: 60 },
    { category: "content-creation", weight: 40 },
  ],
};

// Refine recommendations based on questionnaire answers
function getAnswerBoosts(answers: Record<string, unknown>): Map<string, number> {
  const boosts = new Map<string, number>();

  const tasks = (answers.dailyTasks as string) || "";
  const tasksLower = tasks.toLowerCase();

  // Boost tools whose tags match mentioned tasks
  for (const tool of AI_TOOLS_DATABASE) {
    for (const tag of tool.useCaseTags) {
      if (tasksLower.includes(tag.toLowerCase())) {
        boosts.set(tool.id, (boosts.get(tool.id) || 0) + 15);
      }
    }
  }

  // Boost based on communication preference
  const commStyle = (answers.communicationStyle as string) || "";
  if (commStyle.toLowerCase().includes("async") || commStyle.toLowerCase().includes("written")) {
    for (const tool of AI_TOOLS_DATABASE) {
      if (tool.useCaseTags.some((t) => ["writing", "docs", "wiki"].includes(t.toLowerCase()))) {
        boosts.set(tool.id, (boosts.get(tool.id) || 0) + 10);
      }
    }
  }

  // Boost based on existing tools they know
  const currentTools = (answers.currentTools as string) || "";
  const toolsLower = currentTools.toLowerCase();
  for (const tool of AI_TOOLS_DATABASE) {
    if (toolsLower.includes(tool.name.toLowerCase().split(" ")[0])) {
      boosts.set(tool.id, (boosts.get(tool.id) || 0) + 20);
    }
  }

  return boosts;
}

function generateWhyAssigned(
  toolName: string,
  role: EmployeeRole,
  category: string,
  answers: Record<string, unknown>
): string {
  const roleName = role.replace("-", " ");
  const responsibilities = (answers.responsibilities as string) || "";

  if (responsibilities) {
    return `Recommended for your ${roleName} role to support: ${responsibilities.slice(0, 80)}${responsibilities.length > 80 ? "..." : ""}`;
  }

  return `${toolName} is a strong fit for ${category.replace("-", " ")} tasks in your ${roleName} role.`;
}

export function recommendToolsForEmployee(
  role: EmployeeRole,
  answers: Record<string, unknown>
): EmployeeToolAssignment[] {
  const roleCategories = ROLE_TOOL_MAP[role] || ROLE_TOOL_MAP.other;
  const answerBoosts = getAnswerBoosts(answers);

  // Score each tool
  const scored: { tool: (typeof AI_TOOLS_DATABASE)[0]; score: number }[] = [];

  for (const tool of AI_TOOLS_DATABASE) {
    const catMatch = roleCategories.find((rc) => rc.category === tool.category);
    if (!catMatch) continue;

    let score = catMatch.weight;

    // Tier weight
    if (tool.tier === "essential") score += 30;
    else if (tool.tier === "recommended") score += 15;

    // Free tier bonus
    if (tool.hasFreeTier) score += 10;

    // Answer-based boosts
    const boost = answerBoosts.get(tool.id) || 0;
    score += boost;

    scored.push({ tool, score });
  }

  // Sort by score, pick top tools (max 2 per category)
  scored.sort((a, b) => b.score - a.score);

  const selected: EmployeeToolAssignment[] = [];
  const categoryCounts = new Map<string, number>();
  const competitorGroupsUsed = new Set<string>();

  for (const { tool } of scored) {
    const catCount = categoryCounts.get(tool.category) || 0;
    if (catCount >= 2) continue;
    if (tool.competitorGroup && competitorGroupsUsed.has(tool.competitorGroup)) continue;

    selected.push({
      toolId: tool.id,
      toolName: tool.name,
      category: tool.category,
      website: tool.website,
      monthlyCost: tool.monthlyCost,
      whyAssigned: generateWhyAssigned(tool.name, role, tool.category, answers),
      invited: false,
    });

    categoryCounts.set(tool.category, catCount + 1);
    if (tool.competitorGroup) competitorGroupsUsed.add(tool.competitorGroup);

    if (selected.length >= 8) break; // Max 8 tools per employee
  }

  return selected;
}
