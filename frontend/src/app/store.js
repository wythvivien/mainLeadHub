import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice.js";
import toggleReducer from "./features/toggle.js";
import activeReducer from "./features/active.js"
import snackbarReducer from "./features/snackbar.js"

// Configuration of Store
const store = configureStore({
  // Reducers
  reducer: {
    toggle: toggleReducer,
    active: activeReducer,
    snackbar: snackbarReducer,
    [apiSlice.reducerPath]: apiSlice.reducer, // Api Slice Reducer
  },
  // Middleware Configuration
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  // DevTools Configuration
  devTools: true,
});

export default store;
