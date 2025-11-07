import { createSlice } from '@reduxjs/toolkit'

const storedUser = JSON.parse(localStorage.getItem('user'))

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authUser: {name: "Parvan S", _id: "6487f3e2f1c2b4a5d6e7f890", age: 30},
    isLoggedIn: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    login: (state) => {
      console.log("We just logged in");
      state.isLoggedIn = true
      state.isLoading = true      
    },
    // loginSuccess: (state, action) => {
    //   state.loading = false
    //   state.user = action.payload.user
    //   state.token = action.payload.token
    //   localStorage.setItem('user', JSON.stringify(action.payload))
    // },
    // loginFailure: (state, action) => {
    //   state.loading = false
    //   state.error = action.payload
    // },
    // logout: (state) => {
    //   state.user = null
    //   state.token = null
    //   localStorage.removeItem('user')
    // },
  },
})

export const { login } = authSlice.actions
export default authSlice.reducer
