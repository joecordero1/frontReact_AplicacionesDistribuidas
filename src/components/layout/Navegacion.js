import React, {useContext} from 'react';
import {Link} from 'react-router-dom'
import { CRMContext } from '../../context/CRMContext';

const Navegacion = () => {
    const [auth, guardarAuth] = useContext(CRMContext);
    if(!auth.auth) return null;
    return (
        <aside className="sidebar col-3">
            <h2>Administrar</h2>
            <nav className="navegacion">
                {<Link to={"/"} className="animales">Animales</Link>}
                {<Link to={"/intervenciones"} className="intervenciones">Intervenciones</Link>}
                {/* <Link to={"/estados-animal"} className="estados-animal">Estados Animal</Link> */}
                {/* <Link to={"/analisis"} className="analisis">Analisis general anual</Link> */}
                {/* <Link to={"/segmentacion"} className="segmentacion">Segmentacion por criterio</Link> */}
                {/* <Link to={"/segmentacionTemporal"} className="segmentacionTemporal">Segmentacion temporal</Link> */}
                {/* <Link to={"/dashboard"} className="dashboard">Dashboard mensual</Link> */}
                {<Link to={"/rabbit"} className="rabbit">Analisis general anual</Link>}
            </nav>
        </aside>
    );
}

export default Navegacion;
