import React, { useEffect } from 'react'
import UserLoadingSkeleton from './UserLoadingSkeleton'
import { fetchAllContacts } from '../store/slices/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import NoFound from './NoFound';
import ChatItem from './ChatItem';

export default function ContactsList() {
    const dispatch = useDispatch();
  const { isUsersLoading, allContacts, activeTab } = useSelector((state) => state.chat);

  useEffect(()=>{
    dispatch(fetchAllContacts());
  },[dispatch]);

  if(isUsersLoading) return <UserLoadingSkeleton />
  if(allContacts.length === 0) return <NoFound tab={activeTab} />
  

  return (
    <>
    {
      allContacts.map((contact) => (
        <ChatItem 
          key={contact._id} 
          chat={contact}
          type="contact"
        /> 
      ))
    }
    </>
  )
}
