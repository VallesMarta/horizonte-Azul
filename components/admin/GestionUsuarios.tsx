"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FaTrash,
  FaSearch,
  FaSuitcase,
  FaEdit,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaUser,
} from "react-icons/fa";

interface Usuario {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  fotoPerfil?: string;
  total_reservas?: number;
}

function getToken() {
  return localStorage.getItem("token");
}

const AVATAR_FALLBACK = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [tempUser, setTempUser] = useState<Partial<Usuario> | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/usuarios", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.ok) setUsuarios(data.resultado);
      else setError(data.error);
    } catch {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const eliminarUsuario = async (id: number) => {
    if (!confirm("¿Eliminar este usuario permanentemente?")) return;
    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) fetchUsuarios();
      else alert("Error al eliminar");
    } catch {
      alert("Error de conexión");
    }
  };

  const guardarCambios = async () => {
    if (!tempUser) return;
    setGuardando(true);
    try {
      const res = await fetch(`/api/usuarios/${tempUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          username: tempUser.username,
          email: tempUser.email,
          isAdmin: tempUser.isAdmin,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setEditandoId(null);
        setTempUser(null);
        fetchUsuarios();
      } else {
        alert(data.error || "Error al actualizar");
      }
    } catch {
      alert("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.username?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-primario text-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-titulo-resaltado uppercase tracking-tighter">
            Panel de Usuarios
          </h2>
          <p className="text-xs font-bold text-gris-claro tracking-widest uppercase mt-1">
            {usuariosFiltrados.length} usuarios registrados
          </p>
        </div>
        <div className="relative group">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gris-claro group-focus-within:text-primario transition-colors" />
          <input
            type="text"
            placeholder="Buscar por username o email"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 pr-4 py-2 bg-card border border-card-borde rounded-xl focus:ring-2 focus:ring-primario/20 focus:border-primario outline-none w-72 text-sm transition-all text-texto"
          />
        </div>
      </header>

      {error && (
        <div className="bg-rojo/10 text-rojo border border-rojo/20 rounded-xl p-4 text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="bg-card rounded-2xl shadow-sm border border-card-borde overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bg-suave text-gris-claro text-[10px] uppercase tracking-[0.25em] border-b border-card-borde font-black">
                <th className="w-16 py-4 text-center">Avatar</th>
                <th className="py-4 text-center">Username</th>
                <th className="py-4 text-center">Email</th>
                <th className="w-36 py-4 text-center">Reservas</th>
                <th className="w-28 py-4 text-center">Rol</th>
                <th className="w-36 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-borde">
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-gris-claro py-12 text-sm"
                  >
                    No se encontraron usuarios
                  </td>
                </tr>
              )}

              {usuariosFiltrados.map((u) => {
                const estaEditando = editandoId === u.id;
                const esAdmin = estaEditando ? tempUser?.isAdmin : u.isAdmin;
                const num = u.total_reservas ?? 0;
                const fotoSrc = u.fotoPerfil || AVATAR_FALLBACK;

                return (
                  <tr
                    key={u.id}
                    className={`transition-colors duration-200 ${
                      esAdmin ? "bg-primario/5" : "hover:bg-bg-suave"
                    }`}
                  >
                    {/* ── Avatar ── */}
                    <td className="py-3 align-middle">
                      <div className="flex justify-center">
                        <div className="relative w-10 h-10 shrink-0">
                          <img
                            src={fotoSrc}
                            alt={u.username}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                AVATAR_FALLBACK;
                            }}
                            className={`w-10 h-10 rounded-full object-cover border-2 ${
                              esAdmin ? "border-primario" : "border-card-borde"
                            }`}
                          />
                          {/* Badge admin sobre la foto */}
                          {esAdmin && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primario rounded-full flex items-center justify-center">
                              <FaUser size={7} className="text-white" />
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* ── Username ── */}
                    <td className="py-3 align-middle text-center">
                      {estaEditando ? (
                        <input
                          className="w-4/5 text-center text-xs font-black uppercase border-b-2 border-primario bg-transparent py-1 outline-none text-texto"
                          value={tempUser?.username ?? ""}
                          onChange={(e) =>
                            setTempUser((p) => ({
                              ...p!,
                              username: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <span
                          className={`font-black text-xs uppercase tracking-tight ${
                            esAdmin ? "text-primario" : "text-texto"
                          }`}
                        >
                          {u.username}
                        </span>
                      )}
                    </td>

                    {/* ── Email ── */}
                    <td className="py-3 align-middle text-center">
                      {estaEditando ? (
                        <input
                          className="w-4/5 text-center text-xs font-bold border-b-2 border-primario bg-transparent py-1 outline-none text-gris-claro"
                          value={tempUser?.email ?? ""}
                          onChange={(e) =>
                            setTempUser((p) => ({
                              ...p!,
                              email: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <span className="font-bold text-gris-claro text-xs lowercase">
                          {u.email}
                        </span>
                      )}
                    </td>

                    {/* ── Reservas ── */}
                    <td className="py-3 align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <FaSuitcase
                          className={
                            num > 0 ? "text-primario" : "text-gris-claro/40"
                          }
                          size={13}
                        />
                        <span
                          className={`text-xs font-black italic ${
                            num > 0 ? "text-texto" : "text-gris-claro/40"
                          }`}
                        >
                          {num} {num === 1 ? "Reserva" : "Reservas"}
                        </span>
                      </div>
                    </td>

                    {/* ── Rol ── */}
                    <td className="py-3 align-middle text-center">
                      {estaEditando ? (
                        <button
                          onClick={() =>
                            setTempUser((p) => ({
                              ...p!,
                              isAdmin: !p?.isAdmin,
                            }))
                          }
                          className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase transition-all ${
                            tempUser?.isAdmin
                              ? "bg-primario text-white shadow-sm shadow-primario/30"
                              : "bg-bg-suave text-gris-claro border border-card-borde"
                          }`}
                        >
                          {tempUser?.isAdmin ? "✓ Admin" : "Hacer Admin"}
                        </button>
                      ) : (
                        <span
                          className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${
                            u.isAdmin
                              ? "text-primario border-primario/20 bg-primario/10"
                              : "text-gris-claro border-card-borde"
                          }`}
                        >
                          {u.isAdmin ? "Admin" : "User"}
                        </span>
                      )}
                    </td>

                    {/* ── Acciones ── */}
                    <td className="py-3 align-middle text-center">
                      <div className="flex justify-center gap-2">
                        {estaEditando ? (
                          <>
                            <button
                              onClick={guardarCambios}
                              disabled={guardando}
                              title="Guardar cambios"
                              className="w-9 h-9 flex items-center justify-center bg-verde text-white rounded-xl hover:bg-verde/80 transition-all active:scale-90 disabled:opacity-50"
                            >
                              {guardando ? (
                                <FaSpinner size={11} className="animate-spin" />
                              ) : (
                                <FaCheck size={11} />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setEditandoId(null);
                                setTempUser(null);
                              }}
                              title="Cancelar"
                              className="w-9 h-9 flex items-center justify-center bg-bg-suave text-gris-claro border border-card-borde rounded-xl hover:bg-card-borde transition-all active:scale-90"
                            >
                              <FaTimes size={11} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditandoId(u.id);
                                setTempUser({ ...u });
                              }}
                              title="Editar usuario"
                              className="w-9 h-9 flex items-center justify-center bg-card text-gris-claro border border-card-borde rounded-xl hover:bg-naranja hover:text-white hover:border-naranja transition-all duration-200 active:scale-90"
                            >
                              <FaEdit size={11} />
                            </button>
                            <button
                              onClick={() => eliminarUsuario(u.id)}
                              title="Eliminar usuario"
                              className="w-9 h-9 flex items-center justify-center bg-card text-gris-claro border border-card-borde rounded-xl hover:bg-rojo hover:text-white hover:border-rojo transition-all duration-200 active:scale-90"
                            >
                              <FaTrash size={11} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
