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

// Register the components you need from Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ResultsGraph = ({ data }) => {
    // Define the order of classes
    const classOrder = ['Normal', 'Moderate', 'Severe'];

    // Map the backend data to the format Chart.js expects
    const chartData = {
        labels: data.map(item => item.fileName), // Image names on the x-axis
        datasets: [{
            label: 'Predicted Severity',
            data: data.map(item => item.predictedClass), // The class names for the y-axis
            backgroundColor: data.map(item => {
                if (item.predictedClass === 'Severe') return 'rgba(255, 99, 132, 0.6)';
                if (item.predictedClass === 'Moderate') return 'rgba(255, 206, 86, 0.6)';
                return 'rgba(75, 192, 192, 0.6)';
            }),
            borderColor: data.map(item => {
                if (item.predictedClass === 'Severe') return 'rgba(255, 99, 132, 1)';
                if (item.predictedClass === 'Moderate') return 'rgba(255, 206, 86, 1)';
                return 'rgba(75, 192, 192, 1)';
            }),
            borderWidth: 1,
        }, ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Hide legend as colors are self-explanatory
            },
            title: {
                display: true,
                text: 'Rutting Severity for Each Image',
            },
        },
        scales: {
            y: {
                type: 'category',
                labels: classOrder, // Set the y-axis to be categorical with a defined order
                title: {
                    display: true,
                    text: 'Predicted Severity',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Image File',
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default ResultsGraph;