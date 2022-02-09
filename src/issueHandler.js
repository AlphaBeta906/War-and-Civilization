import inquirer from "inquirer";
import chalk from "chalk";
import clear from "clear";
import { faker } from '@faker-js/faker';

import { randnum } from "./random.js";
import { issues } from "./issues.js";

export class IssueHandler {
    constructor(game) {
        this.nation = game.get_json().entities[0];
        this.entities = game.get_json().entities.slice(1, 2);

        this.issues = issues;
    }
    negativePositiveZero(number) {
        if (number < 0) {
            return chalk.red('⇣' + number.toString());
        } else if (number === 0) {
            return chalk.gray('⥯' + number.toString());
        } else {
            return chalk.green('⇡' + number.toString());
        }
    }
    macro(text, save={}) {
        return text
          .replace(/@nation/g, this.nation.name)
          .replace(/@name/g, faker.name.findName())
          .replace(/@city/g, faker.address.cityName())
          .replace(/@randnation/g, save.randnation === undefined ? save.randnation : this.entities[randnum(0, this.entities.length - 1)].name);
    }
    async infoIssue(number=randnum(0, Object.keys(this.issues).length - 1)) {
        const issue = this.issues[Object.keys(this.issues)[number]];

        var save = {};

        if (issue.save !== undefined) {
            for (let save_thing of issue.save) {
                switch (save_thing) {
                    case 'randnation':
                        save.randnation = this.entities[randnum(0, this.entities.length - 1)].name;
                        break;
                    default:
                        break;
                }
            }
        }

        clear()
        console.log(chalk.blue(this.macro(`Issue #${number}: ${Object.keys(this.issues)[number]}`, save)));
        console.log(chalk.reset(this.macro(issue.description + '\n', save)));
        for (let choice in issue.choices) {
            console.log(`${chalk.red(choice)}: ${chalk.reset(this.macro(issue.choices[choice].message, save))}`);
        }
        console.log()

        await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What to do?',
                choices: [...Object.keys(issue.choices), 'Dismiss']
            }
        ]).then((answers) => {
            if (answers.choice === 'Dismiss') {
                console.log(chalk.red('Dismissing issue...'));
            } else {
                const choice = this.issues[Object.keys(this.issues)[number]].choices[answers.choice];
                const aftermath = this.macro(choice.aftermath);

                console.log(chalk.green('\nResolution ammended:'));
                console.log(chalk.red('Aftermath: ' + aftermath + '\n'));
                console.log(chalk.yellow('Economy: ' + this.negativePositiveZero(choice.economy)));
                console.log(chalk.blue('Government: ' + this.negativePositiveZero(choice.government)));

                var relationship_bias = {}
                
                if (Object.keys(choice.relationships).length > 0) {
                    console.log(chalk.green('Relationships: ' + Object.keys(choice.relationships).map(nation => {
                        relationship_bias[this.macro(nation, save)] = choice.relationships[nation];
                        return `\n${chalk.red(this.macro(nation, save) + ':')} ${this.negativePositiveZero(choice.relationships[nation])}`
                    })));
                }

                Promise.resolve(
                    {
                        aftermath: aftermath,
                        economy: choice.economy,
                        government: choice.government,
                        relationship_bias: relationship_bias
                    }
                );
            }
        })
    }
}