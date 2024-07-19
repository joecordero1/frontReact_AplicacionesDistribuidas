import React, { Fragment, useEffect, useState, useContext } from 'react';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';


function EditarAnimal() {
    const { _id } = useParams();
    const [auth,] = useContext(CRMContext);
    const navigate = useNavigate();

    const [tiposAnimal, setTiposAnimal] = useState([]);
    const [razas, setRazas] = useState([]);
    const [sexos, setSexos] = useState([]);

    const [animal, datosAnimal] = useState({
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

    // Cargar datos iniciales de tipos de animales y razas
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [respuestaTipos, respuestaRazas, respuestaSexos] = await Promise.all([
                    clienteAxios.get('/tipos-animal', {
                        headers: { Authorization: `Bearer ${auth.token}` }
                    }),
                    clienteAxios.get('/razas', {
                        headers: { Authorization: `Bearer ${auth.token}` }
                    }),
                    clienteAxios.get('/sexos', {
                        headers: { Authorization: `Bearer ${auth.token}` }
                    })
                ]);
                setTiposAnimal(respuestaTipos.data);
                setRazas(respuestaRazas.data);
                setSexos(respuestaSexos.data);
            } catch (error) {
                console.log(error);
            }
        };
        cargarDatos();
    }, [auth.token]);

    // Query a la API
    const consultarAPI = async () => {
        const animalConsulta = await clienteAxios.get(`/animales/${_id}`, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        });
        // Colocar en el state
        datosAnimal(animalConsulta.data);
    }

    // useEffect cuando cambia
    useEffect(() => {
        consultarAPI();
    }, []);

    // Aquí leemos el state
    const actualizarState = e => {
        // Almacenar lo que escribe
        datosAnimal({
            ...animal,
            [e.target.name]: e.target.value
        });
    }

    // Validar el formulario
    const validarAnimal = () => {
        const { Id_TipoAnimal, Id_Raza, ubicacion, Edad, Id_Sexo } = animal;
        let valido = !Id_TipoAnimal.length || !Id_Raza.length || !ubicacion.coordinates.length || !Edad.length || !Id_Sexo.length;
        return valido;
    }

    // Manejador del envío del formulario
    const actualizarAnimal = async e => {
        e.preventDefault();

        // Obtener la fecha actual del sistema
        const fechaActualizacion = new Date().toISOString();

        try {
            // Actualizar el estado del animal con la fecha de actualización
            const animalActualizado = {
                ...animal,
                FechaActualizacion: fechaActualizacion
            };

            // Enviar la solicitud para actualizar el animal con el estado actualizado
            const response = await clienteAxios.put(`/animales/${animal._id}`, animalActualizado, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });

            // Manejar la respuesta
            Swal.fire('Actualizado', response.data.mensaje, 'success');
            navigate('/');
        } catch (error) {
            console.log(error);
            Swal.fire('Error', 'No se pudo actualizar el animal', 'error');
        }
    };




    // Verificar autenticación de usuario
    useEffect(() => {
        if (!auth.auth || localStorage.getItem('token') !== auth.token) {
            navigate('/iniciar-sesion');
        }
    }, [auth, navigate]);

    const actualizarUbicacion = e => {
        const { name, value } = e.target;
        datosAnimal(prevState => ({
            ...prevState,
            ubicacion: {
                ...prevState.ubicacion,
                coordinates: name === 'longitud' ? [Number(value), prevState.ubicacion.coordinates[1]] : [prevState.ubicacion.coordinates[0], Number(value)]
            }
        }));
    }

    return (
        <Fragment>
            <h2>Editar Animal</h2>

            <form onSubmit={actualizarAnimal}>

                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Tipo de Animal:</label>
                    <select
                        name="Id_TipoAnimal"
                        onChange={actualizarState}
                        value={animal.Id_TipoAnimal}
                    >
                        <option value="">-- Seleccione --</option>
                        {tiposAnimal.map(tipo => (
                            <option key={tipo._id} value={tipo._id}>{tipo.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="campo">
                    <label>Raza:</label>
                    <select
                        name="Id_Raza"
                        onChange={actualizarState}
                        value={animal.Id_Raza}
                    >
                        <option value="">-- Seleccione --</option>
                        {razas.map(raza => (
                            <option key={raza._id} value={raza._id}>{raza.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="campo">
                    <label>Edad:</label>
                    <input type="number"
                        placeholder="Edad"
                        name="Edad"
                        onChange={actualizarState}
                        value={animal.Edad}
                    />
                </div>

                <div className="campo">
                    <label>Sexo:</label>
                    <select
                        name="Id_Sexo"
                        onChange={actualizarState}
                        value={animal.Id_Sexo}
                    >
                        <option value="">-- Seleccione --</option>
                        {sexos.map(sexo => (
                            <option key={sexo._id} value={sexo._id}>{sexo.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="campo">
                    <label>Longitud:</label>
                    <input type="number"
                        placeholder="Longitud"
                        name="longitud"
                        onChange={actualizarUbicacion}
                        value={animal.ubicacion.coordinates[0]}
                    />
                </div>  

                <div className="campo">
                    <label>Latitud:</label>
                    <input type="number"
                        placeholder="Latitud"
                        name="latitud"
                        onChange={actualizarUbicacion}
                        value={animal.ubicacion.coordinates[1]}
                    />
                </div>

                      

                <div className="enviar">
                    <input type="submit"
                        className="btn btn-azul"
                        value="Actualizar Animal"
                        disabled={validarAnimal()}
                    />
                </div>
            </form>
        </Fragment>
    );
}

export default EditarAnimal;
