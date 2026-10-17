
import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "prescripto_demo_user";

function getSavedUser() {
  try {
    const savedUser = localStorage.getItem(STORAGE_KEY);

    if (!savedUser) return null;

    const parsedUser = JSON.parse(savedUser);

    if (
      typeof parsedUser?.name !== "string" ||
      typeof parsedUser?.email !== "string"
    ) {
      return null;
    }

    return {
      name: parsedUser.name,
      email: parsedUser.email,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  function login(userData) {
    const demoUser = {
      name: userData.name,
      email: userData.email,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(demoUser)
    );

    setUser(demoUser);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
