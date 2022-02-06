import chalk from "chalk";

import { Economy } from "./economy.js";
import { Government } from "./government.js";

export class Entity {
    constructor(name, economy, government, relationship_bias={}) {
        this.name = name;
        this.economy = economy === undefined ? new Economy() : economy;
        this.government = government === undefined ? new Government() : government;
        this.relationship_bias = relationship_bias;
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
            government: this.government.value,
            relationship_bias: this.relationship_bias
        };
    }
    get_relation(nation) {
        const relationship = this.get_difference(nation) + this.relationship_bias[nation.name];

        if (relationship < -6) {
            return chalk.hex('#191970')("Historical Partner");
        } else if (relationship < -5) {
            return chalk.hex('#000080')("Partner");
        } else if (relationship < -4) {
            return chalk.blue("Ally");
        } else if (relationship < -3) {
            return chalk.greenBright("Friendly");
        } else if (relationship < -2) {
            return chalk.green("Trustable");
        } else if (relationship < -1) {
            return chalk.hex('#228B22')("Mildly Trustable");
        } else if (relationship < 0) {
            return chalk.white("Neutral");
        } else if (relationship < 1) {
            return chalk.hex('#B22222')("Mildly Untrustable");
        } else if (relationship < 2) {
            return chalk.red("Untrustable");
        } else if (relationship < 3) {
            return chalk.redBright("Unfriendly");
        } else if (relationship < 4) {
            return chalk.hex('#8b0000')("Hostile");
        } else if (relationship < 5) {
            return chalk.hex('#d90000')("Archnemesis");
        } else {
            return chalk.hex('#d90000').dim("Party's Enemy");
        }
    }
    get_relationships(game) {
        const nations = game.get_json().entities.filter(entity => entity.name !== this.name);

        return nations.map(nation => {
            return {
                name: nation.name,
                relation: this.get_relation(new Entity(nation.name, new Economy(nation.economy), new Government(nation.government)))
            };
        });
    }
}