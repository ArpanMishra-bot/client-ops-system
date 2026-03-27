// This is the TopClients component only — update this section

async function TopClients() {
  const stats = await getDashboardStats()
  
  if (stats.topClients.length === 0) return null
  
  return (
    <div className="glass-card p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Clients by Revenue</h2>
      <div className="space-y-3">
        {stats.topClients.map((client) => (
          <div 
            key={client.id} 
            className="flex items-center justify-between p-2 rounded-xl transition-all duration-200 hover:bg-white/50 active:scale-95 active:shadow-[0_0_0_3px_rgba(99,102,241,0.4)] cursor-pointer"
            onClick={() => window.location.href = `/clients/${client.id}`}
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{client.name}</p>
              <p className="text-xs text-gray-500">${client.revenue.toLocaleString()}</p>
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${client.trend > 0 ? 'text-green-600' : client.trend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
              {client.trend > 0 && <TrendingUpIcon className="h-3 w-3" />}
              {client.trend < 0 && <TrendingDown className="h-3 w-3" />}
              <span>{client.trend > 0 ? '+' : ''}{client.trend}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
