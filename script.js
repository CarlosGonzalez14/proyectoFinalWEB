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
      card.addEventListener('click', () => {
        if (!card.classList.contains('hover')) {
          card.classList.add('hover');
          card.style.left = '0';
          card.style.top = '0';
          card.style.width = `${rowElement.offsetWidth}px`;
          card.style.height = `${rowElement.offsetHeight}px`;
          card.style.zIndex = 999;
        } else {
          card.classList.remove('hover');
          card.style.left = card.dataset.originalLeft;
          card.style.top = card.dataset.originalTop;
          card.style.width = `${rowElement.offsetWidth / 6 - cardSpacing}px`;
          card.style.height = `${rowElement.offsetHeight / 6 - cardSpacing}px`;
  
          setTimeout(() => {
            card.style.zIndex = '';
          }, 600);
        }
      });
    }
  });
  
