import React from 'react'
import UserLetterAvatar from './UserLetterAvatar'

export default function ChatItem({chat, type}) {
    const chatUser = type === "contact" ? chat : chat.receiver;
    const chatImg = chatUser?.profilePicture;
    
  return (
    <div className='flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-700 cursor-pointer border-b border-slate-400/50'>
        {chatImg ? (
            <div className={`avatar online`}>
                <div className="size-12 rounded-full">
                    <img 
                    src={chatImg} 
                    alt="img" 
                    />
                </div>
            </div>): (
                <UserLetterAvatar name={chatUser?.username} />
            )}
        <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-slate-200">{chatUser?.username}</h3>
                <span className="text-xs text-slate-400">12:30 PM</span>
            </div>
            <p className="text-sm text-slate-400">Last message</p>
        </div>
    </div>
  )
}
