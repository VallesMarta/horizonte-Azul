import { useState } from 'react';
import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Inicio from './components/Inicio';
import PageNotFound from './components/PageNotFound';
import Registro from './components/Registro';
import GridGetViajes from './components/GridGetViajes';
import MisReservas from './components/MisReservas';

function App() { 
const [paginaSelecionada, setPaginaSelecionada] = useState('inicio');
const [usuarioLoggeado, setUsuarioLoggeado] = useState(undefined);
const urlAPI = import.meta.env.VITE_URL_API;

console.log(urlAPI);




const pintarCuerpo = () => {  
  switch (paginaSelecionada) {
    case 'inicio':
      return <Inicio urlAPI={urlAPI}/>;      
    case 'login':
      return <Login cambiarPagina={setPaginaSelecionada} setUsuarioLoggeado={setUsuarioLoggeado} urlAPI={urlAPI}/>;
    case 'registro':
      return <Registro urlAPI={urlAPI}/>;
    case 'mis-reservas':
      return <MisReservas urlAPI={urlAPI}/>;
    case 'gestionar-viajes':
      return <GridGetViajes urlAPI={urlAPI}/>;

    default:
     return <PageNotFound cambiarPagina={setPaginaSelecionada}/>
  }


}

  return (
    <>
      <Header cambiarPagina={setPaginaSelecionada} usuarioLoggeado={usuarioLoggeado} setUsuarioLoggeado={setUsuarioLoggeado} urlAPI={urlAPI}/>
      <main>
        {pintarCuerpo()}
      </main>
      <Footer urlAPI={urlAPI}/>
    </>
  )
}

export default App
