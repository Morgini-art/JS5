const specialDropsFromBlocks = new Map();

//Wood
specialDropsFromBlocks.set(12,{id:13, type: 0});
specialDropsFromBlocks.set(5,{id:4, type: 0});

//Seed from grass
specialDropsFromBlocks.set(19,{id:27, type: 0});
specialDropsFromBlocks.set(20,{id:27, type: 0});
specialDropsFromBlocks.set(21,{id:27, type: 0});
specialDropsFromBlocks.set(22,{id:27, type: 0});

//Nothing from ungrown crops
specialDropsFromBlocks.set(23,{id:-1});
specialDropsFromBlocks.set(24,{id:-1});
specialDropsFromBlocks.set(25,{id:-1});

//Wheat item from grown crop
specialDropsFromBlocks.set(26,{id:1, type: 1});

const specialBlocksOptions = new Map();

specialBlocksOptions.set(27, {require: 4, where: [0,1], replaceTo: 23});

const gameNames = [new Map(), new Map()];
const blocksNames = new Map();
/*blocksNames.set(0,'Kamień');
blocksNames.set(1,'Ruda żelaza');
blocksNames.set(2,'Ruda złota');
blocksNames.set(3,'Ruda wolframu');
blocksNames.set(4,'Ziemia');
blocksNames.set(5,'Ziemia z trawą');
blocksNames.set(6,'Kamienna cegła');
blocksNames.set(7,'Gliniania cegła');
blocksNames.set(8,'Deski dębowe');
blocksNames.set(9,'Deski mahoniowe');
blocksNames.set(10,'Liście');
blocksNames.set(11,'Liście');
blocksNames.set(12,'Pień drzewa');
blocksNames.set(13,'Drewno');*/

gameNames[0].set(0,'Kamień');
gameNames[0].set(1,'Ruda żelaza');
gameNames[0].set(2,'Ruda złota');
gameNames[0].set(3,'Ruda wolframu');
gameNames[0].set(4,'Ziemia');
gameNames[0].set(5,'Ziemia z trawą');
gameNames[0].set(6,'Kamienna cegła');
gameNames[0].set(7,'Gliniania cegła');
gameNames[0].set(8,'Deski dębowe');
gameNames[0].set(9,'Deski mahoniowe');
gameNames[0].set(10,'Liście');
gameNames[0].set(11,'Liście');
gameNames[0].set(12,'Pień drzewa');
gameNames[0].set(13,'Drewno');

const unsolidBlocks = [12, 13, 19, 20, 21, 22, 23, 24, 25, 26];

gameNames[1].set(0, 'Kordelas');