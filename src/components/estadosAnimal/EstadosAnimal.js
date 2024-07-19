import React, { useEffect, useState, Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import EstadoAnimal from './EstadoAnimal';
import { Link } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

function EstadosAnimal() {
    const [estadosAnimal, setEstadosAnimal] = useState([]);
    const [auth,] = useContext(CRMContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.token !== '') {
            const consultarAPI = async () => {
                try {
                    const response = await clienteAxios.get('/estados-animal', {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });
                    setEstadosAnimal(response.data);
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        navigate('/iniciar-sesion');
                    }
                }
            };
            consultarAPI();
        } else {
            navigate('/iniciar-sesion');
        }
    }, [auth.token, navigate]);

    return (
        <Fragment>
            <h2>Estados Animal</h2>
            <Link to="/estados-animal/nuevo" className="btn btn-verde nvo-estadoAnimal">
                <i className="fas fa-plus-circle"></i>
                Nuevo Estado
            </Link>
            <ul className="listado-estadosAnimal">
                {estadosAnimal.map(estado => (
                    <EstadoAnimal
                        key={estado._id}
                        estado={estado}
                    />
                ))}
            </ul>
        </Fragment>
    );
}

export default EstadosAnimal;
