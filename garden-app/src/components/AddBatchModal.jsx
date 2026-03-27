import { useState, useRef, useEffect } from 'react'
import { db, notifyChanged } from '../db/db'
import { LOCATION_KEYS, LOCATIONS } from '../utils/constants'
import { searchPlants, findPlant } from '../utils/plantDatabase'
import { expectedHarvestDate } from '../utils/dateUtils'

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
  const [suggestions, setSuggestions] = useState([])
  const [matchedPlant, setMatchedPlant] = useState(null)   // info card
  const [varietySuggestions, setVarietySuggestions] = useState([])
  const [showVarieties, setShowVarieties] = useState(false)
  const [userEditedDays, setUserEditedDays] = useState(false)
  const nameInputRef = useRef()
  const suggestionsRef = useRef()

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  // Close suggestion dropdown when clicking outside
  useEffect(() => {
    function handler(e) {
      if (!suggestionsRef.current?.contains(e.target) && e.target !== nameInputRef.current) {
        setSuggestions([])
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleNameChange(e) {
    const val = e.target.value
    set('plantName', val)
    setSuggestions(searchPlants(val))

    // If user clears the name, clear matched plant info
    if (!val.trim()) {
      setMatchedPlant(null)
      setVarietySuggestions([])
      setUserEditedDays(false)
    }

    // If the typed name exactly matches a DB entry, apply it silently
    const exact = findPlant(val)
    if (exact) applyPlant(exact, { silent: true })
  }

  function applyPlant(plant, { silent = false } = {}) {
    setMatchedPlant(plant)
    setVarietySuggestions(plant.varieties ?? [])
    setSuggestions([])

    setForm((f) => ({
      ...f,
      plantName: plant.name,
      // Only overwrite days/watering if the user hasn't manually changed them
      daysToMaturity: userEditedDays ? f.daysToMaturity : plant.daysToMaturity,
      wateringInterval: userEditedDays ? f.wateringInterval : plant.wateringInterval,
    }))
  }

  function handleDaysChange(e) {
    setUserEditedDays(true)
    set('daysToMaturity', e.target.value)
  }

  function handleWaterChange(e) {
    setUserEditedDays(true)
    set('wateringInterval', e.target.value)
  }

  const harvestDate = expectedHarvestDate(form.sowingDate, form.daysToMaturity)

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
      updatedAt: new Date().toISOString(),
    })
    notifyChanged()
    onAdded()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md my-4 slide-up">
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-xl font-bold text-green-800">🌱 New Seed Batch</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-4">
          {/* ── Plant name with autocomplete ─────────────── */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Plant Name *</label>
            <input
              ref={nameInputRef}
              required
              autoComplete="off"
              value={form.plantName}
              onChange={handleNameChange}
              onFocus={() => setSuggestions(searchPlants(form.plantName))}
              className="input-field"
              placeholder="Type to search… e.g. Tomato"
            />
            {/* Dropdown */}
            {suggestions.length > 0 && (
              <ul
                ref={suggestionsRef}
                className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-green-200 rounded-2xl shadow-xl overflow-hidden"
              >
                {suggestions.map((p) => (
                  <li key={p.name}>
                    <button
                      type="button"
                      onMouseDown={() => applyPlant(p)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 text-left transition-colors"
                    >
                      <span className="text-xl">{p.emoji}</span>
                      <div>
                        <div className="font-medium text-slate-800 text-sm">{p.name}</div>
                        <div className="text-xs text-slate-400">{p.daysRange} days · water every {p.wateringInterval}d · {p.sun}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Plant info card ───────────────────────────── */}
          {matchedPlant && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-2 bounce-in">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{matchedPlant.emoji}</span>
                <div>
                  <div className="font-bold text-green-800 text-sm">{matchedPlant.name}</div>
                  <div className="text-xs text-green-600">☀️ {matchedPlant.sun} · 🌾 {matchedPlant.daysRange} days to harvest</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{matchedPlant.description}</p>
            </div>
          )}

          {/* ── Variety with suggestions ─────────────────── */}
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Variety</label>
            <input
              value={form.variety}
              onChange={(e) => set('variety', e.target.value)}
              onFocus={() => varietySuggestions.length > 0 && setShowVarieties(true)}
              onBlur={() => setTimeout(() => setShowVarieties(false), 150)}
              className="input-field"
              placeholder={matchedPlant ? `e.g. ${matchedPlant.varieties?.[0] ?? ''}` : 'e.g. Cherry Roma'}
            />
            {showVarieties && varietySuggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-green-200 rounded-2xl shadow-xl p-2 flex flex-wrap gap-1.5">
                {varietySuggestions.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onMouseDown={() => { set('variety', v); setShowVarieties(false) }}
                    className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded-lg bouncy border border-green-200"
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Sowing date ───────────────────────────────── */}
          <Row label="Sowing Date *">
            <input required type="date" value={form.sowingDate}
              onChange={(e) => set('sowingDate', e.target.value)} className="input-field" />
          </Row>

          {/* ── Location ─────────────────────────────────── */}
          <Row label="Location *">
            <select value={form.location} onChange={(e) => set('location', e.target.value)} className="input-field">
              {LOCATION_KEYS.map((k) => (
                <option key={k} value={k}>{LOCATIONS[k].emoji} {LOCATIONS[k].title}</option>
              ))}
            </select>
          </Row>

          {/* ── Numeric fields ────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3">
            <Row label="Pots / Qty">
              <input type="number" min="1" value={form.quantity}
                onChange={(e) => set('quantity', e.target.value)} className="input-field" />
            </Row>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Days to Maturity
                {matchedPlant && !userEditedDays && (
                  <span className="ml-1 text-green-500 font-normal">✓ auto</span>
                )}
              </label>
              <input type="number" min="1" value={form.daysToMaturity}
                onChange={handleDaysChange} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Water Every
                {matchedPlant && !userEditedDays && (
                  <span className="ml-1 text-green-500 font-normal">✓ auto</span>
                )}
              </label>
              <input type="number" min="1" value={form.wateringInterval}
                onChange={handleWaterChange} className="input-field" />
            </div>
          </div>

          {/* ── Expected harvest preview ──────────────────── */}
          {harvestDate && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <span>🌾</span>
              <span>
                Expected harvest:{' '}
                <strong>
                  {harvestDate.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                </strong>
              </span>
            </div>
          )}

          {/* ── Notes ────────────────────────────────────── */}
          <Row label="Notes">
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
              className="input-field resize-none" rows={2} placeholder="Optional notes…" />
          </Row>

          {/* ── Actions ──────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl py-3 font-medium bouncy">
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-2xl py-3 font-bold bouncy shadow-md"
            >
              {matchedPlant ? `${matchedPlant.emoji} Plant It!` : '🌱 Plant It!'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          box-sizing: border-box;
          background: white;
        }
        .input-field:focus {
          border-color: #86efac;
          box-shadow: 0 0 0 2px #bbf7d0;
        }
      `}</style>
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
