import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMessagesByUserId } from '../store/slices/chatSlice';
import ChatHeader from './ChatHeader';
import { ArrowDown01, ArrowDown01Icon, ArrowDownCircle, ArrowDownIcon, MessageSquareDiff } from 'lucide-react';
import moment from 'moment';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';
import { useState } from 'react';

export default function ChatContainer() {
  const dispatch = useDispatch();
  const { selectedChat, messages, isMessagesLoading } = useSelector((state) => state.chat);
  const {authUser} = useSelector((state) => state.auth);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);  

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
  

  // const topLabel = document.getElementById("date-label");
  // const messageBox = document.getElementById("chatbox");

  // const stickeyDate = () => {
  //   const dateLabels = document.querySelectorAll(".divider");
  //   let currentLabel = null;
  //   dateLabels.forEach((label) => {
  //     if (messageBox?.scrollTop >= label.offsetTop) {
  //       currentLabel = label;
  //     }
  //   });
  //   if (currentLabel) {
  //     topLabel && (topLabel.style.opacity = 1);
  //     topLabel.innerText = currentLabel.innerText;
  //   } else {
  //     topLabel && (topLabel.style.opacity = 0);
  //   }

  //   setTimeout(() => {
  //     topLabel && (topLabel.style.opacity = 0);
  //     topLabel && (topLabel.style.transition = "opacity 0.5s");
  //   }, 2000);
  // };

  // Sort groupArrays by date (most recent first)
  // groupArrays.sort((a, b) => {
  //   const dateA = moment(a.messages[0].createdAt);
  //   const dateB = moment(b.messages[0].createdAt);
  //   return dateA - dateB; // Oldest first
  // });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollButton(false);
  };
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px threshold
      setShowScrollButton(!isAtBottom);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  

  return (
    <>
    <ChatHeader user={selectedChat} />
    <div 
      ref={chatContainerRef} 
      className="flex-1 px-6 overflow-y-auto py-8 scroll-smooth"
      style={{ maxHeight: "calc(100vh - 200px)" }}
      onScroll={handleScroll}
      >
      {
        messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto">
            {
              groupArrays.map((group, index1)=>(
                <div key={`group-${index1}-${group.date}`}>
                  {/* date */}
                  <div className="text-center text-slate-400 text-xs my-2 uppercase font-semibold sticky top-0 py-2 z-10">
                    {group.date}
                  </div>
                  {/* messages */}

                  <div className="space-y-4">
                    {group?.messages.map((msg, index2)=>{
                      const senderId = String(msg.sender && (msg.sender._id ?? msg.sender));
                      const isMine = senderId === String(authUser._id);
                      
                      return(
                        <div key={`msg-${msg._id}-${index2}`} className={`chat ${isMine? "chat-end" : "chat-start" }`}>
                          
                          
                          <div className={`chat-bubble relative 
                            ${isMine
                            ? "chat-bubble bg-blue-600 text-white" 
                            : "chat-bubble bg-slate-700 text-gray-100" }`}>
                            {msg.image && (
                              <img src={msg.image} alt="shared image" className='rounded-sm h-22 w-22 object-cover' />
                              )}
                              {msg.content && <p className='mt-1'>{msg.content}</p>
                              }
                            </div>
                            <div className="chat-footer">
                            <time className="text-xs opacity-50">{moment(msg.createdAt).fromNow()}</time>
                          </div>
                        </div>
                    )})}
                  </div>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>
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

        {/* scroll button */}

        {showScrollButton &&(
          <button 
        className='fixed bottom-[8rem] right-8 bg-blue-600 hover:bg-blue-700 
        text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50'
        onClick={scrollToBottom}
        >
          <ArrowDownIcon size={20} />
        </button>)}
    </div>

    <MessageInput />
    </>
  )
}
