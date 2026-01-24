import { useState, useEffect, FormEvent } from "react";
import { FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";
import { RiMoneyEuroCircleFill } from "react-icons/ri";
import { AiOutlinePicture } from "react-icons/ai";

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

interface ServicioType {
  _id: string;
  nombre: string;
}

interface FormCrearViajeProps {
  viaje?: ViajeType | null;
  setMostrarModal: (mostrar: boolean) => void;
  refrescarViajes: () => void;
  urlAPI: string;
}

export default function FormCrearViaje({
  viaje = null,
  setMostrarModal,
  refrescarViajes,
  urlAPI,
}: FormCrearViajeProps) {
  const esEditar = !!viaje;

  const [origen, setOrigen] = useState(viaje?.origen || "");
  const [origenAeropuerto, setOrigenAeropuerto] = useState(viaje?.origenAeropuerto || "");
  const [destino, setDestino] = useState(viaje?.destino || "");
  const [destinoAeropuerto, setDestinoAeropuerto] = useState(viaje?.destinoAeropuerto || "");
  const [precio, setPrecio] = useState<number>(viaje?.precio || 0);
  const [descripcion, setDescripcion] = useState(viaje?.descripcion || "UPS. No hay ninguna descripción actualmente");
  const [img, setImg] = useState(viaje?.img || `${urlAPI}/public/media/img/img-inicio-destino-por-defecto.png`);
  const [servicios, setServicios] = useState<string[]>(viaje?.servicios || []);
  const [listaServicios, setListaServicios] = useState<ServicioType[]>([]);

  useEffect(() => {
    fetch(`${urlAPI}/servicios`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setListaServicios(data.resultado);
      });
  }, [urlAPI]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const datosViaje: ViajeType = {
      origen,
      origenAeropuerto,
      destino,
      destinoAeropuerto,
      precio,
      descripcion,
      img,
      servicios,
    };

    const url = esEditar ? `${urlAPI}/viajes/${viaje!._id}` : `${urlAPI}/viajes`;
    const method = esEditar ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosViaje),
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          alert(`Viaje ${esEditar ? "actualizado" : "creado"} correctamente`);
          setMostrarModal(false);
          refrescarViajes();
        } else {
          alert("Error guardando el viaje");
        }
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4 w-full">
      <h2 className="text-fondo font-bold text-xl underline bg-secundario rounded-xl p-2 text-center">
        {esEditar ? "Editar Viaje" : "Crear Viaje"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ORIGEN */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 font-bold text-texto">
            <FaPlaneDeparture className="text-xl" /> Origen
          </label>
          <input
            type="text"
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
            required
            className="bg-fondo rounded-md p-2"
            placeholder="Ej: España"
          />
        </div>
        {/* DESTINO */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 font-bold text-texto">
            <FaPlaneArrival className="text-xl" /> Destino
          </label>
          <input
            type="text"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            required
            className="bg-fondo rounded-md p-2"
            placeholder="Ej: Irlanda"
          />
        </div>
        {/* ORIGEN AEROPUERTO */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 font-bold text-texto">
            <FaPlaneDeparture className="text-xl" /> Salida de
          </label>
          <input
            type="text"
            value={origenAeropuerto}
            onChange={(e) => setOrigenAeropuerto(e.target.value)}
            required
            className="bg-fondo rounded-md p-2"
            placeholder="Ej: Valencia"
          />
        </div>
        {/* DESTINO AEROPUERTO */}
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 font-bold text-texto">
            <FaPlaneArrival className="text-xl" /> Llegada en
          </label>
          <input
            type="text"
            value={destinoAeropuerto}
            onChange={(e) => setDestinoAeropuerto(e.target.value)}
            required
            className="bg-fondo rounded-md p-2"
            placeholder="Ej: Dublín"
          />
        </div>
      </div>

      {/* PRECIO */}
      <div className="flex flex-col gap-1 w-full md:w-1/3">
        <label className="flex items-center gap-2 font-bold text-texto">
          <RiMoneyEuroCircleFill className="text-xl" /> Precio
        </label>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(parseFloat(e.target.value))}
          min={0}
          step={0.01}
          required
          className="bg-fondo rounded-md p-2"
        />
      </div>

      {/* IMAGEN */}
      <div className="flex flex-col gap-1 w-full">
        <label className="flex items-center gap-2 font-bold text-texto">
          <AiOutlinePicture className="text-xl" /> Imagen a mostrar
        </label>
        <input
          type="text"
          value={img}
          onChange={(e) => setImg(e.target.value)}
          className="bg-fondo rounded-md p-2"
          placeholder="INFO: Solo URLs de imágenes de Internet"
        />
      </div>

      {/* DESCRIPCIÓN */}
      <div className="flex flex-col gap-1 w-full">
        <label className="font-bold text-texto">Descripción del viaje</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="bg-fondo rounded-md p-2 resize-none"
        />
      </div>

      {/* SERVICIOS */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-texto">Servicios disponibles</label>
        {listaServicios.map((serv) => (
          <div
            key={serv._id}
            className="flex items-center gap-2 cursor-pointer hover:bg-texto hover:text-fondo hover:font-bold p-1 rounded"
            onClick={() =>
              setServicios(
                servicios.includes(serv._id)
                  ? servicios.filter((id) => id !== serv._id)
                  : [...servicios, serv._id]
              )
            }
          >
            <input type="checkbox" checked={servicios.includes(serv._id)} readOnly className="cursor-pointer" />
            <span>{serv.nombre}</span>
          </div>
        ))}
      </div>

      {/* BOTONES */}
      <div className="flex flex-row gap-4 justify-end items-center">
        <button
          type="button"
          onClick={() => setMostrarModal(false)}
          className="bg-[#D13264] p-3 rounded-xl text-fondo font-bold"
        >
          Cancelar
        </button>
        <button type="submit" className="bg-[#3BA054] p-3 rounded-xl text-fondo font-bold">
          Guardar
        </button>
      </div>
    </form>
  );
}
