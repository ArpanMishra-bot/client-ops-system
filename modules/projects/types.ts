export type ProjectStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED"

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

export type Project = {
  id: string
  userId: string
  clientId: string
  name: string
  description: string | null
  status: ProjectStatus
  startDate: Date | null
  dueDate: Date | null
  budget: number | null
  currency: string
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export type Task = {
  id: string
  userId: string
  projectId: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: Date | null
  order: number
  createdAt: Date
  updatedAt: Date
}

export type CreateProjectInput = {
  clientId: string
  name: string
  description?: string
  status?: ProjectStatus
  startDate?: string
  dueDate?: string
  budget?: number
  currency?: string
  notes?: string
}

export type CreateTaskInput = {
  projectId: string
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
}

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, { label: string, color: string, bg: string }> = {
  NOT_STARTED: { label: "Not Started", color: "text-gray-600", bg: "bg-gray-100" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-600", bg: "bg-blue-50" },
  ON_HOLD: { label: "On Hold", color: "text-yellow-600", bg: "bg-yellow-50" },
  COMPLETED: { label: "Completed", color: "text-green-600", bg: "bg-green-50" },
  CANCELLED: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50" },
}

export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string, color: string, bg: string }> = {
  TODO: { label: "To Do", color: "text-gray-600", bg: "bg-gray-100" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-600", bg: "bg-blue-50" },
  IN_REVIEW: { label: "In Review", color: "text-purple-600", bg: "bg-purple-50" },
  DONE: { label: "Done", color: "text-green-600", bg: "bg-green-50" },
}
