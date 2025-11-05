import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});