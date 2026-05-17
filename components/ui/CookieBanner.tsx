"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const decision = Cookies.get("cookies_aceptadas");
    if (!decision) setVisible(true);
  }, []);

  const aceptar = () => {
    Cookies.set("cookies_aceptadas", "true", { expires: 365, path: "/" });
    setVisible(false);
  };

  const rechazar = () => {
    Cookies.set("cookies_aceptadas", "false", { expires: 365, path: "/" });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-bg border border-borde rounded-3xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍪</span>
          <h3 className="font-black text-titulo-resaltado uppercase tracking-tighter text-sm">
            Usamos cookies
          </h3>
        </div>

        <p className="text-xs text-gris leading-relaxed">
          Usamos cookies esenciales para mantener tu sesión activa y mejorar tu
          experiencia. Consulta nuestra{" "}
          <Link
            href="/media/multimedia/legal/politicaCookies.html"
            target="_blank"
            className="text-primario font-bold hover:underline"
          >
            política de cookies
          </Link>
          .
        </p>

        <div className="flex gap-2">
          <button
            onClick={rechazar}
            className="flex-1 py-2.5 rounded-xl border border-borde text-gris font-black text-[10px] uppercase tracking-widest hover:bg-bg-suave transition-all"
          >
            Rechazar
          </button>
          <button
            onClick={aceptar}
            className="flex-1 py-2.5 rounded-xl bg-secundario text-blanco-fijo font-black text-[10px] uppercase tracking-widest hover:bg-primario transition-all shadow-md shadow-secundario/20"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
