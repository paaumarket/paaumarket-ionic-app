import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import { persistCombineReducers, persistStore } from "redux-persist";

import { appSlice } from "./features/auth/appSlice";
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
    [appSlice.name]: appSlice.reducer,
  }),
});

export const persistor = persistStore(store);
