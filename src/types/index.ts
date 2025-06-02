export interface ProxyData {
    [key: string]: any;
}

export const PROXY_ENDPOINT_RECORD: Record<string, string> = {
    listenRooms: 'lambda/listen-rooms',
    createRoom: 'lambda/create-room',
    sendRead: 'lambda/send-read',
    sendMessage: 'lambda/send-message',
    deleteMessage: 'lambda/delete-message',
    resign: 'lambda/resign',
    disconnect: 'lambda/disconnect',
    sendMessageV2: 'lambda/send-message/v2',
    ping: 'lambda/ping',
};