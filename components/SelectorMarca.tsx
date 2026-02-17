"use client";

import { SiVisa, SiMastercard, SiAmericanexpress, SiPaypal, SiApplepay, SiGooglepay } from "react-icons/si";

interface SelectorMarcaProps {
  value: string;
  onChange: (val: string) => void;
}

const marcasConfig: Record<string, { icono: any; color: string }> = {
    Mastercard: { icono: SiMastercard, color: "from-orange-500 to-red-600" },
    Visa: { icono: SiVisa, color: "from-blue-600 to-blue-800" },
    "Apple Pay": { icono: SiApplepay, color: "from-gray-700 to-black" },
    "Google Pay": { icono: SiGooglepay, color: "from-red-500 via-yellow-500 to-green-500" },
    PayPal: { icono: SiPaypal, color: "from-blue-400 to-blue-600" }, 
    "American Express": { icono: SiAmericanexpress, color: "from-cyan-500 to-blue-500" },
};

export default function SelectorMarca({ value, onChange }: SelectorMarcaProps) {
  return (
    <div className="w-full">
      <p className="text-[10px] font-black text-gris uppercase tracking-widest mb-3 ml-1">
        Método de pago
      </p>

      {/* Contenedor Scrollable */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mt-2">
        {Object.entries(marcasConfig).map(([id, info]) => {
          const Icono = info.icono;
          const isSelected = value === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`
                relative flex-shrink-0 flex flex-col items-center justify-center 
                w-20 h-16 rounded-2xl transition-all duration-300 border
                ${
                  isSelected
                    ? `border-transparent text-white shadow-lg`
                    : `border-white/10 bg-white/5 text-gris hover:bg-white/10 hover:border-white/20`
                }
              `}
            >
              {/* Fondo con gradiente si está seleccionado */}
              {isSelected && (
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${info.color} animate-in fade-in zoom-in duration-300`}
                />
              )}

              {/* Contenido del botón */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <Icono size={24} />
                <span
                  className={`text-[8px] font-bold uppercase tracking-tighter ${
                    isSelected ? "text-white" : "text-gris"
                  }`}
                >
                  {id === "American Express" ? "Amex" : id}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}