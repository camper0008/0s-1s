const express = require('express');
const path = require('path');
const ws = require("ws");
const winConditions = [
    //row
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //column
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //diagonal
    [0, 4, 8],
    [2, 4, 6],
]

const isWinner = (game, player) => {
    return winConditions.some( (line) => {
        return line.every( (pos) => {
            return game.board[pos] === player
        });
    })
}
const makeMove = (game, player, move) => {
    if (player == game.currentPlayer && game.board[move] == '#') {
        game.board[move] = game.currentPlayer.toString()
        game.currentPlayer++;
        game.currentPlayer%=2;

        if (isWinner('0'))
            game.winner = "Player 0";
        if (isWinner('1'))
            game.winner = "Player 1";
        if (!game.winner && game.board.every((pos) => pos != '#' ))
            game.winner = "Nobody"
    }
}

const reset = (game) => {
    game.board = Array(9).fill('#')
    game.winner = false;
    game.currentPlayer = 0;
}

const parseData = (game, socket, chunk) => {
    try {
        const str = chunk.toString('utf-8');
        const json = JSON.parse(str);

        switch (json.action) {
            case "reset":
                reset(game);
                break;
            case "move":
                makeMove(game, json.player, json.move)
                break;
        }
    } catch (err) {}

    return socket.send(JSON.stringify(game));
}

const main = () => {
    const game = {
        currentPlayer: 0,
        board: Array(9).fill('#'),
        won: false,
    }    
    
    const app = express();

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname + '/template/index.html'));
    });
    
    app.use("/static", express.static('./static/'));

    const wsServer = new ws.Server({ noServer: true });
    wsServer.on('connection', socket => socket.on('message', chunk => parseData(game, socket, chunk)));
    
    const server = app.listen(5000);
    server.on('upgrade', (request, socket, head) => {
        wsServer.handleUpgrade(request, socket, head, socket => {
            wsServer.emit('connection', socket, request);
        });
    });
}

main();