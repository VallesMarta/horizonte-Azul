import { useEffect, useState, FormEvent } from "react";
import { GrDocumentConfig } from "react-icons/gr";
import { FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";

interface Servicio {
  _id: string;
  nombre: string;
}

interface ServiciosProps {
  setMostrarModalServicios: (mostrar: boolean) => void;
  urlAPI: string;
}

const Servicios = ({ setMostrarModalServicios, urlAPI }: ServiciosProps) => {
  const [nombre, setNombre] = useState("");
  const [servicios, setServicios] = useState<Servicio[]>([]);

  // Listar servicios al cargar
  useEffect(() => {
    listarServicios();
  }, []);

  const listarServicios = async () => {
    try {
      const respuesta = await fetch(`${urlAPI}/servicios`);
      if (respuesta.ok) {
        const data = await respuesta.json();
        setServicios(data.resultado || []);
      }
    } catch (error) {
      console.error("Error listando servicios:", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newServicio = { nombre };

    try {
      const respuesta = await fetch(`${urlAPI}/servicios`, {
        method: "POST",
        body: JSON.stringify(newServicio),
        headers: { "Content-Type": "application/json; charset=UTF-8" },
      });

      if (respuesta.ok) {
        setNombre("");
        alert("Servicio creado correctamente");
        listarServicios();
      }
    } catch (error) {
      console.error("Error creando servicio:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const respuesta = await fetch(`${urlAPI}/servicios/${id}`, { method: "DELETE" });
      if (respuesta.ok) {
        listarServicios();
      }
    } catch (error) {
      console.error("Error eliminando servicio:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4 w-full">
      <h2 className="text-fondo font-bold text-xl underline bg-secundario rounded-xl p-2 text-center">
        Gestión de servicios
      </h2>

      {/* Crear Servicio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 font-bold text-texto">
            <GrDocumentConfig className="text-xl" /> Nombre del servicio
          </label>
          <div className="flex flex-row items-center">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="h-full w-[280px] bg-fondo rounded-l-xl p-2 transition-all duration-300 ease-in-out"
              placeholder="Ej: Comida incluida en el vuelo"
            />
            <button
              type="submit"
              className="flex items-center justify-center h-full w-[50px] bg-verde p-2 rounded-r-xl text-fondo transition-all duration-300 ease-in-out hover:bg-green-600 hover:scale-105 cursor-pointer"
            >
              <FaPlus className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {servicios.map((servicio) => (
          <div
            key={servicio._id}
            className="flex flex-row items-center justify-between bg-iconos text-secundario rounded-xl p-2"
          >
            <button type="button">{servicio.nombre}</button>
            <button
              onClick={() => handleDelete(servicio._id)}
              className="text-texto hover:text-rojo"
              type="button"
            >
              <ImCross className="font-bold" />
            </button>
          </div>
        ))}
      </div>

      {/* Botón Cerrar */}
      <div className="flex flex-row gap-4 justify-end items-center">
        <button
          type="button"
          onClick={() => setMostrarModalServicios(false)}
          className="bg-rojo p-3 rounded-xl text-fondo font-bold"
        >
          Cerrar
        </button>
      </div>
    </form>
  );
};

export default Servicios;
