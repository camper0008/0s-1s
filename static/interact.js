const blankBoard = `┌───┬───┬───┐
│ # │ # │ # │
├───┼───┼───┤
│ # │ # │ # │
├───┼───┼───┤
│ # │ # │ # │
└───┴───┴───┘`

let display = () => {
    $.get('/gameInfo').done((data) => {
        let newString = '';
        let current = 0;
        for (let i = 0; i < blankBoard.length; i++) {
            let char = blankBoard.slice(i, i + 1)
            if (char == '#') {
                newString += `<button index='${current}' taken='${data.board[current]}'>${data.board[current]}</button>`
                current++;
            } else {
                newString += char
            }
        }
        $("#board").html(newString)

        $('#board button').unbind('click')
        if (data.winner) {
            $('#msg').text(`${data.winner} won! Game over.`);
        }
        else {
            $('#msg').text('');

            $('#board button[taken*=\'#\']').each((_, obj) => {
                $(obj).click(() => {
                    let player = $('#player').val() == '1' ? 1 : 0
                    if (player == data.currentPlayer) {
                        $.get(`/?move=${player}${$(obj).attr('index')}`);
                        display();
                    }
                })
            })
            $('#turn').text('Player turn: ' + data.currentPlayer);         
        };
    });
}
display();
$('#refresh').click(display);
setInterval(display, 2500);

$('#reset').click( () => {
    $.get('/?reset')
    display();
});

$('#player').blur( () => {
    $('#player').val($('#player').val().replace(/[^01]+/g, ''))
    $('#player').val($('#player').val().slice(0,1))
});