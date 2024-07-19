import React, { useContext } from 'react';
import { CRMContext } from '../../context/CRMContext';
import {useNavigate} from 'react-router-dom';


const Header = () => {

    const navigate = useNavigate();
    const [auth, guardarAuth] = useContext(CRMContext);

    const cerrarSesion = () =>{
        //auth.auth = false, entonces el token se va
        guardarAuth({
            token: '',
            auth: false
        });

        localStorage.setItem('token', '');
        navigate('/iniciar-sesion')

    }

    console.log(auth);
    return(
        <header className="barra">
        <div className="contenedor">
            <div className="contenido-barra">
                <h1>JC - Fauna Urbana</h1>
                { auth.auth ? (
                    <button
                    type="button"
                    className = "btn btn-rojo"
                    onClick={cerrarSesion}
                    >
                        <i className="far fa-times-circle"></i>
                        Cerrar sesion
                    </button>
                ) : null }
                
            </div>
        </div>
        </header>
    )

}

export default Header;