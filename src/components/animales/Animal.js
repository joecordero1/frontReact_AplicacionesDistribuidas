import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';


function Animal({ animal }) {
    
    const [auth,] = useContext(CRMContext);
    const token = auth.token;
    const navigate = useNavigate();
    // Estados para los nombres de tipoAnimal y raza
    const [tipoAnimalNombre, setTipoAnimalNombre] = useState('');
    const [razaNombre, setRazaNombre] = useState('');
    const [sexos, setSexoNombre] = useState('');
    const [estadosDetalles, setEstadosDetalles] = useState([]);
    const [sector, setSector] = useState([]);

    const sectores = {
        'Centro Histórico': { latMin: 0, latMax: 10, lonMin: 0, lonMax: 10 },
        'La Mariscal': { latMin: 10, latMax: 20, lonMin: 5, lonMax: 15 },
        'La Floresta': { latMin: 5, latMax: 15, lonMin: 15, lonMax: 25 },
        'Guápulo': { latMin: 15, latMax: 25, lonMin: 20, lonMax: 30 },
        'González Suárez': { latMin: 20, latMax: 25, lonMin: 0, lonMax: 10 },
        'Cumbayá y Tumbaco': { latMin: 40, latMax: 50, lonMin: 26, lonMax: 40 },
        'El Batán': { latMin: 30, latMax: 39, lonMin: 27, lonMax: 37 },
        'El Inca': { latMin: 30, latMax: 40, lonMin: 0, lonMax: 10 },
        'La Carolina': { latMin: 41, latMax: 50, lonMin: 10, lonMax: 20 },
        'La Concepción': { latMin: 50, latMax: 60, lonMin: 0, lonMax: 10 },
        'Carcelén': { latMin: 61, latMax: 81, lonMin: 10, lonMax: 20 },
        'Quito Norte': { latMin: 61, latMax: 81, lonMin: -30, lonMax: -1 },
        'Quito Sur': { latMin: -23, latMax: -50, lonMin: -10, lonMax: 10 },
        'Chillogallo': { latMin: -11, latMax: -22, lonMin: -5, lonMax: 5 },
        'San Juan': { latMin: -1, latMax: -10, lonMin: -11, lonMax: -1 }
    };

    const determinarSector = (coordinates) => {
        const [lon, lat] = coordinates;
        for (const [sector, limites] of Object.entries(sectores)) {
            if (
                lat >= limites.latMin &&
                lat < limites.latMax &&
                lon >= limites.lonMin &&
                lon < limites.lonMax
            ) {
                return sector;
            }
        }
        return 'Sector Desconocido';
    };

    const { _id, tipoAnimal, raza, estados, ubicacion, salud, intervenciones, Edad,sexo, FechaRegistro, FechaActualizacion } = animal;

    // Cargar los nombres de tipoAnimal, raza y sexo al cargar el componente
    useEffect(() => {
        if (animal.Id_TipoAnimal && animal.Id_Raza && animal.Id_Sexo) {
            Promise.all([
                clienteAxios.get(`/tipos-animal/${animal.Id_TipoAnimal}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                clienteAxios.get(`/razas/${animal.Id_Raza}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                clienteAxios.get(`/sexos/${animal.Id_Sexo}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]).then(([tipoRes, razaRes, sexoRes]) => {
                setTipoAnimalNombre(tipoRes.data.nombre);
                setRazaNombre(razaRes.data.nombre);
                setSexoNombre(sexoRes.data.nombre);
            }).catch(error => {
                console.error('Error al cargar los nombres de tipoAnimal o raza', error);
            });
        }
    }, [animal, token]);

    // Cargar los detalles de los estados
    useEffect(() => {
        if (estados.length > 0) {
            Promise.all(estados.map(id => 
                clienteAxios.get(`/estados-animal/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            )).then(responses => {
                const detalles = responses.map((res, index) => ({
                    ...res.data,
                    detalles: estados[index].detalles, // Añadir detalles específicos del animal
                    nombre: res.data.nombre,
                }));
                setEstadosDetalles(detalles);
            }).catch(error => {
                console.error('Error al cargar los detalles de los estados', error);
            });
        }
    }, [estados, token]);

    useEffect(() => {
        setSector(determinarSector(animal.ubicacion.coordinates));
    }, [animal.ubicacion.coordinates]);

    const deleteAnimal = id => {
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
                clienteAxios.delete(`/animales/${_id}`, {
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
                    Swal.fire('Error', 'No se pudo eliminar el animal', 'error');
                });
            }
        });
    }
    
    const formatEstadoSalud = (items) => {
        if (!items || items.length === 0) {
            return 'Sin datos';
        }
        return items.map((item, index) => (
            <p key={index}>
                {item.estado}
            </p>
        ));
    };
    const formatDestalles = (items) => {
        if (!items || items.length === 0) {
            return 'Sin datos';
        }
        return items.map((item, index) => (
            <p key={index}>
                {item._id} 
                {item.detalles.map(det => `${det.clave}: ${det.valor}`).join(', ')}
            </p>
        ));
    };
    const formatIntervenciones = (items) => {
        if (!items || items.length === 0) {
            return 'Sin datos';
        }
        return items.map(item => `${item.intervenciones.clave} (${item.detalles.map(det => `${det.clave}: ${det.valor}`).join(', ')})`).join('; ');
    };

    return (
        <li className="animal">
            <div className="info-animal">
                <p className="nombre">IDAnimal: {animal._id}</p>
                <p className="tipo">Tipo Animal: {tipoAnimalNombre}</p>
                <p>Raza: {razaNombre}</p>
                <div>Estado(s): {formatEstadoSalud(estados)}</div>
                <div>Detalles: {formatDestalles(estadosDetalles)}</div>
                <p>Ubicación: {sector}</p>
                <p>Salud: {formatEstadoSalud(salud)}</p>
                <p>Intervenciones: {formatIntervenciones(intervenciones)}</p>
                <p>Edad: {Edad}</p>
                <p>Sexo: {sexos}</p>
                <p>Fecha de Registro: {FechaRegistro}</p>
                <p>Fecha de Actualización: {FechaActualizacion}</p>
            </div>
            <div className="acciones">
                <Link to={`/animales/anadir-estado/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Añadir Estado
                </Link>
                <Link to={`/animales/anadir-intervencion/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Añadir Intervencion
                </Link>
                <Link to={`/animales/editar/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Editar Animal
                </Link>
                <button
                    type="button"
                    className="btn btn-rojo btn-eliminar"
                    onClick={() => deleteAnimal(_id)}>
                    <i className="fas fa-times"></i>
                    Eliminar Animal
                </button>
            </div>
        </li>
    );
}

export default Animal;
