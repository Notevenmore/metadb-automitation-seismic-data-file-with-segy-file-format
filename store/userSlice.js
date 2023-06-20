import {createSlice} from '@reduxjs/toolkit';

const user = {
  email: null,
  date_joined: null,
  role_name: null,
};
const initialState = {
  user:
    typeof window !== 'undefined'
      ? localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user'))
        : user
      : user,
};
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logOut: (state, action) => {
      state.user = user;
      localStorage.removeItem('user');
      console.log('???');
      // localStorage.clear()
    },
  },
});

export const {setUser, logOut} = userSlice.actions;
export default userSlice.reducer;
