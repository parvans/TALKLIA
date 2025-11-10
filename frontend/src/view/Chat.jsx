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
export default function Chat() {
  const dispatch = useDispatch();
  const { activeTab, selectedChat } = useSelector((state) => state.chat);
  const { socket } = useSelector((state) => state.auth);


  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      if (selectedChat && message.chat._id === selectedChat._id) {
        dispatch({ type: "chat/newMessageReceived", payload: message });
      }
    });

    return () => socket.off("newMessage");
  }, [socket, selectedChat, dispatch]);


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
           className={`w-full md:flex-1 flex flex-col bg-slate-800/60 backdrop-blur-sm
              ${selectedChat ? 'flex' : 'hidden'} md:flex
            `}
          >
            {selectedChat ? <ChatContainer /> : <WelcomeScreen />}
          </div>
          
        </BorderAnimatedContainer>
      </div>
    </div>
  )
}
