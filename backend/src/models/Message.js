import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    content: { 
        type: String, 
        required: true,
        trim: true,
      // maxlength: 2000
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "seen"],
      default: "pending",
    },
    image: { type: String },
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
},
{ timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;