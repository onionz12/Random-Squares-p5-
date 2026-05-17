const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const MIDDLE = [CANVAS_WIDTH/2, CANVAS_HEIGHT/2];
const CANVAS_MIN_MEASURE = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT)

const MIN_MAX_SHIFT = [CANVAS_MIN_MEASURE / 100, CANVAS_MIN_MEASURE / 40];
let totalDiameter = CANVAS_MIN_MEASURE * 0.7;


//CHANGE THESE VALUES HOW YOU WANT
let squaresCount = 15;
let useRandomShift = true;
let useColor = true;
let useRandomWeight = true;
let useGradient = true;


//map the corners to the actual size to get the correct coordinates
const createQuad = (w, h) => 
  [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1]
  ]
  .map(([x, y]) => [x * w, y * h]);


//shift coordinates to the middle
const shiftToMiddle = ([x, y]) => [x + MIDDLE[0], y + MIDDLE[1]];

//randomly shift each point within the given threshold
const shiftAtRandom = (original) => original + random(...MIN_MAX_SHIFT) * (Math.random() < 0.5 ? -1 : 1);

//create a single square with a given sidelength, shift it to middle and apply random shift, if selected
const createSquare = (sidelength) => {
  let coordinates = createQuad(sidelength, sidelength);
  coordinates = coordinates.map(shiftToMiddle).flat();
  if(useRandomShift)
     coordinates = coordinates.map(shiftAtRandom);
  return coordinates;
}

//draw the quad
const drawSquare = (verteces) => {//x1, y1, x2, y2, x3, y3, x4, y4
  quad(...verteces);
}

//create a random RGB value
const randomColorArray = () => [random(0, 256), random(0, 256), random(0, 256),       //random(0, 256)  //alpha
                               ];
//compute a smooth linear gradient between two arrays (here: colors) with a given number of steps
const InterpolateArraysStepwise = (startVals, endVals, numSteps) => {
  if(startVals.length != endVals.length) {
    throw new Error("cannot interpolate arrays of different lengths!");
  }
  const stepDistance =
    startVals.map((val, i) => (endVals[i]- val) / (numSteps - 1));
  const computeStep = (startColor) => startColor.map((val, i) => val + stepDistance[i]);
  let colors = [startVals];
  for(let i = 0; i < numSteps - 1; i++) {
    colors.push(computeStep(colors[i]));
  }
  return colors;
}

//only called once at the start
function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  //only draw once
  noLoop();
  
  rectMode(CENTER);
  strokeWeight(0.5);
  noFill();
}

//normally called on loop, here: only once since we call noLoop() in setup!
function draw() {
  //background(217, 217, 200);
  let colors = InterpolateArraysStepwise(randomColorArray(), randomColorArray(), squaresCount);
  if(!useColor) {
    let newColors = colors.map(([r,g,b]) => [r,r,r]);
    colors = newColors;
  }
  
  for(let i = 1; i <= squaresCount; i++) {
    let radius = totalDiameter / squaresCount / 2 * i;
    let verteces = createSquare(radius);
    
    if(useRandomWeight)
      strokeWeight(random(0.0, 20.0));
    if(useGradient)//stroke(...randomColorArray())
      stroke(...colors[i-1]);
    drawSquare(verteces);
  }
}
