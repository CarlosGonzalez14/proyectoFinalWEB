const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const { ipcMain } = require('electron');
const { obtenerPregunta } = require('./app');

let mainMenuWindow;
let mainJeopardyWindow, controlsJeopardyWindow;
let main100LeonesWindow, controls100LeonesWindow;

function createMenu() {
  mainMenuWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true 
    }
  });

  mainMenuWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/MenuPrincipal/menu-principal.html'),
    protocol: 'file',
    slashes: true
  }));

  mainMenuWindow.on('closed', () => {
    win = null;
  });
}

function createJeopardy() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  mainJeopardyWindow = new BrowserWindow({
    x: 0, 
    y: 0,
    width: Math.floor(width * 0.75),
    height: height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  mainJeopardyWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/jeopardy/jeopardy-game.html'),
    protocol: 'file',
    slashes: true
  }));

  mainJeopardyWindow.on('closed', () => {
    mainJeopardyWindow = null;
    if (controlsJeopardyWindow) {
      controlsJeopardyWindow.close();
    }
    createMenu();
  });

  controlsJeopardyWindow = new BrowserWindow({
    x: Math.floor(width * 0.75), 
    y: 0,
    width: Math.floor(width * 0.25),
    height: height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  controlsJeopardyWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/jeopardy/jeopardy-controls.html'),
    protocol: 'file',
    slashes: true
  }));

  controlsJeopardyWindow.on('closed', () => {
    controlsJeopardyWindow = null;
    if (mainJeopardyWindow) {
      mainJeopardyWindow.close();
    }
  });
}

function create100Leones() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  main100LeonesWindow = new BrowserWindow({
    x: 0, 
    y: 0,
    width: Math.floor(width * 0.75),
    height: height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  main100LeonesWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/100Leones/100-leones-game.html'),
    protocol: 'file',
    slashes: true
  }));

  main100LeonesWindow.on('closed', () => {
    main100LeonesWindow = null;
    if (controls100LeonesWindow) {
      controls100LeonesWindow.close();
    }
    createMenu();
  });

  controls100LeonesWindow = new BrowserWindow({
    x: Math.floor(width * 0.75), 
    y: 0,
    width: Math.floor(width * 0.25),
    height: height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  controls100LeonesWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/100Leones/100-leones-controls.html'),
    protocol: 'file',
    slashes: true
  }));

  controls100LeonesWindow.on('closed', () => {
    controls100LeonesWindow = null;
    if (main100LeonesWindow) {
      main100LeonesWindow.close();
    }
  });
}

app.on('ready', createMenu);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createMenu();
  }
});

ipcMain.on('launch-jeopardy', () => {
  if (!mainJeopardyWindow && !controlsJeopardyWindow) {
    createJeopardy();
  } else if (mainJeopardyWindow) {
    mainJeopardyWindow.focus();
  }
  mainMenuWindow.close();
});

ipcMain.on('launch-100-leones', () => {
  if (!mainJeopardyWindow && !controlsJeopardyWindow) {
    create100Leones();
  } else if (main100LeonesWindow) {
    main100LeonesWindow.focus();
  }
  mainMenuWindow.close();
});

ipcMain.handle('obtener-pregunta', async (event, categoria, puntaje) => {
  try {
    const pregunta = await obtenerPregunta(categoria, puntaje);
    return pregunta;
  } catch (error) {
    console.error('Error obteniendo pregunta:', error);
    throw error;
  }
});
