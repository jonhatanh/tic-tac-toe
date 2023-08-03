'use strict';



function gameBoardFactory() {

    const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]
    // const board = [
    //     ['X', 'X', 'O'],
    //     ['X', 'O', 'O'],
    //     ['O', 'X', 'O'],
    // ]


    const copyBidiArray = (arr) => {
        return arr.map( el => {
            return [...el];
        })
    }
    const getBoard = () => copyBidiArray(board);

    const printGameBoard = () => {
        console.log(board);
    }

    const addMark = (mark, row, col) => {
        if(
            (board[row][col] !== null) 
            || (row > 2 || row < 0) 
            || (col > 2 || col < 0) 
        ) return false;
        board[row][col] = mark;
        return true;
    }

    const haveRemainingSpots = () => {
        return board.flat().includes(null);
    }

    return {
        printGameBoard,
        getBoard,
        addMark,
        haveRemainingSpots,
    }

};

function playerFactory(mark) {
    let wins = 0;
    // const makeMove = (board, row, col) => {
    //     const isLegalMove = board.addMark(mark, row, col);
    //     return isLegalMove;
    // }
    const getMark = () => mark;
    const getWins = () => wins;
    const addWin = () => wins++;


    return {
        getMark,
        // makeMove,
        getWins,
        addWin,
    };
}

const gameController = (function() {

    const board = gameBoardFactory();
    const players = [
        playerFactory('X'),
        playerFactory('O')
    ];
    let round = 1;
    let activePlayer = players[0];
    const gameStatus = {
        isLegalMove: false,
        winner: false,
        draw: false,
    };

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const printPrivateProps = () => console.log(board,players);

    const playRound = (row, col) => {
        if(gameStatus.winner || gameStatus.draw) return gameStatus;

        gameStatus.isLegalMove = board.addMark(activePlayer.getMark(), row, col);
        if(!gameStatus.isLegalMove) return gameStatus;
        gameStatus.winner = checkForWinner();
        if(gameStatus.winner) {
            activePlayer.addWin();
            return gameStatus;
        }
        gameStatus.draw = !gameStatus.winner && !board.haveRemainingSpots();
        switchPlayerTurn();
        return gameStatus;
    }


    const checkForWinner = () => {
        const boardCopy = board.getBoard();
        // winner = boardCopy.map(row => {
            //     return row.filter(mark => {
                //         return mark === activePlayer.getMark();
                //     }).length === 3;
                // }).includes(true);
                // if(winner) return true;
                
        for(let i = 0; i < 3; i++) {
            //Check in rows
            if (boardCopy[i][0] === activePlayer.getMark() &&
            boardCopy[i][1] === activePlayer.getMark() &&
            boardCopy[i][2] === activePlayer.getMark()){
                return true;
            }
            //Check in cols
            if (boardCopy[0][i] === activePlayer.getMark() &&
            boardCopy[1][i] === activePlayer.getMark() &&
            boardCopy[2][i] === activePlayer.getMark()){
                return true;
            }
            
        }
        //Check in diagonal
        if (boardCopy[0][0] === activePlayer.getMark() &&
            boardCopy[1][1] === activePlayer.getMark() &&
            boardCopy[2][2] === activePlayer.getMark()){
            return true;
        }
        if (boardCopy[0][2] === activePlayer.getMark() &&
        boardCopy[1][1] === activePlayer.getMark() &&
        boardCopy[2][0] === activePlayer.getMark()){
            return true;
        }
        
        return false;
    }

    const getPlayerTurn = () => players.indexOf(activePlayer) + 1;
    const getPlayerMark = () => activePlayer.getMark();
    const getPlayersWins = () => [players[0].getWins(), players[1].getWins()];
    const getRound = () => round;

    return {
        playRound,
        printPrivateProps,
        getBoard: board.getBoard,
        getPlayerTurn,
        getRound,
        getPlayerMark,
        getPlayersWins,
    }

})();

gameController.printPrivateProps();

const displayController = (function() {

    const boardContainer = document.getElementById('game-board');
    const playerTurnContainer = document.getElementById('player-turn');
    const roundContainer = document.getElementById('round');
    const playersWinsContainer = document.getElementById('players-wins');

    const renderGameBoard = () => {
        boardContainer.textContent = "";
        const board = gameController.getBoard();
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                const button = document.createElement('button');
                button.setAttribute('data-row', i);
                button.setAttribute('data-col', j);
                button.textContent = board[i][j] === null ? '' : board[i][j];
                boardContainer.appendChild(button);
            }
        }
        playerTurnContainer.textContent = `Player ${gameController.getPlayerTurn()} (${gameController.getPlayerMark()})`;
        roundContainer.textContent = gameController.getRound();
        const playersWins = gameController.getPlayersWins();
        playersWinsContainer.innerHTML = `
        <b>Player 1:</b> ${playersWins[0]}
        <br>
        <b>Player 2:</b> ${playersWins[1]}`;
    }

    const playRound = function (e) {
        if(e.target.dataset.row === undefined) return;
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
        const gameStatus = gameController.playRound(row,col);
        console.log(gameStatus);
        if(gameStatus.isLegalMove) {
            if(gameStatus.winner) {

            } else if (gameStatus.draw) {

            } else {

            }
            renderGameBoard();
        } else {
            console.log('Illegal Move');
        }
    }

    boardContainer.addEventListener('click', playRound)

    return {
        renderGameBoard,
    }

})();

displayController.renderGameBoard();


//Modal
const modal = document.getElementById('modal');
const gameForm = document.getElementById('gameForm');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
openModalBtn.addEventListener('click', (e)=> {
    modal.classList.add('show');
    gameForm.classList.add('show');
})
closeModalBtn.addEventListener('click', (e)=> {
    modal.classList.add('hidde');
    gameForm.classList.add('hidde');
})
modal.addEventListener('animationend', (e) => {
    if(e.animationName !== 'closeModal') return;
    modal.classList.remove('show');
    gameForm.classList.remove('show');
    modal.classList.remove('hidde');
    gameForm.classList.remove('hidde');
})

gameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = getFormData(e.target);
    
    const newBook = new Book(
        formData.title,
        formData.author,
        formData.pages,
        formData.status,
        formData.cover,
        )
    console.log(formData);
    e.target.reset();
    library.addBookToLibrary(newBook);
    library.showBooks();
})
function getFormData(form) {
    const data = {
        title: form.title.value.trim(),
        author: form.author.value.trim(),
        pages: form.pages.value,
        status: form.status.value,
        cover: form.cover.value.trim() === "" ? null : form.cover.value.trim(),
    }
    return data;
}