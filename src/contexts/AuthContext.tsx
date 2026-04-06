import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  loginUser,
  getCurrentUser,
  removeToken,
  verifyEmail,
} from "@/services/auth";

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  verify: (email: string, code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        if (response?.user) {
          setUser(response.user);
        }
      } catch {
        // Token invalid or expired — clear it
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginUser(email, password);
    setUser(response.user);
  };

  const verify = async (email: string, code: string) => {
    const response = await verifyEmail(email, code);
    setUser(response.user);
  };

  const logout = () => {
    setUser(null);
    removeToken();
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, verify, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
