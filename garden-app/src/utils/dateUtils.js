export function daysSince(dateStr) {
  if (!dateStr) return 0
  const diff = Date.now() - new Date(dateStr).getTime()
  return Math.floor(diff / 86400000)
}

export function expectedHarvestDate(sowingDate, daysToMaturity) {
  if (!sowingDate || !daysToMaturity) return null
  const d = new Date(sowingDate)
  d.setDate(d.getDate() + Number(daysToMaturity))
  return d
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function isDueForWatering(lastWatered, intervalDays) {
  if (!intervalDays) return false
  if (!lastWatered) return true
  const diff = Date.now() - new Date(lastWatered).getTime()
  return diff >= intervalDays * 86400000
}

export function daysUntilHarvest(sowingDate, daysToMaturity) {
  const harvest = expectedHarvestDate(sowingDate, daysToMaturity)
  if (!harvest) return null
  const diff = harvest.getTime() - Date.now()
  return Math.ceil(diff / 86400000)
}
