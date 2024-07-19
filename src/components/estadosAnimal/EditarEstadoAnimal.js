import React, { Fragment, useEffect, useState, useContext } from 'react';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

function EditarEstadoAnimal() {
    const { _id } = useParams();
    const [auth,] = useContext(CRMContext);
    const navigate = useNavigate();

    const [estadoAnimal, guardarEstadoAnimal] = useState({
        nombre: '',
        detalles: []
    });

    useEffect(() => {
        const consultarAPI = async () => {
            try {
                const response = await clienteAxios.get(`/estados-animal/${_id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                guardarEstadoAnimal(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        consultarAPI();
    }, [_id, auth.token]);

    const actualizarState = e => {
        guardarEstadoAnimal({
            ...estadoAnimal,
            [e.target.name]: e.target.value
        });
    }

    const actualizarDetalle = (index, e) => {
        const nuevosDetalles = [...estadoAnimal.detalles];
        nuevosDetalles[index][e.target.name] = e.target.value;
        guardarEstadoAnimal({
            ...estadoAnimal,
            detalles: nuevosDetalles
        });
    }

    const agregarDetalle = () => {
        guardarEstadoAnimal({
            ...estadoAnimal,
            detalles: [...estadoAnimal.detalles, { clave: '', valor: '' }]
        });
    }

    const eliminarDetalle = (index) => {
        const nuevosDetalles = estadoAnimal.detalles.filter((_, i) => i !== index);
        guardarEstadoAnimal({
            ...estadoAnimal,
            detalles: nuevosDetalles
        });
    }

    const actualizarEstadoAnimal = async e => {
        e.preventDefault();
        try {
            const response = await clienteAxios.put(`/estados-animal/${_id}`, estadoAnimal, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });

            Swal.fire('Actualizado', response.data.mensaje, 'success');
            navigate('/estados-animal');
        } catch (error) {
            console.log(error);
            Swal.fire('Error', 'No se pudo actualizar el estado del animal', 'error');
        }
    }

    return (
        <Fragment>
            <h2>Editar Estado Animal</h2>
            <form onSubmit={actualizarEstadoAnimal}>
                <legend>Llena todos los campos</legend>
                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre del estado" 
                        name="nombre" 
                        value={estadoAnimal.nombre}
                        onChange={actualizarState} 
                    />
                </div>
                <div className="campo">
                    <label>Detalles:</label>
                    {estadoAnimal.detalles.map((detalle, index) => (
                        <div key={index} className="detalle">
                            <input 
                                type="text" 
                                placeholder="Clave" 
                                name="clave" 
                                value={detalle.clave} 
                                onChange={e => actualizarDetalle(index, e)} 
                            />
                            <input 
                                type="text" 
                                placeholder="Valor" 
                                name="valor" 
                                value={detalle.valor} 
                                onChange={e => actualizarDetalle(index, e)} 
                            />
                            <button type="button" onClick={() => eliminarDetalle(index)}>Eliminar</button>
                        </div>
                    ))}
                    <button type="button" onClick={agregarDetalle}>Agregar Detalle</button>
                </div>
                <div className="enviar">
                    <input type="submit" className="btn btn-azul" value="Actualizar Estado Animal" />
                </div>
            </form>
        </Fragment>
    );
}

export default EditarEstadoAnimal;
