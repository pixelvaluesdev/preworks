import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  full_name: string;
  mobile_no: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  userType: string | null;
  userToken: string;
  hasSeenOnboarding: boolean;
}

const initialState: AuthState = {
  user: null,
  userType: null,
  userToken: '',
  hasSeenOnboarding: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    setUserType: (state, action: PayloadAction<string>) => {
      state.userType = action.payload;
    },

    setUserToken: (state, action: PayloadAction<string>) => {
      state.userToken = action.payload;
    },

    setHasSeenOnboarding: (state, action: PayloadAction<boolean>) => {
      state.hasSeenOnboarding = action.payload;
    },

    clearUser: state => {
      state.user = null;
      state.userType = null;
      state.userToken = '';
    },
  },
});

export const {
  setUser,
  setUserType,
  setUserToken,
  clearUser,
  setHasSeenOnboarding,
} = authSlice.actions;

export default authSlice.reducer;
