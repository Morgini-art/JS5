class Block {
    constructor(id,chunkId,x, y, width, height, solid, options={}) {
        this.id = id;
        this.chunkId = chunkId;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.solid = solid;
        this.options = options;
    }


}

function drawBlock(block, ctx, img) {
    const {
        x,
        y,
        width,
        height,
        solid
    } = block;

    
//    console.log(img);
    ctx.drawImage(img, x, y);
    
    /*if (solid) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x+25,y+25, 10,  0, Math.PI*2);
        ctx.fill();
//        ctx.closePath();
    }*/
//    ctx.fillRect(x, y, width, height);
//    ctx.strokeRect(x, y, width, height);
}

function deleteBlock() {
    const x = camera.x + mouseX;
    const y = camera.y + mouseY;
    const mouseHitbox = new Hitbox(x, y, 1, 1);

    let obj;
    let chunkId = -1;
    for (const block of blocks) {
        if (checkCollisionWith(mouseHitbox, block)) {
            obj = block;
            chunkId = block.chunkId;
        }
    }   
    if (chunkId !== -1) {
        chunks[chunkId].data.forEach((block, i) => {
            if (block.x === obj.x && block.y === obj.y) {
                let destinationId = block.id;
                let destinationType = 0;
                let drop = true;
                
                if(specialDropsFromBlocks.has(destinationId)) {
                    const obj = specialDropsFromBlocks.get(destinationId);
                    destinationId = obj.id;
                    if (destinationId === -1) {
                        drop = false;
                    } else {
                        destinationType = obj.type;
                    }
                }
                console.log(destinationId, destinationType)
                
                if (drop) {
                    drops.push({x:block.x, y:block.y, type:destinationType,width:25,height:25, c:1,id:destinationId, timing:0});
                }
                
                chunks[chunkId].data.splice(i, 1);
                soundsBank.get('destroy').play();
            }
        });
    }
}

function createBlock() {
    const mx = camera.x + mouseX;
    const my = camera.y + mouseY;

    const x = Math.floor(mx / 50) * 50;
    const y = Math.floor(my / 50) * 50;
    
    const mouseHitbox = new Hitbox(x, y, 50, 50);
    
    if (!checkCollisionWith(player, mouseHitbox)) {

        let collide = false;
        for (const block of blocks) {
            if (checkCollisionWith(mouseHitbox, block)) {
                collide = true;
                break;
            }
        }
        if (!collide) {
            for (const chunk of chunks) {
                if (checkCollisionWith(mouseHitbox, chunk) && player.invetory[player.activeSlot].id !== -1 && player.invetory[player.activeSlot].type !== 1) {
                    let dId = player.invetory[player.activeSlot].id;
                    let opt = {};
                    
                    let ok = true;
                    
                    if (specialBlocksOptions.has(dId)) {
                        opt = specialBlocksOptions.get(dId);
                        
                        if (opt.require) {
                            ok = false;
                            const where = opt.where;
                            
                            const dis = [x+where[0]*50,y+where[1]*50];
                            for (const block of blocks) {
                                if (block.id === opt.require && block.x === dis[0] && block.y === dis[1]) {
                                    ok = true;
                                    break;
                                }
                            }
                            
                            if (opt.replaceTo) {
                                dId = opt.replaceTo;
                            }
                        } else {
                            if (opt.replaceTo) {
                                dId = opt.replaceTo;
                            }
                        }
                        
                    }
                    if (ok) {
                        chunks[chunk.id].data.push({
                            x: x,
                            y: y,
                            width: 50,
                            height: 50,
                            id: dId,
                            chunkId: chunk.id,
                            solid: !unsolidBlocks.some(el => el === dId),
                            options: opt
                        });
                        player.invetory[player.activeSlot].c--;
                        if (player.invetory[player.activeSlot].c === 0) {
                            player.invetory[player.activeSlot].id = -1;
                            player.invetory[player.activeSlot].type = -1;
                            if (player.activeSlot < 0) {
                                player.activeSlot = 0;
                            }
                        }
                    }
                    
                    
                    break;
                }
            }
        }
    }
}