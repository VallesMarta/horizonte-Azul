"use client";

interface SecurityInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const SecurityInput = ({ label, ...props }: SecurityInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-primario uppercase tracking-[0.2em] ml-1">
        {label}
      </label>
      <input
        {...props}
        autoComplete="new-password"
        className="w-full bg-primario/5 border border-borde rounded-xl 
        p-4 text-xs font-bold outline-none focus:border-primario focus:ring-4 
      transition-all text-titulo-resaltado"
        required
      />
    </div>
  );
};
