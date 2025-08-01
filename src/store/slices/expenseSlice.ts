import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api/axios'
import { Expense } from '../../types'

export const fetchExpenses = createAsyncThunk('expense/fetch', async () => {
  const response = await api.get<Expense[]>('/api/expenses')
  return response.data // Corrigido para retornar só os dados
})

export const updateExpense = createAsyncThunk(
  'expenses/update',
  async ({ id, data }: { id: number; data: Partial<Expense> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/expenses/${id}`, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao atualizar despesa')
    }
  }
)

export const deleteExpense = createAsyncThunk(
  'expenses/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/expenses/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao excluir despesa')
    }
  }
)

const expenseSlice = createSlice({
  name: 'expense',
  initialState: {
    expenses: [] as Expense[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchExpenses.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false
        state.expenses = action.payload // Aqui action.payload é Expense[]
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Erro ao buscar despesas'
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.expenses[index] = action.payload
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(p => p.id !== action.payload)
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export default expenseSlice.reducer
