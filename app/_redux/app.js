import { createSlice } from "@reduxjs/toolkit";

// The App Slice, it contains the state of the app itself. Things like the frontend data and the theme of
// the app are housed in this slice

// The initial state of the app slice, mostly empty strings and arrays that are populated with actual data
// before the app renders
const initialState = {
  chain: "",
  drawDetails: [],
  recentWindfalls: [],
  color: "",
};

// The reducers object contains the various functions used in modifying the state
export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    /**
     *
     * @param {*} state redux toolkit injects the state so you don't have to ever pass the state.
     * @param {*} action the drawDetails array (only pass in the array after proceesing it into javascript data types)
     */
    setDrawDetails: (state, action) => {
      state.drawDetails = action.payload;
    },
    /**
     * @param {*} action the array of recent windfalls (only pass in the array after proceesing it into javascript data types)
     */
    setRecentWindfalls: (state, action) => {
      state.recentWindfalls = action.payload;
    },
    /**
     * @param {*} action an object with keys chain and color which contain the connected chain and color for that chain as strings
     */
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
