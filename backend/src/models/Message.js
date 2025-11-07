import mongoose from "mongoose";

const messsageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    imagge: { type: String }
},
{ timestamps: true }
);
const Message = mongoose.model('Message', messsageSchema);
export default Message;