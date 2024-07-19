// src/components/analisis/Analisis.js
import React, { useState, useEffect, useRef } from 'react';
import clienteAxios from '../../config/axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Segmentacion = () => {
    const [criterio, setCriterio] = useState('');
    const [segmentacion, setSegmentacion] = useState(null);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const fetchData = async () => {
        try {
            if (criterio) {
                const responseSegmentacion = await clienteAxios.get(`/analisis/segmentacion/${criterio}`);
                setSegmentacion(responseSegmentacion.data);

                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const ctx = chartRef.current.getContext('2d');
                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(responseSegmentacion.data),
                        datasets: [{
                            label: 'Mejoras por Segmento',
                            data: Object.values(responseSegmentacion.data),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
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
                //const razaNombre = await clienteAxios.get(`/razas/${idRaza}`);
                //const razasEncontradas = razaNombre.findOne(nom => nom === razaNombre._id);
                //Continuar para sacar los objetos de razas encontradas y poder sacar el nombre de cada raza

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
            <h2>Análisis de Segmentación de Datos</h2>

            <form onSubmit={handleSubmit}>
                <div className="campo">
                    <label>Seleccione Criterio:</label>
                    <select
                        name="criterio"
                        onChange={e => setCriterio(e.target.value)}
                        value={criterio}
                    >
                        <option value="">-- Seleccione --</option>
                        <option value="raza">Raza</option>
                        <option value="sexo">Sexo</option>
                        <option value="edad">Edad</option>
                        <option value="Esterilizado">Esterilizado</option>
                        <option value="Adoptado">Adoptado</option>
                        <option value="Desparacitado">Desparacitado</option>
                        <option value="dd">dd</option>
                    </select>
                </div>

                <button type="submit" disabled={!criterio}>
                    Analizar
                </button>
            </form>

            <canvas id="myChart" ref={chartRef}></canvas>
        </div>
    );
};

export default Segmentacion;
