import express from 'express';
import { deleteAllMessages, deleteMessage, editMessage, getAllContacts, getChats, getMessagesByUserId, markMessagesAsRead, sendMessage } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/contacts', protectRoute , getAllContacts);

router.get('/chats', protectRoute , getChats);

router.get('/:chatId', protectRoute , getMessagesByUserId);

router.post('/send/:chatId', protectRoute , sendMessage);

router.put('/mark-read/:chatId', protectRoute, markMessagesAsRead);

router.put('/edit/:messageId', protectRoute, editMessage);

router.put('/delete/:messageId', protectRoute, deleteMessage);



//delete all messages in a chat -  not added in frontend
router.delete('/delete-all/:chatId', protectRoute, deleteAllMessages);



export default router;