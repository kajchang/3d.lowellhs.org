let graphic;
const resX = resY = 100;
let string = nextString = 'Lowell';
let rows = [];

function setup() {
    const canvas = createCanvas(windowWidth, 500, WEBGL);
    canvas.parent(document.querySelector('.canvas-container'));
    canvas.style('display', 'block');
    canvas.style('margin', 'auto');
    frameRate(10);
    angleMode(DEGREES);
    rows = calculateRects(string);
}

function draw() {
    rotateX(-15);
    directionalLight(255, 255, 255, 1, 1, -1);
    background(255);
    box(500, 10, 500);
    for (let y = rows.length - ((frameCount - 1) % rows.length) - 1; y < rows.length; y++) {
        const rects = rows[y];
        for (let Rect of rects) {
            push();
            fill(200, 50, 50);
            const width = Rect[1] - Rect[0];
            const height = 1;
            translate(Rect[0] + width / 2 - resX * string.length / 2, y + height - rows.length - 5);
            box(width, height, 100);
            pop();
        }
    }
    if (rows.length - ((frameCount - 1) % rows.length) - 1 === 0) {
        noLoop();
        setTimeout(() => {
            string = nextString;
            rows = calculateRects(string);
            loop();
        }, 2500);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, 500, true);
}

function calculateRects(string) {
    graphic = createGraphics(resX * string.length, resY);
    graphic.textAlign('center', 'center');
    graphic.textSize(resX);
    graphic.textFont('Product Sans');
    graphic.textStyle(NORMAL);
    graphic.background(255);
    graphic.text(string, graphic.width / 2, graphic.height / 2);
    graphic.loadPixels();
    for (let y = 0; y < graphic.height; y++) {
        let inRect = false;
        let rectStart = 0;
        rows[y] = [];
        for (var x = 0; x < graphic.width; x++) {
            const pixel = graphic.get(x, y);
            if (pixel.every(val => val === 255)) {
                if (inRect) {
                    inRect = false;
                    rows[y].push([rectStart, x]);
                    rectStart = 0;
                }
            } else {
                if (!inRect) {
                    inRect = true;
                    rectStart = x;
                }
            }
        }
        if (inRect) {
            rows[y].push([rectStart, x]);
            rectStart = 0;
        }
    }
    rows = rows.slice(rows.findIndex(row => row.length !== 0));
    return rows;
}

document.addEventListener('DOMContentLoaded', () => {
    string = nextString = document.getElementById('what-to-print').value;
    document.getElementById('what-to-print').addEventListener('keyup', e => {
        nextString = e.target.value;
    });
});
