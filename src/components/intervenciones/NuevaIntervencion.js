import React, { Fragment, useState, useContext, useEffect } from 'react';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

function NuevaIntervencion() {
    const { _idU } = useParams();
    console.log(_idU); //DEBO CAMBIAR ESTO, YA QUE NO ESTOY DIFERENCIANDO EN CUANDO SE HACE UNA INTERVENCION DESDE ADMIN QUE DESDE FUERA DE ÉL

    const [auth, usuario] = useContext(CRMContext);
    const navigate = useNavigate();

    const [intervencion, guardarIntervencion] = useState({
        Id_Animal: '',
        Id_Usuario: usuario ? _idU : '', // Asigna automáticamente el ID del usuario
        detalles: [],
        nombre: '',
        resultadoAntes: '',
        resultadoDespues: '',
        comentarios: ''
    });

    // Aqui carga los animlas, debo cambiarlo para
    const [animales, setAnimales] = useState([]);
    const [tipoNombre, setTipos] = useState([]);
    const [detalles, setDetalles] = useState([]); // Agrega detalles y setDetalles al estado


    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [respuesta, respuestaTipos] = await Promise.all([
                    clienteAxios.get('/animales', {
                        headers: { Authorization: `Bearer ${auth.token}` }
                    })
                ]);
                setAnimales(respuesta.data);
                
            } catch (error) {
                console.log(error);
            }
        };
        cargarDatos();
    }, [auth.token]);

    const actualizarState = e => {
        guardarIntervencion({
            ...intervencion,
            [e.target.name]: e.target.value
        });

        // Actualizar detalles cuando se ingresa una clave o valor
        if (e.target.name.startsWith('clave-') || e.target.name.startsWith('valor-')) {
            const index = e.target.name.split('-')[1];
            const newDetalles = [...detalles];
            newDetalles[index] = {
                ...newDetalles[index],
                [e.target.name.startsWith('clave-') ? 'clave' : 'valor']: e.target.value
            };
            setDetalles(newDetalles);
        }
    };
    const agregarCampoDetalle = () => {
        setDetalles([...detalles, { clave: '', valor: '' }]);
    };

    const agregarIntervencion = e => {
        e.preventDefault();

        // Agregar los detalles al objeto de intervención antes de enviar la solicitud
        const intervencionConDetalles  = {
            ...intervencion,
            detalles: detalles.filter(detalle => detalle.clave !== '' || detalle.valor !== '')
        };

        clienteAxios.post('/intervenciones', intervencionConDetalles, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
            .then(res => {
                if (res.data.code === 11000) {
                    Swal.fire({
                        icon: "error",
                        title: "Hubo un error",
                        text: 'Intervención ya registrada'
                    });
                } else {
                    console.log(res.data);
                    Swal.fire({
                        title: "Se agregó esa intervención",
                        text: res.data.mensaje,
                        icon: "success"
                    });
                    navigate('/intervenciones');
                }
            });
    }

    const validarIntervencion = () => {
        const { Id_Animal, nombre, resultadoAntes, resultadoDespues } = intervencion;
        return !Id_Animal || !nombre || !resultadoAntes || !resultadoDespues;
    }

    // Verificar autenticación de usuario
    useEffect(() => {
        if (!auth.auth || localStorage.getItem('token') !== auth.token) {
            navigate('/iniciar-sesion');
        }
    }, [auth, navigate]);

    return (
        <Fragment>
            <h2>Nueva Intervención</h2>

            <form onSubmit={agregarIntervencion}>

                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Animal:</label>
                    <select
                        name="Id_Animal"
                        onChange={actualizarState}
                    >
                        <option value="">-- Seleccione --</option>
                        {animales.map(animal => (
                            <option key={animal._id} value={animal._id}>{animal._id}</option>
                        ))}
                    </select>
                </div>

                {/* Campos dinámicos basados en el tipo de intervención seleccionado */}
                <div className="campo">
                    <label>Detalles de Intervención:</label>
                    {detalles.map((detalle, index) => (
                        <div className="detalle-campo" key={index}>
                            <input type="text" name={`clave-${index}`} onChange={actualizarState} placeholder="Clave" />
                            <input type="text" name={`valor-${index}`} onChange={actualizarState} placeholder="Valor" />
                        </div>
                    ))}
                    <button type="button" onClick={agregarCampoDetalle}>+</button>
                </div>


                {/* Campos dinámicos basados en el tipo de intervención seleccionado */}
                <div className="campo">
                    <label>Detalles de Intervención:</label>
                    {detalles.map((detalle, index) => (
                        <div className="detalle-campo" key={index}>
                            <input type="text" name={`clave-${index}`} onChange={actualizarState} placeholder="Clave" />
                            <input type="text" name={`valor-${index}`} onChange={actualizarState} placeholder="Valor" />
                        </div>
                    ))}
                    <button type="button" onClick={agregarCampoDetalle}>+</button>
                </div>


                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text"
                        placeholder="Nombre intervención"
                        name="nombre"
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Resultado Antes:</label>
                    <input type="number"
                        placeholder="Resultado antes de la intervención"
                        name="resultadoAntes"
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Resultado Después:</label>
                    <input type="number"
                        placeholder="Resultado después de la intervención"
                        name="resultadoDespues"
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Comentarios:</label>
                    <textarea
                        placeholder="Comentarios"
                        name="comentarios"
                        onChange={actualizarState}
                    ></textarea>
                </div>

                <div className="enviar">
                    <input type="submit"
                        className="btn btn-azul"
                        value="Agregar Intervención"
                        disabled={validarIntervencion()}
                    />
                </div>
            </form>
        </Fragment>
    );
}

export default NuevaIntervencion;