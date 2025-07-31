import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api/axios'

interface LoginCredentials {
  username: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  name: string
  roles: string
}

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization
    }
    return config
  },
  error => Promise.reject(error)
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/generateToken', credentials)
      const token = response.data as string  // resposta é o token direto

      localStorage.setItem('token', token)

      return { token }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao fazer login')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', {
        ...userData,
        roles: userData.roles,
      })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao registrar usuário')
    }
  }
)
