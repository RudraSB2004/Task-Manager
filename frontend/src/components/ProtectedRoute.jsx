import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAuth }) {
  const { token } = useSelector((state) => state.auth);

  if (requireAuth && !token) return <Navigate to="/" />;
  if (!requireAuth && token) return <Navigate to="/dashboard" />;

  return children;
}
