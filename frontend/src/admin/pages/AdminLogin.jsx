
import { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import toast from "react-hot-toast";
import { useAdminAuth } from "../context/AdminAuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const { loginAdmin, isAdminAuthenticated } =
    useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);

  // Return to the requested admin page after login
  const requestedPath = location.state?.from?.pathname;

  const redirectPath =
    requestedPath?.startsWith("/admin/") &&
    requestedPath !== "/admin/login"
      ? requestedPath
      : "/admin/dashboard";

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    loginAdmin(email, password)
      .then(() => {
        toast.success("Welcome to Admin Panel!");
        navigate(redirectPath, { replace: true });
      })
      .catch((error) => {
        toast.error(
          error.message || "Admin login failed."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if (isAdminAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            You are already logged in
          </h2>

          <Link
            to="/admin/dashboard"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-lg sm:p-10">

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl font-bold text-white">
            P
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Prescripto
          </h1>

          <p className="mt-2 text-sm text-blue-600">
            Admin Panel Login
          </p>
        </div>

        {/* Welcome */}
        <div className="mb-7">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome Back
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Enter your admin credentials to continue.
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@prescripto.com"
              autoComplete="username"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="admin-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-blue-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Signing In..."
              : "Login as Admin"}
          </button>
        </form>

        {/* Demo Notice */}
        <p className="mt-6 text-center text-xs leading-6 text-gray-400">
          Frontend demonstration only.
          Not a secure authentication system.
        </p>

        {/* Back to Website */}
        <Link
          to="/"
          className="mt-4 block text-center text-sm font-medium text-blue-600 hover:underline"
        >
          Back to Website
        </Link>
      </div>
    </div>
  );
}
export default AdminLogin;
