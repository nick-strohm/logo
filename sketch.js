// Home Testing
const homeTesting = "R187{T1;M1;}H;R187{M1;}R187{T1;M1;}H;";
// House of Nicholas
const houseOfNicholas = "R270{T1;}R90{M1;}R90{T1;}R90{M1;}R90{T1;}R90{M1;}R135{T1;}R127{M1;}R90{T1;}R64{M1;}R90{T1;}R64{M1;}R90{T1;}R127{M1;}R225{T1;}R90{M1;}H;";

const logo = homeTesting + houseOfNicholas + "#";

const parser = new TurtleParser(logo);
const instructions = parser.getInstructions();
let index = 0;

const width = 800;
const height = width;
const framerate = 60;

let posX = 0;
let posY = 0;
let rot = 0;

let homeState = 0;
let homeRotation = 0;
let homeClosestDistance = 0;

let positions = [[0,0]];

function setup() {
    createCanvas(width, height);
    frameRate(framerate);
}

function rotatePlayer(offsetR) {
    rot += offsetR;
    rot %= 360;
}

function movePlayer(offset) {
    internalMovePlayer(Math.round(Math.cos(rot * DEG_TO_RAD) * offset, 3), 
               Math.round(Math.sin(rot * DEG_TO_RAD) * offset, 3));
}

function internalMovePlayer(offsetX, offsetY) {
    posX += offsetX;
    posY += offsetY;

    positions.push([posX,posY]);
}

function drawPlayer() {
    //console.log(`Drawing player at ${posX} ${posY} with rotation ${rot}`);
    drawPositions();
    push();
    angleMode(DEGREES);
    translate(posX, posY);
    rotate(rot);
    stroke(0);
    strokeWeight(1);
    noFill();
    triangle(-5, -5, -5, 5, 7, 0);
    pop();
}

function drawPositions() {
    push();
    if (positions.length > 1) {
        for (let i = 0; i < positions.length - 1; i++) {
            const first = positions[i];
            const second = positions[i + 1];

            line(first[0], first[1], second[0], second[1]);
        }
    }
    pop();
}

function draw() {
    const instruction = instructions[index];
    if (instruction.action == "#") {
        return;
    }

    if (homeState == 0) {
        index++;
    }

    background(255);
    translate(width / 2, height / 2);
    drawPlayer();

    if (instruction.action == "M") {
        movePlayer(instruction.value);
        return;
    }
    
    if (instruction.action == 'T') {
        rotatePlayer(instruction.value);
        return;
    }
    
    if (instruction.action == 'H') {
        if (homeState == 0) {
            index--;
            homeState = 1;
            return;
        }

        if (homeState == 1) { // Searching rotation
            homeRotation = Math.atan2(posY, posX) * RAD_TO_DEG + 180;
            homeClosestDistance = 9999;
            homeState = 2;
            return;
        }

        if (homeState == 2) { // Rotating to homeposition
            if (Math.round(rot,0) != Math.round(homeRotation,0)) {
                rotatePlayer(1);
                return;
            }

            homeState = 3;
            return;
        }

        if (homeState == 3) { // Move to homeposition
            if (!inRange([0, 0], [posX, posY], 1)) {
                movePlayer(1);

                let distance = range([0, 0], [posX, posY]);
                if (distance < homeClosestDistance) {
                    homeClosestDistance = distance;
                    return;
                } else {
                    homeState = 1;
                    return;
                }
            }

            homeState = 4;
            return;
        }

        if (homeState == 4) { // Rotate to initial rotation
            if (rot != 0) {
                rotatePlayer(1);
                return;
            }

            homeState = 0;
            index++;
            return;
        }

        return;
    }
}

function sleep(millis) {
    var date = Date.now();
    var curDate = null;
    do {
        curDate = Date.now();
    } while (curDate-date < millis);
}

/**
 * @param {number} b Beginning position
 * @param {number} e Ending position
 * @param {number} i Step
 * @param {number} m Steps
 */
function getTween(b, e, i, m) {
    return b + ((i/m) * (e-b));
}

/**
 * @param {number[]} first 
 * @param {number[]} second 
 */
function angleBetween(first, second) {
    const dx = first[1] - second[1],
          dy = first[0] - second[0];

    return Math.atan2(dy, dx);
}

function range(first, second) {
    const dx = Math.pow((first[0] - second[0]), 2),
          dy = Math.pow((first[1] - second[1]), 2);

    return Math.sqrt(dx + dy);
}

function inRange(first, second, distance) {
    return range(first, second) <= distance;
}

Math._round = Math.round;
Math.round = function(number, precision)
{
	precision = Math.abs(parseInt(precision)) || 0;
	var coefficient = Math.pow(10, precision);
	return Math._round(number*coefficient)/coefficient;
}