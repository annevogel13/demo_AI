import { useState, useEffect } from 'react'
import { db, currentSeason } from '../db/db'
import { formatDate } from '../utils/dateUtils'

export default function SeasonSummary() {
  const [harvests, setHarvests] = useState([])
  const [batches, setBatches] = useState([])
  const [streak, setStreak] = useState(null)
  const season = currentSeason()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [h, b, s] = await Promise.all([
      db.harvestRecords.toArray(),
      db.seedBatches.toArray(),
      db.careStreak.toCollection().first(),
    ])
    setHarvests(h.filter((x) => x.season === season))
    setBatches(b)
    setStreak(s)
  }

  const byPlant = harvests.reduce((acc, h) => {
    const name = h.plantName || 'Unknown'
    if (!acc[name]) acc[name] = { weight: 0, qty: 0, count: 0 }
    acc[name].weight += h.weight || 0
    acc[name].qty += h.quantity || 0
    acc[name].count += 1
    return acc
  }, {})

  const sortedPlants = Object.entries(byPlant).sort(([, a], [, b]) => b.weight - a.weight)
  const totalWeight = harvests.reduce((s, h) => s + (h.weight || 0), 0)
  const totalQty = harvests.reduce((s, h) => s + (h.quantity || 0), 0)
  const activeBatches = batches.filter((b) => b.status !== 'harvested')

  const SEASON_BG = {
    Spring: 'from-green-50 to-emerald-50',
    Summer: 'from-yellow-50 to-amber-50',
    Autumn: 'from-orange-50 to-red-50',
    Winter: 'from-sky-50 to-blue-50',
  }
  const SEASON_EMOJI = { Spring: '🌸', Summer: '☀️', Autumn: '🍂', Winter: '❄️' }

  return (
    <div className="space-y-6">
      <div className={`bg-gradient-to-br ${SEASON_BG[season]} border-2 border-current/10 rounded-3xl p-6 text-center`}>
        <div className="text-5xl mb-2">{SEASON_EMOJI[season]}</div>
        <h1 className="text-2xl font-bold text-slate-800">{season} Summary</h1>
        <p className="text-slate-500 text-sm mt-1">Your garden season at a glance</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard emoji="🌱" label="Active Batches" value={activeBatches.length} color="bg-green-50 border-green-200" />
        <StatCard emoji="🥬" label="Harvests" value={harvests.length} color="bg-emerald-50 border-emerald-200" />
        <StatCard emoji="⚖️" label="Total Yield" value={totalWeight > 0 ? `${totalWeight}g` : '—'} color="bg-amber-50 border-amber-200" />
        <StatCard emoji="🔥" label="Best Streak" value={`${streak?.longestStreak || 0}d`} color="bg-orange-50 border-orange-200" />
      </div>

      {sortedPlants.length > 0 && (
        <div className="card-base p-5 space-y-3">
          <h2 className="font-bold text-slate-800 text-lg">🏆 Plant Rankings</h2>
          {sortedPlants.map(([name, data], i) => (
            <div key={name} className="flex items-center gap-3">
              <span className="text-2xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🌱'}</span>
              <div className="flex-1">
                <div className="font-medium text-slate-700">{name}</div>
                <div className="text-xs text-slate-400">
                  {data.count} harvest{data.count !== 1 ? 's' : ''}
                  {data.weight > 0 && ` · ${data.weight}g`}
                  {data.qty > 0 && ` · ${data.qty} pcs`}
                </div>
              </div>
              {i === 0 && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                  ⭐ Best!
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {harvests.length === 0 && activeBatches.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <div className="text-6xl mb-4">🌱</div>
          <p>Your {season} garden story is just beginning!</p>
        </div>
      )}

      {harvests.length === 0 && activeBatches.length > 0 && (
        <div className="text-center py-8 bg-green-50 rounded-3xl border border-green-200">
          <div className="text-5xl mb-3">🌿</div>
          <p className="font-bold text-green-700">Growing in progress!</p>
          <p className="text-sm text-green-600 mt-1">{activeBatches.length} batch{activeBatches.length !== 1 ? 'es' : ''} working hard this {season}.</p>
        </div>
      )}

      {streak && streak.longestStreak >= 7 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-3xl p-5 text-center bounce-in">
          <div className="text-4xl mb-2">🔥</div>
          <div className="font-bold text-orange-800">Streak Champion!</div>
          <div className="text-orange-600 text-sm">
            Best streak: {streak.longestStreak} days of continuous care
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ emoji, label, value, color }) {
  return (
    <div className={`rounded-2xl border p-4 text-center ${color}`}>
      <div className="text-3xl mb-1">{emoji}</div>
      <div className="font-bold text-slate-700 text-lg">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  )
}
