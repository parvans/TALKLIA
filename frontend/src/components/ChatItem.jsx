import React from 'react'
import UserLetterAvatar from './UserLetterAvatar'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedChat, accessChat} from '../store/slices/chatSlice';
import moment from 'moment';

export default function ChatItem({ chat, type }) {
  const dispatch = useDispatch();
  const { authUser, onlineUsers } = useSelector((state) => state.auth);

  let chatUser;
  if (type === "contact") {
    chatUser = chat;
  } else {
    chatUser = chat.isGroupChat
      ? { username: chat.chatName, profilePicture: chat.chatAvatar }
      : chat.users.find((u) => u._id !== authUser._id);
  }

  const chatImg = chatUser?.profilePicture;

  const handleClick = async () => {
    if (type === "contact") {
      // user clicked on a contact: create or access a chat
      const resultAction = await dispatch(accessChat(chat._id));
      if (accessChat.fulfilled.match(resultAction)) {
        dispatch(setSelectedChat(resultAction.payload));
      }
    } else {
      // user clicked on an existing chat
      dispatch(setSelectedChat(chat));
    }
  };
  

  return (
    <div
      onClick={handleClick}
      className='flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-700 cursor-pointer border-b border-slate-400/50'
    >
        {chatImg ? (
          <div className={`avatar ${onlineUsers?.includes(chatUser._id) ? 'online' : 'offline'}`}>
            <div className="size-12 rounded-full">
              <img src={chatImg} alt="profile" />
            </div>
          </div>
        ) : (
          <UserLetterAvatar user={chatUser} />
        )}

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-200 truncate max-w-[105px]">{chatUser?.username}</h3>
          {/* In the right-side section where you have timestamp: */}
          <div className="flex flex-col items-end space-y-1">
            {type === "chat" && (
              <span className="text-xs text-slate-400 whitespace-nowrap">
                {moment(chat?.latestMessage?.createdAt).fromNow()}
              </span>
            )}
            
            {/* Unread indicator on the right */}
            {type === "chat" && chat.unreadCount > 0 && (
              <span className="bg-green-600 text-slate-200 text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                {chat.unreadCount > 100 ? "99+" : chat.unreadCount}
              </span>
            )}
          </div>
        </div>
       { type === "chat" && (
        <p className="text-sm text-slate-400 truncate max-w-[140px]">
          {chat?.latestMessage?.sender._id === authUser._id ? "You: " : ""}
          {
            chat?.latestMessage?.isDeleted ? "Message deleted" :
          chat?.latestMessage?.content}
        </p>)}
      </div>
    </div>
  )
}
