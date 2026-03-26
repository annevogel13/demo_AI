export const LOCATIONS = {
  lamp: {
    key: 'lamp',
    label: 'Grow Lamp',
    emoji: '🌱',
    color: 'yellow',
    zoneClass: 'zone-lamp',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    badge: 'bg-yellow-100 text-yellow-800',
    title: 'Inside – Grow Lamp',
  },
  turtle: {
    key: 'turtle',
    label: 'Turtle Room',
    emoji: '🐢',
    color: 'green',
    zoneClass: 'zone-turtle',
    bg: 'bg-green-50',
    border: 'border-green-300',
    badge: 'bg-green-100 text-green-800',
    title: 'Turtle Room',
  },
  greenhouse: {
    key: 'greenhouse',
    label: 'Greenhouse',
    emoji: '🏡',
    color: 'sky',
    zoneClass: 'zone-greenhouse',
    bg: 'bg-sky-50',
    border: 'border-sky-300',
    badge: 'bg-sky-100 text-sky-800',
    title: 'Greenhouse',
  },
  outside: {
    key: 'outside',
    label: 'Outside',
    emoji: '🌤️',
    color: 'purple',
    zoneClass: 'zone-outside',
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    badge: 'bg-purple-100 text-purple-800',
    title: 'Outside',
  },
}

export const LOCATION_KEYS = Object.keys(LOCATIONS)

export const STATUSES = [
  { key: 'seeded', label: 'Seeded', emoji: '🌰', color: 'bg-amber-100 text-amber-800' },
  { key: 'germinated', label: 'Germinated', emoji: '🌿', color: 'bg-lime-100 text-lime-800' },
  { key: 'sprouted', label: 'Sprouted', emoji: '🌱', color: 'bg-green-100 text-green-800' },
  { key: 'transplanted', label: 'Transplanted', emoji: '🪴', color: 'bg-teal-100 text-teal-800' },
  { key: 'harvested', label: 'Harvested', emoji: '🥬', color: 'bg-emerald-100 text-emerald-800' },
]

export const OUTDOOR_LOCATIONS = ['greenhouse', 'outside']

export const STREAK_MESSAGES = [
  { min: 0, msg: 'Start your streak! 🌱', icon: '🌱' },
  { min: 1, msg: 'Day 1! Every journey starts here 🌿', icon: '🌿' },
  { min: 3, msg: '3 days in a row! Your seedlings love you 💚', icon: '🔥' },
  { min: 7, msg: 'One whole week! You\'re a garden hero 🌟', icon: '🔥' },
  { min: 14, msg: '2 weeks strong! Plants are thriving! 🌺', icon: '🔥' },
  { min: 30, msg: 'A whole month! Legendary gardener! 🏆', icon: '🔥' },
]

export function getStreakMessage(streak) {
  let msg = STREAK_MESSAGES[0]
  for (const m of STREAK_MESSAGES) {
    if (streak >= m.min) msg = m
  }
  return msg
}
