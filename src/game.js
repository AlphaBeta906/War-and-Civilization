import { Entity } from "./entity.js";
import { Economy } from "./economy.js";
import { Government } from "./government.js";

export class Game {
    constructor(name, entities) {
        this.name = name;
        this.entities = entities;
    }
    add_nation(nation) {
        this.nations.push(nation);
    }
    get_json() {
        return {
            name: this.name,
            entities: this.entities.map(entity => entity.get_json())
        };
    }
}