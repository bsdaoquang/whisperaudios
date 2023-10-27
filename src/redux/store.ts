import {configureStore} from '@reduxjs/toolkit';
import {bookReducer} from './reducers/bookReducer';
import {netInfoReducer} from './reducers/netInfoReducer';
import {playingReducer} from './reducers/playingData';
import {userReducer} from './reducers/userReducer';

//store
const store = configureStore({
  reducer: {
    bookReducer,
    userReducer,
    playingReducer,
    netInfoReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
