"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getEmployee,
  inviteToTool,
  addGoal,
  updateGoal,
  addActivity,
} from "@/lib/team-storage";
import {
  EmployeeProfile,
  EmployeeGoal,
  EMPLOYEE_ROLE_LABELS,
  CATEGORY_LABELS,
} from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  ArrowLeft,
  Mail,
  Briefcase,
  Send,
  Check,
  ExternalLink,
  Target,
  Plus,
  Clock,
  CheckCircle2,
  Play,
  Zap,
  Activity,
  Eye,
  Copy,
  Link,
} from "lucide-react";

export default function EmployeeProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [tab, setTab] = useState<"tools" | "goals" | "activity">("tools");
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    getEmployee(id).then(setEmployee);
  }, [id]);

  async function refresh() {
    setEmployee(await getEmployee(id));
  }

  async function handleInvite(toolId: string) {
    await inviteToTool(id, toolId);
    await refresh();
  }

  async function handleAddGoal() {
    if (!newGoalTitle.trim()) return;
    const goal: EmployeeGoal = {
      id: crypto.randomUUID(),
      title: newGoalTitle.trim(),
      description: "",
      deadline: newGoalDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "not-started",
      createdAt: new Date().toISOString(),
    };
    await addGoal(id, goal);
    setNewGoalTitle("");
    setNewGoalDeadline("");
    setShowGoalForm(false);
    await refresh();
  }

  async function handleGoalStatus(goalId: string, status: EmployeeGoal["status"]) {
    await updateGoal(id, goalId, { status });
    await refresh();
  }

  async function handleLogActivity(toolName: string) {
    await addActivity(id, {
      id: crypto.randomUUID(),
      toolName,
      action: `Used ${toolName}`,
      timestamp: new Date().toISOString(),
    });
    await refresh();
  }

  function copyEmployeeLink() {
    const link = `${window.location.origin}/employee/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="border-border/30 bg-card/50 max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-foreground font-display font-semibold">Employee not found</p>
            <button onClick={() => router.push("/dashboard/team")} className="text-primary text-sm font-body hover:underline">
              Back to Team
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const invitedCount = employee.recommendedTools.filter((t) => t.invited).length;
  const goalsCompleted = employee.goals.filter((g) => g.status === "completed").length;

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border/20 z-50 flex items-center">
        <div className="max-w-5xl mx-auto px-6 w-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <Layers className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-foreground text-base tracking-tight">
              AI<span className="text-primary">Stack</span>
            </span>
          </a>
          <button onClick={() => router.push("/dashboard/team")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-body transition-colors">
            <ArrowLeft className="h-4 w-4" /> Team
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-12 space-y-6">
        {/* Employee Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-primary font-display font-bold text-2xl">
                {employee.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">{employee.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground font-body flex-wrap">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {EMPLOYEE_ROLE_LABELS[employee.role]} &middot; {employee.department}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {employee.email}
                </span>
              </div>
            </div>
          </div>

          {/* Share employee dashboard link */}
          <button
            onClick={copyEmployeeLink}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border/30 text-sm font-body text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            {copiedLink ? (
              <><Check className="h-4 w-4 text-emerald-400" /> Copied!</>
            ) : (
              <><Link className="h-4 w-4" /> Share Dashboard</>
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-border/30 bg-card/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-primary">{employee.recommendedTools.length}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">AI Tools</p>
            </CardContent>
          </Card>
          <Card className="border-border/30 bg-card/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-emerald-400">{invitedCount}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">Invited</p>
            </CardContent>
          </Card>
          <Card className="border-border/30 bg-card/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-amber-400">{employee.goals.length}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">Goals</p>
            </CardContent>
          </Card>
          <Card className="border-border/30 bg-card/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-cyan-400">{goalsCompleted}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-secondary/30 rounded-full w-fit">
          {[
            { key: "tools" as const, icon: Zap, label: "AI Tools" },
            { key: "goals" as const, icon: Target, label: "Goals" },
            { key: "activity" as const, icon: Activity, label: "Activity" },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all ${
                tab === key
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 inline mr-1.5 -mt-0.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "tools" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-body">
              AI tools recommended based on {employee.name}&apos;s role and profile. Click &quot;Invite&quot; to give them access.
            </p>
            {employee.recommendedTools.map((tool) => (
              <Card key={tool.toolId} className="border-border/30 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-semibold text-foreground">{tool.toolName}</span>
                        <Badge variant="outline" className="text-[10px] rounded-full bg-primary/10 text-primary border-primary/20">
                          {CATEGORY_LABELS[tool.category]}
                        </Badge>
                        {tool.monthlyCost === 0 ? (
                          <Badge variant="secondary" className="text-[10px] rounded-full">Free</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground font-body">${tool.monthlyCost}/mo</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">{tool.whyAssigned}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {tool.invited ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400 font-body font-medium">
                          <Check className="h-3.5 w-3.5" /> Invited
                        </span>
                      ) : (
                        <button
                          onClick={() => handleInvite(tool.toolId)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-body font-semibold hover:bg-primary/90 transition-colors"
                        >
                          <Send className="h-3 w-3" /> Invite
                        </button>
                      )}
                      <a href={tool.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {tab === "goals" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-body">
                Set goals that appear on {employee.name}&apos;s personal dashboard.
              </p>
              <button
                onClick={() => setShowGoalForm(!showGoalForm)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background text-sm font-body font-semibold"
              >
                <Plus className="h-4 w-4" /> Add Goal
              </button>
            </div>

            {showGoalForm && (
              <Card className="border-primary/30 bg-card/50">
                <CardContent className="p-5 space-y-3">
                  <input
                    type="text"
                    placeholder="Goal title... (e.g. Close 20 deals this quarter)"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="w-full bg-background/50 border border-border/30 rounded-xl p-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="date"
                      value={newGoalDeadline}
                      onChange={(e) => setNewGoalDeadline(e.target.value)}
                      className="bg-background/50 border border-border/30 rounded-xl p-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button onClick={handleAddGoal} disabled={!newGoalTitle.trim()} className="px-4 py-2 rounded-full bg-foreground text-background text-sm font-body font-semibold disabled:opacity-50">
                      <Check className="h-4 w-4 inline mr-1" /> Add
                    </button>
                    <button onClick={() => setShowGoalForm(false)} className="text-muted-foreground text-sm font-body hover:text-foreground">Cancel</button>
                  </div>
                </CardContent>
              </Card>
            )}

            {employee.goals.length === 0 ? (
              <Card className="border-border/30 bg-card/50">
                <CardContent className="p-8 text-center">
                  <Target className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-body text-sm">No goals set yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {employee.goals.map((goal) => (
                  <Card key={goal.id} className="border-border/30 bg-card/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() =>
                            handleGoalStatus(
                              goal.id,
                              goal.status === "completed"
                                ? "not-started"
                                : goal.status === "not-started"
                                ? "in-progress"
                                : "completed"
                            )
                          }
                          className="mt-0.5 shrink-0"
                        >
                          {goal.status === "completed" ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : goal.status === "in-progress" ? (
                            <Play className="h-5 w-5 text-amber-400" />
                          ) : (
                            <Clock className="h-5 w-5 text-muted-foreground/40" />
                          )}
                        </button>
                        <div className="flex-1">
                          <p className={`text-sm font-body font-medium ${goal.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                            {goal.title}
                          </p>
                          <p className="text-xs text-muted-foreground font-body mt-0.5">
                            Due: {goal.deadline} &middot;{" "}
                            <span className={
                              goal.status === "completed" ? "text-emerald-400" :
                              goal.status === "in-progress" ? "text-amber-400" : "text-muted-foreground"
                            }>
                              {goal.status.replace("-", " ")}
                            </span>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "activity" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-body">
                Track what {employee.name} is doing with their AI tools. Activity logs update in real time.
              </p>
              {/* Manual log for demo */}
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleLogActivity(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="bg-background/50 border border-border/30 rounded-xl px-3 py-2 text-xs font-body"
                >
                  <option value="">+ Log activity...</option>
                  {employee.recommendedTools.filter((t) => t.invited).map((t) => (
                    <option key={t.toolId} value={t.toolName}>{t.toolName}</option>
                  ))}
                </select>
              </div>
            </div>

            {employee.activityLog.length === 0 ? (
              <Card className="border-border/30 bg-card/50">
                <CardContent className="p-8 text-center">
                  <Activity className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-body text-sm">No activity logged yet.</p>
                  <p className="text-xs text-muted-foreground/60 font-body mt-1">
                    Activity will appear here as the employee uses their AI tools.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {employee.activityLog.map((entry) => (
                  <Card key={entry.id} className="border-border/30 bg-card/50">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                          <Zap className="h-4 w-4 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-body text-foreground">{entry.action}</p>
                          <p className="text-xs text-muted-foreground font-body">
                            {new Date(entry.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
