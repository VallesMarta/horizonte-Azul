"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

interface User {
  username: string;
  id: number;
  isAdmin: boolean;
  fotoperfil?: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (newData: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recuperarSesion = () => {
      try {
        const savedUser = localStorage.getItem("user");
        const token = Cookies.get("token");

        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
        } else {
          limpiarDatosLocales();
        }
      } catch (error) {
        console.error("Error al restaurar la sesión:", error);
        limpiarDatosLocales();
      } finally {
        setLoading(false);
      }
    };

    recuperarSesion();
  }, []);

  const limpiarDatosLocales = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    Cookies.remove("token", { path: "/" });
    setUser(null);
  };

  const updateUser = (newData: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...newData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    Cookies.set("token", token, { expires: 7, path: "/" });
    setUser(userData);
  };

  const logout = () => {
    limpiarDatosLocales();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>      
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};