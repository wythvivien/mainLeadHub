import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebar: true,
  leadForm: false,
  emailForm: false,
  taskForm: false,
  dealForm: false,
  editDetails: false,
};

const toggleSlice = createSlice({
  name: "toggle",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebar = !state.sidebar;
    },

    toggleLeadForm: (state, action) => {
      state.leadForm = action.payload;
    },

    toggleEmailForm: (state, action) => {
      state.emailForm = action.payload;
    },

    toggleTaskForm: (state, action) => {
      state.taskForm = action.payload;
    },

    toggleDealForm: (state, action) => {
      state.dealForm = action.payload;
    },

    toggleEditDetails: (state, action) => {
      state.editDetails = action.payload;
    },

  },
});

export const {
  toggleSidebar,
  toggleLeadForm,
  toggleEmailForm,
  toggleTaskForm,
  toggleDealForm,
  toggleEditDetails,
} = toggleSlice.actions;
export default toggleSlice.reducer;
