"use client";

import Image from "next/image";
import {
  FaGlobeAmericas,
  FaUsers,
  FaHistory,
  FaBullseye,
} from "react-icons/fa";

// --- DATOS DEL EQUIPO ---
const equipo = [
  {
    nombre: "Marta Vallés Terol",
    cargo: "Fundadora & CEO",
    img: "/media/multimedia/ceo.png",
  },
  {
    nombre: "Izzy Silva Durán",
    cargo: "Especialista en Destinos",
    img: "/media/multimedia/empleada1.png",
  },
  {
    nombre: "Emma Blanchard Miller",
    cargo: "Logística Digital",
    img: "/media/multimedia/empleada2.png",
  },
  {
    nombre: "Jack Trakarsky Hidalgo",
    cargo: "Atención al Viajero",
    img: "/media/multimedia/empleado3.png",
  },
];

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-fondo transition-colors duration-500 pb-20">
      {/* HERO SECTION */}
      <section className="relative h-[30vh] flex items-center justify-center overflow-hidden bg-secundario">
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-black text-bg uppercase tracking-tighter italic">
            Sobre <span className="text-otro">Nosotros</span>
          </h1>
          <p className="text-bg text-sm md:text-lg font-bold mt-4 uppercase tracking-[0.3em]">
            Uniendo destinos, creando memorias
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        {/* TARJETAS DE VALORES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-8 rounded-3xl shadow-xl border border-card-borde transition-all hover:scale-105">
            <FaHistory className="text-primario text-4xl mb-4" />
            <h3 className="text-titulo-resaltado font-black text-xl uppercase mb-2">
              Nuestra Historia
            </h3>
            <p className="text-gris text-sm leading-relaxed">
              Nacimos bajo la premisa de que viajar no es solo moverse, sino
              transformarse. Horizonte Azul comenzó como un pequeño proyecto
              final de grado superior.
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl shadow-xl border border-card-borde transition-all hover:scale-105">
            <FaBullseye className="text-verde text-4xl mb-4" />
            <h3 className="text-titulo-resaltado font-black text-xl uppercase mb-2">
              Misión
            </h3>
            <p className="text-gris text-sm leading-relaxed">
              Facilitar el acceso a las maravillas del mundo a través de
              tecnología intuitiva y un servicio humano excepcional.
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl shadow-xl border border-card-borde transition-all hover:scale-105">
            <FaGlobeAmericas className="text-otro text-4xl mb-4" />
            <h3 className="text-titulo-resaltado font-black text-xl uppercase mb-2">
              Visión
            </h3>
            <p className="text-gris text-sm leading-relaxed">
              Ser la plataforma líder en experiencias de viaje personalizadas,
              donde cada usuario sienta que el horizonte no tiene límites.
            </p>
          </div>
        </div>

        {/* SECCIÓN DEL EQUIPO */}
        <section className="mt-24 text-center">
          <div className="flex flex-col items-center mb-12">
            <FaUsers className="text-primario text-5xl mb-4" />
            <h2 className="text-4xl font-black text-titulo-resaltado uppercase italic tracking-tighter">
              El Equipo <span className="text-primario">Horizonte</span>
            </h2>
            <div className="w-20 h-1.5 bg-otro mt-2 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {equipo.map((persona, index) => (
              <div
                key={index}
                className="group relative bg-borde-fuerte rounded-4xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:z-30"
              >
                <div className="relative h-72 w-full">
                  <Image
                    src={persona.img}
                    alt={persona.nombre}
                    fill
                    loading="eager"
                    className="object-cover group-hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Overlay Gradiente */}
                  <div className="absolute inset-0 bg-linear-to-t from-secundario/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6 text-center">
                  <h4 className="text-titulo-resaltado font-black uppercase text-lg group-hover:text-primario transition-colors">
                    {persona.nombre}
                  </h4>
                  <p className="text-[10px] font-bold text-gris-medio uppercase tracking-widest mt-1">
                    {persona.cargo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
