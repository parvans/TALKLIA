import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts = async(req, res) => {
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select('-password');
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getAllContacts:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const getMessagesByUserId = async(req, res) => {
    try {
        const myId = req.user._id;
        const { id } = req.params;
        const messages = await Message.find({
            $or:[
                { senderId: myId, receiverId: id },
                { senderId: id, receiverId: myId }
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessagesByUserId:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const sendMessage = async(req, res) => {
    try {
        const myId = req.user._id;
        const { id } = req.params;
        const { content, image } = req.body;

        const validateId = mongoose.Types.ObjectId;

        if(!content && !image) return res.status(400).json({ message: "Content or Image is required" });

        if(myId.equals(id)) return res.status(400).json({ message: "You cannot send a message to yourself" });
        
        const receiverExist = await User.findById({_id: id});
        if(!receiverExist) return res.status(404).json({ message: "Receiver not found" });
        
        if(!validateId.isValid(id)){
            return res.status(400).json({ message: "Invalid receiver ID" });
        }

        let ImageURL;
        if(image){
            const uploadRes = await cloudinary.uploader.upload(image);
            ImageURL = uploadRes.secure_url; 
        }

        const newMessage = new Message({
            senderId: myId,
            receiverId: id,
            content,
            image: ImageURL
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getChats = async(req, res) =>{
    try {
        const myId = req.user._id;
        const messages = await Message.find({ 
            $or: [
                { senderId: myId },
                { receiverId: myId }
            ]
        }).populate('sender', 'username profilePicture').populate('receiver', 'username profilePicture');
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getChats:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}