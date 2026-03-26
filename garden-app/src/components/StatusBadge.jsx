import { STATUSES } from '../utils/constants'

export default function StatusBadge({ status }) {
  const s = STATUSES.find((x) => x.key === status) || STATUSES[0]
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${s.color} border-current/20`}>
      {s.emoji} {s.label}
    </span>
  )
}
