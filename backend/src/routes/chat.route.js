import express from "express";
import { protectRoute } from '../middleware/auth.middleware.js';
import { 
accessChat, addToGroup, 
createGroupChat, deleteChat, 
fetchChats, removeFromGroup, 
renameGroup } from "../controllers/chat.controller.js";

const router = express.Router();

// 1-1 chat
router.post("/:userId", protectRoute, accessChat);

// fetch all chats
router.get("/", protectRoute, fetchChats);

// group chat
router.post("/group", protectRoute, createGroupChat);

router.put("/rename", protectRoute, renameGroup);

router.put("/groupadd", protectRoute, addToGroup);

router.put("/groupremove", protectRoute, removeFromGroup);

// delete chat
router.delete("/:chatId", protectRoute, deleteChat);

export default router;
