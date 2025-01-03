const grid = document.getElementById("grid");
const playButton = document.getElementById("play");
const clearButton = document.getElementById("clear");

// Создаем сетку 8 нот (строк) на 16 временных интервалов (колонок)
const rows = 8; 
const cols = 16;
const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]; // Ноты
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let activeCells = Array(rows).fill(null).map(() => Array(cols).fill(false));

// Создаем HTML-ячейки
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = i;
        cell.dataset.col = j;
        grid.appendChild(cell);
    }
}

// Обработка кликов по ячейкам
grid.addEventListener("click", (e) => {
    const cell = e.target;
    if (cell.classList.contains("cell")) {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        activeCells[row][col] = !activeCells[row][col];
        cell.classList.toggle("active");
    }
});

// Воспроизведение звука ноты
function playNote(note, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(noteToFrequency(note), audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    setTimeout(() => oscillator.stop(), duration);
}

// Преобразование названия ноты в частоту
function noteToFrequency(note) {
    const A4 = 440;
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const octave = parseInt(note.slice(-1));
    const keyNumber = notes.indexOf(note.slice(0, -1));

    return A4 * Math.pow(2, (keyNumber + (octave - 4) * 12 - 9) / 12);
}

// Воспроизведение мелодии
playButton.addEventListener("click", () => {
    let currentTime = audioContext.currentTime;

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            if (activeCells[row][col]) {
                setTimeout(() => playNote(notes[row], 300), col * 300);
            }
        }
    }
});

// Очистка сетки
clearButton.addEventListener("click", () => {
    activeCells = Array(rows).fill(null).map(() => Array(cols).fill(false));
    document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("active"));
});
