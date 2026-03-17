import { BusinessPlanEdits, ProjectSummary, SavedDashboardData, StackRecommendation } from "@/types";
import { supabase, getOwnerId } from "./supabase";

// --- Active project tracking (localStorage) ---

export function getActiveProjectId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("active-project-id");
}

export function setActiveProjectId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("active-project-id", id);
}

// --- CRUD ---

export async function saveDashboardData(
  result: StackRecommendation,
  answers: Record<string, unknown>
): Promise<string> {
  const ownerId = await getOwnerId();

  const { data, error } = await supabase
    .from("businesses")
    .insert({ owner_id: ownerId, result, answers })
    .select("id")
    .single();

  if (error || !data) throw new Error("Failed to save project");

  setActiveProjectId(data.id);
  return data.id;
}

export async function loadDashboardData(
  projectId?: string
): Promise<SavedDashboardData | null> {
  const ownerId = await getOwnerId();

  // 1. Specific project requested
  if (projectId) {
    const { data } = await supabase
      .from("businesses")
      .select("id, result, answers, created_at, plan_edits")
      .eq("owner_id", ownerId)
      .eq("id", projectId)
      .single();
    if (data) {
      setActiveProjectId(data.id);
      return toSavedData(data);
    }
    return null;
  }

  // 2. Try the active project from localStorage
  const activeId = getActiveProjectId();
  if (activeId) {
    const { data } = await supabase
      .from("businesses")
      .select("id, result, answers, created_at, plan_edits")
      .eq("owner_id", ownerId)
      .eq("id", activeId)
      .single();
    if (data) return toSavedData(data);
  }

  // 3. Fallback to latest project
  const { data } = await supabase
    .from("businesses")
    .select("id, result, answers, created_at, plan_edits")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) return null;
  setActiveProjectId(data.id);
  return toSavedData(data);
}

export async function listAllProjects(): Promise<ProjectSummary[]> {
  const ownerId = await getOwnerId();

  const { data, error } = await supabase
    .from("businesses")
    .select("id, result, created_at")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => {
    const result = row.result as StackRecommendation;
    return {
      id: row.id,
      businessType: result?.analysis?.businessType || "Untitled Project",
      toolCount: result?.selectedTools?.length || 0,
      monthlyCost: result?.totalMonthlyCost || 0,
      createdAt: row.created_at,
    };
  });
}

export async function deleteProject(projectId: string): Promise<void> {
  const ownerId = await getOwnerId();
  await supabase
    .from("businesses")
    .delete()
    .eq("owner_id", ownerId)
    .eq("id", projectId);

  // If we deleted the active project, clear localStorage
  if (getActiveProjectId() === projectId) {
    localStorage.removeItem("active-project-id");
  }
}

export async function updatePlanEdits(edits: BusinessPlanEdits): Promise<void> {
  const ownerId = await getOwnerId();
  const activeId = getActiveProjectId();

  let query = supabase
    .from("businesses")
    .select("id, plan_edits")
    .eq("owner_id", ownerId);

  if (activeId) {
    query = query.eq("id", activeId);
  } else {
    query = query.order("created_at", { ascending: false }).limit(1);
  }

  const { data } = await query.single();
  if (!data) return;

  const merged = { ...((data.plan_edits as BusinessPlanEdits) || {}), ...edits };
  await supabase
    .from("businesses")
    .update({ plan_edits: merged })
    .eq("id", data.id);
}

export async function clearDashboardData(): Promise<void> {
  const ownerId = await getOwnerId();
  await supabase.from("businesses").delete().eq("owner_id", ownerId);
  localStorage.removeItem("active-project-id");
}

// --- Helper ---

function toSavedData(row: any): SavedDashboardData {
  return {
    id: row.id,
    result: row.result as StackRecommendation,
    answers: row.answers as Record<string, unknown>,
    savedAt: row.created_at,
    planEdits: (row.plan_edits as BusinessPlanEdits) || undefined,
  };
}
