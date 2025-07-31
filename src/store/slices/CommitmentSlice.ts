import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api/axios'
import { Commitment } from '@/types'

export const createCommitment = createAsyncThunk(
  'commitments/create',
  async (commitmentData: Partial<Commitment>, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/commitments', commitmentData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)

const commitmentSlice = createSlice({
  name: 'commitments',
  initialState: {
    commitment: null as Commitment | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    clearCommitment: (state) => {
      state.commitment = null
      state.loading = false
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(createCommitment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCommitment.fulfilled, (state, action) => {
        state.loading = false
        state.commitment = action.payload
      })
      .addCase(createCommitment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearCommitment } = commitmentSlice.actions
export default commitmentSlice.reducer
