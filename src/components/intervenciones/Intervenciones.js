import React, { useEffect, useState, Fragment, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Importamos axios
import clienteAxios from '../../config/axios';

import Intervencion from './Intervencion';

import { Link } from 'react-router-dom';

// Importo el contexto
import { CRMContext } from '../../context/CRMContext';

function Intervenciones() {
    // Aplicar State
    const [intervenciones, setIntervenciones] = useState([]);
    // Utilizo el context
    const [auth,] = useContext(CRMContext);
    const navigate = useNavigate();

    // Query a la API
    useEffect(() => {
        if (auth.token !== '') {
            const consultarAPI = async () => {
                try {
                    const response = await clienteAxios.get('/intervenciones', {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });

                    setIntervenciones(response.data);
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

    const eliminarIntervencion = id => {
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
                clienteAxios.delete(`/intervenciones/${id}`, {
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
                    // Actualizar la lista de intervenciones después de eliminar
                    setIntervenciones(prevIntervenciones => prevIntervenciones.filter(intervencion => intervencion._id !== id));
                })
                .catch(error => {
                    Swal.fire('Error', 'No se pudo eliminar la intervención', 'error');
                });
            }
        });
    };

    return (
        <Fragment>
            <h2>Intervenciones</h2>

            <Link to="/intervenciones/nueva" className="btn btn-verde nva-intervencion">
                <i className="fas fa-plus-circle"></i>
                Nueva Intervención
            </Link>

            <ul className="listado-intervenciones">
                {intervenciones.map(intervencion => (
                    <Intervencion
                        key={intervencion._id}
                        intervencion={intervencion}
                        eliminarIntervencion={eliminarIntervencion}
                    />
                ))}
            </ul>
        </Fragment>
    );
}

export default Intervenciones;
