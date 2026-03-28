import { useCallback, useEffect, useRef, useState } from 'react'
import { db, exportAllData } from '../db/db'

// Merge remote state into local IndexedDB without overwriting newer local data.
// Strategy:
//  - Event logs (wateringLogs, moveHistory, journalEntries, harvestRecords):
//      union by id — add any record that doesn't exist locally
//  - seedBatches: merge by id, prefer the record with the later updatedAt
//  - careStreak: keep the higher streak
//  - userSettings: keep local (settings are per-device)
async function mergeRemote(remote) {
  // Map export keys → db table names
  const eventLogs = [
    { key: 'waterings', table: db.wateringLogs },
    { key: 'moves', table: db.moveHistory },
    { key: 'journals', table: db.journalEntries },
    { key: 'harvests', table: db.harvestRecords },
  ]

  await db.transaction(
    'rw',
    [db.seedBatches, db.wateringLogs, db.moveHistory, db.journalEntries, db.harvestRecords, db.careStreak],
    async () => {
      // 1. Union-merge event logs
      for (const { key, table } of eventLogs) {
        const remoteItems = remote[key] ?? []
        if (!remoteItems.length) continue
        const existingIds = new Set((await table.toArray()).map((x) => x.id))
        const newItems = remoteItems.filter((x) => !existingIds.has(x.id))
        if (newItems.length) await table.bulkAdd(newItems)
      }

      // 2. Merge seedBatches — prefer the record with the later updatedAt
      const remoteBatches = remote.batches ?? []
      for (const rb of remoteBatches) {
        const local = await db.seedBatches.get(rb.id)
        if (!local) {
          await db.seedBatches.add(rb)
        } else {
          const remoteTime = new Date(rb.updatedAt ?? rb.createdAt ?? 0).getTime()
          const localTime = new Date(local.updatedAt ?? local.createdAt ?? 0).getTime()
          if (remoteTime > localTime) {
            await db.seedBatches.put(rb)
          }
        }
      }

      // 3. Merge careStreak — keep the higher current streak
      const remoteStreak = remote.streak?.[0]
      if (remoteStreak) {
        const local = await db.careStreak.toCollection().first()
        if (local && remoteStreak.currentStreak > local.currentStreak) {
          await db.careStreak.update(local.id, {
            currentStreak: remoteStreak.currentStreak,
            longestStreak: Math.max(remoteStreak.longestStreak, local.longestStreak),
            lastCareDate: remoteStreak.lastCareDate,
          })
        }
      }
    }
  )
}

// Derive the sync-server URL from whatever host the browser used to load the app,
// so it works on both PC (localhost) and phone (192.168.x.x).
function getSyncUrl() {
  const port = import.meta.env.VITE_SYNC_PORT || '3001'
  return `ws://${window.location.hostname}:${port}`
}

export function useSync(onMerged) {
  const ws = useRef(null)
  const [status, setStatus] = useState('connecting') // 'connecting' | 'connected' | 'disconnected'
  const isSyncing = useRef(false) // guard against re-entrant merges
  const reconnectTimer = useRef(null)

  const push = useCallback(async () => {
    if (!ws.current || ws.current.readyState !== 1) return
    const json = await exportAllData()
    ws.current.send(JSON.stringify({ type: 'push', data: JSON.parse(json) }))
  }, [])

  // Call this after any local write so peers get the update
  const notifyChange = useCallback(() => {
    push()
  }, [push])

  useEffect(() => {
    let alive = true

    function connect() {
      const url = getSyncUrl()
      const socket = new WebSocket(url)
      ws.current = socket

      socket.onopen = () => {
        if (!alive) { socket.close(); return }
        setStatus('connected')
        clearTimeout(reconnectTimer.current)
        push() // share our current state with the server on connect
      }

      socket.onmessage = async (event) => {
        if (!alive) return
        try {
          const msg = JSON.parse(event.data)
          if (msg.type === 'sync' && msg.data && !isSyncing.current) {
            isSyncing.current = true
            await mergeRemote(msg.data)
            isSyncing.current = false
            onMerged?.() // tell the app to re-render
          }
        } catch (e) {
          isSyncing.current = false
          console.warn('[sync] merge error', e)
        }
      }

      socket.onclose = () => {
        if (!alive) return
        setStatus('disconnected')
        reconnectTimer.current = setTimeout(connect, 3000)
      }

      socket.onerror = () => {
        // onclose will fire after onerror, handles reconnect
        setStatus('disconnected')
      }
    }

    connect()

    // Listen for local writes dispatched from db helpers
    const handleLocalWrite = () => push()
    window.addEventListener('garden-changed', handleLocalWrite)

    return () => {
      alive = false
      clearTimeout(reconnectTimer.current)
      window.removeEventListener('garden-changed', handleLocalWrite)
      ws.current?.close()
    }
  }, [push, onMerged])

  return { status, notifyChange }
}
