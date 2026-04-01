"use client"

import { useEffect, useRef, useState } from "react"

interface CustomRevenueChartProps {
  data: { month: string; revenue: number }[]
  targetData?: { month: string; target: number }[]
}

interface Metrics {
  totalRevenue: number
  avgMonthly: number
  maxRevenue: number
  maxMonth: string
  yoyGrowth: number
  targetAchievement: number
  gapToTarget: number
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

const formatCompactCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

export default function CustomRevenueChart({ data, targetData }: CustomRevenueChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [period, setPeriod] = useState<"3M" | "6M" | "1Y" | "All">("1Y")
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    x: number
    y: number
    month: string
    revenue: number
    target: number
    trend: number | null
    vsTarget: number
  }>({
    visible: false,
    x: 0,
    y: 0,
    month: "",
    revenue: 0,
    target: 0,
    trend: null,
    vsTarget: 0,
  })

  // Filter data based on selected period
  const getFilteredData = () => {
    if (period === "3M") return data.slice(-3)
    if (period === "6M") return data.slice(-6)
    if (period === "1Y") return data.slice(-12)
    return data
  }

  const filteredData = getFilteredData()
  
  // Prepare chart data with targets
  const chartData = filteredData.map((item, index) => ({
    ...item,
    target: targetData?.find(t => t.month === item.month)?.target || item.revenue * 0.95,
  }))

  // Calculate metrics
  const calculateMetrics = (): Metrics => {
    const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0)
    const avgMonthly = totalRevenue / chartData.length
    const maxRevenue = Math.max(...chartData.map(d => d.revenue))
    const maxMonth = chartData.find(d => d.revenue === maxRevenue)?.month || ""
    
    const recent = chartData.slice(-3).reduce((sum, d) => sum + d.revenue, 0)
    const previous = chartData.slice(-6, -3).reduce((sum, d) => sum + d.revenue, 0)
    const yoyGrowth = previous > 0 ? ((recent - previous) / previous) * 100 : 0
    
    const avgTarget = chartData.reduce((sum, d) => sum + d.target, 0) / chartData.length
    const targetAchievement = (avgMonthly / avgTarget) * 100
    const gapToTarget = avgTarget - avgMonthly
    
    return {
      totalRevenue,
      avgMonthly,
      maxRevenue,
      maxMonth,
      yoyGrowth,
      targetAchievement,
      gapToTarget,
    }
  }

  const metrics = calculateMetrics()

  // Draw chart when data or period changes
  useEffect(() => {
    if (!svgRef.current) return
    
    const svg = svgRef.current
    svg.innerHTML = "" // Clear previous drawing
    
    const W = 648
    const H = 200
    const PAD = { l: 2, r: 2, t: 20, b: 10 }
    const chartW = W - PAD.l - PAD.r
    const chartH = H - PAD.t - PAD.b
    
    const allValues = [...chartData.map(d => d.revenue), ...chartData.map(d => d.target)]
    const maxVal = Math.max(...allValues) * 1.08
    const minVal = Math.min(...allValues) * 0.85
    
    const xPos = (i: number) => PAD.l + (i / (chartData.length - 1)) * chartW
    const yPos = (v: number) => PAD.t + chartH - ((v - minVal) / (maxVal - minVal)) * chartH
    
    // Draw grid lines
    const gridVals = [60000, 70000, 80000, 90000]
    gridVals.forEach(v => {
      if (v < minVal || v > maxVal) return
      const y = yPos(v)
      
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
      line.setAttribute("x1", PAD.l.toString())
      line.setAttribute("x2", (W - PAD.r).toString())
      line.setAttribute("y1", y.toString())
      line.setAttribute("y2", y.toString())
      line.setAttribute("stroke", "#e9eef3")
      line.setAttribute("stroke-width", "1")
      svg.appendChild(line)
      
      const txt = document.createElementNS("http://www.w3.org/2000/svg", "text")
      txt.setAttribute("x", (PAD.l + 2).toString())
      txt.setAttribute("y", (y - 4).toString())
      txt.setAttribute("fill", "#8e9aab")
      txt.setAttribute("font-size", "9")
      txt.setAttribute("font-family", "'Geist Mono', monospace")
      txt.textContent = formatCompactCurrency(v)
      svg.appendChild(txt)
    })
    
    // Draw target line (dashed)
    const targetPoints = chartData.map((d, i) => `${xPos(i)},${yPos(d.target)}`)
    const targetPath = targetPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p}`).join(" ")
    const targetLine = document.createElementNS("http://www.w3.org/2000/svg", "path")
    targetLine.setAttribute("d", targetPath)
    targetLine.setAttribute("fill", "none")
    targetLine.setAttribute("stroke", "#d1d5db")
    targetLine.setAttribute("stroke-width", "1.5")
    targetLine.setAttribute("stroke-dasharray", "5 5")
    svg.appendChild(targetLine)
    
    // Draw area gradient
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
    defs.innerHTML = `
      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#6366f1" stop-opacity="0.2"/>
        <stop offset="75%" stop-color="#6366f1" stop-opacity="0.04"/>
        <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
      </linearGradient>
    `
    svg.appendChild(defs)
    
    // Draw area
    const revenuePoints = chartData.map((d, i) => `${xPos(i)},${yPos(d.revenue)}`)
    const areaPath = `M${revenuePoints.join("L")}L${xPos(chartData.length - 1)},${H}L${xPos(0)},${H}Z`
    const area = document.createElementNS("http://www.w3.org/2000/svg", "path")
    area.setAttribute("d", areaPath)
    area.setAttribute("fill", "url(#revenueGradient)")
    svg.appendChild(area)
    
    // Draw revenue line
    const linePath = revenuePoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p}`).join(" ")
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path")
    line.setAttribute("d", linePath)
    line.setAttribute("fill", "none")
    line.setAttribute("stroke", "#6366f1")
    line.setAttribute("stroke-width", "2.5")
    line.setAttribute("stroke-linecap", "round")
    line.setAttribute("stroke-linejoin", "round")
    
    // Animate line drawing
    const totalLen = line.getTotalLength?.() || 800
    line.style.strokeDasharray = totalLen.toString()
    line.style.strokeDashoffset = totalLen.toString()
    line.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s"
    svg.appendChild(line)
    requestAnimationFrame(() => {
      line.style.strokeDashoffset = "0"
    })
    
    // Draw vertical cursor line
    const cursor = document.createElementNS("http://www.w3.org/2000/svg", "line")
    cursor.setAttribute("y1", (PAD.t - 10).toString())
    cursor.setAttribute("y2", H.toString())
    cursor.setAttribute("stroke", "#6366f1")
    cursor.setAttribute("stroke-width", "1.5")
    cursor.style.opacity = "0"
    cursor.style.transition = "opacity 0.15s"
    svg.appendChild(cursor)
    
    // Create hit zones and dots
    chartData.forEach((d, i) => {
      const cx = xPos(i)
      const cy = yPos(d.revenue)
      
      // Dot
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      dot.setAttribute("cx", cx.toString())
      dot.setAttribute("cy", cy.toString())
      dot.setAttribute("r", "3.5")
      dot.setAttribute("fill", "#ffffff")
      dot.setAttribute("stroke", "#6366f1")
      dot.setAttribute("stroke-width", "2")
      dot.style.opacity = "0"
      dot.style.transition = `opacity 0.2s ${0.3 + i * 0.05}s`
      svg.appendChild(dot)
      
      // Hit zone
      const segW = chartW / chartData.length
      const hitRect = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      hitRect.setAttribute("x", (cx - segW / 2).toString())
      hitRect.setAttribute("y", "0")
      hitRect.setAttribute("width", segW.toString())
      hitRect.setAttribute("height", H.toString())
      hitRect.setAttribute("fill", "transparent")
      hitRect.style.cursor = "crosshair"
      
      const prevRevenue = i > 0 ? chartData[i - 1].revenue : null
      const trend = prevRevenue ? ((d.revenue - prevRevenue) / prevRevenue) * 100 : null
      const vsTarget = ((d.revenue - d.target) / d.target) * 100
      
      hitRect.addEventListener("mouseenter", (e) => {
        dot.style.opacity = "1"
        cursor.setAttribute("x1", cx.toString())
        cursor.setAttribute("x2", cx.toString())
        cursor.style.opacity = "1"
        
        const svgRect = svg.getBoundingClientRect()
        const relX = cx / W * svgRect.width
        const relY = cy / H * svgRect.height
        
        setTooltip({
          visible: true,
          x: relX,
          y: relY,
          month: d.month,
          revenue: d.revenue,
          target: d.target,
          trend,
          vsTarget,
        })
      })
      
      hitRect.addEventListener("mouseleave", () => {
        dot.style.opacity = i === chartData.length - 1 ? "1" : "0"
        cursor.style.opacity = "0"
        setTooltip(prev => ({ ...prev, visible: false }))
      })
      
      svg.appendChild(hitRect)
      
      // Reveal last dot
      setTimeout(() => {
        dot.style.opacity = i === chartData.length - 1 ? "1" : "0"
      }, 300 + i * 50)
    })
    
  }, [chartData, period])

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-mono text-indigo-500 font-semibold tracking-wider uppercase mb-1">
            Revenue Overview
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-serif font-light tracking-tight text-gray-900">
              {formatCompactCurrency(metrics.totalRevenue)}
            </h3>
            <span className="text-sm text-gray-400">total</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-emerald-600 font-mono">
              ↑ {metrics.yoyGrowth.toFixed(1)}% YoY
            </span>
            <span className="text-xs text-gray-400 font-mono">
              avg {formatCompactCurrency(metrics.avgMonthly)}/mo
            </span>
          </div>
        </div>
        
        {/* Period Tabs */}
        <div className="flex gap-1 p-1 bg-gray-50 rounded-lg">
          {["3M", "6M", "1Y", "All"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`
                px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-all
                ${period === p 
                  ? "bg-white shadow-sm text-indigo-600" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                }
              `}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="flex flex-wrap gap-6 mb-6 pb-4 border-b border-gray-100">
        <div>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Best Month</div>
          <div className="text-lg font-serif font-light mt-0.5 text-gray-900">
            {formatCompactCurrency(metrics.maxRevenue)}
          </div>
          <div className="text-xs text-gray-400">{metrics.maxMonth}</div>
        </div>
        <div>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">vs Target</div>
          <div className="text-lg font-serif font-light mt-0.5 text-gray-900">
            {metrics.targetAchievement.toFixed(0)}%
          </div>
          <div className="text-xs text-gray-400">
            {metrics.gapToTarget > 0 ? `↓ ${formatCompactCurrency(metrics.gapToTarget)} gap` : "above target"}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <div className="h-[200px] mb-4">
          <svg
            ref={svgRef}
            viewBox="0 0 648 200"
            preserveAspectRatio="none"
            className="w-full h-full"
            style={{ overflow: "visible" }}
          />
        </div>
        
        {/* X-Axis Labels */}
        <div className="flex justify-between px-1 mb-2">
          {chartData.map((d, i) => (
            <span
              key={i}
              className="text-[10px] font-mono text-gray-400 text-center flex-1"
            >
              {d.month}
            </span>
          ))}
        </div>
        
        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="absolute rounded-xl px-4 py-3 min-w-[140px]
                       bg-white/95 backdrop-blur-md border border-gray-200
                       shadow-xl shadow-indigo-500/10 pointer-events-none
                       transition-opacity duration-150"
            style={{
              left: tooltip.x,
              top: tooltip.y - 80,
              transform: "translateX(-50%)",
              fontFamily: "'Geist', sans-serif",
            }}
          >
            <p className="text-xs font-mono text-indigo-600 font-semibold mb-1 tracking-wide">
              {tooltip.month}
            </p>
            <p className="text-2xl font-serif font-light tracking-tight text-gray-900">
              {formatCurrency(tooltip.revenue)}
            </p>
            <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
              {tooltip.trend !== null && (
                <p className={`text-xs font-mono flex items-center gap-1 ${tooltip.trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tooltip.trend >= 0 ? '↑' : '↓'} {Math.abs(tooltip.trend).toFixed(1)}% vs previous
                </p>
              )}
              <p className={`text-xs font-mono flex items-center gap-1 ${tooltip.vsTarget >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {tooltip.vsTarget >= 0 ? '✓' : '⚠'} {tooltip.vsTarget >= 0 ? '+' : ''}{tooltip.vsTarget.toFixed(1)}% vs target
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-xs text-gray-500 font-mono">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full border border-gray-300 bg-transparent" />
            <span className="text-xs text-gray-500 font-mono">Target</span>
          </div>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          Updated {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  )
      }
