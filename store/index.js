import { configureStore } from "@reduxjs/toolkit";
import { generalSlice } from "./generalSlice";
import {searchSlice} from './searchSlice'

export const store = configureStore({
    reducer: {
        general: generalSlice,
        search: searchSlice
    }
})