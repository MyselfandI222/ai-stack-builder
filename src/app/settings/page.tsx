"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  listAllProjects,
  deleteProject,
  getActiveProjectId,
  setActiveProjectId,
  loadDashboardData,
  clearDashboardData,
} from "@/lib/dashboard-storage";
import { businessPlanToMarkdown, toolStackToMarkdown } from "@/lib/export-utils";
import { ProjectSummary, BusinessPlanEdits } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Plus,
  LogOut,
  Trash2,
  LayoutDashboard,
  Sparkles,
  Briefcase,
  Wrench,
  Calendar,
  ChevronRight,
  Settings,
  Download,
  AlertTriangle,
  Check,
  Pencil,
  X,
  FileText,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const activeId = typeof window !== "undefined" ? getActiveProjectId() : null;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/auth");
      return;
    }
    listAllProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  async function handleSwitchProject(id: string) {
    setActiveProjectId(id);
    router.push("/dashboard");
  }

  async function handleDeleteProject(id: string) {
    setDeletingId(id);
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  function handleNewProject() {
    router.push("/?new=1");
  }

  function startRenaming(project: ProjectSummary) {
    setEditingId(project.id);
    setEditName(project.businessType);
  }

  async function handleRename(id: string) {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }
    // Update the result.analysis.businessType in Supabase
    const data = await loadDashboardData(id);
    if (data) {
      const updated = {
        ...data.result,
        analysis: { ...data.result.analysis, businessType: editName.trim() },
      };
      await supabase
        .from("businesses")
        .update({ result: updated })
        .eq("id", id);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, businessType: editName.trim() } : p
        )
      );
    }
    setEditingId(null);
  }

  async function handleExportAll() {
    setExporting(true);
    try {
      const sections: string[] = [];
      sections.push("# AI Tool Planner — All Projects Export\n");
      sections.push(`Exported: ${new Date().toLocaleDateString()}\n`);
      sections.push(`Total projects: ${projects.length}\n\n---\n`);

      for (const project of projects) {
        const data = await loadDashboardData(project.id);
        if (!data) continue;
        const { result } = data;
        const breakdown = result.analysis.businessBreakdown;
        const edits = (data.planEdits || {}) as BusinessPlanEdits;

        sections.push(`\n# ${result.analysis.businessType}\n`);
        sections.push(`Created: ${new Date(project.createdAt).toLocaleDateString()}\n`);
        sections.push(`Tools: ${project.toolCount} | Cost: $${project.monthlyCost}/mo\n\n`);

        sections.push(
          businessPlanToMarkdown(
            result.analysis.businessType,
            breakdown,
            result.selectedTools,
            result.totalMonthlyCost,
            result.budgetUsedPercent,
            edits
          )
        );
        sections.push("\n\n---\n");
      }

      const blob = new Blob([sections.join("")], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AIToolPlanner-Export-${new Date().toISOString().slice(0, 10)}.md`;
      a.click();
      URL.revokeObjectURL(url);

      setExportDone(true);
      setTimeout(() => setExportDone(false), 2000);
    } finally {
      setExporting(false);
    }
  }

  async function handleDeleteAccount() {
    setDeletingAccount(true);
    try {
      await clearDashboardData();
      await signOut();
      router.push("/");
    } catch {
      setDeletingAccount(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen landing-grid flex items-center justify-center">
        <div className="space-y-3 text-center animate-hero-reveal">
          <div className="relative mx-auto w-14 h-14">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: "2s" }} />
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 ring-1 ring-primary/20">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-muted-foreground font-body">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen landing-grid">
      {/* Nav — matches premium style */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-background/70 backdrop-blur-2xl border-b border-border/10 z-50 flex items-center">
        <div className="max-w-3xl mx-auto px-6 w-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-primary/10 ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <Layers className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground text-base tracking-tight">
              AI<span className="text-primary">ToolPlanner</span>
            </span>
          </a>
          <div className="flex items-center gap-1">
            {projects.length > 0 && (
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 font-body transition-all"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-12 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4 animate-fade-in">
          <div className="p-3.5 rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Settings className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Settings
            </h1>
            <p className="text-muted-foreground font-body mt-1">
              Manage your projects and account
            </p>
          </div>
        </div>

        {/* Account Section */}
        <Card className="card-glow glow-primary border-border/15 bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-body text-foreground">
                  {user?.email}
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  Signed in with{" "}
                  {user?.app_metadata?.provider === "google"
                    ? "Google"
                    : "Email"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-border/20 bg-background/30 hover:bg-background/50"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card className="card-glow glow-violet border-border/15 bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-display">
                Your Projects
              </CardTitle>
              <div className="flex items-center gap-2">
                {projects.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border/20 bg-background/30 hover:bg-background/50 h-8"
                    onClick={handleExportAll}
                    disabled={exporting}
                  >
                    {exportDone ? (
                      <><Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />Exported</>
                    ) : (
                      <><Download className="h-3.5 w-3.5 mr-1.5" />{exporting ? "Exporting..." : "Export All"}</>
                    )}
                  </Button>
                )}
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 h-8"
                  onClick={handleNewProject}
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  New Project
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <Briefcase className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
                <p className="text-sm text-muted-foreground font-body">
                  No projects yet. Create your first one!
                </p>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleNewProject}
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Get Started
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => {
                  const isActive = project.id === activeId;
                  const isEditing = editingId === project.id;
                  return (
                    <div
                      key={project.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        isActive
                          ? "border-primary/30 bg-primary/5"
                          : "border-border/10 bg-background/20 hover:border-border/20"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {isEditing ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleRename(project.id);
                              }}
                              className="flex items-center gap-2 flex-1"
                            >
                              <input
                                ref={editInputRef}
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="flex-1 bg-background/40 border border-primary/30 rounded-lg px-2.5 py-1 text-sm font-display font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                onKeyDown={(e) => {
                                  if (e.key === "Escape") setEditingId(null);
                                }}
                              />
                              <button
                                type="submit"
                                className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:bg-foreground/5 transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </form>
                          ) : (
                            <>
                              <p className="font-display font-semibold text-foreground text-sm truncate">
                                {project.businessType}
                              </p>
                              <button
                                onClick={() => startRenaming(project)}
                                className="p-1 rounded-md text-muted-foreground/40 hover:text-muted-foreground hover:bg-foreground/5 transition-all"
                                title="Rename"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                              {isActive && (
                                <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-body font-medium">
                                  Active
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        {!isEditing && (
                          <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                            <span className="flex items-center gap-1">
                              <Wrench className="h-3 w-3" />
                              {project.toolCount} tools
                            </span>
                            <span>${project.monthlyCost}/mo</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      {!isEditing && (
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-border/20 bg-background/30 hover:bg-background/50 h-8"
                            onClick={() => handleSwitchProject(project.id)}
                          >
                            {isActive ? "View" : "Switch"}
                            <ChevronRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={deletingId === project.id}
                            className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                            title="Delete project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data & Privacy Section */}
        <Card className="card-glow glow-red border-border/15 bg-card/50 backdrop-blur-sm animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display">Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Export */}
            {projects.length > 0 && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/20 border border-border/10">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-body text-foreground">Export all data</p>
                    <p className="text-xs text-muted-foreground font-body">Download all projects as a Markdown file</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/20 bg-background/30 hover:bg-background/50 h-8"
                  onClick={handleExportAll}
                  disabled={exporting}
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  {exporting ? "..." : "Download"}
                </Button>
              </div>
            )}

            {/* Delete Account */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <div>
                  <p className="text-sm font-body text-foreground">Delete account data</p>
                  <p className="text-xs text-muted-foreground font-body">Permanently delete all projects and sign out</p>
                </div>
              </div>
              {!showDeleteAccount ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 h-8"
                  onClick={() => setShowDeleteAccount(true)}
                >
                  Delete
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-400 font-body">Are you sure?</span>
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-400 text-white h-7 text-xs"
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                  >
                    {deletingAccount ? "Deleting..." : "Yes, delete"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border/20 h-7 text-xs"
                    onClick={() => setShowDeleteAccount(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
