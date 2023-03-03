import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import generalReducer from "./generalSlice";
import searchReducer from './searchSlice'

export const store = configureStore({
    reducer: {
        general: generalReducer,
        search: searchReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck:false
    })
})