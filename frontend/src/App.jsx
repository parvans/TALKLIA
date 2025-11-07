import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './view/SignUp'
import Login from './view/Login'
import Chat from './view/Chat'
import { useDispatch, useSelector } from 'react-redux'
import { login } from './store/slices/authSlice.js'

export default function App() {
  const dispatch = useDispatch()
  const { authUser, isLoggedIn, isLoading } = useSelector((state) => state.auth)
  console.log(authUser);
  console.log(isLoggedIn);
  console.log(isLoading);
  console.log(error);
  
  return (
    <div className="min-h-screen bg-gradient-radial from-cyan-500 to-blue-500
    relative flex items-center justify-center p-4 overflow-hidden">
      {/* decorator */}
      <h3 onClick={() => dispatch(login())}>Login</h3>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Chat />} />
      </Routes>
    </div>
  )
}