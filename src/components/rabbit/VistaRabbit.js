import React, { useState, useRef } from 'react';
import clienteAxios from '../../config/axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Analisis = () => {
    const [isMessageSent, setIsMessageSent] = useState(false);
    const [resultados, setResultados] = useState([]);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const sendMessage = async () => {
        try {
            const response = await fetch('http://localhost:5000/rabbitmq/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                alert('Message sent to RabbitMQ!');
                setIsMessageSent(true);
            } else {
                alert('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error sending message');
        }
    };

    const consumeMessage = async () => {
        try {
            const response = await fetch('http://localhost:5000/rabbitmq/consume-message', {
                method: 'POST',
            });
            if (response.ok) {
                const data = await response.json();
                setResultados(prevResultados => [...prevResultados, data]);
                updateChart([...resultados, data]);
                alert(`Message consumed: ${JSON.stringify(data)}`);
            } else {
                alert('Failed to consume message');
            }
        } catch (error) {
            console.error('Error consuming message:', error);
            alert('Error consuming message');
        }
    };

    const updateChart = (data) => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map((_, index) => `Data ${index + 1}`),
                datasets: [
                    {
                        label: 'Mejora Vecina',
                        data: data.map(result => result.mejoraVecina),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Porcentaje Alcanzado',
                        data: data.map(result => result.porcentajeAlcanzado),
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    };

    return (
        <div>
            <h2>Análisis de Intervenciones en el año 2024</h2>

            <button onClick={sendMessage}>Send</button>
            <button onClick={consumeMessage} disabled={!isMessageSent}>Consume</button>

            <canvas id="myChart" ref={chartRef}></canvas>
            
        </div>
    );
};

export default Analisis;
