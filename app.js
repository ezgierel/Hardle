const gameBoard = document.getElementById("word-board");
const keyboard = document.getElementById("keyboard-container");
const helpButton = document.getElementById("help");
const helpContainer = document.getElementById("help-container");
const settingButton = document.getElementById("settings");
const settingContainer = document.getElementById("settings-container");
const closeButtonCollection = document.getElementsByClassName("close");
//Change HTML colletion to array to use for each function
const closeButtons = Array.prototype.slice.call(closeButtonCollection);
const darkThemeButton = document.getElementById("dark-theme");
const body = document.querySelector("body");
const header = document.querySelector("header");
const title = document.getElementById("title");
const modals = document.querySelectorAll(".modal");
const modalContents = document.querySelectorAll(".modal-content");
const paragraph = document.querySelectorAll("p");
const headers = document.querySelectorAll(".header");
const list = document.querySelector("#rules-list");
const examples = document.querySelectorAll(".example-tile");
const icons = document.querySelectorAll(".material-symbols-outlined");
const alertContainer = document.getElementById("alert-container");

//------colors-------
let whiteish = "#FAF9F6";
let blackish = "#121212";
let darkGray = "#787c7e";
let lightGray = "#d3d6da";
let correct = "#6aaa64";
let clue = "#c9b458";
let modalBackground = "#d9d9d96e";
let modalBackgroundDark = "#0000004b";
const answer = "SCENT";

let currentRow = 0;
let currentLetter = 0;
let isGameOver = false;
let isSetMessage = false;

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
    } else if (key === "ENTER") {
        checkWord();
    }
}

//keyboard keyup functions
document.addEventListener("keyup", handleKeyUp);

function handleKeyUp(evt) {
    var keyCode = evt.keyCode;
    var letter = evt.key;
    //keycodes for letters and 222 is for Turkish keyboard i
    if ((keyCode >= 65 && keyCode <= 90) || (keyCode === 222)) {
        typeLetter(letter);
    } else if (keyCode === 8) {
        deleteLetter();
    } else if (keyCode === 13) {
        checkWord();
    }
}

//--------------typing functions----------
function typeLetter(letter) {
    const currentBox = document.getElementById(`row-${currentRow}-char-${currentLetter}`);
    if (currentLetter < 5) {
        currentBox.textContent = letter.toUpperCase();
        currentBox.value = letter.toUpperCase();
        currentBox.setAttribute("data", letter.toUpperCase());
        guesses[currentRow][currentLetter] = letter.toUpperCase();

        //if dark theme on
        if (!darkThemeButton.checked) {
            currentBox.style.borderColor = "black";
            currentBox.style.transition = "border 0.5s";
        }
        currentLetter += 1;
    }
}

function deleteLetter() {
    if (isGameOver) {
        return;
    } else {
        //if it's the first box, do not get the previous letter
        if (currentLetter > 0) {
            currentLetter -= 1;
        }

        const currentBox = document.getElementById(`row-${currentRow}-char-${currentLetter}`);
        currentBox.textContent = '';
        currentBox.value = '';
        currentBox.removeAttribute("data");
        guesses[currentRow][currentLetter] = '';
        if (!darkThemeButton.checked) {
            currentBox.style.borderColor = "#d3d6da";
        }
    }
}

function checkWord() {
    if (currentLetter === 5) {
        const currentGuess = guesses[currentRow].join("");
        const currentGuessBoxes = document.querySelectorAll(`#row-${currentRow} .letter`);
        if (answer === currentGuess) {
            showMessage(currentRow);
            isGameOver = true;
            currentGuessBoxes.forEach(guess => {
                guess.style.borderColor = correct;
                guess.style.backgroundColor = correct;
                guess.style.transition = "none";
                guess.style.color = "white";
                return;
            })
        } else {
            //check if word is valid

            //check if correct guesses used
            currentGuessBoxes.forEach((guess, guessIndex) => {
                const previous = document.getElementById(`row-${currentRow - 1}-char-${guessIndex}`);
                if (currentRow != 0 && previous.value == "correct" && previous.getAttribute("data") != guess.getAttribute("data")) {
                    isSetMessage = true;
                }
            })

            //if correct guess not used in that place, return
            if (isSetMessage) {
                showMessage("alert");
                isSetMessage = false;
                return;
            }
            if (currentRow <= 5) {
                currentGuessBoxes.forEach((guess, guessIndex) => {
                    if (answer.includes(guess.getAttribute("data"))) {
                        guess.style.backgroundColor = clue;
                        guess.style.borderColor = clue;
                        guess.style.color = "white";
                        guess.style.transition = "none";
                        guess.value = "clue";
                    }
                    if (guess.getAttribute("data") == answer[guessIndex]) {
                        guess.style.backgroundColor = correct;
                        guess.style.borderColor = correct;
                        guess.value = "correct";
                    }
                })

                //check if game is lost
                if (currentRow === 5) {
                    isGameOver = true;
                    showMessage();
                    return;
                } else {
                    currentRow += 1;
                    currentLetter = 0;
                }
            }
        }
    }
}

function showMessage(currentRow) {
    const messageContent = document.createElement("p");
    switch (currentRow) {
        case 0:
            messageContent.textContent = "Genius";
            break;
        case 1:
            messageContent.textContent = "Magnificent";
            break;
        case 2:
            messageContent.textContent = "Impressive";
            break;
        case 3:
            messageContent.textContent = "Splendid";
            break;
        case 4:
            messageContent.textContent = "Great";
            break;
        case 5:
            messageContent.textContent = "Phew";
            break;
        case "alert":
            messageContent.textContent = "You must use the correct letter(s)";
            break;
        default:
            messageContent.textContent = "Game Over";
    }
    alertContainer.append(messageContent);
    if (darkThemeButton.checked) {
        messageContent.style.backgroundColor = whiteish;
        messageContent.style.color = blackish;
    }
    setTimeout(() => { alertContainer.removeChild(messageContent) }, 2000);
}


//opening "how to play" modal box
helpButton.addEventListener("click", () => {
    helpContainer.style.display = "block";
})

//opening "settings" modal box
settingButton.addEventListener("click", () => {
    settingContainer.style.display = "block";
})


//-----closing modal boxes----
//by clicking somewhere else
window.onclick = function (evt) {
    if (evt.target == helpContainer) {
        helpContainer.style.display = "none";
    } else if (evt.target == settingContainer) {
        settingContainer.style.display = "none";
    }
}

//by using close button
closeButtons.forEach(close => {
    close.addEventListener("click", () => {
        if (close.id == "close-help-modal") {
            helpContainer.style.display = "none";
        } else if (close.id == "close-settings-modal") {
            settingContainer.style.display = "none";
        }
    })

})

//----------settings--------s
//dark theme
darkThemeButton.addEventListener("change", () => {
    const keyButtons = document.querySelectorAll("button");
    const gameTiles = document.querySelectorAll(".letter");

    //if button is checked
    if (darkThemeButton.checked) {
        body.style.backgroundColor = blackish;
        header.style.borderColor = modalBackground;
        title.style.color = whiteish;

        //modal background 
        modals.forEach(modal => {
            modal.style.backgroundColor = modalBackgroundDark;
        })

        //modal container
        modalContents.forEach(modal => {
            modal.style.backgroundColor = "black";
            modal.style.boxShadow = `0 0 18px black`;
        })

        //paragraphs
        paragraph.forEach(p => {
            p.style.color = whiteish;
        })

        //headers
        headers.forEach(header => {
            header.style.color = whiteish;
        })

        //list
        list.style.color = whiteish;

        //example tiles
        examples.forEach(tile => {
            tile.style.color = whiteish;
        })

        //icons
        icons.forEach(icon => {
            icon.style.color = whiteish;
        })

        //keyboard
        keyButtons.forEach(key => {
            key.style.backgroundColor = darkGray;
            key.style.color = whiteish;
        })

        //game-tiles
        gameTiles.forEach(tile => {
            tile.style.borderColor = darkGray;
            tile.style.color = whiteish;
        })


    } else {
        body.style.backgroundColor = "white";
        header.style.borderColor = lightGray;
        title.style.color = "black";

        //modal background 
        modals.forEach(modal => {
            modal.style.backgroundColor = modalBackground;
        })

        //modal container
        modalContents.forEach(modal => {
            modal.style.backgroundColor = "white";
            modal.style.boxShadow = `0 0 18px #888`;
        })

        //paragraphs
        paragraph.forEach(p => {
            p.style.color = "black";
        })

        //headers
        headers.forEach(header => {
            header.style.color = "black";
        })

        //list
        list.style.color = "black";

        //example tiles
        examples.forEach(tile => {
            tile.style.color = "black";
        })

        //icons
        icons.forEach(icon => {
            icon.style.color = "black";
        })

        //keyboard
        keyButtons.forEach(key => {
            key.style.backgroundColor = lightGray;
            key.style.color = "black";
        })

        //game-tiles
        gameTiles.forEach(tile => {
            tile.style.color = "black";
            if (tile.getAttribute("data") === null) {
                tile.style.borderColor = lightGray;
            } else {
                tile.style.borderColor = "black";
            }
        })

    }
})

