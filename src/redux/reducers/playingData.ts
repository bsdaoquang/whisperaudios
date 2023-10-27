import {createSlice} from '@reduxjs/toolkit';

const playingSlice = createSlice({
  name: 'addPlaying',
  initialState: {
    playing: {
      title: '',
      chapIndex: 0,
    },
  },
  reducers: {
    addPlaying: (state, action) => {
      state.playing = action.payload;
    },
  },
});

export const playingReducer = playingSlice.reducer;
export const {addPlaying} = playingSlice.actions;
//selector
export const playingSelector = (state: any) => state.playingReducer.playing;
