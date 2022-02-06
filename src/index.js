#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import clear from 'clear';
import gradient from 'gradient-string';
import { mkdir, access, writeFile } from 'fs';
import { exit } from 'process';
import { faker } from '@faker-js/faker';
import { Client } from 'discord-rpc';

import { readJson, writeJson } from './json.js';
import { Entity } from './entity.js';
import { Economy } from './economy.js';
import { Government } from './government.js';
import { Game } from './game.js';
import { IssueHandler } from './issueHandler.js';
import { randint, randnum } from './random.js';
import { version } from './version.js';

const clientId = '939055957227479040';

const client = new Client({ transport: 'ipc' });
const startTimestamp = new Date();
var rpcOn = true

function setActivity(data) {
    if (rpcOn) {
        client.setActivity(data)
    }
}

function get_game(data) {
    return new Game(data.name, data.entities.map(entity => new Entity(entity.name, new Economy(entity.economy), new Government(entity.government), entity.relationship_bias)));
}

async function start_game(game) {
    return new Promise((resolve, reject) => {
        var nation = game.entities[0];
        var exit_game = false;

        while (true) {
            await inquirer.prompt([
                {
                    type: 'list',
                    name: 'option',
                    message: 'What would you like to do?',
                    choices: [
                        'Info',
                        'Relationships',
                        'Exit'
                    ]
                }
            ]).then(function(answers) {
                switch(answers.option) {
                    case 'Info':
                        clear()
                        console.log(chalk.yellow(`${chalk.bold("Info")}:`));
                        nation.info();
                        break;
                    case 'Relationships':
                        clear()
                        console.log(chalk.yellow(`${chalk.bold("Relationships")}:\n`));
                        nation.get_relationships(game).forEach((relationship) => {
                            console.log(`${chalk.bold(relationship.name)}: ${relationship.relation}`);
                        });
                        break;
                    case 'Exit':
                        exit_game = true;
                        break;
                }

                if (randnum(1, 4) === 1) {
                    clear();

                    readJson('data/issues.json').then((res) => {
                        const issueHandler = new IssueHandler(game, res);

                        issueHandler.infoIssue().then((output) => {
                            setActivity({
                                details: `Playing War and Civilization ${version}`,
                                state: output.aftermath, 
                                startTimestamp,
                                largeImageKey: 'logo',
                                instance: false
                            });

                            nation.economy.value += output.economy;
                            nation.government.value += output.government;

                            for (let relationship_nation in output.relationship_bias) {
                                if (nation.relationship_bias[relationship_nation] !== undefined) {
                                    nation.relationship_bias[relationship_nation] += output.relationship_bias[relationship_nation];
                                } else {
                                    nation.relationship_bias[relationship_nation] = output.relationship_bias[relationship_nation];
                                }
                            }

                            game.entities[0] = nation;

                            writeFile('save_files/data.json', JSON.stringify(game.get_json(), null, '\t'), function (err) {
                                if (err) {
                                    console.log(chalk.red(err.toString()));
                                    exit(0);
                                }
                            });
                        });
                    });
                }
            });

            if (exit_game) {
                resolve();
                break;
            }
        }
    });
};

function create_game() {
    clear();

    setActivity({
        details: `Playing War and Civilization ${version}`,
        state: 'Creating a new game...',
        startTimestamp,
        largeImageKey: 'logo',
        instance: false
    });

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
                new Entity(faker.address.city(), new Economy(randint(-1, 1)), new Government(randint(-1, 1))),
                new Entity(faker.address.city(), new Economy(randint(-1, 1)), new Government(randint(-1, 1))),
            ]);

            writeJson('save_files/data.json', game.get_json(), function (err) {
                if (err) {
                    console.log(chalk.red(err.toString()));
                    exit(0)
                }
            });

            start_game(game);
        } else {
            create_game();
        }
    });
}

function main() {
    access('save_files/data.json', (err) => {
        if (!err) {
            readJson('save_files/data.json').then((res) => {
                if (res.version.split(".")[1] !== version.split(".")[1]) {
                    console.log(chalk.red('New features has been added since the version your data has been created. Would you like to create a new game?\n'));
            
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
                    setActivity({
                        details: `Playing War and Civilization ${version}`,
                        state: 'Overcoming issues and events...',
                        startTimestamp,
                        instance: false
                    });

                    const game = get_game(res);
                    start_game(game);
                }
            }).catch((err) => {
                console.log(chalk.red(err.toString()));
            });
        } else {
            mkdir('save_files', (err) => {
                if (err) {
                    console.log(chalk.red(err.toString()));
                    exit(0);
                }
            });

            writeFile('save_files/data.json', '{}', function (err) {
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

function title_screen() {
    clear();

    client.on('ready', () => {
        setActivity({
            details: `Playing War and Civilization ${version}`,
            state: 'On a quest to conquer the world...',
            startTimestamp,
            largeImageKey: 'logo',
            instance: false
        });
    });
    
    client.login({ clientId }).catch((err) => {
        rpcOn = false;
    });

    console.log(
        gradient("red", "white", "blue").multiline(
            figlet.textSync('War\nAnd\nCivilization', {font: 'gothic'})
        ) + '\n\n' +
        chalk.yellow('By: ') + chalk.cyan('AlphaBeta906') + ' - ' + chalk.red('v' + version) + '\n\n'
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

title_screen();