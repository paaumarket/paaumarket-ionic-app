import { login, logout, selectUser } from "@/app/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

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
      hasPermission(permission = "") {
        return user?.["permissions"]?.includes(permission);
      },
      hasAnyPermission(permissions = []) {
        return permissions.some((permission) =>
          user?.["permissions"]?.includes(permission)
        );
      },
      hasAllPermission(permissions = []) {
        return permissions.every((permission) =>
          user?.["permissions"]?.includes(permission)
        );
      },
    }),
    [user, dispatch]
  );
}
