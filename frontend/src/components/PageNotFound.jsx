function PageNotFound({cambiarPagina}) {
  return (
    <div className="m-6 flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-6xl font-extrabold text-secundario drop-shadow-lg">
        404
      </h1>

      <p className="text-2xl text-texto mt-4 font-semibold">
        Página no encontrada
      </p>

      <p className="text-texto mt-2 max-w-md">
        La página que buscas no existe o se ha movido.  
        Por favor, vuelve al inicio o navega desde el menú superior.
      </p>

      <button 
        onClick={() => {cambiarPagina('inicio')}}
        className="mt-6 bg-secundario text-fondo font-bold py-2 px-6 rounded-xl
                   transition-all duration-300 hover:bg-secundario/80 hover:scale-105"
      >
        Volver al inicio
      </button>
    </div>
  );
}

export default PageNotFound;
