import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

interface TableRow {
  id: number;
  key: string;
  value: string;
}

export type Table = TableRow[];

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
  afe_number: number;
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
  upload_document_settings: {
    afe_number: 0,
    kkks_name: "",
    submission_type: "",
    working_area: "",
    workspace_name: "",
  },
  document_summary: {
    document_id: "",
    status: "",
    body: {},
  },
  review_data: [],
  error: {
    message: "",
    color: "",
    show: false
  },
};

export interface DisplayErrorType {
  message: string;
  color: string;
  duration?: number;
}

const CLEAR_ERROR_WAIT = 500;

let currentMessageTimeout: NodeJS.Timeout | undefined = undefined;
export const displayErrorMessage = createAsyncThunk<void, DisplayErrorType>(
  'general/displayErrorMessage',
  async ({color, duration, message}: DisplayErrorType, {dispatch}) => {
    if (currentMessageTimeout !== undefined) {
      clearTimeout(currentMessageTimeout);
      currentMessageTimeout = undefined;
    }

    dispatch(setErrorMessage({
      color,
      message,
      show: true
    }));

    if (duration === undefined) {
      return;
    }

    currentMessageTimeout = setTimeout(() => {
      dispatch(hideErrorMessage());
      currentMessageTimeout =  setTimeout(() => {
        dispatch(clearErrorMessage());
        currentMessageTimeout = undefined;
      }, CLEAR_ERROR_WAIT);
    }, duration);
  },
)

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
      state.error = action.payload;
    },
    hideErrorMessage: (state) => {
      state.error = {
        ...state.error,
        show: false,
      }
    },
    clearErrorMessage: (state) => {
      state.error = {
        ...state.error,
        color: '',
        message: '',
      }
    }
  },
});

export const {
  storeFile,
  setUploadDocumentSettings,
  setDocumentSummary,
  setReviewData,
  setErrorMessage,
  hideErrorMessage,
  clearErrorMessage
} = generalSlice.actions;

export default generalSlice.reducer;
