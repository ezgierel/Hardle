const gameBoard = document.getElementById("word-board");
const keyboard = document.getElementById("keyboard-container");
// const answer = "SCENT";

let currentRow = 0;
let currentLetter = 0;

//set array for keyboard and each guesses so js can create buttons and tiles

const keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'];
const guesses = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

//create  boxes for letters

guesses.forEach((row, rowIndex) => {
    const rowContainer = document.createElement("div");
    rowContainer.id = `row-${rowIndex}`;
    rowContainer.classList.add('row');

    row.forEach((letter, letterIndex) => {
        const letterContainer = document.createElement("span");
        letterContainer.id = `row-${rowIndex}-char-${letterIndex}`;
        letterContainer.classList.add('letter');
        rowContainer.append(letterContainer);
    });

    gameBoard.append(rowContainer);
});

//set keyboard and add click event listener

keys.forEach(key => {
    const keyboardButton = document.createElement('button');
    keyboardButton.textContent = key;
    keyboardButton.value = key;
    keyboardButton.addEventListener('click', () => handleClick(key));
    keyboard.append(keyboardButton);
})

//screen-keyboard click functions

function handleClick(key) {
    var letter = key;
    if (key != "ENTER" && key != "⌫") {
        typeLetter(letter);
    } else if (key === "⌫") {
        deleteLetter();
    }
}

//keyboard keyup functions

document.addEventListener("keyup", handleKeyUp)

function handleKeyUp(evt) {
    var keyCode = evt.keyCode;
    var letter = evt.key;
    if (keyCode >= 65 && keyCode <= 90) {
        typeLetter(letter);
    }
    if (keyCode === 8) {
        deleteLetter();
    }
}

//typing functions
function typeLetter(letter) {
    const currentBox = document.getElementById(`row-${currentRow}-char-${currentLetter}`);
    if (currentBox.textContent == "") {
        currentBox.textContent = letter.toUpperCase();
        currentBox.value = letter.toUpperCase();
        guesses[currentRow][currentLetter] = letter.toUpperCase();
        currentBox.style.borderColor = "black";
        currentBox.style.transition = "border 0.5s";
    }
    if (currentLetter < 4) {
        currentLetter += 1;
    }
}

function deleteLetter() {

    //since current letter is empty box, get previous letter if it's not the last box
    //if it's the last box, get previous letter if box is already empty
    //if it's the first box, do not get the previous letter
    console.log("first" + currentLetter)
    if (currentLetter > 0 && currentLetter !== 4) {
        currentLetter -= 1;
    } else if (currentLetter === 4 && guesses[currentRow][currentLetter] === '') {
        currentLetter -= 1;
    }

    const currentBox = document.getElementById(`row-${currentRow}-char-${currentLetter}`);
    console.log("current box" + currentBox.id)
    console.log("current letter" + currentLetter)
    currentBox.textContent = '';
    currentBox.value = '';
    guesses[currentRow][currentLetter] = '';
    currentBox.style.borderColor = "#d3d6da";
}