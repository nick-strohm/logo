class MessageService {
    constructor() {
        /**
         * @type {Message[]}
         */
        this.messages = [];
    }

    /**
     * @param {string} message 
     * @param {boolean} isError 
     */
    addMessage(message, isError = false) {
        this.messages.push(new Message(message, isError));;
    }

    draw() {
        for (let i = 0; i < this.messages.length; i++) {
            const message = this.messages[this.messages.length - i - 1];
            message.draw(i);

            if (message.visibility < message.decay) {
                this.messages.splice(this.messages.length - i - 1, 1);
            }
        }
    }
}

class Message {
    /**
     * @param {string} message 
     * @param {boolean} isError 
     */
    constructor(message, isError = false) {
        this.message = message;
        this.isError = isError;
        this.visibility = 1.0;

        this.textSize = 16;
        this.decay = 0.002;
    }

    /**
     * 
     * @param {number} index 
     */
    draw(index) {
        push();
        translate(0, 0);
        textSize(this.textSize);
        if (this.isError) {
            fill(255, 0, 0, 255 * this.visibility);
        } else {
            fill(0, 0, 0, 255 * this.visibility);
        }

        text(this.message, 0, 16 * (index + 1));

        this.visibility -= this.decay;
        pop();
    }
}