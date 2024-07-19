import React, { Fragment, useEffect, useState, useContext } from 'react';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';


function EditarCliente() {
    const { _id } = useParams();
    const [auth, guardarAuth] = useContext(CRMContext);
    const navigate = useNavigate();

    const [cliente, datosCliente] = useState({
        nombre: '',
        apellido: '',
        empresa: '',
        email: '',
        telefono: ''
    });

    //query a la api
    const consultarAPI = async () => {
        const clienteConsulta = await clienteAxios.get(`/clientes/${_id}`, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
        //colocar en el state
        datosCliente(clienteConsulta.data);
    }


    //useEfect cuando cambia
    useEffect( () => {
        consultarAPI();
    }, []);

    //aqui leemos el state
    const actualizarState = e => {
        //almacenar lo que escribe
        datosCliente({
            ...cliente,
            [e.target.name] : e.target.value

        })
        
    }

    //valido el formulario
    const validarCliente = () => {
        const {nombre, apellido, email, empresa, telefono} = cliente;
        let valido = !nombre.length || !apellido.length || !email.length || !empresa.length || !telefono.length;

        return valido;
    }

    // Manejador del envío del formulario
    const actualizarCliente = e => {
        e.preventDefault();

        clienteAxios.put(`/clientes/${cliente._id}`, cliente, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
            .then(res => {
                if (res.data.code === 11000) {
                    Swal.fire('Error', 'Ese cliente ya está registrado', 'error');
                } else {
                    Swal.fire('Actualizado', res.data.mensaje, 'success');
                    navigate('/');
                }
            }).catch(error => {
                console.log(error);
                Swal.fire('Error', 'No se pudo actualizar el cliente', 'error');
            });
    };


    //verificar autenticacion de usuario
    useEffect(() => {
        if (!auth.auth || localStorage.getItem('token') !== auth.token) {
            navigate('/iniciar-sesion');
        }
    }, [auth, navigate]);
    
    return(
        <Fragment>
            <h2>Editar Cliente</h2>
            
            <form onSubmit={actualizarCliente}>
                <legend>Llena todos los campos</legend>
                <div className="campo">
                    <label>Nombre:</label>
                    <input  type="text" 
                            placeholder="Nombre Cliente" 
                            name="nombre"
                            onChange={actualizarState}
                            value = {cliente.nombre}
                    />
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input  type="text" 
                            placeholder="Apellido Cliente" 
                            name="apellido" 
                            onChange={actualizarState}
                            value = {cliente.apellido}
                    />
                </div>
            
                <div className="campo">
                    <label>Empresa:</label>
                    <input  type="text" 
                            placeholder="Empresa Cliente" 
                            name="empresa" 
                            onChange={actualizarState}
                            value = {cliente.empresa}
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input  type="email" 
                            placeholder="Email Cliente" 
                            name="email" 
                            onChange={actualizarState}
                            value = {cliente.email}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input  type="text" 
                            placeholder="Teléfono Cliente" 
                            name="telefono" 
                            onChange={actualizarState}
                            value = {cliente.telefono}
                    />
                </div>

                <div className="enviar">
                    <input type="submit" 
                           className="btn btn-azul" 
                           value="Confirmar" 
                           disabled = {validarCliente()}
                    />
                </div>
            </form>
        </Fragment>
    );
}

//el router toma un componente y devuelve otro componente
export default EditarCliente;
