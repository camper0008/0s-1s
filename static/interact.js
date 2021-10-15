// @ts-nocheck

const display = async () => {
    const blankBoard = '┌───┬───┬───┐' + '\n'
                     + '│ @ │ @ │ @ │' + '\n'
                     + '├───┼───┼───┤' + '\n'
                     + '│ @ │ @ │ @ │' + '\n'
                     + '├───┼───┼───┤' + '\n'
                     + '│ @ │ @ │ @ │' + '\n'
                     + '└───┴───┴───┘' + '\n'
    
    let newString = blankBoard;
    
    const data = await (await fetch('/info')).json();
    for (i = 0; i < data.board.length; ++i) {
        if (data.board[i] === '#') {
            newString = newString.replace('@', `<button class="board_button" id="button_${i}">#</button>`)
        } else {
            newString = newString.replace('@', data.board[i]);
        }
    }

    const board = document.getElementById('board');
    board.innerHTML = newString;

    requestAnimationFrame(() => {
        const buttons = document.getElementsByClassName('board_button');
        for (let i = 0; i < buttons.length; ++i) {
            buttons[i].addEventListener('click', async () => {
                const currentPlayer = document.getElementById('player');
                fetch(`/move?player=${currentPlayer.value}&move=${buttons[i].id.slice('-1')}`)
            })
        }
    })
}


const main = () => {
    const playerInput = document.getElementById('player');
    playerInput.addEventListener('blur', async () => {
        playerInput.value = playerInput.value.replace(/[^01]+/g, '').slice(0,1);
    })

    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', async () => {
        await fetch('/reset');
    })

    display();
    setInterval(display, 1000);
}

main();