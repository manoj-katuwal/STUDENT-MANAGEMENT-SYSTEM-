import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../features/auth/auth.context";

function RoleRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
}

export default RoleRoute;
