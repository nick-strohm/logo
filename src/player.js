class Player {
    /**
     * 
     * @param {Point} pos 
     * @param {number} rot 
     * @param {MessageService} messageService 
     */
    constructor(pos, rot, messageService) {
        this.pos = pos;
        this.rot = rot;
        this.messageService = messageService;

        this.isDrawing = false;
        this.hasEnded = false;
        this.isAcceptingInput = true;

        this.homeState = 0;
        this.homeClosestDistance = 9999;

        /**
         * @type {Point[]}
         */
        this.points = [];
    }

    /**
     * @param {number} offset 
     */
    rotate(offset) {
        this.rot += offset;
        this.rot %= 360;
    }

    /**
     * @param {number} offset 
     */
    move(offset) {
        this.pos.x += Math.round(Math.cos(this.rot * DEG_TO_RAD) * offset, 3);
        this.pos.y += Math.round(Math.sin(this.rot * DEG_TO_RAD) * offset, 3);

        if (this.isDrawing) {
            this.points.push(this.pos.copy());
        }
    }

    /**
     * @param {LogoInstruction} input 
     */
    handleInput(input) {
        if (this.hasEnded) {
            return;
        }

        if (input.action == '#') {
            this.messageService.addMessage("Received end instruction. Stopping input handling.");
            this.hasEnded = true;
            return;
        }

        if (input.action == 'U') {
            this.points.push(null);
            this.messageService.addMessage("Received pen up instruction. Stopping drawing.");
            this.isDrawing = false;
            return;
        }

        if (input.action == 'D') {
            this.messageService.addMessage("Received pen down instruction. Starting drawing.");
            this.isDrawing = true;
            return;
        }

        if (input.action == 'C') {
            this.messageService.addMessage("Received clear instruction. Clearing drawn path.");
            this.points = [];
            return;
        }

        if (input.action == 'M') {
            this.move(input.value);
            return;
        }

        if (input.action == 'T') {
            this.rotate(input.value);
            return;
        }

        if (input.action == 'H') {
            this.isAcceptingInput = false;
            this.homeState = 1;
            this.messageService.addMessage("Aligning to home position.");
            return;
        }

        this.messageService.addMessage(`Unknown input received: "${input.code}"`, true);
    }

    draw() {
        push();

        translate(width / 2, height / 2);
        this.drawPoints();
        this.drawPlayer();

        if (this.homeState == 1) {
            let homeRotation = Math.round(Math.atan2(this.pos.y, this.pos.x) * RAD_TO_DEG + 180, 0);
            if (this.rot != homeRotation) {
                this.rotate(1);
                return;
            }

            this.homeState = 2;
            this.homeClosestDistance = 9999;
            this.messageService.addMessage("Aligned. Moving to home now.");
            return;
        }

        if (this.homeState == 2) {
            if (!inRange([0, 0], [this.pos.x, this.pos.y], 1)) {
                this.move(1);

                let distance = range([0, 0], [this.pos.x, this.pos.y]);
                if (distance < this.homeClosestDistance) {
                    this.homeClosestDistance = distance;
                    return;
                } else {
                    this.homeState = 1;
                    this.messageService.addMessage("Distance to home is getting bigger. Realigning.");
                    return;
                }
            }

            this.pos = new Point(0, 0);
            this.messageService.addMessage("Setting position to [0,0].");
            this.homeState = 3;
            return;
        }

        if (this.homeState == 3) {
            if (this.rot != 0) {
                this.rotate(1);
                return;
            }

            this.homeState = 0;
            this.isAcceptingInput = true;
            this.messageService.addMessage("Player arrived at home location. Continuing with execution.");
        }

        pop();
    }

    drawPoints() {
        for (let i = 0; i < this.points.length - 1; i++) {
            const element = this.points[i];
            const next = this.points[i + 1];

            if (element == null || next == null) {
                continue;
            }
            
            element.draw(next);
        }
    }

    drawPlayer() {
        push();
        angleMode(DEGREES);
        translate(this.pos.x, this.pos.y);
        rotate(this.rot);
        stroke(0);
        strokeWeight(1);
        noFill();
        triangle(-5, -5, -5, 5, 7, 0);
        pop();
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * 
     * @param {Point} next 
     */
    draw(next) {
        push();

        stroke(0);
        strokeWeight(1);
        line(this.x, this.y, next.x, next.y);

        pop();
    }

    copy() {
        return new Point(this.x, this.y);
    }
}