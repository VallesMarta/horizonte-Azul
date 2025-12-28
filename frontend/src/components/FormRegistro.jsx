import { FaUser, FaKey, FaEnvelope, FaIdBadge } from "react-icons/fa";

function FormRegistro({urlAPI}) {
  const guardarUsuario = (e) => {
    e.preventDefault();
    console.log("registrando...");
    let username = e.target.username.value.trim();
    let password = e.target.password.value.trim();
    let nombre = e.target.nombre.value.trim();
    let email = e.target.email.value.trim();

    const usuarioNuevo = {
      username: username,
      password: password,
      nombre: nombre,
      email: email
    };

    if (postUsuarioNuevo(usuarioNuevo)) {
      e.target.username.value = "";
      e.target.password.value = "";
      e.target.nombre.value = "";
      e.target.email.value = "";
    } else {
      console.error("ERROR: No se ha podido insertar el nuevo usuario");
      
    }
    
    async function postUsuarioNuevo(usuarioNuevo) {

      const options = {
        method: 'POST',
        body: JSON.stringify(usuarioNuevo),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
      };

      return await fetch(urlAPI + '/usuarios', options);
    }

  }
  return (
    <form onSubmit={(e) => guardarUsuario(e)} className="flex flex-col gap-4 bg-secundario p-10 rounded-3xl w-[350px] mx-auto">
      
      {/* Username */}
      <div className="flex flex-row justify-center items-center">
        <FaUser className="mr-2 text-otro text-3xl" />
        <input
          type="text"
          name="username"
          id="username"
          className="bg-fondo rounded-lg p-3 w-full text-secundario focus:outline-none focus:ring-2 focus:ring-otro"
          placeholder="Username"
          required
          autoFocus
        />
      </div>

      {/* Password */}
      <div className="flex flex-row justify-center items-center">
        <FaKey className="mr-2 text-otro text-3xl" />
        <input
            type="password"
            name="password"
            id="password"
            className="bg-fondo rounded-lg p-3 w-full text-secundario focus:outline-none focus:ring-2 focus:ring-otro"
            placeholder="Contraseña"
            required
        />
        </div>

      {/* Nombre */}
      <div className="flex flex-row justify-center items-center">
        <FaIdBadge className="mr-2 text-otro text-3xl" />
        <input
          type="text"
          name="nombre"
          id="nombre"
          className="bg-fondo rounded-lg p-3 w-full text-secundario focus:outline-none focus:ring-2 focus:ring-otro"
          placeholder="Nombre completo"
        />
      </div>

      {/* Email */}
      <div className="flex flex-row justify-center items-center">
        <FaEnvelope className="mr-2 text-otro text-3xl" />
        <input
          type="email"
          name="email"
          id="email"
          className="bg-fondo rounded-lg p-3 w-full text-secundario focus:outline-none focus:ring-2 focus:ring-otro"
          placeholder="Correo electrónico"
          required
        />
      </div>

      {/* Botón de registro */}
      <button
        type="submit"
        className="bg-otro text-secundario font-bold rounded-2xl p-3 cursor-pointer transition-all duration-300 ease-in-out hover:bg-iconos hover:text-textoPrincipal hover:scale-105"
      >
        Registrarse
      </button>
    </form>
  );
}

export default FormRegistro;
