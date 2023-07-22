import { io } from 'socket.io-client';

export const socket = io(process.env.SOCKET_URL, { transports : ['polling'], withCredentials: true});
