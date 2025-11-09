import React from 'react'
import UserLetterAvatar from './UserLetterAvatar'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../store/slices/chatSlice';
import moment from 'moment';

export default function ChatItem({ chat, type }) {
  const dispatch = useDispatch();
  const {authUser} = useSelector((state) => state.auth);

  let chatUser;
  if (type === "contact") {
    chatUser = chat;
  } else {
    chatUser = chat.chatUser
  }

  const chatImg = chatUser?.profilePicture;

  return (
    <div
      onClick={() => dispatch(setSelectedUser(chatUser))}
      className='flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-700 cursor-pointer border-b border-slate-400/50'
    >
      {chatImg ? (
        <div className="avatar online">
          <div className="size-12 rounded-full">
            <img src={chatImg} alt="profile" />
          </div>
        </div>
      ) : (
        <UserLetterAvatar name={chatUser?.username} />
      )}

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-slate-200 truncate max-w-[140px]">{chatUser?.username}</h3>
          <span className="text-xs text-slate-400">{moment(chat.createdAt).fromNow()}</span>
        </div>
        <p className="text-sm text-slate-400 truncate max-w-[140px]">
          {chat.content || "Last message"}
        </p>
      </div>
    </div>
  )
}
