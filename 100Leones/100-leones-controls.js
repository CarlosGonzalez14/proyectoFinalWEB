const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', async () => {
    const sectionContainers = document.querySelectorAll('.section-container');
    
    try {
      const idPregunta = 5; 
      const { respuestas } = await ipcRenderer.invoke('obtener-datos-100-leones', idPregunta);
  
      if(respuestas){
            console.log(respuestas);
            sectionContainers.forEach((sectionContainer, index) => {
                if(respuestas[index]) {
                    const answerContainer = sectionContainer.querySelector('.answer-container');
                    const scoreContainer = sectionContainer.querySelector('.score-container');
                    const button = sectionContainer.querySelector('.button-pushable');
        
                    answerContainer.textContent = respuestas[index].respuesta;
                    scoreContainer.textContent = respuestas[index].puntaje;

                    button.dataset.id_respuesta = respuestas[index].id_respuesta;
                    button.dataset.puntaje = respuestas[index].puntaje;
                }
                else {
                    sectionContainer.classList.add('intangible');
                }
            });
        }
    } catch (error) {
      console.error('Error obteniendo las respuestas desde el renderer:', error);
    }
  });

export function showAnswer(button) {
   console.log(button.dataset); 
   ipcRenderer.send('revelar-respuesta', button.dataset.id_respuesta, button.dataset.puntaje);
}

window.showAnswer = showAnswer;