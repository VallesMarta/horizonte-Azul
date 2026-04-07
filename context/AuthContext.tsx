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
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Efecto de carga inicial: Recupera la sesión sin disparar redirecciones
  useEffect(() => {
    const recuperarSesion = () => {
      try {
        const savedUser = localStorage.getItem("user");
        const token = Cookies.get("token");

        // Si tenemos ambos, restauramos al usuario en el estado global
        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
        } else {
          // Si falta algo, simplemente aseguramos que el estado esté limpio
          // PERO no redirigimos aquí para evitar bucles infinitos
          limpiarDatosLocales();
        }
      } catch (error) {
        console.error("Error al restaurar la sesión:", error);
        limpiarDatosLocales();
      } finally {
        // Marcamos que ya terminamos de comprobar la sesión
        setLoading(false);
      }
    };

    recuperarSesion();
  }, []);

  // Función interna para borrar rastro sin causar recargas de página
  const limpiarDatosLocales = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    Cookies.remove("token", { path: "/" });
    setUser(null);
  };

  /**
   * Iniciar Sesión
   * Guarda en LocalStorage (Cliente) y Cookies (Middleware)
   */
  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    // La cookie permite que el middleware.ts proteja las rutas
    Cookies.set("token", token, { expires: 7, path: "/" });

    setUser(userData);
  };

  /**
   * Cerrar Sesión
   * Limpia datos y fuerza redirección al login
   */
  const logout = () => {
    limpiarDatosLocales();
    // Solo redirigimos manualmente cuando el usuario pulsa "Salir"
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Importante: No ocultamos los hijos mientras carga (loading) 
        para que Next.js pueda renderizar el esqueleto de la página (SSR/SSG).
        Los componentes individuales (como el Header) manejarán su estado de carga.
      */}
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
