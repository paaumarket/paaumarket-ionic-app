import { useIonViewDidEnter } from "@ionic/react";
import { useLocation } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

export default function useIonPageQueryRefetch() {
  const location = useLocation();
  const queryClient = useQueryClient();

  useIonViewDidEnter(() => {
    queryClient.refetchQueries({
      fetchStatus: "idle",
      type: "active",
      predicate(query) {
        return query.meta?.queryLocation === location.pathname;
      },
    });
  }, [location, queryClient]);
}
