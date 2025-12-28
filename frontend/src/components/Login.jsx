import FormLogin from "./FormLogin";

function Login({cambiarPagina, setUsuarioLoggeado, urlAPI}) {
  return (
    <>
        <h1 className='text-secundario m-6 text-center text-4xl font-bold'>Login</h1>
        <div className="flex flex-row justify-center items-center gap-80 mx-60 p-4 rounded-3xl">
            <div>
                <img 
                    src={`${urlAPI}/public/media/img/imf-login.png`}
                    alt="" 
                    className="rounded-[13px] h-130" 
                />
            </div>
            <div className="flex flex-col justify-center items-center">
                <img 
                    src={`${urlAPI}/public/media/img/logo_form_login.jpg`} 
                    alt="" 
                    className="rounded-[13px] w-[50%]" 
                />
                <FormLogin urlAPI={urlAPI} cambiarPagina={cambiarPagina} setUsuarioLoggeado={setUsuarioLoggeado}/>
            </div>
        </div>
    </>
  )
}

export default Login;
