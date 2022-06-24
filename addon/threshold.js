
export class Threshold {
    #threshold1;

    constructor(expr) {
        const matches = /([><])(\d+):(\d+)/.exec(expr);

        if (matches) {
            const threshold = {};
            threshold.greater = matches[1] === ">";
            threshold.hours = parseInt(matches[2]);
            threshold.minutes = parseInt(matches[3]);

            this.#threshold1 = threshold;
        }
    }

    satisfies() {
        const now = new Date();

        if (this.#threshold1) {
            if (this.#threshold1.greater)
                return now.getHours() >= this.#threshold1.hours && now.getMinutes() > this.#threshold1.minutes;
            else
                return now.getHours() <= this.#threshold1.hours && now.getMinutes() < this.#threshold1.minutes;
        }
    }
}