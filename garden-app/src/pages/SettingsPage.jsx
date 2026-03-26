import { useState, useEffect } from 'react'
import { getSettings, updateSettings, exportAllData, importAllData } from '../db/db'

export default function SettingsPage({ toast }) {
  const [settings, setSettings] = useState(null)
  const [threshold, setThreshold] = useState(10)

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s)
      setThreshold(s?.temperatureThreshold ?? 10)
    })
  }, [])

  async function saveThreshold() {
    await updateSettings({ temperatureThreshold: Number(threshold) })
    toast('Settings saved! ✅')
  }

  async function handleExport() {
    const json = await exportAllData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `garden-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast('Data exported! 📦')
  }

  async function handleImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        await importAllData(ev.target.result)
        toast('Data imported successfully! 🌱')
        window.location.reload()
      } catch {
        toast('Import failed — check file format ❌')
      }
    }
    reader.readAsText(file)
  }

  async function clearLocation() {
    await updateSettings({ lat: null, lon: null, locationName: null })
    toast('Location cleared — will use geolocation next time 📍')
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green-800">⚙️ Settings</h1>

      <div className="card-base p-5 space-y-4">
        <h2 className="font-bold text-slate-700">🌡️ Temperature Alert</h2>
        <p className="text-sm text-slate-500">
          Show a warning banner when outside temperature drops below this threshold.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 w-24 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          <span className="text-slate-600">°C</span>
          <button
            onClick={saveThreshold}
            className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2 text-sm font-bold bouncy"
          >
            Save
          </button>
        </div>
      </div>

      <div className="card-base p-5 space-y-4">
        <h2 className="font-bold text-slate-700">📍 Location</h2>
        {settings?.lat && (
          <p className="text-sm text-slate-500">
            Current: {settings.locationName || `${settings.lat?.toFixed(2)}, ${settings.lon?.toFixed(2)}`}
          </p>
        )}
        <p className="text-sm text-slate-400">
          Location is used for weather data. You can set it manually from the dashboard weather bar.
        </p>
        <button
          onClick={clearLocation}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl px-4 py-2 text-sm bouncy"
        >
          🔄 Reset to Geolocation
        </button>
      </div>

      <div className="card-base p-5 space-y-4">
        <h2 className="font-bold text-slate-700">💾 Data Backup</h2>
        <p className="text-sm text-slate-500">
          Export all your garden data to a JSON file, or restore from a backup.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 text-sm font-bold bouncy"
          >
            📤 Export Backup
          </button>
          <label className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4 py-2 text-sm font-bold bouncy cursor-pointer">
            📥 Import Backup
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      <div className="card-base p-5">
        <h2 className="font-bold text-slate-700 mb-2">ℹ️ About</h2>
        <p className="text-sm text-slate-400">
          Garden Tracker — a cozy, offline-first garden companion. All data is stored locally in your browser. 🌿
        </p>
        <p className="text-xs text-slate-300 mt-2">Weather powered by Open-Meteo (no API key required)</p>
      </div>
    </div>
  )
}
