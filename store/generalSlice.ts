import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface TableRow {
  id: number;
  key: string;
  value: string;
}

type Table = TableRow[];



export interface ErrorToastState {
  message: string;
  color: string;
  show: boolean;
}

export interface UploadDocumentSettings {
  workspace_name: string;
  kkks_name: string;
  working_area: string;
  submission_type: string;
  afe_number: string;
  email?: string;
  DataType?: string;
  FileFormat?: string;
  Method?: string;
}

export interface DocumentSummary {
  document_id: string;
  status: string;
  body: {[key: string]: any};
}

export type FileListType = FileList | [];

// TODO: Type's still weird
export type ReviewData = Table[] | {};

export interface GeneralState {
  file: FileListType;
  upload_document_settings: UploadDocumentSettings,
  document_summary: DocumentSummary,
  review_data: ReviewData,
  error: ErrorToastState,
}

const initialState: GeneralState = {
  file: [],
  upload_document_settings: null,
  document_summary: null,
  review_data: null,
  error: {
    message: "",
    color: "",
    show: false
  },
};

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    storeFile: (state, action: PayloadAction<FileListType>) => {
      console.log(action.payload);
      state.file = action.payload;
    },
    setUploadDocumentSettings: (state, action: PayloadAction<UploadDocumentSettings>) => {
      console.log(action.payload);
      state.upload_document_settings = action.payload;
    },
    setDocumentSummary: (state, action: PayloadAction<DocumentSummary>) => {
      console.log(action.payload);
      state.document_summary = action.payload;
    },
    setReviewData: (state, action: PayloadAction<ReviewData>) => {
      console.log(action.payload);
      state.review_data = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<ErrorToastState>) => {
      // console.log(action.payload)
      state.error = action.payload;
    }
  },
});

export const {
  storeFile,
  setUploadDocumentSettings,
  setDocumentSummary,
  setReviewData,
  setErrorMessage
} = generalSlice.actions;

export default generalSlice.reducer;
