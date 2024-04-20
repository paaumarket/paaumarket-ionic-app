import { selectToken } from "@/app/features/auth/authSlice";
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

export default api;
