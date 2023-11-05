import {createSlice} from '@reduxjs/toolkit';
import {Book, Chapter} from '../../models/Book';

const initialState: {
  key: string;
  chaps?: Chapter[];
  chapIndex: number;
  isShow?: boolean;
  audio?: Book;
} = {
  key: '',
  chaps: [],
  chapIndex: 0,
  isShow: false,
  audio: undefined,
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
    disableModal: (state, action) => {
      state.playing = {...state.playing, isShow: false};
    },
  },
});

export const playingReducer = playingSlice.reducer;
export const {addPlaying, remotePlaying, disableModal} = playingSlice.actions;
//selector
export const playingSelector = (state: any) => state.playingReducer.playing;
