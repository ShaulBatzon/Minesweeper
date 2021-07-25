'use scrit'
const MINE = '👽';
const FLAG = '🚩';
const WIN = '😎';
const LOS = '🤯';
const NORMAL = '😀';

// globals:
var gBoard = [];
var isFirstClick;
var gMinesAreaCounts;
var isGameLive;
var gElResult = document.querySelector('.result');

gLevel = {
    SIZE: 4,
    MINES: 2
};

var gFlagsCount;


var cell = {
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: false,
}

function initGame() {
    resetTimer();
    gElResult.innerHTML = NORMAL;
    isFirstClick = true;
    isGameLive = true;
    buildBoard(gLevel.SIZE);
    renderBoard(gBoard);
    gFlagsCount = createFlags();
}

function gameOver() {
    stopTimer();
    isGameLive = false;
}

function isVictory() {
    if (gFlagsCount.length > 0) return;
    var mines = [];
    var countVisible = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown) countVisible++;
            if (gBoard[i][j].isMine) mines.push(gBoard[i][j])
        }
    }
    for (var i = 0; i < mines.length; i++) {
        if (!mines[i].isMarked) return;
        if (countVisible === (gLevel.SIZE ** 2) - gLevel.MINES) {
            gElResult.innerHTML = WIN;
            gameOver();
        }
    }
}

function onLose() {
    gElResult.innerHTML = LOS;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true;
            }
        }
    }
    renderBoard(gBoard);
    gameOver();
}

function createLevel(elButton) {
    var levelChosen = elButton.innerText;
    gBoard = [];
    switch (levelChosen) {
        case 'Beginner':
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            break;
        case 'Medium':
            gLevel.SIZE = 8;
            gLevel.MINES = 12;
            break;
        case 'Expert':
            gLevel.SIZE = 12;
            gLevel.MINES = 30;
            break;
    }
    initGame();
}

function renderBoard(board) {

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];

            var cellClass = getClassName({ i, j });
            if (currCell.isShown) cellClass += ' isShown';

            strHTML += '\t<td class="cell ' + cellClass +
                `" onclick="cellClicked(this, ${i},${j})"  oncontextmenu="placeFlag(this, ${i},${j})" >\n`;
            
            if (currCell.isMarked) strHTML += FLAG;
            if (currCell.isMine && currCell.isShown) {
                strHTML += MINE;
            }
            if (!currCell.isMine && currCell.minesAroundCount > 0 && currCell.isShown) strHTML += currCell.minesAroundCount;

            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }
    addMines(board);
    setMinesNegsCount(board);

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function buildBoard() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    return gBoard;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var negsCount = getAllNegs({ i, j }).length;
            var cell = { i, j, minesCount: negsCount }
            board[i][j].minesAroundCount = cell.minesCount;
        }
    }
}

function getAllNegs(location) {
    var negs = [];

    for (var i = location.i - 1; i <= location.i + 1 && i < gBoard.length; i++) {
        if (i < 0) continue;
        for (var j = location.j - 1; j <= location.j + 1 && j < gBoard.length; j++) {
            if (j < 0 || (i === location.i && j === location.j)) continue;
            if (gBoard[i][j].isMine) negs.push({ i, j });
        }
    }

    return negs;
}

function cellClicked(elCell, i, j) {
    var currCell = gBoard[i][j];
    if (currCell.isShown) return;
    isFirstClick = false;
    if (!isGameLive) return;
    startTimer();
    // updating model
    currCell.isShown = !currCell.isShown;
        elCell.classList.add('isShown');
    if (currCell.isMarked) return;
    if (currCell.isMine) {
        elCell.innerHTML = MINE;
        onLose();
    }
    if (!currCell.isMine && currCell.minesAroundCount > 0) {
        if (currCell.minesAroundCount === 2)elCell.classList.add('two');
        if (currCell.minesAroundCount > 2) elCell.classList.add('three');
        elCell.innerHTML = currCell.minesAroundCount;
    }
    if (currCell.minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j);
    }

}

function createFlags() {
    gFlagsCount = [];
    for (var i = 0; i < gLevel.MINES; i++) {
        gFlagsCount[i] = false;
    }
    return gFlagsCount;
}

function placeFlag(elCell, i, j) {
    var currCell = gBoard[i][j];
    currCell.isMarked = !currCell.isMarked;
    if (currCell.isShown) return;

    if (currCell.isMarked && gFlagsCount.length > 0) {
        elCell.innerHTML = FLAG;
        gFlagsCount.pop();
        isVictory();
    }
    else {
        if (elCell.innerHTML === FLAG) {
            elCell.innerHTML = '';
            gFlagsCount.push(false);
        }
    }
}

var gMinesCounter;
function addMines(board, i, j) {
    gMinesCounter = gLevel.MINES;
    while (gMinesCounter > 0) {
        var boardCells = [];
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                boardCells.push(board[i][j]);
            }
        }
        var randomCell = getRandomInteger(0, boardCells.length);
        var cell = boardCells[randomCell];
        if (cell.isMine) continue;
        // updating model
        cell.isMine = true;
        gMinesCounter--;
    }
}

function expandShown(board, elCell, locI, locJ) {
    for (var i = locI - 1; i <= locI + 1 && i < board.length; i++) {
        if (i < 0) continue;
        for (var j = locJ - 1; j <= locJ + 1 && j < board.length; j++) {
            elCell = getElementHTML(i, j);
            if (j < 0 || (i === locI && j === locJ)) continue;
            if (!board[i][j].isMine) {
                if (board[i][j].minesAroundCount === 0){
                     board[i][j].isShown = true;
                     elCell.classList.add('isShown');
                     expandShown();
                }
                else {
                    elCell = document.querySelector(`td.cell.cell-${i}-${j}`);
                    if (board[i][j].minesAroundCount === 2) elCell.classList.add('two');
                    if (board[i][j].minesAroundCount > 2) elCell.classList.add('three');
                    elCell.innerHTML = board[i][j].minesAroundCount;
                    board[i][j].isShown = true;
                    elCell.classList.add('isShown');
                }
            }
        }
    }
}
