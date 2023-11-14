import { createSlice } from "@reduxjs/toolkit";

// The Modals Slice, it contains the state of all the Modals. if a modal is set to false it is hidden and when
// true it is displayed. only one modals display should ever be true at a time

// The initial state of the modals slice, all modals display state are initially set as false so they don't
// display

const initialState = {
  walletModal: false,
  depositModal: false,
  networkModal: false,
  errorModal: false,
  contractFailModal: false,
  agreementModal: false,
  firstStakeModal: false,
};

// The reducers object contains the various functions used in modifying the state
export const modalsSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    /**
     *
     * @param {*} state redux toolkit injects the state so you don't have to ever pass the state.
     * @param {*} action boolean value indicating whether the Wallet modal should be displayed or not.
     */
    setWalletModal: (state, action) => {
      state.walletModal = action.payload;
    },
    /**
     * @param {*} action boolean value indicating whether the Deposit modal should be displayed or not.
     */
    setDepositModal: (state, action) => {
      state.depositModal = action.payload;
    },
    /**
     * @param {*} action boolean value indicating whether the Change Network modal should be displayed or not.
     */
    setNetworkModal: (state, action) => {
      state.networkModal = action.payload;
    },
    /**
     * @param {*} action boolean value indicating whether the Error modal should be displayed or not.
     */
    setErrorModal: (state, action) => {
      state.errorModal = action.payload;
    },
    /**
     * @param {*} action boolean value indicating whether the ContractFail modal should be displayed or not.
     */
    setContractFailModal: (state, action) => {
      state.contractFailModal = action.payload;
    },
    /**
     * @param {*} action boolean value indicating whether the Agreement modal should be displayed or not.
     */
    setAgreementModal: (state, action) => {
      state.agreementModalgreementModal = action.payload;
    },
    /**
     * @param {*} action boolean value indicating whether the FirstStakeMoal modal should be displayed or not.
     */
    setFirstStakeModal: (state, action) => {
      state.firstStakeModal = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setWalletModal,
  setDepositModal,
  setNetworkModal,
  setErrorModal,
  setContractFailModal,
  setFirstStakeModal,
} = modalsSlice.actions;

export default modalsSlice.reducer;
