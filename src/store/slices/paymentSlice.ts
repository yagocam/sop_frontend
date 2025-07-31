// store/slices/paymentSlice.ts
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
  },
})

export const { clearPayments } = paymentSlice.actions
export default paymentSlice.reducer
