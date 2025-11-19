import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { ENV } from "./env.js";
import { socketAuthMiddleare } from '../middleware/socket.auth.middleware.js';
import { Socket } from 'dgram';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ENV.CLIENT_URL,
        credentials: true
    },
});

// apply auth middleware to socket
io.use(socketAuthMiddleare);

// 
export const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
}

// this is for storing online users
const userSocketMap = {}  //{userId: socketId}

io.on("connection", (socket) => {
    console.log("A User Connected :- ", socket.user.username);
    const userId = socket.userId;
    userSocketMap[userId] = socket.id;
    const userName = socket.user.username;

    // emit used to send events all connected clients
    io.emit('onlineUsers', Object.keys(userSocketMap));

    socket.on("call:offer", ({ from, toUserId, offer, type }) => { // caller to callee
        const receiverSocketId = userSocketMap[toUserId];
        if (receiverSocketId) {
            console.log("call from ", userId, " to ", toUserId);
            
            io.to(receiverSocketId).emit("call:offer", {
                from,
                fromName:userName,
                offer,
                type
            });
        }
    });


    socket.on("call:answer", ({ toUserId, answer }) => {   // callee to caller
        const receiverSocketId = userSocketMap[toUserId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("call:answer", {
                from: userId,
                answer,
            });
        }
    });



    // -------------------------------  
    // 📡 3. ICE Candidates Exchange
    // -------------------------------
    socket.on("call:ice-candidate", ({ toUserId, candidate }) => {
        const receiverSocketId = userSocketMap[toUserId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("call:ice-candidate", {
                from: userId,
                candidate,
            });
        }
    });


    // -------------------------------  
    // ❌ 4. End Call (Both Sides)
    // -------------------------------
    socket.on("call:end", ({ toUserId }) => {
        const receiverSocketId = userSocketMap[toUserId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("call:end", { from: userId });
        }
    });

    socket.on("call:reject", ({ toUserId }) => {
        const receiverSocketId = userSocketMap[toUserId];
        if (receiverSocketId) io.to(receiverSocketId).emit("call:reject", { from: userId });
    });

    socket.on("call:busy", ({ toUserId }) => {
        const receiverSocketId = userSocketMap[toUserId];
        if (receiverSocketId) io.to(receiverSocketId).emit("call:busy", { from: userId });
    });

    socket.on("call:missed", ({ toUserId }) => {
        const receiverSocketId = userSocketMap[toUserId];
        if (receiverSocketId) io.to(receiverSocketId).emit("call:missed", { from: userId });
    });




    socket.on("sendMessage", (message) => {
        const chat = message.chat;
        if (!chat || !chat.users) return;

        // Send to all users in chat except sender
        chat.users.forEach((user) => {
            if (user._id.toString() === socket.userId) return;
            const receiverSocketId = userSocketMap[user._id.toString()];
            if (receiverSocketId) {
                socket.to(receiverSocketId).emit("messageReceived", message);
            }
        });
    });

    // socket.on , we listen for events from clients
    socket.on("disconnect", () => {
        console.log("A User Disconnected :- ", socket.user.username);
        delete userSocketMap[userId];
        io.emit('onlineUsers', Object.keys(userSocketMap));

    });

});


export { io, app, server };


