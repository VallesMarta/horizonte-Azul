"use client";

import { useState, useEffect, useCallback } from "react";

interface Usuario {
  id: number;
  username: string;
}

export default function useAuth() {
  const [usuarioLoggeado, setUsuarioLoggeado] = useState<Usuario | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const cargarDatos = useCallback(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(window.atob(base64));

          // Extraemos los datos del payload del JWT
          setUsuarioLoggeado({
            id: Number(payload.id),
            username: payload.username,
          });

          setIsAdmin(payload.isAdmin === true);
        } catch (error) {
          console.error("Token inválido o corrupto:", error);
          setUsuarioLoggeado(null);
          setIsAdmin(false);
        }
      } else {
        setUsuarioLoggeado(null);
        setIsAdmin(false);
      }
    }
  }, []);

  useEffect(() => {
    cargarDatos();
    window.addEventListener("storage", cargarDatos);
    return () => window.removeEventListener("storage", cargarDatos);
  }, [cargarDatos]);

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1. Intentamos avisar al servidor para invalidar el token en 'tokens_activos'
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error);
    } finally {
      // 2. Limpieza total de persistencia en el cliente
      localStorage.clear();
      
      // Borramos también la cookie de sesión para el middleware
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      setUsuarioLoggeado(null);
      setIsAdmin(false);

      // Redirigimos a la PÁGINA de login, no al endpoint de la API
      window.location.href = "/login";
    }
  };

  return { usuarioLoggeado, isAdmin, logout, cargarDatos };
}