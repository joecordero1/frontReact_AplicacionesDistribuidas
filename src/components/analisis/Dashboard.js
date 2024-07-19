// src/components/analisis/Dashboard.js
import React, { useState, useRef } from 'react';
import clienteAxios from '../../config/axios';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { es } from 'date-fns/locale';

Chart.register(...registerables);

const Dashboard = () => {
    const [sector, setSector] = useState('');
    const [mes, setMes] = useState('');
    const [año, setAño] = useState('');
    const [datosActual, setDatosActual] = useState(null);
    const [datosAnterior, setDatosAnterior] = useState(null);
    const [nivelMejora, setNivelMejora] = useState('');
    const [porcentajeMejora, setPorcentajeMejora] = useState(null);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const doughnutRef = useRef(null);
    const doughnutInstance = useRef(null);
    const razaRef = useRef(null);
    const razaInstance = useRef(null);

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

    const meses = [
        { nombre: 'Enero', valor: '01' },
        { nombre: 'Febrero', valor: '02' },
        { nombre: 'Marzo', valor: '03' },
        { nombre: 'Abril', valor: '04' },
        { nombre: 'Mayo', valor: '05' },
        { nombre: 'Junio', valor: '06' },
        { nombre: 'Julio', valor: '07' },
        { nombre: 'Agosto', valor: '08' },
        { nombre: 'Septiembre', valor: '09' },
        { nombre: 'Octubre', valor: '10' },
        { nombre: 'Noviembre', valor: '11' },
        { nombre: 'Diciembre', valor: '12' },
    ];

    const fetchData = async () => {
        try {
            if (sector && mes && año) {
                const responseActual = await clienteAxios.get(`/analisis/sector/${sector}/${año}-${mes}-01/${año}-${mes}-28`);
                const responseAnterior = await clienteAxios.get(`/analisis/sector/${sector}/${año}-${mes - 1}-01/${año}-${mes - 1}-28`);
                
                setDatosActual(responseActual.data);
                setDatosAnterior(responseAnterior.data);

                const porcentaje = calcularPorcentajeMejora(responseActual.data.totalMejora, responseAnterior.data.totalMejora);
                const nivel = calcularNivelMejora(porcentaje);
                setNivelMejora(nivel);
                setPorcentajeMejora(porcentaje);

                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const labels = [`${mes}-${año}`, `${mes - 1}-${año}`];
                const dataActual = responseActual.data.totalMejora;
                const dataAnterior = responseAnterior.data.totalMejora;

                const ctx = chartRef.current.getContext('2d');
                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Mejoras',
                            data: [dataActual, dataAnterior],
                            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });

                if (doughnutInstance.current) {
                    doughnutInstance.current.destroy();
                }
                    const doughnutCtx = doughnutRef.current.getContext('2d');
                    doughnutInstance.current = new Chart(doughnutCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Mejora'],
                        datasets: [{
                            data: [calcularPorcentajeMejora(responseActual.data.totalMejora, responseAnterior.data.totalMejora), 100 - calcularPorcentajeMejora(responseActual.data.totalMejora, responseAnterior.data.totalMejora)],
                            backgroundColor: [
                                getBackgroundColor(nivel),
                                'rgba(211, 211, 211, 0.2)'
                            ],
                            borderColor: [
                                getBorderColor(nivel),
                                'rgba(211, 211, 211, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (tooltipItem) {
                                        const label = tooltipItem.label || '';
                                        return label;
                                    }
                                }
                            }
                        }
                    },
                    cutout: '70%' // Para crear un centro hueco
                });

                // Agregar gráfico de razas
                if (razaInstance.current) {
                    razaInstance.current.destroy();
                }
                const razaCtx = razaRef.current.getContext('2d');
                const razasLabels = Object.keys(responseActual.data.razas).map(razaId => responseActual.data.razas[razaId].nombreRaza);
                const razasData = Object.keys(responseActual.data.razas).map(razaId => responseActual.data.razas[razaId].contador);

                razaInstance.current = new Chart(razaCtx, {
                    type: 'bar',
                    data: {
                        labels: razasLabels,
                        datasets: [{
                            label: 'Razas',
                            data: razasData,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        }
    };

    const calcularNivelMejora = (porcentajeMejora) => {
        let nivel = '';

        if (porcentajeMejora < 20) {
            nivel = 'Muy Baja';
        } else if (porcentajeMejora >= 20 && porcentajeMejora < 50) {
            nivel = 'Baja';
        } else if (porcentajeMejora >= 50 && porcentajeMejora < 80) {
            nivel = 'Moderada';
        } else if (porcentajeMejora >= 80 && porcentajeMejora < 100) {
            nivel = 'Alta';
        } else {
            nivel = 'Muy Alta';
        }

        return nivel;
    };

    const calcularPorcentajeMejora = (mejoraActual, mejoraAnterior) => {
        if (mejoraAnterior === 0) {
            return mejoraActual * 100;
        }
        return ((mejoraActual - mejoraAnterior) / mejoraAnterior) * 100;
    };

    const getBackgroundColor = (nivel) => {
        switch (nivel) {
            case 'Muy Baja':
                return 'rgba(255, 99, 132, 0.2)';
            case 'Baja':
                return 'rgba(255, 159, 64, 0.2)';
            case 'Moderada':
                return 'rgba(255, 205, 86, 0.2)';
            case 'Alta':
                return 'rgba(75, 192, 192, 0.2)';
            case 'Muy Alta':
                return 'rgba(54, 162, 235, 0.2)';
            default:
                return 'rgba(211, 211, 211, 0.2)';
        }
    };

    const getBorderColor = (nivel) => {
        switch (nivel) {
            case 'Muy Baja':
                return 'rgb(255, 99, 132)';
            case 'Baja':
                return 'rgb(255, 159, 64)';
            case 'Moderada':
                return 'rgb(255, 205, 86)';
            case 'Alta':
                return 'rgb(75, 192, 192)';
            case 'Muy Alta':
                return 'rgb(54, 162, 235)';
            default:
                return 'rgb(211, 211, 211)';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };

    return (
        <div>
            <h2>Dashboard de Mejoras por Sector y Mes</h2>

            <form onSubmit={handleSubmit}>
                <div className="campo">
                    <label>Seleccione Sector:</label>
                    <select
                        name="sector"
                        onChange={e => setSector(e.target.value)}
                        value={sector}
                    >
                        <option value="">-- Seleccione un sector --</option>
                        {Object.keys(sectores).map(sector => (
                            <option key={sector} value={sector}>{sector}</option>
                        ))}
                    </select>
                </div>

                <div className="campo">
                    <label>Mes:</label>
                    <select
                        name="mes"
                        onChange={e => setMes(e.target.value)}
                        value={mes}
                    >
                        <option value="">-- Seleccione un mes --</option>
                        {meses.map(mes => (
                            <option key={mes.valor} value={mes.valor}>{mes.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="campo">
                    <label>Año:</label>
                    <input
                        type="number"
                        name="año"
                        placeholder="Año"
                        onChange={e => setAño(e.target.value)}
                        value={año}
                    />
                </div>

                <button type="submit" disabled={!sector || !mes || !año}>
                    Analizar
                </button>
            </form>

            <canvas id="myChart" ref={chartRef}></canvas>
            {porcentajeMejora !== null && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <h3>Porcentaje de Mejora: {porcentajeMejora}%</h3>
                </div>
            )}
            <canvas id="doughnutChart" ref={doughnutRef}></canvas>
            <h2>Distribución de Razas</h2>
            <canvas id="razaChart" ref={razaRef}></canvas>


            
        </div>
    );
};

export default Dashboard;
