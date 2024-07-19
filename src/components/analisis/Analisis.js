// src/components/analisis/Analisis.js
import React, { useState, useEffect, useRef } from 'react';
import clienteAxios from '../../config/axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Analisis = () => {
    const [ano, setAno] = useState('');
    const [mejoras, setMejoras] = useState(null);
    const [comparacion, setComparacion] = useState(null);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const fetchData = async () => {
        try {
            if (ano.length === 4) {
                const responseMejoras = await clienteAxios.get(`/analisis/mejoras/${ano}-01-01/${ano}-12-31`);
                const responseComparacion = await clienteAxios.get(`/analisis/comparacion/${ano}`);
                setMejoras(responseMejoras.data.totalMejora);
                setComparacion(responseComparacion.data);

                // Crear gráfico después de obtener datos
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const ctx = chartRef.current.getContext('2d');
                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Mejoras Locales', 'Mejoras Ciudad Vecina'],
                        datasets: [{
                            label: 'Comparación de Mejoras',
                            data: [responseMejoras.data.totalMejora, responseComparacion.data.mejoraVecina],
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
            <h2>Análisis de Intervenciones</h2>

            <form onSubmit={handleSubmit}>
                <div className="campo">
                    <label>Seleccione Ano:</label>
                    <input
                        type="number"
                        name="ano"
                        placeholder="Ingrese el ano"
                        onChange={e => setAno(e.target.value)}
                        value={ano}
                    />
                </div>

                <button type="submit" disabled={ano.length !== 4}>
                    Analizar
                </button>
            </form>

            <canvas id="myChart" ref={chartRef}></canvas>
            {comparacion && (
                <div>
                    <p>Porcentaje Alcanzado: {comparacion.porcentajeAlcanzado}%</p>
                    <p>Faltante para Alcanzar: {comparacion.faltanteParaAlcanzar}</p>
                </div>
            )}
        </div>
    );
};

export default Analisis;
