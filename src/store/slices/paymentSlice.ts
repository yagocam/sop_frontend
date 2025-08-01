import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/api/axios'
import { Payment } from '@/types'

export const createPayment = createAsyncThunk(
  'payments/create',
  async (paymentData: Partial<Payment>, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/payments', paymentData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao criar pagamento')
    }
  }
)

export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/payments`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao buscar pagamentos')
    }
  }
)

export const updatePayment = createAsyncThunk(
  'payments/update',
  async ({ id, data }: { id: number; data: Partial<Payment> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/payments/${id}`, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao atualizar pagamento')
    }
  }
)

export const deletePayment = createAsyncThunk(
  'payments/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/payments/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Erro ao excluir pagamento')
    }
  }
)

interface PaymentState {
  payments: Payment[]
  loading: boolean
  error: string | null
}

const initialState: PaymentState = {
  payments: [],
  loading: false,
  error: null,
}

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearPayments: (state) => {
      state.payments = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payments.push(action.payload)
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.error = action.payload as string
      })

      .addCase(fetchPayments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false
        state.payments = action.payload
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(updatePayment.fulfilled, (state, action) => {
        const index = state.payments.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.payments[index] = action.payload
        }
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.error = action.payload as string
      })

      .addCase(deletePayment.fulfilled, (state, action) => {
        state.payments = state.payments.filter(p => p.id !== action.payload)
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { clearPayments } = paymentSlice.actions
export default paymentSlice.reducer

export const selectPayments = (state: any) => state.payment as PaymentState
