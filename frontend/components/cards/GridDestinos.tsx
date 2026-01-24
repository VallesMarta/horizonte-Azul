"use client";

import { useEffect, useState } from "react";
import Destino from "@/components/cards/Destino";

interface GridDestinosProps {
  urlAPI: string;
}

interface ViajeType {
  _id: string;
  origen: string;
  origenAeropuerto: string;
  destino: string;
  destinoAeropuerto: string;
  precio: number;
  img?: string;
  descripcion?: string;
}

export default function GridDestinos({ urlAPI }: GridDestinosProps) {
  const [viajes, setViajes] = useState<ViajeType[]>([]);

  useEffect(() => {
    const cargarViajes = async () => {
      const data = await listarViajes();
      setViajes(data);
    };
    cargarViajes();
  }, []);

  const listarViajes = async (): Promise<ViajeType[]> => {
    try {
      const res = await fetch(`${urlAPI}/viajes`);
      if (!res.ok) throw new Error("Error al obtener viajes");
      const json = await res.json();
      return json.resultado;
    } catch (err) {
      console.error("ERROR: No hay viajes disponibles", err);
      return [];
    }
  };

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {viajes.map((viaje) => (
        <Destino
          key={viaje._id}
          viaje={viaje}      
          urlAPI={urlAPI}
        />
      ))}
    </div>
  );
}
