import Dexie from 'dexie'

export const db = new Dexie('GardenTrackerDB')

db.version(1).stores({
  seedBatches:
    '++id, plantName, variety, sowingDate, location, quantity, daysToMaturity, notes, status, wateringInterval, lastWatered, createdAt',
  moveHistory: '++id, batchId, fromLocation, toLocation, date, notes',
  wateringLogs: '++id, batchId, timestamp, notes',
  journalEntries: '++id, batchId, date, note, photo',
  harvestRecords: '++id, batchId, date, weight, quantity, notes, season',
  userSettings: '++id',
  careStreak: '++id',
})

// Version 2: add updatedAt index to seedBatches for sync conflict resolution
db.version(2).stores({
  seedBatches:
    '++id, plantName, variety, sowingDate, location, quantity, daysToMaturity, notes, status, wateringInterval, lastWatered, createdAt, updatedAt',
}).upgrade((tx) =>
  tx.table('seedBatches').toCollection().modify((b) => {
    b.updatedAt = b.createdAt ?? new Date().toISOString()
  })
)

// Seed default settings if empty
db.on('ready', async () => {
  const settingsCount = await db.userSettings.count()
  if (settingsCount === 0) {
    await db.userSettings.add({
      temperatureThreshold: 10,
      lat: null,
      lon: null,
      locationName: null,
    })
  }
  const streakCount = await db.careStreak.count()
  if (streakCount === 0) {
    await db.careStreak.add({
      lastCareDate: null,
      currentStreak: 0,
      longestStreak: 0,
    })
  }
})

// Fire a browser event so the sync hook knows to push after a local write
export function notifyChanged() {
  window.dispatchEvent(new Event('garden-changed'))
}

// Helper: get settings
export async function getSettings() {
  return db.userSettings.toCollection().first()
}

export async function updateSettings(data) {
  const s = await getSettings()
  return db.userSettings.update(s.id, data)
}

export async function getStreak() {
  return db.careStreak.toCollection().first()
}

export async function recordCare() {
  const streak = await getStreak()
  const today = new Date().toDateString()
  if (streak.lastCareDate === today) return streak

  const yesterday = new Date(Date.now() - 86400000).toDateString()
  const newStreak =
    streak.lastCareDate === yesterday ? streak.currentStreak + 1 : 1
  const longest = Math.max(newStreak, streak.longestStreak)

  await db.careStreak.update(streak.id, {
    lastCareDate: today,
    currentStreak: newStreak,
    longestStreak: longest,
  })
  notifyChanged()
  return { ...streak, currentStreak: newStreak, longestStreak: longest }
}

// Wrapper for batch updates that stamps updatedAt and fires sync
export async function updateBatch(id, data) {
  await db.seedBatches.update(id, { ...data, updatedAt: new Date().toISOString() })
  notifyChanged()
}

export function currentSeason() {
  const m = new Date().getMonth() + 1
  if (m >= 3 && m <= 5) return 'Spring'
  if (m >= 6 && m <= 8) return 'Summer'
  if (m >= 9 && m <= 11) return 'Autumn'
  return 'Winter'
}

export async function exportAllData() {
  const [batches, moves, waterings, journals, harvests, settings, streak] =
    await Promise.all([
      db.seedBatches.toArray(),
      db.moveHistory.toArray(),
      db.wateringLogs.toArray(),
      db.journalEntries.toArray(),
      db.harvestRecords.toArray(),
      db.userSettings.toArray(),
      db.careStreak.toArray(),
    ])
  return JSON.stringify(
    { batches, moves, waterings, journals, harvests, settings, streak },
    null,
    2
  )
}

export async function importAllData(jsonString) {
  const data = JSON.parse(jsonString)
  await db.transaction(
    'rw',
    [
      db.seedBatches,
      db.moveHistory,
      db.wateringLogs,
      db.journalEntries,
      db.harvestRecords,
      db.userSettings,
      db.careStreak,
    ],
    async () => {
      await db.seedBatches.clear()
      await db.moveHistory.clear()
      await db.wateringLogs.clear()
      await db.journalEntries.clear()
      await db.harvestRecords.clear()
      await db.userSettings.clear()
      await db.careStreak.clear()

      if (data.batches?.length) await db.seedBatches.bulkAdd(data.batches)
      if (data.moves?.length) await db.moveHistory.bulkAdd(data.moves)
      if (data.waterings?.length) await db.wateringLogs.bulkAdd(data.waterings)
      if (data.journals?.length) await db.journalEntries.bulkAdd(data.journals)
      if (data.harvests?.length) await db.harvestRecords.bulkAdd(data.harvests)
      if (data.settings?.length) await db.userSettings.bulkAdd(data.settings)
      if (data.streak?.length) await db.careStreak.bulkAdd(data.streak)
    }
  )
  notifyChanged()
}
