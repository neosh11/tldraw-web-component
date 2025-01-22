
import { IRequest } from "itty-router";
import { Environment } from "../types";
import { TLSyncErrorCloseEventCode, TLSyncErrorCloseEventReason } from "@tldraw/sync-core";

const allowedRooms = ["home"]

export async function getRequestErrors(request: IRequest, env: Environment): Promise<Response | undefined> {
    const user = request.headers.get('cf-connecting-ip') ?? 'unknown'
    
    if (!user) {
        return closeConnection(TLSyncErrorCloseEventReason.FORBIDDEN)
    }
    // The following requests must respond with a message within the ws connection
    const { success } = await env.MY_RATE_LIMITER.limit({ key: user }) // key can be any string of your choosing
    if (!success) {
        return closeConnection(TLSyncErrorCloseEventReason.RATE_LIMITED)
    }

    let roomId = request.params.roomId
    if (!roomId || allowedRooms.indexOf(roomId) === -1) {
        return closeConnection(TLSyncErrorCloseEventReason.NOT_FOUND)
    }

    const secret = env.MY_SECRET
    // const { token } = request.query
    // if (!token || token === "") {
    //     return closeConnection(TLSyncErrorCloseEventReason.FORBIDDEN)
    // }
    // if (token === secret) {
    //     roomId = roomId + env.MY_SECRET
    // }
    request.params.roomId = roomId
}

function closeConnection(reason: string) {
    const { 0: clientWebSocket, 1: serverWebSocket } = new WebSocketPair()
    serverWebSocket.accept()
    serverWebSocket.close(TLSyncErrorCloseEventCode, reason)
    return new Response(null, { status: 101, webSocket: clientWebSocket })
}