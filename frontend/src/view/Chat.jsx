import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import BorderAnimatedContainer from '../components/BorderAnimatedContainer';
import ActiveTabSwitch from '../components/ActiveTabSwitch';
import ChatsList from '../components/ChatsList';
import ContactsList from '../components/ContactsList';
import ProfileHeader from '../components/ProfileHeader.JSX';
import WelcomeScreen from '../components/WelcomeScreen';
import ChatContainer from '../components/ChatContainer';
import { useEffect } from 'react';
import MessageInput from '../components/MessageInput';
import { markMessagesAsRead, resetUnread } from '../store/slices/chatSlice';

export default function Chat() {
  const dispatch = useDispatch();
  const { activeTab, selectedChat } = useSelector((state) => state.chat);

   useEffect(() => {
    if (!selectedChat?._id) return;
    // only work if the selected chat is not the current chat
    dispatch(resetUnread(selectedChat._id));

    dispatch(markMessagesAsRead(selectedChat._id));
  }, [selectedChat?._id]);



  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-full max-w-6xl h-screen">
        <BorderAnimatedContainer>
          {/* LEFT */}
          <div 
          className={`w-full md:w-80 bg-slate-900/60 backdrop-blur-sm flex flex-col
              ${selectedChat ? 'hidden' : 'flex'} md:flex
            `}
          >
            <ProfileHeader />
            <ActiveTabSwitch />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === 'chats' ? <ChatsList /> : <ContactsList />}
            </div>
          </div>

          {/* RIGHT */}
          <div
          id='PP'
           className={`w-full md:flex-1 flex flex-col bg-slate-800/60 backdrop-blur-sm
              ${selectedChat ? 'flex' : 'hidden'} md:flex
            `}
          >
            {selectedChat ? (
              <div className="flex flex-col h-full">
                <ChatContainer />
                 <MessageInput />
              </div>
            ) : (<WelcomeScreen />)}
          </div>
          
        </BorderAnimatedContainer>
      </div>
    </div>
  )
}
