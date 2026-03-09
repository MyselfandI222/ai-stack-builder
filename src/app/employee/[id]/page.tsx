"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getEmployee, addActivity } from "@/lib/team-storage";
import { EmployeeProfile, EMPLOYEE_ROLE_LABELS, CATEGORY_LABELS } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Zap,
  Target,
  ExternalLink,
  CheckCircle2,
  Clock,
  Play,
  MessageCircle,
  Send,
  X,
  Sparkles,
  Briefcase,
  ChevronRight,
} from "lucide-react";

// --- AI Assistant knowledge base ---

function getAssistantResponse(question: string, employee: EmployeeProfile): string {
  const q = question.toLowerCase();
  const tools = employee.recommendedTools;

  // Tool-specific questions
  for (const tool of tools) {
    const toolLower = tool.toolName.toLowerCase();
    if (q.includes(toolLower) || q.includes(tool.toolId.replace(/-/g, " "))) {
      return `**${tool.toolName}** is assigned to you for ${CATEGORY_LABELS[tool.category].toLowerCase()} tasks.\n\n**Why it's recommended:** ${tool.whyAssigned}\n\n**Getting started:**\n1. Go to [${tool.toolName}](${tool.website})\n2. ${tool.invited ? "You should have an invite in your email" : "Ask your manager to send you an invite"}\n3. Start with the basics — explore the dashboard and try the core features\n4. Check their help center or YouTube channel for tutorials\n\n**Cost:** ${tool.monthlyCost === 0 ? "Free!" : `$${tool.monthlyCost}/mo (covered by your company)`}`;
    }
  }

  // General navigation questions
  if (q.includes("how") && (q.includes("start") || q.includes("begin") || q.includes("use"))) {
    const toolList = tools.map((t) => `- **${t.toolName}**: ${t.whyAssigned}`).join("\n");
    return `Here are your assigned AI tools and what each is for:\n\n${toolList}\n\nI'd recommend starting with the tool that matches your most time-consuming daily task. Click the link icon next to any tool to visit their website and start exploring.`;
  }

  if (q.includes("goal") || q.includes("target") || q.includes("kpi")) {
    if (employee.goals.length === 0) {
      return "You don't have any goals set yet. Your manager can add goals that will appear here. Feel free to ask them to set some up!";
    }
    const goalList = employee.goals.map((g) => `- **${g.title}** (${g.status.replace("-", " ")}) — due ${g.deadline}`).join("\n");
    return `Here are your current goals:\n\n${goalList}\n\nFocus on the ones marked "not started" first. Your manager can see your progress, so update the status as you make headway.`;
  }

  if (q.includes("help") || q.includes("support") || q.includes("stuck")) {
    return "No worries! Here's how to get help:\n\n1. **Ask me** — I can explain any tool in your stack\n2. **Tool help centers** — Click the link icon on any tool to visit their support page\n3. **YouTube** — Search \"[Tool Name] tutorial\" for video walkthroughs\n4. **Your manager** — They can see your dashboard and help with specific questions\n\nWhat specific tool or task do you need help with?";
  }

  if (q.includes("automat") || q.includes("workflow") || q.includes("save time")) {
    const automationTools = tools.filter((t) => t.category === "operations");
    if (automationTools.length > 0) {
      return `Great question! You have ${automationTools.map((t) => `**${t.toolName}**`).join(" and ")} in your stack for automation.\n\nHere are quick wins to try:\n1. Automate your most repetitive daily task first\n2. Connect your email to your CRM for auto-logging\n3. Set up notifications so you never miss important updates\n4. Create templates for responses you send often`;
    }
    return "Talk to your manager about adding automation tools to your stack. Tools like Zapier or Make.com can save hours per week by automating repetitive tasks.";
  }

  if (q.includes("what") && (q.includes("tool") || q.includes("ai"))) {
    const summary = tools.map((t) => `- **${t.toolName}** (${CATEGORY_LABELS[t.category]})`).join("\n");
    return `You have ${tools.length} AI tools assigned:\n\n${summary}\n\nWant to know more about any specific tool? Just ask!`;
  }

  // Default response
  return `I'm your AI assistant, here to help you navigate your tool stack and be more productive.\n\nI can help with:\n- **Explaining any tool** in your stack\n- **Getting started** with a new AI tool\n- **Automation tips** to save time\n- **Goal tracking** and priorities\n\nTry asking something like:\n- "How do I use ${tools[0]?.toolName || "my tools"}?"\n- "What are my goals?"\n- "How can I automate my daily tasks?"`;
}

// --- Chat Widget ---

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function AIChatWidget({ employee }: { employee: EmployeeProfile }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hi ${employee.name.split(" ")[0]}! I'm your AI assistant. I can help you navigate your ${employee.recommendedTools.length} assigned tools, explain how each one works, and help you be more productive. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    // Simulate typing delay
    setTimeout(() => {
      const response = getAssistantResponse(userMsg, employee);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 500);
  }

  return (
    <>
      {/* Chat toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center btn-lift z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-card border border-border/30 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-display font-semibold text-foreground">AI Assistant</p>
                <p className="text-[10px] text-muted-foreground font-body">Always here to help</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm font-body leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary/50 text-foreground rounded-bl-md"
                  }`}
                >
                  {/* Simple markdown rendering for bold */}
                  {msg.content.split("\n").map((line, li) => (
                    <p key={li} className={li > 0 ? "mt-1.5" : ""}>
                      {line.split(/(\*\*[^*]+\*\*)/).map((part, pi) =>
                        part.startsWith("**") && part.endsWith("**") ? (
                          <strong key={pi} className="font-semibold">{part.slice(2, -2)}</strong>
                        ) : (
                          <span key={pi}>{part}</span>
                        )
                      )}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border/20">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about any tool..."
                className="flex-1 bg-background/50 border border-border/30 rounded-full px-4 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
                autoFocus
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 transition-opacity"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- Main Employee Dashboard ---

export default function EmployeeDashboardPage() {
  const params = useParams();
  const id = params.id as string;
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEmployee(getEmployee(id));
    setLoading(false);
  }, [id]);

  function handleToolClick(toolName: string) {
    addActivity(id, {
      id: crypto.randomUUID(),
      toolName,
      action: `Opened ${toolName}`,
      timestamp: new Date().toISOString(),
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="border-border/30 bg-card/50 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-foreground font-display font-semibold">Dashboard not found</p>
            <p className="text-sm text-muted-foreground font-body">
              This employee profile doesn&apos;t exist. Ask your manager for the correct link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const invitedTools = employee.recommendedTools.filter((t) => t.invited);
  const pendingTools = employee.recommendedTools.filter((t) => !t.invited);
  const activeGoals = employee.goals.filter((g) => g.status !== "completed");
  const completedGoals = employee.goals.filter((g) => g.status === "completed");

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border/20 z-50 flex items-center">
        <div className="max-w-4xl mx-auto px-6 w-full flex items-center">
          <a href="/" className="flex items-center gap-2 group">
            <Layers className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-foreground text-base tracking-tight">
              AI<span className="text-primary">Stack</span>
            </span>
          </a>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-12 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Welcome back, {employee.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground font-body mt-1 flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {EMPLOYEE_ROLE_LABELS[employee.role]} &middot; {employee.department}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-border/30 bg-card/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-primary">{invitedTools.length}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">Active Tools</p>
            </CardContent>
          </Card>
          <Card className="border-border/30 bg-card/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-amber-400">{activeGoals.length}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">Active Goals</p>
            </CardContent>
          </Card>
          <Card className="border-border/30 bg-card/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-emerald-400">{completedGoals.length}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Your AI Tools */}
        <div className="space-y-3">
          <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Your AI Tools
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            These tools have been set up for you by your manager. Click to open, or ask the AI assistant for help.
          </p>

          {invitedTools.length > 0 && (
            <div className="space-y-2">
              {invitedTools.map((tool) => (
                <a
                  key={tool.toolId}
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleToolClick(tool.toolName)}
                  className="block"
                >
                  <Card className="border-border/30 bg-card/50 backdrop-blur-sm card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-semibold text-foreground">{tool.toolName}</span>
                            <Badge variant="outline" className="text-[10px] rounded-full bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                              Active
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-body mt-0.5">{tool.whyAssigned}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          )}

          {pendingTools.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wide font-medium">
                Pending Setup ({pendingTools.length})
              </p>
              {pendingTools.map((tool) => (
                <Card key={tool.toolId} className="border-border/30 bg-card/30 opacity-60">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <span className="font-display font-semibold text-foreground text-sm">{tool.toolName}</span>
                        <p className="text-xs text-muted-foreground font-body">Waiting for manager invite</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Goals */}
        {employee.goals.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-400" />
              Your Goals
            </h2>

            <div className="space-y-2">
              {activeGoals.map((goal) => (
                <Card key={goal.id} className="border-border/30 bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {goal.status === "in-progress" ? (
                        <Play className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground/40 mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-body font-medium text-foreground">{goal.title}</p>
                        <p className="text-xs text-muted-foreground font-body mt-0.5">
                          Due: {goal.deadline} &middot;{" "}
                          <span className={goal.status === "in-progress" ? "text-amber-400" : ""}>
                            {goal.status.replace("-", " ")}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {completedGoals.length > 0 && (
                <>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wide font-medium pt-2">
                    Completed ({completedGoals.length})
                  </p>
                  {completedGoals.map((goal) => (
                    <Card key={goal.id} className="border-border/30 bg-emerald-500/5">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                          <p className="text-sm font-body text-muted-foreground line-through">{goal.title}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* Tip */}
        <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm">
          <CardContent className="p-4 flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-body text-foreground font-medium">
                Need help with any tool?
              </p>
              <p className="text-xs text-muted-foreground font-body mt-0.5">
                Click the chat bubble in the bottom right corner. The AI assistant knows about all your tools and can guide you through anything.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* AI Chat Widget */}
      <AIChatWidget employee={employee} />
    </div>
  );
}
