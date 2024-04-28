import { login, logout, selectUser } from "@/app/features/auth/authSlice";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  return useMemo(
    () => ({
      user,

      // Methods
      login: (data) => {
        return dispatch(login(data));
      },
      logout: () => {
        return dispatch(logout());
      },
    }),
    [user, dispatch]
  );
}
