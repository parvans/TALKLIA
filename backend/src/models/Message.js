import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    receiverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    content: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 2000
    },
    image: { type: String }
},
{ timestamps: true }
);

// virtual aliases
messageSchema.virtual('sender', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true
});

messageSchema.virtual('receiver', {
  ref: 'User',
  localField: 'receiverId',
  foreignField: '_id',
  justOne: true
});

// include virtuals in output
messageSchema.set('toObject', { virtuals: true });
messageSchema.set('toJSON', { virtuals: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;