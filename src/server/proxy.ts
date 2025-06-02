import axios from 'axios';
import { ProxyData, PROXY_ENDPOINT_RECORD } from '../types';

export async function proxy(data: ProxyData, token: string) {
    const path = PROXY_ENDPOINT_RECORD[data.action];

    if (!path) {
        throw new Error('Invalid action');
    }

    const url = `http://localhost:8080/${path}`;

    return axios.post(url, data, { headers: { Authorization: token } });
}