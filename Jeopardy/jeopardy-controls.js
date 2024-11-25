export function handleButtonClick(button) {
    const parent = button.parentElement;

    if (parent && parent.classList.contains('select-section')) {
        const siblings = parent.querySelectorAll('.button-section');
        
        siblings.forEach((sibling) => {
            const isCorrect = button.classList.contains('correct-answer');
            let teamClass;
            if(isCorrect)
            {
                teamClass = button.querySelector('svg').classList[0];
                console.log(button.classList[0]);
                console.log(isCorrect);
                console.log(teamClass);
            }
            else
            {
                const svg1 = button.querySelector('svg');
                if(svg1){
                    teamClass = svg1.querySelector('g.team-blue, g.team-red, g.team-green').classList[0];
                    console.log(button.classList[0]);
                    console.log(isCorrect);
                    console.log(teamClass);
                }
            }
            //Event preventDefault
            console.log();
            ipcRenderer.send('update-score', { isCorrect, teamClass });

            const svg = sibling.querySelector('svg');
            if (svg) {
                const group = svg.querySelector('g.team-blue, g.team-red, g.team-green');
                if (group) {
                    group.classList.remove('team-blue', 'team-red', 'team-green');
                    group.classList.add('button-deactivated');
                }
                svg.classList.remove('team-blue', 'team-red', 'team-green');
                svg.classList.add('button-deactivated');
            }

            const text = sibling.querySelector('h3');
            if (text) {
                text.style.color = '#ccc';
            }
        });
    }
}
