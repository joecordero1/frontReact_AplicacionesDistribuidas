import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';

function EstadoAnimal({ estado }) {
    const [auth,] = useContext(CRMContext);
    const token = auth.token;
    const navigate = useNavigate();
    const { _id, nombre, detalles } = estado;

    const deleteEstadoAnimal = id => {
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
                clienteAxios.delete(`/estados-animal/${_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(res => {
                    Swal.fire({
                        title: "Eliminado",
                        text: res.data.mensaje,
                        icon: "success"
                    });
                })
                .catch(error => {
                    Swal.fire('Error', 'No se pudo eliminar el estado del animal', 'error');
                });
            }
        });
    };

    return (
        <li className="estadoAnimal">
            <div className="info-estadoAnimal">
                <p className="id">Id estado: {_id}</p>
                <p className="nombre">Nombre: {nombre}</p>
                <p>Detalles: {detalles.map(detalle => `${detalle.clave}: ${detalle.valor}`).join(', ')}</p>
            </div>
            <div className="acciones">
                <Link to={`/estados-animal/editar/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Editar Estado
                </Link>
                <button
                    type="button"
                    className="btn btn-rojo btn-eliminar"
                    onClick={() => deleteEstadoAnimal(_id)}>
                    <i className="fas fa-times"></i>
                    Eliminar Estado
                </button>
            </div>
        </li>
    );
}

export default EstadoAnimal;
