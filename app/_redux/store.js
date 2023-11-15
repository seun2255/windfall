import { configureStore } from "@reduxjs/toolkit";

// The slices (parts) of the redux store for various features
// Each slice contains its own state and functions for modifying that state
import userReducer from "./user";
import modalsReducer from "./modals";
import appReducer from "./app";

// The redux store used to manage the state of the whole app.
export const store = configureStore({
  reducer: {
    user: userReducer,
    modals: modalsReducer,
    app: appReducer,
  },
});
