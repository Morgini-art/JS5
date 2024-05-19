const os = require('os');
const fs = require('fs');

const noise = require('./perlin').moduleP;
const {Block, Hitbox} = require('./class');
const {generateBiomesTemperatures} = require('./temperatures');
const {generateSurface} = require('./surface');
const {generatePlants} = require('./plants');
const {generateOre, generateStone} = require('./cave');

const gameStructures = new Map();

gameStructures.set('tree-leaves-1',require('./Data/Structures/tree-leaves-1.struct'));
gameStructures.set('tree-leaves-2',require('./Data/Structures/tree-leaves-2.struct'));
gameStructures.set('tree-leaves-3',require('./Data/Structures/tree-leaves-3.struct'));

function checkCollisionWith(hitbox1, hitbox2) {
    if (hitbox1.x < hitbox2.x + hitbox2.w &&
        hitbox1.x + hitbox1.w > hitbox2.x &&
        hitbox1.y < hitbox2.y + hitbox2.h &&
        hitbox1.h + hitbox1.y > hitbox2.y) {

        return true;

    } else {
        return false;
    }
}

//[map width] [map height] [seed*]                                  [path to save] [new file name]
//[map width] [map height] [seed*] [timeY] [increment] [tenderness] [path to save] [new file name]
function GenerateMap(widthInp, heightInp, seedInp, pathToSave, fileNameToSave, tY = 0, incr = 0.08, tender = 55) {
    const blockW = 50;
    const blockH = 50;
    console.log('--JS5 Map Generator--');
    console.log('--Options--');
    console.log(`Time Y: ${tY}
Increment: ${incr}
Map width: ${widthInp}
Map height: ${heightInp}
Block width: ${blockW}
Block height: ${blockH}
Tenderness: ${tender}
Seed: ${seedInp} (-1 means random value)
File map name: ${fileNameToSave}
Save file in: ${pathToSave}`);
    let oresData = [];
    let surfaceData = [];
    let surfaceEndData = [];
    const surfacePlantsData = [];
    
    let seed;
    
    if (parseFloat(seedInp) === -1) {
        seed = Math.random();
        console.log('Generated random seed:', seed);
    } else {
        seed = parseFloat(seedInp);
    }
    
    noise.seed(seed);
    
    let time;
    let delta;
    
    const mainTime = performance.now();
    
    console.log('~Generating biomes temperatures...~');
    const biomesTemperaturesData = [];
    const biomesTemperatures = generateBiomesTemperatures({widthInp: widthInp});
    
    time = performance.now(); //S
    console.log('~Generating surface heights...~');
    
    const generatorSettings = {
        surface: {
            index: [
                {
                    inc: 0.005,
                    inc2: 0.075,
                    top: 17,
                    middle: 17,
                    maxHeight1: 2500,
                    maxHeight2: 3000,
                    dyD: -300
                },
                {
                    inc: 0.045,
                    inc2: 0.065,
                    top: 5,
                    middle: 4,
                    maxHeight1: 1000,
                    maxHeight2: 700,
                },
                {
                    inc: 0.008,
                    inc2: 0.015,
                    top: 16,
                    middle: 16,
                    maxHeight1: 1500,
                    maxHeight2: 2500,
                }
            ]        
        },
        stone: {
            index: [
                {},
                {},
                {}
            ]        
        },
        ore: {
            index: [
                {},
                {},
                {}
            ]        
        }
    };
    
    surfaceData = generateSurface({blockW:blockW, blockH:blockH,widthInp:widthInp, generatorSettings:generatorSettings}, biomesTemperatures, true, 1800, 700);
    
    seed = Math.random();
    noise.seed(seed);
    
    surfaceEndData = generateSurface({blockW:blockW, blockH:blockH, widthInp:widthInp, generatorSettings:generatorSettings}, biomesTemperatures, false, 2500, 500, 500, 500);
    
    delta = performance.now() - time; //E
    console.log('~Done: '+delta.toFixed(3)+'ms~');
    
    time = performance.now(); //S
    
    
    console.log('~Generating stone...~');
    noise.seed(seed);
    const stoneData = generateStone(tY, incr, widthInp, heightInp, blockW, blockH, tender);
    
    delta = performance.now() - time; //E
    console.log('~Done: '+delta.toFixed(3)+'ms~');
    
    
    time = performance.now(); //S
    
    console.log('~Generating ores...~');
    
    console.log('~Iron...~');
    seed = Math.random();
    noise.seed(seed);
    incr = 0.087;
    tender = 120;
    oresData = generateOre(tY, incr, widthInp, heightInp, blockW, blockH, tender, 'iron', 1);
    
    console.log('~Gold...~');
    seed = Math.random();
    noise.seed(seed);
    incr = 0.083;
    tender = 145;
    oresData = oresData.concat(generateOre(tY, incr, widthInp, heightInp, blockW, blockH, tender, 'gold', 2));
    
    console.log('~Tungesten...~');
    seed = Math.random();
    noise.seed(seed);
    incr = 0.06;
    tender = 140;
    oresData = oresData.concat(generateOre(tY, incr, widthInp, heightInp, blockW, blockH, tender, 'tungesten', 3));
    
    delta = performance.now() - time; //E
    console.log('~Done: '+delta.toFixed(3)+'ms~');
    
    console.log('~Generating surface plants~');
    
    const plants = generatePlants(surfaceData, surfacePlantsData, biomesTemperatures, gameStructures);
    
    console.log('~Generating dirt surface~...');
    
    surfaceData.forEach((block,id)=>{
        const destinationBlock = surfaceEndData[id];
        let desId = -1;
        
        desId = generatorSettings.surface.index[biomesTemperatures[id]].middle;
        
        const times = (destinationBlock.y - block.y) / 50;
        
        for (let b = 1; b < times; b++) {
            surfaceData.push({x:block.x, y: block.y+b*50, id:desId});
        }
    });
    
    time = performance.now(); //S
    
    console.log('~Merging blocks...~');
    
    const allBlocks = stoneData.concat(oresData, surfaceData, surfacePlantsData);
    
    delta = performance.now() - time; //E
    console.log('~Done: '+delta.toFixed(3)+'ms~');
    
    time = performance.now(); //S
    console.log('~Chunking blocks...~');
    
    let chunkW = 10;
    let chunkH = 10;
    
    const allChunks = chunksBlocks(allBlocks);
    
    delta = performance.now() - time; //E
    console.log('~Done: '+~~delta+'ms~');
    
    console.log('~Burning ores in stone...~');
    time = performance.now(); //S
    
    
    allChunks.forEach((chunk) => {
        chunk.data.forEach((block)=>{
            if ([1, 2, 3].some(el=> el === block.id)) {
                let ok = false;
                for (const sblock of chunk.data) {
                    const {x, y} = block;
                    
                    if (checkCollisionWith({x:x, y:y, w:blockW, h: blockH}, {x:sblock.x, y:sblock.y, w:blockW, h: blockH}) && sblock.id === 0) { //... && stone 
                        ok = true;
                        sblock.id = 'delete';
                        break;
                    }
                }
                if (!ok) {
                    block.id = 'delete';
                }
            } else if (block.id === 4) { //Dirt
                for (const sblock of chunk.data) {
                    const {x, y} = block;
                    const {x2, y2} = sblock;
                    if (checkCollisionWith({x:x, y:y, w:blockW, h: blockH}, {x:x2, y:y2, w:blockW, h: blockH}) && sblock.id === 0) { //... && stone
                        sblock.id = 'delete';
                        break;
                    }
                }
            }
        });
    });
    
    allChunks.forEach((chunk) => {
        chunk.data.forEach((block)=>{
            chunk.data = chunk.data.filter(block => block.id !== 'delete');
        });
    });
    
    delta = performance.now() - time; //E
    console.log('~Done: '+delta.toFixed(3)+'ms~');
    
    
    console.log('~Map generated~~');
    const deltaMain = ~~(performance.now() - mainTime);
    const seconds = deltaMain/1000;
    console.log(`~In: ${deltaMain}ms, ${seconds}s~`);
    
    fs.writeFileSync(process.mainModule.path + pathToSave + fileNameToSave, JSON.stringify({
        chunks: allChunks,
        mapInfo: {
            seed: seed,
            blockWidth: blockW,
            blockHeight: blockH,
            mapWidth: widthInp,
            mapHeight: heightInp,
        }
    }));
    
    function chunksBlocks(inputData) {
        let outputData = [];
        for (let x = 0; x < widthInp/chunkW; x++) {
            for (let y = 0; y < heightInp/chunkH; y++) {
                const chunkHitbox = {
                    x: x * chunkW * blockW,
                    y: y * chunkH * blockH,
                    w: 500,
                    h: 500,
                    data: []
                };
                for (const block of inputData) {
                    if (checkCollisionWith({x:block.x, y:block.y, w:blockW, h: blockH}, chunkHitbox)) {
                        chunkHitbox.data.push(block);
                    }
                }
                delete chunkHitbox.w;
                delete chunkHitbox.h;
                outputData.push(chunkHitbox);
            }
        }
        return outputData;
    }
    
}



/*const commandInput = process.argv;
const tY = parseInt(commandInput[commandInput.length-9]);
let incr = parseFloat(commandInput[commandInput.length-8]);
const widthInp = parseInt(commandInput[commandInput.length-7]);
const heightInp = parseInt(commandInput[commandInput.length-6]);
const blockW = parseInt(commandInput[commandInput.length-5]);
const blockH = parseInt(commandInput[commandInput.length-4]);
let tender = parseInt(commandInput[commandInput.length-3]);
const seedInp = parseFloat(commandInput[commandInput.length-2]);
const fileNameToSave = commandInput[commandInput.length-1];*/



module.exports = {GenerateMap};