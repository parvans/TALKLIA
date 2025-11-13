import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";


// CONTACTS
export const fetchAllContacts = createAsyncThunk('messages/contacts', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/messages/contacts');
    return res.data;
  } catch (error) {
    console.error('Error in fetchAllContacts:', error);
    return thunkAPI.rejectWithValue(null);
  }
});

// CHATS
export const fetchChats = createAsyncThunk('chat/chats', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/chat');
    return res.data;
    } catch (error) {  
    console.error('Error in getChats:', error);
    return thunkAPI.rejectWithValue(null);
  }
});

export const accessChat = createAsyncThunk('chat/:userId', async (userId, thunkAPI) => {
  try {
    const res = await axiosInstance.post(`/chat/${userId}`);
    return res.data;
  } catch (error) {
    console.error('Error in accessChat:', error);
    return thunkAPI.rejectWithValue(null);
  }
});

// MESSAGES
export const getMessagesByUserId = createAsyncThunk('messages/:chatId', async (chatId, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/messages/${chatId}`);
    return res.data;
  } catch (error) {
    console.error('Error in getMessagesByUserId:', error);
    return thunkAPI.rejectWithValue(null);
  }
});

export const sendMessage = createAsyncThunk('messages/send/:chatId', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post(`/messages/send/${data.chatId}`, data);
    return res.data;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return thunkAPI.rejectWithValue(null);
  }
})

export const markMessagesAsRead = createAsyncThunk('messages/mark-read/:chatId', async (chatId, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/messages/mark-read/${chatId}`);
    return res.data;
  } catch (error) {
    console.error('Error in markMessagesAsRead:', error);
    return thunkAPI.rejectWithValue(null);
  }
})


const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        allContacts: [],
        chats:[],
        messages:[],
        activeTab: 'chats', // 'chats' or 'contacts'
        selectedChat: null,
        isUsersLoading: false,
        isMessagesLoading: false,
        isSending: false,
        isToneEnabled: JSON.parse(localStorage.getItem('isToneEnabled')) === true,
        unreadCount: 0
    },
    reducers: {
        toggleTone: (state) => {
            state.isToneEnabled = !state.isToneEnabled;
            localStorage.setItem('isToneEnabled', state.isToneEnabled);
        },
        setActiveTab: (state, action) => {
          state.activeTab = action.payload;
        },
        setSelectedChat: (state, action) => {
          state.selectedChat = action.payload;
          // Don't clear messages unless chat actually changes
          if (!state.selectedChat || state.selectedChat._id !== action.payload._id) {
          state.messages = [];
          }
        },
        newMessageReceived: (state, action) => {
          state.messages.push(action.payload);
        },
      incrementUnread: (state, action) => {
        const chatId = action.payload;
        const chat = state.chats.find(c => c._id === chatId);
        if (chat) chat.unreadCount = (chat.unreadCount || 0) + 1;
        state.unreadCount = (state.unreadCount || 0) + 1;
      },
      resetUnread: (state, action) => {
        const chatId = action.payload;
        const chat = state.chats.find(c => c._id === chatId);
        if (chat) chat.unreadCount = 0;
        state.unreadCount = 0;
      },

    },
    extraReducers: (builder) => {
        // Contacts
        builder
          .addCase(fetchAllContacts.pending, (state) => {
            state.isUsersLoading = true;
          })
          .addCase(fetchAllContacts.fulfilled, (state, action) => {
            state.isUsersLoading = false;
            state.allContacts = action.payload;
          })
          .addCase(fetchAllContacts.rejected, (state) => {
            state.isUsersLoading = false;
          });

        // Chats
        builder
          // .addCase(fetchChats.pending, (state) => {
          //   // state.isUsersLoading = true;
          // })
          .addCase(fetchChats.fulfilled, (state, action) => {
            state.isUsersLoading = false;
            const incomingChats = action.payload;

            // Keep previous unread counts
            state.chats = incomingChats.map((newChat) => {
              const existing = state.chats.find((c) => c._id === newChat._id);
              return {
                ...newChat,
                unreadCount: existing ? existing.unreadCount : newChat.unreadCount || 0,
              };
            });

          })
          .addCase(fetchChats.rejected, (state) => {
            state.isUsersLoading = false;
          });

        // Access Chat
        builder
          .addCase(accessChat.pending, (state) => {
            state.isUsersLoading = true;
          })
          .addCase(accessChat.fulfilled, (state, action) => {
            state.isUsersLoading = false;
            const existingChat = state.chats.find(chat => chat._id === action.payload._id);
            if (!existingChat) {
              // Add it if it's a new chat
              state.chats.push(action.payload);
              state.activeTab = 'chats';
            }

            // Also, set it as the currently selected chat
            state.selectedChat = action.payload;
            state.messages = [];
          })
          .addCase(accessChat.rejected, (state) => {
            state.isUsersLoading = false;
          });

        // Messages
        builder
          .addCase(getMessagesByUserId.pending, (state) => {
            state.isMessagesLoading = true;
          })
          .addCase(getMessagesByUserId.fulfilled, (state, action) => {
            state.isMessagesLoading = false;
            state.messages = action.payload;
          })
          .addCase(getMessagesByUserId.rejected, (state) => {
            state.isMessagesLoading = false;
          });

        // Send Message
        builder
          .addCase(sendMessage.pending, (state) => {
            state.isSending  = true;
          })
          .addCase(sendMessage.fulfilled, (state, action) => {
            state.isSending  = false;
             state.messages.push(action.payload);
          })
          .addCase(sendMessage.rejected, (state) => {
            state.isSending  = false;
          });
      },
});

export const { 
  toggleTone, 
  setActiveTab, 
  setSelectedChat, 
  newMessageReceived,
  resetUnread 
} = chatSlice.actions;
export default chatSlice.reducer;