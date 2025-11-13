import React, { useEffect } from 'react'
import UserLoadingSkeleton from './UserLoadingSkeleton'
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, setSelectedChat } from '../store/slices/chatSlice';
import NoFound from './NoFound';
import ChatItem from './ChatItem';

export default function ChatsList() {
  const dispatch = useDispatch();
  const { isUsersLoading, chats, activeTab, messages, unreadCount } = useSelector((state) => state.chat);

  useEffect(()=>{
    dispatch(fetchChats());
  },[dispatch, messages, unreadCount]);

  if(isUsersLoading) return <UserLoadingSkeleton />
  if(chats.length === 0) return <NoFound tab={activeTab} />
  return (
    <>
    {
      chats.map((chat) => (
        <ChatItem 
          key={chat._id} 
          chat={chat}
          type="chat"
        />
      ))
    }
    </>
  )
}
