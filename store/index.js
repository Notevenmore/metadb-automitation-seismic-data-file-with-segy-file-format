import { configureStore } from "@reduxjs/toolkit";
import { generalSlice } from "./generalSlice";

export const store = () => configureStore({
    reducer: {
        generalSlice
    }
})