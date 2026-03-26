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

  // Fetch all data
  const [
    totalClients,
    activeLeads,
    activeProjects,
    allInvoices,
    pendingTasks,
    upcomingReminders,
    recentClients,
  ] = await Promise.all([
    db.client.count({ where: { userId, isActive: true } }),
    db.lead.count({ where: { userId, status: { notIn: ["WON", "LOST"] } } }),
    db.project.count({ where: { userId, status: { in: ["IN_PROGRESS", "NOT_STARTED"] } } }),
    db.invoice.findMany({ where: { userId }, select: { total: true, status: true, createdAt: true, clientId: true, client: { select: { name: true } } } }),
    db.task.count({ where: { userId, status: { not: "DONE" } } }),
    db.reminder.findMany({
      where: { userId, isDone: false, dueDate: { gte: now } },
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

  // Calculate trends (avoid division by zero)
  const revenueTrend = revenueLastMonth === 0 
    ? (revenueThisMonth > 0 ? 100 : 0)
    : Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)

  // Calculate outstanding
  const outstanding = allInvoices
    .filter(i => ["SENT", "VIEWED", "OVERDUE"].includes(i.status))
    .reduce((sum, i) => sum + i.total, 0)

  // Calculate top clients by revenue (actual data)
  const clientRevenue = new Map<string, { name: string; total: number; lastMonthTotal: number }>()
  
  allInvoices.forEach(invoice => {
    if (invoice.status === "PAID" && invoice.clientId) {
      const existing = clientRevenue.get(invoice.clientId) || { name: invoice.client?.name || "Unknown", total: 0, lastMonthTotal: 0 }
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

  // Calculate active clients trend
  const clientsThisMonth = await db.client.count({
    where: {
      userId,
      createdAt: { gte: firstDayThisMonth }
    }
  })
  
  const clientsLastMonth = await db.client.count({
    where: {
      userId,
      createdAt: { gte: firstDayLastMonth, lte: lastDayLastMonth }
    }
  })

  const clientTrend = clientsLastMonth === 0
    ? (clientsThisMonth > 0 ? 100 : 0)
    : Math.round(((clientsThisMonth - clientsLastMonth) / clientsLastMonth) * 100)

  // Calculate leads trend
  const leadsThisMonth = await db.lead.count({
    where: {
      userId,
      createdAt: { gte: firstDayThisMonth }
    }
  })
  
  const leadsLastMonth = await db.lead.count({
    where: {
      userId,
      createdAt: { gte: firstDayLastMonth, lte: lastDayLastMonth }
    }
  })

  const leadsTrend = leadsLastMonth === 0
    ? (leadsThisMonth > 0 ? 100 : 0)
    : Math.round(((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100)

  // Calculate projects trend
  const projectsThisMonth = await db.project.count({
    where: {
      userId,
      createdAt: { gte: firstDayThisMonth }
    }
  })
  
  const projectsLastMonth = await db.project.count({
    where: {
      userId,
      createdAt: { gte: firstDayLastMonth, lte: lastDayLastMonth }
    }
  })

  const projectsTrend = projectsLastMonth === 0
    ? (projectsThisMonth > 0 ? 100 : 0)
    : Math.round(((projectsThisMonth - projectsLastMonth) / projectsLastMonth) * 100)

  // Calculate tasks trend
  const tasksThisMonth = await db.task.count({
    where: {
      userId,
      status: { not: "DONE" },
      createdAt: { gte: firstDayThisMonth }
    }
  })
  
  const tasksLastMonth = await db.task.count({
    where: {
      userId,
      status: { not: "DONE" },
      createdAt: { gte: firstDayLastMonth, lte: lastDayLastMonth }
    }
  })

  const tasksTrend = tasksLastMonth === 0
    ? (tasksThisMonth > 0 ? 100 : 0)
    : Math.round(((tasksThisMonth - tasksLastMonth) / tasksLastMonth) * 100)

  // Build activity feed
  const recentActivities = [
    ...allInvoices.slice(0, 3).map(i => ({
      type: "invoice" as const,
      action: i.status === "PAID" ? "paid" : "created",
      name: i.client?.name || "Unknown",
      amount: i.total,
      timestamp: i.createdAt
    })),
    ...recentClients.slice(0, 2).map(c => ({
      type: "client" as const,
      action: "created",
      name: c.name,
      timestamp: c.createdAt
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5)

  return {
    totalClients,
    clientTrend,
    activeLeads,
    leadsTrend,
    activeProjects,
    projectsTrend,
    totalRevenue,
    revenueTrend,
    outstanding,
    pendingTasks,
    tasksTrend,
    upcomingReminders,
    recentClients,
    topClients,
    recentActivities,
  }
}
