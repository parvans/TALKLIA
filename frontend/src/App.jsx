import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './view/SignUp'
import Login from './view/Login'
import Chat from './view/Chat'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth, connectSocket, disconnectSocket } from './store/slices/authSlice.js'
import PageLoader from './components/PageLoader.jsx'
import { Toaster } from 'react-hot-toast';

export default function App() {
  const dispatch = useDispatch()
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth)
  
  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch]);

  useEffect(()=>{
    if (authUser) {
      dispatch(connectSocket());
    } else {
      dispatch(disconnectSocket());
    }
  }, [authUser, dispatch]);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted");
    } else {
      console.log("Notification permission denied");
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);


  if(isCheckingAuth) return <PageLoader/>
  return (
    <div className="min-h-screen bg-gradient-radial from-cyan-500 to-blue-500 relative flex items-center justify-center p-4 overflow-hidden">
      {/* decorator */}
      <Routes>
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={authUser ? <Chat /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}