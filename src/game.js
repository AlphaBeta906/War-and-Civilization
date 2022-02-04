import { version } from "./version.js";

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
            entities: this.entities.map(entity => entity.get_json()),
            version: version
        };
    }
}