import React, { useState, useRef } from 'react';
import clienteAxios from '../../config/axios';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Importar el adaptador de fecha
import { es } from 'date-fns/locale';

Chart.register(...registerables);

const SegmentacionTemporal = () => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [resultados, setResultados] = useState({});
    const [nivelMejora, setNivelMejora] = useState('');
    const [porcentajeMejora, setPorcentajeMejora] = useState(null);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [sector, setSector] = useState('');
    const [datosActual, setDatosActual] = useState(null);
    const [datosAnterior, setDatosAnterior] = useState(null);
    const doughnutRef = useRef(null);
    const doughnutInstance = useRef(null);

    // Definición de sectores (simplificada por cuadrantes)
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

    const fetchData = async () => {
        try {
            if (fechaInicio && fechaFin) {
                const response = await clienteAxios.get(`/analisis/sectorial/${fechaInicio}/${fechaFin}`);
                setResultados(response.data);
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const fechas = Object.keys(response.data);

                const sectorLabels = Object.keys(sectores);
                const colors = sectorLabels.map((sector, index) => {
                    const hue = (index * 30) % 360;
                    return `hsl(${hue}, 70%, 50%)`;
                });
                const datasets = sectorLabels.map((sector, index) => ({
                    label: sector,
                    data: fechas.map(fecha => response.data[fecha][sector] ? response.data[fecha][sector].totalMejora : 0),
                    backgroundColor: colors[index],
                    borderColor: colors[index],
                    borderWidth: 1,
                    fill: false
                }));

                const ctx = chartRef.current.getContext('2d');
                chartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: fechas,
                        datasets: datasets
                    },
                    options: {
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: 'day'
                                },
                                adapters: {
                                    date: {
                                        locale: es // Usar el locale en español (opcional)
                                    }
                                }
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
                
            }
        } catch (error) {
            console.error('Error fetching analysis data', error);
        }
    };

    

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };
    return (
        <div>
            <h2>Análisis Sectorial y Temporal</h2>

            <form onSubmit={handleSubmit}>
                <div className="campo">
                    <label>Fecha Inicio:</label>
                    <input
                        type="date"
                        name="fechaInicio"
                        onChange={e => setFechaInicio(e.target.value)}
                        value={fechaInicio}
                    />
                </div>

                <div className="campo">
                    <label>Fecha Fin:</label>
                    <input
                        type="date"
                        name="fechaFin"
                        onChange={e => setFechaFin(e.target.value)}
                        value={fechaFin}
                    />
                </div>

                <button type="submit" disabled={!fechaInicio || !fechaFin}>
                    Analizar
                </button>
            </form>

            <canvas id="myChart" ref={chartRef}></canvas>
        </div>
    );
};

export default SegmentacionTemporal;
