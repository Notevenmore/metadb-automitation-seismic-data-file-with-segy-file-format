import {createSlice} from '@reduxjs/toolkit';

const initialState = {
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
    applySearch: (state, action) => {
      state.value = action.payload;
    },
    singleSearch: (state, action) => {
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
    setSearchState: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const {applySearch, setSearchState, singleSearch} = searchSlice.actions;
export default searchSlice.reducer;
