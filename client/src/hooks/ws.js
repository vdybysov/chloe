import { getContext, setContext } from "svelte";
import { v4 as uuid } from "uuid";
import { useAuth } from "./auth";

const REPLY_TIMEOUT_MS = 10_000;
const API_URL = new URL(import.meta.env.VITE_API_URL);

export const setWs = () => {

    const url = `${API_URL.protocol === 'https:' ? 'wss:' : 'ws:'}//${API_URL.host}/ws`;
    const { getAccessToken } = useAuth();

    const replies = {};

    let socket;

    const connect = () => {
        console.log('[WS] Connecting to', url)
        socket = new WebSocket(url);
        socket.onmessage = (evt) => {
            const message = JSON.parse(evt.data);
            if (message.op === 'reply') {
                const replyHandler = replies[message.reply || ''];
                if (replyHandler) {
                    replyHandler(message);
                }
            }
        };
        socket.onopen = () => console.log('[WS] Successfully connected to', url)
        socket.onerror = (error) => {
            console.error('[WS] Error:', error)
        }
        socket.onclose = () => {
            console.log('[WS] Disconnected.')
            setTimeout(() => connect(), 1000)
        }
    };

    const sendMessage = (message) => socket.send(JSON.stringify(message));

    const sendOp = (op, params = {}) => new Promise(async (resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Timed out.'));
        }, REPLY_TIMEOUT_MS);
        const id = uuid();
        replies[id] = (message) => {
            clearTimeout(timeout);
            delete replies[id];
            if (message.value) {
                resolve(message.value);
            } else if (message.error) {
                reject(message.error);
            } else {
                reject(`Received incorrect reply for ${id}: ${JSON.stringify(message)}`);
            }
        };
        sendMessage({
            op,
            params: {
                ...params,
                token: await getAccessToken()
            },
            reply: id
        });
    });

    connect();

    setContext('ws', { sendOp });
};

export const useWs = () => getContext('ws');