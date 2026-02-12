"use client";

import { useEffect, useState, useCallback } from "react";
import { API_URL } from "@/lib/api";
import { 
  FaTrash, 
  FaSearch, 
  FaUser, 
  FaSuitcase, 
  FaEdit, 
  FaCheck, 
  FaTimes, 
  FaShieldAlt 
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
      setUsuarios(data.resultado || data);
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
      const res = await fetch(`${API_URL}/usuarios/${id}`, { method: "DELETE" });
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
          isAdmin: tempUser.isAdmin
        })
      });
      if (res.ok) {
        setEditandoId(null);
        fetchUsuarios();
      }
    } catch (error) {
      alert("Error al actualizar");
    }
  };

  const usuariosFiltrados = usuarios.filter(u => 
    u.username?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black text-secundario uppercase tracking-tighter">Panel de Usuarios</h1>
          <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-1">
            Total: {usuariosFiltrados.length} miembros registrados
          </p>
        </div>        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primario transition-colors" />
            <input 
              type="text"
              placeholder="Buscar por username o email"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primario/20 focus:border-primario outline-none w-72 text-sm transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-secundario/5 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-fixed min-w-[950px]">
            <thead>
              <tr className="bg-gray-50/50 text-secundario/40 text-[10px] uppercase tracking-[0.25em] border-b border-gray-100 font-black">
                <th className="w-24 py-5 text-center">Avatar</th>
                <th className="py-5 text-center">Datos Usuario</th>
                <th className="py-5 text-center">Email</th>
                <th className="w-32 py-5 text-center">Reservas</th>
                <th className="w-32 py-5 text-center">Rol</th>
                <th className="w-40 py-5 text-center">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usuariosFiltrados.map((u) => {
                const estaEditando = editandoId === u.id;
                const numReservas = u.reservas?.length || 0;
                const esAdmin = estaEditando ? tempUser.isAdmin : u.isAdmin;
                return (
                  <tr 
                    key={u.id} 
                    className={`transition-all duration-300 ${esAdmin ? 'bg-primario/5' : 'hover:bg-gray-50/40'}`}
                  >                    
                    {/* AVATAR CENTRADO */}
                    <td className="py-4 align-middle">
                      <div className="flex justify-center items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-[11px] border shadow-sm transition-all ${esAdmin ? 'bg-primario border-primario text-white' : 'bg-gray-50 border-gray-200 text-secundario'}`}>
                          {u.username?.substring(0, 2).toUpperCase() || <FaUser size={12}/>}
                        </div>
                      </div>
                    </td>
                    {/* USERNAME */}
                    <td className="py-4 align-middle text-center">
                      {estaEditando ? (
                        <input 
                          className="w-4/5 text-center text-xs font-black uppercase border-b-2 border-primario bg-transparent py-1 outline-none text-secundario"
                          value={tempUser.username}
                          onChange={(e) => setTempUser({...tempUser, username: e.target.value})}
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                           <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Username</span>
                           <span className={`font-black text-xs uppercase tracking-tight ${esAdmin ? 'text-primario' : 'text-secundario'}`}>{u.username}</span>
                        </div>
                      )}
                    </td>
                    {/* EMAIL */}
                    <td className="py-4 align-middle text-center">
                      {estaEditando ? (
                        <input 
                          className="w-4/5 text-center text-xs font-bold border-b-2 border-primario bg-transparent py-1 outline-none text-gray-500"
                          value={tempUser.email}
                          onChange={(e) => setTempUser({...tempUser, email: e.target.value})}
                        />
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Correo</span>
                          <span className="font-bold text-gray-400 text-xs lowercase">{u.email}</span>
                        </div>
                      )}
                    </td>
                    {/* RESERVAS */}
                    <td className="py-4 align-middle text-center">
                      <div className="flex flex-col items-center" title={`${numReservas} reservas totales`}>
                        <FaSuitcase 
                          size={14} 
                          className={`transition-colors duration-300 ${numReservas > 0 ? 'text-primario' : 'text-gray-200'}`} 
                        />
                        <span className={`text-xs font-black mt-1 ${numReservas > 0 ? 'text-secundario' : 'text-gray-300'}`}>
                          {numReservas}
                        </span>
                      </div>
                    </td>
                    {/* ROL / ADMIN */}
                    <td className="py-4 align-middle text-center">
                      <div className="flex justify-center">
                        {estaEditando ? (
                          <button 
                            onClick={() => setTempUser({...tempUser, isAdmin: !tempUser.isAdmin})}
                            className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase transition-all shadow-md ${tempUser.isAdmin ? 'bg-secundario text-white' : 'bg-gray-100 text-gray-400'}`}
                          >
                            {tempUser.isAdmin ? "Es Admin" : "Hacer Admin"}
                          </button>
                        ) : (
                          u.isAdmin ? (
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-primario uppercase bg-primario/10 px-2.5 py-1 rounded-full border border-primario/20">
                              <FaShieldAlt size={10}/> Admin
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-gris uppercase px-2.5 py-1 rounded-full border border-primario/20">
                              <FaUser size={10}/> User</span>
                          )
                        )}
                      </div>
                    </td>
                    {/* ACCIONES */}
                    <td className="py-4 align-middle text-center">
                      <div className="flex justify-center gap-2">
                        {estaEditando ? (
                          <>
                            <button 
                              onClick={guardarCambios} 
                              className="w-9 h-9 flex items-center justify-center bg-green-500 text-white rounded-xl hover:bg-green-600 shadow-lg shadow-green-100 transition-all active:scale-90"
                            >
                              <FaCheck size={12}/>
                            </button>
                            <button 
                              onClick={() => setEditandoId(null)} 
                              className="w-9 h-9 flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200 transition-all active:scale-90"
                            >
                              <FaTimes size={12}/>
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => { setEditandoId(u.id); setTempUser({...u}); }} 
                              className="flex items-center justify-center w-10 h-10 bg-white text-gray-400 border border-gray-100 rounded-xl hover:bg-naranja hover:text-white hover:border-naranja hover:shadow-lg hover:shadow-primario/20 transition-all duration-300 active:scale-90"
                            >
                              <FaEdit size={12}/>
                            </button>
                            <button 
                              onClick={() => eliminarUsuario(u.id)} 
                              className="flex items-center justify-center w-10 h-10 bg-white text-gray-400 border border-gray-100 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 active:scale-90"
                            >
                              <FaTrash size={12}/>
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