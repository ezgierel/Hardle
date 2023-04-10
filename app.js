const keyboard = document.getElementById("keyboard-container");

const keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'];

keys.forEach(key => {
    const keyboardButton = document.createElement('button');
    keyboardButton.textContent = key;
    keyboardButton.value = key;
    keyboard.append(keyboardButton);
})