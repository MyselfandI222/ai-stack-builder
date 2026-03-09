import { NextRequest, NextResponse } from "next/server";
import { analyzeBusinessIdea } from "@/lib/ai-analyzer";
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
      : await analyzeBusinessIdea(body.businessIdea);

    // Step 2: Run the budget optimization algorithm
    const recommendation = optimizeStack(analysis, body.budget);

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
