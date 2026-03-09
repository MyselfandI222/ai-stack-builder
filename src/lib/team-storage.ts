import {
  TeamData,
  EmployeeProfile,
  EnterpriseSubscription,
  EmployeeGoal,
  ActivityEntry,
  EmployeeToolAssignment,
} from "@/types";

const TEAM_KEY = "aistack-team";

function load(): TeamData {
  try {
    const raw = localStorage.getItem(TEAM_KEY);
    if (!raw) return { employees: [], subscriptions: [] };
    return JSON.parse(raw) as TeamData;
  } catch {
    return { employees: [], subscriptions: [] };
  }
}

function save(data: TeamData): void {
  try {
    localStorage.setItem(TEAM_KEY, JSON.stringify(data));
  } catch {
    // noop
  }
}

export function getTeamData(): TeamData {
  return load();
}

export function getEmployee(id: string): EmployeeProfile | null {
  const data = load();
  return data.employees.find((e) => e.id === id) || null;
}

export function addEmployee(employee: EmployeeProfile): void {
  const data = load();
  data.employees.push(employee);
  save(data);
}

export function updateEmployee(id: string, updates: Partial<EmployeeProfile>): void {
  const data = load();
  const idx = data.employees.findIndex((e) => e.id === id);
  if (idx >= 0) {
    data.employees[idx] = { ...data.employees[idx], ...updates };
    save(data);
  }
}

export function deleteEmployee(id: string): void {
  const data = load();
  data.employees = data.employees.filter((e) => e.id !== id);
  save(data);
}

export function addGoal(employeeId: string, goal: EmployeeGoal): void {
  const data = load();
  const emp = data.employees.find((e) => e.id === employeeId);
  if (emp) {
    emp.goals.push(goal);
    save(data);
  }
}

export function updateGoal(
  employeeId: string,
  goalId: string,
  updates: Partial<EmployeeGoal>
): void {
  const data = load();
  const emp = data.employees.find((e) => e.id === employeeId);
  if (emp) {
    const goal = emp.goals.find((g) => g.id === goalId);
    if (goal) {
      Object.assign(goal, updates);
      save(data);
    }
  }
}

export function addActivity(employeeId: string, entry: ActivityEntry): void {
  const data = load();
  const emp = data.employees.find((e) => e.id === employeeId);
  if (emp) {
    emp.activityLog.unshift(entry);
    // Keep last 100 entries
    if (emp.activityLog.length > 100) emp.activityLog = emp.activityLog.slice(0, 100);
    save(data);
  }
}

export function inviteToTool(employeeId: string, toolId: string): void {
  const data = load();
  const emp = data.employees.find((e) => e.id === employeeId);
  if (emp) {
    const tool = emp.recommendedTools.find((t) => t.toolId === toolId);
    if (tool) {
      tool.invited = true;
      tool.invitedAt = new Date().toISOString();
      // Log the invite as an activity
      emp.activityLog.unshift({
        id: crypto.randomUUID(),
        toolName: tool.toolName,
        action: `Invited to ${tool.toolName}`,
        timestamp: new Date().toISOString(),
      });
      save(data);
    }
  }
}

export function getSubscriptions(): EnterpriseSubscription[] {
  return load().subscriptions;
}

export function addSubscription(sub: EnterpriseSubscription): void {
  const data = load();
  data.subscriptions.push(sub);
  save(data);
}

export function removeSubscription(toolId: string): void {
  const data = load();
  data.subscriptions = data.subscriptions.filter((s) => s.toolId !== toolId);
  save(data);
}

export function updateSubscription(
  toolId: string,
  updates: Partial<EnterpriseSubscription>
): void {
  const data = load();
  const idx = data.subscriptions.findIndex((s) => s.toolId === toolId);
  if (idx >= 0) {
    data.subscriptions[idx] = { ...data.subscriptions[idx], ...updates };
    save(data);
  }
}
