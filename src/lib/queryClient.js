import { QueryClient } from "@tanstack/react-query";

// Create a client
export default new QueryClient({
  defaultOptions: {
    mutations: {
      retry: (error) => typeof error.response === "undefined",
    },
    queries: {
      retry: (error) => typeof error.response === "undefined",
    },
  },
});
