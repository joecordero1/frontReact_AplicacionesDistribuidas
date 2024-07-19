import React, { useContext, useEffect } from 'react';
import {Link, useNavigate}  from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';


function Cliente({cliente}) {
    const { _id, nombre, apellido, empresa, email, telefono} = cliente;
    const [auth, ] = useContext(CRMContext);
    const token = auth.token;
    const navigate = useNavigate();
    
    const deleteCliente = id => {
        Swal.fire({
            title: "Confirmación",
            text: "No es posible revertir esta accion",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Eliminar"
          }).then((result) => {
            if (result.value) {
                clienteAxios.delete(`/clientes/${_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then (res => {
                    Swal.fire({
                        title: "Eliminado",
                        text: res.data.mensaje,
                        icon: "success"
                      });
                })
                .catch(error => {
                    // Manejo de errores (por ejemplo, mostrar un mensaje de error)
                    Swal.fire('Error', 'No se pudo eliminar el cliente', 'error');
                });

            }
          });
    }

    return(
        <li className="cliente">
            <div className="info-cliente">
                <p className="nombre">{nombre} {apellido}</p>
                <p className="empresa">{empresa}</p>
                <p>{email}</p>
                <p>{telefono}</p>
            </div>
            <div className="acciones">
                <Link to={`/clientes/editar/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Editar Cliente
                </Link>
                <button 
                type="button"
                className="btn btn-rojo btn-eliminar"
                onClick={deleteCliente}>
                    <i className="fas fa-times"></i>
                    Eliminar Cliente
                </button>
            </div>
        </li>
    )
}

export default Cliente;