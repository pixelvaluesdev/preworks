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
  knownNotificationIds: string[];
  newNotificationIds: string[];
  hasNotificationBaseline: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  knownNotificationIds: [],
  newNotificationIds: [],
  hasNotificationBaseline: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
      const notifications = Array.isArray(action.payload) ? action.payload : [];
      const ids = notifications
        .map(item => item?._id)
        .filter((id): id is string => typeof id === 'string' && id.length > 0);

      if (!state.hasNotificationBaseline) {
        state.knownNotificationIds = Array.from(
          new Set([...state.knownNotificationIds, ...ids]),
        );
        state.hasNotificationBaseline = true;
      } else {
        const knownIds = new Set(state.knownNotificationIds);
        const newIds = new Set(state.newNotificationIds);

        ids.forEach(id => {
          if (!knownIds.has(id)) {
            newIds.add(id);
            knownIds.add(id);
          }
        });

        state.knownNotificationIds = Array.from(knownIds);
        state.newNotificationIds = Array.from(newIds);
      }

      state.notifications = notifications;
      state.unreadCount = state.newNotificationIds.length;
    },

    markNotificationSeen: (state, action: PayloadAction<string>) => {
      state.newNotificationIds = state.newNotificationIds.filter(
        id => id !== action.payload,
      );
      state.notifications = state.notifications.map(item =>
        item._id === action.payload ? { ...item, isRead: true } : item,
      );
      state.unreadCount = state.newNotificationIds.length;
    },

    clearNotifications: state => {
      Object.assign(state, initialState);
    },
  },
});

export const { setNotifications, markNotificationSeen, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
