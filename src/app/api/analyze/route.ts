import { NextRequest, NextResponse } from "next/server";
import { analyzeBusinessIdea, rankToolsForBusiness } from "@/lib/ai-analyzer";
import { getDemoAnalysis } from "@/lib/demo-analysis";
import { optimizeStack } from "@/lib/budget-optimizer";
import { AnalyzeRequest, AnalyzeResponse } from "@/types";

const isDemoMode = !process.env.ANTHROPIC_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json();

    if (!body.businessIdea || body.businessIdea.trim().length < 20) {
      return NextResponse.json<AnalyzeResponse>(
        {
          success: false,
          error: "Please provide a more detailed business description (at least 20 characters).",
        },
        { status: 400 }
      );
    }

    if (body.budget == null || body.budget < 0 || body.budget > 50000) {
      return NextResponse.json<AnalyzeResponse>(
        {
          success: false,
          error: "Budget must be between $0 and $50,000 per month.",
        },
        { status: 400 }
      );
    }

    // Step 1: Get analysis — real AI or demo fallback
    const analysis = isDemoMode
      ? getDemoAnalysis(body.businessIdea)
      : await analyzeBusinessIdea(body.businessIdea, body.answers);

    // Step 2: Claude ranks specific tools for this business (skipped in demo mode)
    let claudeToolRankings;
    if (!isDemoMode && body.answers) {
      try {
        claudeToolRankings = await rankToolsForBusiness(analysis, body.budget, body.answers);
      } catch (err) {
        console.error("Tool ranking pass failed, falling back to algorithm-only:", err);
      }
    }

    // Step 3: Run the budget optimization algorithm with full context
    const recommendation = optimizeStack(analysis, body.budget, {
      currentTools: String(body.answers?.currentTools || ""),
      stage: String(body.answers?.stage || ""),
      automateFirst: String(body.answers?.automateFirst || ""),
      claudeToolRankings,
    });

    return NextResponse.json<AnalyzeResponse>({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    console.error("Analysis error:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json<AnalyzeResponse>(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
