import { createSlice } from "@reduxjs/toolkit";

const initialState = [
    {
        id: "",
        name: "",
    }
]

export const generalSlice = createSlice({
    name:"general",
    initialState,
    reducers: {
        doSth: (state, action) => {
            console.log(state.value)
        }
    }
})