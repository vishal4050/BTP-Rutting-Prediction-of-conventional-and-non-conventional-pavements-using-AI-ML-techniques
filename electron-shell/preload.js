/*
  This PRELOAD script is a secure bridge between your
  React App (Renderer) and your Node.js Backend (Main).
  It exposes specific functions from the backend to the frontend.
*/

const { contextBridge, ipcRenderer } = require('electron');

// Expose a 'window.api' object to your React app
contextBridge.exposeInMainWorld('api', {
  // You can add other OS-level functions here later, e.g.:
  // openFile: () => ipcRenderer.invoke('dialog:openFile')
  
  // 'runPrediction' is removed because the React app
  // will use 'fetch' to talk to the Python server directly.
  getAppName: () => 'My Offline ML App'
});

console.log('Preload script loaded.');