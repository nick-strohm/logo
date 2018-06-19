// Home Testing
const homeTesting = "C;D;R187{T1;M1;}U;H;D;R187{M1;}R187{T1;M2;}U;H;";
// House of Nicholas
const houseOfNicholas = "C;D;R270{T1;}R90{M1;}R90{T1;}R90{M1;}R90{T1;}R90{M1;}R135{T1;}R127{M1;}R90{T1;}R64{M1;}R90{T1;}R64{M1;}R90{T1;}R127{M1;}R225{T1;}R90{M1;}H;";

const logo = homeTesting + houseOfNicholas + "#";

const parser = new TurtleParser(logo);
const instructions = parser.getInstructions();
let index = 0;

const width = 800;
const height = width;
const framerate = 60;

const messageService = new MessageService();
const player = new Player(new Point(0, 0), 0, messageService);

function setup() {
    createCanvas(width, height);
    frameRate(framerate);
    messageService.addMessage("Run logo run!");
}

function draw() {
    background(255);
    messageService.draw();
    player.draw();

    if (!player.isAcceptingInput || player.hasEnded) {
        return;
    }
    
    if (index >= instructions.length) {
        return;
    }
    
    const instruction = instructions[index];
    player.handleInput(instruction);
    index++;
}