import { Router, Request, Response } from 'express';
import { connectionManager } from '../server/connectionManager';

const router = Router();

router.post('/', (req: Request, res: Response) => {
    const { connectionId, data } = req.body;
    const ws = connectionManager.get(connectionId);

    if (!ws || ws.readyState !== WebSocket.OPEN) {
        return res.status(404).json({ success: false, error: 'Client not connected' });
    }

    ws.send(JSON.stringify(data));

    return res.json({ success: true, message: 'Message sent' });
});

export default router;