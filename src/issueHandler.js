import inquirer from "inquirer";
import chalk from "chalk";
import { faker } from '@faker-js/faker';

import { randnum } from "./random.js";

export class IssueHandler {
    constructor(nation, issues) {
        this.nation = nation;
        this.issues = issues
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
    macro(text) {
        var new_text = text;

        new_text = text.replace(/@nation/g, this.nation).replace(/@name/g, faker.name.findName()).replace(/@city/g, faker.address.cityName());

        return new_text;
    }
    async infoIssue(number=randnum(0, Object.keys(this.issues).length - 1)) {
        return new Promise((resolve, reject) => {
            const issue = this.issues[Object.keys(this.issues)[number]];

            console.log(chalk.blue(this.macro(`Issue #${number}: ${Object.keys(this.issues)[number]}`)));
            console.log(chalk.reset(this.macro(issue.description + '\n')));
            for (let choice in issue.choices) {
                console.log(`${chalk.red(choice)}: ${chalk.reset(this.macro(issue.choices[choice].message))}`);
            }
            console.log()

            inquirer.prompt([
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

                    console.log(chalk.blue('Aftermath: ' + aftermath + '\n'));
                    console.log(chalk.yellow('Economy: ' + this.negativePositiveZero(choice.economy)));
                    console.log(chalk.blue('Government: ' + this.negativePositiveZero(choice.government)));

                    resolve(
                        {
                            aftermath: aftermath,
                            economy: choice.economy,
                            government: choice.government
                        }
                    )
                }
            });
        });
    }
}