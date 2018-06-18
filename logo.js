class LogoInstruction {
    /**
     * @param {string} code 
     */
    constructor(code) {
        /**
         * @public
         */
        this.code = code;

        this.action = '';
        this.value = 0;
    }

    execute() {
        console.log(code);
    }

    /**
     * @public
     */
    getInstructions() {
        return this;
    }

    /**
     * @param {string} char 
     */
    isCharInstruction(char) {
        return "UDHCMT".includes(char);
    }

    /**
     * @param {string} char 
     */
    isControlInstruction(char) {
        return "R".includes(char);
    }

    /**
     * @param {string} char 
     */
    isEndInstruction(char) {
        return "#".includes(char);
    }
}

class TurtleParser extends LogoInstruction {
    /**
     * @param {string} code 
     */
    constructor(code) {
        super(code);

        /**
         * @type {LogoInstruction[]}
         */
        this.instructions = [];

        this.interpret();
    }

    interpret() {
        for (let i = 0; i < this.code.length; i++) {
            const char = this.code[i];
            let end = 0;
            let instruction = null;
            if (this.isControlInstruction(char)) {
                end = this.code.indexOf("}", i);
                instruction = new LogoControlInstruction(this.code.slice(i, end + 1));
            }
            else if (this.isCharInstruction(char)) {
                end = this.code.indexOf(";", i);
                instruction = new LogoCharInstruction(this.code.slice(i, end + 1));
            }
            else if (this.isEndInstruction(char)) {
                instruction = new LogoEndInstruction(char);
                end = i;
            }
            else {
                throw new Error(`Unknown instruction "${char}"`)
            }

            this.instructions.push(instruction);
            i = end;
        }
    }

    execute() {
        for (let i = 0; i < this.instructions.length; i++) {
            const instruction = this.instructions[i];
            instruction.execute();
        }
    }

    /**
     * @public
     */
    getInstructions() {
        let instructs = [];
        for (let i = 0; i < this.instructions.length; i++) {
            const instruction = this.instructions[i];
            const instructions = instruction.getInstructions();

            if (Array.isArray(instructions)) {
                instructions.forEach(element => {
                    instructs.push(element);
                });
                continue;
            }

            instructs.push(instruction.getInstructions());
        }

        return instructs;
    }
}

class LogoCharInstruction extends LogoInstruction {
    /**
     * @param {string} code 
     */
    constructor(code) {
        super(code);

        this.action = '';
        this.value = 0;
        
        this.interpret();
    }

    interpret() {
        this.action = this.code[0];
        let start = 1;
        let end = this.code.indexOf(";");
        
        if (start == end) {
            return;
        }

        const number = this.code.slice(start, end);
        this.value = Number.parseInt(number);
    }

    execute() {
        console.log(this.code);
    }
}

class LogoControlInstruction extends LogoInstruction {
    /**
     * @param {String} code 
     */
    constructor(code) {
        super(code);

        /**
         * @type {number}
         */
        this.count = 0;

        this.instructions = [];

        this.interpret();
    }

    interpret() {
        this.interpretCount();

        const start = this.code.indexOf('{') + 1;
        const end = this.code.lastIndexOf('}');
        for (let i = start; i < end; i++) {
            const char = this.code[i];
            let end = 0;
            let instruction = null;
            if (this.isCharInstruction(char)) {
                end = this.code.indexOf(";", i);
                instruction = new LogoCharInstruction(this.code.slice(i, end + 1));
            }
            else {
                throw new Error(`Unknown or not supported instruction "${char}"`)
            }

            this.instructions.push(instruction);
            i = end;       
        }
    }

    interpretCount() {
        const start = 1;
        const end = this.code.indexOf('{');

        if (start == end) {
            throw new Error("Couldn't find a number for LogoControlInstruction.");
        }

        const number = this.code.slice(start, end);
        this.count = Number.parseFloat(number);
    }

    execute() {
        for (let i = 0; i < this.count; i++) {
            for (let j = 0; j < this.instructions.length; j++) {
                const instruction = this.instructions[j];
                instruction.execute();
            }
        }
    }

    getInstructions() {
        let instructs = [];
        for (let i = 0; i < this.count; i++) {
            for (let j = 0; j < this.instructions.length; j++) {
                const instruction = this.instructions[j];
                instructs.push(instruction);
            }
        }

        return instructs;
    }
}

class LogoEndInstruction extends LogoInstruction {
    /**
     * @param {string} code 
     */
    constructor(code) {
        super(code);

        this.action = '#';
    }
}