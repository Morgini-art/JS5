class Item {
    constructor(id, c, name,type) {
        this.id = id;
        this.c = c;
        this.name = name;
        this.type = type;
    }
}

function invetoryMouseRightClick(e, object, opened=true) {
    const {
        invetory,
        invetoryHitboxSlots
    } = object;

    const mouseHitbox = new Hitbox(e.offsetX, e.offsetY, 1, 1);

    let id = -1;

    for (const slot of invetoryHitboxSlots) {
        if (slot.id === 5 && !opened) {
            break;
        } else {
            if (checkCollisionWith(mouseHitbox, slot)) {
                id = slot.id;
            }
        }
    }

    if (id !== -1) {
        if (invetory[id].id !== -1) {
            const {temp1} = invetoryMouseState;
            if (temp1.id === -1 || temp1.id === invetory[id].id && temp1.type === invetory[id].type) {
                object.invetory[id].c--;
                invetoryMouseState.temp1.id = invetory[id].id;
                invetoryMouseState.temp1.c++;
                invetoryMouseState.temp1.name = invetory[id].name;
                invetoryMouseState.temp1.type = invetory[id].type;
                invetoryMouseState.state = 2;
                if (object.invetory[id].c === 0) {
                    object.invetory[id].id = -1;
                    object.invetory[id].name = 0;
                    object.invetory[id].type = -1;
                }
            }
        }
    } else {
        deletingBlocksInterval = setInterval(deleteBlock, 100);
    }
}

function invetoryMouseLeftClick(e, object, opened=true) {
    const {
        invetory,
        invetoryHitboxSlots
    } = object;
    
    const mouseHitbox = new Hitbox(e.offsetX, e.offsetY, 1, 1);

    let id = -1;
    
    for (const slot of invetoryHitboxSlots) {
        if (slot.id === 5 && !opened) {
            break;
        } else {
            if (checkCollisionWith(mouseHitbox, slot)) {
                id = slot.id;
            }
        }
    }
    
    if (id !== -1) {
        if (invetoryMouseState.state === 0) {
            if (object.invetory[id].id !== -1) {
                //Save to memory and delete orginal
                invetoryMouseState.state = 1;
                invetoryMouseState.startId = id;
                invetoryMouseState.temp1 = {
                    id: object.invetory[id].id,
                    c: object.invetory[id].c,
                    name: object.invetory[id].name,
                    type: object.invetory[id].type
                };
                //                    delete object.invetory[invetoryMouseState.startId].name;
                object.invetory[id].id = -1;
                object.invetory[id].c = 0;
                object.invetory[id].type = -1;
            }
        } else if (invetoryMouseState.state === 1 || invetoryMouseState.state === 2) {
            invetoryMouseState.state = 0;

            if (invetory[id].id === -1) { //Empty - save
                object.invetory[id].id = invetoryMouseState.temp1.id;
                object.invetory[id].c = invetoryMouseState.temp1.c;
                object.invetory[id].name = invetoryMouseState.temp1.name;
                object.invetory[id].type = invetoryMouseState.temp1.type;
                invetoryMouseState.temp1.id = -1;
                invetoryMouseState.temp1.c = 0;
                invetoryMouseState.temp1.type = -1;
                invetoryMouseState.startId = -1;
            } else if (invetory[id].id === invetoryMouseState.temp1.id && invetory[id].type !== 1 && invetoryMouseState.temp1.type !== 1) { //Same - add to counter
                console.log('FFFFFFFFFDSAS', invetory[id].type, invetoryMouseState.temp1.type);
                object.invetory[id].c += invetoryMouseState.temp1.c;
                invetoryMouseState.temp1.id = -1;
                invetoryMouseState.temp1.c = 0;
                invetoryMouseState.startId = -1;
            } else { //Full - overwrite

                invetoryMouseState.temp2 = object.invetory[id];

                object.invetory[id] = invetoryMouseState.temp1;
                invetoryMouseState.state = 1;
                invetoryMouseState.temp1 = invetoryMouseState.temp2;
                invetoryMouseState.temp2 = 0;

                invetoryMouseState.state = 1;
            }
        }
    } else {
        creatingBlocksInterval = setInterval(createBlock, 100);
    }
}