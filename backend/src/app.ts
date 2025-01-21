import express from 'express'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import throttle from 'lodash.throttle'
import {
    TLSocketRoom,
    RoomSnapshot,
    TLSyncErrorCloseEventCode,
    TLSyncErrorCloseEventReason,
} from '@tldraw/sync-core'
import {
    TLRecord,
    createTLSchema,
    defaultShapeSchemas,
} from '@tldraw/tlschema'

const {
    MY_SECRET = 'MY_SECRET',
} = process.env

async function putRoomSnapshotToS3(roomId: string, snapshotJson: string) {
    // Example placeholder:
    // await s3Client.putObject({
    //   Bucket: 'TLDRAW_BUCKET',
    //   Key: `rooms/${roomId}`,
    //   Body: snapshotJson,
    // })
}

async function getRoomSnapshotFromS3(roomId: string): Promise<RoomSnapshot | null> {
    // Example placeholder:
    // const response = await s3Client.getObject({
    //   Bucket: 'TLDRAW_BUCKET',
    //   Key: `rooms/${roomId}`,
    // })
    // if (response.Body) {
    //   const jsonString = await streamToString(response.Body)
    //   return JSON.parse(jsonString) as RoomSnapshot
    // }
    return null
}

/* ---------------------------------------------------------------------
   2) Create the Tldraw schema and an in-memory store
   --------------------------------------------------------------------- */

const schema = createTLSchema({
    shapes: {
        ...defaultShapeSchemas,
    },
})

const rooms: Record<string, TLSocketRoom<TLRecord, void>> = {}
async function getOrCreateRoom(roomId: string): Promise<TLSocketRoom<TLRecord, void>> {
    if (rooms[roomId]) {
        return rooms[roomId]
    }
    const initialSnapshot = await getRoomSnapshotFromS3(roomId)
    const room = new TLSocketRoom<TLRecord, void>({
        schema,
        initialSnapshot: initialSnapshot ?? undefined,
        onDataChange: throttle(async () => {
            // Persist the updated state to R2
            const snapshot = JSON.stringify(room.getCurrentSnapshot())
            await putRoomSnapshotToS3(roomId, snapshot)
        }, 10_000),
    })
    rooms[roomId] = room
    return room
}

/* ---------------------------------------------------------------------
   3) Setup the Express server with WebSocket upgrade
   --------------------------------------------------------------------- */

const app = express()
app.use(express.json())
const server = createServer(app)
const wss = new WebSocketServer({ noServer: true })
server.on('upgrade', async (req, socket, head) => {
    // Example path check:
    const url = new URL(req.url ?? '', `http://${req.headers.host}`)
    if (!url.pathname.startsWith('/connect/')) {
        // Not a recognized upgrade route
        socket.destroy()
        return
    }

    const roomId = url.pathname.replace('/connect/', '')
    const sessionId = url.searchParams.get('sessionId')
    const token = url.searchParams.get('token')

    if (!sessionId) {
        socket.destroy()
        return
    }

    // If token must match MY_SECRET (similar to your DO code):
    if (token === MY_SECRET) {
        // Do something or rewrite the roomId if needed
    }

    // Let ws handle the handshake
    wss.handleUpgrade(req, socket, head, async (clientWebSocket) => {
        const room = await getOrCreateRoom(roomId)
        if (room.getNumActiveSessions() > 10) {
            // Force close with error code
            clientWebSocket.close(
                TLSyncErrorCloseEventCode,
                TLSyncErrorCloseEventReason.ROOM_FULL
            )
            return
        }
        
        clientWebSocket.on('close', () => {
            console.log(`WS closed for sessionId ${sessionId} in room ${roomId}`)
        })

        room.handleSocketConnect({
            sessionId,
            socket: clientWebSocket,
        })

        console.log(`WS connected for sessionId ${sessionId} in room ${roomId}`)
    })
})

const PORT = process.env.PORT || 4455
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
