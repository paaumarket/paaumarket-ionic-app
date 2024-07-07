import { createSlice } from "@reduxjs/toolkit";

// Initial State
const initialState = {
  darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
};

// Slice
export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleDarkMode(state, { payload }) {
      state.darkMode = payload;
    },
  },
});

// Actions
export const { toggleDarkMode } = appSlice.actions;

// Selectors
export const selectDarkMode = (state) => state[appSlice.name].darkMode;
