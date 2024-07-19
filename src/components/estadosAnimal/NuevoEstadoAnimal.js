import React, { Fragment, useState, useContext, useEffect } from 'react';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

function NuevoEstadoAnimal() {
    const [auth,] = useContext(CRMContext);
    const navigate = useNavigate();

    const [estadoAnimal, guardarEstadoAnimal] = useState({
        nombre: '',
        detalles: []
    });

    const [detalles, setDetalles] = useState([{ clave: '', valor: '' }]);

    const actualizarState = e => {
        guardarEstadoAnimal({
            ...estadoAnimal,
            [e.target.name]: e.target.value
        });
    }

    const actualizarDetalle = (index, e) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][e.target.name] = e.target.value;
        setDetalles(nuevosDetalles);
    }

    const agregarDetalle = () => {
        setDetalles([...detalles, { clave: '', valor: '' }]);
    }

    const eliminarDetalle = (index) => {
        const nuevosDetalles = detalles.filter((_, i) => i !== index);
        setDetalles(nuevosDetalles);
    }

    const agregarEstadoAnimal = async e => {
        e.preventDefault();
        const nuevoEstadoAnimal = {
            ...estadoAnimal,
            detalles
        };

        try {
            const response = await clienteAxios.post('/estados-animal', nuevoEstadoAnimal, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });

            Swal.fire('Se agregó un nuevo estado del animal', response.data.mensaje, 'success');
            navigate('/estados-animal');
        } catch (error) {
            console.log(error);
            Swal.fire('Error', 'No se pudo agregar el estado del animal', 'error');
        }
    }

    return (
        <Fragment>
            <h2>Nuevo Estado Animal</h2>
            <form onSubmit={agregarEstadoAnimal}>
                <legend>Llena todos los campos</legend>
                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre del estado" 
                        name="nombre" 
                        onChange={actualizarState} 
                    />
                </div>
                <div className="campo">
                    <label>Detalles:</label>
                    {detalles.map((detalle, index) => (
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
                    <input type="submit" className="btn btn-azul" value="Agregar Estado Animal" />
                </div>
            </form>
        </Fragment>
    );
}

export default NuevoEstadoAnimal;
