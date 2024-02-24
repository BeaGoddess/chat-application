import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
export const socket = io("https://60b6cbc3-4f12-453a-a627-195f5dc43bc2-00-3vtzsllz4onkq.riker.replit.dev/", { transports: ['polling'], withCredentials: true });

//export const socket = io("https://chat-application-server.beagoddess.repl.co", { transports: ['polling'], withCredentials: true });

/*
const URL = process.env.NODE_ENV === 'production' ? undefined : 'https://chat-app-sockets-server.netlify.app';

export const socket = io('https://chat-app-sockets-server.netlify.app');
*/