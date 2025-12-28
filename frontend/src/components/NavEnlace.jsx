import { FaPlaneDeparture } from "react-icons/fa";
import { GrConfigure } from "react-icons/gr";

function NavEnlace({enlace, irA, textoAMostrar, icono = ""}) {
  const iconoAMostrar = () => {
    switch (icono) {
      case "FaPlaneDeparture":
        return <FaPlaneDeparture />;
      case "GrConfigure":
      return <GrConfigure />;
      default:
        break;
    }
  }
  return (
    <li className="flex flex-row items-center gap-2 cursor-pointer hover:text-iconos hover:scale-110 transform transition duration-300">
       {iconoAMostrar()}
        <a onClick={()=> enlace(irA)}
            className="font-bold text-lg"
        >{textoAMostrar}</a>
    </li>
  )
}

export default NavEnlace
