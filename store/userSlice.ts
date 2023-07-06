import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {destroyCookie, parseCookies} from 'nookies';

export interface User {
  access_token: string;
  affiliation: string;
  name: string;
  token_type: string;
  role_name: string;
  expiry_date: string;
}

export interface UserState {
  user: User;
}

const user = {
  access_token: null,
  affiliation: null,
  name: null,
  token_type: null,
  role_name: null,
  expiry_date: null,
};

const cookies = parseCookies().user_data;
const initialState: UserState = {
  user:
    typeof window !== 'undefined'
      ? cookies
        ? JSON.parse(cookies) as User
        : user
      : user,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = {...state.user, ...action.payload};
      console.log(state.user);
    },
    logOut: (state) => {
      state.user = user;
      destroyCookie(null, 'user_data', {maxAge: -1, path: '/'});
      console.log('detroy??');
    },
  },
});

export const {setUser, logOut} = userSlice.actions;
export default userSlice.reducer;