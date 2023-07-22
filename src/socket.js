import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
//const URL = process.env.NODE_ENV === 'production' ? undefined : 'https://chat-app-sockets-server.netlify.app';

export const socket = io('https://chat-app-sockets-server.netlify.app', { transports : ['polling'], withCredentials: true});
