import React, { useEffect } from 'react'
import UserLetterAvatar from './UserLetterAvatar'
import { ArrowLeft, Phone, Video } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedChat } from '../store/slices/chatSlice';

export default function ChatHeader({ onAudioCall, onVideoCall }) {
    const dispatch = useDispatch();
    const { selectedChat } = useSelector((state) => state.chat);
    const { authUser, onlineUsers } = useSelector((state) => state.auth);
    
    const theUser = selectedChat?.users.find((u) => u._id !== authUser._id);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Escape") {
                dispatch(setSelectedChat(null));
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [selectedChat]);

    return (
        <div className="flex justify-between items-center bg-slate-800 p-1 border-b border-slate-700/60">
            
            {/* LEFT SECTION */}
            <div className="flex items-center gap-3">
                <button 
                    className="w-5 h-5 text-slate-400 hover:text-slate-300 transition-colors"
                    onClick={() => dispatch(setSelectedChat(null))}
                >
                    <ArrowLeft className="w-6 h-6 text-slate-400" />
                </button>

                {theUser?.profilePicture ? (
                    <div className={`avatar ${onlineUsers?.includes(theUser._id) ? 'online' : 'offline'}`}>
                        <div className="size-14 rounded-full border-2 border-slate-500/70 overflow-hidden">
                            <img src={theUser.profilePicture} className="w-full h-full object-cover" />
                        </div>
                    </div>
                ) : (
                    <UserLetterAvatar user={theUser} />
                )}

                <div>
                    <h3 className="font-semibold text-slate-200">{theUser?.username}</h3>
                    <span className="text-xs text-slate-400">
                        {onlineUsers?.includes(theUser._id) ? "Online" : "Offline"}
                    </span>
                </div>
            </div>

            {/* RIGHT SECTION — CALL BUTTONS */}
            <div className="flex items-center gap-3 pr-3">
                {/* Audio Call */}
                <button
                    onClick={onAudioCall}
                    className="p-2 rounded-full hover:bg-slate-700 transition"
                >
                    <Phone className="w-5 h-5 text-slate-300" />
                </button>

                {/* Video Call */}
                <button
                    onClick={onVideoCall}
                    className="p-2 rounded-full hover:bg-slate-700 transition"
                >
                    <Video className="w-5 h-5 text-slate-300" />
                </button>
            </div>
        </div>
    );
}
