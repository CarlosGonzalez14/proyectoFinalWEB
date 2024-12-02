const { ipcRenderer } = require('electron'); 

document.addEventListener('DOMContentLoaded', async () => {
    const questionText = document.querySelector('#question');

      try {
        const id_pregunta = 4;
  
        const { pregunta } = await ipcRenderer.invoke('obtener-pregunta-100-leones', id_pregunta);
  
        if (pregunta) {
            questionText.textContent = pregunta; 
        }
      } catch (error) {
        console.error('Error obteniendo los datos desde el renderer:', error);
      }
});