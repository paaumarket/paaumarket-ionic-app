import { QueryClient } from "@tanstack/react-query";

// Create a client
export default new QueryClient({
  defaultOptions: {
    mutations: {
      retry: (count, error) => typeof error.response === "undefined",
    },
    queries: {
      retry: (count, error) => typeof error.response === "undefined",
    },
  },
});
