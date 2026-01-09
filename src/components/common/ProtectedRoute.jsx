import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProtectedRoute({ allowedRoles, children }) {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  console.log(`ProtectedRoute: Role "${auth.role}" trying to access roles [${allowedRoles}]`);

  if (!auth.role || !allowedRoles.map(r => r.toUpperCase()).includes(auth.role.toUpperCase())) {
    console.warn(`Access Denied for role: ${auth.role}`);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
