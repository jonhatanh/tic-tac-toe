'use strict';



function gameBoardFactory() {

    let board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]

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

    const resetBoard = () => {
        board = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];
    }

    return {
        printGameBoard,
        getBoard,
        addMark,
        haveRemainingSpots,
        resetBoard,
    }

};

function playerFactory(name, mark) {
    let wins = 0;
    // const makeMove = (board, row, col) => {
    //     const isLegalMove = board.addMark(mark, row, col);
    //     return isLegalMove;
    // }
    const getName = () => name;
    const getMark = () => mark;
    const getWins = () => wins;
    const addWin = () => wins++;
    const resetWins = () => wins = 0;


    return {
        getName,
        getMark,
        getWins,
        addWin,
        resetWins,
    };
}

function gameControllerFactory(player1, player2) {

    const board = gameBoardFactory();
    const players = [
        player1,
        player2
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

    const resetGame = () => {
        board.resetBoard();
        players.forEach(player => player.resetWins());
        round = 1;
        resetGameStatus();
    }

    const resetGameStatus = () => {
        gameStatus.isLegalMove = false;
        gameStatus.winner = false;
        gameStatus.draw = false;
    }

    const nextRound = () => {
        board.resetBoard();
        resetGameStatus();
    }

    const playRound = (row, col) => {
        if(gameStatus.winner || gameStatus.draw) return gameStatus;

        gameStatus.isLegalMove = board.addMark(activePlayer.getMark(), row, col);
        if(!gameStatus.isLegalMove) return gameStatus;
        gameStatus.winner = checkForWinner();
        if(gameStatus.winner) {
            activePlayer.addWin();
            round++;
            return gameStatus;
        }
        gameStatus.draw = !gameStatus.winner && !board.haveRemainingSpots();
        if(gameStatus.draw) {
            round++;
            return gameStatus;
        }
        switchPlayerTurn();
        return gameStatus;
    }


    const checkForWinner = () => {
        const boardCopy = board.getBoard();
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

    const getPlayerName = () => activePlayer.getName();
    const getPlayerMark = () => activePlayer.getMark();
    const getPlayersWins = () => [players[0].getWins(), players[1].getWins()];
    const getPlayersNames = () => [players[0].getName(), players[1].getName()];
    const getRound = () => round;

    return {
        playRound,
        getBoard: board.getBoard,
        getRound,
        getPlayerName,
        getPlayerMark,
        getPlayersWins,
        getPlayersNames,
        resetGame,
        nextRound,
    }

}


const displayController = (function() {

    ////Game
    let gameController;
    const boardContainer = document.getElementById('game-board');
    const playerTurnContainer = document.getElementById('player-turn');
    const roundContainer = document.getElementById('round');
    const playersWinsContainer = document.getElementById('players-wins');

    const createGame = (player1, player2) => {
        gameController = gameControllerFactory(player1, player2);
        renderGameBoard();
    }

    const renderGameBoard = () => {
        boardContainer.textContent = "";
        const board = gameController.getBoard();
        console.log(board);
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                const button = document.createElement('button');
                button.setAttribute('data-row', i);
                button.setAttribute('data-col', j);
                button.textContent = board[i][j] === null ? '' : board[i][j];
                board[i][j] !== null && button.classList.add('selected');
                boardContainer.appendChild(button);
            }
        }
        playerTurnContainer.textContent = `${gameController.getPlayerName()} (${gameController.getPlayerMark()})`;
        roundContainer.textContent = gameController.getRound();
        const playersNames = gameController.getPlayersNames();
        const playersWins = gameController.getPlayersWins();
        playersWinsContainer.innerHTML = `
        <b>${playersNames[0]}:</b> ${playersWins[0]}
        <br>
        <b>${playersNames[1]}:</b> ${playersWins[1]}`;
    }

    const playRound = function (e) {
        if(e.target.dataset.row === undefined) return;
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
        const gameStatus = gameController.playRound(row,col);
        console.log(gameStatus);
        if(gameStatus.isLegalMove) {
            if(gameStatus.winner) {
                modal.classList.remove('hidden');
                modal.classList.add('show');
                confirmWinnerModal.classList.add('show');
                winnerNameSpan.textContent = gameController.getPlayerName();
                gameController.nextRound();          
            } else if (gameStatus.draw) {
                modal.classList.remove('hidden');
                modal.classList.add('show');
                confirmWinnerModal.classList.add('show');
                winnerNameSpan.textContent = 'DRAW';
                gameController.nextRound();    
            } else {

            }
            renderGameBoard();
        } else {
            console.log('Illegal Move');
        }
    }

    boardContainer.addEventListener('click', playRound)

    boardContainer.addEventListener('mouseenter', (e) => {
        if(e.target.nodeName === 'BUTTON' && !e.target.classList.contains('selected')) {
            e.target.textContent = gameController.getPlayerMark();
            e.target.classList.add('hover');
        }
    }, true)
    boardContainer.addEventListener('mouseleave', (e) => {
        if(e.target.nodeName === 'BUTTON' && !e.target.classList.contains('selected')) {
            e.target.textContent = '';
            e.target.classList.remove('hover');
        }
    }, true)


    ////Modal
    const modal = document.getElementById('modal');
    const gameForm = document.getElementById('gameForm');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const confirmWinnerModal = document.getElementById('winnerModal');
    const confirmWinnerBtn = document.getElementById('confirmWinner');
    const winnerNameSpan = document.getElementById('winnerName');
    const resetBtn = document.getElementById('resetBtn');
    openModalBtn.addEventListener('click', (e)=> {
        modal.classList.remove('hidden');
        gameForm.classList.remove('hidden');
        modal.classList.add('show');
        gameForm.classList.add('show');
    })
    closeModalBtn.addEventListener('click', (e)=> {
        modal.classList.add('hidde');
        gameForm.classList.add('hidde');
    })
    modal.addEventListener('animationend', (e) => {
        if(e.animationName !== 'closeModal') return;
        console.log(e);
        modal.classList.remove('show');
        gameForm.classList.remove('show');
        confirmWinnerModal.classList.remove('show');
        modal.classList.remove('hidde');
        gameForm.classList.remove('hidde');
        confirmWinnerModal.classList.remove('hidde');
        modal.classList.add('hidden');
        gameForm.classList.add('hidden');
    })
    confirmWinnerBtn.addEventListener('click', e => {
        modal.classList.add('hidde');
        confirmWinnerModal.classList.add('hidde');
    })
    resetBtn.addEventListener('click', e => {
        gameController.resetGame();
        renderGameBoard();
    })

    gameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = getFormData(e.target);

        const player1 = playerFactory(formData.player1Name, formData.player1Mark);
        const player2 = playerFactory(formData.player2Name, formData.player2Mark);
        // e.target.reset();
        createGame(player1,player2);
        modal.classList.add('hidde');
        gameForm.classList.add('hidde');
    })

    function getFormData(form) {
        const data = {
            player1Name: form["player-1"].value.trim(),
            player1Mark: form["player-1-mark"].value.trim(),
            player2Name: form["player-2"].value.trim(),
            player2Mark: form["player-2-mark"].value.trim(),
        }
        data.player1Name = data.player1Name === "" 
            ? 'Player 1' : data.player1Name;
        data.player1Mark = data.player1Mark === "" 
            ? 'X' : data.player1Mark;
        data.player2Name = data.player2Name === "" 
            ? 'Player 2' : data.player2Name;
        data.player2Mark = data.player2Mark === "" 
            ? 'O' : data.player2Mark;
        console.log(data);
        return data;
    }


    return {
        createGame,
        renderGameBoard,
    }

})();


displayController.createGame(
    playerFactory('Player 1','X'),
    playerFactory('Player 2','O')
);


