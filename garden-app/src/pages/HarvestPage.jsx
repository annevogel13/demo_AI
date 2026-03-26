import { useState, useEffect } from 'react'
import { db } from '../db/db'
import { formatDate } from '../utils/dateUtils'

export default function HarvestPage() {
  const [harvests, setHarvests] = useState([])
  const [batches, setBatches] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [h, b] = await Promise.all([
      db.harvestRecords.toArray(),
      db.seedBatches.toArray(),
    ])
    setHarvests(h.sort((a, b) => new Date(b.date) - new Date(a.date)))
    setBatches(b)
  }

  // Group by plant name
  const byPlant = harvests.reduce((acc, h) => {
    const name = h.plantName || 'Unknown'
    if (!acc[name]) acc[name] = []
    acc[name].push(h)
    return acc
  }, {})

  const totalWeight = harvests.reduce((s, h) => s + (h.weight || 0), 0)
  const totalQty = harvests.reduce((s, h) => s + (h.quantity || 0), 0)

  // Find personal best plant
  const bestPlant = Object.entries(byPlant).sort(
    ([, a], [, b]) =>
      b.reduce((s, x) => s + (x.weight || 0), 0) - a.reduce((s, x) => s + (x.weight || 0), 0)
  )[0]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green-800">🥬 Harvest Log</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard emoji="🏆" label="Total Harvests" value={harvests.length} />
        <StatCard emoji="⚖️" label="Total Weight" value={totalWeight ? `${totalWeight}g` : '—'} />
        <StatCard emoji="🔢" label="Total Quantity" value={totalQty || '—'} />
      </div>

      {bestPlant && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-3xl p-5 text-center bounce-in">
          <div className="text-4xl mb-2">🏆</div>
          <div className="font-bold text-amber-800 text-lg">Personal Best!</div>
          <div className="text-amber-700">
            {bestPlant[0]} —{' '}
            {bestPlant[1].reduce((s, x) => s + (x.weight || 0), 0)}g
            {bestPlant[1].reduce((s, x) => s + (x.quantity || 0), 0) > 0 &&
              ` / ${bestPlant[1].reduce((s, x) => s + (x.quantity || 0), 0)} pcs`}
          </div>
          <div className="text-xs text-amber-500 mt-1">Keep growing! 🌟</div>
        </div>
      )}

      {/* By plant */}
      {Object.entries(byPlant).map(([plant, records]) => {
        const totalW = records.reduce((s, h) => s + (h.weight || 0), 0)
        const totalQ = records.reduce((s, h) => s + (h.quantity || 0), 0)
        return (
          <div key={plant} className="card-base p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800">{plant}</h3>
              <div className="text-sm text-slate-500">
                {totalW > 0 && `${totalW}g`}
                {totalW > 0 && totalQ > 0 && ' · '}
                {totalQ > 0 && `${totalQ} pcs`}
              </div>
            </div>
            {records.map((h) => (
              <div key={h.id} className="flex items-start gap-3 text-sm border-t border-slate-50 pt-2">
                <span className="text-slate-400 text-xs mt-0.5 whitespace-nowrap">{formatDate(h.date)}</span>
                <div className="text-slate-600">
                  {h.quantity && <span className="font-medium">{h.quantity} pcs </span>}
                  {h.weight && <span className="font-medium">{h.weight}g </span>}
                  {h.notes && <span className="text-slate-400">— {h.notes}</span>}
                </div>
              </div>
            ))}
          </div>
        )
      })}

      {harvests.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-6xl mb-4">🌱</div>
          <p className="text-slate-500">No harvests yet. Keep growing! 🌿</p>
        </div>
      )}
    </div>
  )
}

function StatCard({ emoji, label, value }) {
  return (
    <div className="card-base p-4 text-center">
      <div className="text-3xl mb-1">{emoji}</div>
      <div className="font-bold text-slate-700 text-lg">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  )
}
