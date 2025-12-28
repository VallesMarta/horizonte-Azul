import { useState, useEffect } from "react";

function MisReservas({ urlAPI }) {
  const usuario_id = localStorage.getItem("username_id");
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    if (!usuario_id) return;

    const fetchReservas = async () => {
      try {
        const res = await fetch(`${urlAPI}/reservas/mis-reservas/${usuario_id}`);
        const data = await res.json();
        if (data.ok) {
          setReservas(data.resultado);
        } else {
          console.error("No se pudieron cargar tus reservas");
        }
      } catch (err) {
        console.error("Error de conexión con el servidor");      
      }
    };

    fetchReservas();
  }, [usuario_id, urlAPI]);

  if (!usuario_id) {
    return <p className="text-center mt-10 text-red-600 font-bold">Debes iniciar sesión para ver tus reservas</p>;
  }

  if (reservas.length === 0) {
    return <p className="text-center mt-10 text-texto font-bold">No tienes reservas todavía</p>;
  }

  return (
    <div className="flex flex-col   mb-3">
          <h1 className="text-secundario m-6 text-center text-4xl font-bold">Mis reservas</h1>
          <div className="flex flex-row flex-wrap justify-center gap-5 p-5">
              {reservas.map(reserva => (
              <div
                  key={reserva._id}
                  className="w-full max-w-[300px] p-4 bg-otro rounded-xl shadow-md flex flex-col gap-2 
                          transform transition-all duration-300 ease-in-out
                          hover:shadow-lg hover:scale-105"
              >
                  {/* Encabezado: Destino */}
                  <h3 className="text-secundario font-extrabold text-xl text-center">{reserva.viaje?.destino}</h3>

                  {/* Origen y destino */}
                  <p className="text-texto">
                  <span className="font-bold">Origen:</span> {reserva.viaje?.origen || "Desconocido"} ({reserva.viaje?.origenAeropuerto || "Sin aeropuerto"})
                  </p>
                  <p className="text-texto">
                  <span className="font-bold">Destino:</span> {reserva.viaje?.destino || "Desconocido"} ({reserva.viaje?.destinoAeropuerto || "Sin aeropuerto"})
                  </p>

                  {/* Fecha de salida */}
                  <p className="text-texto">
                  <span className="font-bold">Fecha de salida:</span> {new Date(reserva.fecSalida).toLocaleDateString()}
                  </p>

                  {/* Pasajeros */}
                  <p className="text-texto">
                  <span className="font-bold">Pasajeros:</span> {reserva.pasajeros}
                  </p>

                  {/* Estado */}
                  <p className="text-texto">
                  <span className="font-bold">Estado:</span> {reserva.estado}
                  </p>

                  {/* Precio */}
                  <p className="text-secundario font-bold text-right">
                  Precio: {reserva.viaje?.precio}€
                  </p>
              </div>
              ))}              
          </div>
      </div>
    );  
}

export default MisReservas;
