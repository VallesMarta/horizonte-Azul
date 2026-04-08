"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  FaGlobeAmericas,
  FaEdit,
  FaSave,
  FaPassport,
  FaCamera,
  FaLink,
} from "react-icons/fa";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";
import { SecurityInput } from "@/components/ui/SecurityInput";

// Input para cuando en bd no tenga aun valor mostarar en la visualizacion
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 border-b border-gris/8 pb-1">
      <p className="text-[10px] text-primario font-black uppercase tracking-[0.2em]">
        {label}
      </p>
      <p className="text-xs font-black text-gris uppercase truncate tracking-tight">
        {value || "---"}
      </p>
    </div>
  );
}

export default function PasaporteDigitalPage() {
  const { user: usuarioLoggeado, updateUser } = useAuth();
  const [perfil, setPerfil] = useState<any>(null);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const formatFechaInput = (fecha: any) => {
    if (!fecha) return "";
    try {
      const d = new Date(fecha);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const cargarPerfil = async () => {
    if (!usuarioLoggeado?.id) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/usuarios/${usuarioLoggeado.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.ok) {
        const db = data.resultado;
        const normalizado = {
          ...db,
          fecNacimiento: db.fecNacimiento || db.fecnacimiento,
          tipoDocumento: db.tipoDocumento || db.tipodocumento,
          numDocumento: db.numDocumento || db.numdocumento,
          paisEmision: db.paisEmision || db.paisemision,
          fecCaducidadDocumento:
            db.fecCaducidadDocumento || db.feccaducidaddocumento,
          fotoPerfil: db.fotoPerfil || db.fotoperfil,
          isAdmin: db.isAdmin !== undefined ? db.isAdmin : db.isadmin,
        };
        setPerfil(normalizado);
      }
    } catch (err) {
      toast.error("Error de sincronización con la central");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, [usuarioLoggeado?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerfil((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/usuarios/${usuarioLoggeado?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(perfil),
      });

      const data = await res.json();

      if (data.ok) {
        toast.success("Expediente sellado correctamente");
        updateUser({ fotoperfil: perfil.fotoPerfil });
        setEditando(false);
        await cargarPerfil();
      } else {
        toast.error(data.error || "Error al sellar el documento");
      }
    } catch (err) {
      toast.error("Fallo de conexión con la aduana");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  const apellidoMRZ = (perfil?.apellidos || "VIAJERO")
    .replace(/\s/g, "")
    .toUpperCase()
    .slice(0, 10)
    .padEnd(10, "<");
  const nombreMRZ = (perfil?.nombre || "AZUL")
    .replace(/\s/g, "")
    .toUpperCase()
    .slice(0, 10)
    .padEnd(10, "<");
  const mrzNacimiento = perfil?.fecNacimiento
    ? formatFechaInput(perfil.fecNacimiento).replace(/-/g, "").substring(2, 8)
    : "000000";
  const mrzCaducidad = perfil?.fecCaducidadDocumento
    ? formatFechaInput(perfil.fecCaducidadDocumento)
        .replace(/-/g, "")
        .substring(2, 8)
    : "000000";

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-160px)] py-6 px-4">
      <div className="w-full max-w-3xl space-y-6">
        {/* TARJETA PASAPORTE */}
        <div className="bg-pasaporte-papel rounded-4xl shadow-2xl overflow-hidden relative transition-all duration-500">
          {/* HEADER */}
          <div className="bg-primario px-8 py-6 text-white flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                <FaPassport className="text-iconos text-xl" /> Pasaporte Digital
              </h1>
            </div>
            <FaGlobeAmericas className="text-7xl absolute -right-4 -bottom-4 text-white/10 rotate-12" />
          </div>

          <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* COLUMNA FOTO */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-40 h-52 bg-white p-2 shadow-xl border border-gris-borde-suave/40 -rotate-4 dark:bg-white/90">
                  <img
                    src={
                      perfil?.fotoPerfil ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    className="w-full h-full object-cover"
                    alt="Foto Pasaporte"
                  />
                  {editando && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                      <FaCamera className="text-2xl mb-1" />
                      <span className="text-[8px] font-bold uppercase tracking-tighter">
                        Cambiar Foto
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {editando && (
                <div className="w-full space-y-1">
                  <p className="text-[7px] font-bold text-gris/60 dark:text-white/40 uppercase text-center flex items-center justify-center gap-1">
                    <FaLink /> Enlace de Imagen (URL)
                  </p>
                  <input
                    type="text"
                    name="fotoPerfil"
                    value={perfil?.fotoPerfil || ""}
                    onChange={handleChange}
                    className="w-full text-[10px] bg-primario/5 text-titulo-resaltado border border-pasaporte-borde rounded-xl p-4 text-xs font-bold outline-none focus:border-primario focus:ring-4 focus:ring-primario/5 transition-all text-titulo-resaltadooutline-none"
                  />
                </div>
              )}

              <div className="text-center pt-2">
                <p className="text-[8px] font-black text-gris uppercase tracking-widest">
                  Nº Expediente
                </p>
                <p className="font-mono text-base font-bold text-primario">
                  HA-{String(perfil?.id || 0).padStart(6, "0")}
                </p>
              </div>
            </div>

            {/* COLUMNA DATOS */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {editando ? (
                <>
                  <SecurityInput
                    label="Apellidos"
                    name="apellidos"
                    value={perfil?.apellidos || ""}
                    onChange={handleChange}
                  />
                  <SecurityInput
                    label="Nombre"
                    name="nombre"
                    value={perfil?.nombre || ""}
                    onChange={handleChange}
                  />
                  <div className="md:col-span-2">
                    <SecurityInput
                      label="Email"
                      name="email"
                      value={perfil?.email || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <SecurityInput
                    label="Fec. Nacimiento"
                    name="fecNacimiento"
                    type="date"
                    value={formatFechaInput(perfil?.fecNacimiento)}
                    onChange={handleChange}
                  />
                  <SecurityInput
                    label="Nacionalidad"
                    name="paisEmision"
                    value={perfil?.paisEmision || ""}
                    onChange={handleChange}
                  />
                  <SecurityInput
                    label="Documento ID"
                    name="numDocumento"
                    value={perfil?.numDocumento || ""}
                    onChange={handleChange}
                  />
                  <SecurityInput
                    label="Vencimiento"
                    name="fecCaducidadDocumento"
                    type="date"
                    value={formatFechaInput(perfil?.fecCaducidadDocumento)}
                    onChange={handleChange}
                  />
                  <div className="md:col-span-2">
                    <SecurityInput
                      label="Teléfono"
                      name="telefono"
                      value={perfil?.telefono || ""}
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  <InfoItem
                    label="Apellidos / Surname"
                    value={perfil?.apellidos}
                  />
                  <InfoItem
                    label="Nombre / Given Names"
                    value={perfil?.nombre}
                  />
                  <div className="md:col-span-2">
                    <InfoItem
                      label="Correo Electrónico / Email"
                      value={perfil?.email}
                    />
                  </div>
                  <InfoItem
                    label="Fec. Nacimiento / DOB"
                    value={
                      perfil?.fecNacimiento
                        ? new Date(perfil.fecNacimiento).toLocaleDateString()
                        : "---"
                    }
                  />
                  <InfoItem
                    label="Nacionalidad / Nationality"
                    value={perfil?.paisEmision}
                  />
                  <InfoItem
                    label="Identificación / ID"
                    value={perfil?.numDocumento}
                  />
                  <InfoItem
                    label="Expiración / Expiry"
                    value={
                      perfil?.fecCaducidadDocumento
                        ? new Date(
                            perfil.fecCaducidadDocumento,
                          ).toLocaleDateString()
                        : "---"
                    }
                  />
                  <div className="md:col-span-2">
                    <InfoItem
                      label="Teléfono / Phone"
                      value={perfil?.telefono}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* MRZ ZONE */}
          <div
            className="bg-primario/40 p-6 border-t border-dashed border-secundario/40 
          font-mono text-[10px] md:text-[11px] 
          text-gris tracking-[0.3em] uppercase leading-relaxed"
          >
            P&lt;ESP{apellidoMRZ}&lt;&lt;{nombreMRZ}
            &lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
            <br />
            {String(perfil?.id || 0).padStart(8, "0")}6ESP{mrzNacimiento}&lt;
            {mrzCaducidad}&lt;&lt;&lt;&lt;01
          </div>
        </div>

        {/* ACCIONES */}
        <div className="flex justify-center gap-4">
          {!editando ? (
            <button
              onClick={() => setEditando(true)}
              className="bg-primario text-white px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-[0.2em] shadow-lg flex items-center gap-3 hover:scale-105 transition-all"
            >
              <FaEdit /> Editar Pasaporte
            </button>
          ) : (
            <>
              <button
                onClick={() => setEditando(false)}
                className="bg-rojo text-white px-6 py-3 rounded-xl font-black uppercase text-[9px] shadow-md hover:scale-105 transition-all"
              >
                Cancelar cambios
              </button>
              <button
                onClick={handleGuardar}
                disabled={saving}
                className="bg-verde text-white px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-[0.2em] shadow-lg flex items-center gap-3 hover:scale-105 transition-all"
              >
                <FaSave /> {saving ? "Confirmando..." : "Actualizar Pasaporte"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
