import {createSlice} from "@reduxjs/toolkit"

const user = {
    email: null,
    date_joined: null,
    role_id: null
}
const initialState = {
    user: typeof window !== "undefined" ? localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) :user : user,
}
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            localStorage.setItem("user", JSON.stringify(action.payload))
        },
    }
})

export const {setUser, } = userSlice.actions
export default userSlice.reducer;