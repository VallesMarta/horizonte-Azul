import GridDestinos from './GridDestinos'

function Inicio({urlAPI}) {
  return (
    <div className='flex flex-col justify-center items-center'>
      {/* Banner */}
      <div className="w-full h-30 md:h-96 my-2 overflow-hidden mb-6">
        <img           
          src={`${urlAPI}/public/media/img/banner.jpg`} 
          alt="Banner principal" 
          className="w-full h-full object-cover"
        />      
      </div>
      <h1 className='text-secundario m-6 text-center text-4xl font-bold'>Decide tu próximo destino...</h1>
      <GridDestinos urlAPI={urlAPI} ></GridDestinos>
    </div>
  )
}

export default Inicio
