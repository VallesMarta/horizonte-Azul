"use client";

import {
  FaUserCircle,
  FaSignOutAlt,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaPlane,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaShieldAlt,
  FaInfoCircle,
  FaBars,
  FaTimes,
  FaCheckCircle,
  FaLock,
  FaClock,
  FaEuroSign,
  FaUser,
  FaKey,
  FaEnvelope,
  FaIdBadge,
  FaArrowRight,
  FaPlus,
  FaConciergeBell,
  FaChartPie,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaSuitcase,
  FaPaperPlane,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaGlobe,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaSearch,
  FaGlobeAmericas,
  FaHashtag,
  FaFont,
  FaCheck,
  FaToggleOn,
} from "react-icons/fa";
import { GrConfigure } from "react-icons/gr";
import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
  SiPaypal,
  SiApplepay,
  SiGooglepay,
} from "react-icons/si";
import { ImCross } from "react-icons/im";

export default function IconosResumen() {
  const categorias = [
    {
      titulo: "Navegación",
      icons: [
        { I: FaBars, n: "FaBars" },
        { I: FaTimes, n: "FaTimes" },
        { I: ImCross, n: "ImCross" },
        { I: FaChevronLeft, n: "FaChevronLeft" },
        { I: FaChevronRight, n: "FaChevronRight" },
        { I: FaArrowRight, n: "FaArrowRight" },
        { I: FaSearch, n: "FaSearch" },
        { I: FaSpinner, n: "FaSpinner" },
        { I: FaSignOutAlt, n: "FaSignOutAlt" },
      ],
    },
    {
      titulo: "Vuelos y Destinos",
      icons: [
        { I: FaPlane, n: "FaPlane" },
        { I: FaPlaneDeparture, n: "FaPlaneDeparture" },
        { I: FaPlaneArrival, n: "FaPlaneArrival" },
        { I: FaGlobe, n: "FaGlobe" },
        { I: FaGlobeAmericas, n: "FaGlobeAmericas" },
        { I: FaMapMarkerAlt, n: "FaMapMarkerAlt" },
        { I: FaSuitcase, n: "FaSuitcase" },
        { I: FaClock, n: "FaClock" },
      ],
    },
    {
      titulo: "Usuarios",
      icons: [
        { I: FaUser, n: "FaUser" },
        { I: FaUserCircle, n: "FaUserCircle" },
        { I: FaIdBadge, n: "FaIdBadge" },
        { I: FaEnvelope, n: "FaEnvelope" },
        { I: FaKey, n: "FaKey" },
        { I: FaLock, n: "FaLock" },
        { I: FaShieldAlt, n: "FaShieldAlt" },
      ],
    },
    {
      titulo: "Pagos y Finanzas",
      icons: [
        { I: SiVisa, n: "SiVisa" },
        { I: SiMastercard, n: "SiMastercard" },
        { I: SiAmericanexpress, n: "SiAmericanexpress" },
        { I: SiPaypal, n: "SiPaypal" },
        { I: SiApplepay, n: "SiApplepay" },
        { I: SiGooglepay, n: "SiGooglepay" },
        { I: FaCheckCircle, n: "FaCheckCircle" },
        { I: FaCheck, n: "FaCheck" },
      ],
    },
    {
      titulo: "Gestión y Edición (Dashboard)",
      icons: [
        { I: FaPlus, n: "FaPlus" },
        { I: FaEdit, n: "FaEdit" },
        { I: FaTrash, n: "FaTrash" },
        { I: FaCog, n: "FaCog" },
        { I: GrConfigure, n: "GrConfigure" },
        { I: FaEuroSign, n: "FaEuroSign" },
        { I: FaChartPie, n: "FaChartPie" },
        { I: FaConciergeBell, n: "FaConciergeBell" },
        { I: FaFont, n: "FaFont" },
        { I: FaHashtag, n: "FaHashtag" },
        { I: FaToggleOn, n: "FaToggleOn" },
      ],
    },
    {
      titulo: "Otros y Social",
      icons: [
        { I: FaInstagram, n: "FaInstagram" },
        { I: FaFacebook, n: "FaFacebook" },
        { I: FaTwitter, n: "FaTwitter" },
        { I: FaPhoneAlt, n: "FaPhoneAlt" },
        { I: FaPaperPlane, n: "FaPaperPlane" },
        { I: FaInfoCircle, n: "FaInfoCircle" },
      ],
    },
  ];
 return (
    <div className="min-h-screen bg-fondo p-8 md:p-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-5xl font-black text-secundario uppercase tracking-tighter">
            Iconos HA
          </h1>
          <p className="text-gris font-bold uppercase text-xs tracking-[0.3em] mt-4">
            Catálogo completo de iconos
          </p>
        </header>

        <div className="space-y-20">
          {categorias.map((cat, i) => (
            <section key={i}>
              <h2 className="text-sm font-black text-primario uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                <span className="h-px w-12 bg-primario/30"></span>
                {cat.titulo}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                {cat.icons.map((icon, idx) => (
                  <div key={idx} className="group flex flex-col items-center">
                    <div className="w-20 h-20 bg-gris-clarito rounded-[2rem] flex items-center justify-center group-hover:bg-primario/10 group-hover:scale-110 transition-all duration-300 border border-gris-borde-suave shadow-sm">
                      <icon.I className="text-primario" size={28} />
                    </div>
                    <span className="mt-4 text-[10px] font-black text-secundario uppercase tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity">
                      {icon.n}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}