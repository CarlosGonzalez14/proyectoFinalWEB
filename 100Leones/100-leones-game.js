const { count } = require('console');
const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', async () => {
  const questionText = document.querySelector('#question');
  const answerBoxes = document.querySelectorAll('.answer-box'); 

  try {
    const idPregunta = 5;
    const { pregunta, respuestas } = await ipcRenderer.invoke('obtener-datos-100-leones', idPregunta);

    console.log('Datos recibidos en renderer:', { pregunta, respuestas });
    if (pregunta) {
      questionText.textContent = pregunta.pregunta; 
    }
    if(respuestas){
        answerBoxes.forEach((answerBox, index) => {
            if(respuestas[index]) {
                const answerTextBox = answerBox.querySelector('.answer-text');
                const answerPointsBox = answerBox.querySelector('.answer-points');
    
                answerTextBox.textContent = respuestas[index].respuesta;
                answerPointsBox.textContent = respuestas[index].puntaje;
            }
            else {
                answerBox.classList.add('invisible');
            }
        });
    }
  } catch (error) {
    console.error('Error obteniendo los datos desde el renderer:', error);
  }
});
