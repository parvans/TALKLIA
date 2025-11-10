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
        const {content, image, messageType } = req.body;

        if (!validateId.isValid(chatId)) {
          return res.status(400).json({ message: "Invalid chat ID" });
        }

        if(!content && !image) return res.status(400).json({ message: "Content or Image is required" });

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

        const newMessage = new Message({
            sender: senderId,
            chat: chatId,
            content,
            image: ImageURL,
            messageType: messageType || (image ? "image" : "text"),
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

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error in getChats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
