const { ipcRenderer } = require('electron');

let idPregunta = 10; 

document.addEventListener('DOMContentLoaded', async () => {
  await reiniciarControles();
});

async function reiniciarControles() {
  const sectionContainers = document.querySelectorAll('.section-container');
    
  try {
    const { respuestas } = await ipcRenderer.invoke('obtener-datos-100-leones', idPregunta);

    if(respuestas){
          console.log(respuestas);
          sectionContainers.forEach((sectionContainer, index) => {
              if(respuestas[index]) {
                  sectionContainer.classList.remove('intangible');
                  const answerContainer = sectionContainer.querySelector('.answer-container');
                  const scoreContainer = sectionContainer.querySelector('.score-container');
                  const button = sectionContainer.querySelector('.button-pushable');

                  answerContainer.textContent = respuestas[index].respuesta;
                  scoreContainer.textContent = respuestas[index].puntaje;

                  // button.classList.remove('pressed');
                  button.removeAttribute('disabled');
                  
                  button.dataset.id_button = index;
                  button.dataset.id_respuesta = respuestas[index].id_respuesta;
                  button.dataset.puntaje = respuestas[index].puntaje;
                  
              }
              else {
                  sectionContainer.classList.add('intangible');
              }
          });
      }
      ++idPregunta;
  } catch (error) {
    console.error('Error obteniendo las respuestas desde el renderer:', error);
  }
}

export function showAnswer(button) {
   ipcRenderer.send('revelar-respuesta', button.dataset.id_respuesta, button.dataset.puntaje);
   button.classList.add('pressed');
   button.setAttribute('disabled', 'true');
}

window.showAnswer = showAnswer;

export function nextStage(button, isIncorrectAnswer){
  if(first_answer)first_answer=false;
  else if(second_answer)second_answer=false;

  ++current_stage;
  const buttonTextContainer = button.querySelector('.button-front');
  buttonTextContainer.textContent = errorButtonTexts[current_stage];
  console.log(current_stage);
  if(current_stage < 3 || current_stage > 4){
    if(isIncorrectAnswer){
      setNextTeam();
    }
  }
}

window.nextStage = nextStage;

export function endMatch(){
  reiniciarControles();
  ipcRenderer.send('terminar-partida');
}

window.endMatch = endMatch;