import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    msgSnackbar: {
        message: "",
        isOpen: false,
        type: "",
    },
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    openMsgSnackbar: (state, action) => {
      state.msgSnackbar.isOpen = true;
      state.msgSnackbar.message = action.payload.message;
      state.msgSnackbar.type = action.payload.type;
    },
    closeMsgSnackbar: (state) => {
      state.msgSnackbar.isOpen = false;
      state.msgSnackbar.message = "";
      state.msgSnackbar.type = "";
    },
  },
});

export const { openMsgSnackbar, closeMsgSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
