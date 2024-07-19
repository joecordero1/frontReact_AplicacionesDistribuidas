import React, { Fragment, useEffect, useState, useContext } from 'react';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

function EditarIntervencion() {
    const { _id } = useParams();
    const [auth,] = useContext(CRMContext);
    const navigate = useNavigate();

    const [animales, setAnimales] = useState([]);
    const [intervencion, datosIntervencion] = useState({
        Id_Animal: '',
        nombre: '',
        resultadoAntes: '',
        resultadoDespues: '',
        comentarios: '',
        fecha: '',
        seguimiento: []
    });

    // Cargar datos iniciales de animales
    useEffect(() => {
        const cargarAnimales = async () => {
            try {
                const respuesta = await clienteAxios.get('/animales', {
                    headers: { Authorization: `Bearer ${auth.token}` }
                });
                setAnimales(respuesta.data);
            } catch (error) {
                console.log(error);
            }
        };
        cargarAnimales();
    }, [auth.token]);

    // Query a la API
    const consultarAPI = async () => {
        const intervencionConsulta = await clienteAxios.get(`/intervenciones/${_id}`, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        });
        datosIntervencion(intervencionConsulta.data);
    }

    // useEffect cuando cambia
    useEffect(() => {
        consultarAPI();
    }, []);

    const actualizarState = e => {
        datosIntervencion({
            ...intervencion,
            [e.target.name]: e.target.value
        });
    }

    const validarIntervencion = () => {
        const { Id_Animal, nombre, resultadoAntes, resultadoDespues } = intervencion;
        return !Id_Animal || !nombre || !resultadoAntes || !resultadoDespues;
    }

    const actualizarIntervencion = async e => {
        e.preventDefault();

        try {
            const response = await clienteAxios.put(`/intervenciones/${intervencion._id}`, intervencion, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });

            Swal.fire('Actualizado', response.data.mensaje, 'success');
            navigate('/intervenciones');
        } catch (error) {
            console.log(error);
            Swal.fire('Error', 'No se pudo actualizar la intervención', 'error');
        }
    };

    // Verificar autenticación de usuario
    useEffect(() => {
        if (!auth.auth || localStorage.getItem('token') !== auth.token) {
            navigate('/iniciar-sesion');
        }
    }, [auth, navigate]);

    return (
        <Fragment>
            <h2>Editar Intervención</h2>

            <form onSubmit={actualizarIntervencion}>

                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Animal:</label>
                    <select
                        name="Id_Animal"
                        onChange={actualizarState}
                        value={intervencion.Id_Animal}
                    >
                        <option value="">-- Seleccione --</option>
                        {animales.map(animal => (
                            <option key={animal._id} value={animal._id}>{animal._id}</option>
                        ))}
                    </select>
                </div>

                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text"
                        placeholder="Nombre de la intervención"
                        name="nombre"
                        onChange={actualizarState}
                        value={intervencion.nombre}
                    />
                </div>

                <div className="campo">
                    <label>Resultado Antes:</label>
                    <input type="number"
                        placeholder="Resultado antes de la intervención"
                        name="resultadoAntes"
                        onChange={actualizarState}
                        value={intervencion.resultadoAntes}
                    />
                </div>

                <div className="campo">
                    <label>Resultado Después:</label>
                    <input type="number"
                        placeholder="Resultado después de la intervención"
                        name="resultadoDespues"
                        onChange={actualizarState}
                        value={intervencion.resultadoDespues}
                    />
                </div>

                <div className="campo">
                    <label>Fecha:</label>
                    <input type="date"
                        name="fecha"
                        onChange={actualizarState}
                        value={intervencion.fecha ? intervencion.fecha.split('T')[0] : ''}
                    />
                </div>

                <div className="campo">
                    <label>Comentarios:</label>
                    <textarea
                        placeholder="Comentarios"
                        name="comentarios"
                        onChange={actualizarState}
                        value={intervencion.comentarios}
                    ></textarea>
                </div>

                <div className="enviar">
                    <input type="submit"
                        className="btn btn-azul"
                        value="Actualizar Intervención"
                        disabled={validarIntervencion()}
                    />
                </div>
            </form>
        </Fragment>
    );
}

export default EditarIntervencion;
