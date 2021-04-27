let grid = new Array();
let nextGrid = new Array();
let dA, dB, k, feed;
let fslider, kslider, fP, kP;

(dA = 1.0), (dB = 0.5), (k = 0.062), (feed = 0.055);
// (dA = 1.0), (dB = 0.5), (k = 0.0618), (feed = 0.034);
// (dA = 1.0), (dB = 0.5), (k = 0.0609), (feed = 0.062);
// (dA = 1.0), (dB = 0.5), (k = 0.06), (feed = 0.037);
// (dA = 1.0), (dB = 0.5), (k = 0.0566), (feed = 0.0353);

///
// (dA = 1.0), (dB = 0.5), (k = 0.0649), (feed = 0.0367);
// (dA = 1.0), (dB = 0.5), (k = 0.062), (feed = 0.0545);
// (dA = 1.0), (dB = 0.5), (k = 0.051), (feed = 0.026);
// (dA = 1.0), (dB = 0.5), (k = 0.054), (feed = 0.014);
// (dA = 1.0), (dB = 0.5), (k = 0.051), (feed = 0.018);
// (dA = 1.0), (dB = 0.5), (k = 0.059), (feed = 0.022);
// (dA = 1.0), (dB = 0.5), (k = 0.06), (feed = 0.025);
// (dA = 1.0), (dB = 0.5), (k = 0.055), (feed = 0.026);
// (dA = 1.0), (dB = 0.5), (k = 0.057), (feed = 0.029);
// (dA = 1.0), (dB = 0.5), (k = 0.0565), (feed = 0.03);
// (dA = 1.0), (dB = 0.5), (k = 0.0565), (feed = 0.03);
// (dA = 1.0), (dB = 0.5), (k = 0.063), (feed = 0.03);

///////////
/*
.05 .2 .05
.2  -1 .2 
.05 .2 .05
*/
///////////
function setup() {
	pixelDensity(1);
	createCanvas(min(300, windowWidth), min(300, windowWidth));
	fP = createP("Feed:");
	fslider = createSlider(0.01, 0.0999, feed, 0.001);
	kP = createP("k:");
	kslider = createSlider(0.01, 0.0999, k, 0.001);

	for (let i = 0; i < width; i++) {
		grid[i] = new Array();
		nextGrid[i] = new Array();
		for (let j = 0; j < height; j++) {
			grid[i][j] = { a: 1, b: 0 };
			nextGrid[i][j] = { a: 1, b: 0 };
		}
	}
	for (let i = width / 2; i < width / 2 + 20; i++) {
		for (let j = height / 2; j < height / 2 + 20; j++) {
			grid[i][j].b = random(0.4, 0.6);
		}
	}
}

function draw() {
	feed = fslider.value();
	fP.html("Feed:" + feed);
	k = kslider.value();
	kP.html("k:" + k);
	let looop = 5;
	while (looop--) {
		for (let i = 0; i < width; i++) {
			for (let j = 0; j < height; j++) {
				let a = grid[i][j].a;
				let b = grid[i][j].b;
				let newa;
				let newb;
				let abb = a * b * b;
				newa = a + (dA * laplaceA(i, j) - abb + feed * (1 - a));
				newb = b + (dB * laplaceB(i, j) + abb - (k + feed) * b);
				nextGrid[i][j].a = newa;
				nextGrid[i][j].b = newb;
			}
		}
		swap();
	}

	loadPixels();
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			let pix = (i + j * width) * 4;
			var col = floor((grid[i][j].a - grid[i][j].b) * 255);
			col = constrain(col, 0, 255);
			pixels[pix + 0] = col;
			pixels[pix + 1] = col;
			pixels[pix + 2] = col;
			pixels[pix + 3] = 255;
		}
	}
	updatePixels();
}
function laplaceA(x, y) {
	let sumA = 0;

	sumA += grid[x][y].a * -1;
	sumA += grid[(x - 1 + width) % width][y].a * 0.2;
	sumA += grid[(x + 1) % width][y].a * 0.2;
	sumA += grid[x][(y + 1) % height].a * 0.2;
	sumA += grid[x][(y - 1 + height) % height].a * 0.2;
	sumA += grid[(x - 1 + width) % width][(y - 1 + height) % height].a * 0.05;
	sumA += grid[(x + 1) % width][(y - 1 + height) % height].a * 0.05;
	sumA += grid[(x + 1) % width][(y + 1) % height].a * 0.05;
	sumA += grid[(x - 1 + width) % width][(y + 1) % height].a * 0.05;
	return sumA;
}
function laplaceB(x, y) {
	let sumB = 0;

	sumB += grid[x][y].b * -1;
	sumB += grid[(x - 1 + width) % width][y].b * 0.2;
	sumB += grid[(x + 1) % width][y].b * 0.2;
	sumB += grid[x][(y + 1) % height].b * 0.2;
	sumB += grid[x][(y - 1 + height) % height].b * 0.2;
	sumB += grid[(x - 1 + width) % width][(y - 1 + height) % height].b * 0.05;
	sumB += grid[(x + 1) % width][(y - 1 + height) % height].b * 0.05;
	sumB += grid[(x + 1) % width][(y + 1) % height].b * 0.05;
	sumB += grid[(x - 1 + width) % width][(y + 1) % height].b * 0.05;
	return sumB;
}

function swap() {
	let temp = grid;
	grid = nextGrid;
	nextGrid = temp;
}

function mouseDragged() {
	if (mouseX < width && mouseY < height)
		for (let i = mouseX; i < mouseX + 10; i++) {
			for (let j = mouseY; j < mouseY + 10; j++) {
				grid[(i - 5) % width][(j - 5) % height].b = random(0.2, 0.6);
			}
		}
}
function mousePressed() {
	if (mouseX < width && mouseY < height)
		for (let i = mouseX; i < mouseX + 10; i++) {
			for (let j = mouseY; j < mouseY + 10; j++) {
				grid[(i - 5) % width][(j - 5) % height].b = random(0.2, 0.6);
			}
		}
}
