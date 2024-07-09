import {
  selectAdvertListStyle,
  selectDarkMode,
  setAdvertListStyle,
  toggleDarkMode,
} from "@/app/features/auth/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

export default function useApp() {
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);
  const advertListStyle = useSelector(selectAdvertListStyle);

  return useMemo(
    () => ({
      darkMode,
      advertListStyle,

      // Methods
      toggleDarkMode: (data) => {
        return dispatch(toggleDarkMode(data));
      },
      setAdvertListStyle: (mode = "grid") => {
        return dispatch(setAdvertListStyle(mode));
      },
    }),
    [darkMode, advertListStyle, dispatch]
  );
}
