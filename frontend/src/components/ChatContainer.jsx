import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMessagesByUserId } from '../store/slices/chatSlice';
import ChatHeader from './ChatHeader';
import { MessageSquareDiff } from 'lucide-react';
import moment from 'moment';
import Message from '../../../backend/src/models/Message';
import MessageInput from './MessageInput';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';

export default function ChatContainer() {
  const dispatch = useDispatch();
  const { selectedUser, messages, isMessagesLoading } = useSelector((state) => state.chat);
  const {authUser} = useSelector((state) => state.auth);
  console.log(
    "%cselectedUser",
    "background: #222; color: #bada55",
    selectedUser
  )
  useEffect(() => {
    if (selectedUser?._id) dispatch(getMessagesByUserId(selectedUser._id));
  }, [selectedUser, dispatch]);

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

  return (
    <>
    <ChatHeader user={selectedUser} />
    <div className="flex-1 px-6 overflow-y-auto py-8">
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

                <div className="max-w-3xl mx-auto space-y-6">
                  {messages.map((msg)=>(

                    <div key={msg._id} className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start" }`}>
                      <div class="chat-header">
                        {/* {msg.senderId === authUser._id ? authUser.username : selectedUser.username} */}
                        <time class="text-xs opacity-50">{moment(msg.createdAt).fromNow()}</time>
                      </div>
                      <div className={`chat-bubble relative 
                        ${msg.senderId === authUser._id 
                        ? "chat-bubble-primary" 
                        : "chat-bubble-secondary" }`}>
                        {msg.image && (
                          <img src={msg.image} alt="shared image" className='rounded-lg h-50 object-cover' />
                          )}
                          {msg.content && <p className='mt-1'>{msg.content}</p>}
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          }
          </>


        ): isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ):
        (
          <div className="flex items-center justify-center flex-col space-y-4">
            <MessageSquareDiff className="w-12 h-12 text-slate-400" />
            <p className="text-slate-400">Start your conversation with {selectedUser.username}</p>
          </div>
        )}
    </div>

    <MessageInput />
    </>
  )
}
