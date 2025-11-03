const title = document.createElement("h1");
title.textContent = "Virtual Piano";

const instrumentContainer = document.createElement("div");
instrumentContainer.classList.add("instrument");

const controlsContainer = document.createElement("div");
controlsContainer.classList.add("controls");

document.body.append(title, instrumentContainer, controlsContainer);

const keyData = [
    {note: "C", key: "A", sound: "sounds/C.mp3"},
    {note: "D", key: "S", sound: "sounds/D.mp3"},
    {note: "E", key: "D", sound: "sounds/E.mp3"},
    {note: "F", key: "F", sound: "sounds/F.mp3"},
    {note: "G", key: "G", sound: "sounds/G.mp3"},
    {note: "A", key: "H", sound: "sounds/A.mp3"},
    {note: "B", key: "J", sound: "sounds/B.mp3"}, 
];

const keyMap = {};

keyData.forEach((item) => {
    const keyElement = document.createElement("div");
    keyElement.classList.add("key");

    const label = document.createElement("div");
    label.classList.add("key-label");
    label.textContent = item.key;

    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.textContent = "Edit";

    keyElement.append(label, editButton);
    instrumentContainer.appendChild(keyElement);

    const audio = new Audio(item.sound);

    keyMap[item.key.toUpperCase()] = {
      sound: audio,
      element: keyElement,
      label,
    };

    keyElement.addEventListener("mousedown", () => playSound(item.key.toUpperCase()));
    keyElement.addEventListener("mouseup", () => stopActiveState(item.key.toUpperCase()));

    editButton.addEventListener("click", () => {
    currentEdit = item.key.toUpperCase();
    editInput.style.display = "block";
    editInput.focus();
  });
});

keyData.forEach((item, index) => {
    const keyElement = instrumentContainer.children[index];
    const audio = new Audio(item.sound);

    keyMap[item.key.toUpperCase()] = {
        sound: audio,
        element: keyElement,
    };

    keyElement.addEventListener("mousedown", () => playSound(item.key.toUpperCase()));
    keyElement.addEventListener("mousedown", () => stopActiveState(item.key.toUpperCase()));
});

function playSound(key) {
    const entry = keyMap[key.toUpperCase()];
    if(!entry) return;

    const {sound, element} = entry;

    element.classList.add("active");

    sound.currentTime = 0;
    sound.play();
}

function stopActiveState(key) {
    const entry = keyMap[key.toUpperCase()];
    if(!entry) return;
    entry.element.classList.remove("active");
}

let isKeyPressed = false;

document.addEventListener("keydown", (event) => {
    const key = event.key.toLocaleUpperCase();
    if(isKeyPressed) return;
    if(keyMap[key]) {
        isKeyPressed = true;
        playSound(key);
    }
});

document.addEventListener("keyup", (event) => {
    const key = event.key.toUpperCase();
    if(keyMap[key]) {
        stopActiveState(key);
    }
    isKeyPressed = false;
});

const sequenceInput = document.createElement("input");
sequenceInput.classList.add("sequence-input");
sequenceInput.placeholder = "Type a sequence (e.g., ASDFG)";

const playButton = document.createElement("button");
playButton.classList.add("play-sequence");
playButton.textContent = "Play Sequence";

controlsContainer.append(sequenceInput, playButton);

let isPlayingSequence = false;

playButton.addEventListener("click", () => {
    const sequence = sequenceInput.value.toUpperCase().split("");
    const validKeys = sequence.filter((key) => keyMap[key]);

    if (validKeys.length === 0 || isPlayingSequence) return;

    isPlayingSequence = true;
    playButton.disabled = true;
    sequenceInput.disabled = true;

    let index = 0;

    function playNext() {
      if (index >= validKeys.length) {
        isPlayingSequence = false;
        playButton.disabled = false;
        sequenceInput.disabled = false;
        return;
    }

      const key = validKeys[index];
      playSound(key);
      setTimeout(() => {
      stopActiveState(key);
      index++;
      setTimeout(playNext, 100);
    }, 400);
  }

    playNext();
});

const editInput = document.createElement("input");
editInput.type = "text";
editInput.maxLength = 1;
editInput.placeholder = "Press new key and Enter";
editInput.style.display = "none";
editInput.classList.add("sequence-input");
document.body.append(editInput);

let currentEdit = null;

editInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const newKey = editInput.value.toUpperCase();
      editInput.value = "";
      editInput.style.display = "none";

    if (!newKey.match(/^[A-Z]$/)) return;
    if (keyMap[newKey]) {
      alert("This key is already assigned!");
      return;
    }

    const oldKey = currentEdit;
    const entry = keyMap[oldKey];
    delete keyMap[oldKey];

    keyMap[newKey] = entry;
    entry.label.textContent = newKey;

    currentEdit = null;
  }
});