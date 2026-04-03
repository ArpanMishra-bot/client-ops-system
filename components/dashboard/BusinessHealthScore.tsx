"use client"

import { useState } from "react"

interface BusinessHealthScoreProps {
  score: number
  color: string
  bg: string
}

export default function BusinessHealthScore({ score, color, bg }: BusinessHealthScoreProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className={`${bg} rounded-xl p-4 text-center transition-all hover:scale-[1.02] duration-200 relative`}>
      <div className="flex items-center justify-center gap-1 mb-1">
        <p className="text-xs text-gray-500">Business Health</p>
        <button 
          onClick={() => setShowTooltip(!showTooltip)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-help"
          aria-label="How is score calculated?"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{score}</p>
      <p className="text-xs text-gray-400 mt-1">out of 100</p>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
        <div 
          className={`h-1.5 rounded-full transition-all duration-500 ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
          style={{ width: `${score}%` }}
        />
      </div>
      
      {showTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg w-64 text-center">
            Score = (Clients × 25%) + (Revenue × 25%) + (Pipeline × 25%) + (Tasks × 25%)
            <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}
