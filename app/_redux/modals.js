import { createSlice } from "@reduxjs/toolkit";

//Initaial state of the modals store
const initialState = {
  walletModal: false,
  depositModal: false,
  networkModal: false,
};

export const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setWalletModal: (state, action) => {
      state.walletModal = action.payload;
    },
    setDepositModal: (state, action) => {
      state.depositModal = action.payload;
    },
    setNetworkModal: (state, action) => {
      state.networkModal = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWalletModal, setDepositModal, setNetworkModal } =
  modalsSlice.actions;

export default modalsSlice.reducer;
