"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import FormVuelo, { FormVueloData } from "@/components/forms/FormVuelo";
import {
  FaChevronLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPlane,
} from "react-icons/fa";
import Cookies from "js-cookie";

// ESTADO_BADGE
const ESTADO_BADGE: Record<string, string> = {
  programado: "bg-verde/10 text-verde border border-verde/20",
  abordando: "bg-naranja/10 text-naranja border border-naranja/20",
  en_vuelo: "bg-azul/10 text-azul border border-azul/20",
  completado: "bg-morado/10 text-morado border border-morado/20",
  cancelado: "bg-rojo/10 text-rojo border border-rojo/20",
};

const ESTADO_LABELS: Record<string, string> = {
  programado: "Programado",
  abordando: "Abordando",
  en_vuelo: "En vuelo",
  completado: "Completado",
  cancelado: "Cancelado",
};

const TIPO_BADGE: Record<string, string> = {
  ida: "bg-primario/10 text-primario border border-primario/20",
  vuelta: "bg-secundario/10 text-secundario border border-secundario/20",
};

export default function GestionVuelos() {
  const { id: viajeId } = useParams();
  const [viaje, setViaje] = useState<any>(null);
  const [vuelos, setVuelos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modal, setModal] = useState<"nuevo" | "editar" | null>(null);
  const [vueloEdit, setVueloEdit] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");

  const token = Cookies.get("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [resViaje, resVuelos] = await Promise.all([
        fetch(`${API_URL}/viajes/${viajeId}`),
        fetch(`${API_URL}/vuelos/viaje/${viajeId}?admin=true`), // Traemos TODO
      ]);

      const dViaje = await resViaje.json();
      const dVuelos = await resVuelos.json();

      setViaje(dViaje.resultado?.viaje || dViaje.resultado);
      setVuelos(dVuelos.resultado || []);
    } catch (e) {
      console.error("Error cargando datos:", e);
    } finally {
      setCargando(false);
    }
  }, [viajeId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleCrear = async (data: FormVueloData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/vuelos/viaje/${viajeId}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...data,
          plazasTotales: parseInt(data.plazasTotales),
          precio_ajustado: parseFloat(data.precio_ajustado) || null,
        }),
      });
      if (!res.ok) throw new Error();
      setModal(null);
      cargar();
    } catch {
      alert("Error al crear el vuelo");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = async (data: FormVueloData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/vuelos/${vueloEdit.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          ...data,
          plazasTotales: parseInt(data.plazasTotales),
          precio_ajustado: parseFloat(data.precio_ajustado) || null,
        }),
      });
      if (!res.ok) throw new Error();
      setModal(null);
      setVueloEdit(null);
      cargar();
    } catch {
      alert("Error al actualizar el vuelo");
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar este vuelo?")) return;
    try {
      const res = await fetch(`${API_URL}/vuelos/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) cargar();
    } catch {
      alert("Error al eliminar");
    }
  };

  const abrirEditar = (vuelo: any) => {
    setVueloEdit(vuelo);
    setModal("editar");
  };

  const vuelosFiltrados = vuelos.filter((v) => {
    if (filtroEstado === "todos") return true;
    return v.estado === filtroEstado;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div>
          <Link
            href="/dashboard/viajes"
            className="flex items-center gap-2 text-gris hover:text-secundario transition-all font-bold text-[10px] tracking-[0.2em] mb-2"
          >
            <FaChevronLeft size={10} /> VOLVER A VIAJES
          </Link>
          <h1 className="text-3xl font-black text-titulo-resaltado uppercase tracking-tighter">
            Vuelos
          </h1>
          {viaje && (
            <p className="text-xs font-bold text-gris mt-1 uppercase tracking-widest">
              {viaje.aeropuertoOrigen} → {viaje.aeropuertoDestino}
            </p>
          )}
        </div>
        <button
          onClick={() => setModal("nuevo")}
          className="flex items-center gap-2 bg-secundario text-blanco-fijo px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primario transition-all shadow-lg"
        >
          <FaPlus /> Nuevo Vuelo
        </button>
      </div>

      {/* Filtros de Estado */}
      <div className="flex flex-wrap gap-2 px-2 mb-4">
        {/* Botón TODOS */}
        <button
          onClick={() => setFiltroEstado("todos")}
          className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
            filtroEstado === "todos"
              ? "bg-primario border-primario text-blanco-fijo shadow-lg shadow-primario/20"
              : "bg-bg-suave/50 text-gris border-borde hover:border-primario/50"
          }`}
        >
          Todos ({vuelos.length})
        </button>

        {Object.keys(ESTADO_LABELS).map((key) => {
          const isActive = filtroEstado === key;
          const count = vuelos.filter((v) => v.estado === key).length;

          // Mapa de colores explícitos para que Tailwind no los ignore
          const colores: Record<string, string> = {
            programado: isActive
              ? "bg-verde border-verde text-blanco-fijo"
              : "border-verde/30 text-verde/70 hover:bg-verde/10",
            abordando: isActive
              ? "bg-naranja border-naranja text-blanco-fijo"
              : "border-naranja/30 text-naranja/70 hover:bg-naranja/10",
            en_vuelo: isActive
              ? "bg-azul border-azul text-blanco-fijo"
              : "border-azul/30 text-azul/70 hover:bg-azul/10",
            completado: isActive
              ? "bg-morado border-morado text-blanco-fijo"
              : "border-morado/30 text-morado/70 hover:bg-morado/10",
            cancelado: isActive
              ? "bg-rojo border-rojo text-blanco-fijo"
              : "border-rojo/30 text-rojo/70 hover:bg-rojo/10",
          };

          return (
            <button
              key={key}
              onClick={() => setFiltroEstado(key)}
              className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${colores[key]} ${
                isActive ? "shadow-lg" : "bg-transparent"
              }`}
            >
              {ESTADO_LABELS[key]} ({count})
            </button>
          );
        })}
      </div>

      {/* Tabla vuelos */}
      <div className="bg-bg border border-borde rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-175">
            <thead>
              <tr className="border-b border-borde">
                {[
                  "Tipo",
                  "Salida",
                  "Llegada",
                  "Plazas",
                  "Precio",
                  "Estado",
                  "",
                ].map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-4 text-center text-[9px] font-black text-gris uppercase tracking-[0.2em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-borde">
              {cargando ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-gris font-bold text-xs uppercase tracking-widest"
                  >
                    Cargando vuelos...
                  </td>
                </tr>
              ) : vuelos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gris">
                      <FaPlane size={24} className="opacity-20" />
                      <p className="font-bold text-xs uppercase tracking-widest">
                        No hay vuelos para este viaje
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                vuelosFiltrados.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-bg-suave transition-all group"
                  >
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${TIPO_BADGE[v.tipo] ?? ""}`}
                      >
                        {v.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <p className="font-black text-titulo-resaltado text-xs">
                        {new Date(v.fecSalida).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-gris font-bold mt-0.5">
                        {v.horaSalida?.slice(0, 5)}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <p className="font-black text-titulo-resaltado text-xs">
                        {new Date(v.fecLlegada).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-gris font-bold mt-0.5">
                        {v.horaLlegada?.slice(0, 5)}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <p className="font-black text-titulo-resaltado text-sm">
                        {v.plazasDisponibles}
                        <span className="text-gris font-bold text-xs">
                          /{v.plazasTotales}
                        </span>
                      </p>
                      <p className="text-[9px] text-gris font-bold uppercase tracking-wide mt-0.5">
                        disponibles
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <p className="font-black text-titulo-resaltado text-sm">
                        {Number(v.precio_ajustado).toLocaleString("es-ES")}
                        <span className="text-gris font-bold text-xs ml-0.5">
                          €
                        </span>
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${ESTADO_BADGE[v.estado] ?? ""}`}
                      >
                        {ESTADO_LABELS[v.estado] ?? v.estado}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => abrirEditar(v)}
                          className="flex items-center justify-center w-9 h-9 bg-bg border border-borde rounded-xl text-gris hover:bg-naranja hover:text-blanco-fijo hover:border-naranja transition-all active:scale-90"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => eliminar(v.id)}
                          className="flex items-center justify-center w-9 h-9 bg-bg border border-borde rounded-xl text-gris hover:bg-rojo hover:text-blanco-fijo hover:border-rojo transition-all active:scale-90"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-negro-fijo/40 flex items-center justify-center p-4">
          <div className="bg-bg rounded-3xl border border-borde shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
            <FormVuelo
              titulo={
                modal === "nuevo"
                  ? "Nuevo Vuelo"
                  : `Editar Vuelo #${vueloEdit?.id}`
              }
              loading={loading}
              onCancel={() => {
                setModal(null);
                setVueloEdit(null);
              }}
              onSubmit={modal === "nuevo" ? handleCrear : handleEditar}
              inicial={
                vueloEdit
                  ? {
                      fecSalida: vueloEdit.fecSalida?.split("T")[0],
                      horaSalida: vueloEdit.horaSalida?.slice(0, 5),
                      fecLlegada: vueloEdit.fecLlegada?.split("T")[0],
                      horaLlegada: vueloEdit.horaLlegada?.slice(0, 5),
                      plazasTotales: String(vueloEdit.plazasTotales),
                      precio_ajustado: String(vueloEdit.precio_ajustado),
                      tipo: vueloEdit.tipo,
                      estado: vueloEdit.estado,
                    }
                  : undefined
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
