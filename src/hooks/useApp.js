import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { selectDarkMode, toggleDarkMode } from "@/app/features/auth/appSlice";

export default function useApp() {
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);

  return useMemo(
    () => ({
      darkMode,

      // Methods
      toggleDarkMode: (data) => {
        return dispatch(toggleDarkMode(data));
      },
    }),
    [darkMode, dispatch]
  );
}
