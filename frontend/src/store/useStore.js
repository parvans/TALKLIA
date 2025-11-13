import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'
import chatReducer from './slices/chatSlice.js'
import { socketMiddleware } from './middleware/socketMiddleware.js';

export default configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
   middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // just to be safe with socket refs internally
    }).concat(socketMiddleware),
});