import express from 'express';
import { login, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);

router.post('/logout', (req, res) => {
    // Logout logic here
    res.json({ message: 'User logged out successfully' });
});

export default router;