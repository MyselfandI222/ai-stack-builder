# AIStack Builder

An AI-powered business planning platform that generates complete operations playbooks, recommends budget-optimized AI tool stacks, and provides a team management system for assigning and tracking AI tools across your organization.

Built with Next.js 15, TypeScript, Tailwind CSS, and Claude by Anthropic.

---

## What It Does

A business owner answers a guided questionnaire about their company. The platform then:

1. **Generates a full business breakdown** — executive summary, revenue strategy, growth strategy, department-by-department operations playbook, 90-day action plan, KPIs, team recommendations, and risk analysis.
2. **Recommends an AI tool stack** — selects the best combination of AI tools from a curated database of 35+ tools across 7 categories, optimized to fit within the user's monthly budget.
3. **Provides an AI-powered dashboard** — 10 feature panels (Business Health Score, Cash Flow Forecaster, Marketing Autopilot, Sales Pipeline Coach, etc.) each tied to the user's specific business context and recommended tools.
4. **Manages team AI adoption** — owners create employee profiles, get per-employee tool recommendations based on role, invite employees to tools, set goals, and track daily activity.
5. **Gives employees their own dashboard** — each employee sees their assigned tools, goals set by their manager, and has access to a built-in AI assistant that can explain any tool in their stack.

---

## Screenshots

### Business Questionnaire
The questionnaire adapts based on a depth selector — Quick (8 questions), Standard (16), or Detailed (23). Budget is integrated as question 3. All answers are combined into a rich business profile that drives the AI analysis.

### Results Dashboard
Two-tab layout. **Business Plan** tab shows the full operations playbook with expandable department cards, a timeline-grouped 90-day plan, key metrics, team recommendations, and risk analysis. **AI Tool Stack** tab shows budget utilization and tool recommendations by category.

### AI Dashboard
10 feature panels, each showing the user's business context (pulled from questionnaire answers), the specific AI tools powering that feature, and actionable next steps. Includes an Employee Manager card for team access.

### Team Manager
Add employees via a role-based questionnaire (5/9/15 questions). View all team members, manage enterprise AI subscriptions with seat tracking, invite employees to tools with one click, set goals, and monitor daily activity.

### Employee Dashboard
Clean personal view showing active tools (with direct links), pending tool setups, active and completed goals, and a floating AI assistant chat widget.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router, React 19) |
| Language | TypeScript 5.7 (strict mode) |
| Styling | [Tailwind CSS 3.4](https://tailwindcss.com) with custom animations |
| UI Components | [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives) |
| Icons | [Lucide React](https://lucide.dev) |
| AI | [Anthropic Claude](https://anthropic.com) (Claude Sonnet 4) |
| Fonts | Manrope (display) + Outfit (body) via Google Fonts |
| Persistence | Browser localStorage (no database required) |

---

## Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts          # POST endpoint — runs AI analysis + budget optimizer
│   ├── dashboard/
│   │   ├── page.tsx                   # AI dashboard with 10 feature panels
│   │   └── team/
│   │       ├── page.tsx               # Team manager — employees + subscriptions
│   │       ├── add/page.tsx           # Add employee questionnaire
│   │       └── [id]/page.tsx          # Employee profile (owner view)
│   ├── employee/[id]/page.tsx         # Employee dashboard (employee view + AI assistant)
│   ├── page.tsx                       # Home — hero + business questionnaire
│   ├── layout.tsx                     # Root layout with fonts + dark mode
│   └── globals.css                    # Custom theme, animations, effects
├── components/
│   ├── ui/                            # shadcn/ui primitives (card, badge, button, etc.)
│   ├── business-input.tsx             # Multi-step questionnaire with depth selector
│   ├── results-dashboard.tsx          # Business plan + tool stack results
│   ├── budget-progress.tsx            # Budget utilization display
│   ├── category-section.tsx           # Tool category grouping
│   └── tool-card.tsx                  # Individual tool recommendation card
├── lib/
│   ├── ai-analyzer.ts                 # Anthropic Claude integration + system prompt
│   ├── ai-tools-db.ts                 # Database of 35+ AI tools with pricing and metadata
│   ├── budget-optimizer.ts            # Greedy optimization algorithm for tool selection
│   ├── dashboard-features.ts          # 10 dashboard feature definitions
│   ├── dashboard-storage.ts           # localStorage persistence for dashboard data
│   ├── demo-analysis.ts              # Keyword-based fallback when no API key
│   ├── employee-recommender.ts        # Role-to-tool matching engine
│   ├── team-storage.ts               # CRUD operations for team data
│   └── utils.ts                       # Tailwind class merge utility
└── types/
    └── index.ts                       # All TypeScript interfaces and type definitions
```

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An Anthropic API key (optional — the app works in demo mode without one)

### Installation

```bash
git clone https://github.com/MyselfandI222/ai-stack-builder.git
cd ai-stack-builder
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```bash
# Required for AI-powered analysis (optional — demo mode works without it)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

If you don't provide an API key, the app runs in **demo mode** — it generates realistic business analyses using keyword detection instead of calling the API. This is fully functional for testing and development.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## How It Works

### 1. Business Questionnaire

The home page presents a depth selector (Quick / Standard / Detailed) followed by a step-by-step questionnaire. Questions cover business description, model, budget, target audience, team size, operations areas, goals, challenges, stage, revenue model, marketing channels, sales process, and more.

All answers are combined into a structured text paragraph and sent to the `/api/analyze` endpoint.

### 2. AI Analysis

The API route sends the business description to Claude with a detailed system prompt that instructs it to produce:
- Category-level relevance scoring across 7 areas (marketing, content creation, customer support, operations, sales, admin, analytics)
- A complete business breakdown with department playbooks, 90-day plans, KPIs, and risk analysis

The response is validated, normalized, and passed to the budget optimizer.

### 3. Budget Optimization

The optimizer scores every tool in the database against the business analysis using a composite formula:

```
compositeScore = (relevanceScore + tagBonus + freeTierBonus) * tierWeight / effectiveCost
```

It then runs a three-pass greedy selection:
1. Essential tools for the highest-relevance categories
2. Recommended tools to fill remaining budget
3. Nice-to-have tools if budget allows

Tools in the same competitor group (e.g., ChatGPT vs Claude vs Gemini) are mutually exclusive — only the highest-scoring one is selected. Tied scores are fair-shuffled to avoid vendor bias.

### 4. Dashboard

After analysis, results are saved to localStorage and the user can access a personalized dashboard at `/dashboard`. Each of the 10 feature panels:
- Shows business context derived from the user's specific questionnaire answers
- Lists the exact AI tools from their recommended stack that power that feature
- Provides 3 actionable next steps that reference the tools by name

### 5. Team Management

The owner navigates to `/dashboard/team` to:
- **Add employees** via a questionnaire (Quick: 5 questions, Standard: 9, Detailed: 15) covering name, email, role, responsibilities, daily tasks, skills, and more
- **Get per-employee tool recommendations** — the engine maps 11 role types to tool categories and scores tools based on the employee's answers
- **Invite employees** to tools with one click (marks as "Active" on the employee's dashboard)
- **Manage enterprise subscriptions** — add team-wide subscriptions with seat tracking and usage bars
- **Set goals** with deadlines that appear on the employee's personal dashboard
- **Track activity** — timestamped log of every AI tool interaction

### 6. Employee Dashboard

Each employee has a unique URL at `/employee/[id]` showing:
- Their active tools (clickable links that log activity automatically)
- Pending tools waiting for manager invite
- Active and completed goals from their manager
- A floating **AI assistant** chat widget that:
  - Knows every tool in their stack
  - Explains what each tool does and how to get started
  - Answers questions about setup, automation, and workflows
  - Provides contextual help based on their role and assigned tools

---

## AI Tools Database

The platform includes a curated database of 35+ AI tools across 7 categories:

| Category | Tools |
|---|---|
| Marketing | HubSpot AI, Mailchimp AI, Surfer SEO, Semrush, Buffer |
| Content Creation | ChatGPT Plus, Claude Pro, Gemini Advanced, Jasper, Copy.ai, Midjourney, Canva Pro, Descript, ElevenLabs, Synthesia |
| Customer Support | Intercom (Fin AI), Tidio AI, Zendesk AI, Freshdesk (Freddy AI) |
| Operations | Zapier, Make.com, Notion AI, Airtable AI, ClickUp AI |
| Sales | Apollo.io, Instantly.ai, Gong, Shopify Magic, Lemlist |
| Admin & Productivity | Otter.ai, Grammarly Business, Reclaim.ai, Fireflies.ai |
| Analytics & Data | Mixpanel, Hotjar, Google Analytics 4, Tableau |

Each tool has: pricing, free tier info, use case tags, tier classification (essential/recommended/nice-to-have), and optional competitor group assignments.

---

## Design

- **Dark-first theme** with a blue-purple gradient color system
- HSL color variables for consistent theming across all components
- Custom CSS animations: hero reveal with staggered delays, floating gradient orbs, shimmer loading skeletons, button lift effects, card hover elevations
- Responsive layout optimized for mobile through desktop
- Manrope (headings) + Outfit (body) font pairing
- All interactions have smooth transitions (200-400ms cubic-bezier easing)

---

## Key Routes

| Route | Description |
|---|---|
| `/` | Home page with hero and business questionnaire |
| `/api/analyze` | POST endpoint for AI analysis |
| `/dashboard` | Owner's AI dashboard with 10 feature panels |
| `/dashboard/team` | Team manager — employee list + enterprise subscriptions |
| `/dashboard/team/add` | Add employee questionnaire |
| `/dashboard/team/[id]` | Individual employee profile (owner view) |
| `/employee/[id]` | Employee personal dashboard with AI assistant |

---

## Configuration

### Tailwind

The project uses a custom Tailwind config with:
- Dark mode via `class` strategy
- Custom font families (`display` and `body`) mapped to CSS variables
- Extended color palette using HSL variables for easy theme switching
- Animation utilities from `tailwindcss-animate`

### shadcn/ui

Configured with the New York style variant, Zinc base color, and CSS variables enabled. Components live in `src/components/ui/` and use Radix UI primitives under the hood.

---

## Scripts

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Create production build
npm run start     # Run production server
npm run lint      # Run Next.js linting
```

---

## Deployment

The app is ready to deploy on any platform that supports Next.js:

- **Vercel** — zero-config deployment (recommended)
- **Netlify** — with Next.js adapter
- **Docker** — standard Next.js containerization
- **Self-hosted** — `npm run build && npm start`

Set the `ANTHROPIC_API_KEY` environment variable in your deployment platform's settings. Without it, the app falls back to demo mode automatically.

---

## License

This project is private. All rights reserved.
