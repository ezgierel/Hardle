const gameBoard = document.getElementById("word-board");
const keyboard = document.getElementById("keyboard-container");
const helpButton = document.getElementById("help");
const helpContainer = document.getElementById("help-container");
const settingButton = document.getElementById("settings");
const settingContainer = document.getElementById("settings-container");
const closeButtons = document.querySelectorAll(".close");
const darkThemeButton = document.getElementById("dark-theme");
const speedrunButton = document.getElementById("speedrun");
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
//-------------------------------------------------------

//fetch a random word
fetch('./words.json')
    .then((response) => response.json())
var randomWordIndex = Math.floor(Math.random() * response.length + 1);
const answer = words[randomWordIndex].word.toUpperCase();
console.log(answer);


//--------------------------------

//------colors-------
let whiteish = "#FAF9F6";
let blackish = "#121212";
// let darkGray = "#787c7e";
let lightGray = "#d3d6da";
// let correct = "#6aaa64";
// let clue = "#c9b458";
let modalBackground = "#d9d9d96e";
let modalBackgroundDark = "#0000004b";
// let darkerGray = "#3a3a3c";
//const answer = "SCENT";

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
        const tile = document.createElement("span");
        tile.id = `row-${rowIndex}-char-${letterIndex}`;
        tile.classList.add('letter');
        if (darkThemeButton.checked) {
            tile.classList.add("dark-mode-empty-tile");
        } else {
            tile.classList.add("empty-tile");
        }
        rowContainer.append(tile);
    });
    gameBoard.append(rowContainer);
});

//set keyboard and add click event listener
keys.forEach(key => {
    const keyboardButton = document.createElement('button');
    keyboardButton.textContent = key;
    keyboardButton.id = key;
    keyboardButton.value = key;
    keyboardButton.classList.add("key-not-colored");
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

        currentBox.classList.remove("dark-mode-empty-tile");
        currentBox.classList.remove("empty-tile");

        if (darkThemeButton.checked) {
            currentBox.classList.remove("typing");
            currentBox.classList.add("dark-mode-typing");
        } else {
            currentBox.classList.remove("dark-mode-typing");
            currentBox.classList.add("typing");
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
        currentBox.classList.remove("typing");
        currentBox.classList.remove("dark-mode-typing");

        if (darkThemeButton.checked) {
            currentBox.classList.add("dark-mode-empty-row");
        } else {
            currentBox.classList.add("empty-tile");
        }
    }
}

function checkWord() {
    if (currentLetter === 5) {
        const currentGuess = guesses[currentRow].join("");
        const currentGuessBoxes = document.querySelectorAll(`#row-${currentRow} .letter`);
        currentGuessBoxes.forEach((box) => {
            box.classList.remove("shake")
        })
        let checkGuess = answer;
        //const currentGuessBoxes = document.querySelectorAll(`#row-${currentRow}`).childNodes
        if (answer === currentGuess) {
            currentGuessBoxes.forEach((guess, guessIndex) => {
                setTimeout(() => {
                    guess.classList.add("flip");
                    guess.classList.remove("typing");
                    guess.classList.remove("dark-mode-typing");
                    guess.classList.add("correct");
                }, 400 * guessIndex);
            })
            setTimeout(() => {
                showMessage(currentRow);
                isGameOver = true;
            }, 2500);
            return;

        } else {
            // check if word is valid
            checkIfValid()
                //if valid
                .then(() => {
                    //check if correct guesses used
                    currentGuessBoxes.forEach((guess, guessIndex) => {
                        if (currentRow != 0) {
                            const previous = document.getElementById(`row-${currentRow - 1}-char-${guessIndex}`);
                            if (previous.classList.contains("correct") && previous.getAttribute("data") != guess.getAttribute("data")) {
                                isSetMessage = true;
                            }
                        } else {
                            if (!speedrunButton.checked) {
                                speedrunButton.disabled = true;
                            }
                        }
                    })

                    //if correct guess not used in that place, return
                    if (isSetMessage) {
                        showMessage("alert");
                        currentGuessBoxes.forEach((letter) => {
                            letter.classList.add("shake");
                        })
                        isSetMessage = false;
                        return;
                    }
                    if (currentRow <= 5) {
                        currentGuessBoxes.forEach((guess, guessIndex) => {
                            const currentKey = document.querySelector(`#keyboard-container #${guess.getAttribute("data")}`);
                            guess.classList.remove("typing");
                            guess.classList.remove("dark-mode-typing");
                            setTimeout(() => {
                                guess.classList.add("flip");
                                if (guess.getAttribute("data") == answer[guessIndex]) {
                                    checkGuess = checkGuess.replace(guess.getAttribute("data"), "");
                                    guess.classList.add("correct");
                                } else if (checkGuess.includes(guess.getAttribute("data"))) {
                                    checkGuess = checkGuess.replace(guess.getAttribute("data"), "");
                                    guess.classList.add("clue");
                                } else {
                                    if (darkThemeButton.checked) {
                                        guess.classList.add("dark-mode-not-in-word");
                                    } else {
                                        guess.classList.add("not-in-word");
                                    }
                                }
                            }, 500 * guessIndex);

                            setTimeout(() => {
                                //color keys
                                currentKey.classList.remove("key-not-colored");
                                currentKey.classList.remove("dm-key-not-colored");
                                if (guess.getAttribute("data") == answer[guessIndex]) {
                                    currentKey.classList.add("correct");
                                } else if (answer.includes(guess.getAttribute("data"))) {
                                    currentKey.classList.add("clue");
                                } else {
                                    if (darkThemeButton.checked) {
                                        currentKey.classList.add("dark-mode-not-in-word");
                                    } else {
                                        currentKey.classList.add("not-in-word");
                                    }
                                }
                            }, 2500);
                        })

                        //check if game is lost
                        if (currentRow === 5) {
                            isGameOver = true;
                            showMessage();
                            return;
                        } else {
                            setTimeout(() => {
                                currentRow += 1;
                                currentLetter = 0;
                            }, 2500);
                        }
                    }
                })
                //if not valid
                .catch(e => {
                    showMessage("not-valid");
                    currentGuessBoxes.forEach((letter) => {
                        letter.classList.add("shake");
                    })
                    return;
                })
        }
    }
}

async function checkIfValid() {
    const currentGuess = guesses[currentRow].join("");
    if (currentGuess != "") {
        const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentGuess}`);
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
            messageContent.textContent = "Correct letters must be used";
            break;
        case "not-valid":
            messageContent.textContent = "Word is not valid";
            break;
        default:
            //messageContent.textContent = "Game Over";
            messageContent.textContent = answer;
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
            modal.style.backgroundColor = blackish;
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
            if (tile.classList.contains("not-in-word")) {
                tile.classList.remove("not-in-word");
                tile.classList.add("dark-mode-not-in-word");
            }
        })

        //icons
        icons.forEach(icon => {
            icon.style.color = whiteish;
        })

        //keyboard
        keyButtons.forEach(key => {
            if (key.classList.contains("key-not-colored")) {
                key.classList.remove("key-not-colored");
                key.classList.add("dm-key-not-colored");
            } else if (key.classList.contains("not-in-word")) {
                key.classList.remove("not-in-word");
                key.classList.add("dark-mode-not-in-word");
            }
        })

        //game-tiles
        gameTiles.forEach(tile => {
            if (tile.getAttribute("data") == null) {
                tile.classList.remove("empty-tile");
                tile.classList.add("dark-mode-empty-tile")
            } else {
                if (tile.classList.contains("not-in-word")) {
                    tile.classList.remove("not-in-word");
                    tile.classList.add("dark-mode-not-in-word");
                }
            }
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
            if (tile.classList.contains("dark-mode-not-in-word")) {
                tile.classList.remove("dark-mode-not-in-word");
                tile.classList.add("not-in-word");
            }
        })

        //icons
        icons.forEach(icon => {
            icon.style.color = "black";
        })

        //keyboard
        keyButtons.forEach(key => {
            if (key.classList.contains("dm-key-not-colored")) {
                key.classList.remove("dm-key-not-colored");
                key.classList.add("key-not-colored");
            } else if (key.classList.contains("dark-mode-not-in-word")) {
                key.classList.remove("dark-mode-not-in-word");
                key.classList.add("not-in-word");
            }
        })

        //game-tiles
        gameTiles.forEach(tile => {
            if (tile.getAttribute("data") === null) {
                tile.classList.remove("dark-mode-empty-tile");
                tile.classList.add("empty-tile");
            } else {
                if (tile.classList.contains("dark-mode-not-in-word")) {
                    tile.classList.remove("dark-mode-not-in-word");
                    tile.classList.add("not-in-word");
                }
            }
        })

    }
})

