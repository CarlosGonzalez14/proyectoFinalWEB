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

    if (respuestas) {
      respuestas.forEach((respuesta, index) => {
        if (answerBoxes[index]) {
          const answerTextBox = answerBoxes[index].querySelector('.answer-text');
          const answerPointsBox = answerBoxes[index].querySelector('.answer-points');

          if (answerTextBox) answerTextBox.textContent = respuesta.respuesta; 
          if (answerPointsBox) answerPointsBox.textContent = respuesta.puntaje; 
        }
      });
    }
  } catch (error) {
    console.error('Error obteniendo los datos desde el renderer:', error);
  }
});
