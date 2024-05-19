//Mouse
canView.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
        clearInterval(creatingBlocksInterval);
    } else if (e.button === 2) {
        clearInterval(deletingBlocksInterval);
    }
});

canView.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
        if(e.shiftKey) {
//            player.x - Math.floor((1300 - player.width) / 2);
            
            player.x = e.offsetX + camera.x;
            player.y = e.offsetY + camera.y;
        } else if (e.ctrlKey) {
            blocks.forEach((block)=>{
                if ([23, 24, 25].some(el => el === block.id)) {
                    block.id++;
                }
            });
        }
        
        const {invetory, invetoryOpen} = player;
        
        const mouseHitbox = new Hitbox(e.offsetX, e.offsetY, 1, 1);
        
        let collisionId = -1;
        
        for (const slot of invetorySlotsHitbox) {
            if (slot.id === 5 && !invetoryOpen) {
                break;
            } else {
                if (checkCollisionWith(mouseHitbox, slot)) {
                    collisionId = slot.id;  
                } 
            }
        }
            
            
        
        if (collisionId !== -1) {
            if (invetoryMouseState.state === 0) {
                if (player.invetory[collisionId].id !== -1) {
                    //Save to memory and delete orginal
                    invetoryMouseState.state = 1;
                    invetoryMouseState.startId = collisionId;
                    invetoryMouseState.temp1 = {
                        id: player.invetory[collisionId].id,
                        c: player.invetory[collisionId].c,
                        name: player.invetory[collisionId].name,
                        type: player.invetory[collisionId].type
                    };
//                    delete player.invetory[invetoryMouseState.startId].name;
                    player.invetory[collisionId].id = -1;
                    player.invetory[collisionId].c = 0;
                    player.invetory[collisionId].type = -1;
                }
            } else if (invetoryMouseState.state === 1 || invetoryMouseState.state === 2) {
                invetoryMouseState.state = 0;

                if (invetory[collisionId].id === -1) { //Empty - save
                    player.invetory[collisionId].id = invetoryMouseState.temp1.id;
                    player.invetory[collisionId].c = invetoryMouseState.temp1.c;
                    player.invetory[collisionId].name = invetoryMouseState.temp1.name;
                    player.invetory[collisionId].type = invetoryMouseState.temp1.type;
                    invetoryMouseState.temp1.id = -1;
                    invetoryMouseState.temp1.c = 0;
                    invetoryMouseState.temp1.type = -1;
                    invetoryMouseState.startId = -1;
                } else if (invetory[collisionId].id === invetoryMouseState.temp1.id && invetoryMouseState.temp1.type !== 2) { //Same - add to counter
                    player.invetory[collisionId].c += invetoryMouseState.temp1.c;
                    invetoryMouseState.temp1.id = -1;
                    invetoryMouseState.temp1.c = 0;
                    invetoryMouseState.startId = -1;
                } else { //Full - overwrite

                    invetoryMouseState.temp2 = player.invetory[collisionId];

                    player.invetory[collisionId] = invetoryMouseState.temp1;
                    invetoryMouseState.state = 1;
                    invetoryMouseState.temp1 = invetoryMouseState.temp2;
                    invetoryMouseState.temp2 = 0;
                    

                    invetoryMouseState.state = 1;

                }
            }
        } else {
            creatingBlocksInterval = setInterval(createBlock, 100);
        }
        
    } else if (e.button === 2) {
        
        const {invetory, invetoryOpen} = player;
        
        const mouseHitbox = new Hitbox(e.offsetX, e.offsetY, 1, 1);
        
        let collisionId = -1;
        
        for (const slot of invetorySlotsHitbox) {
            if (slot.id === 5 && !invetoryOpen) {
                break;
            } else {
                if (checkCollisionWith(mouseHitbox, slot)) {
                    collisionId = slot.id;  
                } 
            }
        }
        
        if (collisionId !== -1) {
            
            if (player.invetory[collisionId].id !== -1) {
                if (invetoryMouseState.temp1.id === -1 || invetoryMouseState.temp1.id === player.invetory[collisionId].id && invetoryMouseState.temp1.type !== -1) {
                    player.invetory[collisionId].c--;
                    invetoryMouseState.temp1.id = player.invetory[collisionId].id;
                    invetoryMouseState.temp1.c++;
                    invetoryMouseState.temp1.name = player.invetory[collisionId].name;
                    invetoryMouseState.temp1.type = player.invetory[collisionId].type;
                    invetoryMouseState.state = 2;
                    if (player.invetory[collisionId].c === 0) {
                        player.invetory[collisionId].id = -1;
                        player.invetory[collisionId].name = 0;
                        player.invetory[collisionId].type = -1;
                    }
                }
            }
            
        } else {
            deletingBlocksInterval = setInterval(deleteBlock, 100);
        }
    }
});

const invetorySlotsHitbox = [];
invetorySlotsHitboxGenerate();

function invetorySlotsHitboxGenerate() {
    let x = 0,
        y = 120,
        collisionId = -1;

    for (const item of player.invetory) {
        if (x === 5) {
            y += 60;
            x = 0;
        }
        const dX = 60 + x * 60;
        invetorySlotsHitbox.push({
            x: dX,
            y: y,
            width: 50,
            height: 50,
            id: collisionId = ((y - 120) / 60 * 5) + x
        });

        x++;
    }
}


canView.addEventListener('contextmenu', e => {
    e.preventDefault();
});

canView.addEventListener('mousemove', e=>{
    mouseX = e.offsetX;
    mouseY = e.offsetY;
});

document.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) {
        player.activeSlot--;
        if (player.activeSlot < 0) {
            player.activeSlot = 4;
        }
    } else {
        player.activeSlot++;
        if (player.activeSlot === 5) {
            player.activeSlot = 0;
        }
    }
});

//Keyboard
document.addEventListener('keydown', (e) => {

    if (e.keyCode === 173) {
        commandLine.active = !commandLine.active;
    } else if (commandLine.active) {
        
        if (e.keyCode === 8) { //Backspace
            commandLine.value = commandLine.value.substring(0, commandLine.value.length - 1);
            commandLine.cursor--;
        } else if (e.keyCode === 13) {
            commandLine.active = false;
            commandLine.history.push(commandLine.value);
            exectuteCommand(commandLine.value);
            commandLine.value = '';
            commandLine.cursor = 0;
        } else if (e.keyCode === 219 || e.keyCode === 221) {
            
            if (e.keyCode === 219) {
                commandLine.historyCursor--;
            } else {
                commandLine.historyCursor++;
            }
            
            console.log(commandLine.historyCursor);
            console.log(commandLine.history);
            console.log(commandLine.history.length);
            if (commandLine.historyCursor < 0) {
                commandLine.historyCursor = commandLine.history.length - 1;
            } else if (commandLine.historyCursor > commandLine.history.length - 1) {
                commandLine.historyCursor = 0;
            }
            console.log(commandLine.historyCursor);
            
            if (commandLine.history.length > 0) {
                commandLine.value = commandLine.history[commandLine.historyCursor];
            }
        } else if(e.keyCode === 51) {
            commandLine.cursor++;
            
//            if (commandLine)
        } else if(e.keyCode === 49) {
            
        } else {
            commandLine.value += e.key;
            commandLine.cursor++;
        } 
        
    } else {
        if (e.keyCode === 87 && player.onGround && !player.jump) { //W
            player.jump = true;

            player.jumpCounter = player.jumpHeight;
            player.onGround = false;
            player.animationState = 'jump-' + player.animationState.split('-')[1];
            if (warrior1Spritesheet.get(player.animationState).invert) {
                warrior1Spritesheet.get(player.animationState).frameCounter = warrior1Spritesheet.get(player.animationState).allFrames - 1;
            } else {
                warrior1Spritesheet.get(player.animationState).frameCounter = 0;
            }
            soundsBank.get('jump').play();
        }
        if (e.keyCode === 65 && !player.ax || e.keyCode === 65 && player.onGround) { //A
            const {
                animationState,
                jump,
                onGround
            } = player;
            player.ax = -1;
            if (!jump) {
                player.animationState = 'walk-l';
            } else if (animationState[animationState.length - 1] === 'r') {
                player.animationState[animationState.length - 1] = 'l';
            } else {
                player.animationState = 'walk-l';
            }
            console.log('DDDDDDD');
            soundsBank.get('walking').play();
        }
        if (e.keyCode === 68 && !player.ax || e.keyCode === 68 && player.onGround) { //D
            const {
                animationState,
                jump,
                onGround
            } = player;
            player.ax = 1;
            if (!jump) {
                player.animationState = 'walk-r';
            } else if (animationState[animationState.length - 1] === 'l') {
                player.animationState[animationState.length - 1] = 'r';
            } else {
                player.animationState = 'walk-r';
            }
            soundsBank.get('walking').play();
        }

        if (e.keyCode === 84) { //T
            const {
                invetory,
                activeSlot,
                x,
                y
            } = player;
            const item = invetory[activeSlot];
            if (item.id !== -1) {
                soundsBank.get('plop').play();
                drops.push({
                    x: x,
                    y: y,
                    width: 25,
                    height: 25,
                    c: item.c,
                    id: item.id,
                    type: item.type,
                    timing: 0
                });
                player.invetory[player.activeSlot].id = -1;
                player.invetory[player.activeSlot].c = 0;
                player.invetory[player.activeSlot].type = -1;
            }
        } else if (e.keyCode === 112) { //F1
            devInfo = !devInfo;

        } else if (e.keyCode === 115) { //F4
            gamepadSettings.showGamepadSettings = !gamepadSettings.showGamepadSettings;
        } else if (e.keyCode === 69) {
            player.invetoryOpen = !player.invetoryOpen;
        }
    }




});

document.addEventListener('keyup',(e)=>{
    if (e.keyCode === 65 && player.ax){
        player.ax = 0;
        soundsBank.get('walking').pause();
        player.animationState = 'idle-l';
    } 
    if (e.keyCode === 68 && player.ax) {
        player.ax = 0;
        soundsBank.get('walking').pause();
        player.animationState = 'idle-r';
    }
});