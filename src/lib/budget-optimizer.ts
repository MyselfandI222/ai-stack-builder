import {
  AITool,
  BusinessAnalysis,
  CategoryAnalysis,
  SelectedTool,
  StackRecommendation,
  ToolCategory,
  ToolRanking,
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

/** Stage-aware tier weights — early-stage businesses lean essential + free, established get a wider spread. */
const STAGE_TIER_WEIGHTS: Record<string, Record<AITool["tier"], number>> = {
  "Just an idea":                   { essential: 4, recommended: 1.5, "nice-to-have": 0.5 },
  "Pre-launch / building":         { essential: 3.5, recommended: 1.5, "nice-to-have": 0.5 },
  "Just launched (< 6 months)":    { essential: 3, recommended: 2, "nice-to-have": 1 },
  "Growing (6 months - 2 years)":  { essential: 2.5, recommended: 2.5, "nice-to-have": 1.5 },
  "Established (2+ years)":        { essential: 2, recommended: 2.5, "nice-to-have": 2 },
};

export interface OptimizationContext {
  currentTools?: string;
  stage?: string;
  automateFirst?: string;
  claudeToolRankings?: ToolRanking[];
}

/** Check if the user already uses a tool (fuzzy name match against their "currentTools" answer). */
function userAlreadyHas(tool: AITool, currentTools: string): boolean {
  if (!currentTools) return false;
  const lower = currentTools.toLowerCase();
  // Strip common suffixes like "AI" or ".com" for matching
  const toolName = tool.name.toLowerCase().replace(/\s*(ai|\.com)\s*$/g, "").trim();
  // Also try just the first word (e.g. "HubSpot" from "HubSpot AI")
  const firstName = toolName.split(/\s+/)[0];
  return lower.includes(toolName) || (firstName.length > 3 && lower.includes(firstName));
}

/**
 * Map questionnaire business models → internal business type tags.
 * This allows the optimizer to filter tools by suitability.
 */
const BUSINESS_MODEL_TAGS: Record<string, string[]> = {
  "B2B SaaS": ["saas", "b2b", "has-website", "has-app"],
  "DTC Ecommerce": ["ecommerce", "b2c", "has-website", "physical-products"],
  "Agency / Consultancy": ["agency", "b2b", "has-website"],
  "Marketplace": ["marketplace", "has-website", "has-app", "b2c"],
  "Service Business": ["b2b", "has-website"],
  "Content / Media": ["content-heavy", "has-website", "b2c"],
  "Non-Profit": ["has-website"],
};

function deriveBusinessTags(analysis: BusinessAnalysis): string[] {
  const bt = (analysis.businessType || "").trim();

  // Direct match
  for (const [key, tags] of Object.entries(BUSINESS_MODEL_TAGS)) {
    if (bt.toLowerCase().includes(key.toLowerCase())) {
      return tags;
    }
  }

  // Fuzzy inference from businessType string
  const lower = bt.toLowerCase();
  const tags: string[] = [];

  if (lower.includes("saas") || lower.includes("software")) tags.push("saas", "b2b", "has-website", "has-app");
  else if (lower.includes("ecommerce") || lower.includes("e-commerce") || lower.includes("dtc") || lower.includes("shop") || lower.includes("store") || lower.includes("retail"))
    tags.push("ecommerce", "b2c", "has-website", "physical-products");
  else if (lower.includes("agency") || lower.includes("consult")) tags.push("agency", "b2b", "has-website");
  else if (lower.includes("marketplace") || lower.includes("platform")) tags.push("marketplace", "has-website", "b2c");
  else if (lower.includes("media") || lower.includes("content") || lower.includes("creator") || lower.includes("blog") || lower.includes("newsletter"))
    tags.push("content-heavy", "has-website", "b2c");
  else if (lower.includes("b2b")) tags.push("b2b", "has-website");
  else if (lower.includes("b2c")) tags.push("b2c", "has-website");
  else tags.push("has-website"); // safe default

  return tags;
}

/**
 * Check whether a tool is suitable for this business.
 * - If tool has no suitableFor/notSuitableFor, it's always suitable (universal tools).
 * - If tool has suitableFor, at least one tag must match the business tags.
 * - If tool has notSuitableFor, none of those tags should match.
 */
function isToolSuitableForBusiness(tool: AITool, businessTags: string[]): boolean {
  // Check notSuitableFor first — if any tag matches, exclude
  if (tool.notSuitableFor && tool.notSuitableFor.length > 0) {
    const excluded = tool.notSuitableFor.some((tag) => businessTags.includes(tag));
    if (excluded) return false;
  }

  // If suitableFor is defined, require at least one match
  if (tool.suitableFor && tool.suitableFor.length > 0) {
    const hasMatch = tool.suitableFor.some((tag) => businessTags.includes(tag));
    if (!hasMatch) return false;
  }

  return true;
}

interface ScoredTool {
  tool: AITool;
  relevanceScore: number;
  compositeScore: number;
  whyRecommended: string;
}

function scoreToolForBusiness(
  tool: AITool,
  analysis: BusinessAnalysis,
  businessTags: string[],
  context: OptimizationContext = {}
): ScoredTool | null {
  // Filter out tools that don't fit this business type
  if (!isToolSuitableForBusiness(tool, businessTags)) {
    return null;
  }

  // Filter out tools the user already has
  if (context.currentTools && userAlreadyHas(tool, context.currentTools)) {
    return null;
  }

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

  // Bonus for tools matching what the user wants to automate first
  const automateText = (context.automateFirst || "").toLowerCase();
  const automateBonus =
    automateText.length > 0 &&
    tool.useCaseTags.some(
      (tag) =>
        automateText.includes(tag.toLowerCase()) ||
        tag
          .toLowerCase()
          .split(" ")
          .some((word) => word.length > 3 && automateText.includes(word))
    )
      ? 15
      : 0;

  const adjustedRelevance = Math.min(
    relevanceScore + tagBonus + freeTierBonus + automateBonus,
    100
  );

  const effectiveCost = Math.max(tool.monthlyCost, 1);

  // Stage-aware tier weights — early businesses lean essential, established get broader
  const stageWeights = context.stage
    ? STAGE_TIER_WEIGHTS[context.stage] || TIER_WEIGHTS
    : TIER_WEIGHTS;
  const tierWeight = stageWeights[tool.tier];

  // Claude ranking multiplier (1.0 = neutral when no ranking exists)
  const claudeRanking = context.claudeToolRankings?.find(
    (r) => r.toolId === tool.id
  );
  const claudeMultiplier = claudeRanking ? claudeRanking.score / 50 : 1;

  const compositeScore =
    (adjustedRelevance * tierWeight * claudeMultiplier) / effectiveCost;

  // Prefer Claude's business-specific reasoning when available
  const whyRecommended =
    claudeRanking?.reason ||
    generateRecommendationReason(tool, categoryMatch, analysis);

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
  budget: number,
  context: OptimizationContext = {}
): StackRecommendation {
  // Step 0: Derive business type tags for suitability filtering
  const businessTags = deriveBusinessTags(analysis);

  // Step 1: Score all tools against the business analysis (with suitability filtering)
  const scoredTools: ScoredTool[] = AI_TOOLS_DATABASE.map((tool) =>
    scoreToolForBusiness(tool, analysis, businessTags, context)
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
