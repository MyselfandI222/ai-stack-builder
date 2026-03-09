import { SavedDashboardData, StackRecommendation } from "@/types";

const STORAGE_KEY = "aistack-dashboard";

export function saveDashboardData(
  result: StackRecommendation,
  answers: Record<string, unknown>
): void {
  const data: SavedDashboardData = {
    result,
    answers,
    savedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable
  }
}

export function loadDashboardData(): SavedDashboardData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedDashboardData;
  } catch {
    return null;
  }
}

export function clearDashboardData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
