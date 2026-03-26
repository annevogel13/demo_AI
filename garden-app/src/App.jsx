import { useState, useEffect } from 'react'
import { getSettings, getStreak } from './db/db'
import { useToast } from './hooks/useToast'
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

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [settings, setSettings] = useState(null)
  const [streak, setStreak] = useState(null)
  const { toasts, addToast } = useToast()

  useEffect(() => {
    loadGlobalData()
  }, [])

  async function loadGlobalData() {
    const [s, str] = await Promise.all([getSettings(), getStreak()])
    setSettings(s)
    setStreak(str)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Top nav */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-bold text-green-800 text-lg tracking-tight">Garden Tracker</span>
          </div>
          <div className="text-xs text-green-500 font-medium">
            {streak?.currentStreak > 0 && (
              <span className="flex items-center gap-1">
                <span className="flame">🔥</span>
                {streak.currentStreak}d
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-2xl mx-auto px-4 py-5 pb-28">
        {tab === 'dashboard' && (
          <Dashboard
            toast={addToast}
            streak={streak}
            onStreakUpdate={loadGlobalData}
            settings={settings}
          />
        )}
        {tab === 'harvest' && <HarvestPage />}
        {tab === 'season' && <SeasonSummary />}
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
