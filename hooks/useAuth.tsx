import { useState, useEffect, useCallback } from "react";

export default function useAuth() {
  const [usuarioLoggeado, setUsuarioLoggeado] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const cargarDatos = useCallback(() => {
    if (typeof window !== "undefined") {
      setUsuarioLoggeado(localStorage.getItem("username"));
      setIsAdmin(localStorage.getItem("isAdmin") === "true");
    }
  }, []);

  useEffect(() => {
    cargarDatos();
    // Escucha cambios desde otras pestañas
    window.addEventListener("storage", cargarDatos);
    return () => window.removeEventListener("storage", cargarDatos);
  }, [cargarDatos]);

  const logout = () => {
    localStorage.clear();
    cargarDatos();
    window.location.href = "/"; // Fuerza limpieza total
  };

  return { usuarioLoggeado, isAdmin, logout, cargarDatos };
}