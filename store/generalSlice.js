import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    file: [],
    upload_document_settings: null,
    document_summary: null,
    review_data: null
}

export const generalSlice = createSlice({
    name: "general",
    initialState,
    reducers: {
        storeFile: (state, action) => {
            console.log(action.payload)
            state.file = action.payload
        },
        setUploadDocumentSettings: (state, action) => {
            console.log(action.payload)
            state.upload_document_settings = action.payload
        },
        setDocumentSummary: (state, action) => {
            console.log(action.payload)
            state.document_summary = action.payload
        },
        setReviewData: (state, action) => {
            console.log(action.payload)
            state.review_data = action.payload
        }
    }
})

export const { storeFile, setUploadDocumentSettings, setDocumentSummary, setReviewData } = generalSlice.actions
export default generalSlice.reducer;