import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    file: []
}

export const generalSlice = createSlice({
    name:"general",
    initialState,
    reducers: {
        storeFile: (state, action) => {
            console.log(action.payload)
            state.file = action.payload
        }
    }
})

export const {storeFile} = generalSlice.actions
export default generalSlice.reducer;