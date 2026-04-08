import { IconType } from "react-icons";

interface InputAuthProps {
  Icon: IconType;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}

export const InputAuth = ({ Icon, name, placeholder, type = "text", required = true }: InputAuthProps) => (
  <div className="flex items-center bg-fondo rounded-lg p-1 group focus-within:ring-2 focus-within:ring-otro transition-all">
    <Icon className="mx-3 text-secundario text-xl group-focus-within:scale-110 transition-transform" />
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      className="bg-transparent p-3 w-full text-titulo-resaltado outline-none font-bold disabled:opacity-50"
    />
  </div>
);