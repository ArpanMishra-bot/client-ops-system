// modules/dashboard/actions.ts
"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

// Helper function to calculate trend safely
function calculateTrend(thisMonth: number, lastMonth: number): number | null {
  // Both zero - no data ever
  if (lastMonth === 0 && thisMonth === 0) {
    return null
  }
  // First month with data (0 → positive)
  if (lastMonth === 0 && thisMonth > 0) {
    return 100
  }
  // Dropped to zero (positive → 0)
  if (lastMonth > 0 && thisMonth === 0) {
    return -100
  }
  // Same as last month
  if (thisMonth === lastMonth) {
    return 0
  }
  // Calculate percentage change
  return Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
}

export async function getDashboardStats() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const now = new Date()
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  // Get all data
  const [
    clients,
    leadsData,
    projectsData,
    tasksData,
    allInvoices,
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
      select: { id: true, status: true, createdAt: true, value: true },
    }),
    db.project.findMany({
      where: { userId },
      select: { id: true, status: true, createdAt: true },
    }),
    db.task.findMany({
      where: { userId },
      select: { id: true, status: true, createdAt: true },
    }),
    db.invoice.findMany({
      where: { userId },
      select: { total: true, status: true, createdAt: true, clientId: true, client: { select: { name: true } } }
    }),
    db.reminder.findMany({
      where: { userId, isDone: false, dueDate: { gte: now } },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: { client: true, lead: true },
    }),
  ])

  // Revenue chart data with proper month mapping
  const chartData = []
  const monthsToShow = 6
  
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = date.toLocaleString('default', { month: 'short' })
    const year = date.getFullYear()
    
    const startOfMonth = new Date(year, date.getMonth(), 1)
    const endOfMonth = new Date(year, date.getMonth() + 1, 0, 23, 59, 59)
    
    const monthlyInvoices = allInvoices.filter(inv => {
      const invDate = new Date(inv.createdAt)
      return inv.status === "PAID" && invDate >= startOfMonth && invDate <= endOfMonth
    })
    
    const monthlyRevenue = monthlyInvoices.reduce((sum, inv) => sum + inv.total, 0)
    
    chartData.push({
      month: `${monthName} ${year}`,
      revenue: Number(monthlyRevenue.toFixed(2))
    })
  }

  // Calculate pipeline data
  const stageOrder = ["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"]
  const stageLabels: Record<string, string> = {
    NEW: "New", CONTACTED: "Contacted", QUALIFIED: "Qualified", PROPOSAL: "Proposal", 
    NEGOTIATION: "Negotiation", WON: "Won", LOST: "Lost"
  }

  const pipelineData = stageOrder.map(status => ({
    stage: stageLabels[status],
    value: leadsData.filter(l => l.status === status).reduce((sum, l) => sum + (l.value ?? 0), 0),
    count: leadsData.filter(l => l.status === status).length
  })).filter(d => d.value > 0 || d.count > 0)

  // Calculate counts
  const totalClients = clients.filter(c => c.isActive).length
  const recentClients = clients.slice(0, 5)
  const activeLeads = leadsData.filter(l => l.status !== "WON" && l.status !== "LOST").length
  const activeProjects = projectsData.filter(p => p.status === "IN_PROGRESS" || p.status === "NOT_STARTED").length
  const pendingTasks = tasksData.filter(t => t.status !== "DONE").length
  const totalRevenue = allInvoices.filter(i => i.status === "PAID").reduce((sum, i) => sum + i.total, 0)
  const outstanding = allInvoices.filter(i => ["SENT", "VIEWED", "OVERDUE"].includes(i.status)).reduce((sum, i) => sum + i.total, 0)
  
  // Trend calculations using fixed calculateTrend function
  const leadsThisMonth = leadsData.filter(l => l.createdAt >= firstDayThisMonth).length
  const leadsLastMonth = leadsData.filter(l => l.createdAt >= firstDayLastMonth && l.createdAt <= lastDayLastMonth).length
  const leadsTrend = calculateTrend(leadsThisMonth, leadsLastMonth)

  const projectsThisMonth = projectsData.filter(p => p.createdAt >= firstDayThisMonth).length
  const projectsLastMonth = projectsData.filter(p => p.createdAt >= firstDayLastMonth && p.createdAt <= lastDayLastMonth).length
  const projectsTrend = calculateTrend(projectsThisMonth, projectsLastMonth)

  const tasksThisMonth = tasksData.filter(t => t.createdAt >= firstDayThisMonth).length
  const tasksLastMonth = tasksData.filter(t => t.createdAt >= firstDayLastMonth && t.createdAt <= lastDayLastMonth).length
  const tasksTrend = calculateTrend(tasksThisMonth, tasksLastMonth)

  const revenueThisMonth = allInvoices.filter(i => i.status === "PAID" && i.createdAt >= firstDayThisMonth).reduce((sum, i) => sum + i.total, 0)
  const revenueLastMonth = allInvoices.filter(i => i.status === "PAID" && i.createdAt >= firstDayLastMonth && i.createdAt <= lastDayLastMonth).reduce((sum, i) => sum + i.total, 0)
  const revenueTrend = calculateTrend(revenueThisMonth, revenueLastMonth)

  const clientsThisMonth = clients.filter(c => c.createdAt >= firstDayThisMonth).length
  const clientsLastMonth = clients.filter(c => c.createdAt >= firstDayLastMonth && c.createdAt <= lastDayLastMonth).length
  const clientTrend = calculateTrend(clientsThisMonth, clientsLastMonth)
  
  const outstandingThisMonth = allInvoices
    .filter(i => ["SENT", "VIEWED", "OVERDUE"].includes(i.status) && i.createdAt >= firstDayThisMonth)
    .reduce((sum, i) => sum + i.total, 0)
  const outstandingLastMonth = allInvoices
    .filter(i => ["SENT", "VIEWED", "OVERDUE"].includes(i.status) && i.createdAt >= firstDayLastMonth && i.createdAt <= lastDayLastMonth)
    .reduce((sum, i) => sum + i.total, 0)
  const outstandingTrend = calculateTrend(outstandingThisMonth, outstandingLastMonth)

  // Calculate top clients with trend
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
      trend: calculateTrend(data.total, data.lastMonthTotal) ?? 0
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Calculate Business Health Score
  let healthScore = 0
  const clientScore = Math.min(25, (totalClients / 20) * 25)
  const revenueScore = Math.min(25, (totalRevenue / 10000) * 25)
  const pipelineValue = pipelineData.reduce((sum, p) => sum + p.value, 0)
  const pipelineScore = Math.min(25, (pipelineValue / 20000) * 25)
  const tasksScore = Math.min(25, Math.max(0, 25 - (pendingTasks / 10) * 5))
  
  healthScore = Math.round(clientScore + revenueScore + pipelineScore + tasksScore)
  healthScore = Math.min(100, Math.max(0, healthScore))

  const healthColor = healthScore >= 80 ? "text-emerald-600" : healthScore >= 50 ? "text-amber-600" : "text-rose-600"
  const healthBg = healthScore >= 80 ? "bg-emerald-50" : healthScore >= 50 ? "bg-amber-50" : "bg-rose-50"

  // Activity feed
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
    outstandingTrend,
    pendingTasks,
    tasksTrend,
    upcomingReminders: reminders,
    recentClients,
    topClients,
    recentActivities,
    revenueChartData: chartData,
    pipelineData,
    healthScore,
    healthColor,
    healthBg,
  }
}
