"use client";

import {
  FaUserCircle,
  FaSignOutAlt,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaPlane,
  FaInstagram,
  FaFacebook,
  FaShieldAlt,
  FaInfoCircle,
  FaBars,
  FaUsers,
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
  FaPlusCircle,
  FaConciergeBell,
  FaChartPie,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaSuitcase,
  FaPaperPlane,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaGlobe,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaTrashAlt,
  FaSearch,
  FaGlobeAmericas,
  FaHashtag,
  FaFont,
  FaCheck,
  FaToggleOn,
  FaBell,
  FaBellSlash,
  FaHeart,
  FaShoppingCart,
  FaCreditCard,
  FaCalendarAlt,
  FaEye,
  FaEyeSlash,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { GrConfigure, GrDocumentConfig } from "react-icons/gr";
import { HiArrowLongLeft } from "react-icons/hi2";
import { MdFlightTakeoff, MdFlightLand, MdViewCarousel } from "react-icons/md";
import { RiEditBoxFill } from "react-icons/ri";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
  SiPaypal,
  SiApplepay,
  SiGooglepay,
} from "react-icons/si";
import { ImCross, ImHeart } from "react-icons/im";
import { BsTwitterX } from "react-icons/bs";
import { SlHeart } from "react-icons/sl";

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
        { I: FaArrowRightLong, n: "FaArrowRightLong" },
        { I: HiArrowLongLeft, n: "HiArrowLongLeft" },
        { I: FaChevronDown, n: "FaChevronDown" },
        { I: FaChevronUp, n: "FaChevronUp" },
        { I: FaSearch, n: "FaSearch" },
        { I: FaSpinner, n: "FaSpinner" },
      ],
    },
    {
      titulo: "Vuelos y Destinos",
      icons: [
        { I: FaPlane, n: "FaPlane" },
        { I: FaPlaneDeparture, n: "FaPlaneDeparture" },
        { I: FaPlaneArrival, n: "FaPlaneArrival" },
        { I: MdFlightTakeoff, n: "MdFlightTakeoff" },
        { I: MdFlightLand, n: "MdFlightLand" },
        { I: FaGlobe, n: "FaGlobe" },
        { I: FaGlobeAmericas, n: "FaGlobeAmericas" },
        { I: FaMapMarkerAlt, n: "FaMapMarkerAlt" },
        { I: FaSuitcase, n: "FaSuitcase" },
        { I: FaClock, n: "FaClock" },
      ],
    },
    {
      titulo: "Usuario y Cuenta",
      icons: [
        { I: FaUser, n: "FaUser" },
        { I: FaUsers, n: "FaUsers" },
        { I: FaUserCircle, n: "FaUserCircle" },
        { I: FaIdBadge, n: "FaIdBadge" },
        { I: FaEnvelope, n: "FaEnvelope" },
        { I: FaKey, n: "FaKey" },
        { I: FaLock, n: "FaLock" },
        { I: FaShieldAlt, n: "FaShieldAlt" },
        { I: FaSignOutAlt, n: "FaSignOutAlt" },
        { I: FaEye, n: "FaEye" },
        { I: FaEyeSlash, n: "FaEyeSlash" },
      ],
    },
    {
      titulo: "Pagos y Reservas",
      icons: [
        { I: SiVisa, n: "SiVisa" },
        { I: SiMastercard, n: "SiMastercard" },
        { I: SiAmericanexpress, n: "SiAmericanexpress" },
        { I: SiPaypal, n: "SiPaypal" },
        { I: SiApplepay, n: "SiApplepay" },
        { I: SiGooglepay, n: "SiGooglepay" },
        { I: FaCreditCard, n: "FaCreditCard" },
        { I: FaEuroSign, n: "FaEuroSign" },
        { I: FaShoppingCart, n: "FaShoppingCart" },
        { I: FaCalendarAlt, n: "FaCalendarAlt" },
      ],
    },
    {
      titulo: "Gestión y Dashboard",
      icons: [
        { I: FaChartPie, n: "FaChartPie" },
        { I: FaPlus, n: "FaPlus" },
        { I: FaPlusCircle, n: "FaPlusCircle" },
        { I: FaEdit, n: "FaEdit" },
        { I: FaTrash, n: "FaTrash" },
        { I: FaTrashAlt, n: "FaTrashAlt" },
        { I: FaCog, n: "FaCog" },
        { I: GrConfigure, n: "GrConfigure" },
        { I: GrDocumentConfig, n: "GrDocumentConfig" },
        { I: RiEditBoxFill, n: "RiEditBoxFill" },
        { I: FaFont, n: "FaFont" },
        { I: FaHashtag, n: "FaHashtag" },
        { I: FaToggleOn, n: "FaToggleOn" },
        { I: FaCheckCircle, n: "FaCheckCircle" },
        { I: FaCheck, n: "FaCheck" },
      ],
    },
    {
      titulo: "Notificaciones y Social",
      icons: [
        { I: FaBell, n: "FaBell" },
        { I: FaBellSlash, n: "FaBellSlash" },
        { I: FaInstagram, n: "FaInstagram" },
        { I: FaFacebook, n: "FaFacebook" },
        { I: BsTwitterX, n: "BsTwitterX" },
        { I: FaPhoneAlt, n: "FaPhoneAlt" },
        { I: FaPaperPlane, n: "FaPaperPlane" },
        { I: FaInfoCircle, n: "FaInfoCircle" },
        { I: FaSun, n: "FaSun" },
        { I: FaMoon, n: "FaMoon" },
      ],
    },
    {
      titulo: "Favoritos y Estados",
      icons: [
        { I: FaHeart, n: "FaHeart" },
        { I: SlHeart, n: "SlHeart" },
        { I: ImHeart, n: "ImHeart" },
        { I: FaConciergeBell, n: "FaConciergeBell" },
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
            Catálogo de iconos usados en el proyecto
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
                    <div className="w-20 h-20 bg-card rounded-4xl flex items-center justify-center group-hover:bg-primario/10 group-hover:scale-110 transition-all duration-300 border border-gris-borde-suave shadow-sm">
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
