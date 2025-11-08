import React, { useState } from 'react';
import axios from 'axios';
import ResultsGraph from './ResultsGraph'; // We will create this component next
import './App.css';

function App() {
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [predictionData, setPredictionData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
        setPredictionData(null); // Reset previous results
        setError('');
    };

    const handlePredictClick = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            setError('Please select one or more image files.');
            return;
        }

        setIsLoading(true);
        setError('');
        const formData = new FormData();
        // Append all files to the FormData object
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
        }

        try {
            // Send request to your FastAPI backend
            const response = await axios.post('http://127.0.0.1:8000/predict/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setPredictionData(response.data.results);
        } catch (err) {
            setError('Failed to get prediction. Is the backend server running?');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
           <header className="App-header">
    <img src="/IITI.png" alt="IIT Indore Logo" className="logo" />
    <h1>🛣️ Pavement Rutting Prediction</h1>
    <p>Upload images to predict the severity of rutting.</p>
     </header>

            <main>
                <div className="uploader-container">
                    <input type="file" multiple onChange={handleFileChange} accept="image/*" />
                    <button onClick={handlePredictClick} disabled={isLoading}>
                        {isLoading ? 'Analyzing...' : 'Predict Severity'}
                    </button>
                </div>

                {error && <p className="error-message">{error}</p>}
                
                {predictionData && (
                    <div className="results-container">
                        <h2>📊 Prediction Results</h2>
                        <ResultsGraph data={predictionData} />
                    </div>
                )}
            </main>
            <footer className="App-footer">
  <p>© 2025 All Rights Reserved | Developed by <strong>Vishal</strong> & <strong>Dr. Ramu Baadiga</strong></p>
</footer>

        </div>
        
    );
}

export default App;