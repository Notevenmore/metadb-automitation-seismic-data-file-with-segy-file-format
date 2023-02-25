import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        searchAll: "",
		dataType: "",
		dataClass: "",
		subDataClassification: "",
		type: "",
		workingArea: "",
		AFE: "",
    }
}

export const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        applySearch: (state, action) => {
            state.value = action.payload
            console.log(action.payload)
        }
    }
})

export const {applySearch} = searchSlice.actions
export default searchSlice.reducer;