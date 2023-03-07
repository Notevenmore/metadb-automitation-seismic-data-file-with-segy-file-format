import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import generalReducer from "./generalSlice";
import searchReducer from './searchSlice'
import userReducer from './userSlice'

export const store = configureStore({
    reducer: {
        general: generalReducer,
        search: searchReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck:false
    })
})