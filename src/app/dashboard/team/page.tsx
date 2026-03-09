"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getTeamData, deleteEmployee, getSubscriptions, addSubscription, removeSubscription } from "@/lib/team-storage";
import { EmployeeProfile, EnterpriseSubscription, EMPLOYEE_ROLE_LABELS } from "@/types";
import { AI_TOOLS_DATABASE } from "@/lib/ai-tools-db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  Layers,
  ArrowLeft,
  Trash2,
  Mail,
  Briefcase,
  ChevronRight,
  Package,
  Plus,
  X,
  Check,
} from "lucide-react";

export default function TeamPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [subscriptions, setSubscriptions] = useState<EnterpriseSubscription[]>([]);
  const [showSubForm, setShowSubForm] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState("");
  const [subSeats, setSubSeats] = useState(5);
  const [tab, setTab] = useState<"team" | "subscriptions">("team");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth"); return; }
    getTeamData().then((data) => {
      setEmployees(data.employees);
      setSubscriptions(data.subscriptions);
    });
  }, [user, authLoading, router]);

  async function handleDelete(id: string) {
    await deleteEmployee(id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }

  async function handleAddSubscription() {
    if (!selectedToolId) return;
    const tool = AI_TOOLS_DATABASE.find((t) => t.id === selectedToolId);
    if (!tool) return;

    const sub: EnterpriseSubscription = {
      toolId: tool.id,
      toolName: tool.name,
      website: tool.website,
      seats: subSeats,
      seatsUsed: 0,
      monthlyCost: tool.monthlyCost * subSeats,
    };

    await addSubscription(sub);
    setSubscriptions((prev) => [...prev, sub]);
    setShowSubForm(false);
    setSelectedToolId("");
    setSubSeats(5);
  }

  async function handleRemoveSubscription(toolId: string) {
    await removeSubscription(toolId);
    setSubscriptions((prev) => prev.filter((s) => s.toolId !== toolId));
  }

  // Count invited employees per tool
  function getSeatsUsed(toolId: string): number {
    return employees.filter((e) =>
      e.recommendedTools.some((t) => t.toolId === toolId && t.invited)
    ).length;
  }

  const availableForSub = AI_TOOLS_DATABASE.filter(
    (t) => !subscriptions.some((s) => s.toolId === t.id)
  );

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-b border-border/20 z-50 flex items-center">
        <div className="max-w-5xl mx-auto px-6 w-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <Layers className="h-5 w-5 text-primary transition-opacity group-hover:opacity-80" />
            <span className="font-display font-bold text-foreground text-base tracking-tight">
              AI<span className="text-primary">Stack</span>
            </span>
          </a>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-body transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-12 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <Users className="h-7 w-7 text-primary" />
              Team Manager
            </h1>
            <p className="text-muted-foreground font-body mt-1">
              Add employees, assign AI tools, and track their productivity.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/team/add")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-body font-semibold text-sm btn-lift"
          >
            <UserPlus className="h-4 w-4" />
            Add Employee
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 bg-secondary/30 rounded-full w-fit">
          <button
            onClick={() => setTab("team")}
            className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all ${
              tab === "team"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4 inline mr-1.5 -mt-0.5" />
            Team ({employees.length})
          </button>
          <button
            onClick={() => setTab("subscriptions")}
            className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all ${
              tab === "subscriptions"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="h-4 w-4 inline mr-1.5 -mt-0.5" />
            Subscriptions ({subscriptions.length})
          </button>
        </div>

        {tab === "team" ? (
          <>
            {/* Employee List */}
            {employees.length === 0 ? (
              <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center space-y-4">
                  <Users className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                  <div>
                    <p className="text-foreground font-display font-semibold text-lg">
                      No employees yet
                    </p>
                    <p className="text-sm text-muted-foreground font-body mt-1">
                      Add your first employee to start assigning AI tools and tracking their work.
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/dashboard/team/add")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-body font-semibold text-sm btn-lift"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add First Employee
                  </button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {employees.map((emp) => (
                  <Card
                    key={emp.id}
                    className="border-border/30 bg-card/50 backdrop-blur-sm card-hover cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-primary font-display font-bold text-lg">
                            {emp.name.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        {/* Info */}
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => router.push(`/dashboard/team/${emp.id}`)}
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display font-semibold text-foreground">
                              {emp.name}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] rounded-full bg-primary/10 text-primary border-primary/20"
                            >
                              {EMPLOYEE_ROLE_LABELS[emp.role]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-body">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {emp.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {emp.recommendedTools.length} tools
                            </span>
                            <span className="flex items-center gap-1">
                              {emp.recommendedTools.filter((t) => t.invited).length} invited
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(emp.id);
                          }}
                          className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Remove employee"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/team/${emp.id}`)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Employee Dashboard Link Info */}
            {employees.length > 0 && (
              <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground font-body">
                    Each employee has their own dashboard at{" "}
                    <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs">
                      /employee/[id]
                    </code>
                    . Share the link so they can see their assigned tools, goals, and AI assistant.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          /* Subscriptions Tab */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-body">
                Manage enterprise AI subscriptions. Invite employees to tools with one click.
              </p>
              <button
                onClick={() => setShowSubForm(!showSubForm)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background font-body font-semibold text-sm"
              >
                <Plus className="h-4 w-4" />
                Add Subscription
              </button>
            </div>

            {/* Add Subscription Form */}
            {showSubForm && (
              <Card className="border-primary/30 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-5 space-y-4">
                  <p className="text-sm font-display font-semibold text-foreground">
                    Add Enterprise Subscription
                  </p>
                  <div className="space-y-3">
                    <select
                      value={selectedToolId}
                      onChange={(e) => setSelectedToolId(e.target.value)}
                      className="w-full bg-background/50 border border-border/30 rounded-xl p-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">Select an AI tool...</option>
                      {availableForSub.map((tool) => (
                        <option key={tool.id} value={tool.id}>
                          {tool.name} — ${tool.monthlyCost}/seat/mo
                        </option>
                      ))}
                    </select>

                    <div>
                      <label className="text-xs text-muted-foreground font-body block mb-1">
                        Number of seats
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={subSeats}
                        onChange={(e) => setSubSeats(Number(e.target.value))}
                        className="w-32 bg-background/50 border border-border/30 rounded-xl p-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleAddSubscription}
                        disabled={!selectedToolId}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background font-body font-semibold text-sm disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        Add
                      </button>
                      <button
                        onClick={() => setShowSubForm(false)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border/30 text-muted-foreground hover:text-foreground font-body text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subscription List */}
            {subscriptions.length === 0 && !showSubForm ? (
              <Card className="border-border/30 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center space-y-4">
                  <Package className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                  <div>
                    <p className="text-foreground font-display font-semibold text-lg">
                      No subscriptions yet
                    </p>
                    <p className="text-sm text-muted-foreground font-body mt-1">
                      Add your team&apos;s enterprise AI tool subscriptions to manage seats and invites.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {subscriptions.map((sub) => {
                  const seatsUsed = getSeatsUsed(sub.toolId);
                  return (
                    <Card key={sub.toolId} className="border-border/30 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                            <Package className="h-5 w-5 text-violet-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-display font-semibold text-foreground">
                                {sub.toolName}
                              </span>
                              <Badge variant="secondary" className="text-[10px] rounded-full">
                                {seatsUsed}/{sub.seats} seats used
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground font-body mt-0.5">
                              ${sub.monthlyCost}/mo total &middot;{" "}
                              <a
                                href={sub.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Manage on {sub.toolName}
                              </a>
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveSubscription(sub.toolId)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {/* Seat usage bar */}
                        <div className="mt-3 h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-400 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min((seatsUsed / sub.seats) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
