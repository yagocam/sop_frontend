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
export const updateCommitment = createAsyncThunk(
  'commitments/update',
  async ({ id, data }: { id: number; data: Partial<Commitment> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/commitments/${id}`, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao atualizar empenho')
    }
  }
)

export const deleteCommitment = createAsyncThunk(
  'commitments/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/commitments/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao excluir empenho')
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
      .addCase(updateCommitment.fulfilled, (state, action) => {
        const index = state.commitments.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.commitments[index] = action.payload
        }
      })
      .addCase(updateCommitment.rejected, (state, action) => {
        state.error = action.payload as string
      })

      .addCase(deleteCommitment.fulfilled, (state, action) => {
        state.commitments = state.commitments.filter(p => p.id !== action.payload)
      })
      .addCase(deleteCommitment.rejected, (state, action) => {
        state.error = action.payload as string
      })
  }
})

export const { clearCommitment } = commitmentSlice.actions
export default commitmentSlice.reducer
