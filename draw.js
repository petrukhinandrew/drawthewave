var lines = [];
var drawing = false;

window.onload = setup();
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var mousePos = {
    x: 0,
    y: 0
}

function setup() {
    const canvas = document.getElementById("space");
    ctx = canvas.getContext("2d");
    document.addEventListener("mousedown", mouseDown);
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("mousemove", mouseMove);
}
function newNote() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 600, 600);
}

function mouseDown(e) {
    if (e.clientX >= 600 || e.clientY >= 600) return;
    drawing = true;
    newNote();
    lines = [];
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
}

function mouseUp() {
    drawing = false;
}

function mouseMove(e) {
    if (!drawing) return;
    ctx.beginPath();
    newPath = { fx: mousePos.x, fy: mousePos.y };

    ctx.lineWidth = 10;
    ctx.strokeStyle = "red";

    ctx.moveTo(mousePos.x, mousePos.y);
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    newPath.tx = mousePos.x;
    newPath.ty = mousePos.y;

    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
    lines.push(newPath);

}

const looped = document.getElementById("loop");

function playNote(frequency, duration) {
    var oscillator = audioCtx.createOscillator();
    // console.log(frequency, "start");
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(audioCtx.destination);
    oscillator.start();

    setTimeout(
        function () {
            oscillator.stop();
            if (looped.checked) {
                playNote(frequency, duration);
            }
        }, duration);
}

function playMelody() {
    lines.forEach((p) => {
        playNote(10 * (600 - p.fy), 500);
    });
}