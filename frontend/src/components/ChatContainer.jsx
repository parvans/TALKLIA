import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMessagesByUserId } from '../store/slices/chatSlice';
import ChatHeader from './ChatHeader';
import { ArrowDown01, ArrowDown01Icon, ArrowDownCircle, ArrowDownIcon, MessageSquareDiff, MoreVertical } from 'lucide-react';
import moment from 'moment';
// import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';
import { useState } from 'react';
import MessageText from './MessageText';

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
      // style={{ maxHeight: "calc(100vh - 200px)" }}
      onScroll={handleScroll}
      >
      {
        messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto">
            {
              groupArrays.map((group, index1)=>(
                <div key={`group-${index1}-${group.date}`}>
                  {/* date */}
                  <div className="text-center text-slate-400 text-xs 
                  my-2 uppercase font-semibold sticky top-0 py-2 z-10 rounded-sm bg-slate-800/50 backdrop-blur-sm">
                    {group.date}
                  </div>
                  {/* messages */}

                  <div className="space-y-4">
                    {group?.messages.map((msg, index2)=>{
                      const senderId = String(msg.sender && (msg.sender._id ?? msg.sender));
                      const isMine = senderId === String(authUser._id);
                      
                      return(
                        <div key={`msg-${msg._id}-${index2}`} className={`chat ${isMine? "chat-end" : "chat-start" }`}>
                          
                          
                          <div className={`chat-bubble relative break-words whitespace-pre-wrap
                            ${isMine
                            ? "chat-bubble bg-blue-600 text-white" 
                            : "chat-bubble bg-slate-700 text-gray-100" }`}
                            style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                            >
                              {/* dropdown */}
                             {/* {isMine && ( <div className={`dropdown absolute top-1 ${isMine ? "-left-6" : "-right-6"}`}>
                                <div tabIndex={0} className="p-1 rounded-full hover:bg-slate-600/50">
                                  <MoreVertical size={16} />
                                </div>
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                  <li><a>Item 1</a></li>
                                  <li><a>Item 2</a></li>
                                </ul>
                                </div>
                            )} */}
                            {msg.image && (
                              <img src={msg.image} alt="shared image" className='rounded-sm h-22 w-22 object-cover' />
                              )}
                              {msg.content && <MessageText content={msg.content} />}
                          </div>
                          {/* <div className={`absolute top-1 ${isMine ? "-left-6" : "-right-6"} opacity-0 group-hover:opacity-100 transition-opacity`}>
                            <button className="p-1 rounded-full hover:bg-slate-600/50">
                              <MoreVertical size={16} />
                            </button>
                          </div> */}
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
        className='fixed bottom-[6rem] right-8 bg-blue-600 hover:bg-blue-700 
        text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50'
        onClick={scrollToBottom}
        >
          <ArrowDownIcon size={20} />
        </button>)}
    </div>

    {/* <MessageInput /> */}
    </>
  )
}
