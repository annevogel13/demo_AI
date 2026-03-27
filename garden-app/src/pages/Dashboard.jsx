import { useState, useEffect } from 'react'
import { db, recordCare, updateBatch, notifyChanged } from '../db/db'
import { LOCATIONS, LOCATION_KEYS } from '../utils/constants'
import { isDueForWatering } from '../utils/dateUtils'
import BatchCard from '../components/BatchCard'
import BatchDetail from '../components/BatchDetail'
import WeatherBar from '../components/WeatherBar'
import StreakBadge from '../components/StreakBadge'
import AddBatchModal from '../components/AddBatchModal'
import { useWeather } from '../hooks/useWeather'

export default function Dashboard({ toast, streak, onStreakUpdate, settings }) {
  const [batches, setBatches] = useState([])
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const { weather } = useWeather()
  const rainExpected = weather?.rainExpected ?? false
  const threshold = settings?.temperatureThreshold ?? 10

  useEffect(() => {
    loadBatches()
  }, [])

  async function loadBatches() {
    const all = await db.seedBatches.toArray()
    setBatches(all.filter((b) => b.status !== 'harvested'))
  }

  async function waterAll() {
    const now = new Date().toISOString()
    const due = batches.filter((b) => {
      const outdoor = ['greenhouse', 'outside'].includes(b.location)
      if (outdoor && rainExpected) return false
      return isDueForWatering(b.lastWatered, b.wateringInterval)
    })
    if (due.length === 0) {
      toast('All plants are hydrated! 🌿')
      return
    }
    await Promise.all(
      due.map(async (b) => {
        await updateBatch(b.id, { lastWatered: now })
        await db.wateringLogs.add({ batchId: b.id, timestamp: now, notes: 'bulk' })
      })
    )
    await recordCare()
    notifyChanged()
    toast(`Watered ${due.length} plant${due.length !== 1 ? 's' : ''}! 💧`)
    onStreakUpdate()
    loadBatches()
  }

  const grouped = LOCATION_KEYS.reduce((acc, k) => {
    acc[k] = batches.filter((b) => b.location === k)
    return acc
  }, {})

  const totalDue = batches.filter((b) => {
    const outdoor = ['greenhouse', 'outside'].includes(b.location)
    if (outdoor && rainExpected) return false
    return isDueForWatering(b.lastWatered, b.wateringInterval)
  }).length

  const ZONE_STYLES = {
    lamp: 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200',
    turtle: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
    greenhouse: 'bg-gradient-to-br from-sky-50 to-cyan-50 border-sky-200',
    outside: 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200',
  }

  return (
    <div className="space-y-4">
      {/* Weather */}
      <WeatherBar threshold={threshold} />

      {/* Streak */}
      {streak && <StreakBadge streak={streak} />}

      {/* Actions bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setShowAdd(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-2xl shadow-md bouncy flex items-center gap-2"
        >
          🌱 New Batch
        </button>
        <button
          onClick={waterAll}
          className={`font-bold px-5 py-2.5 rounded-2xl bouncy flex items-center gap-2 ${
            totalDue > 0
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md watering-due'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
        >
          💧 Water All {totalDue > 0 && <span className="bg-white/30 text-white text-xs px-2 py-0.5 rounded-full">{totalDue}</span>}
        </button>
        <div className="ml-auto text-sm text-slate-400">
          {batches.length} active batch{batches.length !== 1 ? 'es' : ''}
        </div>
      </div>

      {/* Location Zones */}
      {LOCATION_KEYS.map((locKey) => {
        const locData = LOCATIONS[locKey]
        const locBatches = grouped[locKey]
        const outdoor = ['greenhouse', 'outside'].includes(locKey)
        return (
          <div key={locKey} className={`rounded-3xl border-2 p-4 ${ZONE_STYLES[locKey]}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{locData.emoji}</span>
              <h2 className="font-bold text-slate-700 text-lg">{locData.title}</h2>
              {outdoor && rainExpected && (
                <span className="ml-auto text-xs bg-sky-100 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full">
                  🌧️ Rain expected
                </span>
              )}
              <span className="ml-auto text-xs text-slate-400">{locBatches.length} batch{locBatches.length !== 1 ? 'es' : ''}</span>
            </div>

            {locBatches.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm">
                <div className="text-3xl mb-1">🪴</div>
                Nothing here yet! Add a batch to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {locBatches.map((b) => (
                  <BatchCard
                    key={b.id}
                    batch={b}
                    rainExpected={rainExpected}
                    onUpdate={loadBatches}
                    onSelect={setSelected}
                    toast={toast}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}

      {batches.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-bold text-slate-600 mb-2">Your garden is empty!</h3>
          <p className="text-sm">Start by adding your first seed batch.</p>
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <AddBatchModal
          onClose={() => setShowAdd(false)}
          onAdded={() => { loadBatches(); onStreakUpdate() }}
        />
      )}
      {selected && (
        <BatchDetail
          batch={selected}
          onClose={() => setSelected(null)}
          onUpdate={loadBatches}
          toast={toast}
        />
      )}
    </div>
  )
}
