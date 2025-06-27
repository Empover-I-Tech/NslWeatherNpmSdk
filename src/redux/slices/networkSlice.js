import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: true,
  connectionType: 'unknown',
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setConnectionInfo: (state, action) => {
      state.isConnected = action.payload.isConnected;
      state.connectionType = action.payload.connectionType;
    },
  },
});

export const { setConnectionInfo } = networkSlice.actions;
export default networkSlice.reducer;
