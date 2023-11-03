import {createSlice} from '@reduxjs/toolkit';
import {Chapter} from '../../models/Book';

const initialState: {
  chaps: Chapter[];
  chapIndex: number;
} = {
  chaps: [],
  chapIndex: 0,
};

const playingSlice = createSlice({
  name: 'addPlaying',
  initialState: {
    playing: initialState,
  },
  reducers: {
    addPlaying: (state, action) => {
      state.playing = action.payload;
    },
    remotePlaying: (state, action) => {
      state.playing = initialState;
    },
  },
});

export const playingReducer = playingSlice.reducer;
export const {addPlaying, remotePlaying} = playingSlice.actions;
//selector
export const playingSelector = (state: any) => state.playingReducer.playing;
