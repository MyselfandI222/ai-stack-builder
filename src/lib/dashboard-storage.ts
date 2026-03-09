import { SavedDashboardData, StackRecommendation } from "@/types";
import { supabase, getOwnerId } from "./supabase";

export async function saveDashboardData(
  result: StackRecommendation,
  answers: Record<string, unknown>
): Promise<void> {
  const ownerId = await getOwnerId();

  // Upsert: delete old record, insert new one
  await supabase.from("businesses").delete().eq("owner_id", ownerId);

  await supabase.from("businesses").insert({
    owner_id: ownerId,
    result,
    answers,
  });
}

export async function loadDashboardData(): Promise<SavedDashboardData | null> {
  const ownerId = await getOwnerId();

  const { data, error } = await supabase
    .from("businesses")
    .select("result, answers, created_at")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;

  return {
    result: data.result as StackRecommendation,
    answers: data.answers as Record<string, unknown>,
    savedAt: data.created_at,
  };
}

export async function clearDashboardData(): Promise<void> {
  const ownerId = await getOwnerId();
  await supabase.from("businesses").delete().eq("owner_id", ownerId);
}
