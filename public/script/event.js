//Mouse
canView.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
        clearInterval(creatingBlocksInterval);
    } else if (e.button === 2) {
        clearInterval(deletingBlocksInterval);
    }
});

canView.addEventListener('mousedown', (e) => {
    const {button, shiftKey, offsetX, offsetY} = e;
    
    if (button === 0) {
        if(shiftKey) {
            player.x = offsetX + camera.x;
            player.y = offsetY + camera.y;
        } else if (e.ctrlKey) {
            blocks.forEach((block)=>{
                if ([23, 24, 25].some(el => el === block.id)) {
                    block.id++;
                }
            });
        }
        
        invetoryMouseLeftClick(e, player, player.open);
        if (invetoryMouseState.activeChestInvetory) {
            invetoryMouseLeftClick(e, interactiveObjects.filter(e=>e.type === 1 && e.open)[0]);
        }
    } else if (button === 2) {
        invetoryMouseRightClick(e, player, player.open);
        if (invetoryMouseState.activeChestInvetory) {
            invetoryMouseRightClick(e, interactiveObjects.filter(e=>e.type === 1 && e.open)[0]);
        }
        
        const cursorHitbox = {x: offsetX + camera.x, y: offsetY + camera.y, width : 1, height : 1};
        const chests = interactiveObjects.filter(e=>e.type === 1);
        chests.forEach((chest, x)=>{
            if (checkCollisionWith(chest, cursorHitbox)) {
                if (invetoryMouseState.activeChestInvetory) {
                    chests.forEach((e, y)=>{if (x !== y) {e.changeOpenState(0)}});
                    invetoryMouseState.activeChestInvetory = false;
                }
                player.open = true;
                chest.changeOpenState();
                invetoryMouseState.activeChestInvetory = chest.open;
            }
        });
    }
});

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
        player.invetoryHitboxSlots.push({
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
            player.open = !player.open;
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