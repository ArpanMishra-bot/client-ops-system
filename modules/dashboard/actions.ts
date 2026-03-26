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

  // Get all invoices
  const allInvoices = await db.invoice.findMany({
    where: { userId },
    select: { total: true, status: true, createdAt: true, clientId: true, client: { select: { name: true } } }
  })

  // Calculate revenue per month for chart (LAST 6 MONTHS)
  const chartData = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = date.toLocaleString('default', { month: 'short' })
    const year = date.getFullYear()
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1)
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    
    // Calculate revenue for this specific month
    const monthlyRevenue = allInvoices
      .filter(inv => inv.status === "PAID" && inv.createdAt >= startDate && inv.createdAt <= endDate)
      .reduce((sum, inv) => sum + inv.total, 0)
    
    chartData.push({
      month: `${monthName} ${year}`,
      revenue: monthlyRevenue
    })
  }

  // The rest of your stats...
  const [
    clients,
    leadsData,
    projectsData,
    tasksData,
    reminders,
  ] = await Promise.all([
    db.client.findMany({
      where: { userId },
      select: { id: true, name: true, company: true, createdAt: true, isActive: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.lead.findMany({
      where: { userId },
      select: { id: true, status: true, createdAt: true },
    }),
    db.project.findMany({
      where: { userId },
      select: { id: true, status: true, createdAt: true },
    }),
    db.task.findMany({
      where: { userId },
      select: { id: true, status: true, createdAt: true },
    }),
    db.reminder.findMany({
      where: { userId, isDone: false, dueDate: { gte: now } },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: { client: true, lead: true },
    }),
  ])

  // Calculate counts
  const totalClients = clients.filter(c => c.isActive).length
  const recentClients = clients.slice(0, 5)

  const activeLeads = leadsData.filter(l => l.status !== "WON" && l.status !== "LOST").length
  const leadsThisMonth = leadsData.filter(l => l.createdAt >= firstDayThisMonth).length
  const leadsLastMonth = leadsData.filter(l => l.createdAt >= firstDayLastMonth && l.createdAt <= lastDayLastMonth).length
  const leadsTrend = leadsLastMonth === 0 ? (leadsThisMonth > 0 ? 100 : 0) : Math.round(((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100)

  const activeProjects = projectsData.filter(p => p.status === "IN_PROGRESS" || p.status === "NOT_STARTED").length
  const projectsThisMonth = projectsData.filter(p => p.createdAt >= firstDayThisMonth).length
  const projectsLastMonth = projectsData.filter(p => p.createdAt >= firstDayLastMonth && p.createdAt <= lastDayLastMonth).length
  const projectsTrend = projectsLastMonth === 0 ? (projectsThisMonth > 0 ? 100 : 0) : Math.round(((projectsThisMonth - projectsLastMonth) / projectsLastMonth) * 100)

  const pendingTasks = tasksData.filter(t => t.status !== "DONE").length
  const tasksThisMonth = tasksData.filter(t => t.createdAt >= firstDayThisMonth).length
  const tasksLastMonth = tasksData.filter(t => t.createdAt >= firstDayLastMonth && t.createdAt <= lastDayLastMonth).length
  const tasksTrend = tasksLastMonth === 0 ? (tasksThisMonth > 0 ? 100 : 0) : Math.round(((tasksThisMonth - tasksLastMonth) / tasksLastMonth) * 100)

  const totalRevenue = allInvoices.filter(i => i.status === "PAID").reduce((sum, i) => sum + i.total, 0)
  const revenueThisMonth = allInvoices.filter(i => i.status === "PAID" && i.createdAt >= firstDayThisMonth).reduce((sum, i) => sum + i.total, 0)
  const revenueLastMonth = allInvoices.filter(i => i.status === "PAID" && i.createdAt >= firstDayLastMonth && i.createdAt <= lastDayLastMonth).reduce((sum, i) => sum + i.total, 0)
  const revenueTrend = revenueLastMonth === 0 ? (revenueThisMonth > 0 ? 100 : 0) : Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)

  const outstanding = allInvoices.filter(i => ["SENT", "VIEWED", "OVERDUE"].includes(i.status)).reduce((sum, i) => sum + i.total, 0)

  const clientsThisMonth = clients.filter(c => c.createdAt >= firstDayThisMonth).length
  const clientsLastMonth = clients.filter(c => c.createdAt >= firstDayLastMonth && c.createdAt <= lastDayLastMonth).length
  const clientTrend = clientsLastMonth === 0 ? (clientsThisMonth > 0 ? 100 : 0) : Math.round(((clientsThisMonth - clientsLastMonth) / clientsLastMonth) * 100)

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
      trend: data.lastMonthTotal === 0 ? (data.total > 0 ? 100 : 0) : Math.round(((data.total - data.lastMonthTotal) / data.lastMonthTotal) * 100)
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

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
    activeLeads,
    leadsTrend,
    activeProjects,
    projectsTrend,
    totalRevenue,
    revenueTrend,
    outstanding,
    pendingTasks,
    tasksTrend,
    upcomingReminders: reminders,
    recentClients,
    topClients,
    recentActivities,
    revenueChartData: chartData, // This now has revenue per month
  }
}
