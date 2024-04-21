import useAuth from "@/hooks/useAuth";
import { Redirect } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const { user, permissions } = useAuth();

  return permissions.includes("access-dashboard") ? (
    children
  ) : (
    <Redirect to={user ? "/" : "/login"} />
  );
}
