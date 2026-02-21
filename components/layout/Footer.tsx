"use client";

import Link from "next/link";
import {
  FaInstagram,
  FaFacebook,
  FaPlane,
  FaShieldAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secundario text-blanco-fijo w-full">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-center lg:text-left">          
          {/* Columna 1: Logo + Descripción */}
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start space-y-4">
            <Link href="/">
              <img
                src="/media/img/logo_empresa_header.png"
                alt="Logo de Horizonte Azul"
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed opacity-80 max-w-sm">
              Tu puerta de entrada al mundo. Gestiona tus vuelos con la
              confianza de
              <strong className="text-blanco-fijo"> Horizonte Azul</strong>. Seguridad, rapidez y eficiencia
              en cada reserva.
            </p>
          </div>

          {/* Columna 2: Servicios */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FaPlane className="text-iconos" /> Servicios
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/reserva-vuelos" className="hover:text-iconos transition-all inline-block">Reservas de vuelos</Link></li>
              <li><Link href="/gestion-reservas" className="hover:text-iconos transition-all inline-block">Gestión de reservas</Link></li>
              <li><Link href="/consulta-vuelos" className="hover:text-iconos transition-all inline-block">Consultas de vuelos</Link></li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FaShieldAlt className="text-iconos" /> Legal
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/politica-privacidad" className="hover:text-iconos transition-all inline-block">Privacidad</Link></li>
              <li><Link href="/terminos-condiciones" className="hover:text-iconos transition-all inline-block">Términos</Link></li>
              <li><Link href="/aviso-legal" className="hover:text-iconos transition-all inline-block">Aviso Legal</Link></li>
            </ul>
          </div>

          {/* Columna 4: Redes */}
          <div className="flex flex-col items-center lg:items-start space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FaInfoCircle className="text-iconos" /> Síguenos
            </h2>
            <div className="flex gap-4">
              <a href="#" className="bg-blanco-fijo/10 p-2 rounded-full hover:bg-iconos hover:text-secundario transition-all"><FaInstagram size={20} /></a>
              <a href="#" className="bg-blanco-fijo/10 p-2 rounded-full hover:bg-iconos hover:text-secundario transition-all"><FaFacebook size={20} /></a>
              <a href="#" className="bg-blanco-fijo/10 p-2 rounded-full hover:bg-iconos hover:text-secundario transition-all"><BsTwitterX size={20} /></a>
            </div>
          </div>
        </div>

        {/* Separador y Copyright */}
        <div className="mt-12 pt-8 border-t border-blanco-fijo/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-center md:text-left opacity-70">
          <p>© {currentYear} Horizonte Azul S.L. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}