import chalk from 'chalk';

import { randint } from "./random.js";

export class Economy {
    constructor(value) {
        this.value = value === undefined ? randint(-1.0, 1.0) : value;
    }
    type() {
        if (this.value < -1) {
            return chalk.hex("#8b0000")("Communism");
        } else if (this.value < -0.5) {
            return chalk.red("Socialism");
        } else if (this.value < 0) {
            return "Centrist";
        } else if (this.value < 0.5) {
            return chalk.yellow("Capitalist");
        } else {
            return chalk.blue("Corperationist");
        }
    }
}