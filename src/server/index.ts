import express from 'express';
import { json } from 'body-parser';
import { createServer as createHttpServer, Server as HttpServer } from 'http';
import postToConnectionRouter from '../api/postToConnection';
import { RawData, WebSocket, WebSocketServer} from "ws";
import { v4 as uuidv4 } from "uuid";
import { connectionManager } from "./connectionManager";
import { proxy } from "./proxy";

export function createServer(): HttpServer {
    const app = express();
    app.use(json());
    app.use('/post-to-connection', postToConnectionRouter);
    const server = createHttpServer(app);
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket, req) => {
        const connectionId = uuidv4();
        console.log('[CONNECT]', connectionId);

        const token = getTokenFromUrl(req.url);

        connectionManager.add(connectionId, ws);

        ws.on('message', async (msg: RawData) => {
            console.log('[ONMESSAGE]', msg.toString());

            const data = JSON.parse(msg.toString());
            try {
                await proxy({ ...data, connectionId }, token);
            } catch (e) {
                console.log("[ONMESSAGE PROXY ERROR] : ", e);
            }
        });

        ws.on('close', async () => {
            console.log('[DISCONNECT]', connectionId);
            connectionManager.remove(connectionId);

            try {
                await proxy({ action: 'disconnect', connectionId }, token);
            } catch (e) {
                console.log("[DISCONNECT PROXY ERROR] : ", e);
            }
        });
    });

    return server;
}

const getTokenFromUrl = (url?: string) => {
    const params = new URLSearchParams(url?.replace(/^\/?\?/, ''));
    return params.get('token') || '';
}