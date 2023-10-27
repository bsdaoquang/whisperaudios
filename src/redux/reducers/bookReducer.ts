import { createSlice } from '@reduxjs/toolkit';

const bookSlice = createSlice({
  name: 'addBook',
  initialState: {
    book: {
      title: ''
    }
  },
  reducers: {
    addBook: (state, action) => {
      state.book = action.payload;
    },
  },
});

export const bookReducer = bookSlice.reducer;
export const { addBook } = bookSlice.actions;
//selector
export const bookSelector = (state: any) => state.bookReducer.book;