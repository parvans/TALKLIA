import express from 'express';

const router = express.Router();

router.post('/signup', (req, res) => {
    // Signup logic here
    res.json({ message: 'User signed up successfully' });
}

);
router.post('/login', (req, res) => {
    // Login logic here
    res.json({ message: 'User logged in successfully' });
}   );

router.post('/logout', (req, res) => {
    // Logout logic here
    res.json({ message: 'User logged out successfully' });
});

export default router;