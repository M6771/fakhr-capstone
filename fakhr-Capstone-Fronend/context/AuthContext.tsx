import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types/auth.types";
import { getCurrentUser } from "../api/users.api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        // Token exists, fetch user data from API
        try {
          const userData = await getCurrentUser();
          setUserState(userData);
        } catch (error) {
          // If fetching user fails (e.g., token expired), clear token
          await SecureStore.deleteItemAsync("token");
          setUserState(null);
        }
      }
    } catch (error) {
      // Silently handle error - user will need to login again
      // In production, you might want to log this to an error tracking service
    } finally {
      setLoading(false);
    }
  };

  const setUser = (userData: User | null) => {
    setUserState(userData);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
