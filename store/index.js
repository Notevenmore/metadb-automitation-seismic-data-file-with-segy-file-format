import { configureStore } from "@reduxjs/toolkit";
import generalReducer from "./generalSlice";
import searchReducer from './searchSlice'

export const store = configureStore({
    reducer: {
        general: generalReducer,
        search: searchReducer
    }
})