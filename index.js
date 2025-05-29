const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');


const app = express();
app.use(bodyParser.json());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const connectionMap = new Map();

wss.on('connection', (ws, req) => {
    const urlParams = new URLSearchParams(req.url.replace(/^\/\?/, ''));
    const token = urlParams.get('token');

    const connectionId = uuidv4();
    connectionMap.set(connectionId, ws);
    ws.connectionId = connectionId;
    console.log('[CONNECT]', connectionId);

    ws.on('message', async (msg) => {
        console.log('[RECEIVED]', msg.toString());

        try {
            const data = JSON.parse(msg.toString());
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            }

            try {
                const response = await proxy({...data, connectionId}, config);
                // console.log("response : ", response);
            } catch (e) {
                console.log("error : ", e);
            }
        } catch (err) {
            ws.send(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });

    // 연결 종료 시
    ws.on('close', async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            }
        }

        const response = await proxy({action: "disconnect", connectionId: ws.connectionId}, config);
        // console.log("response : ", response);

        console.log('[DISCONNECT] : ', ws.connectionId);
    });
});

async function proxy(data, config) {
    const endpoint = {
        "listenRooms": "lambda/listen-rooms",
        "createRoom" : "lambda/create-room",
        "sendRead" : "lambda/send-read",
        "sendMessage" : "lambda/send-message",
        "deleteMessage" : "lambda/delete-message",
        "resign" : "lambda/resign",
        "disconnect" : "lambda/disconnect",
        "sendMessageV2": "lambda/send-message/v2",
    }[data.action];

    const url = `http://localhost:8080/${endpoint}`;

    console.log("proxy : ", url, data, config);
    return axios.post(url, data, config);
}


app.post('/post-to-connection', (req, res) => {
    console.log('[POST]', req.body);
    const { connectionId, data } = req.body;
    const ws = connectionMap.get(connectionId);

    if (!ws || ws.readyState !== WebSocket.OPEN) {
        return res.status(404).json({ success: false, error: 'Client not connected' });
    }

    ws.send(JSON.stringify(data));
    return res.json({ success: true, message: 'Message sent to client' });
});


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`websocket server running at http://localhost:${PORT}`);
});
