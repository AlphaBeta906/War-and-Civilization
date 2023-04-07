import chalk from 'chalk';

import { randint } from "./random.js";
import { sigmoid } from "./math.js";

export class Government {
    constructor(value) {
        this.value = value === undefined ? randint(-1.0, 1.0) : value;
    }
    type() {
        const value = sigmoid(this.value);

        if (value < 0.25) {
            return chalk.blue("Authoritarian");
        } else if (value < 0.5) {
            return chalk.white("Centrist")
        } else {
            return chalk.yellow("Libertarian");
        }
    }
}