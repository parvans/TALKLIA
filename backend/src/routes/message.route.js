import express from 'express';

const router = express.Router();
router.post('/message', (req, res) => {
    // Message sending logic here
    res.json({ message: 'Message sent successfully' });
});
export default router;