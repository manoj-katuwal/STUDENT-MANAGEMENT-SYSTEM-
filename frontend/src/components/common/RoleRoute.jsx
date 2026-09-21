import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../features/auth/auth.context";

function RoleRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const normalizedRole = user.role?.trim().toUpperCase();

  if (!allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
}

export default RoleRoute;
