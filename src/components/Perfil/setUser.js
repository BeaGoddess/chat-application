import React from "react";
import { socket } from "../../socket";

// This is named export.
export const connectUser = (name) => {

    // Client connected 
    socket.on('connect', () => {
    })

    socket.emit('set-user', name)
}
