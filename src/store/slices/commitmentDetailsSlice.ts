import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api/axios'
import { Commitment} from '@/types'

export const fetchCommitmentById = createAsyncThunk(
  'commitmentDetails/fetchById',
  async (id: number) => {
    const response = await api.get<Commitment>(`/api/commitments/${id}`)
    return response.data
  }
)

interface ExpenseDetailsState {
  commitment: Commitment | null
  loading: boolean
  error: string | null
}

const initialState: ExpenseDetailsState = {
  commitment: null,
  loading: false,
  error: null,
}

const commitmentDetailsSlice = createSlice({
  name: 'commitmentDetails',
  initialState,
  reducers: {
    clearCommitment(state) {
      state.commitment = null
      state.error = null
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommitmentById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCommitmentById.fulfilled, (state, action) => {
        state.loading = false
        state.commitment = action.payload
      })
      .addCase(fetchCommitmentById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Erro ao carregar detalhe'
      })
  },
})

export const { clearCommitment } = commitmentDetailsSlice.actions
export default commitmentDetailsSlice.reducer
