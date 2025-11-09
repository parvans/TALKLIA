import React from 'react'
import { useDispatch } from 'react-redux';
import { setActiveTab } from '../store/slices/chatSlice';

export default function NoFound({ tab }) {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center justify-center flex-col space-y-4">
      <h4>No {tab === 'chats' ? 'Chats' : 'Contacts'} Found</h4>
      {tab === 'chats' && (
        <button className="btn btn-sm bg-slate-600 hover:bg-slate-700"
          onClick={() => dispatch(setActiveTab('contacts'))}
        >Contacts</button>
      )}
    </div>
  )
}
