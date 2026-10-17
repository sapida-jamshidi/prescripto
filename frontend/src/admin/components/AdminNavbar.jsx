
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import toast from "react-hot-toast";

function AdminNavbar() {
  const navigate = useNavigate();
  const { logoutAdmin } = useAdminAuth();

  const handleLogout = () => {
    logoutAdmin();
    toast.success("Logged out successfully!");
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-5">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
          P
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Prescripto
          </h1>

          <p className="text-sm text-blue-600">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navbar Actions */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="rounded-full border border-blue-600 px-5 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
        >
          View Website
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full bg-red-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
export default AdminNavbar;
