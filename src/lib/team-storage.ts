import {
  TeamData,
  EmployeeProfile,
  EnterpriseSubscription,
  EmployeeGoal,
  ActivityEntry,
  EmployeeToolAssignment,
} from "@/types";
import { supabase, getOwnerId } from "./supabase";

// --- Helpers to map DB rows to app types ---

interface EmployeeRow {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  answers: Record<string, unknown>;
  recommended_tools: EmployeeToolAssignment[];
  created_at: string;
}

interface GoalRow {
  id: string;
  employee_id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
  created_at: string;
}

interface ActivityRow {
  id: string;
  employee_id: string;
  tool_name: string;
  action: string;
  created_at: string;
}

function rowToEmployee(
  row: EmployeeRow,
  goals: GoalRow[],
  activity: ActivityRow[]
): EmployeeProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as EmployeeProfile["role"],
    department: row.department,
    answers: row.answers,
    recommendedTools: row.recommended_tools as EmployeeToolAssignment[],
    goals: goals.map((g) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      deadline: g.deadline,
      status: g.status as EmployeeGoal["status"],
      createdAt: g.created_at,
    })),
    activityLog: activity.map((a) => ({
      id: a.id,
      toolName: a.tool_name,
      action: a.action,
      timestamp: a.created_at,
    })),
    createdAt: row.created_at,
  };
}

// --- Team data ---

export async function getTeamData(): Promise<TeamData> {
  const ownerId = await getOwnerId();

  const [empRes, subRes] = await Promise.all([
    supabase.from("employees").select("*").eq("owner_id", ownerId).order("created_at"),
    supabase.from("subscriptions").select("*").eq("owner_id", ownerId),
  ]);

  const empRows = (empRes.data || []) as EmployeeRow[];
  const empIds = empRows.map((e) => e.id);

  let goals: GoalRow[] = [];
  let activity: ActivityRow[] = [];

  if (empIds.length > 0) {
    const [goalsRes, actRes] = await Promise.all([
      supabase.from("employee_goals").select("*").in("employee_id", empIds),
      supabase
        .from("activity_log")
        .select("*")
        .in("employee_id", empIds)
        .order("created_at", { ascending: false })
        .limit(100),
    ]);
    goals = (goalsRes.data || []) as GoalRow[];
    activity = (actRes.data || []) as ActivityRow[];
  }

  const employees = empRows.map((row) =>
    rowToEmployee(
      row,
      goals.filter((g) => g.employee_id === row.id),
      activity.filter((a) => a.employee_id === row.id)
    )
  );

  const subscriptions: EnterpriseSubscription[] = (subRes.data || []).map((s) => ({
    toolId: s.tool_id,
    toolName: s.tool_name,
    website: s.website,
    seats: s.seats,
    seatsUsed: s.seats_used,
    monthlyCost: Number(s.monthly_cost),
  }));

  return { employees, subscriptions };
}

// --- Single employee ---

export async function getEmployee(id: string): Promise<EmployeeProfile | null> {
  const { data: row, error } = await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !row) return null;

  const [goalsRes, actRes] = await Promise.all([
    supabase.from("employee_goals").select("*").eq("employee_id", id),
    supabase
      .from("activity_log")
      .select("*")
      .eq("employee_id", id)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  return rowToEmployee(
    row as EmployeeRow,
    (goalsRes.data || []) as GoalRow[],
    (actRes.data || []) as ActivityRow[]
  );
}

// --- Add employee ---

export async function addEmployee(employee: EmployeeProfile): Promise<void> {
  const ownerId = await getOwnerId();

  await supabase.from("employees").insert({
    id: employee.id,
    owner_id: ownerId,
    name: employee.name,
    email: employee.email,
    role: employee.role,
    department: employee.department,
    answers: employee.answers,
    recommended_tools: employee.recommendedTools,
  });

  // Insert goals
  if (employee.goals.length > 0) {
    await supabase.from("employee_goals").insert(
      employee.goals.map((g) => ({
        id: g.id,
        employee_id: employee.id,
        title: g.title,
        description: g.description,
        deadline: g.deadline,
        status: g.status,
      }))
    );
  }
}

// --- Update employee ---

export async function updateEmployee(
  id: string,
  updates: Partial<EmployeeProfile>
): Promise<void> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.role !== undefined) dbUpdates.role = updates.role;
  if (updates.department !== undefined) dbUpdates.department = updates.department;
  if (updates.answers !== undefined) dbUpdates.answers = updates.answers;
  if (updates.recommendedTools !== undefined)
    dbUpdates.recommended_tools = updates.recommendedTools;

  if (Object.keys(dbUpdates).length > 0) {
    await supabase.from("employees").update(dbUpdates).eq("id", id);
  }
}

// --- Delete employee ---

export async function deleteEmployee(id: string): Promise<void> {
  // Cascading delete handles goals & activity
  await supabase.from("employees").delete().eq("id", id);
}

// --- Goals ---

export async function addGoal(employeeId: string, goal: EmployeeGoal): Promise<void> {
  await supabase.from("employee_goals").insert({
    id: goal.id,
    employee_id: employeeId,
    title: goal.title,
    description: goal.description,
    deadline: goal.deadline,
    status: goal.status,
  });
}

export async function updateGoal(
  employeeId: string,
  goalId: string,
  updates: Partial<EmployeeGoal>
): Promise<void> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline;
  if (updates.status !== undefined) dbUpdates.status = updates.status;

  await supabase
    .from("employee_goals")
    .update(dbUpdates)
    .eq("id", goalId)
    .eq("employee_id", employeeId);
}

// --- Activity ---

export async function addActivity(employeeId: string, entry: ActivityEntry): Promise<void> {
  await supabase.from("activity_log").insert({
    id: entry.id,
    employee_id: employeeId,
    tool_name: entry.toolName,
    action: entry.action,
  });
}

// --- Tool invites ---

export async function inviteToTool(employeeId: string, toolId: string): Promise<void> {
  // Load current tools, update the specific one, write back
  const { data: row } = await supabase
    .from("employees")
    .select("recommended_tools")
    .eq("id", employeeId)
    .single();

  if (!row) return;

  const tools = row.recommended_tools as EmployeeToolAssignment[];
  const tool = tools.find((t) => t.toolId === toolId);
  if (tool) {
    tool.invited = true;
    tool.invitedAt = new Date().toISOString();

    await supabase
      .from("employees")
      .update({ recommended_tools: tools })
      .eq("id", employeeId);

    // Log invite activity
    await supabase.from("activity_log").insert({
      id: crypto.randomUUID(),
      employee_id: employeeId,
      tool_name: tool.toolName,
      action: `Invited to ${tool.toolName}`,
    });
  }
}

// --- Subscriptions ---

export async function getSubscriptions(): Promise<EnterpriseSubscription[]> {
  const ownerId = await getOwnerId();
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("owner_id", ownerId);

  return (data || []).map((s) => ({
    toolId: s.tool_id,
    toolName: s.tool_name,
    website: s.website,
    seats: s.seats,
    seatsUsed: s.seats_used,
    monthlyCost: Number(s.monthly_cost),
  }));
}

export async function addSubscription(sub: EnterpriseSubscription): Promise<void> {
  const ownerId = await getOwnerId();
  await supabase.from("subscriptions").insert({
    owner_id: ownerId,
    tool_id: sub.toolId,
    tool_name: sub.toolName,
    website: sub.website,
    seats: sub.seats,
    seats_used: sub.seatsUsed,
    monthly_cost: sub.monthlyCost,
  });
}

export async function removeSubscription(toolId: string): Promise<void> {
  const ownerId = await getOwnerId();
  await supabase
    .from("subscriptions")
    .delete()
    .eq("owner_id", ownerId)
    .eq("tool_id", toolId);
}

export async function updateSubscription(
  toolId: string,
  updates: Partial<EnterpriseSubscription>
): Promise<void> {
  const ownerId = await getOwnerId();
  const dbUpdates: Record<string, unknown> = {};
  if (updates.seats !== undefined) dbUpdates.seats = updates.seats;
  if (updates.seatsUsed !== undefined) dbUpdates.seats_used = updates.seatsUsed;
  if (updates.monthlyCost !== undefined) dbUpdates.monthly_cost = updates.monthlyCost;

  await supabase
    .from("subscriptions")
    .update(dbUpdates)
    .eq("owner_id", ownerId)
    .eq("tool_id", toolId);
}
