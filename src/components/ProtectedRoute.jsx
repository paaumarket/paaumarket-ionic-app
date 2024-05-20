import useAuth from "@/hooks/useAuth";
import { Redirect } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  return user ? children : <Redirect to="/app/login" />;
}
