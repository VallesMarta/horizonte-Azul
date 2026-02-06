import Link from "next/link";
import { FaCheckCircle, FaPlane } from "react-icons/fa";

export default function ApiWelcome() {
  return (
    <div className="min-h-screen bg-fondo flex flex-col items-center justify-center p-4 font-sans">
      {/* Icono Principal */}
      <div className="mb-6 text-primario animate-bounce">
        <FaPlane size={50} />
      </div>

      {/* Caja de Estado */}
      <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-sm text-center max-w-sm w-full">
        <h1 className="text-secundario text-2xl font-black uppercase tracking-tighter mb-2">
          Horizonte Azul API
        </h1>
        
        <div className="flex items-center justify-center gap-2 text-green-600 font-bold mb-6">
          <FaCheckCircle />
          <span>SISTEMA FUNCIONANDO</span>
        </div>

        <p className="text-gray-500 text-sm mb-8">
          El motor de reservas y gestión de viajes está en línea y respondiendo correctamente.
        </p>

        <Link 
          href="/" 
          className="block w-full bg-secundario text-fondo py-3 rounded-xl font-bold hover:brightness-110 transition-all active:scale-95"
        >
          Ir a la Web
        </Link>
      </div>
      <span className="mt-6 text-[10px] text-gray-400 font-mono">
        STATUS: 200 OK | PORT: 3000 | V.1.0.0
      </span>
    </div>
  );
}