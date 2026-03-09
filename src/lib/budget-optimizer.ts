import {
  AITool,
  BusinessAnalysis,
  CategoryAnalysis,
  SelectedTool,
  StackRecommendation,
  ToolCategory,
} from "@/types";
import { AI_TOOLS_DATABASE } from "./ai-tools-db";

/**
 * Budget Optimization Algorithm
 *
 * Strategy:
 * 1. Score every tool based on its relevance to the analyzed business.
 * 2. Sort tools by a composite score = (relevance * tier_weight) / cost.
 *    - Essential tools get 3x weight, recommended 2x, nice-to-have 1x.
 *    - Free tools with sufficient free tiers get a bonus.
 * 3. Use a greedy selection approach with priority tiers:
 *    a. First pass: select highest-scoring essential tools per relevant category.
 *    b. Second pass: fill remaining budget with recommended tools.
 *    c. Third pass: if budget remains, add nice-to-have tools.
 * 4. Within each tier, tools are sorted by value density (score / cost).
 * 5. A tool is only selected once per category to avoid redundancy.
 * 6. Tools in the same competitorGroup are mutually exclusive — only the
 *    highest-scoring one is selected. For tied scores, a stable shuffle
 *    ensures no vendor is systematically favored.
 */

const TIER_WEIGHTS: Record<AITool["tier"], number> = {
  essential: 3,
  recommended: 2,
  "nice-to-have": 1,
};

interface ScoredTool {
  tool: AITool;
  relevanceScore: number;
  compositeScore: number;
  whyRecommended: string;
}

function scoreToolForBusiness(
  tool: AITool,
  analysis: BusinessAnalysis
): ScoredTool | null {
  const categoryMatch = analysis.categories.find(
    (c) => c.category === tool.category
  );

  if (!categoryMatch || categoryMatch.relevanceScore < 10) {
    return null;
  }

  const relevanceScore = categoryMatch.relevanceScore;

  const taskKeywords = categoryMatch.suggestedTasks
    .join(" ")
    .toLowerCase()
    .split(/\s+/);
  const tagOverlap = tool.useCaseTags.filter((tag) =>
    taskKeywords.some(
      (kw) =>
        tag.toLowerCase().includes(kw) || kw.includes(tag.toLowerCase())
    )
  ).length;
  const tagBonus = Math.min(tagOverlap * 5, 20);

  const freeTierBonus = tool.hasFreeTier ? 10 : 0;

  const adjustedRelevance = Math.min(
    relevanceScore + tagBonus + freeTierBonus,
    100
  );

  const effectiveCost = Math.max(tool.monthlyCost, 1);
  const tierWeight = TIER_WEIGHTS[tool.tier];
  const compositeScore = (adjustedRelevance * tierWeight) / effectiveCost;

  const whyRecommended = generateRecommendationReason(
    tool,
    categoryMatch,
    analysis
  );

  return {
    tool,
    relevanceScore: adjustedRelevance,
    compositeScore,
    whyRecommended,
  };
}

function generateRecommendationReason(
  tool: AITool,
  categoryAnalysis: CategoryAnalysis,
  analysis: BusinessAnalysis
): string {
  const tasks = categoryAnalysis.suggestedTasks;
  const matchingTasks = tasks.filter((task) =>
    tool.useCaseTags.some(
      (tag) =>
        task.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(task.toLowerCase().split(" ")[0])
    )
  );

  if (matchingTasks.length > 0) {
    return `Recommended for your ${analysis.businessType} to handle: ${matchingTasks.slice(0, 2).join(", ")}.`;
  }

  return `Strong fit for ${categoryAnalysis.category.replace("-", " ")} needs in your ${analysis.businessType}.`;
}

/**
 * For tools with identical composite scores in the same competitor group,
 * shuffle them randomly so no vendor is systematically favored by array order.
 */
function fairShuffle(tools: ScoredTool[]): ScoredTool[] {
  const result = [...tools];
  // Group by compositeScore buckets (round to avoid float precision issues)
  const buckets = new Map<number, ScoredTool[]>();
  for (const t of result) {
    const key = Math.round(t.compositeScore * 1000);
    const bucket = buckets.get(key) || [];
    bucket.push(t);
    buckets.set(key, bucket);
  }

  // Shuffle within each bucket
  const shuffled: ScoredTool[] = [];
  const sortedKeys = [...buckets.keys()].sort((a, b) => b - a);
  for (const key of sortedKeys) {
    const bucket = buckets.get(key)!;
    // Fisher-Yates shuffle
    for (let i = bucket.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bucket[i], bucket[j]] = [bucket[j], bucket[i]];
    }
    shuffled.push(...bucket);
  }

  return shuffled;
}

export function optimizeStack(
  analysis: BusinessAnalysis,
  budget: number
): StackRecommendation {
  // Step 1: Score all tools against the business analysis
  const scoredTools: ScoredTool[] = AI_TOOLS_DATABASE.map((tool) =>
    scoreToolForBusiness(tool, analysis)
  ).filter((st): st is ScoredTool => st !== null);

  // Step 2: Group by tier, sort by composite score, then fair-shuffle ties
  const essential = fairShuffle(
    scoredTools
      .filter((st) => st.tool.tier === "essential")
      .sort((a, b) => b.compositeScore - a.compositeScore)
  );

  const recommended = fairShuffle(
    scoredTools
      .filter((st) => st.tool.tier === "recommended")
      .sort((a, b) => b.compositeScore - a.compositeScore)
  );

  const niceToHave = fairShuffle(
    scoredTools
      .filter((st) => st.tool.tier === "nice-to-have")
      .sort((a, b) => b.compositeScore - a.compositeScore)
  );

  // Step 3: Greedy selection with category dedup + competitor group exclusion
  const selectedTools: SelectedTool[] = [];
  let remainingBudget = budget;
  const categoriesUsed = new Map<ToolCategory, number>();
  const competitorGroupsUsed = new Set<string>();

  const MAX_TOOLS_PER_CATEGORY = 2;

  function tryAddTool(scored: ScoredTool): boolean {
    const catCount = categoriesUsed.get(scored.tool.category) || 0;
    if (catCount >= MAX_TOOLS_PER_CATEGORY) return false;

    // Competitor group exclusion: only one tool per group
    if (scored.tool.competitorGroup) {
      if (competitorGroupsUsed.has(scored.tool.competitorGroup)) return false;
    }

    if (scored.tool.monthlyCost === 0) {
      selectedTools.push({
        ...scored.tool,
        relevanceScore: scored.relevanceScore,
        whyRecommended: scored.whyRecommended,
      });
      categoriesUsed.set(scored.tool.category, catCount + 1);
      if (scored.tool.competitorGroup) {
        competitorGroupsUsed.add(scored.tool.competitorGroup);
      }
      return true;
    }

    if (scored.tool.monthlyCost <= remainingBudget) {
      selectedTools.push({
        ...scored.tool,
        relevanceScore: scored.relevanceScore,
        whyRecommended: scored.whyRecommended,
      });
      remainingBudget -= scored.tool.monthlyCost;
      categoriesUsed.set(scored.tool.category, catCount + 1);
      if (scored.tool.competitorGroup) {
        competitorGroupsUsed.add(scored.tool.competitorGroup);
      }
      return true;
    }

    return false;
  }

  // Pass 1: Essential tools (pick best per relevant category)
  const essentialByCategory = new Map<ToolCategory, ScoredTool[]>();
  for (const st of essential) {
    const list = essentialByCategory.get(st.tool.category) || [];
    list.push(st);
    essentialByCategory.set(st.tool.category, list);
  }

  const sortedCategories = [...analysis.categories]
    .filter((c) => c.relevanceScore >= 10)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  for (const cat of sortedCategories) {
    const catEssentials = essentialByCategory.get(cat.category);
    if (catEssentials && catEssentials.length > 0) {
      tryAddTool(catEssentials[0]);
    }
  }

  // Pass 2: Recommended tools
  for (const st of recommended) {
    tryAddTool(st);
  }

  // Pass 3: Nice-to-have tools
  for (const st of niceToHave) {
    tryAddTool(st);
  }

  const totalMonthlyCost = selectedTools.reduce(
    (sum, t) => sum + t.monthlyCost,
    0
  );
  const budgetUsedPercent =
    budget > 0 ? Math.round((totalMonthlyCost / budget) * 100) : 0;

  return {
    analysis,
    selectedTools,
    totalMonthlyCost,
    budgetUsedPercent,
    isOverBudget: totalMonthlyCost > budget,
  };
}
