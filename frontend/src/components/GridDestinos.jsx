import { useEffect, useState } from 'react';
import Destino from './Destino'

function GridDestinos({urlAPI}) {
  const [viajes, setViajes] = useState([]);

  useEffect(() => {
    // renderiza la variable
    let cargarViajes = async () => {
      setViajes(await listarViajes());
    }
    cargarViajes();    
  },[])

  const listarViajes = async () => {
    try {
      const respuesta = await fetch(urlAPI + '/viajes');
      const data = await respuesta.json();

      if (respuesta.ok) {
        return data.resultado;
      }
    } catch (error) {
      console.error("ERROR: No hay viajes disponibles");
      return [];
    }
  };

  return (
    <div className="mt-6 grid grid-cols-1 grid-cols-5 gap-4 justify-between">
      {viajes.map((viajeSel) => (
        <Destino key={viajeSel._id} viaje={viajeSel} urlAPI={urlAPI} />
      ))}
    </div>
  )
}

export default GridDestinos
