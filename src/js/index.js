import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';

import { readJson } from './json.js';
import { randint } from './random.js';
import { Nation } from './nation.js';

async function main() {
    const res = await readJson('src/data/data.json');

    if (Object.keys(res).length === 0) {
        console.log(chalk.red('No data found, new game?\n'));

        inquirer.prompt([
            {
                type: 'confirm',
                name: 'newGame',
                message: 'Start a new game?'
            }
        ]).then((answers) => {
            if (answers.newGame) {
                console.log(chalk.green('\nStarting new game...'));
                const nation = new Nation("Alphadonia")

                nation.info();
            } else {
                console.log(chalk.red('Exiting...'));
            }
        });
    }
}

async function title_screen() {
    console.log(
        chalk.red(figlet.textSync('War')) + '\n' + 
        chalk.green(figlet.textSync('And')) + '\n' + 
        chalk.blue(figlet.textSync('Civilization')) + '\n\n' +
        chalk.yellow('By: ') + chalk.cyan('AlphaBeta906') + '\n\n'
    );    

    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'What would you like to do?',
            choices: [
                'Play',
                'Credits',
                'Leave'
            ]
        }
    ]).then(function(answers) {
        switch(answers.option) {
            case 'Play':
                console.log(chalk.yellow('\nStarting new game...'));
                main();
                break;
            case 'Credits':
                console.log(chalk.yellow(`\n${chalk.bold("Credits")}:\nAlphaBeta906 - Programmer\nItzCountryballs - Idea-man\n\n`));

                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'exit',
                        message: 'Exit?'
                    }
                ]).then((_answers) => {
                    console.clear();
                    title_screen();
                });
                break;
            case 'Leave':
                console.log(chalk.yellow('\nLeaving game...'));
                break;
        }
    });
}

await title_screen();