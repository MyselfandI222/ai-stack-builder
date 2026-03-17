/**
 * Step-by-step setup tutorials for each AI tool.
 * Only tools where account creation / AI setup is involved get tutorials.
 */

export interface TutorialStep {
  title: string;
  description: string;
  /** Visual hint: what action the user performs */
  action: "navigate" | "click" | "type" | "select" | "toggle" | "wait" | "verify";
  /** Optional helpful tip */
  tip?: string;
}

export interface ToolTutorial {
  toolId: string;
  signupUrl: string;
  /** Direct link to the tool's getting-started / onboarding page */
  gettingStartedUrl?: string;
  steps: TutorialStep[];
  /** YouTube or official video tutorial */
  videos: { title: string; url: string }[];
  /** Estimated setup time in minutes */
  setupMinutes: number;
}

export const TOOL_TUTORIALS: Record<string, ToolTutorial> = {
  // ─── MARKETING ───────────────────────────────────────────────
  "hubspot-ai": {
    toolId: "hubspot-ai",
    signupUrl: "https://app.hubspot.com/signup-hubspot/crm",
    gettingStartedUrl: "https://knowledge.hubspot.com/get-started",
    setupMinutes: 10,
    steps: [
      {
        title: "Go to HubSpot signup",
        description: "Open hubspot.com and click the orange \"Get started free\" button in the top-right corner.",
        action: "navigate",
      },
      {
        title: "Create your account",
        description: "Enter your email address. You can also sign up with Google or Microsoft. Click \"Next\".",
        action: "type",
        tip: "Use your business email — HubSpot uses it to auto-detect your company.",
      },
      {
        title: "Fill in your details",
        description: "Enter your first name, last name, and company name. Select your industry and company size from the dropdowns.",
        action: "type",
      },
      {
        title: "Choose the Free CRM plan",
        description: "On the plan selection screen, select \"Free Tools\" at the bottom. This gives you the CRM, email marketing, and basic forms.",
        action: "click",
        tip: "You can upgrade later — the free tier is powerful enough to get started.",
      },
      {
        title: "Set up your first contact list",
        description: "HubSpot will walk you through importing contacts. You can import a CSV, connect Gmail/Outlook, or start from scratch.",
        action: "click",
      },
      {
        title: "Enable Breeze AI",
        description: "Go to Settings (gear icon) → Breeze AI in the left sidebar. Toggle on the AI features you want — Content Agent, Prospecting Agent, or Customer Agent.",
        action: "toggle",
        tip: "Breeze AI features require a Professional plan ($100/seat/mo) for full access.",
      },
      {
        title: "Create your first email campaign",
        description: "Navigate to Marketing → Email in the top nav. Click \"Create email\" and choose a template. The AI assistant will help you write subject lines and body copy.",
        action: "click",
      },
    ],
    videos: [
      { title: "HubSpot CRM Tutorial for Beginners (2026)", url: "https://www.youtube.com/results?search_query=hubspot+crm+tutorial+beginners+2026" },
      { title: "HubSpot Breeze AI Complete Guide", url: "https://www.youtube.com/results?search_query=hubspot+breeze+ai+tutorial" },
    ],
  },

  "mailchimp-ai": {
    toolId: "mailchimp-ai",
    signupUrl: "https://login.mailchimp.com/signup/",
    gettingStartedUrl: "https://mailchimp.com/help/getting-started-with-mailchimp/",
    setupMinutes: 8,
    steps: [
      {
        title: "Go to Mailchimp signup",
        description: "Open mailchimp.com and click \"Sign Up Free\" in the top-right corner.",
        action: "navigate",
      },
      {
        title: "Create your account",
        description: "Enter your email, username, and password. Click \"Sign Up\". Check your inbox for a verification email and click the activation link.",
        action: "type",
      },
      {
        title: "Choose the Free plan",
        description: "Select \"Free\" on the pricing page. This gives you 250 contacts and 500 emails/month to start.",
        action: "click",
        tip: "The Standard plan ($20/mo) unlocks the AI Creative Assistant and Customer Journey Builder.",
      },
      {
        title: "Set up your audience",
        description: "Mailchimp will ask about your business. Fill in your business name, website URL, and address (required by law for email marketing).",
        action: "type",
      },
      {
        title: "Import your contacts",
        description: "Go to Audience → Manage Audience → Import Contacts. Upload a CSV or connect an integration (Shopify, WooCommerce, etc).",
        action: "click",
      },
      {
        title: "Use AI Creative Assistant",
        description: "When creating a new campaign, click \"Creative Assistant\" in the email builder. It generates brand-consistent layouts from your logo and website colors.",
        action: "click",
        tip: "Upload your brand logo first in Settings → Brand for better AI results.",
      },
    ],
    videos: [
      { title: "Mailchimp Tutorial for Beginners", url: "https://www.youtube.com/results?search_query=mailchimp+tutorial+beginners+2026" },
      { title: "Mailchimp AI Creative Assistant Guide", url: "https://www.youtube.com/results?search_query=mailchimp+ai+creative+assistant+tutorial" },
    ],
  },

  "surfer-seo": {
    toolId: "surfer-seo",
    signupUrl: "https://surferseo.com/pricing/",
    setupMinutes: 5,
    steps: [
      {
        title: "Choose a plan",
        description: "Go to surferseo.com/pricing and select Essential ($99/mo), Scale ($219/mo), or Enterprise. Click \"Start now\".",
        action: "navigate",
        tip: "No free tier — but there's a 7-day money-back guarantee.",
      },
      {
        title: "Create your account",
        description: "Enter your email and create a password. Complete the payment information.",
        action: "type",
      },
      {
        title: "Install the browser extension",
        description: "Surfer will prompt you to install the Chrome or Firefox extension. This lets you see SEO scores directly in Google Docs.",
        action: "click",
      },
      {
        title: "Create your first Content Editor",
        description: "Click \"Content Editor\" in the left sidebar → \"Create\". Enter your target keyword. Surfer analyzes the top-ranking pages and gives you a content outline.",
        action: "type",
      },
      {
        title: "Write with real-time scoring",
        description: "Start writing in the editor. The right panel shows your Content Score, recommended word count, headings, and NLP terms to include.",
        action: "type",
        tip: "Aim for a Content Score of 67+ (green). Don't over-optimize by stuffing every suggested term.",
      },
    ],
    videos: [
      { title: "Surfer SEO Complete Tutorial", url: "https://www.youtube.com/results?search_query=surfer+seo+tutorial+complete+guide" },
    ],
  },

  "semrush-ai": {
    toolId: "semrush-ai",
    signupUrl: "https://www.semrush.com/signup/",
    setupMinutes: 8,
    steps: [
      {
        title: "Sign up for a free account",
        description: "Go to semrush.com and click \"Sign Up\" in the top-right. Enter your email and password, or sign up with Google.",
        action: "navigate",
        tip: "The free plan gives you 10 requests/day — enough to explore the platform.",
      },
      {
        title: "Set up your first project",
        description: "Click \"Projects\" in the left sidebar → \"Add New Project\". Enter your website domain. Semrush will start crawling your site.",
        action: "type",
      },
      {
        title: "Run a Site Audit",
        description: "In your project, click \"Site Audit\" → \"Start Audit\". Configure crawl settings (default is fine). Wait for the crawl to finish.",
        action: "click",
      },
      {
        title: "Research keywords",
        description: "Go to Keyword Magic Tool in the left sidebar. Enter a seed keyword related to your business. Semrush shows volume, difficulty, and related keywords.",
        action: "type",
      },
      {
        title: "Check your competitors",
        description: "Go to \"Domain Overview\" and enter a competitor's domain. See their traffic, top keywords, and backlinks.",
        action: "type",
        tip: "Use \"Keyword Gap\" to find keywords your competitors rank for that you don't.",
      },
    ],
    videos: [
      { title: "Semrush Tutorial for Beginners", url: "https://www.youtube.com/results?search_query=semrush+tutorial+beginners+2026" },
      { title: "Semrush SEO Workflow", url: "https://www.youtube.com/results?search_query=semrush+seo+workflow+complete+guide" },
    ],
  },

  "buffer-ai": {
    toolId: "buffer-ai",
    signupUrl: "https://buffer.com/signup",
    setupMinutes: 5,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to buffer.com and click \"Get started now\". Sign up with email, Google, or Apple.",
        action: "navigate",
      },
      {
        title: "Connect your social accounts",
        description: "After signup, Buffer asks you to connect channels. Click each platform (Instagram, Twitter/X, LinkedIn, Facebook) and authorize Buffer.",
        action: "click",
        tip: "Connect at least 2 channels to get the most out of the AI scheduling features.",
      },
      {
        title: "Create your first post with AI",
        description: "Click \"Create Post\" → then the AI Assistant icon (sparkle). Describe what you want to post and the AI generates multiple variations.",
        action: "click",
      },
      {
        title: "Set your posting schedule",
        description: "Go to Settings → Posting Schedule for each channel. Set the days and times you want to post. Buffer's AI suggests optimal times based on your audience.",
        action: "select",
      },
    ],
    videos: [
      { title: "Buffer Tutorial - Social Media Scheduling", url: "https://www.youtube.com/results?search_query=buffer+social+media+tutorial+2026" },
    ],
  },

  // ─── CONTENT CREATION ───────────────────────────────────────
  "chatgpt-plus": {
    toolId: "chatgpt-plus",
    signupUrl: "https://chat.openai.com/auth/login",
    gettingStartedUrl: "https://help.openai.com/en/articles/6783457-chatgpt-general-faq",
    setupMinutes: 3,
    steps: [
      {
        title: "Create an OpenAI account",
        description: "Go to chat.openai.com and click \"Sign up\". Use your email, Google, Microsoft, or Apple account.",
        action: "navigate",
      },
      {
        title: "Verify your account",
        description: "Check your email for a verification link. Click it to activate your account.",
        action: "verify",
      },
      {
        title: "Upgrade to ChatGPT Plus (optional)",
        description: "Click your profile icon (bottom-left) → \"Upgrade to Plus\" ($20/mo). This gives you GPT-4, DALL-E, and priority access.",
        action: "click",
        tip: "The free tier uses GPT-4o mini — good enough for basic tasks. Plus unlocks GPT-4o, image gen, and custom GPTs.",
      },
      {
        title: "Start your first conversation",
        description: "Type your prompt in the message box and press Enter. Try: \"Help me write a marketing email for my [product].\"",
        action: "type",
      },
      {
        title: "Explore GPTs",
        description: "Click \"Explore GPTs\" in the sidebar to find specialized assistants for writing, coding, marketing, and more.",
        action: "click",
      },
    ],
    videos: [
      { title: "ChatGPT Complete Beginner Guide", url: "https://www.youtube.com/results?search_query=chatgpt+tutorial+beginners+2026" },
      { title: "ChatGPT for Business - Best Prompts", url: "https://www.youtube.com/results?search_query=chatgpt+for+business+prompts+tutorial" },
    ],
  },

  "claude-pro": {
    toolId: "claude-pro",
    signupUrl: "https://claude.ai/login",
    setupMinutes: 3,
    steps: [
      {
        title: "Create an Anthropic account",
        description: "Go to claude.ai and click \"Sign up\". Use your email or Google account.",
        action: "navigate",
      },
      {
        title: "Verify your account",
        description: "Check your email for the verification link and click it.",
        action: "verify",
      },
      {
        title: "Upgrade to Claude Pro (optional)",
        description: "Click your name (bottom-left) → \"Upgrade to Pro\" ($20/mo). This gives you 5x more usage, Claude Opus access, and priority during peak times.",
        action: "click",
        tip: "Free tier gives you Claude Sonnet — great for most tasks. Pro adds Opus (strongest model) and Projects feature.",
      },
      {
        title: "Start your first conversation",
        description: "Type your prompt and press Enter. Claude excels at long documents, analysis, and coding.",
        action: "type",
      },
      {
        title: "Use Projects",
        description: "Click \"Projects\" in the sidebar to create workspaces with custom instructions and uploaded files. Great for recurring business tasks.",
        action: "click",
      },
    ],
    videos: [
      { title: "Claude AI Complete Tutorial", url: "https://www.youtube.com/results?search_query=claude+ai+tutorial+beginners+2026" },
      { title: "Claude Projects & Artifacts Guide", url: "https://www.youtube.com/results?search_query=claude+ai+projects+artifacts+tutorial" },
    ],
  },

  "gemini-advanced": {
    toolId: "gemini-advanced",
    signupUrl: "https://gemini.google.com/",
    setupMinutes: 3,
    steps: [
      {
        title: "Sign in with Google",
        description: "Go to gemini.google.com and sign in with your Google account. Gemini is free to use.",
        action: "navigate",
      },
      {
        title: "Upgrade to Gemini Advanced (optional)",
        description: "Click your profile → \"Try Gemini Advanced\" ($20/mo as part of Google One AI Premium). Unlocks Gemini Ultra, 1M token context, and Google Workspace integration.",
        action: "click",
        tip: "2-month free trial available. Advanced includes 2TB Google One storage.",
      },
      {
        title: "Start chatting",
        description: "Type in the message box. Gemini can search the web in real-time, analyze images, and generate code.",
        action: "type",
      },
      {
        title: "Use extensions",
        description: "Click the \"@\" icon to enable extensions — Google Flights, Hotels, Maps, YouTube, and Workspace. These let Gemini pull real data.",
        action: "click",
      },
    ],
    videos: [
      { title: "Google Gemini Complete Guide", url: "https://www.youtube.com/results?search_query=google+gemini+advanced+tutorial+2026" },
    ],
  },

  "jasper": {
    toolId: "jasper",
    signupUrl: "https://www.jasper.ai/free-trial",
    setupMinutes: 5,
    steps: [
      {
        title: "Start a free trial",
        description: "Go to jasper.ai and click \"Start Free Trial\". Enter your email and create a password.",
        action: "navigate",
      },
      {
        title: "Set up your brand voice",
        description: "After signup, Jasper prompts you to create a Brand Voice. Paste your website URL or upload brand guidelines. The AI learns your tone and style.",
        action: "type",
        tip: "A well-configured Brand Voice dramatically improves output quality.",
      },
      {
        title: "Choose a template",
        description: "Browse Templates in the sidebar — blog posts, ad copy, product descriptions, email sequences, and 50+ more.",
        action: "click",
      },
      {
        title: "Generate content",
        description: "Fill in the template fields (topic, tone, audience) and click \"Generate\". Jasper produces multiple variations.",
        action: "click",
      },
    ],
    videos: [
      { title: "Jasper AI Tutorial for Marketing", url: "https://www.youtube.com/results?search_query=jasper+ai+tutorial+marketing+2026" },
    ],
  },

  "copy-ai": {
    toolId: "copy-ai",
    signupUrl: "https://www.copy.ai/signup",
    setupMinutes: 3,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to copy.ai and click \"Get Started Free\". Sign up with email or Google.",
        action: "navigate",
      },
      {
        title: "Choose your use case",
        description: "Copy.ai asks what you'll use it for — Marketing, Sales, or General. Pick the one closest to your needs.",
        action: "select",
      },
      {
        title: "Create your first workflow",
        description: "Go to Workflows in the sidebar. Choose a pre-built workflow like \"Blog Post Generator\" or \"Cold Email Sequence\" and fill in the inputs.",
        action: "click",
      },
      {
        title: "Use the Chat interface",
        description: "Click \"Chat\" for a conversational AI assistant. Great for brainstorming, rewriting, and quick copy tasks.",
        action: "type",
      },
    ],
    videos: [
      { title: "Copy.ai Tutorial - AI Copywriting", url: "https://www.youtube.com/results?search_query=copy+ai+tutorial+2026" },
    ],
  },

  "midjourney": {
    toolId: "midjourney",
    signupUrl: "https://www.midjourney.com/",
    setupMinutes: 8,
    steps: [
      {
        title: "Go to Midjourney",
        description: "Visit midjourney.com and click \"Join the Beta\" or \"Sign In\". You'll need a Discord account.",
        action: "navigate",
      },
      {
        title: "Create or sign in to Discord",
        description: "If you don't have Discord, create an account at discord.com. Then return to Midjourney and authorize the Discord connection.",
        action: "type",
        tip: "Midjourney now also has a web interface at midjourney.com/imagine for direct use without Discord.",
      },
      {
        title: "Subscribe to a plan",
        description: "Go to midjourney.com/account and choose a plan. Basic ($10/mo) gives 200 generations/month.",
        action: "click",
      },
      {
        title: "Generate your first image",
        description: "In Discord: go to a #newbies channel and type /imagine followed by your prompt. On the web: use the prompt bar at midjourney.com/imagine.",
        action: "type",
      },
      {
        title: "Upscale and vary",
        description: "After generation, click U1-U4 to upscale an image, or V1-V4 to create variations. Use the \"Vary (Subtle)\" and \"Vary (Strong)\" buttons for refinement.",
        action: "click",
      },
    ],
    videos: [
      { title: "Midjourney Beginner to Advanced Guide", url: "https://www.youtube.com/results?search_query=midjourney+tutorial+beginner+to+advanced+2026" },
      { title: "Midjourney Prompting Tips", url: "https://www.youtube.com/results?search_query=midjourney+prompting+tips+tricks" },
    ],
  },

  "canva-ai": {
    toolId: "canva-ai",
    signupUrl: "https://www.canva.com/signup",
    setupMinutes: 5,
    steps: [
      {
        title: "Create a free account",
        description: "Go to canva.com and click \"Sign up\". Use Google, Facebook, email, or Apple.",
        action: "navigate",
      },
      {
        title: "Choose Free or Pro",
        description: "Canva Free works great to start. Canva Pro ($15/mo) unlocks Magic Studio AI features, brand kits, and premium templates.",
        action: "select",
      },
      {
        title: "Set up your Brand Kit",
        description: "Go to Brand Kit in the sidebar. Upload your logo, set brand colors, and add fonts. This ensures all designs stay on-brand.",
        action: "click",
        tip: "The Brand Kit is available on the free plan with limited features.",
      },
      {
        title: "Use Magic Studio AI",
        description: "Open any design → click \"Magic Studio\" or the AI sparkle icon. Features include: Magic Write (text), Magic Design (layouts), Magic Edit (image editing), and Text to Image.",
        action: "click",
      },
      {
        title: "Start from a template",
        description: "Click \"Create a design\" and search for your format (Instagram post, presentation, flyer, etc). Choose from 250,000+ templates.",
        action: "click",
      },
    ],
    videos: [
      { title: "Canva Tutorial for Beginners", url: "https://www.youtube.com/results?search_query=canva+tutorial+beginners+2026" },
      { title: "Canva AI Magic Studio Guide", url: "https://www.youtube.com/results?search_query=canva+magic+studio+ai+tutorial" },
    ],
  },

  "descript": {
    toolId: "descript",
    signupUrl: "https://www.descript.com/signup",
    setupMinutes: 5,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to descript.com and click \"Get Started\". Create an account with email or Google.",
        action: "navigate",
      },
      {
        title: "Download the desktop app",
        description: "After signup, download and install the Descript app for Mac or Windows. The editor works locally for best performance.",
        action: "click",
      },
      {
        title: "Start a new project",
        description: "Open the app, click \"New Project\". Drag in a video or audio file — Descript automatically transcribes it.",
        action: "click",
        tip: "Transcription is incredibly accurate. You edit the video by editing the text.",
      },
      {
        title: "Edit by editing text",
        description: "Delete words from the transcript → the video/audio is automatically cut. Rearrange paragraphs to rearrange the video.",
        action: "type",
      },
      {
        title: "Use AI features",
        description: "Click the AI menu for: \"Filler word removal\" (auto-deletes ums/ahs), \"Eye Contact\" (AI corrects gaze), \"Studio Sound\" (noise removal), and \"Green Screen\".",
        action: "click",
      },
    ],
    videos: [
      { title: "Descript Complete Tutorial", url: "https://www.youtube.com/results?search_query=descript+video+editing+tutorial+2026" },
    ],
  },

  "elevenlabs": {
    toolId: "elevenlabs",
    signupUrl: "https://elevenlabs.io/sign-up",
    setupMinutes: 3,
    steps: [
      {
        title: "Create a free account",
        description: "Go to elevenlabs.io and click \"Sign Up\". Use email or Google.",
        action: "navigate",
        tip: "Free plan gives you 10,000 characters/month — enough to test voices.",
      },
      {
        title: "Choose a voice",
        description: "Go to the Voice Library. Browse hundreds of pre-made voices or use the search to filter by accent, age, and style.",
        action: "click",
      },
      {
        title: "Generate your first speech",
        description: "Go to \"Speech Synthesis\" in the sidebar. Paste your text, select a voice, and click \"Generate\". Download the MP3.",
        action: "type",
      },
      {
        title: "Clone your own voice (Pro)",
        description: "On a paid plan, go to \"Voice Cloning\" → \"Instant Clone\". Upload 1-5 minutes of clear audio of your voice. The AI creates a custom voice model.",
        action: "click",
        tip: "For best results, record in a quiet room with a good microphone.",
      },
    ],
    videos: [
      { title: "ElevenLabs Complete Guide", url: "https://www.youtube.com/results?search_query=elevenlabs+ai+voice+tutorial+2026" },
    ],
  },

  "synthesia": {
    toolId: "synthesia",
    signupUrl: "https://www.synthesia.io/free-ai-video",
    setupMinutes: 5,
    steps: [
      {
        title: "Try the free demo",
        description: "Go to synthesia.io/free-ai-video to create a free test video. No credit card needed.",
        action: "navigate",
      },
      {
        title: "Choose a plan",
        description: "For ongoing use, pick Starter ($22/mo) or Creator ($67/mo). Click \"Get Started\" and create your account.",
        action: "click",
      },
      {
        title: "Select an AI avatar",
        description: "In the video editor, click \"Avatar\" to browse 150+ stock avatars. Choose one that fits your brand's tone.",
        action: "click",
      },
      {
        title: "Write your script",
        description: "Type or paste your script in the text box. The avatar will speak it naturally. You can adjust pacing and emphasis.",
        action: "type",
        tip: "Keep videos under 5 minutes for best engagement. Use Scene breaks for longer content.",
      },
      {
        title: "Generate and download",
        description: "Click \"Generate Video\". Processing takes 5-10 minutes. Download in MP4 or share via link.",
        action: "wait",
      },
    ],
    videos: [
      { title: "Synthesia AI Video Creation Tutorial", url: "https://www.youtube.com/results?search_query=synthesia+ai+video+tutorial+2026" },
    ],
  },

  "perplexity-ai": {
    toolId: "perplexity-ai",
    signupUrl: "https://www.perplexity.ai/",
    setupMinutes: 2,
    steps: [
      {
        title: "Start using immediately",
        description: "Go to perplexity.ai — you can start asking questions without an account. For saving history, sign up with Google, Apple, or email.",
        action: "navigate",
      },
      {
        title: "Ask your first question",
        description: "Type a question in the search bar. Perplexity gives an AI-generated answer with inline citations from real sources.",
        action: "type",
      },
      {
        title: "Use Focus modes",
        description: "Click the \"Focus\" dropdown before searching: All, Academic, Writing, Wolfram Alpha, YouTube, or Reddit. This narrows the source types.",
        action: "select",
      },
      {
        title: "Upgrade to Pro (optional)",
        description: "Click \"Try Pro\" ($20/mo) for unlimited Pro searches (GPT-4, Claude), file uploads, and API access.",
        action: "click",
        tip: "Free tier gives 5 Pro searches/day — test it before committing.",
      },
    ],
    videos: [
      { title: "Perplexity AI - Better Than Google?", url: "https://www.youtube.com/results?search_query=perplexity+ai+tutorial+how+to+use+2026" },
    ],
  },

  "runway-ml": {
    toolId: "runway-ml",
    signupUrl: "https://app.runwayml.com/signup",
    setupMinutes: 5,
    steps: [
      {
        title: "Create an account",
        description: "Go to runwayml.com and click \"Try Runway\". Sign up with email or Google.",
        action: "navigate",
        tip: "New accounts get 125 free credits — enough for several AI video generations.",
      },
      {
        title: "Choose a tool",
        description: "From the dashboard, explore: Gen-3 Alpha (text/image to video), Remove Background, Inpainting, Motion Brush, and more.",
        action: "click",
      },
      {
        title: "Generate a video from text",
        description: "Click \"Gen-3 Alpha\" → type a scene description → click \"Generate\". A 4-second video takes ~60 seconds to generate.",
        action: "type",
      },
      {
        title: "Refine with Motion Brush",
        description: "Upload an image → use Motion Brush to paint where you want motion (e.g., flowing water, waving hair). Set direction and intensity.",
        action: "click",
      },
    ],
    videos: [
      { title: "Runway ML Complete Tutorial", url: "https://www.youtube.com/results?search_query=runway+ml+gen+3+tutorial+2026" },
    ],
  },

  "opus-clip": {
    toolId: "opus-clip",
    signupUrl: "https://www.opus.pro/",
    setupMinutes: 3,
    steps: [
      {
        title: "Sign up",
        description: "Go to opus.pro and click \"Get Started Free\". Sign up with Google or email.",
        action: "navigate",
      },
      {
        title: "Paste a video URL",
        description: "On the dashboard, paste a YouTube, Zoom, or podcast URL. Opus Clip analyzes the content.",
        action: "type",
      },
      {
        title: "Choose clip settings",
        description: "Select clip length (30s, 60s, 90s), aspect ratio (9:16 for TikTok/Reels, 16:9 for YouTube), and number of clips.",
        action: "select",
      },
      {
        title: "Review and edit clips",
        description: "Opus generates multiple clips ranked by virality score. Review each, trim if needed, and add captions.",
        action: "click",
        tip: "The AI virality score is surprisingly accurate — higher-scored clips perform better on social.",
      },
    ],
    videos: [
      { title: "Opus Clip Tutorial - Viral Clips from Long Videos", url: "https://www.youtube.com/results?search_query=opus+clip+tutorial+2026" },
    ],
  },

  "writesonic": {
    toolId: "writesonic",
    signupUrl: "https://writesonic.com/signup",
    setupMinutes: 3,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to writesonic.com and click \"Start for Free\". Sign up with email or Google.",
        action: "navigate",
      },
      {
        title: "Choose a use case",
        description: "Select from AI Article Writer, Chatsonic, Brand Voice, Photosonic, or 100+ other templates.",
        action: "click",
      },
      {
        title: "Set up Brand Voice",
        description: "Go to Brand Voice in settings. Enter your website or paste example content. Writesonic learns your writing style.",
        action: "type",
      },
      {
        title: "Generate content",
        description: "Choose a template, fill in the fields (topic, keywords, tone), and click \"Generate\". Edit the output as needed.",
        action: "click",
      },
    ],
    videos: [
      { title: "Writesonic AI Writer Tutorial", url: "https://www.youtube.com/results?search_query=writesonic+tutorial+2026" },
    ],
  },

  // ─── CUSTOMER SUPPORT ───────────────────────────────────────
  "intercom-ai": {
    toolId: "intercom-ai",
    signupUrl: "https://app.intercom.com/admins/sign_up",
    setupMinutes: 15,
    steps: [
      {
        title: "Start a free trial",
        description: "Go to intercom.com and click \"Start Free Trial\". Enter your email, company name, and website.",
        action: "navigate",
      },
      {
        title: "Install the Messenger",
        description: "Intercom gives you a JavaScript snippet. Copy it and paste it before the </body> tag on your website, or use the Shopify/WordPress plugin.",
        action: "click",
        tip: "If you use a CMS, check the integrations page — most have one-click installs.",
      },
      {
        title: "Set up Fin AI Agent",
        description: "Go to Fin AI → Turn on Fin. Upload your help docs, FAQ, or knowledge base. Fin reads them to answer customer questions automatically.",
        action: "toggle",
      },
      {
        title: "Configure auto-responses",
        description: "In Workflows, create rules like: \"If message contains 'pricing' → send pricing page link\". Or let Fin handle it with AI.",
        action: "click",
      },
      {
        title: "Test the chat widget",
        description: "Visit your website. The Intercom chat bubble should appear in the bottom-right. Send yourself a test message.",
        action: "verify",
      },
    ],
    videos: [
      { title: "Intercom Setup & Fin AI Guide", url: "https://www.youtube.com/results?search_query=intercom+fin+ai+setup+tutorial+2026" },
    ],
  },

  "tidio-ai": {
    toolId: "tidio-ai",
    signupUrl: "https://www.tidio.com/panel/register",
    setupMinutes: 10,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to tidio.com and click \"Get Started Free\". Enter your email and website URL.",
        action: "navigate",
        tip: "Free plan includes 50 live chat conversations/month and the Lyro AI chatbot with 50 conversations.",
      },
      {
        title: "Install the widget",
        description: "Tidio gives you a script to add to your website. Copy-paste it, or use the Shopify/WordPress/Wix plugin.",
        action: "click",
      },
      {
        title: "Enable Lyro AI",
        description: "Go to Lyro AI in the sidebar → \"Activate Lyro\". Upload your FAQ or knowledge base. Lyro trains on it and starts answering questions.",
        action: "toggle",
      },
      {
        title: "Set up chatbot flows",
        description: "Go to Chatbots → use the visual flow builder to create automated sequences (greeting, lead capture, support routing).",
        action: "click",
      },
    ],
    videos: [
      { title: "Tidio Chatbot Setup Tutorial", url: "https://www.youtube.com/results?search_query=tidio+chatbot+lyro+ai+tutorial+2026" },
    ],
  },

  "zendesk-ai": {
    toolId: "zendesk-ai",
    signupUrl: "https://www.zendesk.com/register/",
    setupMinutes: 15,
    steps: [
      {
        title: "Start a free trial",
        description: "Go to zendesk.com and click \"Start free trial\". Enter your work email, name, and company info.",
        action: "navigate",
      },
      {
        title: "Set up your help center",
        description: "Go to Guide → enable Help Center. Create your first category and article. This feeds the AI's knowledge base.",
        action: "click",
      },
      {
        title: "Configure AI agents",
        description: "Go to AI & Automation → AI Agents. Enable the bot to auto-respond to common questions using your help center articles.",
        action: "toggle",
      },
      {
        title: "Set up ticket routing",
        description: "Go to Business Rules → Triggers. Create rules to auto-assign tickets based on topic, language, or priority.",
        action: "click",
        tip: "Zendesk's AI can auto-detect intent, sentiment, and language for smarter routing.",
      },
    ],
    videos: [
      { title: "Zendesk Setup Guide for Beginners", url: "https://www.youtube.com/results?search_query=zendesk+setup+tutorial+beginners+2026" },
    ],
  },

  "freshdesk-ai": {
    toolId: "freshdesk-ai",
    signupUrl: "https://freshdesk.com/signup",
    setupMinutes: 10,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to freshdesk.com and click \"Try it free\". Enter your email and company details.",
        action: "navigate",
        tip: "Free plan supports up to 2 agents and includes basic ticketing.",
      },
      {
        title: "Enable Freddy AI",
        description: "Go to Admin → Freddy AI. Toggle on features like auto-triage (categorizes tickets), suggested responses, and article suggestions.",
        action: "toggle",
      },
      {
        title: "Build your knowledge base",
        description: "Go to Solutions → create categories and articles. Freddy AI uses these to auto-suggest answers to customer questions.",
        action: "type",
      },
      {
        title: "Set up email ticketing",
        description: "Go to Admin → Email to connect your support email (support@yourcompany.com). All emails auto-create tickets.",
        action: "type",
      },
    ],
    videos: [
      { title: "Freshdesk Tutorial & Freddy AI Setup", url: "https://www.youtube.com/results?search_query=freshdesk+freddy+ai+tutorial+2026" },
    ],
  },

  // ─── OPERATIONS ─────────────────────────────────────────────
  "zapier": {
    toolId: "zapier",
    signupUrl: "https://zapier.com/sign-up",
    gettingStartedUrl: "https://zapier.com/learn/getting-started/",
    setupMinutes: 5,
    steps: [
      {
        title: "Create a free account",
        description: "Go to zapier.com and click \"Sign up free\". Use email or Google.",
        action: "navigate",
        tip: "Free plan gives 100 tasks/month and 5 single-step Zaps.",
      },
      {
        title: "Create your first Zap",
        description: "Click \"Create Zap\". Choose a Trigger app (e.g., Gmail) and event (e.g., \"New Email\"). Then choose an Action app (e.g., Slack) and event (e.g., \"Send Message\").",
        action: "click",
      },
      {
        title: "Connect your apps",
        description: "For each app, click \"Sign in\" to authorize Zapier. This is a one-time setup per app.",
        action: "click",
      },
      {
        title: "Test and turn on",
        description: "Click \"Test\" to verify the Zap works. If it succeeds, click \"Publish\" to turn it on. It now runs automatically.",
        action: "verify",
      },
      {
        title: "Explore templates",
        description: "Browse zapier.com/apps for pre-built Zap templates. Popular: \"Save Gmail attachments to Google Drive\", \"Post Slack messages from form submissions\".",
        action: "click",
        tip: "Start with simple 2-step Zaps. Add complexity once you're comfortable.",
      },
    ],
    videos: [
      { title: "Zapier Tutorial for Beginners", url: "https://www.youtube.com/results?search_query=zapier+tutorial+beginners+2026" },
      { title: "Top 10 Zapier Automations for Business", url: "https://www.youtube.com/results?search_query=zapier+best+automations+business" },
    ],
  },

  "make": {
    toolId: "make",
    signupUrl: "https://www.make.com/en/register",
    setupMinutes: 8,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to make.com and click \"Get started free\". Create an account with email or Google.",
        action: "navigate",
        tip: "Free plan gives 1,000 operations/month — more generous than Zapier's free tier.",
      },
      {
        title: "Create your first scenario",
        description: "Click \"Create a new scenario\". The visual builder opens — click the \"+\" to add your first module (app).",
        action: "click",
      },
      {
        title: "Build your automation flow",
        description: "Connect modules by dragging lines between them. Each module is one step — trigger → process → action. Make supports branching and loops.",
        action: "click",
      },
      {
        title: "Run and schedule",
        description: "Click \"Run once\" to test. Then set a schedule (every 15 min, hourly, daily) and toggle the scenario \"ON\".",
        action: "click",
      },
    ],
    videos: [
      { title: "Make (Integromat) Beginner Tutorial", url: "https://www.youtube.com/results?search_query=make+integromat+tutorial+beginners+2026" },
    ],
  },

  "notion-ai": {
    toolId: "notion-ai",
    signupUrl: "https://www.notion.so/signup",
    setupMinutes: 5,
    steps: [
      {
        title: "Create a free account",
        description: "Go to notion.so and click \"Get Notion free\". Sign up with email, Google, or Apple.",
        action: "navigate",
      },
      {
        title: "Set up your workspace",
        description: "Create a workspace for your business. Notion provides starter templates for project management, wikis, docs, and more.",
        action: "click",
      },
      {
        title: "Enable Notion AI",
        description: "In any page, press Space or type \"/ai\" to summon Notion AI. It can write, summarize, translate, brainstorm, and extract action items.",
        action: "type",
        tip: "Notion AI is a $10/mo add-on per member. It works inside any Notion page.",
      },
      {
        title: "Use AI to summarize and generate",
        description: "Highlight text → click \"Ask AI\" to summarize, improve writing, fix grammar, or translate. In empty pages, ask AI to draft meeting notes, project briefs, etc.",
        action: "click",
      },
      {
        title: "Build a knowledge base",
        description: "Create a database for your team docs. Notion AI can search across all your pages to answer questions about your company.",
        action: "click",
      },
    ],
    videos: [
      { title: "Notion Tutorial for Beginners", url: "https://www.youtube.com/results?search_query=notion+tutorial+beginners+2026" },
      { title: "Notion AI Features Guide", url: "https://www.youtube.com/results?search_query=notion+ai+tutorial+features" },
    ],
  },

  "airtable-ai": {
    toolId: "airtable-ai",
    signupUrl: "https://airtable.com/signup",
    setupMinutes: 5,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to airtable.com and click \"Sign up for free\". Use email or Google.",
        action: "navigate",
      },
      {
        title: "Create your first base",
        description: "Click \"Start from scratch\" or choose a template (CRM, project tracker, content calendar, etc). A base is like a spreadsheet on steroids.",
        action: "click",
      },
      {
        title: "Add an AI field",
        description: "Click \"+\" to add a new field → select \"AI\" field type. Configure it to summarize, categorize, or extract data from other fields using AI.",
        action: "click",
        tip: "AI fields run automatically when records change — great for auto-categorizing leads or summarizing feedback.",
      },
      {
        title: "Build automations",
        description: "Go to Automations tab → create triggers (new record, updated field) → add actions (send email, create Slack message, run AI prompt).",
        action: "click",
      },
    ],
    videos: [
      { title: "Airtable Tutorial for Beginners", url: "https://www.youtube.com/results?search_query=airtable+tutorial+beginners+2026" },
    ],
  },

  "clickup-ai": {
    toolId: "clickup-ai",
    signupUrl: "https://clickup.com/signup",
    setupMinutes: 8,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to clickup.com and click \"Get Started Free\". Sign up with email, Google, or SSO.",
        action: "navigate",
      },
      {
        title: "Set up your workspace",
        description: "Create Spaces for different departments (Marketing, Engineering, etc). Add Lists within Spaces for specific projects.",
        action: "click",
      },
      {
        title: "Enable ClickUp Brain",
        description: "ClickUp Brain (AI) is available on paid plans. Go to Settings → ClickUp Brain → Enable. It can write task descriptions, summarize docs, and create subtasks.",
        action: "toggle",
        tip: "Brain costs $5/member/month on top of your plan.",
      },
      {
        title: "Use AI in tasks",
        description: "In any task, click the AI icon or type /ai. Ask it to: generate subtasks, write descriptions, summarize comment threads, or translate content.",
        action: "click",
      },
    ],
    videos: [
      { title: "ClickUp Tutorial for Beginners", url: "https://www.youtube.com/results?search_query=clickup+tutorial+beginners+2026" },
    ],
  },

  "n8n": {
    toolId: "n8n",
    signupUrl: "https://n8n.io/cloud/",
    setupMinutes: 10,
    steps: [
      {
        title: "Choose cloud or self-host",
        description: "Go to n8n.io — choose \"n8n Cloud\" (hosted, starts at $20/mo) or \"Self-Host\" (free, you run the server). Click \"Get started\".",
        action: "navigate",
        tip: "Self-hosting is free and open-source. Cloud is easier if you don't want to manage infrastructure.",
      },
      {
        title: "Create your first workflow",
        description: "Click \"New Workflow\". The canvas opens — click \"+\" to add your trigger node (webhook, schedule, app event).",
        action: "click",
      },
      {
        title: "Add nodes",
        description: "Click \"+\" after your trigger to add action nodes. n8n has 400+ integrations. Connect them visually.",
        action: "click",
      },
      {
        title: "Use AI nodes",
        description: "Search for \"AI\" in the node panel. Add OpenAI, Anthropic, or local LLM nodes to build AI workflows.",
        action: "click",
        tip: "n8n's AI Agent node can chain multiple AI calls with tools — perfect for complex automations.",
      },
    ],
    videos: [
      { title: "n8n Automation Tutorial", url: "https://www.youtube.com/results?search_query=n8n+automation+tutorial+beginners+2026" },
    ],
  },

  // ─── SALES ──────────────────────────────────────────────────
  "apollo-ai": {
    toolId: "apollo-ai",
    signupUrl: "https://app.apollo.io/#/sign-up",
    setupMinutes: 8,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to apollo.io and click \"Sign up free\". Use email or Google. Free plan includes 60 email credits/month.",
        action: "navigate",
      },
      {
        title: "Search for leads",
        description: "Go to Search → People. Filter by job title, company size, industry, location, and technologies used. Apollo has 275M+ contacts.",
        action: "click",
      },
      {
        title: "Create a sequence",
        description: "Go to Engage → Sequences → \"Create Sequence\". Build a multi-step outreach sequence (email, LinkedIn, call) with AI-generated messages.",
        action: "click",
      },
      {
        title: "Use AI email writer",
        description: "When composing an email in a sequence, click the AI icon. Provide context about your product and the prospect — Apollo writes a personalized email.",
        action: "click",
        tip: "Always personalize the first line manually. AI-written intros are too generic.",
      },
    ],
    videos: [
      { title: "Apollo.io Cold Outreach Tutorial", url: "https://www.youtube.com/results?search_query=apollo+io+tutorial+cold+outreach+2026" },
    ],
  },

  "instantly-ai": {
    toolId: "instantly-ai",
    signupUrl: "https://instantly.ai/signup",
    setupMinutes: 10,
    steps: [
      {
        title: "Sign up",
        description: "Go to instantly.ai and click \"Start free trial\". Enter your email and create a password.",
        action: "navigate",
      },
      {
        title: "Connect email accounts",
        description: "Go to Accounts → \"Add New\". Connect your sending email (Google Workspace, Outlook, or SMTP). Add multiple accounts for rotation.",
        action: "click",
        tip: "Use separate sending domains to protect your main domain's reputation.",
      },
      {
        title: "Warm up your emails",
        description: "Instantly auto-warms your email accounts. Toggle on \"Email Warmup\" for each connected account. Wait 2+ weeks before sending campaigns.",
        action: "toggle",
      },
      {
        title: "Create a campaign",
        description: "Go to Campaigns → \"New Campaign\". Upload your lead list (CSV), write your sequence (AI helps), and set daily send limits.",
        action: "click",
      },
    ],
    videos: [
      { title: "Instantly.ai Cold Email Guide", url: "https://www.youtube.com/results?search_query=instantly+ai+cold+email+tutorial+2026" },
    ],
  },

  "gong-ai": {
    toolId: "gong-ai",
    signupUrl: "https://www.gong.io/demo/",
    setupMinutes: 15,
    steps: [
      {
        title: "Request a demo",
        description: "Go to gong.io and click \"Get a Demo\". Gong is enterprise software — you'll speak with a sales rep first.",
        action: "navigate",
        tip: "Gong doesn't have a self-serve signup. Pricing starts at ~$100/user/month.",
      },
      {
        title: "Connect your meeting tools",
        description: "After onboarding, connect Zoom, Google Meet, and/or Microsoft Teams. Gong auto-joins and records your sales calls.",
        action: "click",
      },
      {
        title: "Review call insights",
        description: "After a call, Gong's AI provides: talk ratio, questions asked, topics discussed, competitor mentions, and next steps.",
        action: "verify",
      },
      {
        title: "Set up deal tracking",
        description: "In Deals, connect your CRM (Salesforce, HubSpot). Gong analyzes call patterns to predict which deals will close.",
        action: "click",
      },
    ],
    videos: [
      { title: "Gong Revenue Intelligence Overview", url: "https://www.youtube.com/results?search_query=gong+io+revenue+intelligence+tutorial" },
    ],
  },

  "shopify-magic": {
    toolId: "shopify-magic",
    signupUrl: "https://accounts.shopify.com/signup",
    setupMinutes: 10,
    steps: [
      {
        title: "Start a free trial",
        description: "Go to shopify.com and click \"Start free trial\". Enter your email and store name.",
        action: "navigate",
        tip: "3-day free trial, then $1/month for the first 3 months.",
      },
      {
        title: "Set up your store",
        description: "Follow Shopify's setup checklist: add your first product, choose a theme, set up payments (Shopify Payments or Stripe).",
        action: "click",
      },
      {
        title: "Use Shopify Magic (AI)",
        description: "When editing products, click the \"Shopify Magic\" sparkle icon. It generates: product descriptions, email subject lines, and responses to reviews.",
        action: "click",
      },
      {
        title: "Use Sidekick AI assistant",
        description: "Click the Sidekick chat icon in your admin. Ask it to: create discounts, analyze sales, set up shipping rules, or explain Shopify features.",
        action: "type",
        tip: "Sidekick can actually perform actions in your store — not just answer questions.",
      },
    ],
    videos: [
      { title: "Shopify Tutorial for Beginners", url: "https://www.youtube.com/results?search_query=shopify+tutorial+beginners+2026" },
      { title: "Shopify Magic AI Features", url: "https://www.youtube.com/results?search_query=shopify+magic+sidekick+ai+tutorial" },
    ],
  },

  "lemlist": {
    toolId: "lemlist",
    signupUrl: "https://app.lemlist.com/signup",
    setupMinutes: 8,
    steps: [
      {
        title: "Start free trial",
        description: "Go to lemlist.com and click \"Start your free trial\". Enter your email and create your account.",
        action: "navigate",
      },
      {
        title: "Connect your email",
        description: "Go to Settings → Email Providers. Connect your Gmail, Outlook, or SMTP sending account.",
        action: "click",
      },
      {
        title: "Create a campaign",
        description: "Click \"New Campaign\". Add your lead list, then build a multi-step sequence: emails, LinkedIn steps, and calls.",
        action: "click",
      },
      {
        title: "Use AI to personalize",
        description: "In the email editor, click the AI icon to generate personalized icebreakers based on each prospect's LinkedIn profile or company info.",
        action: "click",
        tip: "Lemlist's image personalization lets you embed the prospect's name/logo into images — unique to lemlist.",
      },
    ],
    videos: [
      { title: "Lemlist Cold Outreach Tutorial", url: "https://www.youtube.com/results?search_query=lemlist+cold+email+tutorial+2026" },
    ],
  },

  // ─── ADMIN & PRODUCTIVITY ───────────────────────────────────
  "otter-ai": {
    toolId: "otter-ai",
    signupUrl: "https://otter.ai/signup",
    setupMinutes: 3,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to otter.ai and click \"Sign up free\". Use email, Google, or Microsoft.",
        action: "navigate",
        tip: "Free plan gives 300 minutes of transcription/month.",
      },
      {
        title: "Connect your calendar",
        description: "Otter asks to connect Google Calendar or Outlook. This lets OtterPilot auto-join your meetings.",
        action: "click",
      },
      {
        title: "Enable OtterPilot",
        description: "Toggle on OtterPilot in Settings. It automatically joins your Zoom, Google Meet, and Teams calls to transcribe and summarize.",
        action: "toggle",
      },
      {
        title: "Review your transcripts",
        description: "After a meeting, go to your Otter dashboard. See the full transcript, AI summary, action items, and key topics.",
        action: "verify",
      },
    ],
    videos: [
      { title: "Otter.ai Meeting Transcription Guide", url: "https://www.youtube.com/results?search_query=otter+ai+meeting+notes+tutorial+2026" },
    ],
  },

  "grammarly-ai": {
    toolId: "grammarly-ai",
    signupUrl: "https://www.grammarly.com/signup",
    setupMinutes: 3,
    steps: [
      {
        title: "Create a free account",
        description: "Go to grammarly.com and click \"Get Grammarly — It's Free\". Sign up with email, Google, Facebook, or Apple.",
        action: "navigate",
      },
      {
        title: "Install the browser extension",
        description: "Grammarly prompts you to install the Chrome, Firefox, Safari, or Edge extension. Click \"Add to [Browser]\".",
        action: "click",
        tip: "The extension works everywhere — Gmail, LinkedIn, Slack, Google Docs, and any text field.",
      },
      {
        title: "Install the desktop app (optional)",
        description: "Download the Grammarly desktop app for Mac or Windows. It works in native apps like Outlook, Word, and VS Code.",
        action: "click",
      },
      {
        title: "Use GrammarlyGO (AI assistant)",
        description: "Highlight text → click the Grammarly icon → \"GrammarlyGO\". Ask it to rewrite, shorten, expand, change tone, or generate text from a prompt.",
        action: "click",
        tip: "GrammarlyGO's tone detection is great for adjusting emails between \"professional\" and \"casual\".",
      },
    ],
    videos: [
      { title: "Grammarly Tutorial & AI Features", url: "https://www.youtube.com/results?search_query=grammarly+go+ai+tutorial+2026" },
    ],
  },

  "reclaim-ai": {
    toolId: "reclaim-ai",
    signupUrl: "https://app.reclaim.ai/signup",
    setupMinutes: 5,
    steps: [
      {
        title: "Sign up with Google",
        description: "Go to reclaim.ai and click \"Get Started Free\". Sign in with your Google account (required for calendar access).",
        action: "navigate",
      },
      {
        title: "Connect your calendar",
        description: "Authorize Reclaim to access your Google Calendar. It reads your existing events to find open slots.",
        action: "click",
      },
      {
        title: "Set your habits",
        description: "Create recurring Habits: lunch, focus time, exercise, planning. Reclaim auto-schedules them around your meetings.",
        action: "click",
        tip: "Habits are flexible — Reclaim moves them when conflicts arise and reschedules automatically.",
      },
      {
        title: "Add tasks",
        description: "Create Tasks with a duration and deadline. Reclaim finds the optimal time slot and blocks it on your calendar.",
        action: "type",
      },
    ],
    videos: [
      { title: "Reclaim AI Calendar Tutorial", url: "https://www.youtube.com/results?search_query=reclaim+ai+calendar+scheduling+tutorial" },
    ],
  },

  "fireflies-ai": {
    toolId: "fireflies-ai",
    signupUrl: "https://app.fireflies.ai/signup",
    setupMinutes: 3,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to fireflies.ai and click \"Get started for free\". Sign up with Google, Outlook, or email.",
        action: "navigate",
        tip: "Free plan includes unlimited transcription with 800 min storage.",
      },
      {
        title: "Connect your calendar",
        description: "Authorize Fireflies to read your calendar. The AI notetaker (Fred) auto-joins your scheduled meetings.",
        action: "click",
      },
      {
        title: "Invite Fred to a meeting",
        description: "Add fred@fireflies.ai as a guest to any meeting, or let it auto-join all meetings from settings.",
        action: "type",
      },
      {
        title: "Review AI notes",
        description: "After the meeting, check your Fireflies dashboard for: transcript, summary, action items, sentiment analysis, and topic tracking.",
        action: "verify",
      },
    ],
    videos: [
      { title: "Fireflies AI Meeting Notes Tutorial", url: "https://www.youtube.com/results?search_query=fireflies+ai+meeting+notes+tutorial+2026" },
    ],
  },

  "loom-ai": {
    toolId: "loom-ai",
    signupUrl: "https://www.loom.com/signup",
    setupMinutes: 3,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to loom.com and click \"Get Loom for Free\". Sign up with Google, Slack, Apple, or email.",
        action: "navigate",
      },
      {
        title: "Install the desktop app or extension",
        description: "Download the Loom desktop app (Mac/Windows) or Chrome extension. This lets you record your screen + camera.",
        action: "click",
      },
      {
        title: "Record your first video",
        description: "Click the Loom icon → choose Screen + Cam, Screen Only, or Cam Only → hit Record. Stop when done.",
        action: "click",
      },
      {
        title: "Use Loom AI features",
        description: "After recording, Loom AI auto-generates: a title, summary, chapters, and action items. It also removes filler words and silences.",
        action: "verify",
        tip: "Loom AI is included in the Business plan ($12.50/user/mo).",
      },
    ],
    videos: [
      { title: "Loom Tutorial for Teams", url: "https://www.youtube.com/results?search_query=loom+screen+recording+tutorial+2026" },
    ],
  },

  "gamma-ai": {
    toolId: "gamma-ai",
    signupUrl: "https://gamma.app/signup",
    setupMinutes: 3,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to gamma.app and click \"Sign up for free\". Use Google or email.",
        action: "navigate",
        tip: "Free plan gives 400 AI credits — enough for several presentations.",
      },
      {
        title: "Create a new presentation",
        description: "Click \"Create new\" → choose Presentation, Document, or Webpage. Enter a topic and Gamma generates a full outline.",
        action: "type",
      },
      {
        title: "Customize the AI output",
        description: "Review the generated outline. Add, remove, or reorder sections. Choose a visual theme. Then click \"Generate\".",
        action: "click",
      },
      {
        title: "Edit and refine",
        description: "Click any card to edit. Use AI to rewrite sections, add images, or change the layout. Drag to reorder cards.",
        action: "click",
      },
    ],
    videos: [
      { title: "Gamma AI Presentation Tutorial", url: "https://www.youtube.com/results?search_query=gamma+ai+presentation+tutorial+2026" },
    ],
  },

  // ─── ANALYTICS ──────────────────────────────────────────────
  "mixpanel": {
    toolId: "mixpanel",
    signupUrl: "https://mixpanel.com/register/",
    setupMinutes: 15,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to mixpanel.com and click \"Get Started\". Sign up with email or Google. Free plan tracks 20M events/month.",
        action: "navigate",
      },
      {
        title: "Install the SDK",
        description: "Go to Settings → Project Settings → find your project token. Install the SDK for your platform (JavaScript, iOS, Android, Python, etc).",
        action: "click",
        tip: "For web: add the Mixpanel snippet to your site's <head> tag.",
      },
      {
        title: "Track your first event",
        description: "Use mixpanel.track('Button Clicked', { button_name: 'signup' }) in your code. Events start appearing in the dashboard within minutes.",
        action: "type",
      },
      {
        title: "Create a funnel",
        description: "Go to Funnels → click \"Create\". Add steps (events) to track user conversion: e.g., Page View → Sign Up → Purchase.",
        action: "click",
      },
    ],
    videos: [
      { title: "Mixpanel Analytics Tutorial", url: "https://www.youtube.com/results?search_query=mixpanel+analytics+tutorial+beginners+2026" },
    ],
  },

  "hotjar-ai": {
    toolId: "hotjar-ai",
    signupUrl: "https://www.hotjar.com/signup/",
    setupMinutes: 5,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to hotjar.com and click \"Try it free\". Enter your email and website URL.",
        action: "navigate",
        tip: "Free plan gives 35 daily sessions for heatmaps and recordings.",
      },
      {
        title: "Install the tracking code",
        description: "Hotjar gives you a small JavaScript snippet. Paste it in your website's <head> tag, or use the WordPress/Shopify plugin.",
        action: "click",
      },
      {
        title: "View heatmaps",
        description: "Go to Heatmaps → click \"New Heatmap\" → enter a page URL. Hotjar shows where visitors click, scroll, and move their mouse.",
        action: "click",
      },
      {
        title: "Watch session recordings",
        description: "Go to Recordings. Watch real visitor sessions — see exactly how they navigate your site, where they get stuck, and where they drop off.",
        action: "verify",
      },
      {
        title: "Use AI insights",
        description: "Hotjar AI summarizes patterns across recordings: common frustration points, popular paths, and drop-off locations.",
        action: "click",
      },
    ],
    videos: [
      { title: "Hotjar Heatmaps & Recordings Tutorial", url: "https://www.youtube.com/results?search_query=hotjar+heatmaps+tutorial+2026" },
    ],
  },

  "google-analytics": {
    toolId: "google-analytics",
    signupUrl: "https://analytics.google.com/analytics/web/provision/",
    setupMinutes: 10,
    steps: [
      {
        title: "Create a GA4 property",
        description: "Go to analytics.google.com → click \"Start measuring\". Enter your account name, property name, and website URL.",
        action: "navigate",
      },
      {
        title: "Install the tracking tag",
        description: "Copy the Google tag (gtag.js snippet) and paste it in your website's <head>. Or use Google Tag Manager for easier management.",
        action: "click",
      },
      {
        title: "Verify data collection",
        description: "Go to Real-time reports → visit your own website → you should see yourself as an active user.",
        action: "verify",
      },
      {
        title: "Set up conversions",
        description: "Go to Events → find the event you want to track as a conversion (e.g., purchase, form_submit) → toggle \"Mark as conversion\".",
        action: "toggle",
      },
      {
        title: "Use AI Insights",
        description: "GA4's Insights section auto-detects anomalies, trends, and opportunities in your data. Check it weekly.",
        action: "click",
        tip: "Ask questions in natural language in the search bar, like \"What's my top traffic source?\"",
      },
    ],
    videos: [
      { title: "Google Analytics 4 (GA4) Tutorial", url: "https://www.youtube.com/results?search_query=google+analytics+4+tutorial+beginners+2026" },
    ],
  },

  "tableau-ai": {
    toolId: "tableau-ai",
    signupUrl: "https://www.tableau.com/products/trial",
    setupMinutes: 10,
    steps: [
      {
        title: "Start a free trial",
        description: "Go to tableau.com and click \"Try Tableau for Free\". Download Tableau Public (free forever) or start a 14-day trial of Tableau Desktop.",
        action: "navigate",
      },
      {
        title: "Connect to your data",
        description: "Open Tableau → click \"Connect\" → choose your data source: Excel, CSV, Google Sheets, SQL database, or cloud platforms.",
        action: "click",
      },
      {
        title: "Create your first visualization",
        description: "Drag dimensions (categories) to Columns and measures (numbers) to Rows. Tableau auto-recommends chart types.",
        action: "click",
      },
      {
        title: "Use Ask Data (AI)",
        description: "Click \"Ask Data\" and type a question in plain English: \"What were sales by region last quarter?\" Tableau generates the visualization.",
        action: "type",
        tip: "Tableau Pulse (AI-powered summaries) automatically surfaces key metrics and changes.",
      },
    ],
    videos: [
      { title: "Tableau Tutorial for Beginners", url: "https://www.youtube.com/results?search_query=tableau+tutorial+beginners+2026" },
    ],
  },

  // ─── DEVELOPMENT & CODING ──────────────────────────────────
  "cursor": {
    toolId: "cursor",
    signupUrl: "https://cursor.com/",
    setupMinutes: 5,
    steps: [
      {
        title: "Download Cursor",
        description: "Go to cursor.com and click \"Download\". Install for Mac, Windows, or Linux. It's a VS Code fork — your extensions carry over.",
        action: "navigate",
      },
      {
        title: "Sign in",
        description: "Open Cursor, click \"Sign In\". Create an account or sign in with GitHub/Google. Free plan gives 50 premium requests/month.",
        action: "click",
      },
      {
        title: "Open your project",
        description: "File → Open Folder → select your project. Cursor indexes your codebase for AI context.",
        action: "click",
      },
      {
        title: "Use Cmd+K for inline edits",
        description: "Select code → press Cmd+K (Mac) / Ctrl+K (Windows) → describe the change. Cursor edits the code inline.",
        action: "type",
      },
      {
        title: "Chat with your codebase",
        description: "Press Cmd+L to open the AI chat. Ask questions about your code — Cursor reads your files for context.",
        action: "type",
        tip: "Use @filename in chat to reference specific files. Use @codebase to search across everything.",
      },
    ],
    videos: [
      { title: "Cursor AI Code Editor Tutorial", url: "https://www.youtube.com/results?search_query=cursor+ai+code+editor+tutorial+2026" },
    ],
  },

  "github-copilot": {
    toolId: "github-copilot",
    signupUrl: "https://github.com/features/copilot",
    setupMinutes: 5,
    steps: [
      {
        title: "Sign up for GitHub Copilot",
        description: "Go to github.com/features/copilot → click \"Start my free trial\". Requires a GitHub account. Free for students and open-source maintainers.",
        action: "navigate",
        tip: "Individual plan is $10/mo or $100/year.",
      },
      {
        title: "Install in your editor",
        description: "In VS Code: go to Extensions → search \"GitHub Copilot\" → Install. Also available for JetBrains, Neovim, and Visual Studio.",
        action: "click",
      },
      {
        title: "Sign in to Copilot",
        description: "After installing, VS Code prompts you to sign in to GitHub. Authorize the extension.",
        action: "click",
      },
      {
        title: "Start coding with suggestions",
        description: "Just start typing — Copilot suggests completions in gray text. Press Tab to accept. It understands context from your entire file.",
        action: "type",
      },
      {
        title: "Use Copilot Chat",
        description: "Press Cmd+I (Mac) / Ctrl+I (Windows) for inline chat. Or open the Chat panel to ask questions about your code.",
        action: "type",
      },
    ],
    videos: [
      { title: "GitHub Copilot Full Tutorial", url: "https://www.youtube.com/results?search_query=github+copilot+tutorial+2026" },
    ],
  },

  "bolt": {
    toolId: "bolt",
    signupUrl: "https://bolt.new/",
    setupMinutes: 2,
    steps: [
      {
        title: "Go to Bolt",
        description: "Visit bolt.new — you can start building immediately. No account needed (but signing in saves projects).",
        action: "navigate",
      },
      {
        title: "Describe your app",
        description: "Type what you want to build in the prompt box: e.g., \"A task management app with drag-and-drop Kanban board\". Click \"Go\".",
        action: "type",
      },
      {
        title: "Review and iterate",
        description: "Bolt generates a full working app in the browser. Preview it in the right panel. Ask for changes in the chat.",
        action: "verify",
      },
      {
        title: "Deploy",
        description: "Click \"Deploy\" to push your app live. Bolt hosts it for you, or you can download the code.",
        action: "click",
        tip: "Bolt uses WebContainers — the full Node.js environment runs in your browser.",
      },
    ],
    videos: [
      { title: "Bolt.new AI App Builder Tutorial", url: "https://www.youtube.com/results?search_query=bolt+new+ai+app+builder+tutorial+2026" },
    ],
  },

  "lovable": {
    toolId: "lovable",
    signupUrl: "https://lovable.dev/",
    setupMinutes: 2,
    steps: [
      {
        title: "Go to Lovable",
        description: "Visit lovable.dev and click \"Start Building\". Sign up with GitHub or Google.",
        action: "navigate",
      },
      {
        title: "Describe your project",
        description: "Type what you want to build. Lovable generates a full-stack app with React, TypeScript, and Supabase backend.",
        action: "type",
      },
      {
        title: "Iterate with chat",
        description: "Ask for changes: \"Add a dark mode toggle\", \"Connect to Supabase auth\", \"Make the sidebar collapsible\". Lovable modifies the code live.",
        action: "type",
      },
      {
        title: "Export or deploy",
        description: "Push to GitHub with one click, or deploy directly to a custom domain.",
        action: "click",
      },
    ],
    videos: [
      { title: "Lovable AI Full-Stack App Tutorial", url: "https://www.youtube.com/results?search_query=lovable+dev+ai+app+builder+tutorial+2026" },
    ],
  },

  "v0-dev": {
    toolId: "v0-dev",
    signupUrl: "https://v0.dev/",
    setupMinutes: 2,
    steps: [
      {
        title: "Go to v0.dev",
        description: "Visit v0.dev and sign in with your Vercel account (or create one).",
        action: "navigate",
      },
      {
        title: "Describe a UI component",
        description: "Type what you need: \"A pricing page with 3 tiers and toggle for monthly/annual\". v0 generates React + Tailwind code.",
        action: "type",
      },
      {
        title: "Iterate on the design",
        description: "Click on variations or type refinements: \"Make it darker\", \"Add a free tier\", \"Use more rounded corners\".",
        action: "type",
      },
      {
        title: "Copy or deploy the code",
        description: "Click \"Code\" to copy the React component. Or click \"Add to Codebase\" to push directly to your project via the Vercel CLI.",
        action: "click",
        tip: "v0 generates shadcn/ui components — they integrate perfectly with Next.js projects.",
      },
    ],
    videos: [
      { title: "v0.dev AI UI Generation Tutorial", url: "https://www.youtube.com/results?search_query=v0+dev+vercel+ai+ui+tutorial+2026" },
    ],
  },

  "replit-agent": {
    toolId: "replit-agent",
    signupUrl: "https://replit.com/signup",
    setupMinutes: 3,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to replit.com and click \"Sign Up\". Use Google, GitHub, or email.",
        action: "navigate",
      },
      {
        title: "Create a new Repl",
        description: "Click \"Create Repl\" → choose a template (Python, Node.js, React, etc) or start from scratch.",
        action: "click",
      },
      {
        title: "Use Replit Agent",
        description: "Click the AI button in the sidebar → \"Agent\". Describe what you want to build. The agent creates files, installs packages, and writes code autonomously.",
        action: "type",
        tip: "Agent can build full apps from scratch — describe the end result, not individual steps.",
      },
      {
        title: "Deploy with one click",
        description: "Click \"Deploy\" → choose a deployment type (Static, Autoscale, or Reserved VM). Your app goes live immediately.",
        action: "click",
      },
    ],
    videos: [
      { title: "Replit Agent AI Tutorial", url: "https://www.youtube.com/results?search_query=replit+agent+ai+tutorial+2026" },
    ],
  },

  "windsurf": {
    toolId: "windsurf",
    signupUrl: "https://codeium.com/windsurf",
    setupMinutes: 5,
    steps: [
      {
        title: "Download Windsurf",
        description: "Go to codeium.com/windsurf and click \"Download\". Install for Mac, Windows, or Linux.",
        action: "navigate",
      },
      {
        title: "Create an account",
        description: "Open Windsurf and sign up with Google, GitHub, or email. Free plan includes AI autocomplete and limited Cascade requests.",
        action: "type",
      },
      {
        title: "Open your project",
        description: "File → Open Folder → select your codebase. Windsurf indexes it for AI context.",
        action: "click",
      },
      {
        title: "Use Cascade (AI agent)",
        description: "Press Cmd+L to open Cascade. Describe a task — Cascade reads your files, makes edits across multiple files, and runs terminal commands.",
        action: "type",
        tip: "Cascade can handle multi-file refactors and complex tasks that require understanding project context.",
      },
    ],
    videos: [
      { title: "Windsurf AI Editor Tutorial", url: "https://www.youtube.com/results?search_query=windsurf+codeium+ai+editor+tutorial+2026" },
    ],
  },

  "claude-code": {
    toolId: "claude-code",
    signupUrl: "https://docs.anthropic.com/en/docs/claude-code",
    setupMinutes: 5,
    steps: [
      {
        title: "Install Claude Code",
        description: "Open your terminal and run: npm install -g @anthropic-ai/claude-code. Requires Node.js 18+.",
        action: "navigate",
      },
      {
        title: "Set your API key",
        description: "Run: export ANTHROPIC_API_KEY=your-key-here. Get your key from console.anthropic.com.",
        action: "type",
        tip: "Or sign in interactively — Claude Code will prompt you to authenticate via browser.",
      },
      {
        title: "Start Claude Code",
        description: "Navigate to your project folder and type: claude. Claude Code starts and indexes your codebase.",
        action: "type",
      },
      {
        title: "Give it tasks",
        description: "Describe what you want: \"Add dark mode to the settings page\", \"Fix the failing test in auth.test.ts\", \"Refactor this to use TypeScript generics\".",
        action: "type",
      },
    ],
    videos: [
      { title: "Claude Code CLI Tutorial", url: "https://www.youtube.com/results?search_query=claude+code+cli+tutorial+anthropic+2026" },
    ],
  },

  "framer": {
    toolId: "framer",
    signupUrl: "https://www.framer.com/signup/",
    setupMinutes: 5,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to framer.com and click \"Start for Free\". Sign up with Google or email.",
        action: "navigate",
      },
      {
        title: "Choose a template or start blank",
        description: "Browse templates or click \"Blank\" to start from scratch. Framer's editor is visual — no code required.",
        action: "click",
      },
      {
        title: "Use AI to generate pages",
        description: "Click \"Generate Page\" and describe what you want. Framer AI creates a full page layout with real content and images.",
        action: "type",
      },
      {
        title: "Customize and publish",
        description: "Edit text, images, and layout visually. Add animations with the Interactions panel. Click \"Publish\" to go live.",
        action: "click",
        tip: "Free plan includes a .framer.website domain. Custom domains require a paid plan ($5+/mo).",
      },
    ],
    videos: [
      { title: "Framer Website Builder Tutorial", url: "https://www.youtube.com/results?search_query=framer+website+tutorial+beginners+2026" },
    ],
  },

  "webflow": {
    toolId: "webflow",
    signupUrl: "https://webflow.com/signup",
    setupMinutes: 10,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to webflow.com and click \"Get started — it's free\". Sign up with Google or email.",
        action: "navigate",
      },
      {
        title: "Choose a template or start blank",
        description: "Browse 2,000+ templates or start blank. Webflow's Designer gives you pixel-perfect control without code.",
        action: "click",
      },
      {
        title: "Use the visual designer",
        description: "Drag elements from the Add panel (left). Style them in the Style panel (right). Every CSS property is available visually.",
        action: "click",
        tip: "Webflow generates clean, production-quality HTML/CSS. It's not a website builder — it's a visual development tool.",
      },
      {
        title: "Add CMS collections",
        description: "Go to CMS → create a Collection (e.g., \"Blog Posts\"). Add fields (title, body, image). Design a template page. Webflow auto-generates pages for each item.",
        action: "click",
      },
      {
        title: "Publish",
        description: "Click \"Publish\" → choose webflow.io subdomain (free) or connect a custom domain (paid).",
        action: "click",
      },
    ],
    videos: [
      { title: "Webflow Tutorial for Beginners", url: "https://www.youtube.com/results?search_query=webflow+tutorial+beginners+2026" },
    ],
  },

  "vercel": {
    toolId: "vercel",
    signupUrl: "https://vercel.com/signup",
    setupMinutes: 5,
    steps: [
      {
        title: "Sign up with GitHub",
        description: "Go to vercel.com and click \"Sign Up\". Use GitHub, GitLab, or Bitbucket.",
        action: "navigate",
      },
      {
        title: "Import a project",
        description: "Click \"New Project\" → select a repo from GitHub. Vercel auto-detects Next.js, React, Vue, Svelte, and configures the build.",
        action: "click",
      },
      {
        title: "Deploy",
        description: "Click \"Deploy\". Vercel builds and deploys your app in ~30 seconds. You get a URL immediately.",
        action: "click",
        tip: "Every push to your repo auto-deploys. Pull requests get preview deployments.",
      },
      {
        title: "Add environment variables",
        description: "Go to Project Settings → Environment Variables. Add your API keys and secrets (e.g., ANTHROPIC_API_KEY).",
        action: "type",
      },
    ],
    videos: [
      { title: "Vercel Deployment Tutorial", url: "https://www.youtube.com/results?search_query=vercel+deployment+tutorial+nextjs+2026" },
    ],
  },

  "durable-ai": {
    toolId: "durable-ai",
    signupUrl: "https://durable.co/",
    setupMinutes: 2,
    steps: [
      {
        title: "Start building",
        description: "Go to durable.co and click \"Build my website\". Enter your business type and name.",
        action: "navigate",
      },
      {
        title: "AI generates your site",
        description: "Durable creates a full website in 30 seconds — with content, images, and layout based on your business type.",
        action: "wait",
      },
      {
        title: "Customize",
        description: "Edit text, swap images, change colors, and adjust the layout. All visual — no code.",
        action: "click",
      },
      {
        title: "Publish",
        description: "Choose a plan ($12/mo+) to publish with a custom domain. Includes hosting, SSL, and CRM.",
        action: "click",
      },
    ],
    videos: [
      { title: "Durable AI Website Builder", url: "https://www.youtube.com/results?search_query=durable+ai+website+builder+tutorial" },
    ],
  },

  "wix-ai": {
    toolId: "wix-ai",
    signupUrl: "https://www.wix.com/signup",
    setupMinutes: 10,
    steps: [
      {
        title: "Sign up for free",
        description: "Go to wix.com and click \"Get Started\". Sign up with email, Google, or Facebook.",
        action: "navigate",
      },
      {
        title: "Use Wix ADI (AI)",
        description: "Choose \"Let Wix ADI create a site for me\". Answer questions about your business type, features needed, and style preferences.",
        action: "select",
      },
      {
        title: "Review the AI-generated site",
        description: "Wix generates a complete site. Review each page — Home, About, Services, Contact. Edit anything by clicking on it.",
        action: "verify",
      },
      {
        title: "Use AI text creator",
        description: "Click any text element → \"AI Text Creator\". Describe what you need and the AI writes it in your brand tone.",
        action: "click",
      },
      {
        title: "Publish",
        description: "Click \"Publish\" for a free wixsite.com subdomain. Upgrade ($17+/mo) for a custom domain and e-commerce.",
        action: "click",
      },
    ],
    videos: [
      { title: "Wix AI Website Tutorial", url: "https://www.youtube.com/results?search_query=wix+ai+website+builder+tutorial+2026" },
    ],
  },

  "devin": {
    toolId: "devin",
    signupUrl: "https://devin.ai/",
    setupMinutes: 5,
    steps: [
      {
        title: "Request access",
        description: "Go to devin.ai and click \"Get Started\" or join the waitlist. Devin is available on an enterprise basis.",
        action: "navigate",
      },
      {
        title: "Connect your repos",
        description: "After access, connect your GitHub/GitLab repositories. Devin reads your codebase.",
        action: "click",
      },
      {
        title: "Assign a task",
        description: "Describe a coding task: \"Fix the bug in issue #123\", \"Add pagination to the users API\", \"Write tests for the auth module\".",
        action: "type",
      },
      {
        title: "Review the PR",
        description: "Devin creates a pull request with the changes. Review the code, request changes if needed, and merge.",
        action: "verify",
        tip: "Devin works asynchronously — assign tasks and check back later.",
      },
    ],
    videos: [
      { title: "Devin AI Software Engineer Demo", url: "https://www.youtube.com/results?search_query=devin+ai+software+engineer+demo+review" },
    ],
  },

  "hostinger-ai": {
    toolId: "hostinger-ai",
    signupUrl: "https://www.hostinger.com/website-builder",
    setupMinutes: 10,
    steps: [
      {
        title: "Sign up and choose a plan",
        description: "Go to hostinger.com → Website Builder. Choose a plan ($2.99+/mo). Enter your email and create a password.",
        action: "navigate",
      },
      {
        title: "Use AI Website Builder",
        description: "Click \"Start creating\" → describe your business. Hostinger AI generates a complete website with content and images.",
        action: "type",
      },
      {
        title: "Customize your site",
        description: "Use the drag-and-drop editor to modify the layout, colors, fonts, and content. The AI writer helps with copy.",
        action: "click",
      },
      {
        title: "Connect a domain & publish",
        description: "Register a new domain (free for the first year) or connect an existing one. Click \"Publish\".",
        action: "click",
      },
    ],
    videos: [
      { title: "Hostinger AI Website Builder Tutorial", url: "https://www.youtube.com/results?search_query=hostinger+ai+website+builder+tutorial+2026" },
    ],
  },
};

/**
 * Get tutorial for a specific tool. Returns undefined if no tutorial exists.
 */
export function getToolTutorial(toolId: string): ToolTutorial | undefined {
  return TOOL_TUTORIALS[toolId];
}

/**
 * Check if a tool has a tutorial available.
 */
export function hasTutorial(toolId: string): boolean {
  return toolId in TOOL_TUTORIALS;
}
