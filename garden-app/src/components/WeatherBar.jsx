import { useWeather, wmoToEmoji } from '../hooks/useWeather'
import { getSettings, updateSettings } from '../db/db'
import { useState, useEffect } from 'react'

export default function WeatherBar({ threshold }) {
  const { weather, loading } = useWeather()
  const [manualLat, setManualLat] = useState('')
  const [manualLon, setManualLon] = useState('')
  const [showManual, setShowManual] = useState(false)

  if (loading) {
    return (
      <div className="bg-sky-50 border border-sky-200 rounded-2xl px-4 py-3 flex items-center gap-3 text-sky-600 text-sm animate-pulse">
        🌍 Loading weather…
      </div>
    )
  }

  if (!weather) return null

  const cold = weather.temp <= threshold

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    const lat = parseFloat(manualLat)
    const lon = parseFloat(manualLon)
    if (isNaN(lat) || isNaN(lon)) return
    await updateSettings({ lat, lon })
    window.location.reload()
  }

  return (
    <div className="space-y-2">
      <div className="bg-white border border-sky-200 rounded-2xl px-4 py-3 flex flex-wrap items-center gap-3 shadow-sm">
        <span className="text-2xl">{wmoToEmoji(weather.weatherCode)}</span>
        <div>
          <span className="font-bold text-xl text-slate-700">{weather.temp}°C</span>
          <span className="text-slate-400 text-sm ml-2">outside right now</span>
        </div>
        {weather.rainExpected && (
          <span className="ml-auto bg-sky-100 text-sky-700 text-xs font-bold px-3 py-1 rounded-full border border-sky-200">
            🌧️ Rain expected in 24h
          </span>
        )}
        <button
          onClick={() => setShowManual(!showManual)}
          className="ml-auto text-xs text-slate-400 hover:text-slate-600 underline"
        >
          📍 Set location
        </button>
      </div>

      {cold && (
        <div className="bg-blue-50 border border-blue-300 rounded-2xl px-4 py-3 text-blue-800 font-medium text-sm flex items-center gap-2 bounce-in">
          🥶 It's getting cold! Move your greenhouse seedlings inside!
        </div>
      )}

      {showManual && (
        <form
          onSubmit={handleManualSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-2 items-end slide-up"
        >
          <div>
            <label className="block text-xs text-slate-500 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              placeholder="52.37"
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={manualLon}
              onChange={(e) => setManualLon(e.target.value)}
              placeholder="4.90"
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2 text-sm font-bold bouncy"
          >
            Save
          </button>
        </form>
      )}
    </div>
  )
}
