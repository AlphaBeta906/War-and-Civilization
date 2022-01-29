import chalk from 'chalk';

import { randint } from "./random.js";

export class Government {
    constructor(value) {
        this.value = value === undefined ? randint(-1.0, 1.0) : value;
    }
    type() {
        if (this.value < -1) {
            return chalk.hex("#3f0000")("Totalitarianism");
        } else if (this.value < -0.5) {
            return chalk.hex("#8b0000")("Authoritarianism");
        } else if (this.value < 0) {
            return "Centrist";
        } else if (this.value < 0.5) {
            return chalk.blue("Democracy");
        } else {
            return chalk.yellow("Libertarianism");
        }
    }
}