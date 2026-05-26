import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectDraftReducer from './slices/projectDraftSlice';

const RootReducer = combineReducers({
  auth: authReducer,
  projectDraft: projectDraftReducer,
});

export type RootState = ReturnType<typeof RootReducer>;
export default RootReducer;
