import { WebSocket } from 'ws';

export const connectionManager = (() => {
    const connections = new Map<string, WebSocket>();

    return {
        add(id: string, ws: WebSocket) {
            connections.set(id, ws);
        },
        remove(id: string) {
            connections.delete(id);
        },
        get(id: string): WebSocket | undefined {
            return connections.get(id);
        }
    };
})();