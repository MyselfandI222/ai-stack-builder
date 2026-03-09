import { AITool } from "@/types";

export const AI_TOOLS_DATABASE: AITool[] = [
  // ─── MARKETING ───────────────────────────────────────────────
  {
    id: "hubspot-ai",
    name: "HubSpot AI",
    description:
      "All-in-one CRM with AI-powered email marketing, lead scoring, and campaign optimization. Automates follow-ups and personalizes outreach at scale.",
    category: "marketing",
    monthlyCost: 45,
    hasFreeTier: true,
    freeTierLimits: "Limited contacts and features",
    useCaseTags: ["email marketing", "crm", "lead scoring", "automation"],
    website: "https://hubspot.com",
    tier: "essential",
  },
  {
    id: "mailchimp-ai",
    name: "Mailchimp AI",
    description:
      "Email marketing platform with AI-generated content suggestions, send-time optimization, and audience segmentation.",
    category: "marketing",
    monthlyCost: 20,
    hasFreeTier: true,
    freeTierLimits: "500 contacts, 1,000 sends/month",
    useCaseTags: ["email marketing", "newsletters", "audience segmentation"],
    website: "https://mailchimp.com",
    tier: "recommended",
  },
  {
    id: "surfer-seo",
    name: "Surfer SEO",
    description:
      "AI-powered SEO tool for content optimization, keyword research, and SERP analysis. Provides real-time content scoring.",
    category: "marketing",
    monthlyCost: 89,
    hasFreeTier: false,
    useCaseTags: ["seo", "content optimization", "keyword research"],
    website: "https://surferseo.com",
    tier: "recommended",
  },
  {
    id: "semrush-ai",
    name: "Semrush",
    description:
      "Comprehensive SEO and competitive analysis toolkit with AI writing assistant, position tracking, and backlink analytics.",
    category: "marketing",
    monthlyCost: 130,
    hasFreeTier: true,
    freeTierLimits: "10 requests/day",
    useCaseTags: ["seo", "competitive analysis", "ppc", "content marketing"],
    website: "https://semrush.com",
    tier: "nice-to-have",
  },
  {
    id: "buffer-ai",
    name: "Buffer",
    description:
      "Social media scheduling and analytics with AI-powered post suggestions and optimal posting time recommendations.",
    category: "marketing",
    monthlyCost: 6,
    hasFreeTier: true,
    freeTierLimits: "3 social channels",
    useCaseTags: ["social media", "scheduling", "analytics"],
    website: "https://buffer.com",
    tier: "recommended",
  },

  // ─── CONTENT CREATION ────────────────────────────────────────
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    description:
      "OpenAI's flagship AI assistant for writing, brainstorming, coding, and analysis. GPT-4 access with browsing and image generation.",
    category: "content-creation",
    monthlyCost: 20,
    hasFreeTier: true,
    freeTierLimits: "GPT-3.5 with usage limits",
    useCaseTags: ["writing", "brainstorming", "coding", "research"],
    website: "https://chat.openai.com",
    tier: "recommended",
    competitorGroup: "general-ai-assistant",
  },
  {
    id: "claude-pro",
    name: "Claude Pro",
    description:
      "Anthropic's AI assistant excelling at long-form writing, analysis, and nuanced reasoning. 200K context window for processing large documents.",
    category: "content-creation",
    monthlyCost: 20,
    hasFreeTier: true,
    freeTierLimits: "Limited daily messages",
    useCaseTags: ["writing", "analysis", "research", "coding"],
    website: "https://claude.ai",
    tier: "recommended",
    competitorGroup: "general-ai-assistant",
  },
  {
    id: "gemini-advanced",
    name: "Gemini Advanced",
    description:
      "Google's AI assistant with deep Google Workspace integration, strong at research, data analysis, and multimodal reasoning.",
    category: "content-creation",
    monthlyCost: 20,
    hasFreeTier: true,
    freeTierLimits: "Basic Gemini access",
    useCaseTags: ["writing", "research", "data analysis", "coding"],
    website: "https://gemini.google.com",
    tier: "recommended",
    competitorGroup: "general-ai-assistant",
  },
  {
    id: "jasper",
    name: "Jasper",
    description:
      "AI marketing copywriter with brand voice training, campaign templates, and team collaboration. Generates ads, emails, blog posts, and social content.",
    category: "content-creation",
    monthlyCost: 49,
    hasFreeTier: false,
    useCaseTags: ["copywriting", "marketing copy", "brand voice", "ads"],
    website: "https://jasper.ai",
    tier: "recommended",
    competitorGroup: "ai-copywriter",
  },
  {
    id: "copy-ai",
    name: "Copy.ai",
    description:
      "AI writing tool specialized in marketing copy, product descriptions, and social media content with 90+ templates.",
    category: "content-creation",
    monthlyCost: 49,
    hasFreeTier: true,
    freeTierLimits: "2,000 words/month",
    useCaseTags: ["copywriting", "product descriptions", "social media"],
    website: "https://copy.ai",
    tier: "recommended",
    competitorGroup: "ai-copywriter",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    description:
      "Premier AI image generator for creating marketing visuals, product mockups, social media graphics, and brand imagery.",
    category: "content-creation",
    monthlyCost: 10,
    hasFreeTier: false,
    useCaseTags: ["image generation", "design", "visuals", "branding"],
    website: "https://midjourney.com",
    tier: "recommended",
  },
  {
    id: "canva-ai",
    name: "Canva Pro (AI)",
    description:
      "Design platform with AI-powered Magic Write, background removal, image generation, and brand kit management.",
    category: "content-creation",
    monthlyCost: 15,
    hasFreeTier: true,
    freeTierLimits: "Limited AI features and templates",
    useCaseTags: ["design", "social media graphics", "presentations", "branding"],
    website: "https://canva.com",
    tier: "essential",
  },
  {
    id: "descript",
    name: "Descript",
    description:
      "AI-powered video and podcast editor. Edit video by editing text, auto-transcribe, remove filler words, and generate clips.",
    category: "content-creation",
    monthlyCost: 24,
    hasFreeTier: true,
    freeTierLimits: "1 hour transcription/month",
    useCaseTags: ["video editing", "podcast", "transcription", "content repurposing"],
    website: "https://descript.com",
    tier: "nice-to-have",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    description:
      "AI voice synthesis and cloning platform. Generate realistic voiceovers for videos, podcasts, and audio content.",
    category: "content-creation",
    monthlyCost: 5,
    hasFreeTier: true,
    freeTierLimits: "10,000 characters/month",
    useCaseTags: ["voice synthesis", "voiceover", "audio", "text-to-speech"],
    website: "https://elevenlabs.io",
    tier: "nice-to-have",
  },
  {
    id: "synthesia",
    name: "Synthesia",
    description:
      "AI video generation platform that creates professional videos with AI avatars. No camera, studio, or actors needed.",
    category: "content-creation",
    monthlyCost: 22,
    hasFreeTier: false,
    useCaseTags: ["video generation", "training videos", "marketing videos"],
    website: "https://synthesia.io",
    tier: "nice-to-have",
  },

  // ─── CUSTOMER SUPPORT ────────────────────────────────────────
  {
    id: "intercom-ai",
    name: "Intercom (Fin AI)",
    description:
      "Customer messaging platform with Fin AI agent that resolves 50%+ of support queries instantly. Live chat, help center, and ticketing.",
    category: "customer-support",
    monthlyCost: 74,
    hasFreeTier: false,
    useCaseTags: ["live chat", "ai chatbot", "help desk", "ticketing"],
    website: "https://intercom.com",
    tier: "essential",
  },
  {
    id: "tidio-ai",
    name: "Tidio AI",
    description:
      "Affordable AI chatbot and live chat for small businesses. Lyro AI handles FAQs, order tracking, and product recommendations.",
    category: "customer-support",
    monthlyCost: 29,
    hasFreeTier: true,
    freeTierLimits: "50 conversations/month",
    useCaseTags: ["chatbot", "live chat", "ecommerce support"],
    website: "https://tidio.com",
    tier: "recommended",
  },
  {
    id: "zendesk-ai",
    name: "Zendesk AI",
    description:
      "Enterprise-grade support platform with AI-powered ticket routing, agent assist, and automated responses.",
    category: "customer-support",
    monthlyCost: 55,
    hasFreeTier: false,
    useCaseTags: ["help desk", "ticketing", "knowledge base", "ai routing"],
    website: "https://zendesk.com",
    tier: "nice-to-have",
  },
  {
    id: "freshdesk-ai",
    name: "Freshdesk (Freddy AI)",
    description:
      "Customer support suite with Freddy AI for auto-triage, canned responses, and predictive support analytics.",
    category: "customer-support",
    monthlyCost: 15,
    hasFreeTier: true,
    freeTierLimits: "Up to 10 agents",
    useCaseTags: ["ticketing", "ai triage", "email support"],
    website: "https://freshdesk.com",
    tier: "recommended",
  },

  // ─── OPERATIONS ──────────────────────────────────────────────
  {
    id: "zapier",
    name: "Zapier",
    description:
      "No-code automation platform connecting 6,000+ apps. Automate workflows between tools with AI-powered Zap suggestions.",
    category: "operations",
    monthlyCost: 20,
    hasFreeTier: true,
    freeTierLimits: "100 tasks/month, 5 zaps",
    useCaseTags: ["automation", "integrations", "workflow", "no-code"],
    website: "https://zapier.com",
    tier: "essential",
  },
  {
    id: "make",
    name: "Make.com",
    description:
      "Visual automation platform for complex multi-step workflows. More powerful than Zapier for advanced scenarios with branching logic.",
    category: "operations",
    monthlyCost: 9,
    hasFreeTier: true,
    freeTierLimits: "1,000 operations/month",
    useCaseTags: ["automation", "workflow", "integrations", "visual builder"],
    website: "https://make.com",
    tier: "recommended",
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    description:
      "All-in-one workspace with AI writing, summarization, and Q&A. Manage docs, wikis, projects, and databases in one place.",
    category: "operations",
    monthlyCost: 10,
    hasFreeTier: true,
    freeTierLimits: "Limited AI queries",
    useCaseTags: ["project management", "docs", "wiki", "ai writing"],
    website: "https://notion.so",
    tier: "essential",
  },
  {
    id: "airtable-ai",
    name: "Airtable AI",
    description:
      "Spreadsheet-database hybrid with AI field types for categorization, summarization, and data extraction from records.",
    category: "operations",
    monthlyCost: 20,
    hasFreeTier: true,
    freeTierLimits: "1,000 records per base",
    useCaseTags: ["database", "project management", "automation", "data"],
    website: "https://airtable.com",
    tier: "recommended",
  },
  {
    id: "clickup-ai",
    name: "ClickUp AI",
    description:
      "Project management platform with AI for task summaries, action items extraction, and writing assistance.",
    category: "operations",
    monthlyCost: 7,
    hasFreeTier: true,
    freeTierLimits: "100MB storage, unlimited tasks",
    useCaseTags: ["project management", "task management", "docs"],
    website: "https://clickup.com",
    tier: "nice-to-have",
  },

  // ─── SALES ───────────────────────────────────────────────────
  {
    id: "apollo-ai",
    name: "Apollo.io",
    description:
      "AI-powered sales intelligence platform with 275M+ contacts database, email sequencing, and lead scoring.",
    category: "sales",
    monthlyCost: 49,
    hasFreeTier: true,
    freeTierLimits: "Limited credits and contacts",
    useCaseTags: ["lead generation", "email outreach", "sales intelligence"],
    website: "https://apollo.io",
    tier: "essential",
  },
  {
    id: "instantly-ai",
    name: "Instantly.ai",
    description:
      "Cold email platform with AI personalization, unlimited email accounts, and smart sending to maximize deliverability.",
    category: "sales",
    monthlyCost: 30,
    hasFreeTier: false,
    useCaseTags: ["cold email", "outreach", "email automation"],
    website: "https://instantly.ai",
    tier: "recommended",
  },
  {
    id: "gong-ai",
    name: "Gong",
    description:
      "Revenue intelligence platform that analyzes sales calls with AI, provides coaching insights, and forecasts deals.",
    category: "sales",
    monthlyCost: 100,
    hasFreeTier: false,
    useCaseTags: ["call analytics", "sales coaching", "revenue intelligence"],
    website: "https://gong.io",
    tier: "nice-to-have",
  },
  {
    id: "shopify-magic",
    name: "Shopify Magic",
    description:
      "AI features built into Shopify for product descriptions, email subject lines, and store content generation.",
    category: "sales",
    monthlyCost: 39,
    hasFreeTier: false,
    useCaseTags: ["ecommerce", "product descriptions", "store management"],
    website: "https://shopify.com",
    tier: "essential",
  },
  {
    id: "lemlist",
    name: "Lemlist",
    description:
      "AI-powered outreach platform with personalized images, LinkedIn automation, and multi-channel sequences.",
    category: "sales",
    monthlyCost: 39,
    hasFreeTier: false,
    useCaseTags: ["outreach", "linkedin", "email sequences", "personalization"],
    website: "https://lemlist.com",
    tier: "recommended",
  },

  // ─── ADMIN & PRODUCTIVITY ────────────────────────────────────
  {
    id: "otter-ai",
    name: "Otter.ai",
    description:
      "AI meeting transcription and note-taking. Joins meetings automatically, generates summaries, and extracts action items.",
    category: "admin",
    monthlyCost: 17,
    hasFreeTier: true,
    freeTierLimits: "300 minutes/month",
    useCaseTags: ["meeting notes", "transcription", "ai summaries"],
    website: "https://otter.ai",
    tier: "recommended",
  },
  {
    id: "grammarly-ai",
    name: "Grammarly Business",
    description:
      "AI writing assistant for professional communication. Tone detection, style guides, and brand voice consistency.",
    category: "admin",
    monthlyCost: 15,
    hasFreeTier: true,
    freeTierLimits: "Basic grammar and spelling",
    useCaseTags: ["writing", "grammar", "communication", "brand voice"],
    website: "https://grammarly.com",
    tier: "recommended",
  },
  {
    id: "reclaim-ai",
    name: "Reclaim.ai",
    description:
      "AI calendar management that auto-schedules tasks, habits, and meetings. Protects focus time and optimizes your schedule.",
    category: "admin",
    monthlyCost: 10,
    hasFreeTier: true,
    freeTierLimits: "Basic smart scheduling",
    useCaseTags: ["calendar", "scheduling", "time management", "productivity"],
    website: "https://reclaim.ai",
    tier: "nice-to-have",
  },
  {
    id: "fireflies-ai",
    name: "Fireflies.ai",
    description:
      "AI meeting assistant that records, transcribes, and analyzes voice conversations across any web-conferencing platform.",
    category: "admin",
    monthlyCost: 10,
    hasFreeTier: true,
    freeTierLimits: "Limited transcription credits",
    useCaseTags: ["meeting notes", "transcription", "crm integration"],
    website: "https://fireflies.ai",
    tier: "nice-to-have",
  },

  // ─── ANALYTICS & DATA ───────────────────────────────────────
  {
    id: "mixpanel",
    name: "Mixpanel",
    description:
      "Product analytics platform with AI-powered insights, funnel analysis, and user behavior tracking for data-driven decisions.",
    category: "analytics",
    monthlyCost: 25,
    hasFreeTier: true,
    freeTierLimits: "20M events/month",
    useCaseTags: ["product analytics", "funnels", "user behavior", "retention"],
    website: "https://mixpanel.com",
    tier: "recommended",
  },
  {
    id: "hotjar-ai",
    name: "Hotjar (AI Surveys)",
    description:
      "Website heatmaps, session recordings, and AI-powered surveys. Understand user behavior and gather qualitative feedback.",
    category: "analytics",
    monthlyCost: 32,
    hasFreeTier: true,
    freeTierLimits: "35 daily sessions",
    useCaseTags: ["heatmaps", "user research", "surveys", "ux analytics"],
    website: "https://hotjar.com",
    tier: "recommended",
  },
  {
    id: "google-analytics",
    name: "Google Analytics 4",
    description:
      "Free web analytics with AI-powered insights, audience predictions, and cross-platform tracking.",
    category: "analytics",
    monthlyCost: 0,
    hasFreeTier: true,
    freeTierLimits: "Full featured free tier",
    useCaseTags: ["web analytics", "traffic analysis", "conversions"],
    website: "https://analytics.google.com",
    tier: "essential",
  },
  {
    id: "tableau-ai",
    name: "Tableau",
    description:
      "Data visualization platform with AI-driven analytics, natural language queries, and automated insight discovery.",
    category: "analytics",
    monthlyCost: 75,
    hasFreeTier: false,
    useCaseTags: ["data visualization", "business intelligence", "dashboards"],
    website: "https://tableau.com",
    tier: "nice-to-have",
  },
];

export function getToolsByCategory(
  category: string
): AITool[] {
  return AI_TOOLS_DATABASE.filter((tool) => tool.category === category);
}

export function getToolById(id: string): AITool | undefined {
  return AI_TOOLS_DATABASE.find((tool) => tool.id === id);
}
