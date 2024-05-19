const can = document.querySelector('canvas#game-screen');
const ctx = can.getContext('2d');
const canView = document.querySelector('canvas#game-view');
const ctxView = canView.getContext('2d');

const player = new Player(0,0,74,96, 2,150, 100);

const chunks = [];
const actualChunks = [];
let updateActualChunks = 0;

const enemies = [];

enemies.push(new Enemy(4775, 1550, 74, 96, 2, 150, 100));

let blocks = [];

let mapSettings;

let blocksImgs = [];
let itemsImgs = [];

ctx.imageSmoothingEnabled = false;

const warrior1Spritesheet = new Map();
const chicken1Spritesheet = new Map();

warrior1Spritesheet.set('walk-r', new Spritesheet('img/creature/warrior2/walk.png', 8, 20, {w:96, h:96}, 0));
warrior1Spritesheet.set('idle-r', new Spritesheet('img/creature/warrior2/idle.png', 5, 30, {w:96, h:96}, 0));
warrior1Spritesheet.set('jump-r', new Spritesheet('img/creature/warrior2/jump2.png', 7, 18, {w:96, h:96}, 0));
warrior1Spritesheet.set('fall-r', new Spritesheet('img/creature/warrior2/fall.png', 2, 30, {w:96, h:96}, 0));

const npcs = [];

npcs.push(new NPC(0, 0, 48, 48, new ChickenBehaviour(), new Map()));

npcs.push(new NPC(0, 0, 48, 48, new ChickenBehaviour(), new Map()));

chicken1Spritesheet.set('walk-r', new Spritesheet('img/creature/chicken/walk2.png', 3, 30, {w:32, h:32}, 0));
chicken1Spritesheet.set('idle-r', new Spritesheet('img/creature/chicken/idle2.png', 1, 30, {w:32, h:32}, 0));


const backgroundsImg = [];
backgroundsImg[0] = new Image();
backgroundsImg[1] = new Image();
backgroundsImg[0].src = 'img/background/day.jpg';
backgroundsImg[1].src = 'img/background/cave.png';

const soundsBank = new Map();
soundsBank.set('destroy', new Audio('audio/sounds/1.wav'));
soundsBank.set('walking', new Audio('audio/sounds/2.wav'));
soundsBank.set('jump', new Audio('audio/sounds/3.wav'));
soundsBank.set('plop', new Audio('audio/sounds/4.wav'));

soundsBank.get('walking').loop = true;

const drops = [];
const actualDrops = [];

console.info('JS5 Game');
console.info('Blocks graphisc:',blocksImgs);

const camera = {
    x: 0,
    y: 0,
    width: 1300,
    height: 800,
    lastX: 0,
    lastY: 0
};

for (let z = 0; z < 20; z++) {
    player.invetory[z] = new Item(-1, 0, -1);
}

console.info('Player:', player);

let gameLoop;
let deltaTime = 1;

let gameUiInputs = [];


let deletingBlocksInterval,
    creatingBlocksInterval,
    mouseX = 0,
    mouseY = 0;

const invetoryMouseState = {
    state: 0,
    temp1: {id:-1,c:0,name:0},
    temp2: 0,
    startId: -1
};

let devInfo = true;
//let commandLineActive = false;
let commandLine = {
    active: false,
    value: 'effect 1 lvl2 time5000',
    history: [],
    historyCursor: 0,
    historySearch: false,
    cursor: 0
};
//let commandLine.value = ;

function addItem(invetory, invI,id, c,type) {
    invetory[invI] = new Item(id, c,gameNames[type].get(id), type);
}

const gameRecipes = [
    {
        req: [
            new Item(13, 2, '', 0),
            new Item(0, 1, '', 1),
            new Item(11, 50, '', 0)
        ],
        pro: [
            new Item(8, 3, '', 0)
        ]
    }
];
console.log(gameRecipes[0].req);


addItem(player.invetory, 0, 0, 1, 1);
addItem(player.invetory, 1, 0, 1, 1);
addItem(player.invetory, 11, 11, 8, 0);
addItem(player.invetory, 2, 6, 57, 0);
addItem(player.invetory, 3, 13, 1, 0);
addItem(player.invetory, 4, 13, 1, 0);

console.log(craftFromRecipe(structuredClone(gameRecipes[0].req),structuredClone(player.invetory), gameRecipes[0].pro));
player.invetory = craftFromRecipe(structuredClone(gameRecipes[0].req),structuredClone(player.invetory), gameRecipes[0].pro);

setTimeout(()=>{
//    applyEffect(player, [1, 'life-restore'], 1, 16000);
}, 2000);
applyEffect(player, [0, 'feather-falling'], 1, 10200);



function exectuteCommand(str) {
    if (str.startsWith('effect')) {
        const arr = str.split(' ');
        
        const wichEffect = parseInt(arr[1]);
        const lvlEffect = parseInt(arr[2].substring(3));
        const timeEffect = parseInt(arr[3].substring(4));
        
        console.error(arr, wichEffect, lvlEffect, timeEffect);
        
        applyEffect(player, [wichEffect, 'effectFromCommand'], lvlEffect, timeEffect);
    }
//    'effect 1 lvl2'
}

ctx.font = '25px Monospace';
ctxView.font = '25px Monospace';
ctx.strokeStyle = 'red';

class Input {
    constructor(id, x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.value = 0;
        this.active = 0;
        this.textAlign = 'center';
        this.textSize = 20;
    }
    
    draw() {
        const {x, y, width, height, textAlign, value, textSize} = this;
        ctxView.strokeStyle = ctxView.fillStyle = 'white';
        ctxView.strokeRect(x, y, width, height);
        
        ctxView.textAlign = textAlign;
        ctxView.fillText(value, x+width/2, y+textSize);
    }
    
    collide(mouse) {
        if (checkCollisionWith(this, mouse)) {
            this.active = 1;
        }
    }
    
    type(char) {
//        if (char)
        
    }
}

let gamepadSettings = {
    deadZone1: 0.3,
    deadZone2: 0.8,
    triggers: {
        left: {
            deadZone: 0.4,
        },
        right: {
            deadZone: 0.4,
        }
    },
    showGamepadSettings: true,
    ui: {
        inputs: [new Input(0, 130, 295, 140, 24), new Input(1, 130, 535, 140, 24)]
    }
};

function drawTextOutline(text,x, y, font='1000 30px Monospace') {
    ctxView.font = font;
    
    ctxView.fillStyle = 'white';
    ctxView.lineWidth = 2;
    ctxView.fillText(text, x, y);
    
    ctxView.lineWidth = 1;
    ctxView.strokeStyle = 'black';
    ctxView.strokeText(text, x, y);
}

let FPSNormal = 0,
    FPSObjective = 1000 / 60;
let frames = 0,
    startTime = performance.now();
let timeDelta = 1,
    lTime = 0;

let gamepad = 0;


window.addEventListener('gamepadconnected', e=>{
    console.log(e.gamepad.buttons[0].value);
    gamepad = e.gamepad;
});

const loadGameState = loadGame();
//console.log(loadGameState);
/*loadGameState.then((res)=>{
    console.log(res);
});*/

function loop() {
//    totalFrames++;
    lTime = performance.now();
//    console.info('Game loop start');
    
    
    camera.x = player.x - Math.floor((1300 - player.width) / 2);
    camera.y = player.y - Math.floor((800 - player.height) / 2);
    
    blocks.length = 0;
    actualChunks.length = 0;
    actualDrops.length = 0;
    
//        console.log(chunks);
    chunks.forEach((chunk, chunkId)=>{
        if (checkCollisionWith(chunk, camera)) {
            const nChunk = chunk;
            nChunk.id = chunkId;
            actualChunks.push(nChunk);
        }
    });
    
    actualChunks.forEach((chunk)=>{
        blocks = blocks.concat(chunk.data);
    });
    
    drops.forEach((drop, dropId)=>{
        if (checkCollisionWith(drop, camera)) { 
            const nDrop = drop;
            nDrop.orginalId = dropId;
            actualDrops.push(nDrop);
        }
    });
            
    requestAnimationFrame(loop);
    
    
    
    if (camera.x < 0) {
        camera.x = 0;
    } else if (camera.x+camera.width > mapSettings.mapWidth * 50) {
        camera.x = mapSettings.mapWifdth * 50 - (1300);
    }

    ctx.clearRect(camera.x, camera.y,1300,800);
    ctxView.clearRect(0,0,1300,800);
    
    if (~~(player.y / 50) < 45) {
        ctxView.drawImage(backgroundsImg[0], 0, 0);
    } else {
        ctxView.drawImage(backgroundsImg[1], 0, 0);
    }
    
    for (const block of blocks) {
        drawBlock(block, ctx, blocksImgs[block.id]);
    }
    
    drawPlayer(player, ctx);
    
    for (const npc of npcs) {
        drawNpc(ctx, npc);
        objectPhysics2(npc);
        npc.behaviour.loop(ctx, npc, blocks, deltaTime);
        drawFrame(ctx, npc.spritesheet.get(npc.animationState), npc, deltaTime, {dx:0,dy:0,wm:1.5, hm:1.5});
    }
    
    drawFrame(ctx, warrior1Spritesheet.get(player.animationState), player, deltaTime, {dx:-60, dy: -95,wm:2,hm:2});
    
    for (const enemy of enemies) {
        drawEnemy(ctx, enemy);
//        enemyAi(ctx, enemy, player, blocks);
    }
    
    actualDropsLoop();
    
    effectsLoop([player], FPSObjective*deltaTime);
    
        
    playerPhysics();
    
    doWhilemove(player, blocks, deltaTime);
    
    ctxView.drawImage(can, camera.x, camera.y,1300,800,0,0, 1300 , 800);
    
    drawUi();
    
    
    const t = performance.now();
    
    const dt = t - startTime;
    if (dt > 1000) {
        FPSNormal = frames * 1000 / dt;
        
        frames = 0;
        startTime = t;
    }
    if (t - lTime > FPSObjective) {
        deltaTime = (t - lTime) / FPSObjective;
    } else {
        deltaTime = 1;
    }
    ctxView.fillText(dt, 1250,80);
    frames++;
    
}