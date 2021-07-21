
var brick = 'FLOOR';
const WIN = '🤠';
const LOS = '😥';
const BOMB = 'B';
const FLAG = 'F';
var gBoard;
var gMinesNegsCounts;
var isFirstClick = true;
// make gLevel depending on user choice - for Beginner: gLevel = 2; for Medium: gLevel = 12; for Expert: gLevel = 30 
var gLevel;
var gFlagCount = gLevel;

gLevel = {
    SIZE: 4,
    MINES: 2
   };

   
   gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
   }


function initGame() {
    switch (+document.querySelector('input[name="level"]').value) {
        case 1:
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            console.log('level 1!');
            break;
            case 2:
                gLevel.SIZE = 8;
                gLevel.MINES = 12;
                console.log('level 2!');
                break;
                case 3:
                    gLevel.SIZE = 12;
                    gLevel.MINES = 30;
                    console.log('level 3!');
            break;
    }
    resetTimer();
    renderMat(buildBoard(4), '.board-container');
    
   
}


function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            
            var cell = {
                minesAroundCount: 4,
                isShown: true,
                isMine: false,
                isFlag: false,
                isMarked: true
            }
            if (i === 0 && j === 0 || i === 3 && j ===3) cell.isMine 
            board[i][j] = cell;
        }
    }
    gBoard = board;
    gMinesNegsCounts = setMinesNegsCount(board);
    console.log('gMinesNegsCounts: ',gMinesNegsCounts);
    return board;
}

function gameOver(){
    stopTimer();
}

// TODO - 
function cellClicked(elCell,i,j) {
    isFirstClick = false;
    startTimer();
    // TODO - chenge the 'B' to a bomb pic
    if (elCell.innerText === BOMB){
        failed();
        return;
    }
    var cellCoord = {i,j};

    var cellMinesCount;
    for (var i = 0 ; i < gMinesNegsCounts.length; i++){
        var minesNegsCount = gMinesNegsCounts[i];
        if (minesNegsCount.i === cellCoord.i && minesNegsCount.j === cellCoord.j){
            cellMinesCount = minesNegsCount.minesCount;
            if (cellMinesCount) elCell.innerText = cellMinesCount;
        }
    }
    console.log('cellCoord: ',cellCoord);
    // var pos = getSelector();
}

function placeFlag(elCell) {
    
    elCell.innerText = FLAG;
    
}

function setMinesNegsCount(board) {
    var cells = [];
    var pos = {i,j}
    for (var i = 0; i < board.length; i++){
        for (var j = 0; j < board[0].length; j++){
            pos.i = i;
            pos.j = j;
            var negsCount = getAllNegs(pos).length;
            var cell = {i,j,minesCount: negsCount}
            cells.push(cell)
        }
    }
    console.log('Unit test: cells: expecting: array with nums negs of each cell; Got: ',cells);
    return cells;
}

// TODO - this func will handle failed situation (game-over or lose 1 life)
function failed(){

}

function getAllNegs(pos) {
    var negs = [];

    for (var i = pos.i - 1; i <= pos.i + 1 && i < gBoard.length; i++) {
        if (i < 0) continue;
        for (var j = pos.j - 1; j <= pos.j + 1 && j < gBoard.length; j++) {
            if (j < 0 || (i === pos.i && j === pos.j)) continue;
            if (gBoard[i][j] === BOMB)negs.push({ i, j });
        }
    }

    return negs;
}

function findEmptyCells() {
	var emptyCells = [];
	for (var i = 0; i < gBoard.length; i++) {
		for (var j = 0; j < gBoard[i].length; j++) {
			var thisCell = gBoard[i][j];
			if (thisCell.gameElement === null) emptyCells.push({ i: i, j: j });
		}
	}
	return emptyCells;
}