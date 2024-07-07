class InteractiveObject {
    constructor(x, y, width, height, solid, img, drawingOptions) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.solid = solid;
        this.img = img;
        this.drawingOptions = drawingOptions;
    }
}

function drawInteractiveObject(object) {
    const {x, y, width, height, img, drawingOptions} = object;
    ctx.drawImage( img[drawingOptions.frameId], x, y, width, height);
}

class Chest extends InteractiveObject {
    constructor(x, y, width, height, solid, img, drawingOptions, size, open=false) {
        super(x, y, width, height, solid, img, drawingOptions);
        this.open = open;
        this.invetory = [];
        this.type = 1;
        for (let i = 0; i < size; i++) {
            this.invetory[i] = new Item(-1, 0, -1);
        }
        this.invetoryHitboxSlots = [];
        generateChestSlotsInvetory(this.invetory, this.invetoryHitboxSlots);
    }
    
    changeOpenState(set=-1) {
        if (set === -1) {
            this.open = !this.open;
            if (this.drawingOptions.frameId) {
                this.drawingOptions.frameId = 0;
            } else {
                this.drawingOptions.frameId = 1;
            }
        } else {
            this.open = set;
            this.drawingOptions.frameId = set;
        }
    }
}

function generateChestSlotsInvetory(invetory, slotsHitbox) {
    let x = 0,
        y = 400,
        collisionId = -1;

    for (const item of invetory) {
        if (x === 5) {
            y += 60;
            x = 0;
        }
        const dX = 60 + x * 60;
        slotsHitbox.push({
            x: dX,
            y: y,
            width: 50,
            height: 50,
            id: collisionId = ((y - 400) / 60 * 5) + x
        });

        x++;
    }
}