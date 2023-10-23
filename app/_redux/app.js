import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chain: "",
  drawDetails: [],
  recentWindfalls: [],
  color: "",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setDrawDetails: (state, action) => {
      state.drawDetails = action.payload;
    },
    setRecentWindfalls: (state, action) => {
      state.recentWindfalls = action.payload;
    },
    setAppData: (state, action) => {
      state.chain = action.payload.chain;
      state.color = action.payload.color;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  login,
  updateUser,
  setRecentWindfalls,
  setDrawDetails,
  setAppData,
} = appSlice.actions;

export default appSlice.reducer;
