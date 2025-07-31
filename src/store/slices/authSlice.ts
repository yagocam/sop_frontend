import { createSlice } from '@reduxjs/toolkit'
import { registerUser, loginUser } from '../auth/authThunks'

interface AuthState {
  token: string | null
  loading: boolean
  error: string | null
  registerSuccess: boolean 
}
const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

const initialState: AuthState = {
  token: getInitialToken(),
  loading: false,
  error: null,
  registerSuccess: false,  
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.token = null
      localStorage.removeItem('token')
    },
    resetRegisterSuccess: state => {
      state.registerSuccess = false
    }
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true
        state.error = null
        state.registerSuccess = false 
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
        state.registerSuccess = true 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.registerSuccess = false
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
      })
  },
})

export const { logout, resetRegisterSuccess } = authSlice.actions
export default authSlice.reducer
