import { useHistory, useLocation } from "react-router";
import { useId } from "react";
import { useMemo } from "react";

const useHistoryState = (defaultValue) => {
  const id = `history-state-${useId()}`;
  const location = useLocation();
  const history = useHistory();

  const state =
    typeof location.state?.[id] !== "undefined"
      ? location.state?.[id]
      : defaultValue;

  return useMemo(
    () => [
      state,
      (value) => {
        history.push(undefined, {
          ...location.state,
          [id]: value,
        });
      },
      () => history.goBack(),
    ],
    [state]
  );
};

export default useHistoryState;
