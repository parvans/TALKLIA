import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

export const accessChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const loggedInUserId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Check if 1-1 chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [loggedInUserId, userId] },
    })
    .populate("users", "-password")
    .populate("latestMessage");

    if (chat) {
      chat = await User.populate(chat, {
        path: "latestMessage.sender",
        select: "username email profilePicture",
      });
      return res.status(200).json(chat);
    }

    // Create new chat
    const newChat = await Chat.create({
      chatName: "Direct Chat",
      isGroupChat: false,
      users: [loggedInUserId, userId],
    });

    const fullChat = await Chat.findById(newChat._id)
      .populate("users", "-password");

    res.status(201).json(fullChat);
  } catch (error) {
    console.error("Error in accessChat:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "username email profilePicture" },
      })
      .sort({ updatedAt: -1 });

    // For each chat, count unread messages for the current user
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
    console.error("Error in fetchChats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




// GROUP--------------------------------------

export const createGroupChat = async (req, res) => {
  try {
    const { name, users } = req.body; // users = array of userIds
    const loggedInUserId = req.user._id;

    if (!name || !users || !users.length) {
      return res.status(400).json({ message: "Group name and users are required" });
    }

    // Include the creator
    users.push(loggedInUserId);

    const groupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      users,
      groupAdmin: loggedInUserId,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullGroupChat);
  } catch (error) {
    console.error("Error in createGroupChat:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
      return res.status(400).json({ message: "chatId and chatName are required" });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat)
      return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Error in renameGroup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat)
      return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Error in addToGroup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat)
      return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Error in removeFromGroup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    await Chat.findByIdAndDelete(chatId);
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error in deleteChat:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
