import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  projectId?: string;
  userId: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
      state.notifications = action.payload;

      state.unreadCount = action.payload.filter(item => !item.isRead).length;
    },

    markAllNotificationsRead: state => {
      state.notifications = state.notifications.map(item => ({
        ...item,
        isRead: true,
      }));

      state.unreadCount = 0;
    },

    clearNotifications: state => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setNotifications,
  markAllNotificationsRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
