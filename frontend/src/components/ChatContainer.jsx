import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteMessage, editMessage, getMessagesByUserId } from '../store/slices/chatSlice';
import ChatHeader from './ChatHeader';
import { ArrowDownIcon, CircleAlert, Copy, Delete, Edit, MessageSquareDiff, MoreVertical, Trash } from 'lucide-react';
import moment from 'moment';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';
import MessageText from './MessageText';
import useWebRTC from '../hooks/useWebRTC';
import CallUI from './CallUI';
import { useCallback } from 'react';
export default function ChatContainer() {
  const dispatch = useDispatch();
  const { selectedChat, messages, isMessagesLoading } = useSelector((state) => state.chat);
  const {authUser} = useSelector((state) => state.auth);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null); 
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const socket = window.socket;
  const {
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    localStream,
    remoteStream,
    incomingCall,
    isCalling,
    isInCall,
    callType
  } = useWebRTC({
    userId: selectedChat?.users.find(u => u._id !== authUser._id)._id,
    chatId: selectedChat?._id,
    socket
  });

  useEffect(() => {
    if (selectedChat?._id) dispatch(getMessagesByUserId(selectedChat._id));
  }, [selectedChat, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // If clicked inside ANY dropdown → do nothing
      if (e.target.closest(".msg-dropdown")) return;

      // Otherwise close
      setOpenDropdownId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    const handleScroll = () => setOpenDropdownId(null);
    chatContainerRef.current?.addEventListener("scroll", handleScroll);

    return () =>
      chatContainerRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleCopyMsg = (msg) =>{
    navigator.clipboard.writeText(msg);
  }

  const openEditModal = (msg) => {
  const newText = prompt("Edit your message:", msg.content);
  if (newText && newText.trim() !== "" && newText !== msg.content) {
    dispatch(editMessage({ messageId: msg._id, content: newText.trim() }));
    setOpenDropdownId(null);
  }
};

const deleteTheMessage = (msg) => {
  dispatch(deleteMessage({ messageId: msg._id}));
  setOpenDropdownId(null);
};


const onAudioCall = useCallback(() => startCall("audio"), [startCall]);
const onVideoCall = useCallback(() => startCall("video"), [startCall]);


  return (
    <>
    <ChatHeader
      onAudioCall={onAudioCall}
      onVideoCall={onVideoCall}
    />
    <CallUI
        incomingCall={incomingCall}
        isCalling={isCalling}
        isInCall={isInCall}
        localStream={localStream}
        remoteStream={remoteStream}
        acceptCall={acceptCall}
        rejectCall={rejectCall}
        endCall={endCall}
        callType={callType}
      />
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
                      const isLastMessage = index1 === groupArrays.length - 1 &&
                      index2 === group.messages.length - 1;
                      const messageType = msg.messageType;
                      
                      return(
                        <>
                        {messageType === "call" ? (
                          <div key={`call-${msg._id}-${index2}`} className="chat flex justify-center items-center">
                            <div className="chat-bubble relative break-words whitespace-pre-wrap pr-10 
                              bg-slate-700 text-gray-100"
                              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                              >
                                <p className="text-sm text-slate-200 italic flex items-center gap-2">
                                  <CircleAlert size={16} />
                                  This message is a call
                                  </p>

                                <p className="text-sm text-slate-200 italic flex items-center gap-2">
                                  <CircleAlert size={16} />
                                  Call Status: {msg.callStatus}
                                  </p>

                                <p className="text-sm text-slate-200 italic flex items-center gap-2">
                                  <CircleAlert size={16} />
                                  Call Duration: {msg.callDuration} seconds
                                  </p>

                                <p className="text-sm text-slate-200 italic flex items-center gap-2">
                                  <CircleAlert size={16} />
                                  Call Type: {msg.callType}
                                  </p>
                            </div>
                          </div>
                        ):(
                          <div key={`msg-${msg._id}-${index2}`} className={`chat ${isMine? "chat-end" : "chat-start" }`}>
                          
                            <div className={`chat-bubble relative break-words whitespace-pre-wrap pr-10
                              ${isMine ? " bg-blue-400 text-white" : " bg-slate-700 text-gray-100" }`}
                              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                              >
                                {
                                  msg.isDeleted ? (
                                    <p className="text-sm text-slate-200 italic flex items-center gap-2">
                                      <CircleAlert size={16} />
                                      This message has been deleted
                                      </p>
                                  ) : (
                                    <>
                                      {isMine && ( 
                                        <div className="msg-dropdown absolute top-1 right-1 z-30" data-id={msg._id}>
                                          <button
                                            className="p-1 rounded-full hover:bg-black/20"
                                            onClick={() =>                                      
                                              setOpenDropdownId(openDropdownId === msg._id ? null : msg._id)
                                            }
                                          >
                                            <MoreVertical size={16} />
                                          </button>
        
                                          {openDropdownId === msg._id && (
                                            <ul  
                                            className={`absolute right-0 w-36 bg-white text-black rounded-md shadow-lg
                                              ${isLastMessage ? "bottom-full mb-2" : "top-full mt-2"}
                                            `}
                                            >
                                              <li 
                                                onClick={handleCopyMsg(msg.content)}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                <Copy size={16} /> Copy
                                              </li>
                                                <li
                                                  onClick={() => openEditModal(msg)}
                                                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                  >
                                                  <Edit size={16} /> Edit
                                                </li>
                                                <li 
                                                onClick={() => deleteTheMessage(msg)}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                                                >
                                                <Trash size={16} /> Delete
                                                </li>
                                            </ul>
                                          )}
                                          </div>
                                      )}
                                      {msg.image && (
                                        <img src={msg.image} alt="shared image" className='rounded-sm h-22 w-22 object-cover' />
                                      )}
                                      {msg.audio && (
                                        <audio
                                          controls
                                          src={msg.audio}
                                          className="w-70 mt-2 h-10"
                                          controlsList="nodownload"
                                        />
                                        // <VoiceMessage 
                                        //   audioUrl={msg.audio}
                                        //   duration={msg.audioDuration}
                                        // />
                                      )}
                                      {msg.content && <MessageText content={msg.content} />}
                                      {(msg.isEdited && !msg.isDeleted) && (
                                        <span className="text-xs opacity-50 ml-2 italic">Edited</span>
                                      )} 
                                    </>
                                    
                                  )
                                }
                            </div>
                          
                          
                          <div className="chat-footer">
                          <time className="text-xs opacity-50">{moment(msg.createdAt).fromNow()}</time>
                          </div>
                        </div>
                        )}
                        </>
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
        text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-1'
        onClick={scrollToBottom}
        >
          <ArrowDownIcon size={20} />
        </button>)}
    </div>

    {/* <MessageInput /> */}
    </>
  )
}
