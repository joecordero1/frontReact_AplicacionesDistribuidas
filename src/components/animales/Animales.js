import React, { useEffect, useState, Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Importamos axios
import clienteAxios from '../../config/axios';

import Animal from './Animal';

import { Link } from 'react-router-dom';

// Importo el contexto
import { CRMContext } from '../../context/CRMContext';

function Animales() {
    // Aplicar State
    const [animales, setAnimales] = useState([]);
    // Utilizo el context
    const [auth,] = useContext(CRMContext);
    const navigate = useNavigate();

    // Query a la API
    useEffect(() => {
        if (auth.token !== '') {
            const consultarAPI = async () => {
                try {
                    const response = await clienteAxios.get('/animales', {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });

                    setAnimales(response.data);
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

    const eliminarAnimal = id => {
        Swal.fire({
            title: "Confirmación",
            text: "No es posible revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Eliminar"
        }).then((result) => {
            if (result.value) {
                clienteAxios.delete(`/animales/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                })
                .then(res => {
                    Swal.fire({
                        title: "Eliminado",
                        text: res.data.mensaje,
                        icon: "success"
                    });
                    // Actualizar la lista de animales después de eliminar
                    setAnimales(prevAnimales => prevAnimales.filter(animal => animal._id !== id));
                })
                .catch(error => {
                    Swal.fire('Error', 'No se pudo eliminar el animal', 'error');
                });
            }
        });
    };

    return (
        <Fragment>
            <h2>Animales</h2>

            <Link to="/animales/nuevo" className="btn btn-verde nvo-animal">
                <i className="fas fa-plus-circle"></i>
                Nuevo Animal
            </Link>

            <ul className="listado-animales">
                {animales.map(animal => (
                    <Animal
                        key={animal._id}
                        animal={animal}
                        eliminarAnimal={eliminarAnimal}
                    />
                ))}
            </ul>
        </Fragment>
    );
}

export default Animales;
