function drawDrop(drop, ctx, img) {
    const {
        x,
        y,
        width,
        height
    } = drop;


    ctx.drawImage(img, x, y, 25, 25);
    ctx.fillStyle = '#f0e8af';
    if (drop.timing > 0) {
        ctx.fillRect(x, y, drop.timing/1001*25,25, 25);
    }
}

function actualDropsLoop() {
    actualDrops.forEach((drop, id) => {
        
        let drawingContext = [];
        if (!drop.type) { //x === 0
            drawingContext = blocksImgs;
        } else if (drop.type === 1) { 
            drawingContext = itemsImgs;
        }
    
        drawDrop(drop, ctx, drawingContext[drop.id]);
        objectPhysics1(drop);
        if (drop.timing && drop.timing !== -1) {
            drop.timing -= FPSObjective * deltaTime;
        }
        if (checkCollisionWith(player, drop) && !drop.timing) {
            drop.timing = 1001;
        } else if (checkCollisionWith(player, drop) && drop.timing < 0) {
            const {invetory} = player;
            
            if (drop.type !== 2 && invetory.some(el => el.id === drop.id && el.type === drop.type)) {
                player.invetory[invetory.findIndex(el=>el.id === drop.id && el.type === drop.type)].c += drop.c;
                delete drops[drop.orginalId];
            } else if (invetory.some(el => el.id === -1)) {
                const index = invetory.findIndex(el=>el.id === -1);
                player.invetory[index].id = drop.id;
                player.invetory[index].name = gameNames[drop.type].get(drop.id);
                player.invetory[index].c = drop.c;
                player.invetory[index].type = drop.type;
                delete drops[drop.orginalId];
            }
            
        } else if (!checkCollisionWith(player, drop)) {
            drop.timing = 0;
        }
    });
}