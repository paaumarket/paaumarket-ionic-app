import { createSlice } from "@reduxjs/toolkit";

// Initial State
const initialState = {
    user: null,
    token: null,
};

// Slice
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, { payload }) {
            state.user = payload.user || state.user;
            state.token = payload.token || state.token;
        },
        logout(state) {
            state.user = null;
            state.token = null;
        },
    },
});

// Actions
export const { login, logout } = authSlice.actions;

// Selectors
export const selectUser = (state) => state[authSlice.name].user;
export const selectToken = (state) => state[authSlice.name].token;
