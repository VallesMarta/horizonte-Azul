import { useEffect, useState } from "react";
import Viaje from "./Viaje";
import { FaPlus } from "react-icons/fa";
import { GrConfigure } from "react-icons/gr";
import FormCrearViaje from "./FormCrearViaje";
import { ImCross } from "react-icons/im";
import Servicios from "./Servicios";

function GridGetViajes({urlAPI}) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalServicios, setMostrarModalServicios] = useState(false);
  const [viajes, setViajes] = useState([]);
  const [viajeSeleccionado, setViajeSeleccionado] = useState(null); // Para editar
  

  useEffect(() => {
    const fetchViajes = async () => {
      const data = await getViajes();
      setViajes(data);
    };
    fetchViajes();
  }, []);

  const getViajes = async () => {
    try {
      const respuesta = await fetch(urlAPI + "/viajes");
      console.log(respuesta);
      
      if (respuesta.ok) {
        const json = await respuesta.json();
        return json.resultado || [];
      } else {
        console.error("Error al obtener viajes");
        return [];
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      return [];
    }
  };

  const handleEditar = (viaje) => {
    setViajeSeleccionado(viaje); // Cargar info en el formulario
    setMostrarModal(true);
  };

  const refrescarViajes = async () => {
    const data = await getViajes();
    setViajes(data);
  };

  return (
    <div className="flex flex-col justify-center items-center mb-3">
      <h1 className="text-secundario m-6 text-center text-4xl font-bold">Gestión de viajes</h1>

      {/* Botones */}
      <div className="flex flex-row justify-center items-center gap-3">
        <div onClick={()=>{{ setMostrarModalServicios(true); }}} className="flex flex-row justify-center items-center gap-3 bg-[#D58D44] p-2 rounded-2xl font-bold text-fondo cursor-pointer transform transition duration-300 hover:scale-105 hover:brightness-110 shadow-md">
          
          <GrConfigure className="text-xl" />
          <button type="button">Gestionar Servicios</button>
        </div>

        <div
          onClick={() => { setViajeSeleccionado(null); setMostrarModal(true); }}
          className="flex flex-row justify-center items-center gap-3 bg-[#3BA054] p-2 rounded-2xl font-bold text-fondo cursor-pointer transform transition duration-300 hover:scale-105 hover:brightness-110 shadow-md"
        >
          <FaPlus className="text-xl" />
          <button type="button">Añadir un nuevo destino de viaje</button>
        </div>
      </div>

      {/* Grid viajes */}
      <div className="mt-6 grid grid-cols-1 grid-cols-5 gap-4 justify-between">
        {viajes.map((v) => (
          <Viaje
            key={v._id}
            urlAPI={urlAPI}
            viaje={v}
            setMostrarModal={setMostrarModal}
            onEditar={() => handleEditar(v)}
            refrescarViajes={refrescarViajes} // Para recargar después de guardar
          />
        ))}
      </div>

      {/* Modal con FormCrearViaje */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-otro/60 flex justify-center items-center z-50">
          <div className="bg-otro border-2 border-primario p-6 rounded-xl shadow-2xl w-[70%] max-w-[800px] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-3 right-3 text-gray-700 text-xl font-bold hover:text-[#D13264]"
            >
              <ImCross />
            </button>
            <FormCrearViaje
              setMostrarModal={setMostrarModal}
              viaje={viajeSeleccionado} // Pasamos el viaje a editar o null si es crear
              refrescarViajes={refrescarViajes} // Para recargar después de guardar
              urlAPI={urlAPI}
            />
          </div>
        </div>
      )}
      {/* Modal con CRUD Servicios */}
      {mostrarModalServicios && (
        <div className="fixed inset-0 bg-otro/60 flex justify-center items-center z-50">
          <div className="bg-otro border-2 border-primario p-6 rounded-xl shadow-2xl w-[70%] max-w-[800px] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setMostrarModalServicios(false)}
              className="absolute top-3 right-3 text-gray-700 text-xl font-bold hover:text-[#D13264]"
            >
              <ImCross />
            </button>
            <Servicios setMostrarModalServicios={setMostrarModalServicios} urlAPI={urlAPI} />
          </div>
        </div>
      )}
    </div>
  );
}

export default GridGetViajes;
