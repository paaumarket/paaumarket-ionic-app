import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router";
import { useMemo } from "react";

const useApiQuery = (options) => {
  const meta = useQueryMeta();

  return useQuery({
    ...options,
    meta: {
      ...options?.meta,
      ...meta,
    },
  });
};

const useApiInfiniteQuery = (options) => {
  const meta = useQueryMeta();

  return useInfiniteQuery({
    ...options,
    meta: {
      ...options?.meta,
      ...meta,
    },
  });
};

const useQueryMeta = () => {
  try {
    const location = useLocation();
    const queryLocation = useMemo(() => location.pathname, []);

    return {
      queryLocation,
    };
  } catch {}
};

export { useApiQuery, useApiInfiniteQuery };
