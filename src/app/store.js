import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistCombineReducers } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { authSlice } from "./features/auth/authSlice";

const persistConfig = {
    key: "app",
    storage,
};

export const store = configureStore({
    middleware(getDefaultMiddleware) {
        return getDefaultMiddleware({
            serializableCheck: false,
        });
    },
    reducer: persistCombineReducers(persistConfig, {
        [authSlice.name]: authSlice.reducer,
    }),
});

export const persistor = persistStore(store);
