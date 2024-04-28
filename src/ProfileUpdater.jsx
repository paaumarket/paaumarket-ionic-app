import { useQuery } from "@tanstack/react-query";
import useAuth from "./hooks/useAuth";
import api from "./lib/api";
import { useEffect } from "react";
import deepEqual from "deep-equal";

const REFETCH_INTERVAL = 1000 * (import.meta.env.PROD ? 30 : 5);

export const ProfileUpdater = () => {
  const { user, login } = useAuth();
  const { data } = useQuery({
    queryKey: ["auth", "user", Boolean(user)],
    queryFn: ({ signal }) =>
      api.get("/user", { signal }).then((response) => response.data),
    enabled: Boolean(user),
    retry: true,
    refetchInterval: REFETCH_INTERVAL,
  });

  useEffect(() => {
    if (data && !deepEqual(user, data)) {
      login({ user: data });
    }
  }, [data]);
};
