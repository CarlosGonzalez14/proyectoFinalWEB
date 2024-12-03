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

ipcRenderer.on('dar-puntos', (event, team) => {
    const mainScoreboard = document.querySelector('.main-score');
    const greenScoreboard = document.querySelector('.green-score');
    const redScoreboard = document.querySelector('.red-score');

    if(team === 'green-team'){
      green_score = parseInt(green_score) + parseInt(main_score);
      greenScoreboard.textContent = green_score.toString();
    }
    else
    {
      red_score = parseInt(red_score) + parseInt(main_score);
      redScoreboard.textContent = red_score.toString();
    }
    main_score= parseInt(0);
    mainScoreboard.textContent = main_score.toString();
});

ipcRenderer.on('visibilizar-error', (event, src) => {
    const errorSpan = document.querySelector('#error-span');
    const errorImg = document.querySelector('#error-img');

    errorSpan.classList.remove('invisible');
    errorImg.src=src;
    setTimeout(() => {
      errorSpan.classList.add('invisible');
    }, 2000);
});

ipcRenderer.on('visibilizar-anuncio', (event, msg) => {
  console.log("MSG")
    const anuncioSpan = document.querySelector('#announcement-span');
    const anuncioMsg = document.querySelector('#announcement-text');

    anuncioSpan.classList.remove('invisible');
    console.log(anuncioMsg.textContent);
    console.log(msg);
    anuncioMsg.textContent=msg;
    console.log(anuncioMsg);
    setTimeout(() => {
      anuncioSpan.classList.add('invisible');
    }, 4000);
});

ipcRenderer.on('terminar-partida', async () => {
  const mainScoreboard = document.querySelector('.main-score');

  main_score= 0;
  mainScoreboard.textContent = main_score.toString();

  await reiniciarTablero();
});