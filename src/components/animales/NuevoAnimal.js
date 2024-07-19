import React, { Fragment, useState, useContext, useEffect } from 'react';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

function NuevoAnimal() {

    const [auth,] = useContext(CRMContext);
    const navigate = useNavigate();

    const [animal, guardarAnimal] = useState({
        Id_TipoAnimal: '',
        Id_Raza: '',
        estados: [],
        salud: [],
        intervenciones: [],
        ubicacion: {
            type: 'Point',
            coordinates: [] // Iniciar vacío, puede ser llenado por una selección en el mapa o ingreso manual.
        },
        Edad: '',
        Id_Sexo: ''
    });

    const [tiposAnimal, setTiposAnimal] = useState([]);
    const [razas, setRazas] = useState([]);
    const [sexos, setSexos] = useState([]);

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

    // Aquí leemos el state
    const actualizarState = e => {
        // Almacenar lo que escribe
        guardarAnimal({
            ...animal,
            [e.target.name]: e.target.value
        });
    }

    // Añadir animal
    const agregarAnimal = e => {
        e.preventDefault();

        // Envía petición
        clienteAxios.post('/animales', animal, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
        .then(res => {
            if (res.data.code === 11000) {
                Swal.fire({
                    icon: "error",
                    title: "Hubo un error",
                    text: 'Animal ya registrado'
                });
            } else {
                console.log(res.data);
                Swal.fire({
                    title: "Se agregó ese animal",
                    text: res.data.mensaje, // Asigna el mensaje de la respuesta a la propiedad 'text'
                    icon: "success"
                });
                // Usar navigate para redirigir
                navigate('/');
                console.log(animal);
            }
        });
    }

    // Validar el formulario
    const validarAnimal = () => {
        const { Id_TipoAnimal, Id_Raza, ubicacion, Edad, Id_Sexo } = animal;
        let valido = !Id_TipoAnimal.length || !Id_Raza.length || !ubicacion.coordinates.length || !Edad.length || !Id_Sexo.length;
        return valido;
    }

    // Verificar autenticación de usuario
    useEffect(() => {
        if (!auth.auth || localStorage.getItem('token') !== auth.token) {
            navigate('/iniciar-sesion');
        }
    }, [auth, navigate]);

    const actualizarUbicacion = e => {
        const { name, value } = e.target;
        guardarAnimal(prevState => ({
            ...prevState,
            ubicacion: {
                ...prevState.ubicacion,
                coordinates: name === 'latitud' ? [Number(value), prevState.ubicacion.coordinates[1]] : [prevState.ubicacion.coordinates[0], Number(value)]
            }
        }));
    }
    

    return (
        <Fragment>
            <h2>Nuevo Animal</h2>

            <form onSubmit={agregarAnimal}>

                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Tipo de Animal:</label>
                    <select
                        name="Id_TipoAnimal"
                        onChange={actualizarState}
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
                    />
                </div>

                <div className="campo">
                    <label>Sexo:</label>
                    <select
                        name="Id_Sexo"
                        onChange={actualizarState}
                    >
                        <option value="">-- Seleccione --</option>
                        {sexos.map(sexo => (
                            <option key={sexo._id} value={sexo._id}>{sexo.nombre}</option>
                        ))}
                    </select>
                </div>

                

                <div className="campo">
                    <label>Latitud:</label>
                    <input type="number"
                        placeholder="Latitud"
                        name="latitud"
                        onChange={actualizarUbicacion}
                    />
                </div>

                <div className="campo">
                    <label>Longitud:</label>
                    <input type="number"
                        placeholder="Longitud"
                        name="longitud"
                        onChange={actualizarUbicacion}
                    />
                </div>


                <div className="enviar">
                    <input type="submit"
                        className="btn btn-azul"
                        value="Agregar Animal"
                        disabled={validarAnimal()}
                    />
                </div>
            </form>
        </Fragment>
    );
}

export default NuevoAnimal;