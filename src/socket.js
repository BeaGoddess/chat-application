import { io } from 'socket.io-client';

//export const socket = io('https://chat-application-server-mc41.onrender.com', { transports : ['polling'], withCredentials: true});
export const socket = io("https://chat-application-server.beagoddess.repl.co", { transports: ['polling'], withCredentials: true });

// https://chat-application-server.beagoddess.repl.co