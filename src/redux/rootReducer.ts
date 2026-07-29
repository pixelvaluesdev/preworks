import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectDraftReducer from './slices/projectDraftSlice';
import notificationReducer from './slices/notificationSlice';
const RootReducer = combineReducers({
  auth: authReducer,
  projectDraft: projectDraftReducer,
  notification: notificationReducer,
});

export type RootState = ReturnType<typeof RootReducer>;
export default RootReducer;
