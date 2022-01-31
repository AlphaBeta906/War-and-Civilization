import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';

import { readJson } from './json.js';
import { Nation } from './nation.js';
import { Economy } from './economy.js';
import { Government } from './government.js';

async function create_nation() {
    var economy = 0;
    var government = 0;

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
    ]).then(function(answers1) {
        inquirer.prompt([
            {
                type: 'list',
                name: 'gov_type',
                message: 'What is your government type?',
                choices: [
                    'Anarchy',
                    'Capitalism',
                    'Communism',
                    'Tyranical',
                    'Centrist',
                    'Monarchy',
                    'Democracy',
                    'Libertarian'
                ]
            }
        ]).then(function(answers) {
            if (answers.gov_choice === 'Anarchy') {
                government += 0.25;
            } else if (answers.gov_choice === 'Capitalism') {
                economy += 0.5;
            } else if (answers.gov_choice === 'Communism') {
                economy -= 0.5;
            } else if (answers.gov_choice === 'Tyranical') {
                government -= 1;
            } else if (answers.gov_choice === 'Monarchy') {
                government -= 0.5;
            } else if (answers.gov_choice === 'Democracy') {
                government += 0.5;
            } else if (answers.gov_choice === 'Libertarian') {
                government += 1;
            }

            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'q1',
                    message: "Q1: The world lost it's spirituality.",
                }
            ]).then(function(answers) {
                if (answers.q1) {
                    government += 0.25;
                    economy -= 0.25;
                }

                inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'q2',
                        message: "Q2: The world lost it's culture.",
                    }
                ]).then(function(answers) {
                    if (answers.q2) {
                        economy += 0.25;
                        government += 0.25;
                    } else {
                        government -= 0.25;
                    }

                    inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'q3',
                            message: "Q3: Weed should be made legal.",
                        }
                    ]).then(function(answers) {
                        if (answers.q3) {
                            economy += 0.25;
                            government += 0.5;
                        } else {
                            government -= 0.25;
                        }

                        /*
                        const nation = new Nation(answers1.name.trim(), new Economy(economy), new Government(government));
                        nation.info();
                        */
                       inquirer.prompt([
                            {
                                type: 'confirm',
                                name: 'q4',
                                message: "Q4: The world should change.",
                            }
                        ]).then(function(answers) {
                            if (answers.q4) {
                                economy -= 0.25;
                                government += 0.25;
                            } else {
                                economy += 0.25;
                                government -= 0.5;
                            }
                            
                            inquirer.prompt([
                                {
                                    type: 'confirm',
                                    name: 'q5',
                                    message: "Q5: If there is a nation attacking, attack it or not?",
                                }
                            ]).then(function(answers) {
                                if (answers.q5) {
                                    economy -= 0.5;
                                    government -= 0.5;
                                } else {
                                    government += 0.5;
                                    economy += 0.25;
                                }

                                inquirer.prompt([
                                    {
                                        type: 'confirm',
                                        name: 'q6',
                                        message: "Are you happy with your nation?",
                                    }
                                ]).then(function(answers) {
                                    if (answers.q6) {
                                        const nation = new Nation(answers1.name.trim(), new Economy(economy), new Government(government));
                                        nation.info();
                                    } else {
                                        create_nation();
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
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