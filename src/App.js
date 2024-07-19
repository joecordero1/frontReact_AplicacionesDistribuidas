import React, {Fragment, useContext, useState} from 'react';

//Routing
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

/*** Layout */
import Header from './components/layout/Header'
import Navegacion from './components/layout/Navegacion'

/** Componentes 
import Clientes from './components/clientes/Clientes';
import NuevoCliente from './components/clientes/NuevoCliente';
import EditarCliente from './components/clientes/EditarCliente';
*/
import Animales from './components/animales/Animales';
import NuevoAnimal from './components/animales/NuevoAnimal';
import EditarAnimal from './components/animales/EditarAnimal';
import Intervenciones from './components/intervenciones/Intervenciones';
import NuevaIntervencion from './components/intervenciones/NuevaIntervencion';
import EditarIntervencion from './components/intervenciones/EditarIntervencion';
import EstadosAnimal from './components/estadosAnimal/EstadosAnimal';
import NuevoEstadoAnimal from './components/estadosAnimal/NuevoEstadoAnimal';
import EditarEstadoAnimal from './components/estadosAnimal/EditarEstadoAnimal';
import Login from './components/auth/Login';
import { CRMContext, CRMProvider } from './context/CRMContext';
import AnadirEstados  from './components/animales/AnadirEstados';
import AnadirIntervenciones from './components/animales/AnadirIntervencion';
import Usuarios from './components/usuarios/Usuarios';
import Analisis from './components/analisis/Analisis';
import Segmentacion from './components/analisis/Segmentacion';
import SegmentacionTemporal from './components/analisis/SegmentacionTemporal';
import Dashboard from './components/analisis/Dashboard';
import Rabbit from './components/rabbit/VistaRabbit';

function App () {

  //UTILIZAR EL CONTEXT
  const [auth, guardarAuth] = useContext(CRMContext);


  return (
    <Router>
      <Fragment>
        <CRMProvider value={[auth, guardarAuth]}>
        <Header/>

        <div className="grid contenedor contenido-principal">
          <Navegacion/>
          <main className="caja-contenido col-9">
            <Routes>
              <Route path="/" element={<Animales/>}/>
              <Route path="/animales/nuevo" element={<NuevoAnimal/>}/>
              <Route path="/animales/editar/:_id" element={<EditarAnimal/>}/>
              <Route path="/intervenciones" element={<Intervenciones/>}/>
              <Route path="/intervenciones/nueva" element={<NuevaIntervencion/>}/>
              <Route path="/intervenciones/editar/:_id" element={<EditarIntervencion/>}/>
              <Route path="/estados-animal" element={<EstadosAnimal/>}/>
              <Route path="/estados-animal/nuevo" element={<NuevoEstadoAnimal/>}/>
              <Route path="/estados-animal/editar/:_id" element={<EditarEstadoAnimal/>}/>
              <Route path="/iniciar-sesion" element={<Login/>}/>

              <Route path="/animales/anadir-estado/:_id" element={<AnadirEstados/>}/>
              <Route path="/animales/anadir-intervencion/:_id" element={<AnadirIntervenciones/>}/>

              <Route path="/usuarios" element={<Usuarios/>}/>
              <Route path="/analisis" element={<Analisis />}/> 
              <Route path="/segmentacion" element={<Segmentacion />}/>
              <Route path="/segmentacionTemporal" element={<SegmentacionTemporal />}/>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/rabbit" element={<Rabbit/>}/>
            </Routes>


          </main>
        </div>
          
        </CRMProvider>
      </Fragment>
    </Router>

    
  )

}


export default App;
