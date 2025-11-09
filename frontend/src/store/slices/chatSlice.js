import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";


export const fetchAllContacts = createAsyncThunk('messages/contacts', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/messages/contacts');
    return res.data;
  } catch (error) {
    console.error('Error in fetchAllContacts:', error);
    return thunkAPI.rejectWithValue(null);
  }
});

export const getChats = createAsyncThunk('messages/chats', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/messages/chats');
    return res.data;
    } catch (error) {
    console.error('Error in getChats:', error);
    return thunkAPI.rejectWithValue(null);
  }
});

export const getMessagesByUserId = createAsyncThunk('messages/:id', async (id, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/messages/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error in getMessagesByUserId:', error);
    return thunkAPI.rejectWithValue(null);
  }
});


const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        allContacts: [],
        chats:[],
        messages:[],
        activeTab: 'chats', // 'chats' or 'contacts'
        selectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false,
        isToneEnabled: JSON.parse(localStorage.getItem('isToneEnabled')) === true
    },
    reducers: {
        toggleTone: (state) => {
            state.isToneEnabled = !state.isToneEnabled;
            localStorage.setItem('isToneEnabled', state.isToneEnabled);
        },
        setActiveTab: (state, action) => {
          state.activeTab = action.payload;
        },
        setSelectedUser: (state, action) => {
          state.selectedUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        // fetchAllContacts
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

        // getChats
        builder
          .addCase(getChats.pending, (state) => {
            state.isUsersLoading = true;
          })
          .addCase(getChats.fulfilled, (state, action) => {
            state.isUsersLoading = false;
            state.chats = action.payload;
          })
          .addCase(getChats.rejected, (state) => {
            state.isUsersLoading = false;
          });

        // getMessagesByUserId
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
      },
});

export const { toggleTone, setActiveTab, setSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;