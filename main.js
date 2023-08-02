'use strict';



function gameBoardFactory() {

    const board = [
        ['X','O','X'],
        ['O','X','O'],
        ['O','O', null],
    ]

    const copyBidiArray = (arr) => {
        return arr.map( el => {
            return [...el];
        })
    }

    const printGameBoard = () => {
        console.log(board);
    }

    const getBoard = () => copyBidiArray(board);

    const addMark = (mark, row, col) => {
        if(
            (board[row][col] !== null) 
            || (row > 2 || row < 0) 
            || (col > 2 || col < 0) 
        ) return false;
        board[row][col] = mark;
        return true;
    }

    return {
        printGameBoard,
        getBoard,
        addMark,
    }

};

function playerFactory(mark) {
    let wins = 0;
    const makeMove = (board, row, col) => {
        const isLegalMove = board.addMark(mark, row, col);
        return isLegalMove;
    }
    const getMark = () => mark;
    const getWins = () => wins;


    return {
        getMark,
        makeMove,
        getWins,
    };
}

const gameController = (function() {

    const board = gameBoardFactory();
    const players = [
        playerFactory('X'),
        playerFactory('O')
    ];

    const printPrivateProps = () => console.log(board,players);

    return {
        printPrivateProps,
        getBoard: board.getBoard,
    }

})();

gameController.printPrivateProps();

const displayController = (function() {

    const boardContainer = document.getElementById('game-board')

    const renderGameBoard = () => {
        const board = gameController.getBoard();
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                const div = document.createElement('div');
                div.textContent = board[i][j] === null ? '' : board[i][j];
                boardContainer.appendChild(div);
            }
        }
    }

    return {
        renderGameBoard,
    }

})();

displayController.renderGameBoard();