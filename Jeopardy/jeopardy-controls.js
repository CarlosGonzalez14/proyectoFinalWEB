export function handleButtonClick(button) {
    const parent = button.parentElement;
  
    if (parent && parent.classList.contains('select-section')) {
      const siblings = parent.querySelectorAll('.button-82-pushable');
  
      siblings.forEach((sibling) => {
        const isCorrect = button.classList.contains('correct-answer');
        const teamClass = button.classList.contains('team-blue')
          ? 'team-blue'
          : button.classList.contains('team-red')
          ? 'team-red'
          : 'team-green';
  
        ipcRenderer.send('update-score', { isCorrect, teamClass });
  
        // Desactiva todos los botones
        sibling.classList.add('pressed');
      });
    }
  }
  