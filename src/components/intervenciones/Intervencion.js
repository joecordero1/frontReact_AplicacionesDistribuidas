import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';

function Intervencion({ intervencion }) {
    
    const [auth,] = useContext(CRMContext);
    const token = auth.token;
    const navigate = useNavigate();

    const { _id, Id_Animal, Id_Usuario, nombre, fecha, detalles, resultadoAntes, resultadoDespues, comentarios, efectividadCalculada, seguimiento } = intervencion;

    const deleteIntervencion = id => {
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
                clienteAxios.delete(`/intervenciones/${_id}`, {
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
                    Swal.fire('Error', 'No se pudo eliminar la intervención', 'error');
                });
            }
        });
    }

    return (
        <li className="intervencion">
            <div className="info-intervencion">
                <p className="nombre">ID Intervención: {_id}</p>
                <p>ID Animal: {Id_Animal}</p>
                <p>ID Usuario: {Id_Usuario}</p>
                <p>Nombre: {nombre}</p>
                <p>Fecha: {fecha}</p>
                <p>Detalles: {detalles.map(detalle => `${detalle.clave}: ${detalle.valor}`).join(', ')}</p>
                <p>Resultado Antes: {resultadoAntes}</p>
                <p>Resultado Después: {resultadoDespues}</p>
                <p>Comentarios: {comentarios}</p>
                {/*
                <p>Efectividad Calculada: {efectividadCalculada}</p>
                <p>Seguimiento: {seguimiento.map(seg => `${seg.fecha}: ${seg.resultado}, Comentario: ${seg.comentario}`).join(', ')}</p>
                */}
            </div>
            <div className="acciones">
                <Link to={`/intervenciones/editar/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Editar Intervención
                </Link>
                <button
                    type="button"
                    className="btn btn-rojo btn-eliminar"
                    onClick={() => deleteIntervencion(_id)}>
                    <i className="fas fa-times"></i>
                    Eliminar Intervención
                </button>
            </div>
        </li>
    );
}

export default Intervencion;