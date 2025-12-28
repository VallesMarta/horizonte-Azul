import { useEffect, useState } from "react";
import { GrDocumentConfig } from "react-icons/gr";
import { FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";

function Servicios({setMostrarModalServicios, urlAPI}) {
    const [nombre, setNombre] = useState("");
    const [servicios, setServicios] = useState([]);

    useEffect(()=>{
        listarServicios();
    },[]);

    // Lo usamos para renderizar el contenido quando se elimine o cree uno nuevo
    const listarServicios = () => {
        const dameServicios = () => {
            const getServicios = async () => {
                let respuesta = await fetch(urlAPI + "/servicios");            
                if (respuesta.ok) {
                    let data = await respuesta.json();
                    setServicios(data.resultado);
                }
            }
            getServicios();
        }
        dameServicios()
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        // creamos el objeto servicio
        const newServicio = {
            nombre: nombre
        }        
        // Peticion de post a api
        const options = {
            method: 'POST',
            body: JSON.stringify(newServicio),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }
        const postServicio = async () => {
            let respuesta = await fetch(urlAPI + "/servicios", options);
            
            if (respuesta.ok) {
                setNombre("");
                alert("Servicio creado correctamente");
                listarServicios();
                
            }
        }
        postServicio();        
    }
    const handleDelete = (id) => {
        const options = {
            method: 'DELETE'
        }
        const deleteServicio = async () => {
            let respuesta = await fetch(urlAPI + `/servicios/${id}`, options);
            if (respuesta.ok) {
                // Renderizamos contenido
                listarServicios();
            }
        }
        deleteServicio();
    } 
    
    
    
  return (
    <>        
        {/* Crear Servicio */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4 w-full">
                <h2 className="text-fondo font-bold text-xl underline bg-secundario rounded-xl p-2 text-center">Gestión de servicios</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                    {/* Crear Servicio */} 
                    <div className="flex flex-col gap-1"> 
                        <label className="flex items-center gap-2 font-bold text-texto"> 
                        <GrDocumentConfig className="text-xl" /> Nombre del servicio </label> 
                        <div className="flex flex-row items-center" >
                            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="h-full w-[280px] bg-fondo rounded-l-xl p-2 transition-all duration-300 ease-in-out " placeholder="Ej: Comida incluida en el vuelo" /> 
                            <button  dir="rtl" type="submit"  className="flex items-center justify-center h-full w-[50px] bg-verde self-center p-2 rounded-r-xl text-fondo transition-all duration-300 ease-in-out hover:bg-green-600 hover:scale-105 cursor-pointer" >
                                <FaPlus className="text-lg" />
                            </button> 
                        </div>
                    </div> 
                </div>    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                    {/* Grid de Servicios */} 
                    {
                        servicios.map((servicioSel)=>{
                            return (        
                                <div key={servicioSel._id} className="flex flex-row items-center justify-between bg-iconos text-secundario rounded-xl p-2">
                                    <button key={servicioSel._id} type="button">{servicioSel.nombre}</button>
                                    <button onClick={()=> handleDelete(servicioSel._id) } className="items-end text-texto hover:text-rojo" type="button">
                                        <ImCross className="font-bold" />
                                    </button>
                                </div>                                
                            )
                        }) 
                    }                    
                </div> 
                {/* BOTONES */} 
                <div className="flex flex-row gap-4 justify-end items-center"> 
                    <button type="button" onClick={() => setMostrarModalServicios(false)} className="bg-rojo p-3 rounded-xl text-fondo font-bold" > Cerrar </button> 
                </div>
            </form>
        {/* Lista Servicios Disponibles */}

    </>
  )
}

export default Servicios;
