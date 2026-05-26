import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  form: {
    projectName: '',
    address: '',
    city: '',
    pinCode: '',
    floorArea: '',
    plotSize: '',
    floors: '',
    quoteType: '',
    startDate: '',
    lastDate: '',
    description: '',
    budget: '',
    siteImage: [],
    archDrawing: [],
    existingImages: [],
    existingDrawings: [],
    hasDrawing: false,
    services: [],
    hideNumber: false,
  },
};

const projectDraftSlice = createSlice({
  name: 'projectDraft',
  initialState,

  reducers: {
    saveProjectDraft: (state, action) => {
      state.form = {
        ...state.form,
        ...action.payload,
      };
    },

    clearProjectDraft: state => {
      state.form = initialState.form;
    },
  },
});

export const { saveProjectDraft, clearProjectDraft } =
  projectDraftSlice.actions;

export default projectDraftSlice.reducer;
