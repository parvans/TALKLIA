import React, { useEffect } from 'react'
import UserLetterAvatar from './UserLetterAvatar'
import { ArrowLeft } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../store/slices/chatSlice';

export default function ChatHeader({user}) {
    const dispatch = useDispatch();
    const {selectedUser} = useSelector((state) => state.chat);

    useEffect(()=>{
        const hadleKeyPress = (e)=>{
            if(e.key === "Escape"){
                dispatch(setSelectedUser(null));
            }
        }

        window.addEventListener("keydown", hadleKeyPress);
        return ()=>{
            window.removeEventListener("keydown", hadleKeyPress);
        }
    },[selectedUser]);
  return (
   <div className="flex justify-between items-center bg-slate-800 p-4 border-b border-slate-700/60">
    
    <div className="flex items-center gap-3">
        <button 
        className="w-5 h5 text-slate-400 hover:text-slate-300 transition-colors"
        onClick={()=>dispatch(setSelectedUser(null))}
        >
        <ArrowLeft className="w-6 h-6 text-slate-400" />
        </button>
        { user?.profilePicture ?
        (<div className="avatar online">
            <div className="size-14 rounded-full overflow-hidden relative-group border-2 border-slate-500/70 hover:border-slate-300/80 transition-border">
                <img 
                src={user?.profilePicture || ""}
                alt="img"
                className="w-full h-full object-cover"
                />
            </div>
        </div>):(<UserLetterAvatar name={user?.username} />)}
        <div>
            <h3 className="font-semibold text-slate-200">{user?.username}</h3>
            <span className="text-xs text-slate-400">Online</span>
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
