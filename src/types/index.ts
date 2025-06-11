export interface AnyObject {
    action: string;
    [key: string]: any;
}

export interface ProxyOption {
    method: 'get' | 'post' | 'put' | 'patch' | 'delete';
    path: string;
}

export const PROXY_OPTION_RECORD: Record<string, ProxyOption> = {
    listenRooms: {
        method: 'post',
        path: 'lambda/listen-rooms'
    },
    createRoom: {
        method: 'post',
        path: 'lambda/create-room'
    },
    sendRead: {
        method: 'post',
        path: 'lambda/send-read'
    },
    sendMessage: {
        method: 'post',
        path: 'lambda/send-message'
    },
    deleteMessage: {
        method: 'post',
        path: 'lambda/delete-message'
    },
    resign: {
        method: 'post',
        path: 'lambda/resign'
    },
    disconnect: {
        method: 'post',
        path: 'lambda/disconnect'
    },
    ping: {
        method: 'post',
        path: 'lambda/ping'
    },
    sendMessageV2: {
        method: 'post',
        path: 'v2/lambda/send-message'
    },
    deleteMessageV2: {
        method: 'delete',
        path: 'v2/lambda/delete-message/:attendeeId/:messageId'
    }
};