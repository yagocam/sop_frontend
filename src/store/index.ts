import { configureStore } from '@reduxjs/toolkit';
import  authReducer  from './slices/authSlice';
import  expenseReducer  from './slices/paymentSlice';
import expenseDetailReducer from './slices/expenseDetailsSlice'
import commitmentDetailReducer from './slices/commitmentDetailsSlice'
import  commitmentReducer from './slices/CommitmentSlice'
import paymentSlice from './slices/paymentSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    expense: expenseReducer,
    expenseDetails: expenseDetailReducer,
    commitmentDetails: commitmentDetailReducer,
    commitment: commitmentReducer,
    payment: paymentSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;