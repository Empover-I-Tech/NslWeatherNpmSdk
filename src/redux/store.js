import { configureStore } from '@reduxjs/toolkit';
import networkReducer from './slices/networkSlice';
import userDataReducer from './slices/userDataSlice';

const store = configureStore({
  reducer: {
    network: networkReducer,
    userData: userDataReducer,
  },
  devTools: true, // Optional for debugging
});

export default store;
