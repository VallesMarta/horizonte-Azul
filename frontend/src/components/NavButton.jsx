                                                           
function NavButton({ enlace, irA, textoAMostrar, color }) {
  return (
    <button onClick={()=> enlace(irA)}
      type="button"
      className={`${color === "primario" ? "bg-texto" : "bg-secundario"} 
                    font-bold px-4 py-2 rounded 
                    hover:text-texto hover:bg-iconos
                    hover:scale-105 transform transition duration-300`}
    >
      {textoAMostrar}
    </button>
  );
}

export default NavButton;