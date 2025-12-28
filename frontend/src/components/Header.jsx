import NavEnlace from "./NavEnlace";
import NavButton from "./NavButton";
import { useEffect } from "react";
import NavPerfil from "./NavPerfil";

function Header({cambiarPagina, usuarioLoggeado, setUsuarioLoggeado, urlAPI}) {

  useEffect(() => {
    let existeUsuarioLoggeado = localStorage.getItem("username");
    setUsuarioLoggeado(existeUsuarioLoggeado);
  }, []);

  const guestHeader = () => {
    if (usuarioLoggeado == undefined) {
      return (
        <ul className="flex flex-row flex-wrap gap-5 items-center">
              <NavEnlace enlace={cambiarPagina} irA='inicio' textoAMostrar="Inicio"/>
              <NavEnlace enlace={cambiarPagina} irA='about' textoAMostrar="Sobre nosotros"/>
              <NavEnlace enlace={cambiarPagina} irA='contact' textoAMostrar="Contactanos"/>
              <NavButton enlace={cambiarPagina} irA='registro' textoAMostrar="Crear cuenta" color="primario"/>
              <NavButton enlace={cambiarPagina} irA='login' textoAMostrar="Iniciar Sesión" color="secundario"/>
            </ul>
      )      
    }else {
      return "";
    }
  };
  const userHeader = () => {
    if (usuarioLoggeado != undefined && usuarioLoggeado != "admin") {
      return (
        <ul className="flex flex-row flex-wrap gap-5 items-center">
          
              <NavEnlace enlace={cambiarPagina} irA='mis-reservas' textoAMostrar="Mis Reservas" icono="FaPlaneDeparture" />                     
              <NavPerfil enlace={cambiarPagina} username={usuarioLoggeado} setUsuarioLoggeado={setUsuarioLoggeado} />              
            </ul>
      )      
    }else {
      return "";
    }
  };
  const adminHeader = () => {    
    if (usuarioLoggeado == "admin") {
      return (
        <ul className="flex flex-row flex-wrap gap-5 items-center">
          <NavEnlace enlace={cambiarPagina} irA='gestionar-viajes' textoAMostrar="Gestionar viajes" icono="GrConfigure"/>
          <NavPerfil enlace={cambiarPagina} username={usuarioLoggeado} setUsuarioLoggeado={setUsuarioLoggeado} />              
        </ul>
      )      
    }else {
      return "";
    };
  }
  return (
    <header className="p-4 bg-primario text-white flex items-center justify-between">
      <img onClick={()=> cambiarPagina('inicio')} src={`${urlAPI}/public/media/img/logo_empresa_header.png`} alt="Logo de Horizonte Azul" className="h-20" />      
      <nav className="flex flex-row justify-center items-center">     
        {guestHeader()}
        {userHeader()}        
        {adminHeader()}
      </nav>
    </header>
  );
}

export default Header;
