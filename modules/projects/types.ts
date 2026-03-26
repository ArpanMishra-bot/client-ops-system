export const PROJECT_STATUSES = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
] as const

export type ProjectStatus = typeof PROJECT_STATUSES[number]

export const TASK_STATUSES = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
] as const

export type TaskStatus = typeof TASK_STATUSES[number]

export interface Project {
  id: string
  userId: string
  name: string
  description: string | null
  clientId: string
  status: ProjectStatus
  startDate: Date | null
  dueDate: Date | null
  budget: number | null
  currency: string
  notes: string | null
  createdAt: Date
  updatedAt: Date
  client?: {
    id: string
    name: string
  }
  tasks?: Task[]
}

export interface Task {
  id: string
  userId: string
  title: string
  description: string | null
  status: TaskStatus
  priority?: string | null
  dueDate: Date | null
  order: number
  projectId: string
  createdAt: Date
  updatedAt: Date
  project?: {
    id: string
    name: string
  }
}

export const PROJECT_STATUS_CONFIG = {
  NOT_STARTED: { label: "Not Started", color: "text-gray-600", bg: "bg-gray-50" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-600", bg: "bg-blue-50" },
  ON_HOLD: { label: "On Hold", color: "text-yellow-600", bg: "bg-yellow-50" },
  COMPLETED: { label: "Completed", color: "text-green-600", bg: "bg-green-50" },
}

export const TASK_STATUS_CONFIG = {
  TODO: { label: "To Do", color: "text-gray-600", bg: "bg-gray-50" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-600", bg: "bg-blue-50" },
  IN_REVIEW: { label: "In Review", color: "text-purple-600", bg: "bg-purple-50" },
  DONE: { label: "Done", color: "text-green-600", bg: "bg-green-50" },
}

export type CreateProjectInput = Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
export type UpdateProjectInput = Partial<CreateProjectInput>

export type CreateTaskInput = Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
export type UpdateTaskInput = Partial<CreateTaskInput>
