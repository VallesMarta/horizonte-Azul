"use client";

import { useEffect, useState, useCallback } from "react";
import { API_URL } from "@/lib/api";
import {
  FaTrash,
  FaSearch,
  FaSuitcase,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [tempUser, setTempUser] = useState<any>(null);

  const fetchUsuarios = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios`);
      const data = await res.json();
      if (data.ok) {
        setUsuarios(data.resultado);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
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
      const res = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchUsuarios();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  const guardarCambios = async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios/${tempUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: tempUser.username,
          email: tempUser.email,
          isAdmin: tempUser.isAdmin,
        }),
      });
      if (res.ok) {
        setEditandoId(null);
        fetchUsuarios();
      }
    } catch (error) {
      alert("Error al actualizar");
    }
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.username?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header del Panel */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-titulo-resaltado uppercase tracking-tighter">
            Panel de Usuarios
          </h1>
          <p className="text-[10px] md:text-xs font-bold text-gris dark:text-texto/40 tracking-widest uppercase mt-1">
            {usuariosFiltrados.length} usuarios registrados
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gris group-focus-within:text-primario transition-colors" />
            <input
              type="text"
              placeholder="Buscar por username o email"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 bg-blanco-fijo dark:bg-gris-clarito border border-gris-borde-suave rounded-xl focus:ring-2 focus:ring-primario/20 focus:border-primario outline-none w-72 text-sm transition-all shadow-sm text-secundario dark:text-titulo-resaltado"
            />
          </div>
        </div>
      </header>

      {/* Tabla Principal */}
      <div className="bg-blanco-fijo dark:bg-gris-clarito rounded-[2rem] shadow-xl shadow-secundario/5 border border-gris-borde-suave overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[950px]">
            <thead>
              <tr className="bg-gris-clarito/50 dark:bg-fondo text-secundario/40 dark:text-texto/40 text-[10px] uppercase tracking-[0.25em] border-b border-gris-borde-suave font-black">
                <th className="w-24 py-5 text-center">Avatar</th>
                <th className="py-5 text-center">Username</th>
                <th className="py-5 text-center">Email</th>
                <th className="w-40 py-5 text-center">Nº Reservas</th>
                <th className="w-32 py-5 text-center">Rol</th>
                <th className="w-40 py-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-borde-suave/30">
              {usuariosFiltrados.map((u) => {
                const estaEditando = editandoId === u.id;
                const esAdmin = estaEditando ? tempUser.isAdmin : u.isAdmin;
                const num = u.total_reservas || 0;

                return (
                  <tr
                    key={u.id}
                    className={`transition-all duration-300 ${esAdmin ? "bg-primario/5" : "hover:bg-gris-clarito/20 dark:hover:bg-fondo/40"}`}
                  >
                    {/* AVATAR */}
                    <td className="py-4 align-middle">
                      <div className="flex justify-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-[11px] border shadow-sm transition-all ${esAdmin ? "bg-primario border-primario text-blanco-fijo" : "bg-gris-clarito dark:bg-fondo border-gris-borde-suave text-secundario dark:text-titulo-resaltado"}`}
                        >
                          {u.username?.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                    </td>
                    {/* USERNAME */}
                    <td className="py-4 align-middle text-center">
                      {estaEditando ? (
                        <input
                          className="w-4/5 text-center text-xs font-black uppercase border-b-2 border-primario bg-transparent py-1 outline-none text-secundario dark:text-titulo-resaltado"
                          value={tempUser.username}
                          onChange={(e) =>
                            setTempUser({
                              ...tempUser,
                              username: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <span
                          className={`font-black text-xs uppercase tracking-tight ${esAdmin ? "text-primario" : "text-secundario dark:text-titulo-resaltado"}`}
                        >
                          {u.username}
                        </span>
                      )}
                    </td>
                    {/* EMAIL */}
                    <td className="py-4 align-middle text-center">
                      {estaEditando ? (
                        <input
                          className="w-4/5 text-center text-xs font-bold border-b-2 border-primario bg-transparent py-1 outline-none text-gris"
                          value={tempUser.email}
                          onChange={(e) =>
                            setTempUser({ ...tempUser, email: e.target.value })
                          }
                        />
                      ) : (
                        <span className="font-bold text-gris dark:text-texto/40 text-xs lowercase">
                          {u.email}
                        </span>
                      )}
                    </td>
                    {/* RESERVAS */}
                    <td className="py-4 align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <FaSuitcase
                          className={`transition-colors duration-300 ${num > 0 ? "text-primario" : "text-gris/30"}`}
                          size={14}
                        />
                        <span
                          className={`text-xs font-black italic ${num > 0 ? "text-secundario dark:text-titulo-resaltado" : "text-gris/30"}`}
                        >
                          {num} {num === 1 ? "Reserva" : "Reservas"}
                        </span>
                      </div>
                    </td>
                    {/* ROL / ADMIN */}
                    <td className="py-4 align-middle text-center">
                      {estaEditando ? (
                        <button
                          onClick={() =>
                            setTempUser({
                              ...tempUser,
                              isAdmin: !tempUser.isAdmin,
                            })
                          }
                          className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase transition-all shadow-md ${tempUser.isAdmin ? "bg-secundario text-blanco-fijo" : "bg-gris-clarito dark:bg-fondo text-gris"}`}
                        >
                          {tempUser.isAdmin ? "Es Admin" : "Hacer Admin"}
                        </button>
                      ) : (
                        <span
                          className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${u.isAdmin ? "text-primario border-primario/20 bg-primario/10" : "text-gris border-gris-borde-suave"}`}
                        >
                          {u.isAdmin ? "Admin" : "User"}
                        </span>
                      )}
                    </td>

                    {/* ACCIONES */}
                    <td className="py-4 align-middle text-center">
                      <div className="flex justify-center gap-2">
                        {estaEditando ? (
                          <>
                            <button
                              onClick={guardarCambios}
                              className="w-9 h-9 flex items-center justify-center bg-verde text-blanco-fijo rounded-xl hover:bg-verde/80 shadow-lg shadow-verde/10 transition-all active:scale-90"
                            >
                              <FaCheck size={12} />
                            </button>
                            <button
                              onClick={() => setEditandoId(null)}
                              className="w-9 h-9 flex items-center justify-center bg-gris-clarito dark:bg-fondo text-gris rounded-xl hover:bg-gris-borde-suave transition-all active:scale-90"
                            >
                              <FaTimes size={12} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditandoId(u.id);
                                setTempUser({ ...u });
                              }}
                              className="flex items-center justify-center w-10 h-10 bg-blanco-fijo dark:bg-fondo text-gris border border-gris-borde-suave rounded-xl hover:bg-naranja hover:text-blanco-fijo hover:border-naranja hover:shadow-lg hover:shadow-naranja/20 transition-all duration-300 active:scale-90"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => eliminarUsuario(u.id)}
                              className="flex items-center justify-center w-10 h-10 bg-blanco-fijo dark:bg-fondo text-gris border border-gris-borde-suave rounded-xl hover:bg-rojo hover:text-blanco-fijo hover:border-rojo hover:shadow-lg hover:shadow-rojo/20 transition-all duration-300 active:scale-90"
                            >
                              <FaTrash size={12} />
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
