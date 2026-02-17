import { useState, useEffect, useCallback } from "react";

// Definimos la interfaz para tener autocompletado y evitar errores de tipos
interface Usuario {
  id: number;
  username: string;
}

export default function useAuth() {
  const [usuarioLoggeado, setUsuarioLoggeado] = useState<Usuario | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const cargarDatos = useCallback(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("userId");
      const username = localStorage.getItem("username");
      
      if (id && username) {
        setUsuarioLoggeado({ id: Number(id), username });
      } else {
        setUsuarioLoggeado(null);
      }
      
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    }
  }, []);

  useEffect(() => {
    cargarDatos();
    window.addEventListener("storage", cargarDatos);
    return () => window.removeEventListener("storage", cargarDatos);
  }, [cargarDatos]);

  const logout = () => {
    localStorage.clear();
    setUsuarioLoggeado(null);
    setIsAdmin(false);
    window.location.href = "/";
  };

  return { usuarioLoggeado, isAdmin, logout, cargarDatos };
}