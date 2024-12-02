const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', async () => {
    const sectionContainers = document.querySelectorAll('.section-container');
    // const answerContainers = document.querySelectorAll('.answer-container');
    // const scoreContainers = document.querySelectorAll('.score-container');
    
    try {
      const idPregunta = 5; 
      const { respuestas } = await ipcRenderer.invoke('obtener-datos-100-leones', idPregunta);
  
      if(respuestas){
            sectionContainers.forEach((sectionContainer, index) => {
                if(respuestas[index]) {
                    const answerContainer = sectionContainer.querySelector('.answer-container');
                    const scoreContainer = sectionContainer.querySelector('.score-container');
        
                    answerContainer.textContent = respuestas[index].respuesta;
                    scoreContainer.textContent = respuestas[index].puntaje;
                }
                else {
                    sectionContainer.classList.add('invisible');
                }
            });
        }
    } catch (error) {
      console.error('Error obteniendo las respuestas desde el renderer:', error);
    }
  });