import { useState } from 'react'
import { db, recordCare } from '../db/db'
import { daysSince, expectedHarvestDate, formatDate, isDueForWatering, daysUntilHarvest } from '../utils/dateUtils'
import { LOCATIONS, LOCATION_KEYS, STATUSES } from '../utils/constants'
import StatusBadge from './StatusBadge'

export default function BatchCard({ batch, rainExpected, onUpdate, onSelect, toast }) {
  const [moving, setMoving] = useState(false)
  const loc = LOCATIONS[batch.location] || LOCATIONS.lamp
  const age = daysSince(batch.sowingDate)
  const due = isDueForWatering(batch.lastWatered, batch.wateringInterval)
  const outdoor = ['greenhouse', 'outside'].includes(batch.location)
  const suppressWater = outdoor && rainExpected
  const daysLeft = daysUntilHarvest(batch.sowingDate, batch.daysToMaturity)

  async function handleWater() {
    const now = new Date().toISOString()
    await db.seedBatches.update(batch.id, { lastWatered: now })
    await db.wateringLogs.add({ batchId: batch.id, timestamp: now, notes: '' })
    await recordCare()
    toast(`Your ${batch.plantName} got a drink! 💧`)
    onUpdate()
  }

  async function handleStatusChange(e) {
    const newStatus = e.target.value
    await db.seedBatches.update(batch.id, { status: newStatus })
    const s = STATUSES.find((x) => x.key === newStatus)
    toast(`${batch.plantName} is now ${s?.label}! ${s?.emoji}`)
    onUpdate()
  }

  async function handleMove(newLoc) {
    await db.moveHistory.add({
      batchId: batch.id,
      fromLocation: batch.location,
      toLocation: newLoc,
      date: new Date().toISOString(),
      notes: '',
    })
    await db.seedBatches.update(batch.id, { location: newLoc })
    toast(`${batch.plantName} moved to ${LOCATIONS[newLoc].title}! 🚚`)
    setMoving(false)
    onUpdate()
  }

  return (
    <div
      className="card-base overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bounce-in"
      onClick={() => onSelect(batch)}
    >
      {/* Location color stripe */}
      <div className={`h-2 w-full ${loc.bg} border-b ${loc.border}`} />

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-bold text-slate-800 text-base leading-tight">
              {batch.plantName}
            </div>
            {batch.variety && (
              <div className="text-xs text-slate-500">{batch.variety}</div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 whitespace-nowrap">
              🗓️ {age}d old
            </span>
            <StatusBadge status={batch.status} />
          </div>
        </div>

        {/* Info row */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span>🪴 {batch.quantity} pot{batch.quantity !== 1 ? 's' : ''}</span>
          <span>📅 Sown {formatDate(batch.sowingDate)}</span>
          {daysLeft !== null && (
            <span className={daysLeft <= 7 ? 'text-orange-500 font-bold' : ''}>
              {daysLeft > 0 ? `🌾 ${daysLeft}d to harvest` : '🌾 Ready to harvest!'}
            </span>
          )}
        </div>

        {/* Watering */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {suppressWater ? (
            <div className="text-xs text-sky-600 bg-sky-50 border border-sky-200 rounded-xl px-3 py-1.5 flex items-center gap-1 w-full">
              🌧️ Rain coming — skip watering
            </div>
          ) : (
            <button
              onClick={handleWater}
              className={`flex-1 text-xs font-bold rounded-xl py-1.5 px-3 bouncy transition-colors ${
                due
                  ? 'bg-blue-500 text-white watering-due shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50'
              }`}
            >
              {due ? '💧 Water Now!' : '💧 Water'}
            </button>
          )}

          <select
            value={batch.status}
            onChange={handleStatusChange}
            className="text-xs border border-slate-200 rounded-xl px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-green-300"
          >
            {STATUSES.map((s) => (
              <option key={s.key} value={s.key}>{s.emoji} {s.label}</option>
            ))}
          </select>
        </div>

        {/* Move button */}
        <div onClick={(e) => e.stopPropagation()}>
          {moving ? (
            <div className="flex flex-wrap gap-1 slide-up">
              <span className="text-xs text-slate-500 w-full mb-1">Move to:</span>
              {LOCATION_KEYS.filter((k) => k !== batch.location).map((k) => (
                <button
                  key={k}
                  onClick={() => handleMove(k)}
                  className={`text-xs px-2 py-1 rounded-xl border bouncy ${LOCATIONS[k].badge} ${LOCATIONS[k].border}`}
                >
                  {LOCATIONS[k].emoji} {LOCATIONS[k].label}
                </button>
              ))}
              <button onClick={() => setMoving(false)} className="text-xs text-slate-400 hover:text-slate-600 px-2">Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => setMoving(true)}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              {loc.emoji} {loc.title} · <span className="underline">move</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
