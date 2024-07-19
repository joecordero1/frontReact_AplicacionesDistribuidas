import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';

function AnadirIntervencion() {
    const { _id } = useParams(); // id del animal
    const [auth] = useContext(CRMContext);
    const navigate = useNavigate();

    const [detalles, setDetalles] = useState([]);

    const [intervencion, setIntervencion] = useState({
        Id_Animal: _id,
        Id_Usuario: '', // Asignar aquí el id del usuario
        nombre: '',
        resultadoAntes: '',
        resultadoDespues: '',
        comentarios: '',
        detalles: []
    });

    // Cargar los datos del animal y usuario
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const animalRes = await clienteAxios.get(`/animales/${_id}`, {
                    headers: { Authorization: `Bearer ${auth.token}` }
                });
                console.log('Animal Res:', animalRes.data);

                const userRes = await clienteAxios.get(`/usuarios`, {
                    headers: { Authorization: `Bearer ${auth.token}` }
                });
                console.log('User Res:', userRes.data);

                if (!auth.email) {
                    console.error('Error: auth.email no está definido');
                    Swal.fire('Error', 'El correo electrónico del usuario autenticado no está disponible.', 'error');
                    return;
                }

                const usuario = userRes.data.find(user => {
                    if (user.email) {
                        return user.email.trim().toLowerCase() === auth.email.trim().toLowerCase();
                    }
                    return false;
                });
                console.log('Usuario Encontrado:', usuario);
                const userId = usuario ? usuario._id : null;

                if (animalRes.data && userId) {
                    setIntervencion({
                        ...intervencion,
                        Id_Animal: animalRes.data._id,
                        Id_Usuario: userId
                    });
                } else {
                    console.error('Error: Respuesta inesperada de la API');
                    Swal.fire('Error', 'No se encontraron datos válidos para el animal o usuario.', 'error');
                }
            } catch (error) {
                console.error('Error al cargar los datos:', error);
                Swal.fire('Error', 'No se pudieron cargar los datos.', 'error');
            }
        };
        cargarDatos();
    }, [_id, auth.token, auth.email]);

    const handleInputChange = e => {
        setIntervencion({
            ...intervencion,
            [e.target.name]: e.target.value
        });
    };

    const handleDetalleChange = (index, e) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][e.target.name] = e.target.value;
        setDetalles(nuevosDetalles);
    };

    const agregarCampoDetalle = () => {
        setDetalles([...detalles, { clave: '', valor: '' }]);
    };

    const agregarIntervencion = async e => {
        e.preventDefault();

        // Obtener la fecha actual del sistema
        const fechaActualizacion = new Date().toISOString();

        try {
            // Crear la nueva intervención con sus detalles específicos
            const nuevaIntervencion = {
                ...intervencion,
                detalles: detalles.filter(detalle => detalle.clave !== '' || detalle.valor !== '')
            };

            // Enviar la solicitud para agregar la nueva intervención
            const response = await clienteAxios.post('/intervenciones', nuevaIntervencion, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });

            if (response.data) {
                // Manejar la respuesta
                Swal.fire('Agregado', response.data.mensaje, 'success');
                navigate('/');
            } else {
                console.error('Error: Respuesta inesperada de la API');
                Swal.fire('Error', 'No se pudo agregar la intervención', 'error');
            }
        } catch (error) {
            console.error('Error al agregar la intervención:', error);
            Swal.fire('Error', 'No se pudo agregar la intervención', 'error');
        }
    };

    return (
        <form onSubmit={agregarIntervencion}>
            <legend>Agregar Intervención al Animal</legend>

            <div className="campo">
                <label>Nombre:</label>
                <input 
                    type="text"
                    name="nombre"
                    placeholder="Nombre de la intervención"
                    onChange={handleInputChange}
                />
            </div>

            <div className="campo">
                <label>Resultado Antes:</label>
                <input 
                    type="number"
                    name="resultadoAntes"
                    placeholder="Resultado antes de la intervención"
                    onChange={handleInputChange}
                />
            </div>

            <div className="campo">
                <label>Resultado Después:</label>
                <input 
                    type="number"
                    name="resultadoDespues"
                    placeholder="Resultado después de la intervención"
                    onChange={handleInputChange}
                />
            </div>

            <div className="campo">
                <label>Comentarios:</label>
                <textarea
                    name="comentarios"
                    placeholder="Comentarios"
                    onChange={handleInputChange}
                ></textarea>
            </div>

            <div className="campo">
                <label>Detalles de Intervención:</label>
                {detalles.map((detalle, index) => (
                    <div className="detalle-campo" key={index}>
                        <input 
                            type="text"
                            name="clave"
                            placeholder="Clave"
                            value={detalle.clave}
                            onChange={e => handleDetalleChange(index, e)}
                        />
                        <input 
                            type="text"
                            name="valor"
                            placeholder="Valor"
                            value={detalle.valor}
                            onChange={e => handleDetalleChange(index, e)}
                        />
                    </div>
                ))}
                <button type="button" onClick={agregarCampoDetalle}>+</button>
            </div>

            <div className="enviar">
                <input 
                    type="submit"
                    className="btn btn-azul"
                    value="Agregar Intervención"
                />
            </div>
        </form>
    );
}

export default AnadirIntervencion;
