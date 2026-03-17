import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Profile {
  _id?: string;
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  userType?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ProfileState {
  profile: Profile | null;
}

const initialState: ProfileState = {
  profile: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },

    updateProfile: (state, action: PayloadAction<Partial<Profile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },

    clearProfile: state => {
      state.profile = null;
    },
  },
});

export const { setProfile, updateProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
