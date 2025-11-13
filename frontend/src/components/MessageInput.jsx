import React, { useRef, useState } from 'react'
import useKeyboardSound from '../hooks/useKeyboardSound'
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../store/slices/chatSlice';
import { Paperclip, Send, XIcon } from 'lucide-react';

export default function MessageInput() {
    const {playRandonKeyStrokeSound} =useKeyboardSound();
    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const fileInput = useRef(null);
    const dispatch = useDispatch();
    const { isToneEnabled, selectedChat, isSending  } = useSelector(state => state.chat);


    const handleSendMessage = (e)=>{
        e.preventDefault();
        if(!text.trim() && !imagePreview) return;
        if(isToneEnabled) playRandonKeyStrokeSound();

        const messageData = {
            content:text.trim(), 
            image:imagePreview,
            chatId:selectedChat._id,
            messageType:imagePreview ? 'image' : 'text'
        }
        dispatch(sendMessage(messageData));
        setText('');
        setImagePreview(null);
        if(fileInput.current) fileInput.current.value = null;
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if(!file.type.startsWith('image/')){
            toast.error('Please select an image file.');
            return;
        }
    
        const reader = new FileReader();
        reader.onloadend = ()=>{
            setImagePreview(reader.result);
        }
        reader.readAsDataURL(file);
    }

    const removeImage = ()=>{
        setImagePreview(null);
        if(fileInput.current) fileInput.current.value = null;
    }

  return (
    <div className="p-4 border-t border-slate-700">
        {imagePreview && (
            <div className="relative">
                <button 
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-300 transition-colors"
                onClick={removeImage}
                >
                    <XIcon className="w-6 h-6" />
                </button>
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
            </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-4 relative">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                rows={1}
                className="w-full bg-slate-100 py-2 px-4 rounded-md focus:outline-none text-black resize-none overflow-y-auto"
                style={{
                    maxHeight: "7.5rem",
                }}
                onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; 
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                    }
                }}
            />

            <button type="submit" disabled={isSending} className="text-slate-400 hover:text-slate-300 transition-colors">
                <Send className="w-6 h-6" />
            </button>
            <input type="file" accept='image/*' onChange={handleImageUpload} ref={fileInput} className="hidden" />
            <button type="button" onClick={()=>fileInput.current.click()} className="text-slate-400 hover:text-slate-300 transition-colors">
                <Paperclip className="w-6 h-6" />
            </button>
        </form>
    </div>
  )
}
