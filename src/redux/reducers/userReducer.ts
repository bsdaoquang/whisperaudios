import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'addUser',
  initialState: {
    userData: {
      uid: '',
      fcmtoken: '',
    },
  },
  reducers: {
    addUser: (state, action) => {
      state.userData = action.payload;
    },
    removeUser: (state, action) => {
      state.userData = {
        uid: '',
        fcmtoken: '',
      };
    },
  },
});

export const userReducer = userSlice.reducer;
export const {addUser, removeUser} = userSlice.actions;
//selector
export const userSelector = (state: any) => state.userReducer.userData;
