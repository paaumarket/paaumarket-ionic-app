import { useQuery } from "@tanstack/react-query";
import useAuth from "./hooks/useAuth";
import api from "./lib/api";
import { useEffect } from "react";

const REFETCH_INTERVAL =
  1000 * (import.meta.env.NODE_ENV === "production" ? 60 : 5);

export const ProfileUpdater = () => {
  const { user, login } = useAuth();
  const { data, dataUpdatedAt } = useQuery({
    queryKey: ["auth", "user", Boolean(user)],
    queryFn: ({ signal }) =>
      api.get("/user", { signal }).then((response) => response.data),
    enabled: Boolean(user),
    retry: true,
    refetchInterval: REFETCH_INTERVAL,
  });

  useEffect(() => {
    if (data) {
      login({ user: data });
    }
  }, [data]);
};
