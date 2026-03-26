import { useState, useEffect, useCallback } from 'react'
import { getSettings, updateSettings } from '../db/db'

const WMO_RAIN_CODES = new Set([
  51, 53, 55, 61, 63, 65, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99,
])

export function useWeather() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWeather = useCallback(async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&hourly=weather_code&forecast_days=2&timezone=auto`
      )
      const data = await res.json()
      const current = data.current
      const hours = data.hourly

      // Check next 24h for rain
      const now = new Date()
      const next24h = hours.time
        .map((t, i) => ({ t: new Date(t), code: hours.weather_code[i] }))
        .filter(({ t }) => t > now && t <= new Date(now.getTime() + 86400000))
      const rainExpected = next24h.some(({ code }) => WMO_RAIN_CODES.has(code))

      setWeather({
        temp: Math.round(current.temperature_2m),
        weatherCode: current.weather_code,
        rainExpected,
        lat,
        lon,
      })
      setError(null)
    } catch (e) {
      setError('Could not fetch weather')
    } finally {
      setLoading(false)
    }
  }, [])

  const init = useCallback(async () => {
    setLoading(true)
    const settings = await getSettings()
    if (settings?.lat && settings?.lon) {
      fetchWeather(settings.lat, settings.lon)
      return
    }
    // Try geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lon } = pos.coords
          await updateSettings({ lat, lon })
          fetchWeather(lat, lon)
        },
        async () => {
          // Fallback: Amsterdam
          const lat = 52.37, lon = 4.9
          await updateSettings({ lat, lon, locationName: 'Default (Amsterdam)' })
          fetchWeather(lat, lon)
        },
        { timeout: 5000 }
      )
    } else {
      const lat = 52.37, lon = 4.9
      fetchWeather(lat, lon)
    }
  }, [fetchWeather])

  useEffect(() => {
    init()
    const interval = setInterval(init, 3600000) // refresh every hour
    return () => clearInterval(interval)
  }, [init])

  return { weather, loading, error, refetch: init }
}

export function wmoToEmoji(code) {
  if (code === 0) return '☀️'
  if (code <= 2) return '⛅'
  if (code <= 3) return '☁️'
  if (code <= 48) return '🌫️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌦️'
  if (code <= 86) return '🌨️'
  return '⛈️'
}
