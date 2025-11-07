// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../lib/axios'
import toast from 'react-hot-toast'

// ✅ check if user is authenticated (token stored on backend or cookie)
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/auth/protected')
    return res.data
  } catch (error) {
    console.error('Error in checkAuth:', error)
    return thunkAPI.rejectWithValue(null)
  }
})

// ✅ signup user
export const signup = createAsyncThunk('auth/signup', async (formData, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/auth/signup', formData)
    toast.success('Account created successfully!')
    return res.data
  } catch (error) {
    toast.error(error.response?.data?.message || 'Signup failed. Please try again.')
    return thunkAPI.rejectWithValue(error.response?.data)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
  },
  reducers: {
    logout: (state) => {
      state.authUser = null
      localStorage.removeItem('user')
      toast.success('Logged out successfully')
    },
  },
  extraReducers: (builder) => {
    // checkAuth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false
        state.authUser = action.payload
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false
        state.authUser = null
      })

    // signup
    builder
      .addCase(signup.pending, (state) => {
        state.isSigningUp = true
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isSigningUp = false
        state.authUser = action.payload
      })
      .addCase(signup.rejected, (state) => {
        state.isSigningUp = false
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
