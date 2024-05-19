const procces = require('process');
const {GenerateMap} = require('./main');

const commandInput = process.argv;
const lastCommand = commandInput[commandInput.length-1];

if (lastCommand.includes(':\\')) {
    console.log('BlockLive (code name - JS5) map generator.\nType "generate -help" to show available commands.');
} else if (lastCommand === '-help') {
    console.log(`List of commands:\n-create-new-map [map width] [map height] [seed*] [path to save] [new file name] - Create new map based on typed settings
-create-new-map-adv** [map width] [map height] [seed*] [timeY] [increment] [tenderness] [path to save] [new file name] - Create new map based on typed settings. Interferes with generating Perlin Noise. For advanced.
-examples - Show some examples. Useful when you don't know what should you write in parameters.
\n*If you want to create random seed, then type "-1".\n**Advanced mode. Recomended only for advancaded users!! It's very easy to mess something up!`);
} else if (commandInput.find((e)=>e.startsWith('-'))) {
    const index = commandInput.findIndex((e)=>e.startsWith('-'));
    const command = commandInput[index];
    if (command === '-create-new-map') {
        if (structuredClone(commandInput).splice(index+1).length === 5) {
            console.log('Generating map. Please wait...');
            GenerateMap(commandInput[index + 1], commandInput[index + 2], commandInput[index + 3], commandInput[index + 4], commandInput[index + 5]);
        } else {
            invalidArguments();
        }
    } else if (command === '-create-new-map-adv') {
        if (structuredClone(commandInput).splice(index+1).length === 8) {
            console.log('Generating map. Please wait...');
            GenerateMap(commandInput[index + 1], commandInput[index + 2], commandInput[index + 3], commandInput[index + 7], commandInput[index + 8], commandInput[index + 4], commandInput[index + 5], commandInput[index + 6]);
        } else {
            invalidArguments();
        }
    } else {
        unknownCommand();
    }
} else {
    unknownCommand();
}

function unknownCommand() {
    console.log('Unknown command. Type "generate -help" to show available commands.');
}

function invalidArguments() {
    console.log(`Invalid arguments. Check that, you entered all necessary arguments. Make sure that you didn't miss any.`);
}