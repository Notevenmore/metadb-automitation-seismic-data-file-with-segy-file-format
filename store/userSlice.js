import {createSlice} from "@reduxjs/toolkit"
import { destroyCookie, parseCookies } from "nookies"

const user = {
    access_token: null,
    affiliation: null,
    name: null,
    token_type: null,
    role_name: null,
    expiry_date: null
}

const cookies = parseCookies().user_data
const initialState = {
    user: typeof window !== "undefined" ? cookies ? JSON.parse(cookies) :user : user,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            console.log(state.user)
        },
        logOut: (state, action) => {
            state.user = user;
            destroyCookie(null, 'user_data', {maxAge: -1, path: '/'})
            console.log("detroy??")
        }
    }
})

export const {setUser, logOut } = userSlice.actions
export default userSlice.reducer;