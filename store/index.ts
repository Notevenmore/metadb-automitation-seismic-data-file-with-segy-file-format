import {configureStore} from '@reduxjs/toolkit';
import generalReducer, { GeneralState } from './generalSlice';
import searchReducer, { SearchState } from './searchSlice';
import userReducer, { UserState } from './userSlice';

export interface RootState {
  general: GeneralState;
  search: SearchState;
  user: UserState;
}

const store = configureStore({
  reducer: {
    general: generalReducer,
    search: searchReducer,
    user: userReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export {store}