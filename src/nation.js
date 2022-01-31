import chalk from "chalk";

import { Economy } from "./economy.js";
import { Government } from "./government.js";

export class Nation {
    constructor(name, economy, government) {
        this.name = name;
        this.economy = economy === undefined ? new Economy() : economy;
        this.government = government === undefined ? new Government() : government;
    }
    info() {
        console.log(`\n${chalk.bold(this.name)}:\n${chalk.bold(chalk.yellow("Economy"))}: ${this.economy.type()} (${this.economy.value})\n${chalk.bold(chalk.blue("Government"))}: ${this.government.type()} (${this.government.value})`);
    }
    get_difference(nation) {
        return (this.economy.value - nation.economy.value) + (this.government.value - nation.government.value);
    }
    get_json() {
        return {
            name: this.name,
            economy: this.economy.value,
            government: this.government.value
        };
    }
}