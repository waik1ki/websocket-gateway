import axios from 'axios';
import {AnyObject, PROXY_OPTION_RECORD} from '../types';

export async function proxy(data: AnyObject, token: string) {
    const option = PROXY_OPTION_RECORD[data.action];

    if (!option) {
        throw new Error('Invalid action');
    }

    const {method, path} = option;

    let url = 'http://localhost:8080/';

    if (path.includes('/:')) {
        url += path.replace(/:([^/]+)/g, (_, key) => {
            return data[key];
        });
    } else {
        url += path;
    }

    return axios.request({method, url, data, headers: { Authorization: token } });
}