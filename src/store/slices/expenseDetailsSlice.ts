import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api/axios'
import { Expense } from '@/types'

export const fetchExpenseById = createAsyncThunk(
  'expenseDetails/fetchById',
  async (id: number) => {
    const response = await api.get<Expense>(`/api/expenses/${id}`)
    return response.data
  }
)

interface ExpenseDetailsState {
  expense: Expense | null
  loading: boolean
  error: string | null
}

const initialState: ExpenseDetailsState = {
  expense: null,
  loading: false,
  error: null,
}

const expenseDetailsSlice = createSlice({
  name: 'expenseDetails',
  initialState,
  reducers: {
    clearExpense(state) {
      state.expense = null
      state.error = null
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenseById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.loading = false
        state.expense = action.payload
      })
      .addCase(fetchExpenseById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? 'Erro ao carregar detalhe'
      })
  },
})

export const { clearExpense } = expenseDetailsSlice.actions
export default expenseDetailsSlice.reducer
