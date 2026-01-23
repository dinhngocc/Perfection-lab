let p5Canvas;

function setup() {
  let container = document.getElementById("p5-container");

  let grainScale = 4;

  p5Canvas = createCanvas(windowWidth / grainScale, windowHeight / grainScale);
  p5Canvas.parent("p5-container");

  noLoop();
  pixelDensity(1);
}

function draw() {
  loadPixels();

  let d = pixelDensity();
  let canvasWidth = width * d;
  let canvasHeight = height * d;

  let maxDist = dist(0, 0, canvasWidth, canvasHeight);

  for (let y = 0; y < canvasHeight; y++) {
    for (let x = 0; x < canvasWidth; x++) {
      let dFromTopLeft = dist(x, y, 0, 0);
      let lightFactor = map(dFromTopLeft, 0, maxDist, 1, 0);

      let baseBrightness = 2 + lightFactor * 25;

      let grainNoise = random(-10, 10);

      let finalColorValue = baseBrightness + grainNoise;

      finalColorValue = constrain(finalColorValue, 0, 45);

      let index = (x + y * canvasWidth) * 4;

      pixels[index + 0] = finalColorValue;
      pixels[index + 1] = finalColorValue;
      pixels[index + 2] = finalColorValue;
      pixels[index + 3] = 255;
    }
  }

  updatePixels();
}

function windowResized() {
 
  let grainScale = 4;
  resizeCanvas(windowWidth / grainScale, windowHeight / grainScale);
  redraw();
}
