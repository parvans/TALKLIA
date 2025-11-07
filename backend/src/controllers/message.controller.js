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

        let ImageURL;
        if(image){
            const uploadRes = await cloudinary.uploader.upload(image);
            ImageURL = uploadRes.secure_url; 
        }

        const newMessage = new Message({
            senderId: myId,
            receiverId: id,
            content,
            imagge: ImageURL
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}