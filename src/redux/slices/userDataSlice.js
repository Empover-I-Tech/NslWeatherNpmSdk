// userDataSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  companyDetails: null,
  userMenuControl: null,
  userProfile: null,
};

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setCompanyDetails: (state, action) => {
      state.companyDetails = action.payload;
    },
    setUserMenuControl: (state, action) => {
      state.userMenuControl = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setAllUserData: (state, action) => {
      // If you're getting all three together
      const { companyDetails, userMenuControl, userProfile } = action.payload;
      state.companyDetails = companyDetails;
      state.userMenuControl = userMenuControl;
      state.userProfile = userProfile;
    },
    clearUserData: () => initialState,
  },
});

export const {
  setCompanyDetails,
  setUserMenuControl,
  setUserProfile,
  setAllUserData,
  clearUserData,
} = userDataSlice.actions;

export default userDataSlice.reducer;
