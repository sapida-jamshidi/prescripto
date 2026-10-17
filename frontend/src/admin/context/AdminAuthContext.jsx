
import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

const AdminAuthContext = createContext(null);

// Frontend demo only - NOT secure authentication
const DEMO_ADMIN = {
  email: "admin@prescripto.com",
  password: "Admin12345",
};

const STORAGE_KEY = "prescripto_demo_admin";

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const savedAdmin = sessionStorage.getItem(STORAGE_KEY);
      return savedAdmin ? JSON.parse(savedAdmin) : null;
    } catch {
      return null;
    }
  });

  const loginAdmin = useCallback(async (email, password) => {
    if (
      email.trim().toLowerCase() !== DEMO_ADMIN.email ||
      password !== DEMO_ADMIN.password
    ) {
      throw new Error("Invalid admin email or password.");
    }

    const adminData = {
      email: DEMO_ADMIN.email,
      role: "admin",
    };

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(adminData)
    );

    setAdmin(adminData);

    return adminData;
  }, []);

  const logoutAdmin = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAdminAuthenticated: Boolean(admin),
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth must be used inside AdminAuthProvider"
    );
  }

  return context;
}
