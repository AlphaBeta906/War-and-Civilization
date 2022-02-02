#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import clear from 'clear';
import gradient from 'gradient-string';
import { mkdir, access, writeFile } from 'fs';

import { readJson, writeJson } from './json.js';
import { Entity } from './entity.js';
import { Economy } from './economy.js';
import { Government } from './government.js';
import { Game } from './game.js';
import { exit } from 'process';
import { randint } from './random.js';

function get_game(data) {
    const game = new Game(data.name, data.entities.map(entity => new Entity(entity.name, new Economy(entity.economy), new Government(entity.government))));

    return game;
}

async function create_game() {
    clear();

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
        },
        {
            type: 'confirm',
            name: 'q1',
            message: "Q1: The world lost it's spirituality.",
        },
        {
            type: 'confirm',
            name: 'q2',
            message: "Q2: The world lost it's culture.",
        },
        {
            type: 'confirm',
            name: 'q3',
            message: "Q3: Weed should be made legal.",
        },
        {
            type: 'confirm',
            name: 'q4',
            message: "Q4: The world should change.",
        },
        {
            type: 'confirm',
            name: 'q5',
            message: "Q5: If there is a nation attacking, attack it or not?",
        },
        {
            type: 'confirm',
            name: 'done',
            message: 'Are happy with your nation?',
        },
        {
            type: 'input',
            name: 'world_name',
            message: 'What is the name of your game?',
            validate: function (input) {
                if (input.trim().length < 1) {
                    return 'Please enter a name.';
                }

                return true;
            }
        }
    ]).then(function(answers) {
        var government = 0;
        var economy = 0;
        const name = answers.name.trim();

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

        if (answers.q1) {
            government += 0.25;
            economy -= 0.25;
        }

        if (answers.q2) {
            economy += 0.25;
            government += 0.25;
        } else {
            government -= 0.25;
        }

        if (answers.q3) {
            economy += 0.25;
            government += 0.5;
        } else {
            government -= 0.25;
        }

        if (answers.q4) {
            economy -= 0.25;
            government += 0.25;
        } else {
            economy += 0.25;
            government -= 0.5;
        }

        if (answers.q5) {
            economy -= 0.5;
            government -= 0.5;
        } else {
            government += 0.5;
            economy += 0.25;
        }

        if (answers.done) {
            const nation = new Entity(name.trim(), new Economy(economy), new Government(government));

            const game = new Game(answers.world_name, [
                nation,
                new Entity('Betaland', new Economy(randint(-1, 1)), new Government(randint(-1, 1))),
                new Entity('Empire of the West', new Economy(randint(-1, 1)), new Government(randint(-1, 1))),
            ]);
    
            writeJson('data/data.json', game.get_json(), function (err) {
                if (err) {
                    console.log(chalk.red(err.toString()));
                    exit(0)
                }
            });
        } else {
            create_game();
        }
    });
}

async function main() {
    access('data/data.json', (err) => {
        if (!err) {
            readJson('data/data.json').then((res) => {
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
                            create_game();
                        } else {
                            console.log(chalk.red('Exiting...'));
                        }
                    });
                } else {
                    const game = get_game(res)
                    const nation = game.entities[0];

                    nation.get_relationships(game).forEach(function(relation) {
                        console.log(chalk.yellow(relation.name + ': ' + relation.relation));
                    });
                }
            }).catch((err) => {
                console.log(chalk.red(err.toString()));
            });
        } else {
            mkdir('./data', function (err) {
                if (err) {
                    console.log(chalk.red(err.toString()));
                    exit(0)
                }
            });
            writeFile('data/data.json', '{}', function (err) {
                if (err) {
                    console.log(chalk.red(err.toString()));
                    exit(0)
                }
            });

            console.log(chalk.red('No data found, new game?\n'));

            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'newGame',
                    message: 'Start a new game?'
                }
            ]).then((answers) => {
                if (answers.newGame) {
                    create_game();
                } else {
                    console.log(chalk.red('Exiting...'));
                }
            });
        }
    });
}

async function title_screen() {
    clear();
    console.log(
        gradient("red", "white", "blue").multiline(
            figlet.textSync('War\nAnd\nCivilization', {font: 'gothic'})
        ) + '\n\n' +
        chalk.yellow('By: ') + chalk.cyan('AlphaBeta906') + ' - ' + chalk.red('v1.4') + '\n\n'
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
                console.log(chalk.yellow(`\n${chalk.bold("Credits")}:\nAlphaBeta906 - Programmer\n\n`));

                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'exit',
                        message: 'Exit?'
                    }
                ]).then((_answers) => {
                    clear();
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