import React, { useEffect } from 'react'
import UserLetterAvatar from './UserLetterAvatar'
import { ArrowLeft } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedChat } from '../store/slices/chatSlice';

export default function ChatHeader({user}) {
    const dispatch = useDispatch();
    const { selectedChat } = useSelector((state) => state.chat);
    const { authUser, onlineUsers } = useSelector((state) => state.auth);
    const theUser = selectedChat?.users.find((u) => u._id !== authUser._id);

    useEffect(()=>{
        const hadleKeyPress = (e)=>{
            if(e.key === "Escape"){
                dispatch(setSelectedChat(null));
            }
        }

        window.addEventListener("keydown", hadleKeyPress);
        return ()=>{
            window.removeEventListener("keydown", hadleKeyPress);
        }
    },[selectedChat]);
  return (
   <div className="flex justify-between items-center bg-slate-800 p-1 border-b border-slate-700/60">
    
    <div className="flex items-center gap-3">
        <button 
        className="w-5 h5 text-slate-400 hover:text-slate-300 transition-colors"
        onClick={()=>dispatch(setSelectedChat(null))}
        >
        <ArrowLeft className="w-6 h-6 text-slate-400" />
        </button>
        { theUser?.profilePicture ?
        (<div className={`avatar ${onlineUsers?.includes(theUser._id) ? 'online' : 'offline'}`}>
            <div className="size-14 rounded-full overflow-hidden relative-group border-2 border-slate-500/70 hover:border-slate-300/80 transition-border">
                <img 
                src={theUser?.profilePicture || ""}
                alt="img"
                className="w-full h-full object-cover"
                />
            </div>
        </div>):(<UserLetterAvatar user={theUser} />)}
        <div>
            <h3 className="font-semibold text-slate-200">{theUser?.username}</h3>
            <span className="text-xs text-slate-400">{onlineUsers?.includes(theUser._id) ? "Online" : "Offline"}</span>
        </div>
    </div>
    {/* <div className="flex items-center gap-3">
        <button className="size-12 rounded-full overflow-hidden relative-group border-2 border-slate-500/70 hover:border-slate-300/80 transition-border p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        </button>
        <button className="size-12 rounded-full overflow-hidden relative-group border-2 border-slate-500/70 hover:border-slate-300/80 transition-border p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L12 12M12 12L15 15M12 12L9 9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>

    </div> */}
   </div>
  )
}
