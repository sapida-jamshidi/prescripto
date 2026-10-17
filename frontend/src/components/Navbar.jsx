
import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Menu,
  X,
  UserRound,
  CalendarDays,
  LogIn,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const navLinks = [
  { name: "HOME", path: "/" },
  { name: "ALL DOCTORS", path: "/doctors" },
  { name: "ABOUT", path: "/about" },
  { name: "CONTACT", path: "/contact" },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function closeMenus() {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenus();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenus}
          className="flex items-center gap-2"
        >
          <Stethoscope size={34} className="text-primary" />
          <span className="text-2xl font-bold text-gray-800">
            Prescripto
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeMenus}
              className={({ isActive }) =>
                `border-b-2 pb-2 text-sm font-medium transition ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-700 hover:text-primary"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Profile Menu */}
        <div
          ref={profileMenuRef}
          className="relative hidden lg:block"
        >
          <button
            type="button"
            aria-label="Open profile menu"
            aria-expanded={profileMenuOpen}
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-primary transition hover:bg-blue-100"
          >
            <UserRound size={24} />

            {isAuthenticated && (
              <span className="max-w-32 truncate text-sm font-medium">
                {user.name}
              </span>
            )}

            <ChevronDown size={17} />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 top-full mt-3 w-60 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
              {isAuthenticated ? (
                <>
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/my-profile"
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary"
                  >
                    <UserRound size={18} />
                    My Profile
                  </Link>

                  <Link
                    to="/my-appointments"
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary"
                  >
                    <CalendarDays size={18} />
                    My Appointments
                  </Link>

                  <div className="my-2 border-t border-gray-200" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary"
                >
                  <LogIn size={18} />
                  Login / Register
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-gray-700 lg:hidden"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-5 pb-6 lg:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeMenus}
              className={({ isActive }) =>
                `block border-b border-gray-100 py-4 text-sm font-medium ${
                  isActive ? "text-primary" : "text-gray-700"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <>
              <div className="border-b border-gray-100 py-4">
                <p className="font-semibold text-gray-800">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500">
                  {user.email}
                </p>
              </div>

              <Link
                to="/my-profile"
                onClick={closeMenus}
                className="flex items-center gap-3 py-4 text-sm text-gray-700"
              >
                <UserRound size={19} />
                My Profile
              </Link>

              <Link
                to="/my-appointments"
                onClick={closeMenus}
                className="flex items-center gap-3 py-4 text-sm text-gray-700"
              >
                <CalendarDays size={19} />
                My Appointments
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-red-200 px-6 py-3 text-sm font-medium text-red-600"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={closeMenus}
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white"
            >
              <LogIn size={18} />
              Login / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
export default Navbar;
