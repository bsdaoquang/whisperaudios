import {createSlice} from '@reduxjs/toolkit';

const netInfoSlice = createSlice({
  name: 'addnetInfo',
  initialState: {
    netData: {
      isConnected: true,
    },
  },
  reducers: {
    addnetInfo: (state, action) => {
      state.netData = action.payload;
    },
  },
});

export const netInfoReducer = netInfoSlice.reducer;
export const {addnetInfo} = netInfoSlice.actions;
//selector
export const netInfoSelector = (state: any) => state.netInfoReducer.netData;
