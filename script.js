document.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerTurnDisplay = document.querySelector('.player-turn');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.game-result');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';


    // kotak-kotak yang bisa bikin menang
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];


    // logika game
    function handleResultValidation() {
    let roundWon = false;
    let winningLine = null;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningLine = winCondition;
            break;
        }
    }

    if (roundWon) {
        announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
        isGameActive = false;
        winningLine.forEach(index => {
            tiles[index].classList.add('win');
        });
        return;
    }

    if (!board.includes('')) {
        announce(TIE);
        isGameActive = false;
    }
}

    // logika pengumuman menang kalah seri
    const announce = (type) => {
    switch (type) {
        case PLAYERO_WON:
            announcer.innerHTML = 'Player &nbsp; <span class="playerO">O</span> &nbsp; Won!';
            break;
        case PLAYERX_WON:
            announcer.innerHTML = 'Player &nbsp; <span class="playerX">X</span> &nbsp; Won!';
            break;
        case TIE:
            announcer.innerText = 'It\'s a Tie!';
            break;
    }
    announcer.classList.remove('hide');
};

    // ngecek papan udah diisi belum
    const isValidAction = (tile) => {
        return !tile.innerText;
    };

    
    // supaya tampilan game sinkron dengan array js
    const updateBoard = (index) => {
        board[index] = currentPlayer;
    };


    // ganti giliran
    const changePlayer = () => {
        playerTurnDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerTurnDisplay.innerText = currentPlayer;
        playerTurnDisplay.classList.add(`player${currentPlayer}`);
    };


    // koordinasi aktivitas player
    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            if (isGameActive) {
                changePlayer();
            }
        }
    };


    //logika reset
    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');
        announcer.innerText = '';

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
            tile.classList.remove('win');
        });
    };

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);
});