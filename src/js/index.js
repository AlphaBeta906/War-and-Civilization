import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';

import { readJson } from './json.js';
import { randint } from './random.js';
import { Nation } from './nation.js';

async function create_nation() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of your nation?',
            validate: function (input) {
                if (input.trim().length < 1) {
                    return 'Please enter a name.';
                } else if (["Betaland", "Empire of the West"].includes(input.trim())) {
                    return 'Please enter a different name.';
                }
                return true;
            }
        },
    ]).then(function(answers) {
        let nation = new Nation(answers.name.trim());
        nation.info();
    });
}

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
                create_nation();
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
        chalk.yellow('By: ') + chalk.cyan('AlphaBeta906') + ' - ' + chalk.red('v1.2') + '\n\n'
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