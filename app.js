const express = require('express');
const app = express();
const path = require('path');

var game = {
    currentPlayer: 0,
    board: [
        '#','#','#',
        '#','#','#',
        '#','#','#',
    ],
    won: false,
}
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

const isWinner = (player) => {
    return winConditions.some( (line) => {
        return line.every( (pos) => {
            return game.board[pos] === player
        });
    })
}

const makeMove = (player, pos) => {
    if (player == game.currentPlayer && game.board[pos] == '#') {
        game.board[pos] = game.currentPlayer.toString()
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

app.get('/', function(req, res) {
    if (req.query.move && !game.winner) {
        makeMove(parseInt(req.query.move.slice(0, 1)), parseInt(req.query.move.slice(1, 2)))
    } else if (req.query.reset != null) {
        game.board = Array(9).fill('#')
        game.winner = false;
        game.currentPlayer = 0;
    }
    res.sendFile(path.join(__dirname + '/template/index.html'));
});
app.get('/gameInfo', (_, res) => res.json(game));
app.use("/static", express.static('./static/'));

app.listen(42069);