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

          // Extraemos todo del token directamente
          setUsuarioLoggeado({
            id: Number(payload.id),
            username: payload.username,
          });

          setIsAdmin(payload.isAdmin === true || payload.role === "admin");
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

  const logout = () => {
    localStorage.clear();
    setUsuarioLoggeado(null);
    setIsAdmin(false);
    window.location.href = "/";
  };

  return { usuarioLoggeado, isAdmin, logout, cargarDatos };
}
