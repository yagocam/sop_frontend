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
      return rejectWithValue(error.response?.data?.message || 'Erro ao criar empenho')
    }
  }
)

export const fetchCommitments = createAsyncThunk(
  'commitments/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Commitment[]>('/api/commitments')
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao buscar empenhos')
    }
  }
)
interface CommitmentState {
  commitments: Commitment[];
  commitment: Commitment | null;
  loading: boolean;
  error: string | null;
}
const commitmentSlice = createSlice({
  name: 'commitments',
  initialState: {
    commitment: null as Commitment | null,
    commitments: [] as Commitment[],
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
  extraReducers: (builder) => {
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

      .addCase(fetchCommitments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCommitments.fulfilled, (state, action) => {
        state.loading = false
        state.commitments = action.payload
      })
      .addCase(fetchCommitments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearCommitment } = commitmentSlice.actions
export default commitmentSlice.reducer
