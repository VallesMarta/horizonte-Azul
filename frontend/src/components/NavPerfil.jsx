import { FaUserCircle } from "react-icons/fa";

function NavPerfil ({enlace, username, setUsuarioLoggeado}) {
    const eliminarSesion = () => {
        localStorage.removeItem("username");        
        localStorage.removeItem("username_id");  
        localStorage.removeItem("nombreCompleto");  
        setUsuarioLoggeado(undefined);
        enlace('inicio');
    }
  return (
    <div className="flex flex-row items-center gap-3 bg-secundario/20 p-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
      <FaUserCircle className="text-4xl" />
      <span>{username}</span>
      <button onClick={() => eliminarSesion()} className="cursor-pointer bg-[#D13264] rounded-xl p-2">Cerrar Sesion</button>
    </div>
  )
}

export default NavPerfil;
