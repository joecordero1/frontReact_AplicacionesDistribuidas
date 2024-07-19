import React, {useEffect, useState, Fragment, useContext} from 'react';
import {useNavigate} from 'react-router-dom'

//importamos axios
import clienteAxios from '../../config/axios'

import Cliente from './Cliente';

import { Link } from 'react-router-dom';

//importo el context
import { CRMContext } from '../../context/CRMContext';


function Clientes() {
    //aplicar State
    const [clientes, guardarClientes] = useState([]);
    //Utilizo el context
    const[ auth, guardarAuth] = useContext(CRMContext);
    console.log(auth);

    const navigate = useNavigate();

    //Query api
    
    useEffect( () => {
        
        if(auth.token !== ''){
            const consultarAPI = async () => {
                try{
                    const clientesConsulta = await clienteAxios.get('/clientes', {
                        headers: {
                            Authorization : `Bearer ${auth.token}`
                        }
                    });

                    guardarClientes(clientesConsulta.data);

                }catch (error){
                    if(error.response.status === 500){
                        navigate('/iniciar-sesion'); 
                    }
                }
            }
            consultarAPI();
        
        }else{
            navigate('/iniciar-sesion'); 
        }

    }, [clientes]);
    return(
        <Fragment>
            <h2>Clientes</h2>
            
            <Link to="/clientes/nuevo" className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Cliente
            </Link>

            <ul className="listado-clientes">
                {clientes.map(cliente => (
                    <Cliente 
                        key = {cliente._id}
                        cliente = {cliente}
                    />
                ))}
            </ul>

        </Fragment>
            
    )
}

export default Clientes;