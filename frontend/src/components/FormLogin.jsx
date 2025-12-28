import { FaUser, FaKey } from "react-icons/fa";

function FormLogin({cambiarPagina, setUsuarioLoggeado, urlAPI}) {
  console.log(urlAPI);
  
  const comprobarCredenciales = async (e) => {
    e.preventDefault();
    let username = e.target.username.value.trim();
    let password = e.target.password.value.trim();

    let usuariosDisponibles = await getUsuarios();    
    const usuarioEncontrado = usuariosDisponibles.resultado.find( usuario => usuario.username === username && usuario.password === password );
    if (usuarioEncontrado) {
      console.log("Accediendo al perfil");

      // Guardamos en el localstorage el username
      localStorage.setItem("username", usuarioEncontrado.username);
      setUsuarioLoggeado(usuarioEncontrado.username);
      // Guardamos en el localstorage el id
      localStorage.setItem("username_id", usuarioEncontrado._id);
      setUsuarioLoggeado(usuarioEncontrado.username);
      // Guardamos en el localstorage el nombre
      localStorage.setItem("nombreCompleto", usuarioEncontrado.nombre);
      setUsuarioLoggeado(usuarioEncontrado.username);

      //Redirigimos al contenido de inicio
      cambiarPagina('inicio');
      
    }else {
      console.error("Usuario no encontrado");      
    }
  }
  const getUsuarios = async () => {
    let respuesta = await fetch(urlAPI + "/usuarios");
    if (respuesta.ok) {
      let data = await respuesta.json();
      return data;
    }else {
      return "";
    }
    
  }

  return (
   <form onSubmit={(e) => comprobarCredenciales(e)} className="flex flex-col gap-4 bg-secundario p-10 rounded-3xl">
        <div className="flex flex-row justify-center items-center">       
            <FaUser className="mr-2 text-otro text-3xl" />
            <input type="text" name="username" id="username" className="bg-fondo rounded-lg p-3 w-80 text-secundario" placeholder="username" autoFocus="true"/>       
        </div>
        <div className="flex flex-row justify-center items-center">
            <FaKey className="mr-2 text-otro text-3xl" />
            <input type="password" name="password" id="password" className="bg-fondo rounded-lg p-3 w-80 text-secundario" placeholder="password"/>
        </div>
        <button type="submit" 
                className="bg-otro text-secundario font-bold rounded-2xl p-2 cursor-pointer transition-all duration-300 ease-in-out hover:bg-iconos hover:text-textoPrincipal hover:scale-105"
          >Acceder</button>
    </form>
  )
}

export default FormLogin
