const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let allAnswers = answers.split("\n");
let allowedGuesses = allowed.split("\n").concat(allAnswers);

const rows = 6;
const cols = 5;
const width = canvas.width/cols;
const offset = 10;
const infoDisplay = document.getElementById("InfoDisplay");
let solved = false;
let currentRow = 0;

let absoluteTrue = ['', '', '', '', ''];
let absoluteFalse = ['', '', '', '', ''];
let lettersIn = [];
let lettersOut = [];

let board = newBoard(cols, rows);

canvas.addEventListener('click', handleMouseClick);

let infoMatrix = generateInfoMatrix();
updateWord(getGuess(infoMatrix));
drawBoard();

function giveGuess() {
    updateInfo();
    updateAnswers();
    infoMatrix = generateInfoMatrix();
    updateWord(getGuess(infoMatrix));
    drawBoard();
}

function updateInfo() {
    for (let i = 0; i < cols; i++) {
        let tile = board[i][currentRow-1];
        console.log(tile);
        if (tile.color == "lightgreen") {
            absoluteTrue[i] = tile.letter;
        } else if (tile.color == "GoldenRod") {
            absoluteFalse[i] = tile.letter;
            lettersIn.push(tile.letter);
        } else if (tile.color == "Gainsboro") {
            lettersOut.push(tile.letter);
        }
    }
}

function evaluate (word, answer) {
    let score = 0;
    for (let i = 0; i < answer.length; i++) {
        let letter = answer.charAt(i);
        if (word.charAt(i) == letter) score += 2;
        else if (word.indexOf(letter) !== -1) score += 1;
    }
    return score;
}

function generateInfoMatrix() {
    let array = [];
    for (let i = 0; i < allowedGuesses.length; i++) {
        array[i] = [];
        for (let j = 0; j < allAnswers.length; j++) {
            array[i][j] = evaluate(allowedGuesses[i], allAnswers[j]);
        }
    }
    return array;
}   

function updateWord(word) {
    for (let i = 0; i < word.length; i++) {
        let letter = word.charAt(i);
        board[i][currentRow].letter = letter;
        board[i][currentRow].color = "Gainsboro";
    }
    currentRow++;
}

function drawBoard() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let newX = i*width;
            let newY = j*width;
            let color = board[i][j].color;
            ctx.fillStyle = color;
            ctx.fillRect(newX+offset, newY+offset, width-offset, width-offset);
            ctx.strokeRect(newX+offset, newY+offset, width-offset, width-offset);
            text(board[i][j].letter, newX+width/2.3, newY+width/1.3);
        }
    }
}

function getGuess(matrix) {
    let best = -Infinity;
    let bestInd = null;
    for (let i = 0; i < matrix.length; i++) {
        let sum = 0;
        for (let j = 0; j < matrix[i].length; j++) {
            sum += matrix[i][j];
        }
        let avg = sum / matrix[i].length;
        if (avg > best) {
            best = avg;
            bestInd = i;
        }
    }
    let bg = allowedGuesses[bestInd];
    return bg;
}

function updateAnswers() {
    for (let i = 0; i < allAnswers.length; i++) {
        let spliced = false;
        let word = allAnswers[i];
        for (let j = 0; j < lettersOut.length; j++) {
            if (word.indexOf(lettersOut[j]) !== -1) {
                allAnswers.splice(i, 1);
                spliced = true;
                break;
            }
        }

        if (!spliced) {
            for (let j = 0; j < lettersIn.length; j++) {
                if (word.indexOf(lettersIn[j]) == -1) {
                    allAnswers.splice(i, 1);
                    spliced = true;
                    break;
                }
            }
        }

        if (!spliced) {
            for (let j = 0; j < absoluteTrue.length; j++) {
                if (absoluteTrue[j] != '' && word.charAt(j) != absoluteTrue[j]) {
                    allAnswers.splice(i, 1);
                    spliced = true;
                    break;
                }
                if (absoluteFalse[j] != '' && word.charAt(j) == absoluteFalse[j]) {
                    allAnswers.splice(i, 1);
                    spliced = true;
                    break;
                }
            }
        }

        if (spliced) i--;
    }
}

function newBoard(cols, rows) {
    let array = [];
    for (let i = 0; i < cols; i++) {
        array[i] = [];
        for (let j = 0; j < rows; j++) {
            array[i][j] = {letter: "", color: "white"};
        }
    }
    return array;
}

function handleMouseClick(e) {
    let mx = e.offsetX;
    let my = e.offsetY;
    let x = Math.floor(mx/width);
    let y = Math.floor(my/width);
    if (y != currentRow-1 || board[x][y].letter == "") return;
    board[x][y].color = board[x][y].color == "Gainsboro" ? "GoldenRod" : board[x][y].color == "lightgreen" ? "Gainsboro" : "lightgreen";
    drawBoard();
}

function text(text, x, y){
    ctx.fillStyle = "black";
    ctx.font = "50px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    ctx.fillText(text, x, y);
}