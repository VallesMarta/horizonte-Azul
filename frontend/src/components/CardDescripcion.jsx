import { useState } from "react";

const CardDescripcion = ({ descripcion }) => {
  const [mostrarMas, setMostrarMas] = useState(false);

  return (
    <>
      <p className={`text-sm text-texto text-justify mb-3 leading-relaxed ${!mostrarMas ? 'line-clamp-3' : ''}`}>
        {descripcion}
      </p>
      <span type="button" className="text-texto font-semibold text-xs" onClick={() => setMostrarMas(!mostrarMas)}>
        {mostrarMas ? "Mostrar menos" : "Mostrar más"}
      </span>
    </>
  );
};

export default CardDescripcion;