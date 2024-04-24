import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "Dashboard",
};

const activeSlice = createSlice({
  name: "toggle",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    }
  },
});

export const {
  setActiveTab,
} = activeSlice.actions;
export default activeSlice.reducer;
