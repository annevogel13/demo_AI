import { useState } from 'react'
import { db } from '../db/db'
import { LOCATION_KEYS, LOCATIONS } from '../utils/constants'

export default function AddBatchModal({ onClose, onAdded }) {
  const [form, setForm] = useState({
    plantName: '',
    variety: '',
    sowingDate: new Date().toISOString().slice(0, 10),
    location: 'lamp',
    quantity: 1,
    daysToMaturity: 60,
    wateringInterval: 2,
    notes: '',
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    await db.seedBatches.add({
      ...form,
      quantity: Number(form.quantity),
      daysToMaturity: Number(form.daysToMaturity),
      wateringInterval: Number(form.wateringInterval),
      status: 'seeded',
      lastWatered: null,
      createdAt: new Date().toISOString(),
    })
    onAdded()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-green-800">🌱 New Seed Batch</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Row label="Plant Name *">
            <input required value={form.plantName} onChange={(e) => set('plantName', e.target.value)}
              className="input-field" placeholder="e.g. Tomato" />
          </Row>
          <Row label="Variety">
            <input value={form.variety} onChange={(e) => set('variety', e.target.value)}
              className="input-field" placeholder="e.g. Cherry Roma" />
          </Row>
          <Row label="Sowing Date *">
            <input required type="date" value={form.sowingDate} onChange={(e) => set('sowingDate', e.target.value)}
              className="input-field" />
          </Row>
          <Row label="Location *">
            <select value={form.location} onChange={(e) => set('location', e.target.value)} className="input-field">
              {LOCATION_KEYS.map((k) => (
                <option key={k} value={k}>{LOCATIONS[k].emoji} {LOCATIONS[k].title}</option>
              ))}
            </select>
          </Row>
          <div className="grid grid-cols-3 gap-3">
            <Row label="Pots/Qty">
              <input type="number" min="1" value={form.quantity} onChange={(e) => set('quantity', e.target.value)}
                className="input-field" />
            </Row>
            <Row label="Days to Maturity">
              <input type="number" min="1" value={form.daysToMaturity} onChange={(e) => set('daysToMaturity', e.target.value)}
                className="input-field" />
            </Row>
            <Row label="Water Every (days)">
              <input type="number" min="1" value={form.wateringInterval} onChange={(e) => set('wateringInterval', e.target.value)}
                className="input-field" />
            </Row>
          </div>
          <Row label="Notes">
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
              className="input-field resize-none" rows={2} placeholder="Optional notes…" />
          </Row>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl py-3 font-medium bouncy">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-2xl py-3 font-bold bouncy shadow-md">
              🌱 Plant It!
            </button>
          </div>
        </form>
      </div>
      <style>{`.input-field { width: 100%; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; outline: none; } .input-field:focus { ring: 2px solid #86efac; border-color: #86efac; }`}</style>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  )
}
