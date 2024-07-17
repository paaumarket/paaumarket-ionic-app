import useAuth from "@/hooks/useAuth";
import { Redirect } from "react-router-dom";

export default function AdminProtectedRoute({ children, permissions = [] }) {
  const { user, hasAllPermission } = useAuth();

  return hasAllPermission(["access-dashboard", ...permissions]) ? (
    children
  ) : (
    <Redirect to={user ? "/app" : "/login"} push={false} />
  );
}
