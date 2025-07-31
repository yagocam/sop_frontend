import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api/axios'
import { Expense } from '../../types'

export const fetchExpenses = createAsyncThunk('expense/fetch', async () => {
  const response = await api.get<Expense[]>('/api/expenses')
  return response
})

const expenseSlice = createSlice({
  name: 'expense',
  initialState: {
    expenses: [] as Expense[],
    loading: false,
    error: null as string | null,
  },
  reducers: {
  },
  extraReducers: builder => {
    builder
      .addCase(fetchExpenses.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false
        state.expenses = action.payload
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Erro ao buscar despesas'
      })
  },
})

export default expenseSlice.reducer
