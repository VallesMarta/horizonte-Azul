function Footer({urlAPI}) {
  return (
<footer className="bg-secundario p-7 text-fondo grid grid-cols-5 gap-5 relative bottom-0 w-full">
  {/* Columna 1: Logo + descripción */}
  <div className="col-span-2 flex gap-3 text-justify">
    <img
      src={`${urlAPI}/public/media/img/logo_empresa_header.png`}
      alt="Logo de Horizonte Azul"
      className="h-20"
    />
    <p className="text-sm leading-relaxed">
      Aplicación web intuitiva para gestionar vuelos y pasajeros. Consulta viajes disponibles, realiza reservas seguras y administra toda la información de manera eficiente.
    </p>
  </div>

  {/* Columna 2: Servicios */}
  <div className="flex flex-col gap-2 border-l border-fondo/30 pl-5">
    <h2 className="font-bold underline underline-offset-3 text-xl">Servicios</h2>
    <a href="#" className="hover:text-primario transition-colors duration-200">Reservas de vuelos</a>
    <a href="#" className="hover:text-primario transition-colors duration-200">Gestión de reservas</a>
    <a href="#" className="hover:text-primario transition-colors duration-200">Consultas de vuelos</a>
  </div>

  {/* Columna 3: Legal */}
  <div className="flex flex-col gap-2 border-l border-fondo/30 pl-5">
    <h2 className="font-bold underline underline-offset-3 text-xl">Legal</h2>
    <a href="#" className="hover:text-primario transition-colors duration-200">Política de privacidad</a>
    <a href="#" className="hover:text-primario transition-colors duration-200">Términos y condiciones</a>
    <a href="#" className="hover:text-primario transition-colors duration-200">Aviso legal</a>
  </div>

  {/* Columna 4: Redes sociales */}
  <div className="flex flex-col gap-2 border-l border-fondo/30 pl-5">
    <h2 className="font-bold underline underline-offset-3 text-xl">Redes sociales</h2>
    <a href="#" className="hover:text-primario transition-colors duration-200">Facebook</a>
    <a href="#" className="hover:text-primario transition-colors duration-200">Instagram</a>
    <a href="#" className="hover:text-primario transition-colors duration-200">X</a>
  </div>

  {/* Fila inferior: Separador horizontal */}
  <hr className="border-fondo/50 col-span-5 my-4" />

  {/* Fila inferior: Copyright */}
  <div className="col-span-5 text-center text-sm">
    <p>© {new Date().getFullYear()} Horizonte Azul. Todos los derechos reservados.</p>
  </div>
</footer>

  )
}

export default Footer;
