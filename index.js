let ProductSans;
const resX = 500;
let start = 0;
let string = nextString = 'Lowell';
let rows = [];

function preload() {
    ProductSans = loadFont('/ProductSans-Regular.ttf');
}

function setup() {
    const canvas = createCanvas(windowWidth, 500, WEBGL);
    canvas.parent(document.querySelector('.canvas-container'));
    angleMode(DEGREES);
    rows = calculateRects(string, resX);
}

function draw() {
    rotateX(-15);
    directionalLight(255, 255, 255, 1, 1, -1);
    background(255);
    box(resX, 10, 500);
    for (let y = rows.length - ((frameCount - 1 - start) % rows.length) - 1; y < rows.length; y++) {
        const rects = rows[y];
        for (let Rect of rects) {
            push();
            fill(200, 50, 50);
            const width = Rect[1] - Rect[0];
            const height = 1;
            translate(Rect[0] + width / 2 - 500 / 2, y + height - rows.length - 10);
            strokeWeight(0);
            box(width, height, 100);
            pop();
        }
    }
    if (rows.length - ((frameCount - 1 - start) % rows.length) - 1 === 0) {
        noLoop();
        setTimeout(() => {
            loop();
            if (string !== nextString) {
                string = nextString;
                rows = calculateRects(string, resX);
                start = frameCount;
            }
        }, 2500);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, 500, true);
}

function findTextSize(text, font, desiredSize, min = 1, max = 300, depth = 0) {
    if (!this.graphic) {
        this.graphic = createGraphics();
    }
    this.graphic.textFont(font);
    const guess = (min + max) / 2;
    this.graphic.textSize(guess);
    const width = this.graphic.textWidth(string);
    if (depth > 100 || width === desiredSize) {
        return guess;
    } else if (width > desiredSize) {
        return findTextSize(text, font, desiredSize, min, (max + guess) / 2, depth + 1);
    } else if (width < desiredSize) {
        return findTextSize(text, font, desiredSize, (min + guess) / 2, max, depth + 1);
    }
}

function calculateRects(string, width) {
    if (string === '') {
        return [[]];
    }
    const textSize = Math.floor(findTextSize(string, ProductSans, width));
    const graphic = createGraphics(500, textSize * 2);
    graphic.textAlign('center', 'center');
    graphic.textFont(ProductSans);
    graphic.textStyle(NORMAL);
    graphic.textSize(textSize);
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
    rows = rows.slice(0, rows.length - rows.slice().reverse().findIndex(row => row.length !== 0));
    return rows;
}

document.addEventListener('DOMContentLoaded', () => {
    string = nextString = document.getElementById('what-to-print').value;
    document.getElementById('what-to-print').addEventListener('keyup', e => {
        nextString = e.target.value;
    });
});
