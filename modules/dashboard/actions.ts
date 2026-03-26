"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getDashboardStats() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const now = new Date()
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  // Get all required data in fewer queries
  const [clients, leads, projects, allInvoices, tasks, reminders] = await Promise.all([
    db.client.findMany({
      where: { userId },
      select: { id: true, name: true, company: true, createdAt: true, isActive: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.lead.count({ where: { userId, status: { notIn: ["WON", "LOST"] } } }),
    db.project.count({ where: { userId, status: { in: ["IN_PROGRESS", "NOT_STARTED"] } } }),
    db.invoice.findMany({
      where: { userId },
      select: { total: true, status: true, createdAt: true, clientId: true, client: { select: { name: true } } }
    }),
    db.task.count({ where: { userId, status: { not: "DONE" } } }),
    db.reminder.findMany({
      where: { userId, isDone: false, dueDate: { gte: now } },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: { client: true, lead: true },
    }),
  ])

  // Calculate basic stats
  const totalClients = clients.filter(c => c.isActive).length
  const recentClients = clients.slice(0, 5)

  // Calculate revenue
  const totalRevenue = allInvoices
    .filter(i => i.status === "PAID")
    .reduce((sum, i) => sum + i.total, 0)

  const revenueThisMonth = allInvoices
    .filter(i => i.status === "PAID" && i.createdAt >= firstDayThisMonth)
    .reduce((sum, i) => sum + i.total, 0)

  const revenueLastMonth = allInvoices
    .filter(i => i.status === "PAID" && i.createdAt >= firstDayLastMonth && i.createdAt <= lastDayLastMonth)
    .reduce((sum, i) => sum + i.total, 0)

  const revenueTrend = revenueLastMonth === 0 
    ? (revenueThisMonth > 0 ? 100 : 0)
    : Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)

  const outstanding = allInvoices
    .filter(i => ["SENT", "VIEWED", "OVERDUE"].includes(i.status))
    .reduce((sum, i) => sum + i.total, 0)

  // Calculate top clients
  const clientRevenue = new Map<string, { name: string; total: number; lastMonthTotal: number }>()
  
  allInvoices.forEach(invoice => {
    if (invoice.status === "PAID" && invoice.clientId) {
      const existing = clientRevenue.get(invoice.clientId) || { 
        name: invoice.client?.name || "Unknown", 
        total: 0, 
        lastMonthTotal: 0 
      }
      existing.total += invoice.total
      if (invoice.createdAt >= firstDayLastMonth && invoice.createdAt <= lastDayLastMonth) {
        existing.lastMonthTotal += invoice.total
      }
      clientRevenue.set(invoice.clientId, existing)
    }
  })

  const topClients = Array.from(clientRevenue.entries())
    .map(([id, data]) => ({
      id,
      name: data.name,
      revenue: data.total,
      trend: data.lastMonthTotal === 0 
        ? (data.total > 0 ? 100 : 0)
        : Math.round(((data.total - data.lastMonthTotal) / data.lastMonthTotal) * 100)
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Calculate simple trends (using counts from existing data)
  const clientsThisMonth = clients.filter(c => c.createdAt >= firstDayThisMonth).length
  const clientsLastMonth = clients.filter(c => c.createdAt >= firstDayLastMonth && c.createdAt <= lastDayLastMonth).length
  const clientTrend = clientsLastMonth === 0 ? (clientsThisMonth > 0 ? 100 : 0) : Math.round(((clientsThisMonth - clientsLastMonth) / clientsLastMonth) * 100)

  // Simple activity feed
  const recentActivities = [
    ...allInvoices.slice(0, 2).map(i => ({
      type: "invoice" as const,
      action: i.status === "PAID" ? "paid" : "created",
      name: i.client?.name || "Unknown",
      amount: i.total,
      timestamp: i.createdAt
    })),
    ...clients.slice(0, 2).map(c => ({
      type: "client" as const,
      action: "created",
      name: c.name,
      timestamp: c.createdAt
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5)

  return {
    totalClients,
    clientTrend,
    activeLeads: leads,
    leadsTrend: 0,
    activeProjects: projects,
    projectsTrend: 0,
    totalRevenue,
    revenueTrend,
    outstanding,
    pendingTasks: tasks,
    tasksTrend: 0,
    upcomingReminders: reminders,
    recentClients,
    topClients,
    recentActivities,
  }
}
