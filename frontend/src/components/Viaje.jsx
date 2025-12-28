import CardDescripcion from "./CardDescripcion";
import { RiEditBoxFill } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";

function Viaje({ viaje, onEditar, refrescarViajes, urlAPI }) {
  const { destino, destinoAeropuerto, precio, img=`${urlAPI}/public/media/img/img-inicio-destino-por-defecto.png`, descripcion="Añade una descripción detallada del viaje..." } = viaje;
  
  const eliminarViaje = () => {
    const deleteViaje = async () => {
      const options = {
        method: 'DELETE'
      };

      let respuesta = await fetch(`${urlAPI}/viajes/${viaje._id}`, options);
      if (respuesta.ok) {
        refrescarViajes();
      }
    }
    deleteViaje();
  }

  return (
    <div className="w-full max-w-[280px] justify-between p-3 rounded-xl flex flex-col bg-otro shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]">
      <img className="w-full h-48 object-cover rounded-lg mb-3" src={img} alt={destino} />

      <h3 className="text-secundario font-extrabold text-2xl text-center mb-1">{destino}</h3>
      <h5 className="text-center text-sm text-texto uppercase mb-2 font-bold">{destinoAeropuerto}</h5>
      <CardDescripcion descripcion={descripcion} />
      <p className="text-secundario font-semibold text-lg text-right mb-4">Precio: {precio}€</p>

      <div className="flex flex-row gap-3 justify-between">
        <button
          onClick={onEditar}
          type="button"
          className="flex flex-row justify-center items-center gap-2 cursor-pointer mt-4 p-2 rounded-lg bg-[#D58D44] text-fondo font-bold text-lg transition-all duration-300 hover:bg-[#D58D44]/80 hover:scale-[1.05] active:scale-[0.95] active:bg-[#D58D44]/60 shadow-md hover:shadow-lg self-center"
        >
          <RiEditBoxFill />Editar
        </button>
        <button
          onClick={() => eliminarViaje()}
          type="button"
          className="flex flex-row justify-center items-center gap-2 cursor-pointer mt-4 p-2 rounded-lg bg-[#D13264] text-fondo font-bold text-lg transition-all duration-300 hover:bg-[#D13264]/80 hover:scale-[1.05] active:scale-[0.95] active:bg-[#D13264]/60 shadow-md hover:shadow-lg self-center"
        >
          <FaTrashAlt />Eliminar
        </button>
      </div>
    </div>
  );
}

export default Viaje;
