import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';

function AnadirEstados() {
    const { _id } = useParams(); //id del animal
    console.log("Id del animal: "+_id);
    const [auth,] = useContext(CRMContext);
    const navigate = useNavigate();

    const [estadosAnimal, setEstadosAnimal] = useState([]);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
    const [detalles, setDetalles] = useState([]);

    const [animal, setAnimal] = useState({
        Id_Animal: '',
        Id_TipoAnimal: '',
        Id_Raza: '',
        estados: [],
        salud: [],
        ubicacion: {
            type: 'Point',
            coordinates: [] // Iniciar vacío, puede ser llenado por una selección en el mapa o ingreso manual.
        },
        Edad: 0,
        Id_Sexo: '',
        FechaRegistro: '',
        FechaActualizacion: ''
    });

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [animalRes, estadosRes] = await Promise.all([
                    clienteAxios.get(`/animales/${_id}`, {
                        headers: { Authorization: `Bearer ${auth.token}` }
                    }),
                    clienteAxios.get('/estados-animal', {
                        headers: { Authorization: `Bearer ${auth.token}` }
                    })
                ]);

                if (animalRes.data && estadosRes.data) {
                    setAnimal(animalRes.data);
                    setEstadosAnimal(estadosRes.data);
                } else {
                    console.error('Error: Respuesta inesperada de la API');
                }
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        };
        cargarDatos();
    }, [_id, auth.token]);

    // Query a la API
    const consultarAPI = async () => {
        try {
            const animalConsulta = await clienteAxios.get(`/animales/${_id}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });

            if (animalConsulta.data) {
                // Colocar en el state
                setAnimal(animalConsulta.data);
            } else {
                console.error('Error: Respuesta inesperada de la API');
            }
        } catch (error) {
            console.error('Error al consultar la API:', error);
        }
    }

    // useEffect cuando cambia
    useEffect(() => {
        consultarAPI();
    }, []);

    const handleEstadoChange = e => {
        const estadoId = e.target.value;
        setEstadoSeleccionado(estadoId);

        const estado = estadosAnimal.find(est => est._id === estadoId);
        if (estado) {
            const nuevosDetalles = estado.detalles.map(detalle => ({
                clave: detalle.clave,
                valor: ''
            }));
            setDetalles(nuevosDetalles);
        } else {
            setDetalles([]);
        }
    }

    const handleDetalleChange = (index, e) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index].valor = e.target.value;
        setDetalles(nuevosDetalles);
    }

    // Manejador del envío del formulario
    const agregarEstadoAnimal = async e => {
        e.preventDefault();

        // Obtener la fecha actual del sistema
        const fechaActualizacion = new Date().toISOString();

        try {
            // Crear el nuevo estado con sus detalles específicos
            const nuevoEstado = {
                estado: estadoSeleccionado, // Este es el ID del estado
                detalles: detalles // Este es el arreglo de detalles específicos
            };

            // Actualizar el estado del animal y también la fecha de actualización
            const animalActualizado = {
                ...animal,
                estados: [...animal.estados, nuevoEstado],
                FechaActualizacion: fechaActualizacion
            };

            // Enviar la solicitud para actualizar el animal con el estado actualizado
            const response = await clienteAxios.put(`/animales/${animal._id}`, animalActualizado, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });

            if (response.data) {
                // Manejar la respuesta
                Swal.fire('Actualizado', response.data.mensaje, 'success');
                navigate('/');
            } else {
                console.error('Error: Respuesta inesperada de la API');
                Swal.fire('Error', 'No se pudo actualizar el animal', 'error');
            }
        } catch (error) {
            console.error('Error al actualizar el animal:', error);
            Swal.fire('Error', 'No se pudo actualizar el animal', 'error');
        }
    };

    return (
        <form onSubmit={agregarEstadoAnimal}>
            <legend>Agregar Estado al Animal</legend>

            <div className="campo">
                <label>Estado:</label>
                <select onChange={handleEstadoChange} value={estadoSeleccionado}>
                    <option value="">-- Seleccione --</option>
                    {estadosAnimal.map(estado => (
                        <option key={estado._id} value={estado._id}>{estado.nombre}</option>
                    ))}
                </select>
            </div>

            {detalles.map((detalle, index) => (
                <div className="campo" key={index}>
                    <label>{detalle.clave}:</label>
                    <input
                        type="text"
                        value={detalle.valor}
                        onChange={e => handleDetalleChange(index, e)}
                    />
                </div>
            ))}

            <div className="enviar">
                <input type="submit" className="btn btn-azul" value="Agregar Estado" />
            </div>
        </form>
    );
}

export default AnadirEstados;
