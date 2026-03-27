import { useState, useEffect, useCallback } from 'react'
import { getSettings, getStreak } from './db/db'
import { useToast } from './hooks/useToast'
import { useSync } from './hooks/useSync'
import ToastContainer from './components/ToastContainer'
import Dashboard from './pages/Dashboard'
import HarvestPage from './pages/HarvestPage'
import SeasonSummary from './pages/SeasonSummary'
import SettingsPage from './pages/SettingsPage'

const TABS = [
  { key: 'dashboard', label: 'Garden', emoji: '🌱' },
  { key: 'harvest', label: 'Harvests', emoji: '🥬' },
  { key: 'season', label: 'Season', emoji: '🏆' },
  { key: 'settings', label: 'Settings', emoji: '⚙️' },
]

const SYNC_DOT = {
  connected:    'bg-green-400',
  connecting:   'bg-yellow-400 animate-pulse',
  disconnected: 'bg-red-400',
}
const SYNC_LABEL = {
  connected:    'Synced',
  connecting:   'Connecting…',
  disconnected: 'Offline',
}

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [settings, setSettings] = useState(null)
  const [streak, setStreak] = useState(null)
  const { toasts, addToast } = useToast()

  const loadGlobalData = useCallback(async () => {
    const [s, str] = await Promise.all([getSettings(), getStreak()])
    setSettings(s)
    setStreak(str)
  }, [])

  // Called whenever a remote sync merge completes — refresh everything
  const handleMerged = useCallback(() => {
    loadGlobalData()
    // Force Dashboard to reload its batches by bumping a key
    setRefreshKey((k) => k + 1)
  }, [loadGlobalData])

  const [refreshKey, setRefreshKey] = useState(0)
  const { status: syncStatus } = useSync(handleMerged)

  useEffect(() => {
    loadGlobalData()
  }, [loadGlobalData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Top nav */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-bold text-green-800 text-lg tracking-tight">Garden Tracker</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak */}
            {streak?.currentStreak > 0 && (
              <span className="flex items-center gap-1 text-xs font-medium text-orange-500">
                <span className="flame">🔥</span>
                {streak.currentStreak}d
              </span>
            )}
            {/* Sync indicator */}
            <span
              title={SYNC_LABEL[syncStatus]}
              className="flex items-center gap-1.5 text-xs text-slate-400"
            >
              <span className={`w-2 h-2 rounded-full inline-block ${SYNC_DOT[syncStatus]}`} />
              {SYNC_LABEL[syncStatus]}
            </span>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-2xl mx-auto px-4 py-5 pb-28">
        {tab === 'dashboard' && (
          <Dashboard
            key={refreshKey}
            toast={addToast}
            streak={streak}
            onStreakUpdate={loadGlobalData}
            settings={settings}
          />
        )}
        {tab === 'harvest' && <HarvestPage key={refreshKey} />}
        {tab === 'season' && <SeasonSummary key={refreshKey} />}
        {tab === 'settings' && <SettingsPage toast={addToast} />}
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-t border-green-100 shadow-lg">
        <div className="max-w-2xl mx-auto flex">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors bouncy ${
                tab === t.key
                  ? 'text-green-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className={`text-xl ${tab === t.key ? 'scale-110' : ''} transition-transform`}>
                {t.emoji}
              </span>
              <span className="text-xs font-medium">{t.label}</span>
              {tab === t.key && (
                <div className="w-4 h-0.5 bg-green-500 rounded-full mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <ToastContainer toasts={toasts} />
    </div>
  )
}
