# Garden Tracker Demo

Offline-first garden tracker built with React + Vite + IndexedDB (Dexie), with optional local-network sync over WebSocket.

## Quick start

```bash
npm install
npm run start:demo
```

- App UI: `http://localhost:5173` (or next available port)
- Sync server: `ws://localhost:3101`

`npm start` runs both frontend and sync server together.
`npm run start:demo` does the same, but pins sync to port `3101` for fewer local conflicts.

## Demo checklist

1. Open the app in browser and add a seed batch.
2. Water or move a batch so the dashboard updates.
3. Open Settings and export a backup JSON.
4. (Optional, multi-device) Open from another device on same Wi-Fi and verify sync status.

## Useful scripts

- `npm run dev` → frontend only
- `npm run sync` → sync server only
- `npm run start:demo` → preferred demo launch (uses port 3101)
- `npm run build` → production build check
- `npm run lint` → code linting

## Port configuration (optional)

If your environment already uses port `3001`, configure both app and sync server to another port:

```bash
VITE_SYNC_PORT=3101 SYNC_PORT=3101 npm start
```

## Notes

- If sync port is unavailable, the app still runs; only cross-device sync is disabled.
- Data is stored locally in browser IndexedDB.
