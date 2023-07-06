import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  file: [],
  upload_document_settings: null,
  document_summary: null,
  review_data: null,
  error: {
    message: '',
    color: '',
    show: false,
  },
};

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    storeFile: (state, action) => {
      console.log(action.payload);
      state.file = action.payload;
    },
    setUploadDocumentSettings: (state, action) => {
      console.log(action.payload);
      state.upload_document_settings = action.payload;
    },
    setDocumentSummary: (state, action) => {
      console.log(action.payload);
      state.document_summary = action.payload;
    },
    setReviewData: (state, action) => {
      console.log(action.payload);
      state.review_data = action.payload;
    },
    setErrorMessage: (state, action) => {
      // console.log(action.payload)
      // state.error = action.payload;
      // to allow update on only some fields (biar enak diliat pas toastnya otomatis ilang)
      Object.keys(action.payload).forEach(key => {
        state.error[key] = action.payload[key];
      });
    },
  },
});

export const {
  storeFile,
  setUploadDocumentSettings,
  setDocumentSummary,
  setReviewData,
  setErrorMessage,
} = generalSlice.actions;

export default generalSlice.reducer;
