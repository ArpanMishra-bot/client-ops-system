"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getDashboardStats() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const [
    totalClients,
    activeLeads,
    activeProjects,
    invoices,
    pendingTasks,
    upcomingReminders,
    recentActivity,
  ] = await Promise.all([
    db.client.count({ where: { userId, isActive: true } }),
    db.lead.count({ where: { userId, status: { notIn: ["WON", "LOST"] } } }),
    db.project.count({ where: { userId, status: { in: ["IN_PROGRESS", "NOT_STARTED"] } } }),
    db.invoice.findMany({ where: { userId }, select: { total: true, status: true } }),
    db.task.count({ where: { userId, status: { not: "DONE" } } }),
    db.reminder.findMany({
      where: { userId, isDone: false, dueDate: { gte: new Date() } },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: { client: true, lead: true },
    }),
    db.client.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, company: true, createdAt: true },
    }),
  ])

  const totalRevenue = invoices
    .filter(i => i.status === "PAID")
    .reduce((sum, i) => sum + i.total, 0)

  const outstanding = invoices
    .filter(i => ["SENT", "VIEWED", "OVERDUE"].includes(i.status))
    .reduce((sum, i) => sum + i.total, 0)

  const totalInvoices = invoices.length

  return {
    totalClients,
    activeLeads,
    activeProjects,
    totalRevenue,
    outstanding,
    totalInvoices,
    pendingTasks,
    upcomingReminders,
    recentClients: recentActivity,
  }
}
