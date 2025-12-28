import FormRegistro from "./FormRegistro";

function Registro({urlAPI}) {
  return (
    <>
        <h1 className='text-secundario m-6 text-center text-4xl font-bold'>Registro</h1>
        <div className="flex flex-row justify-center items-center gap-40 mx-60 p-4 rounded-3xl">
            <div>
                <img 
                    src={`${urlAPI}/public/media/img/logo_form_login.jpg`} 
                    alt="" 
                    className="rounded-[13px]" 
                />
            </div>
            <div className="flex flex-col justify-center items-center">                     
                <FormRegistro urlAPI={urlAPI}/>
            </div>
        </div>
    </>
  )
}

export default Registro;
