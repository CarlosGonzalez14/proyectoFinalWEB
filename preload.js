const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  obtenerPregunta: (categoria, puntaje) => ipcRenderer.invoke('obtener-pregunta', categoria, puntaje),
});
