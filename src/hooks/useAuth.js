import {
  login,
  logout,
  selectPermissions,
  selectUser,
} from "@/app/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function useAuth() {
  const dispatch = useDispatch();

  return {
    user: useSelector(selectUser),
    permissions: useSelector(selectPermissions),

    // Methods
    login: (data) => {
      return dispatch(login(data));
    },
    logout: () => {
      return dispatch(logout());
    },
  };
}
