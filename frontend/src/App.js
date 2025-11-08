import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ResultsGraph from './ResultsGraph';
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import './App.css';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [predictionData, setPredictionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const graphRef = useRef(null);

  // Webcam states
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  // For naming captured images sequentially
  const [captureCount, setCaptureCount] = useState(0);

  useEffect(() => {
    if (!cameraOpen) {
      // Stop camera stream when closing
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      return;
    }

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
      } catch (err) {
        console.error("Error accessing webcam: ", err);
        setError("Could not access the camera. Please check permissions.");
        setCameraOpen(false);
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraOpen]);

  const handleFileChange = (event) => {
  const filesArray = Array.from(event.target.files);
  setSelectedFiles(filesArray);  // Replace old images with new selection
  setPredictionData(null);
  setError('');
};

  const handleCapture = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (blob) {
        // Increment captureCount to name files sequentially like 1.png, 2.png, ...
        const newCount = captureCount + 1;
        setCaptureCount(newCount);

        const capturedFile = new File([blob], `${newCount}.png`, { type: 'image/png' });
        setSelectedFiles(prev => [...prev, capturedFile]);
      }
    }, 'image/png');
  };

  const handlePredictClick = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select or capture one or more images.');
      return;
    }

    setIsLoading(true);
    setError('');
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://127.0.0.1:8000/predict/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPredictionData(response.data.results);
    } catch (err) {
      setError('Failed to get prediction. Is the backend server running?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadGraph = () => {
    if (!graphRef.current) return;
    const canvas = graphRef.current.querySelector('canvas');
    if (!canvas) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const ctx = exportCanvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    ctx.drawImage(canvas, 0, 0);

    const currentDate = new Date().toLocaleDateString();
    ctx.fillStyle = 'black';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Date: ${currentDate}`, exportCanvas.width - 20, exportCanvas.height - 20);

    if (startLocation || endLocation) {
      ctx.textAlign = 'left';
      ctx.font = '14px Arial';
      ctx.fillText(
        `From ${startLocation || 'Start'} → ${endLocation || 'End'}`,
        20,
        exportCanvas.height - 20
      );
    }

    const link = document.createElement('a');
    link.download = `Rutting_Graph_${startLocation || 'Start'}_${endLocation || 'End'}_${currentDate}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  const handleRemoveImage = (index) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src="/IITI.png" alt="IIT Indore Logo" className="logo" />
        <div className="header-text">
          <h1>🛣️ Pavement Rutting Prediction</h1>
          <p>Upload or capture images to predict the severity of rutting.</p>
        </div>
      </header>

      <main>
        <div className="uploader-container">
          {/* File upload */}
          <div className="file-upload-section">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*"
            />
            {selectedFiles.length > 0 && (
              <p style={{ marginTop: '8px', fontWeight: '500', color: '#333' }}>
                {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Camera toggle */}
          {!cameraOpen && (
            <button
              onClick={() => setCameraOpen(true)}
              style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
            >
              📷 Open Camera
            </button>
          )}

          {/* Webcam preview and capture controls */}
          {cameraOpen && (
            <div className="webcam-section" style={{ marginTop: '20px' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '320px', height: '240px', borderRadius: '10px', border: '2px solid #90caf9' }}
              />
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={handleCapture}
                  style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}
                >
                  📸 Capture Image
                </button>
                <button
                  onClick={() => setCameraOpen(false)}
                  style={{ padding: '10px 20px', cursor: 'pointer' }}
                >
                  ✖ Close Camera
                </button>
              </div>
            </div>
          )}

          {/* Show thumbnails + remove button */}
          {selectedFiles.length > 0 && (
            <div
              className={`selected-images ${selectedFiles.length > 8 ? 'shrink' : ''}`}
              style={{
                marginTop: '15px',
                display: 'flex',
                flexWrap: 'nowrap',
                gap: '10px',
                maxWidth: '100%',
                overflowX: 'auto',
                paddingBottom: '10px',
                borderBottom: '1px solid #ddd'
              }}
            >
              {selectedFiles.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img
                      src={url}
                      alt={`selected ${idx}`}
                      style={{
                        width: selectedFiles.length > 8 ? 50 : 80,
                        height: selectedFiles.length > 8 ? 50 : 80,
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        transition: 'width 0.3s ease, height 0.3s ease'
                      }}
                    />
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: 'black',
                        border: 'none',
                        borderRadius: '50%',
                        color: 'white',
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        lineHeight: '18px',
                        padding: 0,
                        userSelect: 'none',
                      }}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Location inputs */}
          <div className="location-inputs" style={{ marginTop: '25px' }}>
            <input
              type="text"
              placeholder="Start Location"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
            />
            <input
              type="text"
              placeholder="End Location"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
            />
          </div>

          {/* Predict button */}
          <button onClick={handlePredictClick} disabled={isLoading} style={{ marginTop: '25px' }}>
            {isLoading ? 'Analyzing...' : 'Predict Severity'}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        {predictionData && (
          <>
            <div className="results-container" ref={graphRef}>
              <h2>📊 Prediction Results</h2>
              <ResultsGraph
                data={predictionData}
                startLocation={startLocation}
                endLocation={endLocation}
              />
            </div>

            <div style={{ textAlign: "center", marginTop: "55px", marginBottom: "30px" }}>
              <button className="download-btn" onClick={handleDownloadGraph}>
                ⬇️ Download Graph
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="App-footer">
        <p>© 2025 All Rights Reserved</p>
        <p>
          Developed by <strong> Vishal </strong>under the guidance of <strong>Dr. Ramu Baadiga</strong>
        </p>
        <p>
          <FaEnvelope style={{ color: "white", marginRight: "5px" }} />
          <span style={{ color: "black" }}>ce220004050@gmail.com</span> |
          <FaPhoneAlt style={{ color: "white", marginLeft: "10px", marginRight: "5px" }} />
          <span style={{ color: "black" }}>+91 8650212801</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
