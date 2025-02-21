import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
};

//This will be used to store online users 
const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("A user is connected ", socket.id);

    //When the user is online, add it to the userSocketMap
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    //Send all the "Online Users"
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected ", socket.id);
        //remove offline user and send Updated "Online Users" 
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

    })
})

export { io, server, app };