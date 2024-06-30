import useAuth from "@/hooks/useAuth";
import { Redirect } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const { user } = useAuth();

  return user?.["permissions"]?.includes("access-dashboard") ? (
    children
  ) : (
    <Redirect to={user ? "/app" : "/login"} push={false} />
  );
}
