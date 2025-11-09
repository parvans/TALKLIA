import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../store/slices/chatSlice';
export default function ActiveTabSwitch() {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state) => state.chat);  

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2">
      <button 
      className={`tab ${activeTab === 'chats' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400'}`}
      onClick={() => dispatch(setActiveTab('chats'))}
      >
      Chats
      </button>
      <button 
      className={`tab ${activeTab === 'contacts' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400'}`}
      onClick={() => dispatch(setActiveTab('contacts'))}
      >
      Contacts
      </button>
    </div>
  )
}
