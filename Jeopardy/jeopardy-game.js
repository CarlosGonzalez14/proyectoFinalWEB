const { ipcRenderer } = require('electron'); 

const cards = document.querySelectorAll('.card-container');
const rowElement = document.querySelector('.row');
const cardSpacing = 2; 

function recalculateCardSizes() {
  const rowWidth = rowElement.offsetWidth;
  const rowHeight = rowElement.offsetHeight;

  const cardWidth = rowWidth / 6 - cardSpacing;
  const cardHeight = rowHeight / 6 - cardSpacing;

  cards.forEach((card, index) => {
    const row = Math.floor(index / 6);
    const col = index % 6;

    const left = (cardWidth + cardSpacing) * col;
    const top = (cardHeight + cardSpacing) * row;

    card.style.width = `${cardWidth}px`;
    card.style.height = `${cardHeight}px`;
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;

    card.dataset.originalLeft = `${left}px`;
    card.dataset.originalTop = `${top}px`;

    if (card.classList.contains('hover')) {
      card.style.width = `${rowWidth}px`;
      card.style.height = `${rowHeight}px`;
    }
  });
}

const resizeObserver = new ResizeObserver(() => {
  recalculateCardSizes();
});

resizeObserver.observe(rowElement);

recalculateCardSizes();

cards.forEach((card, index) => {
  if (index >= 6) {
    card.addEventListener('click', async (event) => {
      if (card.classList.contains('disabled')) return;

      const target = event.target;
      const puntaje = 200 * Math.floor(index / 6);

      if (target.classList.contains('front')) {
        ipcRenderer.send('replace-controls-content');
        ipcRenderer.once('content-replaced', () => {
          ipcRenderer.send('card-clicked', puntaje);
        });
      }

      if (!card.classList.contains('hover')) {
        card.classList.add('hover');
        card.style.left = '0';
        card.style.top = '0';
        card.style.width = `${rowElement.offsetWidth}px`;
        card.style.height = `${rowElement.offsetHeight}px`;
        card.style.zIndex = 999;
      }
    });
  }
});

ipcRenderer.on('finalize-turn', () => {
  const hoveredCards = document.querySelectorAll('.card-container.hover');

  hoveredCards.forEach((cardContainer) => {
    const card = cardContainer.querySelector('.card');
    console.log(card);
    
    const backContent = card.querySelector('.back h2');
    
    const respuesta = card.dataset.respuesta;

    if (respuesta) {
      backContent.textContent = "Respuesta: " + respuesta;
    }

    setTimeout(() => {
      cardContainer.classList.remove('hover');
      cardContainer.classList.add('disabled');
      cardContainer.style.left = cardContainer.dataset.originalLeft;
      cardContainer.style.top = cardContainer.dataset.originalTop;
      cardContainer.style.width = `${rowElement.offsetWidth / 6 - cardSpacing}px`;
      cardContainer.style.height = `${rowElement.offsetHeight / 6 - cardSpacing}px`;

      setTimeout(() => {
        cardContainer.style.zIndex = '';
      }, 600); 
    }, 2000); 
  });

  ipcRenderer.send('empty-controls-content');
});


document.addEventListener('DOMContentLoaded', async () => {
  const cardsInner = document.querySelectorAll('.card');

  cardsInner.forEach(async (card, index) => {
    const categorias = [
      `Matemáticas básicas`,
      `Ingeniería en Sistemas`,
      `Ingeniería Mecatrónica`,
      `Ingeniería Biomédica`,
      `Ingeniería Civil`,
      `Ingeniería Industrial`
    ];
    const puntaje = 200 * Math.floor(index / 6);

    try {
      const categoria = categorias[index % 6];
      console.log(`Obteniendo datos para categoría "${categoria}", puntaje ${puntaje}`);

      const { pregunta, respuesta } = await ipcRenderer.invoke('obtener-pregunta', categoria, puntaje);

      if (pregunta && respuesta) {
        card.querySelector('.back h2').textContent = pregunta; 
        card.dataset.respuesta = respuesta;
        console.log(card);
      }
    } catch (error) {
      console.error('Error obteniendo los datos desde el renderer:', error);
    }
  });
});

ipcRenderer.on('update-team-score', (event, { teamKey, score }) => {
  const scoreElement = document.querySelector(`.score.${teamKey}`);
  if (scoreElement) {
    scoreElement.textContent = score.toString(); 
  }
});
