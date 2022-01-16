// @ts-nocheck

const connect = async () => {
    const socket = new WebSocket('wss://' + window.location.hostname);
    await new Promise((resolve) => {
        socket.addEventListener('open', () => {
            resolve();
            socket.send('');
        });
    })
    socket.addEventListener('message', e => {
        const data = JSON.parse(e.data);
        console.log(data);
        if (!data.error) {
            display(data, socket);
        } else {
            console.error('Error: ' + data.error);
        }
    });
    socket.addEventListener('close', e => {
        if (e.wasClean) {
            alert(`websocket closed, code=${e.code} reason=${e.reason}`);
        } else {
            alert(`websocket closed`);
        }
    });
    socket.addEventListener('error', err => {
        console.error(err.message);
    });

    return socket;
}

const display = async (data, socket) => {
    const blankBoard = '┌───┬───┬───┐' + '\n'
    + '│ @ │ @ │ @ │' + '\n'
    + '├───┼───┼───┤' + '\n'
    + '│ @ │ @ │ @ │' + '\n'
    + '├───┼───┼───┤' + '\n'
    + '│ @ │ @ │ @ │' + '\n'
    + '└───┴───┴───┘' + '\n'
    
    let newString = blankBoard;
    
    const board = data.board;
    for (i = 0; i < board.length; ++i) {
        if (board[i] === '#') {
            newString = newString.replace('@', `<button class="board_button" id="button_${i}">#</button>`)
        } else {
            newString = newString.replace('@', board[i]);
        }
    }

    const message = document.getElementById('msg')
    if (data.winner) {
        message.innerText = `${data.winner} won.`
    } else {
        message.innerText = "";
    }

    const boardElement = document.getElementById('board');
    boardElement.innerHTML = newString;

    const turn = document.getElementById('turn');
    turn.innerText = `Player turn: ${data.currentPlayer}`;
    requestAnimationFrame(() => {
        const buttons = document.getElementsByClassName('board_button');
        for (let i = 0; i < buttons.length; ++i) {
            buttons[i].addEventListener('click', async () => {
                const currentPlayerInput = document.getElementById('player');
                socket.send(JSON.stringify({
                    action: "move",
                    player: parseInt(currentPlayerInput.value),
                    move: parseInt(buttons[i].id.slice(-1)),
                }));
            })
        }
    })
}


const main = async () => {

    const socket = await connect();

    const playerInput = document.getElementById('player');
    playerInput.addEventListener('blur', async () => {
        playerInput.value = (playerInput.value.replace(/[^01]+/g, '') + '0').slice(0,1);
    })

    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', async () => {
        socket.send(JSON.stringify({action: "reset"}))
    })
}

main();