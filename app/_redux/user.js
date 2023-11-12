import { createSlice } from "@reduxjs/toolkit";

// The Users Slice, it contains the state of all the user. user specific data like their tokens, address
// and whether they are connected to the app is stored here

// The initial state of the user slice, the user is not connected by default and the user object is an empty
// object until populated with data after the user connects their wallet
const initialState = {
  connected: false,
  user: {},
};

// The reducers object contains the various functions used in modifying the state
export const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    /**
     * @notice the login action/function sets they user as connected to the app and stores their details which
     * were retrieved from the contract.
     * @param {*} state redux toolkit injects the state so you don't have to ever pass the state.
     * @param {*} action object containing the address and tokesn the user posses foor the connected chain
     */
    login: (state, action) => {
      state.connected = true;
      state.user = action.payload;
    },
    /**
     * @notice use this function only when updating the state after a user makes a transaction (e.g unstake, withdraw e.t.c)
     * or switches network/wallet
     * @param {*} action object containing the address and tokesn the user posses foor the connected chain
     */
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, updateUser } = userSlice.actions;

export default userSlice.reducer;
