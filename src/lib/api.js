import { logout, selectToken } from "@/app/features/auth/authSlice";
import { store } from "@/app/store";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  /** Retrieve authorization token */
  const token = selectToken(store.getState());

  if (token) {
    /** Set authorization header */
    config.headers.setAuthorization(`Bearer ${token}`);
  }

  return config;
});

/** Logout when unauthenticated */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;
