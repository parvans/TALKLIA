// src/store/middleware/socketMiddleware.js
import { io } from "socket.io-client";
import { setOnlineUsers } from "../slices/authSlice";
import { newMessageReceived } from "../slices/chatSlice";

const BASEURL = import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "/";

let socket = null;

export const socketMiddleware = (storeAPI) => (next) => (action) => {
  const { dispatch, getState } = storeAPI;
  const result = next(action);

  const { authUser } = getState().auth;

  switch (action.type) {
    // Connect
    case "auth/connectSocket":
      if (!authUser || socket?.connected) break;

      socket = io(BASEURL, { withCredentials: true });
      socket.connect();

      // Handle incoming events
      socket.on("onlineUsers", (userIds) => {
        dispatch(setOnlineUsers(userIds));
      });

      socket.on("newMessage", (message) => {
        const { selectedChat, isToneEnabled } = getState().chat;
        if (selectedChat && message.chat._id === selectedChat._id) {
          dispatch(newMessageReceived(message));
        }else{
          // + unread count
          dispatch({ type: 'chat/incrementUnread', payload: message.chat._id });
          
          // notification sound
          if(isToneEnabled){
            const notificationSound = new Audio('/sounds/notification.mp3');
            notificationSound.currentTime = 0;
            notificationSound.play().catch((error)=>console.log("Audio play failed",error));

          }
        }
      });
      break;

    // Disconnect
    case "auth/disconnectSocket":
      if (socket && socket.connected) {
        socket.disconnect();
        socket = null;
      }
      break;

    // Send message
    case "messages/send/fulfilled":
      if (socket && socket.connected && action.payload) {
        socket.emit("sendMessage", action.payload);
      }
      break;

    default:
      break;
  }

  return result;
};
