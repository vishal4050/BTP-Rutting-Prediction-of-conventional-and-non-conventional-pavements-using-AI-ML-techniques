import React, { forwardRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultsGraph = forwardRef(({ data, startLocation, endLocation }, ref) => {
    const chartData = {
        labels: data.map(item => item.fileName),
        datasets: [
            {
                label: 'Predicted Severity',
                data: data.map(() => 1),
                backgroundColor: data.map(item => {
                    if (item.predictedClass === 'Severe') return '#FF2323';
                    if (item.predictedClass === 'Moderate') return '#FFFF00';
                    return '#00FF00';
                }),
                borderColor: data.map(item => {
                    if (item.predictedClass === 'Severe') return '#FF2323';
                    if (item.predictedClass === 'Moderate') return '#E0E000';
                    return '#00CC00';
                }),
                borderWidth: 2,
                borderRadius: 6,
                barThickness: 40,
                maxBarThickness: 40,
                categoryPercentage: 0.8,
                barPercentage: 0.9,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Rutting Severity for Each Image',
                color: '#000',
                font: { size: 18, weight: 'bold' },
                padding: { bottom: 20 },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const item = data[context.dataIndex];
                        return `Severity: ${item.predictedClass}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 1,
                ticks: { display: false },
                grid: { display: false },
                title: {
                    display: true,
                    text: 'Severity (Color Coded)',
                    color: '#000',
                    font: { size: 14, weight: 'bold' },
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Image File',
                    color: '#000',
                    font: { size: 14, weight: 'bold' },
                },
                ticks: {
                    color: '#000',
                    font: { size: 11 },
                    autoSkip: true,
                    maxRotation: 45,
                    minRotation: 0,
                },
                grid: { display: false },
            },
        },
    };

    return (
        <div
            ref={ref}
            style={{
                height: '460px',
                width: '100%',
                padding: '20px',
                backgroundColor: 'white', // solid white for export
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                position: 'relative',
            }}
        >
            <Bar data={chartData} options={options} />

            {/* Legend */}
            <div
                style={{
                    textAlign: 'center',
                    marginTop: '15px',
                    fontSize: '15px',
                    color: 'black',
                    fontWeight: '500',
                }}
            >
                <span style={{ marginRight: '15px' }}>🟩 Normal</span>
                <span style={{ marginRight: '15px' }}>🟨 Moderate</span>
                <span>🟥 Severe</span>
            </div>

            {/* Locations */}
            {startLocation && endLocation && (
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: '10px',
                        color: 'black',
                        fontSize: '14px',
                        fontStyle: 'italic',
                    }}
                >
                    From <strong>{startLocation}</strong> → <strong>{endLocation}</strong>
                </div>
            )}
        </div>
    );
});

export default ResultsGraph;
