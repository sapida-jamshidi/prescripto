
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

function AdminProtectedRoute() {
  const location = useLocation();

  const { isAdminAuthenticated } = useAdminAuth();

  // Redirect unauthenticated users to Admin Login
  if (!isAdminAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Allow authenticated admins to access protected pages
  return <Outlet />;
}
export default AdminProtectedRoute;
