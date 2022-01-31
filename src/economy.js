import chalk from 'chalk';

import { randint } from "./random.js";

export class Economy {
    constructor(value) {
        this.value = value === undefined ? randint(-1.0, 1.0) : value;
    }
    type() {
        if (this.value < -2) {
            return chalk.redBright('Red Impossible');
        } else if (this.value < -1.5) {
            return chalk.hex('#d90000')('Radical Communism');
        } else if (this.value < -1) {
            return chalk.hex("#8b0000")("Communism");
        } else if (this.value < -0.5) {
            return chalk.red("Socialism");
        } else if (this.value < 0) {
            return "Centrist";
        } else if (this.value < 0.5) {
            return chalk.yellow("Capitalism");
        } else if (this.value < 1) {
            return chalk.blue("Corperationist");
        } else if (this.value < 1.5) {
            return chalk.green("Ultra-Capitalism");
        } else {
            return chalk.hex("#00ff00")("Oligarchy");
        }
    }
}