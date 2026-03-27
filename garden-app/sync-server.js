// Lightweight local-network sync server for Garden Tracker
// Runs alongside Vite. All devices on the same Wi-Fi connect to this.

import { WebSocketServer } from 'ws'

const PORT = 3001
const wss = new WebSocketServer({ port: PORT, host: '0.0.0.0' })

// The last known full state of the garden database
let latestState = null
let clientCount = 0

wss.on('connection', (ws) => {
  clientCount++
  const id = clientCount
  console.log(`[sync] Client #${id} connected  (${wss.clients.size} total)`)

  // Send the current state immediately so new clients are in sync
  if (latestState) {
    ws.send(JSON.stringify({ type: 'sync', data: latestState }))
  }

  ws.on('message', (raw) => {
    let msg
    try { msg = JSON.parse(raw) } catch { return }

    if (msg.type === 'push' && msg.data) {
      latestState = msg.data
      // Broadcast to every OTHER connected client
      let sent = 0
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === 1 /* OPEN */) {
          client.send(JSON.stringify({ type: 'sync', data: latestState }))
          sent++
        }
      })
      console.log(`[sync] Client #${id} pushed state → relayed to ${sent} peer(s)`)
    }
  })

  ws.on('close', () => {
    console.log(`[sync] Client #${id} disconnected  (${wss.clients.size} remaining)`)
  })

  ws.on('error', (err) => {
    console.warn(`[sync] Client #${id} error:`, err.message)
  })
})

console.log(`[sync] Garden Tracker sync server listening on ws://0.0.0.0:${PORT}`)
