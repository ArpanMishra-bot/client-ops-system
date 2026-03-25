export type ReminderType = "FOLLOW_UP" | "MEETING" | "DEADLINE" | "PAYMENT"

export type Reminder = {
  id: string
  userId: string
  title: string
  description: string | null
  type: ReminderType
  dueDate: Date
  isDone: boolean
  clientId: string | null
  leadId: string | null
  projectId: string | null
  createdAt: Date
  updatedAt: Date
  client?: {
    id: string
    name: string
  } | null
  lead?: {
    id: string
    name: string
  } | null
  project?: {
    id: string
    name: string
  } | null
}
