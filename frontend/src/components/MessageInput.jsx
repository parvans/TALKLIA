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
    const { isToneEnabled, selectedUser } = useSelector(state => state.chat);

    const handleSendMessage = (e)=>{
        e.preventDefault();
        if(!text.trim() && !imagePreview) return;
        if(isToneEnabled) playRandonKeyStrokeSound();
        dispatch(sendMessage({
            content:text.trim(), 
            image:imagePreview,
            id:selectedUser._id
        }));
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
            <input type="text" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type a message..." className="w-full bg-slate-800 py-2 px-4 rounded-md focus:outline-none" />
            <button type="submit" className="text-slate-400 hover:text-slate-300 transition-colors">
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
