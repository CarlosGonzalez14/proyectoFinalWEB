const { count } = require('console');
const { ipcRenderer } = require('electron');

let idPregunta = 10;

document.addEventListener('DOMContentLoaded', async () => {
  await reiniciarTablero();
});

async function reiniciarTablero() {
  const questionText = document.querySelector('#question');
  const answerBoxes = document.querySelectorAll('.answer-box');

  try {
    const { pregunta, respuestas } = await ipcRenderer.invoke('obtener-datos-100-leones', idPregunta);

    console.log('Datos recibidos en renderer:', { pregunta, respuestas });

    if (pregunta) {
      questionText.textContent = pregunta.pregunta; 
    }

    if (respuestas) {
      answerBoxes.forEach((answerBox, index) => {
        const answerHidden = answerBox.querySelector('.answer-hidden');
        answerHidden.classList.remove('visible');

        if (respuestas[index]) {
          answerBox.classList.remove('invisible');
          const answerTextBox = answerBox.querySelector('.answer-text');
          const answerPointsBox = answerBox.querySelector('.answer-points');

          answerTextBox.textContent = respuestas[index].respuesta;
          answerPointsBox.textContent = respuestas[index].puntaje;
          answerHidden.classList.remove('visible');
          answerHidden.id = "answer-hidden-" + respuestas[index].id_respuesta;
        } else {
          answerBox.classList.add('invisible');
        }
      });
    }

    ++idPregunta;
  } catch (error) {
    console.error('Error obteniendo los datos desde el renderer:', error);
  }
}

var main_score = 0, green_score = 0, red_score = 0;

ipcRenderer.on('visibilizar-respuesta', (event, id_respuesta, puntaje) => {
    const answerHidden = document.querySelector('#answer-hidden-'+id_respuesta);
    const mainScoreboard = document.querySelector('.main-score');

    answerHidden.classList.add('visible');
    
    main_score= parseInt(main_score) + parseInt(puntaje);
    mainScoreboard.textContent = main_score.toString();
});

ipcRenderer.on('terminar-partida', async () => {
  const mainScoreboard = document.querySelector('.main-score');

  main_score= 0;
  mainScoreboard.textContent = main_score.toString();

  await reiniciarTablero();
});