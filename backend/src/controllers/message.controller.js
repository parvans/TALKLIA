import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async(req, res) => {
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } })
        .select('-password');

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getAllContacts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const getMessagesByUserId = async(req, res) => {
    try {
      const { chatId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ message: "Invalid chat ID" });
      }

      const messages = await Message.find({ chat: chatId })
        .populate("sender", "username email profilePicture")
        .populate("chat");

      res.status(200).json(messages);
    } catch (error) {
      console.error("Error in getMessagesByChatId:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

export const sendMessage = async(req, res) => {
    try {
        const validateId = mongoose.Types.ObjectId;
        const senderId = req.user._id;
        const { chatId } = req.params;
        const {content, image, messageType, audio } = req.body;

        if (!validateId.isValid(chatId)) {
          return res.status(400).json({ message: "Invalid chat ID" });
        }

        // if(!content && !image) return res.status(400).json({ message: "Content or Image is required" });

        // if(myId.equals(id)) return res.status(400).json({ message: "You cannot send a message to yourself" });
        
        const chatExists = await Chat.findById(chatId);
        if (!chatExists) {
          return res.status(404).json({ message: "Chat not found" });
        }
        
        let ImageURL;
        if(image){
          const uploadRes = await cloudinary.uploader.upload(image,{
            folder: "chat_app/messages",
          });
          ImageURL = uploadRes.secure_url; 
        }

        let audioURL;
        if (req.body.audio) {
          const uploadRes = await cloudinary.uploader.upload(req.body.audio, {
            resource_type: "video",   // IMPORTANT — audio counts as "video"
            folder: "chat_app/voice",
          });

          audioURL = uploadRes.secure_url;
        }



        const newMessage = new Message({
            sender: senderId,
            chat: chatId,
            content,
            image: ImageURL,
            audio: audioURL,
            audioDuration: req.body.audioDuration,
            messageType: audioURL ? "audio" : (image ? "image" : "text"),
            status: "sent"
        });
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(
          chatExists.users.find((user) => !user.equals(senderId))
        );

        await Chat.findByIdAndUpdate(chatId, { 
          latestMessage: newMessage._id,
          lastActivity: new Date(),
        });

        const fullMessage = await Message.findById(newMessage._id)
          .populate("sender", "username email profilePicture")
          .populate({
            path: "chat",
            populate: {
              path: "users",
              select: "username email profilePicture",
            },
        });

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", fullMessage);
        }

        res.status(201).json(fullMessage);
    } catch (error) {
        console.log("Error in sendMessage:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getChats = async (req, res) => {
 try {
    const userId = req.user._id;

    const chats = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
      .populate("users", "username email profilePicture")
      .populate("groupAdmin", "username email profilePicture")
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "username email profilePicture" },
      })
      .sort({ updatedAt: -1 });

      // unread count
      const chatsWithUnread = await Promise.all(
        chats.map(async (chat) => {
          const unreadCount = await Message.countDocuments({
            chat: chat._id,
            "readBy.user": { $ne: userId },
            sender: { $ne: userId },
          });
          return { ...chat.toObject(), unreadCount };
        })
      );


    res.status(200).json(chatsWithUnread);
  } catch (error) {
    console.error("Error in getChats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const updated = await Message.updateMany(
      { chat: chatId, "readBy.user": { $ne: userId } },
      { $push: { readBy: { user: userId, readAt: new Date() } }, $set: { status: "seen" } }
    );

    res.status(200).json({ success: true, count: updated.modifiedCount });
  } catch (error) {
    console.error("Error in markMessagesAsRead:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editMessage = async(req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const msg = await Message.findById(messageId);

    if(!msg){
      return res.status(400).json({ message: "Message not found" });
    } 
    if(!msg.sender.equals(userId)){
      return res.status(403).json({ message: "You are not the sender of this message" });
    }

    msg.content = content;
    msg.isEdited = true;
    await msg.save();

    const updatedMsg = await Message.findById(messageId)
      .populate("sender", "username email profilePicture")
      .populate("chat");

    updatedMsg.chat.users.forEach((u) => {
      const socketId = getReceiverSocketId(u.toString());
      if (socketId) io.to(socketId).emit("messageEdited", updatedMsg);
    });

    res.json(updatedMsg);
  } catch (error) {
    console.log("Error in editMessage:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export const deleteMessage = async(req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const msg = await Message.findById(messageId).populate("chat");

    if(!msg){
      return res.status(400).json({ message: "Message not found" });
    } 
    if(!msg.sender.equals(userId)){
      return res.status(403).json({ message: "You are not the sender of this message" });
    }

    if(msg.messageType === "image"){
      await cloudinary.uploader.destroy(msg.image.split("/").pop().split(".")[0]);
    }

    if(msg.messageType === "audio"){
      await cloudinary.uploader.destroy(msg.audio.split("/").pop().split(".")[0]);
    }

    await Message.findByIdAndUpdate(messageId, { isDeleted: true });

    const deletedMsg = await Message.findById(messageId)
    .populate("sender", "username email profilePicture")
    .populate("chat");

    // Send real-time update to all chat users
    msg.chat.users.forEach((u) => {
      const socketId = getReceiverSocketId(u.toString());
      if (socketId) {
        io.to(socketId).emit("messageDeleted", deletedMsg);
      }
    });

    res.json({ success: true, deletedMsg });

  } catch (error) {
    console.log("Error in deleteMessage:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}










export const deleteAllMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.users.some((u) => u.equals(userId))) {
      return res.status(403).json({ message: "You are not part of this chat" });
    }

    await Message.deleteMany({ chat: chatId });

    chat.latestMessage = null;
    await chat.save();

    // Optionally notify the other user(s) via socket
    // const receiverSocketId = getReceiverSocketId(
    //   chat.users.find((user) => !user.equals(userId))
    // );
    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit("chatCleared", chatId);
    // }

    res.status(200).json({ success: true, message: "All messages deleted", chatId });
  } catch (error) {
    console.error("Error in deleteAllMessages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


