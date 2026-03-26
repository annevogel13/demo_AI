import { getStreakMessage } from '../utils/constants'

export default function StreakBadge({ streak }) {
  if (!streak) return null
  const { currentStreak, longestStreak } = streak
  const { msg, icon } = getStreakMessage(currentStreak)

  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl px-4 py-3 flex items-center gap-3">
      <span className="text-3xl flame">{icon}</span>
      <div>
        <div className="font-bold text-orange-700 text-lg leading-none">
          {currentStreak} day{currentStreak !== 1 ? 's' : ''}
        </div>
        <div className="text-orange-600 text-sm">{msg}</div>
      </div>
      {longestStreak > currentStreak && (
        <div className="ml-auto text-xs text-slate-400">
          Best: {longestStreak}d 🏆
        </div>
      )}
    </div>
  )
}
