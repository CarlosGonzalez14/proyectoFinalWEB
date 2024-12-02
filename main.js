const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const { ipcMain } = require('electron');
const { obtenerPregunta, obtenerPregunta100Leones, obtenerRespuestas100Leones } = require('./app');

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

ipcMain.on('card-clicked', (event, puntaje, respuesta) => {
  currentPuntaje = puntaje || 0;
  if (controlsJeopardyWindow) {
    controlsJeopardyWindow.webContents.send('update-puntaje', puntaje, respuesta);
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

ipcMain.on('finalize-game', () => {
  const [teamOne, teamTwo, teamThree] = [scores['team-one'], scores['team-two'], scores['team-three']];
  let resultText = '';
  console.log("Puntaje Equipo Azul: " + teamOne);
  console.log("Puntaje Equipo Rojo: " + teamTwo);
  console.log("Puntaje Equipo Verde: " + teamThree);
  
  if (teamOne > teamTwo && teamOne > teamThree) {
    resultText = 'El equipo azul gana';
  } else if (teamTwo > teamOne && teamTwo > teamThree) {
    resultText = 'El equipo rojo gana';
  } else if (teamThree > teamOne && teamThree > teamTwo) {
    resultText = 'El equipo verde gana';
  } else if (teamOne === teamTwo && teamOne > teamThree) {
    resultText = 'Empate entre el equipo rojo y el equipo azul';
  } else if (teamOne === teamThree && teamOne > teamTwo) {
    resultText = 'Empate entre el equipo azul y el equipo verde';
  } else if (teamTwo === teamThree && teamTwo > teamOne) {
    resultText = 'Empate entre el equipo rojo y el equipo verde';
  } else {
    resultText = 'Empate entre los tres equipos';
  }
  
  ipcMain.emit('show-results', null, resultText);
});

ipcMain.on('show-results', (event, resultText) => {
  if (mainJeopardyWindow) {
    const resultsPath = path.join(__dirname, '/jeopardy/jeopardy-results.html');
    mainJeopardyWindow.loadURL(url.format({
      pathname: resultsPath,
      protocol: 'file',
      slashes: true,
    }));

    mainJeopardyWindow.webContents.once('did-finish-load', () => {
      mainJeopardyWindow.webContents.send('update-results', resultText);
    });
  }
});

ipcMain.on('restart-game', (event) => {
  if (mainJeopardyWindow) {
    const resultsPath = path.join(__dirname, '/jeopardy/jeopardy-game.html');
    mainJeopardyWindow.loadURL(url.format({
      pathname: resultsPath,
      protocol: 'file',
      slashes: true,
    }));
  }
  scores['team-one']=0;
  scores['team-two']=0;
  scores['team-three']=0;
});

ipcMain.handle('obtener-datos-100-leones', async (event, idPregunta) => {
  try {
    const pregunta = await obtenerPregunta100Leones(idPregunta);
    const respuestas = await obtenerRespuestas100Leones(idPregunta);

    if (!pregunta || !respuestas || respuestas.length === 0) {
      throw new Error(`No se encontraron datos para la pregunta con el ID ${idPregunta}`);
    }

    return { pregunta, respuestas };
  } catch (error) {
    console.error(`Error obteniendo datos: ${error.message}`);
    throw error;
  }
});

ipcMain.on('revelar-respuesta', (event, id_respuesta, puntaje) => {
  console.log("id_respuesta: ", id_respuesta);
  console.log("puntaje: ", puntaje);
});
