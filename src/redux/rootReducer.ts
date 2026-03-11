import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const RootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof RootReducer>;
export default RootReducer;
