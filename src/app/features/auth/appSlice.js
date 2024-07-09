import { createSlice } from "@reduxjs/toolkit";

// Initial State
const initialState = {
  darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
  advertListStyle: "grid",
};

// Slice
export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleDarkMode(state, { payload }) {
      state.darkMode = payload;
    },
    setAdvertListStyle(state, { payload }) {
      state.advertListStyle = payload;
    },
  },
});

// Actions
export const { toggleDarkMode, setAdvertListStyle } = appSlice.actions;

// Selectors
export const selectDarkMode = (state) => state[appSlice.name].darkMode;
export const selectAdvertListStyle = (state) =>
  state[appSlice.name].advertListStyle;
