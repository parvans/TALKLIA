import React from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
export default function Chat() {
  const dispatch = useDispatch();
  return (
    <div className='flex flex-col'>
      Chat
      <button type="button" onClick={() => dispatch(logout())}>Logout</button>
      </div>
  )
}
