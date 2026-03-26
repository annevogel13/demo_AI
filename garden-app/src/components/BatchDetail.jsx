import { useState, useEffect, useRef } from 'react'
import { db, recordCare } from '../db/db'
import { daysSince, formatDate, formatDateTime, isDueForWatering, expectedHarvestDate } from '../utils/dateUtils'
import { LOCATIONS, STATUSES } from '../utils/constants'
import StatusBadge from './StatusBadge'

export default function BatchDetail({ batch, onClose, onUpdate, toast }) {
  const [tab, setTab] = useState('info')
  const [journal, setJournal] = useState([])
  const [harvests, setHarvests] = useState([])
  const [waterLogs, setWaterLogs] = useState([])
  const [moveHistory, setMoveHistory] = useState([])
  const [journalNote, setJournalNote] = useState('')
  const [journalPhoto, setJournalPhoto] = useState(null)
  const [harvestForm, setHarvestForm] = useState({ date: new Date().toISOString().slice(0, 10), weight: '', quantity: '', notes: '' })
  const fileRef = useRef()

  useEffect(() => {
    loadData()
  }, [batch.id])

  async function loadData() {
    const [j, h, w, m] = await Promise.all([
      db.journalEntries.where('batchId').equals(batch.id).toArray(),
      db.harvestRecords.where('batchId').equals(batch.id).toArray(),
      db.wateringLogs.where('batchId').equals(batch.id).toArray(),
      db.moveHistory.where('batchId').equals(batch.id).toArray(),
    ])
    setJournal(j.sort((a, b) => new Date(b.date) - new Date(a.date)))
    setHarvests(h.sort((a, b) => new Date(b.date) - new Date(a.date)))
    setWaterLogs(w.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
    setMoveHistory(m.sort((a, b) => new Date(b.date) - new Date(a.date)))
  }

  async function addJournal() {
    if (!journalNote.trim()) return
    await db.journalEntries.add({
      batchId: batch.id,
      date: new Date().toISOString(),
      note: journalNote.trim(),
      photo: journalPhoto,
    })
    await recordCare()
    setJournalNote('')
    setJournalPhoto(null)
    toast('Journal entry added! 📝')
    loadData()
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setJournalPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  async function addHarvest() {
    if (!harvestForm.quantity && !harvestForm.weight) return
    await db.harvestRecords.add({
      batchId: batch.id,
      plantName: batch.plantName,
      ...harvestForm,
      quantity: Number(harvestForm.quantity) || null,
      weight: Number(harvestForm.weight) || null,
      season: currentSeason(),
    })
    toast(`Harvest logged for ${batch.plantName}! 🥬`)
    setHarvestForm({ date: new Date().toISOString().slice(0, 10), weight: '', quantity: '', notes: '' })
    loadData()
    onUpdate()
  }

  const loc = LOCATIONS[batch.location] || LOCATIONS.lamp
  const age = daysSince(batch.sowingDate)
  const harvestDate = expectedHarvestDate(batch.sowingDate, batch.daysToMaturity)

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-4 overflow-hidden slide-up">
        {/* Header */}
        <div className={`${loc.bg} border-b ${loc.border} px-5 py-4 flex items-center justify-between`}>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{loc.emoji} {batch.plantName}</h2>
            {batch.variety && <p className="text-sm text-slate-500">{batch.variety}</p>}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {['info', 'journal', 'harvest', 'history'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                tab === t ? 'text-green-600 border-b-2 border-green-500' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t === 'info' ? '📋 Info' : t === 'journal' ? '📖 Journal' : t === 'harvest' ? '🥬 Harvest' : '📜 History'}
            </button>
          ))}
        </div>

        <div className="p-5 max-h-96 overflow-y-auto">
          {tab === 'info' && (
            <div className="space-y-3">
              <InfoRow label="Status"><StatusBadge status={batch.status} /></InfoRow>
              <InfoRow label="Age">{age} days since sown</InfoRow>
              <InfoRow label="Sown on">{formatDate(batch.sowingDate)}</InfoRow>
              <InfoRow label="Expected harvest">
                {harvestDate ? formatDate(harvestDate.toISOString()) : '—'}
              </InfoRow>
              <InfoRow label="Pots/Quantity">{batch.quantity}</InfoRow>
              <InfoRow label="Water every">{batch.wateringInterval} day{batch.wateringInterval !== 1 ? 's' : ''}</InfoRow>
              <InfoRow label="Last watered">{formatDateTime(batch.lastWatered)}</InfoRow>
              {batch.notes && <InfoRow label="Notes"><span className="text-slate-600">{batch.notes}</span></InfoRow>}
              <InfoRow label="Watering logs">{waterLogs.length} events</InfoRow>
              {waterLogs.slice(0, 3).map((w) => (
                <div key={w.id} className="text-xs text-slate-400 ml-4">• {formatDateTime(w.timestamp)}</div>
              ))}
            </div>
          )}

          {tab === 'journal' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <textarea
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  placeholder="How's your plant doing today? 🌿"
                  className="w-full border border-slate-200 rounded-2xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => fileRef.current.click()}
                    className="text-xs bg-slate-100 hover:bg-slate-200 rounded-xl px-3 py-2 bouncy"
                  >
                    📷 {journalPhoto ? 'Change Photo' : 'Add Photo'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  <button
                    onClick={addJournal}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl px-3 py-2 bouncy"
                  >
                    Save Entry
                  </button>
                </div>
                {journalPhoto && (
                  <img src={journalPhoto} alt="preview" className="w-full h-32 object-cover rounded-2xl" />
                )}
              </div>

              <div className="space-y-3">
                {journal.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-6">No journal entries yet. Start writing! ✍️</p>
                )}
                {journal.map((e) => (
                  <div key={e.id} className="border border-slate-100 rounded-2xl p-3 space-y-2">
                    <div className="text-xs text-slate-400">{formatDateTime(e.date)}</div>
                    <p className="text-sm text-slate-700">{e.note}</p>
                    {e.photo && (
                      <img src={e.photo} alt="journal" className="w-full max-h-48 object-cover rounded-xl" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'harvest' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-700">Log a Harvest</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-500">Date</label>
                    <input type="date" value={harvestForm.date}
                      onChange={(e) => setHarvestForm((f) => ({ ...f, date: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-300" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Quantity</label>
                    <input type="number" value={harvestForm.quantity} placeholder="e.g. 12"
                      onChange={(e) => setHarvestForm((f) => ({ ...f, quantity: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-300" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Weight (g)</label>
                    <input type="number" value={harvestForm.weight} placeholder="e.g. 250"
                      onChange={(e) => setHarvestForm((f) => ({ ...f, weight: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-300" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Notes</label>
                    <input value={harvestForm.notes} placeholder="Optional…"
                      onChange={(e) => setHarvestForm((f) => ({ ...f, notes: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-300" />
                  </div>
                </div>
                <button onClick={addHarvest}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl py-2 bouncy">
                  🥬 Log Harvest
                </button>
              </div>

              <div className="space-y-2">
                {harvests.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-4">No harvests yet! 🌱</p>
                )}
                {harvests.map((h) => (
                  <div key={h.id} className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-sm">
                    <div className="font-medium text-emerald-800">{formatDate(h.date)}</div>
                    <div className="text-slate-600 text-xs">
                      {h.quantity && `${h.quantity} pcs`}
                      {h.quantity && h.weight && ' · '}
                      {h.weight && `${h.weight}g`}
                      {h.notes && ` · ${h.notes}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'history' && (
            <div className="space-y-2">
              {moveHistory.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-6">No moves recorded yet.</p>
              )}
              {moveHistory.map((m) => (
                <div key={m.id} className="flex items-center gap-2 text-sm border border-slate-100 rounded-2xl p-3">
                  <span className="text-lg">{LOCATIONS[m.fromLocation]?.emoji}</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-lg">{LOCATIONS[m.toLocation]?.emoji}</span>
                  <div className="ml-2">
                    <div className="font-medium text-slate-700">
                      {LOCATIONS[m.fromLocation]?.label} → {LOCATIONS[m.toLocation]?.label}
                    </div>
                    <div className="text-xs text-slate-400">{formatDateTime(m.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-700 text-right">{children}</span>
    </div>
  )
}

function currentSeason() {
  const m = new Date().getMonth() + 1
  if (m >= 3 && m <= 5) return 'Spring'
  if (m >= 6 && m <= 8) return 'Summer'
  if (m >= 9 && m <= 11) return 'Autumn'
  return 'Winter'
}
