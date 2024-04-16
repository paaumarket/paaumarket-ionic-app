import { login, logout, selectUser } from "@/app/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function useAuth() {
    const dispatch = useDispatch();

    return {
        user: useSelector(selectUser),

        // Methods
        login: (data) => {
            return dispatch(login(data));
        },
        logout: () => {
            return dispatch(logout());
        },
    };
}
