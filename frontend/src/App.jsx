
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

// Website Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Website Pages
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Appointment from "./pages/Appointment";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";
import NotFound from "./pages/NotFound";

// Admin Components
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";

// Admin Layout
import AdminLayout from "./admin/layouts/AdminLayout";

// Admin Pages
import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import AdminAppointments from "./admin/pages/Appointments";
import AddDoctor from "./admin/pages/AddDoctor";
import DoctorsList from "./admin/pages/DoctorsList";

import { Toaster } from "react-hot-toast";

function App() {
  const location = useLocation();

  const isAdminPage =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/");

  return (
    <div className="flex min-h-screen flex-col bg-white">

      {!isAdminPage && <Navbar />}

      <main className="flex-1">
        <Routes>

          {/* Website Routes */}
          <Route path="/" element={<Home />} />

          <Route
            path="/doctors"
            element={<Doctors />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/appointment/:doctorId"
            element={<Appointment />}
          />

          {/* Protected Patient Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/my-appointments"
              element={<MyAppointments />}
            />

            <Route
              path="/my-profile"
              element={<MyProfile />}
            />
          </Route>

          {/* Admin Login - Public Route */}
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          {/* Protected Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route
              path="/admin"
              element={<AdminLayout />}
            >
              <Route
                index
                element={
                  <Navigate
                    to="dashboard"
                    replace
                  />
                }
              />

              <Route
                path="dashboard"
                element={<Dashboard />}
              />

              <Route
                path="appointments"
                element={<AdminAppointments />}
              />

              <Route
                path="add-doctor"
                element={<AddDoctor />}
              />

              <Route
                path="doctors"
                element={<DoctorsList />}
              />
            </Route>
          </Route>

          {/* 404 Page */}
          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </main>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3500,
          style: {
            background: "#ffffff",
            color: "#374151",
            borderRadius: "12px",
            padding: "14px 18px",
            boxShadow:
              "0 8px 30px rgba(0,0,0,0.12)",
          },
          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      {!isAdminPage && <Footer />}

    </div>
  );
}

export default App;
