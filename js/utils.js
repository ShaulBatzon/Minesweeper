//render mat
function renderMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = 'cell cell-' + i + '-' + j;
            strHTML += `<td class="' + className + '" onClick="cellClicked(this,${i},${j})" oncontextmenu="placeFlag(this)">  ${cell}   </td>` ;
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

// render cell location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

//return random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// get empty cell
function getEmptyCell() {
    var emptyCells = getEmptyCells();
    var idx = getRandomIntInclusive(0, emptyCells.length - 1);
    var emptyCell = emptyCells[idx];
    return emptyCell;
}


// get empty cells
function getEmptyCells(board) {
    var emptyCells = [];
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j]) continue;
            emptyCells.push({ i, j });
        }
    }
    return emptyCells;
}

// random number inclusive max
function getRandomIntegerInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// random number NOT inclusive max
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// copy mat
function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        // newMat[i] = mat[i].slice();
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}

function getCellCoord(strCellClass) {
    var parts = strCellClass.split("-");
    var coord = { i: +parts[1], j: +parts[2] };
    return coord;
  }

function getSelector(coord) {
    return '#cell-' + coord.i + '-' + coord.j
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === ''
}

function timerCycle() {
    var stopper = document.querySelector('.stopper');
    if (stoptime == false) {
        sec = parseInt(sec);
        min = parseInt(min);
        
        sec = sec + 1;
        
        if (sec == 60) {
            min = min + 1;
            sec = 0;
        }

        if (sec < 10 || sec == 0) {
            sec = '0' + sec;
        }
        if (min < 10 || min == 0) {
            min = '0' + min;
    }
    
    stopper.innerText = min + ':' + sec;
    
    setTimeout("timerCycle()", 1000);
}
}

function startTimer() {
    if (stoptime == true) {
        stoptime = false;
          timerCycle();
        }
    }
    function stopTimer() {
        if (stoptime == false) {
            stoptime = true;
        }
    }
    
    function resetTimer() {
        var stopper = document.querySelector('.stopper');
        stopper.innerHTML = "00:00";
        stoptime = true;
        sec = 0;
        min = 0;
    }
    
    
    
    
    // timer
    // function startTimer() {
        //     renderTimer();
//     gStartTime = Date.now();
//     gTimerInterval = setInterval(function () {
//         var msDiff = Date.now() - gStartTime;
//         var secs = '' + parseInt((msDiff / 1000) % 60);
//         if (secs.length === 1) secs = '0' + secs;

//         var min = '' + parseInt(msDiff / 1000 / 60);
//         if (min.length === 1) min = '0' + min;

//         var strMsDiff = '' + msDiff;

//         var miliSecs = strMsDiff.charAt(strMsDiff.length - 3) +
//             strMsDiff.charAt(strMsDiff.length - 2);

//         if (miliSecs.length === 1) miliSecs = '0' + miliSecs;
//         console.log(miliSecs);

//         var passedTime = `${min}:${secs}.${miliSecs}`;
//         var elTimer = document.querySelector('.timer');
//         elTimer.innerText = passedTime;
//     },
//         10);
// }
// function renderTimer() {
//     var colSpanTimer = 2;
//     var colSpanTimerText = 2;
//     if (gLevel === 25) {
//         colSpanTimer = 3;
//     } else if (gLevel === 36) {
//         colSpanTimer = 3;
//         colSpanTimerText = 3;
//     }
//     var strHTML = `<tr style="font-weight: bold; ">
//         <td colspan="${colSpanTimerText}" style="border: 0px; font-size: 20px; height: auto;">Game Time:</td>
//         <td colspan="${colSpanTimer}" class="timer" style="border: 0px; font-size: 25px; height: auto;"></td></tr>`;
//     var elTr = document.querySelectorAll('.touch tr')[1];
//     elTr.innerHTML = strHTML;
// }