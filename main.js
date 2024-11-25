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
    pathname: path.join(__dirname, '/jeopardy/jeopardy-controls-empty.html'),
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

let scores = {
  'team-one': 0,
  'team-two': 0,
  'team-three': 0,
};

ipcMain.on('update-score', (event, { isCorrect, teamClass }) => {
  const teamMap = {
    'team-blue': 'team-one',
    'team-red': 'team-two',
    'team-green': 'team-three',
  };

  const teamKey = teamMap[teamClass];
  const puntaje = currentPuntaje/2 || 0; 

  if (teamKey && mainJeopardyWindow) {
    const delta = isCorrect ? puntaje : -puntaje;
    
    scores[teamKey] += delta;
    console.log('puntaje' + scores[teamKey]);

    mainJeopardyWindow.webContents.send('update-team-score', { teamKey, score: scores[teamKey] });
  }
});

ipcMain.on('card-clicked', (event, puntaje) => {
  currentPuntaje = puntaje || 0;
  if (controlsJeopardyWindow) {
    controlsJeopardyWindow.webContents.send('update-puntaje', puntaje);
  }
});

ipcMain.on('replace-controls-content', () => {
  if (controlsJeopardyWindow) {
    const newContentPath = path.join(__dirname, '/jeopardy/jeopardy-controls.html');
    controlsJeopardyWindow.loadURL(url.format({
      pathname: newContentPath,
      protocol: 'file',
      slashes: true,
    }));
    controlsJeopardyWindow.webContents.once('did-finish-load', () => {
      mainJeopardyWindow.webContents.send('content-replaced');
    });
  }
});

ipcMain.on('empty-controls-content', () => {
  if (controlsJeopardyWindow) {
    const newContentPath = path.join(__dirname, '/jeopardy/jeopardy-controls-empty.html');
    controlsJeopardyWindow.loadURL(url.format({
      pathname: newContentPath,
      protocol: 'file',
      slashes: true,
    }));
  }
});

ipcMain.on('finalize-turn', () => {
  if (mainJeopardyWindow) {
    mainJeopardyWindow.webContents.send('finalize-turn');
  }
});
