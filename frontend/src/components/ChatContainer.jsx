import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMessagesByUserId } from '../store/slices/chatSlice';
import ChatHeader from './ChatHeader';
import { MessageSquareDiff } from 'lucide-react';
import moment from 'moment';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';

export default function ChatContainer() {
  const dispatch = useDispatch();
  const { selectedChat, messages, isMessagesLoading } = useSelector((state) => state.chat);
  const {authUser} = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  console.log(selectedChat);
  

  useEffect(() => {
    if (selectedChat?._id) dispatch(getMessagesByUserId(selectedChat._id));
  }, [selectedChat, dispatch]);

 

  const groupedDays = messages.reduce((groups, message) => {
    const isSameorAfter = moment(message.createdAt).calendar({
      sameDay: "[Today] ",
      nextDay: "[Tomorrow] ",
      nextWeek: "dddd",
      lastDay: "[Yesterday] ",
      lastWeek: "[Last] dddd",
      sameElse: "DD/MM/YYYY",
    });
    const date = isSameorAfter;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const groupArrays = Object.keys(groupedDays).map((date) => {
    return {
      date,
      messages: groupedDays[date],
    };
  });

  console.log(groupArrays);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [dispatch, messages]);

  return (
    <>
    <ChatHeader user={selectedChat} />
    <div className="flex-1 px-6 overflow-y-auto py-8 scroll-smooth">
      {
        messages.length > 0 && !isMessagesLoading ? (
          <>
          {
            groupArrays.map((group, index)=>(
              <div key={index}>
                {/* date */}
                <div className="text-center text-slate-400 text-xs my-2 uppercase font-semibold">
                  {group.date}
                </div>
                {/* messages */}

                <div 
                // ref={messagesEndRef} 
                className="max-w-3xl mx-auto space-y-6"
                style={{ maxHeight: "calc(100vh - 200px)" }}
                >
                  {group?.messages.map((msg)=>{
                    const senderId = String(msg.sender && (msg.sender._id ?? msg.sender));
                    const isMine = senderId === String(authUser._id);
                    return(
                      <div key={msg._id} className={`chat ${isMine? "chat-end" : "chat-start" }`}>
                        {console.log(msg.sender._id === authUser._id)}
                        
                        <div className="chat-header">
                          {/* {msg.senderId === authUser._id ? authUser.username : selectedChat.username} */}
                          <time className="text-xs opacity-50">{moment(msg.createdAt).fromNow()}</time>
                        </div>
                        <div className={`chat-bubble relative 
                          ${isMine
                          ? "chat-bubble bg-blue-600 text-white" 
                          : "chat-bubble bg-slate-700 text-gray-100" }`}>
                          {msg.image && (
                            <img src={msg.image} alt="shared image" className='rounded-lg h-50 object-cover' />
                            )}
                            {msg.content && <p className='mt-1'>{msg.content}</p>}
                          </div>
                      </div>
                    )})}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            ))
          }
          </>
        )
        : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        )
        :
        (
          <div className="flex items-center justify-center flex-col space-y-4">
            <MessageSquareDiff className="w-12 h-12 text-slate-400" />
            {/* <p className="text-slate-400">Start your conversation with {selectedChat.username}</p> */}
          </div>
        )}
    </div>

    <MessageInput />
    </>
  )
}
