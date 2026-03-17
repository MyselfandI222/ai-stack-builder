import Anthropic from "@anthropic-ai/sdk";
import { BusinessAnalysis, ToolCategory, ToolRanking } from "@/types";
import { AI_TOOLS_DATABASE } from "./ai-tools-db";

const VALID_CATEGORIES: ToolCategory[] = [
  "marketing",
  "content-creation",
  "customer-support",
  "operations",
  "sales",
  "admin",
  "analytics",
  "development",
];

const SYSTEM_PROMPT = `You are a senior startup operations consultant and business strategist. You give founders a complete, actionable playbook for how to run and grow their business.

Your job: analyze a business description and produce TWO things:
1. A category-level analysis for AI tool recommendations (same as before).
2. A FULL BUSINESS BREAKDOWN — a detailed, actionable plan for how to actually run this business day-to-day.

CRITICAL RULES:
- Be completely vendor-neutral. Do NOT favor any AI vendor.
- Score each category purely based on the business's actual needs.
- The business breakdown must be SPECIFIC to this business — not generic advice. Reference the actual product, audience, and challenges described.
- Think like a YC partner + COO advising a first-time founder.
- Do NOT mention any specific tool or vendor names anywhere. Focus on tasks, processes, and strategies.

You MUST respond with valid JSON only. No markdown, no explanation, no text outside the JSON.

The JSON must follow this exact schema:
{
  "businessType": "string (e.g. 'B2B SaaS', 'DTC Ecommerce', 'Agency', 'Marketplace')",
  "businessSummary": "string (2-3 sentence summary of the business and its position)",
  "categories": [
    {
      "category": "string (one of: marketing, content-creation, customer-support, operations, sales, admin, analytics, development)",
      "relevanceScore": number (0-100),
      "reasoning": "string (why this category matters for this specific business)",
      "suggestedTasks": ["string array of specific tasks to automate"]
    }
  ],
  "keyAutomationOpportunities": ["string array of 3-5 high-impact automation opportunities"],
  "businessBreakdown": {
    "executiveSummary": "string (3-5 sentence overview: what this business is, who it serves, how it makes money, and the biggest opportunity in front of it)",
    "revenueStrategy": "string (2-4 sentences on how to generate and grow revenue — pricing strategy, upsells, retention tactics specific to this business)",
    "growthStrategy": "string (2-4 sentences on the primary growth levers for this specific business — what channels, what tactics, what order)",
    "operationsPlaybook": [
      {
        "department": "string (e.g. 'Marketing', 'Sales', 'Customer Support', 'Content', 'Operations', 'Finance & Admin', 'Analytics')",
        "priority": "string (one of: critical, high, medium, low)",
        "overview": "string (2-3 sentences on what this department should focus on for THIS business)",
        "weeklyTasks": ["string array of 3-5 specific recurring weekly tasks"],
        "monthlyTasks": ["string array of 2-4 specific recurring monthly tasks"],
        "kpis": ["string array of 2-4 key metrics this department should track"],
        "howToStart": "string (1-2 sentences: the first concrete action to take to set up this department)"
      }
    ],
    "ninetyDayPlan": [
      {
        "task": "string (specific action item)",
        "timeline": "string (e.g. 'Week 1-2', 'Month 1', 'Month 2', 'Month 3')",
        "priority": "string (one of: critical, high, medium)",
        "department": "string (which department owns this)"
      }
    ],
    "keyMetrics": ["string array of 8-12 most important KPIs to track, with brief explanation of each (e.g. 'Customer Acquisition Cost (CAC) — how much it costs to get one paying customer')"],
    "teamRecommendations": "string (2-4 sentences on what roles to hire or outsource first, based on team size and stage)",
    "risks": ["string array of 3-5 biggest risks or pitfalls for this specific business, with a one-sentence mitigation strategy for each"]
  }
}

Rules for categories:
- Include ALL 8 categories. Set relevanceScore to 0-15 for irrelevant ones.
- The "development" category covers AI coding tools, website builders, and web development platforms. Score it HIGH if the business needs a website, needs to build/improve their web presence, or is a web design/development business. Even web designers and developers benefit from AI coding tools to speed up their work.
- If the user specifies what they want to "automate first", give a significant scoring boost (10-20 points) to the categories that directly address that automation need.
- If the user lists "current tools", assess what categories are already partially covered and may need complementary rather than duplicate tooling.
- Use structured data fields (stage, teamSize, budget) to calibrate the scale and sophistication of recommendations.
- Be specific to the business described. Do not be generic.

Rules for businessBreakdown:
- operationsPlaybook should include 5-7 department sections, ordered by priority.
- ninetyDayPlan should have 10-15 action items, chronologically ordered.
- Everything should be concrete and actionable — not vague platitudes.
- Reference the actual business, product, audience, and challenges mentioned.
- If information wasn't provided (e.g. no competitors mentioned), make reasonable inferences but note them.`;

function buildAnalysisPrompt(businessIdea: string, answers?: Record<string, unknown>): string {
  let prompt = `Analyze this business and return the full JSON analysis with business breakdown:\n\n${businessIdea}`;

  if (answers && Object.keys(answers).length > 0) {
    const fields = [
      answers.stage && `Business Stage: ${answers.stage}`,
      answers.teamSize && `Team Size: ${answers.teamSize}`,
      answers.businessModel && `Business Model: ${answers.businessModel}`,
      answers.targetAudience && `Target Audience: ${answers.targetAudience}`,
      answers.topGoal && `Top Goal (next 3 months): ${answers.topGoal}`,
      answers.biggestChallenge && `Biggest Challenge: ${answers.biggestChallenge}`,
      Array.isArray(answers.operations) && answers.operations.length > 0 && `Operations Needing Help: ${answers.operations.join(", ")}`,
      answers.hasWebsite && `Has Website: ${answers.hasWebsite}`,
      answers.websiteQuality && `Website Quality: ${answers.websiteQuality}`,
      answers.revenueModel && `Revenue Model: ${answers.revenueModel}`,
      answers.salesProcess && `Sales Process: ${answers.salesProcess}`,
      Array.isArray(answers.marketingChannels) && answers.marketingChannels.length > 0 && `Marketing Channels: ${answers.marketingChannels.join(", ")}`,
      answers.currentTools && `Current Tools Already Using: ${answers.currentTools}`,
      answers.currentCustomerCount && `Current Customer Count: ${answers.currentCustomerCount}`,
      answers.automateFirst && `PRIORITY — Would Automate First: ${answers.automateFirst}`,
    ].filter(Boolean);

    if (fields.length > 0) {
      prompt += `\n\n--- STRUCTURED QUESTIONNAIRE DATA ---\n${fields.join("\n")}`;
      prompt += `\n\nIMPORTANT: Weight the "Would Automate First" field heavily in your category scoring — this represents the founder's most urgent need. Also consider their existing tools to avoid recommending redundant categories.`;
    }
  }

  return prompt;
}

export async function analyzeBusinessIdea(
  businessIdea: string,
  answers?: Record<string, unknown>
): Promise<BusinessAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildAnalysisPrompt(businessIdea, answers),
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  const content = textBlock?.text;
  if (!content) {
    throw new Error("No response from AI");
  }

  let parsed: BusinessAnalysis;
  try {
    parsed = JSON.parse(content);
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response as JSON");
    }
    parsed = JSON.parse(jsonMatch[0]);
  }

  if (
    !parsed.businessType ||
    !parsed.categories ||
    !Array.isArray(parsed.categories)
  ) {
    throw new Error("Invalid AI response structure");
  }

  // Ensure all categories present
  parsed.categories = parsed.categories.filter((c) =>
    VALID_CATEGORIES.includes(c.category as ToolCategory)
  );

  for (const validCat of VALID_CATEGORIES) {
    if (!parsed.categories.find((c) => c.category === validCat)) {
      parsed.categories.push({
        category: validCat,
        relevanceScore: 5,
        reasoning: "Low priority for this business type",
        suggestedTasks: [],
      });
    }
  }

  parsed.categories = parsed.categories.map((c) => ({
    ...c,
    relevanceScore: Math.max(0, Math.min(100, c.relevanceScore)),
  }));

  // Ensure businessBreakdown exists with defaults
  if (!parsed.businessBreakdown) {
    parsed.businessBreakdown = {
      executiveSummary: parsed.businessSummary || "",
      revenueStrategy: "",
      growthStrategy: "",
      operationsPlaybook: [],
      ninetyDayPlan: [],
      keyMetrics: [],
      teamRecommendations: "",
      risks: [],
    };
  }

  return parsed;
}

/**
 * Second-pass: Claude ranks specific tools from the database for this business.
 * Returns per-tool scores and business-specific reasoning.
 */
export async function rankToolsForBusiness(
  analysis: BusinessAnalysis,
  budget: number,
  answers: Record<string, unknown>
): Promise<ToolRanking[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return [];

  const client = new Anthropic({ apiKey });

  // Compact tool summaries to keep token count reasonable
  const toolSummaries = AI_TOOLS_DATABASE.map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
    cost: t.monthlyCost,
    tier: t.tier,
    tags: t.useCaseTags,
    desc: t.description.slice(0, 150),
    free: t.hasFreeTier,
    bestFor: t.bestFor || "",
    avoidIf: t.avoidIf || "",
  }));

  const RANK_SYSTEM = `You are an AI tools advisor. Given a business analysis and a catalog of AI tools, score each tool's specific fit for THIS business.

SCORING GUIDE:
- 0-20: Irrelevant or harmful for this business. Do not include these.
- 21-40: Marginally useful, low priority.
- 41-60: Generally useful but not a specific need.
- 61-80: Good fit, addresses a real need.
- 81-100: Excellent fit, addresses a critical or top-priority need.

CONSIDER:
- Business stage and team size — don't recommend enterprise tools for solo founders or early-stage startups.
- Budget — prioritize tools with free tiers when budget is tight.
- What they want to automate FIRST — these tools should score highest.
- Current tools they already use — do NOT recommend tools that duplicate what they have. DO recommend tools that complement their existing stack.
- Tool synergies — some tools work better together.
- Scale appropriateness — a $140/mo SEO suite is overkill for a pre-launch idea.

You MUST respond with valid JSON only: { "rankings": [{ "toolId": "string", "score": number, "reason": "string (1-2 sentences, specific to THIS business)" }] }
Only include tools scoring above 20. Order by score descending.`;

  const userMessage = `BUSINESS:
Type: ${analysis.businessType}
Summary: ${analysis.businessSummary}

KEY CONTEXT:
- Stage: ${answers.stage || "unknown"}
- Team: ${answers.teamSize || "unknown"}
- Budget: $${budget}/mo for AI tools
- Currently using: ${answers.currentTools || "nothing specified"}
- Automate first: ${answers.automateFirst || "not specified"}
- Biggest challenge: ${answers.biggestChallenge || "not specified"}
- Operations needing help: ${Array.isArray(answers.operations) ? answers.operations.join(", ") : "not specified"}
- Marketing channels: ${Array.isArray(answers.marketingChannels) ? answers.marketingChannels.join(", ") : "not specified"}
- Has website: ${answers.hasWebsite || "unknown"}
- Revenue model: ${answers.revenueModel || "unknown"}
- Customers: ${answers.currentCustomerCount || "unknown"}

CATEGORY RELEVANCE (from analysis):
${analysis.categories.map((c) => `${c.category}: ${c.relevanceScore}/100 — ${c.reasoning}`).join("\n")}

TOP AUTOMATION OPPORTUNITIES:
${analysis.keyAutomationOpportunities.join("\n")}

AVAILABLE TOOLS:
${JSON.stringify(toolSummaries, null, 1)}

Score each tool for this specific business.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: RANK_SYSTEM,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  const content = textBlock?.text;
  if (!content) return [];

  try {
    let parsed: { rankings: ToolRanking[] };
    try {
      parsed = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return [];
      parsed = JSON.parse(jsonMatch[0]);
    }
    return Array.isArray(parsed.rankings) ? parsed.rankings : [];
  } catch {
    console.error("Failed to parse tool rankings from Claude");
    return [];
  }
}
