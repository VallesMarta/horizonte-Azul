"use client";

import { useEffect, useState } from "react";
import Viaje from "@/components/Viaje";
import { FaPlus } from "react-icons/fa";
import { GrConfigure } from "react-icons/gr";
import { ImCross } from "react-icons/im";
import FormCrearViaje from "@/components/forms/FormCrearViaje";
import Servicios from "@/components/Servicios";

interface ViajeType {
  _id?: string;
  origen: string;
  origenAeropuerto: string;
  destino: string;
  destinoAeropuerto: string;
  precio: number;
  descripcion?: string;
  img?: string;
  servicios?: string[]; // IDs de servicios
}

interface GridGetViajesProps {
  urlAPI: string;
}

export default function GridGetViajes({ urlAPI }: GridGetViajesProps) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalServicios, setMostrarModalServicios] = useState(false);
  const [viajes, setViajes] = useState<ViajeType[]>([]);
  const [viajeSeleccionado, setViajeSeleccionado] = useState<ViajeType | null>(
    null,
  );

  // Cargar viajes al iniciar
  useEffect(() => {
    const fetchViajes = async () => {
      setViajes(await getViajes());
    };
    fetchViajes();
  }, []);

  const getViajes = async (): Promise<ViajeType[]> => {
    try {
      const res = await fetch(`${urlAPI}/viajes`);
      if (!res.ok) throw new Error("Error al obtener viajes");
      const json = await res.json();
      return json.resultado || [];
    } catch (err) {
      console.error("Error de conexión:", err);
      return [];
    }
  };

  const handleEditar = (viaje: ViajeType) => {
    setViajeSeleccionado(viaje);
    setMostrarModal(true);
  };

  const refrescarViajes = async () => {
    setViajes(await getViajes());
  };

  return (
    <div className="flex flex-col justify-center items-center mb-3">
      <h1 className="text-secundario m-6 text-center text-4xl font-bold">
        Gestión de viajes
      </h1>

      {/* Botones */}
      <div className="flex flex-row justify-center items-center gap-3 mb-6">
        <button
          onClick={() => setMostrarModalServicios(true)}
          className="flex items-center gap-3 bg-[#D58D44] p-2 rounded-2xl font-bold text-fondo cursor-pointer transform transition duration-300 hover:scale-105 hover:brightness-110 shadow-md"
        >
          <GrConfigure className="text-xl" />
          Gestionar Servicios
        </button>

        <button
          onClick={() => {
            setViajeSeleccionado(null); // Crear nuevo viaje
            setMostrarModal(true);
          }}
          className="flex items-center gap-3 bg-[#3BA054] p-2 rounded-2xl font-bold text-fondo cursor-pointer transform transition duration-300 hover:scale-105 hover:brightness-110 shadow-md"
        >
          <FaPlus className="text-xl" />
          Añadir un nuevo destino de viaje
        </button>
      </div>

      {/* Grid de viajes */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {viajes.map((v) => (
          <Viaje
            key={v._id}
            viaje={v}
            onEditar={() => handleEditar(v)}
            refrescarViajes={refrescarViajes}
            urlAPI={urlAPI}
          />
        ))}
      </div>

      {/* Modal Crear/Editar Viaje */}
      {mostrarModal && (
        <Modal onClose={() => setMostrarModal(false)}>
          <FormCrearViaje
            viaje={viajeSeleccionado}
            refrescarViajes={refrescarViajes}
            urlAPI={urlAPI}
            setMostrarModal={setMostrarModal}
          />
        </Modal>
      )}

      {/* Modal Servicios */}
      {mostrarModalServicios && (
        <Modal onClose={() => setMostrarModalServicios(false)}>
          <Servicios
            setMostrarModalServicios={setMostrarModalServicios}
            urlAPI={urlAPI}
          />
        </Modal>
      )}
    </div>
  );
}

// Componente genérico de modal
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-otro/60 flex justify-center items-center z-50">
      <div className="bg-otro border-2 border-primario p-6 rounded-xl shadow-2xl w-[70%] max-w-[800px] relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 text-xl font-bold hover:text-[#D13264]"
        >
          <ImCross />
        </button>
        {children}
      </div>
    </div>
  );
}
