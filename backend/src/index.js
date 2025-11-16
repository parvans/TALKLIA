import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import chatRoutes from './routes/chat.route.js';
import connectDB from './lib/db.js';
import colors from 'colors';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ENV } from './lib/env.js';
import { app, server } from './lib/socket.js';
import express from 'express';
dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);

// if(process.env.NODE_ENV === 'production'){
//     app.use(express.static(path.join(__dirname, '/frontend/dist')));
//     app.get('*', (_, res) => {
//         res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
//     });
// }

app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();

});