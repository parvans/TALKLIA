// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

// ✅ check if user is authenticated (token stored on backend or cookie)
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/auth/protected');
    return res.data;
  } catch (error) {
    console.error('Error in checkAuth:', error);
    return thunkAPI.rejectWithValue(null);
  }
});

// ✅ signup user
export const signup = createAsyncThunk('auth/signup', async (formData, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/auth/signup', formData);
    toast.success('Account created successfully!');
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

// ✅ login user
export const login = createAsyncThunk('auth/login', async (formData, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/auth/login', formData);
    toast.success('Logged in successfully!');
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

// ✅ Logout user
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await axiosInstance.post('/auth/logout');
    toast.success('Logged out successfully!');
    return null; // we’ll clear the user on fulfilled
  } catch (error) {
    toast.error('Logout failed. Please try again.');
    console.error('Error in logout:', error);
    return thunkAPI.rejectWithValue(error.response?.data);
  }
});

// update Profile

export const updateProfile = createAsyncThunk('auth/update-profile', async (formData, thunkAPI) => {
  try {
    const res = await axiosInstance.put('/auth/update-profile', formData);
    toast.success('Profile updated successfully!');
    return res.data;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Update failed. Please try again.');
    console.log("Error in update Profile:", error);
    return thunkAPI.rejectWithValue(error.response?.data);
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // checkAuth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.authUser = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.authUser = null;
      });

    // signup
    builder
      .addCase(signup.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isSigningUp = false;
        state.authUser = action.payload;
      })
      .addCase(signup.rejected, (state) => {
        state.isSigningUp = false;
      });

    // login
    builder
      .addCase(login.pending, (state) => {
        state.authUser = null;
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isLoggingIn = false;
      })
      .addCase(login.rejected, (state) => {
        state.authUser = null;
        state.isLoggingIn = false;
      });

    // logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggingOut = false;
        state.authUser = null;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoggingOut = false;
      });

    // updateProfile
    builder
      .addCase(updateProfile.pending, () => {
        // state.isUpdatingProfile = true;
        console.log('Updating profile...');
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        // state.isUpdatingProfile = false;
        console.log('Profile updated successfully!');
        state.authUser = action.payload;
      })
      .addCase(updateProfile.rejected, () => {
        // state.isUpdatingProfile = false;
        console.error('Update failed. Please try again.');
      });

  },
});

export default authSlice.reducer;
