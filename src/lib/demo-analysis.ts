import { BusinessAnalysis } from "@/types";

/**
 * Returns a realistic demo analysis based on keywords found in the user's input.
 * Used when ANTHROPIC_API_KEY is not configured, so the app works without API costs.
 */
export function getDemoAnalysis(businessIdea: string): BusinessAnalysis {
  const idea = businessIdea.toLowerCase();

  // Detect business type from keywords
  let businessType = "Startup";
  let businessSummary = "";

  if (idea.includes("saas") || idea.includes("software")) {
    businessType = "B2B SaaS";
    businessSummary =
      "A software-as-a-service business targeting business customers with a recurring revenue model. Strong potential for automation across marketing, sales, and customer support.";
  } else if (idea.includes("ecommerce") || idea.includes("shop") || idea.includes("store") || idea.includes("sell")) {
    businessType = "DTC Ecommerce";
    businessSummary =
      "A direct-to-consumer ecommerce business selling products online. Key focus areas include marketing automation, content creation for product listings, and customer support at scale.";
  } else if (idea.includes("agency") || idea.includes("consult")) {
    businessType = "Agency / Consultancy";
    businessSummary =
      "A service-based agency handling multiple clients. Operations efficiency, content production, and client communication are critical automation opportunities.";
  } else if (idea.includes("marketplace")) {
    businessType = "Marketplace";
    businessSummary =
      "A two-sided marketplace connecting buyers and sellers. Growth depends on balancing supply and demand while automating trust, support, and marketing.";
  } else if (idea.includes("content") || idea.includes("media") || idea.includes("blog")) {
    businessType = "Content / Media";
    businessSummary =
      "A content-driven business that relies heavily on production volume and audience engagement. Content creation and distribution automation are the highest-leverage opportunities.";
  } else {
    businessType = "Small Business";
    businessSummary =
      "A growing business with opportunities to automate operations across marketing, customer support, and administrative tasks. The right AI tools can significantly reduce manual workload and accelerate growth.";
  }

  // Score categories based on keywords in the input
  const hasMarketing = idea.includes("marketing") || idea.includes("ads") || idea.includes("growth");
  const hasContent = idea.includes("content") || idea.includes("blog") || idea.includes("social");
  const hasSupport = idea.includes("support") || idea.includes("customer") || idea.includes("service");
  const hasOps = idea.includes("operations") || idea.includes("workflow") || idea.includes("automat");
  const hasSales = idea.includes("sales") || idea.includes("leads") || idea.includes("crm");
  const hasAdmin = idea.includes("admin") || idea.includes("productivity") || idea.includes("team");
  const hasAnalytics = idea.includes("analytics") || idea.includes("data") || idea.includes("track");
  const hasDevelopment = idea.includes("website") || idea.includes("web") || idea.includes("code") || idea.includes("developer") || idea.includes("design") || idea.includes("app");

  return {
    businessType,
    businessSummary,
    categories: [
      {
        category: "marketing",
        relevanceScore: hasMarketing ? 90 : 70,
        reasoning:
          "Marketing automation is critical for customer acquisition. Automating email campaigns, social posting, and ad optimization will free up significant time and improve conversion rates.",
        suggestedTasks: [
          "Automate email drip campaigns for new leads",
          "Schedule and optimize social media posts",
          "Run A/B tests on landing pages and ad creatives",
          "Track marketing attribution across channels",
        ],
      },
      {
        category: "content-creation",
        relevanceScore: hasContent ? 85 : 60,
        reasoning:
          "Content fuels growth across all channels. AI can accelerate blog writing, social media content, product descriptions, and email copy while maintaining brand voice.",
        suggestedTasks: [
          "Generate first drafts of blog posts and articles",
          "Create social media content calendars",
          "Write and optimize product descriptions",
          "Produce email newsletter content",
        ],
      },
      {
        category: "customer-support",
        relevanceScore: hasSupport ? 85 : 55,
        reasoning:
          "As you scale, support volume grows fast. AI chatbots and automated ticketing can handle common inquiries while keeping response times low.",
        suggestedTasks: [
          "Deploy AI chatbot for common customer questions",
          "Automate ticket routing and prioritization",
          "Generate help center articles from support tickets",
          "Monitor customer sentiment and escalate issues",
        ],
      },
      {
        category: "operations",
        relevanceScore: hasOps ? 85 : 65,
        reasoning:
          "Streamlining internal operations reduces overhead and lets your team focus on growth. Workflow automation and project management are high-impact areas.",
        suggestedTasks: [
          "Automate recurring task creation and assignment",
          "Set up workflow triggers for key business events",
          "Streamline onboarding processes for new team members",
          "Automate invoice generation and payment reminders",
        ],
      },
      {
        category: "sales",
        relevanceScore: hasSales ? 88 : 50,
        reasoning:
          "AI can qualify leads, personalize outreach, and keep your pipeline organized. Even a small team can run enterprise-grade sales processes with the right tools.",
        suggestedTasks: [
          "Score and prioritize inbound leads automatically",
          "Personalize outbound email sequences",
          "Automate follow-up reminders and deal tracking",
          "Generate sales proposals and pitch decks",
        ],
      },
      {
        category: "admin",
        relevanceScore: hasAdmin ? 75 : 45,
        reasoning:
          "Administrative tasks eat up time that should go toward growth. AI can handle scheduling, document management, and internal communication.",
        suggestedTasks: [
          "Automate meeting scheduling and follow-ups",
          "Generate meeting notes and action items",
          "Manage document organization and search",
          "Streamline internal team communication",
        ],
      },
      {
        category: "analytics",
        relevanceScore: hasAnalytics ? 80 : 50,
        reasoning:
          "Data-driven decisions require good analytics infrastructure. AI can automate reporting, surface insights, and alert you to important trends.",
        suggestedTasks: [
          "Build automated dashboards for key metrics",
          "Set up alerts for anomalies in revenue and traffic",
          "Generate weekly business performance reports",
          "Track cohort retention and lifetime value",
        ],
      },
      {
        category: "development",
        relevanceScore: hasDevelopment ? 85 : 40,
        reasoning:
          "AI coding tools and website builders can dramatically accelerate web development. Whether you need to build a new site, improve an existing one, or speed up development workflows, AI-powered tools are a game changer.",
        suggestedTasks: [
          "Build or redesign business website using AI-powered tools",
          "Use AI code editors to accelerate development speed",
          "Generate landing pages and UI components from descriptions",
          "Deploy and host web applications with modern platforms",
        ],
      },
    ],
    keyAutomationOpportunities: [
      "Set up automated email sequences for lead nurturing and customer onboarding",
      "Deploy AI-powered content generation for blog, social media, and product copy",
      "Implement a chatbot for first-line customer support to reduce ticket volume by 40-60%",
      "Automate weekly reporting and KPI dashboards to save 5+ hours per week",
      "Use AI lead scoring to focus sales effort on highest-converting prospects",
    ],
    businessBreakdown: {
      executiveSummary: `This is a ${businessType.toLowerCase()} with strong potential for AI-driven automation. The business serves a clear market need and can gain significant competitive advantage by automating repetitive operations early. The biggest opportunity is reducing manual workload in marketing and customer support, freeing the team to focus on product and growth. With the right tool stack, this business can operate at 2-3x the efficiency of competitors relying on manual processes.`,
      revenueStrategy:
        "Focus on a clear value metric for pricing that scales with customer success. Start with a competitive entry price to reduce friction, then build upsell paths as customers get value. Implement annual billing discounts to improve cash flow and reduce churn. Consider a free tier or trial to build top-of-funnel volume, converting to paid through product-led growth and targeted email nurturing.",
      growthStrategy:
        "Start with one or two acquisition channels and master them before diversifying. Content marketing and SEO provide compounding returns over time, while paid ads can accelerate early traction. Build a referral loop into the product — happy customers are the cheapest acquisition channel. Focus on retention as much as acquisition; reducing churn by 5% can increase revenue by 25-95%.",
      operationsPlaybook: [
        {
          department: "Marketing",
          priority: "critical",
          overview:
            "Marketing drives the growth engine. Focus on building repeatable, measurable campaigns across 2-3 channels. Automate where possible so you can scale output without scaling headcount.",
          weeklyTasks: [
            "Publish 2-3 social media posts with engagement tracking",
            "Send one email campaign to segmented audience lists",
            "Review ad performance and adjust budgets on underperformers",
            "Monitor SEO rankings and optimize top-performing pages",
          ],
          monthlyTasks: [
            "Publish 2-4 blog posts or long-form content pieces",
            "Review full-funnel conversion metrics and identify bottlenecks",
            "Test new messaging angles or audience segments",
          ],
          kpis: [
            "Customer Acquisition Cost (CAC)",
            "Marketing Qualified Leads (MQLs)",
            "Email open rate and click-through rate",
            "Organic traffic growth month-over-month",
          ],
          howToStart:
            "Set up email marketing automation first — it has the highest ROI. Start with a welcome sequence and a weekly newsletter.",
        },
        {
          department: "Sales",
          priority: "high",
          overview:
            "Even if your model is primarily self-serve, having a structured sales process for higher-value customers or partnerships will accelerate revenue. Focus on qualification and follow-up automation.",
          weeklyTasks: [
            "Review and qualify new inbound leads",
            "Send personalized follow-ups to warm prospects",
            "Update pipeline and deal stages in CRM",
            "Conduct 2-5 demo calls or sales conversations",
          ],
          monthlyTasks: [
            "Analyze win/loss patterns to improve pitch",
            "Review pricing against conversion data",
            "Clean up stale pipeline deals",
          ],
          kpis: [
            "Conversion rate from lead to customer",
            "Average deal size",
            "Sales cycle length",
            "Monthly recurring revenue (MRR) added",
          ],
          howToStart:
            "Set up a simple CRM and define your lead stages. Even a spreadsheet works to start — the key is tracking every interaction.",
        },
        {
          department: "Customer Support",
          priority: "high",
          overview:
            "Great support drives retention and word-of-mouth. Automate common inquiries and build a knowledge base so customers can self-serve, freeing your team for complex issues.",
          weeklyTasks: [
            "Respond to all support tickets within SLA",
            "Update FAQ and help center with new common questions",
            "Review chatbot conversation logs for improvement opportunities",
            "Follow up on resolved tickets to ensure satisfaction",
          ],
          monthlyTasks: [
            "Analyze top support topics and create content to address them",
            "Review CSAT scores and identify trends",
            "Train chatbot on new product features or common issues",
          ],
          kpis: [
            "First response time",
            "Customer satisfaction score (CSAT)",
            "Ticket resolution time",
            "Self-service resolution rate",
          ],
          howToStart:
            "Create a simple FAQ page with your top 10 most common questions. Then set up a shared inbox so nothing falls through the cracks.",
        },
        {
          department: "Content Production",
          priority: "high",
          overview:
            "Content is a force multiplier — it feeds marketing, supports sales, reduces support load, and builds brand authority. Use AI to accelerate production while maintaining quality.",
          weeklyTasks: [
            "Draft and edit 1-2 pieces of content (blog, social, email)",
            "Repurpose existing content into new formats",
            "Schedule content distribution across channels",
          ],
          monthlyTasks: [
            "Plan next month's content calendar aligned with business goals",
            "Audit top-performing content and double down on what works",
            "Produce one high-effort piece (case study, video, guide)",
          ],
          kpis: [
            "Content pieces published per week",
            "Engagement rate across channels",
            "Content-driven leads or signups",
          ],
          howToStart:
            "Pick one content format you can commit to weekly (blog or social). Consistency beats volume — start small and build the habit.",
        },
        {
          department: "Operations & Workflow",
          priority: "medium",
          overview:
            "Clean operations let a small team punch above its weight. Automate repetitive internal tasks, standardize processes, and document everything so the business isn't dependent on any single person.",
          weeklyTasks: [
            "Review and clear task backlogs across teams",
            "Check automated workflows are running correctly",
            "Update project timelines and flag blockers",
          ],
          monthlyTasks: [
            "Audit internal processes for automation opportunities",
            "Review tool stack usage — cut unused subscriptions",
            "Document any new processes or workflows created",
          ],
          kpis: [
            "Tasks completed vs. planned",
            "Time saved through automation (hours/week)",
            "Tool stack monthly cost",
          ],
          howToStart:
            "Map out your top 5 most time-consuming weekly tasks. Automate the most repetitive one first.",
        },
        {
          department: "Finance & Admin",
          priority: "medium",
          overview:
            "Keep finances clean and admin lightweight. Automate invoicing, expense tracking, and basic bookkeeping so you always know your numbers without spending hours on spreadsheets.",
          weeklyTasks: [
            "Review incoming/outgoing payments",
            "Categorize expenses and flag anomalies",
            "Send invoices for completed work",
          ],
          monthlyTasks: [
            "Reconcile accounts and review P&L",
            "Review runway and cash flow forecast",
            "File any necessary compliance or tax documents",
          ],
          kpis: [
            "Monthly burn rate",
            "Runway (months of cash remaining)",
            "Gross margin",
            "Outstanding invoices aging",
          ],
          howToStart:
            "Set up automated invoicing and connect your bank account to a bookkeeping tool. Know your burn rate from day one.",
        },
        {
          department: "Analytics & Data",
          priority: "medium",
          overview:
            "You can't improve what you don't measure. Set up dashboards for your core metrics early so you're making decisions based on data, not gut feeling.",
          weeklyTasks: [
            "Review key dashboard metrics",
            "Check for anomalies in traffic, revenue, or engagement",
            "Share a brief metrics update with the team",
          ],
          monthlyTasks: [
            "Run a deep-dive analysis on one focus area",
            "Update forecasts based on actual performance",
            "Identify and test one optimization hypothesis",
          ],
          kpis: [
            "Revenue growth rate",
            "Customer retention rate",
            "Net Promoter Score (NPS)",
            "Unit economics (LTV:CAC ratio)",
          ],
          howToStart:
            "Set up Google Analytics (or equivalent) and define your top 5 KPIs. Build one simple dashboard you review every Monday morning.",
        },
      ],
      ninetyDayPlan: [
        {
          task: "Set up core tool stack (CRM, email, analytics, project management)",
          timeline: "Week 1-2",
          priority: "critical",
          department: "Operations",
        },
        {
          task: "Define target customer persona and unique value proposition",
          timeline: "Week 1-2",
          priority: "critical",
          department: "Marketing",
        },
        {
          task: "Launch email welcome sequence and basic newsletter",
          timeline: "Week 2-3",
          priority: "critical",
          department: "Marketing",
        },
        {
          task: "Create FAQ page and set up support inbox",
          timeline: "Week 2-3",
          priority: "high",
          department: "Customer Support",
        },
        {
          task: "Publish first 4 pieces of content (blog or social)",
          timeline: "Week 3-4",
          priority: "high",
          department: "Content Production",
        },
        {
          task: "Set up KPI dashboard with core metrics",
          timeline: "Week 3-4",
          priority: "high",
          department: "Analytics & Data",
        },
        {
          task: "Launch first paid acquisition experiment (small budget)",
          timeline: "Month 1",
          priority: "high",
          department: "Marketing",
        },
        {
          task: "Set up automated lead scoring and CRM pipeline",
          timeline: "Month 1",
          priority: "high",
          department: "Sales",
        },
        {
          task: "Deploy AI chatbot for common support questions",
          timeline: "Month 2",
          priority: "medium",
          department: "Customer Support",
        },
        {
          task: "Build referral or word-of-mouth program",
          timeline: "Month 2",
          priority: "medium",
          department: "Marketing",
        },
        {
          task: "Hire or outsource first role based on biggest bottleneck",
          timeline: "Month 2",
          priority: "medium",
          department: "Operations",
        },
        {
          task: "Run first monthly business review with full metrics",
          timeline: "Month 2",
          priority: "medium",
          department: "Analytics & Data",
        },
        {
          task: "Optimize top-performing marketing channel based on data",
          timeline: "Month 3",
          priority: "high",
          department: "Marketing",
        },
        {
          task: "Scale content production to 2x weekly output",
          timeline: "Month 3",
          priority: "medium",
          department: "Content Production",
        },
        {
          task: "Review full 90-day results and plan next quarter",
          timeline: "Month 3",
          priority: "critical",
          department: "Operations",
        },
      ],
      keyMetrics: [
        "Monthly Recurring Revenue (MRR) — the heartbeat of your business",
        "Customer Acquisition Cost (CAC) — how much you spend to get each customer",
        "Lifetime Value (LTV) — total revenue per customer over their lifetime",
        "LTV:CAC Ratio — aim for 3:1 or higher for a healthy business",
        "Churn Rate — percentage of customers lost each month",
        "Conversion Rate — visitors to trial, trial to paid",
        "Net Promoter Score (NPS) — how likely customers are to recommend you",
        "Burn Rate — monthly cash spend",
        "Runway — months of cash remaining at current burn rate",
        "Time to Value — how quickly new users get their first win",
      ],
      teamRecommendations:
        "For a small team, prioritize hiring a versatile marketer who can handle both content and paid acquisition — this is typically the highest-leverage first hire. If support volume is growing, consider a part-time support specialist or virtual assistant before going full-time. Outsource specialized tasks like design, bookkeeping, and SEO audits rather than hiring for them. As you cross $20K+ MRR, look at a dedicated operations person to own processes and tooling.",
      risks: [
        "Trying to do everything at once — focus on 2-3 channels maximum in the first 90 days. Spreading too thin means nothing gets done well.",
        "Ignoring unit economics — if CAC is higher than LTV, you're paying to lose money. Monitor these from day one and adjust pricing or acquisition strategy early.",
        "Over-investing in tools before product-market fit — keep the tool stack lean until you've validated demand. Free tiers exist for a reason.",
        "Neglecting existing customers for new acquisition — retention is cheaper than acquisition. A 5% improvement in retention can boost profits 25-95%.",
        "Not documenting processes — if it's only in your head, the business can't scale. Write it down, even if it's just bullet points in a shared doc.",
      ],
    },
  };
}
