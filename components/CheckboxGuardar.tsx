"use client";

import { FaCheckCircle } from "react-icons/fa";

interface CheckboxGuardarProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

export default function CheckboxGuardar({ checked, onChange }: CheckboxGuardarProps) {
  return (
    <div 
      className="pt-2 flex items-center gap-3 cursor-pointer group select-none" 
      onClick={() => onChange(!checked)}
    >
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
        checked ? 'bg-primario border-primario' : 'border-white/20 bg-white/5'
      }`}>
        {checked && <FaCheckCircle size={12} className="text-white" />}
      </div>
      <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">
        Guardar tarjeta para próximos viajes
      </span>
    </div>
  );
}