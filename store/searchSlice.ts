import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface SearchValue {
  searchAll: string;
  dataType: string;
  dataClass: string;
  subDataClassification: string;
  type: string;
  workingArea: string;
  AFE: string;
}

export interface SearchState {
  search: boolean;
  value: SearchValue;
}

const initialState: SearchState = {
  search: false,
  value: {
    searchAll: '',
    dataType: 'Select an Item',
    dataClass: 'Select an Item',
    subDataClassification: 'Select an Item',
    type: 'Select an Item',
    workingArea: 'Select an Item',
    AFE: '',
  },
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    applySearch: (state, action: PayloadAction<SearchValue>) => {
      state.value = action.payload;
    },
    singleSearch: (state, action: PayloadAction<string>) => {
      const newSearch = {
        ...state.value,
        searchAll: action.payload,
      };
      state.value = newSearch;
      if (action.payload === '') {
        state.search = false;
        return;
      }
      state.search = true;
    },
    setSearchState: (state, action: PayloadAction<boolean>) => {
      state.search = action.payload;
    },
  },
});

export const {applySearch, setSearchState, singleSearch} = searchSlice.actions;
export default searchSlice.reducer;
