/*
  This file is your MAIN PROCESS (your Node.js backend).
  It starts your Python server and creates the browser window.
*/

const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process'); // Import spawn

// --- Python Backend Process ---
let pythonProcess = null;

function startPythonBackend() {
  console.log('Starting Python backend...');
  
  // Use 'main.exe' on Windows, 'main' on macOS/Linux
  const executable = process.platform === 'win32' ? 'main.exe' : 'main';
  const backendPath = path.join(__dirname, 'python-server', executable);

  console.log(`Attempting to spawn: ${backendPath}`);

  try {
    // Make sure your my_model.h5 and any other needed files
    // are in the same directory as the executable (or handled by PyInstaller's spec)
    pythonProcess = spawn(backendPath);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python Backend (stdout): ${data}`);
      // Watch for the line that says your Flask/FastAPI server is running
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Backend (stderr): ${data}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python backend process exited with code ${code}`);
    });

    pythonProcess.on('error', (err) => {
      console.error('Failed to start Python backend:', err);
    });

  } catch (err) {
     console.error('Error spawning Python process:', err);
  }
}

// --- ML Model Loading (Path A) ---
// (We are using Path B - this is not needed)
// ---------------------------------


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // preload.js is the bridge between Node.js and React
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Recommended for security
      nodeIntegration: false, // Recommended for security
      // Allow React app (loaded from file://) to fetch from localhost:
      webSecurity: false 
    },
  });

  // --- Load Your React App ---
  // We are building an offline app, so we *always* load from the file system.
  // We no longer need the 'isDev' check for localhost:3000.
  console.log('Loading React app from build folder...');
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'build', 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  // Optional: Open dev tools for debugging
  // mainWindow.webContents.openDevTools();
}

// --- Handle IPC Communication ---
// (This is no longer needed for prediction.
// The React app will 'fetch' the Python server directly.)
// ---------------------------------


// --- Electron App Lifecycle ---

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  startPythonBackend(); // Start Python first
  createWindow();       // Then create the window

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// --- Gracefully kill Python server on quit ---
app.on('will-quit', () => {
  if (pythonProcess) {
    console.log('Killing Python backend process...');
    pythonProcess.kill();
  }
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});