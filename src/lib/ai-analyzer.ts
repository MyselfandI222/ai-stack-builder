import Anthropic from "@anthropic-ai/sdk";
import { BusinessAnalysis, ToolCategory } from "@/types";

const VALID_CATEGORIES: ToolCategory[] = [
  "marketing",
  "content-creation",
  "customer-support",
  "operations",
  "sales",
  "admin",
  "analytics",
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
      "category": "string (one of: marketing, content-creation, customer-support, operations, sales, admin, analytics)",
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
- Include ALL 7 categories. Set relevanceScore to 0-15 for irrelevant ones.
- Be specific to the business described. Do not be generic.

Rules for businessBreakdown:
- operationsPlaybook should include 5-7 department sections, ordered by priority.
- ninetyDayPlan should have 10-15 action items, chronologically ordered.
- Everything should be concrete and actionable — not vague platitudes.
- Reference the actual business, product, audience, and challenges mentioned.
- If information wasn't provided (e.g. no competitors mentioned), make reasonable inferences but note them.`;

export async function analyzeBusinessIdea(
  businessIdea: string
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
        content: `Analyze this business and return the full JSON analysis with business breakdown:\n\n${businessIdea}`,
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
