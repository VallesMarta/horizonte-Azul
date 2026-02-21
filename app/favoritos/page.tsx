"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import Destino from "@/components/cards/Destino"; // Reutilizamos tu card que ya tiene el BotonWishlist
import { Viaje } from "@/models/types";
import { FaHeart, FaPlane } from "react-icons/fa";

export default function MisFavoritosPage() {
  const { usuarioLoggeado } = useAuth();
  const [favoritos, setFavoritos] = useState<Viaje[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarFavoritos();
  }, [usuarioLoggeado]);

  const cargarFavoritos = () => {
    if (usuarioLoggeado?.id) {
      // Usamos tu endpoint de wishlist que devuelve los viajes favoritos del usuario
      fetch(`/api/wishlist/${usuarioLoggeado.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setFavoritos(data.resultado);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error cargando favoritos:", err);
          setLoading(false);
        });
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center font-bold text-secundario animate-pulse uppercase tracking-widest text-xs">
        Sincronizando tus deseos...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 py-10 min-h-screen bg-[#f1f5f9]">
      
      {/* HEADER - Mismo estilo que Mis Reservas */}
      <div className="mb-10 flex justify-between items-center border-b-2 border-primario/20 pb-6">
        <div>
          <h1 className="text-3xl font-black text-secundario uppercase tracking-tighter flex items-center gap-3">
            Mis Favoritos
          </h1>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      {favoritos.length > 0 ? (
        /* Usamos un grid de 3 columnas para que las Cards de Destino luzcan bien */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoritos.map((viaje) => (
            <div key={viaje.id} className="transition-all duration-300 hover:-translate-y-2">
               <Destino viaje={viaje} />
            </div>
          ))}
        </div>
      ) : (
        /* ESTADO VACÍO - Mantiene la estética de la app */
        <div className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-gray-200">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaPlane className="text-gray-300 text-3xl" />
          </div>
          <h2 className="text-2xl font-black text-secundario uppercase italic leading-none">
            Tu lista está vacía
          </h2>
          <p className="text-sm font-bold text-gray-400 mt-4 uppercase tracking-wide max-w-xs mx-auto">
            Aún no has marcado ningún destino como favorito. Explora nuestros vuelos y guarda los que más te gusten.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-10 bg-secundario text-white text-[11px] font-black uppercase tracking-widest px-10 py-4 rounded-2xl hover:bg-primario transition-all shadow-md italic"
          >
            Explorar Destinos
          </button>
        </div>
      )}
    </div>
  );
}