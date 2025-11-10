import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { ENV } from "./env.js";
import { socketAuthMiddleare } from '../middleware/socket.auth.middleware.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: ENV.CLIENT_URL,
        credentials: true
    },
});

// apply auth middleware to socket
io.use(socketAuthMiddleare);

// this is for storing online users
const userSocketMap = {}  //{userId: socketId}

io.on("connection", (socket)=>{
    console.log("A User Connected :- ",socket.user.username);
    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    // emit used to send events all connected clients
    io.emit('onlineUsers', Object.keys(userSocketMap));

    // socket.on , we listen for events from clients
    socket.on("disconnect", ()=>{
        console.log("A User Disconnected :- ",socket.user.username);
        delete userSocketMap[userId];
        io.emit('onlineUsers', Object.keys(userSocketMap));
        
    });

});


export { io, app, server };


