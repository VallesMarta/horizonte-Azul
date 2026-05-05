"use client";

import { FaTrash } from "react-icons/fa";

export function PasajeroCard({
  i,
  p,
  actualizarPasajero,
  eliminarPasajero,
  totalPasajeros,
}: any) {
  return (
    <div className="bg-bg border border-borde rounded-3xl p-5 space-y-4 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primario/10 flex items-center justify-center">
            <span className="text-[10px] font-black text-primario">
              {i + 1}
            </span>
          </div>
          <p className="text-[10px] font-black text-gris uppercase tracking-widest">
            Pasajero {i + 1}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => actualizarPasajero(i, "esAdulto", !p.esAdulto)}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border-2 transition-all ${
              p.esAdulto
                ? "border-primario text-primario bg-primario/5"
                : "border-naranja text-naranja bg-naranja/5"
            }`}
          >
            {p.esAdulto ? "Adulto" : "Menor"}
          </button>
          {totalPasajeros > 1 && (
            <button
              onClick={() => eliminarPasajero(i)}
              className="p-1.5 text-gris hover:text-rojo hover:bg-rojo/10 rounded-lg transition-all"
            >
              <FaTrash size={11} />
            </button>
          )}
        </div>
      </div>

      {/* Campos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          {
            key: "nombre",
            label: "Nombre",
            placeholder: "Nombre",
            type: "text",
          },
          {
            key: "apellidos",
            label: "Apellidos",
            placeholder: "Apellidos",
            type: "text",
          },
        ].map(({ key, label, placeholder, type }) => (
          <div key={key}>
            <label className="text-[9px] font-black text-gris uppercase tracking-widest block mb-1">
              {label}
            </label>
            <input
              type={type}
              placeholder={placeholder}
              value={(p as any)[key]}
              onChange={(e) => actualizarPasajero(i, key, e.target.value)}
              className="w-full bg-fondo border border-borde rounded-xl px-3 py-2.5 text-sm font-bold text-texto outline-none focus:border-primario transition-colors placeholder:text-placeholder"
            />
          </div>
        ))}

        <div>
          <label className="text-[9px] font-black text-gris uppercase tracking-widest block mb-1">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            value={p.fecNacimiento}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              actualizarPasajero(i, "fecNacimiento", e.target.value)
            }
            className="w-full bg-fondo border border-borde rounded-xl px-3 py-2.5 text-sm font-bold text-texto outline-none focus:border-primario transition-colors"
          />
        </div>

        <div>
          <label className="text-[9px] font-black text-gris uppercase tracking-widest block mb-1">
            Tipo documento
          </label>
          <select
            value={p.tipoDocumento}
            onChange={(e) =>
              actualizarPasajero(i, "tipoDocumento", e.target.value)
            }
            className="w-full bg-fondo border border-borde rounded-xl px-3 py-2.5 text-sm font-bold text-texto outline-none focus:border-primario transition-colors"
          >
            {["DNI", "NIE", "NIF", "Pasaporte"].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[9px] font-black text-gris uppercase tracking-widest block mb-1">
            Nº Documento
          </label>
          <input
            type="text"
            placeholder="12345678A"
            value={p.numDocumento}
            onChange={(e) =>
              actualizarPasajero(
                i,
                "numDocumento",
                e.target.value.toUpperCase(),
              )
            }
            className="w-full bg-fondo border border-borde rounded-xl px-3 py-2.5 text-sm font-bold text-texto outline-none focus:border-primario transition-colors placeholder:text-placeholder uppercase"
          />
        </div>

        <div>
          <label className="text-[9px] font-black text-gris uppercase tracking-widest block mb-1">
            Caducidad documento
          </label>
          <input
            type="date"
            value={p.fecCaducidadDocumento}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              actualizarPasajero(i, "fecCaducidadDocumento", e.target.value)
            }
            className="w-full bg-fondo border border-borde rounded-xl px-3 py-2.5 text-sm font-bold text-texto outline-none focus:border-primario transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
