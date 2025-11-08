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
export default function Chat() {
  const dispatch = useDispatch();
  const { activeTab, selectedUser } = useSelector((state) => state.chat);
  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        {/* LEFT */}
        <div className="w-80 bg-slate-900/60 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'chats' ? <ChatsList /> : <ContactsList />}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex flex-col bg-slate-800/60 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <WelcomeScreen />}
        </div>
        
      </BorderAnimatedContainer>
    </div>
  )
}
