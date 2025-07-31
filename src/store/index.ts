import { configureStore } from '@reduxjs/toolkit';
import  authReducer  from './slices/authSlice';
import  expenseReducer  from './slices/expenseSlice';
import expenseDetailReducer from './slices/expenseDetailsSlice'
import  commitmentReducer from './slices/CommitmentSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    expense: expenseReducer,
    expenseDetails: expenseDetailReducer,
    commitment: commitmentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;