export function handleButtonClick(button) {
  const parent = button.parentElement;

  if (parent && parent.classList.contains('select-section')) {
    const siblings = parent.querySelectorAll('.button-82-pushable');

    if (button.classList.contains('correct-answer')) {
      ipcRenderer.send('finalize-turn'); 
    }

    siblings.forEach((sibling) => {
      const isCorrect = button.classList.contains('correct-answer');
      const teamClass = button.classList.contains('team-blue')
        ? 'team-blue'
        : button.classList.contains('team-red')
        ? 'team-red'
        : 'team-green';

      ipcRenderer.send('update-score', { isCorrect, teamClass });

      sibling.classList.add('pressed');
      sibling.setAttribute('disabled', 'true');
    });

    checkAllSectionsDisabled();
  }
}

function checkAllSectionsDisabled() {
  const sections = document.querySelectorAll('.select-section');
  let allDisabled = true;

  sections.forEach((section) => {
    const buttons = section.querySelectorAll('.button-82-pushable');
    buttons.forEach((button) => {
      if (!button.hasAttribute('disabled')) {
        allDisabled = false;
      }
    });
  });

  if (allDisabled) {
    ipcRenderer.send('finalize-turn'); 
  }
}

export function setupFinalizeTurnButton() {
  const { ipcRenderer } = require('electron');
  ipcRenderer.send('finalize-turn');
}

window.setupFinalizeTurnButton = setupFinalizeTurnButton;