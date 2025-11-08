import React from 'react';
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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ResultsGraph = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.fileName),
        datasets: [
            {
                label: 'Predicted Severity',
                data: data.map(() => 1), // All bars same height
                backgroundColor: data.map(item => {
                    if (item.predictedClass === 'Severe') return '#FF2323';   // 🔴 Red
                    if (item.predictedClass === 'Moderate') return '#FFFF00'; // 🟨 Yellow
                    return '#00FF00'; // 🟩 Green
                }),
                borderColor: data.map(item => {
                    if (item.predictedClass === 'Severe') return '#FF2323';
                    if (item.predictedClass === 'Moderate') return '#E0E000';
                    return '#00CC00';
                }),
                borderWidth: 2,
                borderRadius: 6,
                barThickness: 45,          // Fixed bar width
                maxBarThickness: 45,       // Prevent auto-thinning
                categoryPercentage: 0.7,   // Control spacing between categories
                barPercentage: 0.9,        // Make bars more filled
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
                    text: 'Predicted Severity (Color Coded)',
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
                    font: { size: 12 },
                    maxRotation: 45,
                    minRotation: 45,
                },
                grid: { display: false },
            },
        },
    };

    return (
        <div
            style={{
                height: '400px',
                width: '100%',
                padding: '10px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
        >
            <Bar data={chartData} options={options} />
            <div
                style={{
                    textAlign: 'center',
                    marginTop: '12px',
                    fontSize: '15px',
                    color: 'black', // 🖤 Legend text
                    fontWeight: '500',
                }}
            >
                <span style={{ marginRight: '15px' }}>🟩 Normal</span>
                <span style={{ marginRight: '15px' }}>🟨 Moderate</span>
                <span>🟥 Severe</span>
            </div>
        </div>
    );
};

export default ResultsGraph;
