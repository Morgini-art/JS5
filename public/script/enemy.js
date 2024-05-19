class Enemy {
    constructor(x, y, width, height, speed, jumpHeight, maxLife) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.onGround = false;
        this.jump = false;
        this.jumpCounter = 0;
        this.jumpHeight = jumpHeight;
        this.ax = 0;
        this.ay = 0;
        this.life = maxLife;
        this.maxLife = maxLife;
        this.lastState = '';
        this.state1 = '';
        this.state2 = '';
//        this.invetory = [];
//        this.activeSlot = 0;
//        this.invetoryOpen = 0;
//        this.animationState = 'idle-r';
//        this.animationEndEvent = 0;
//        this.animationEnd = 0;
    }
}

function enemyAi(ctx ,enemy, player, blocks) {
    //UTILITY POINTS
    const {x, y, width, height} = enemy;
    
    const heads = [{x: x + width / 2, y: y},{x: player.x + player.width / 2, y: player.y}]
    const distance = ~~distanceBetweenPoints(heads[0], heads[1]);
    const directions = directionBetweenPoints(heads[0], heads[1]);
    let sightInfo = {bool: 0};
    
    for (const block of blocks) {
        const r = checkCollisionWithLineRectangleSpecial(heads[0].x, heads[0].y, heads[1].x, heads[1].y, block);
        if (r.bool) {
            sightInfo = r;
            break;
        }
    }
    
    ctx.strokeStyle = 'red';
    
    if (sightInfo.bool) {
        const {points} = sightInfo;
        const dis = [];
        for (let i = 0; i < points.length; i++) {
            const x = points[i];
            i++;
//            console.log(x, points[i]);
            dis.push(distanceBetweenPoints(heads[0], {x: x, y: points[i]}));
            
        }
        
        let resPoint = dis.indexOf(Math.min(...dis));
        console.log(dis,resPoint, points);
        ctx.fillRect(points[resPoint*2], points[resPoint*2+1], 5, 5);
//        console.log(sightInfo);
//        ctx.fillRect(sightInfo.points[0], sightInfo.points[1], 5, 5);
//        ctx.fillRect(sightInfo.points[2], sightInfo.points[3], 5, 5);
        ctx.strokeStyle = 'black';
    }
    
    
    ctx.beginPath();
    ctx.moveTo(heads[0].x, heads[0].y);
    ctx.lineTo(heads[1].x, heads[1].y);
    ctx.stroke();
    ctx.moveTo(heads[0].x, heads[0].y+height);
    ctx.lineTo(heads[1].x, heads[1].y+player.height);
    ctx.stroke();
    ctx.closePath();
    
    ctx.fillStyle = 'black';
    ctx.fillText(distance, heads[0].x, heads[0].y);
    ctx.fillText(directions[0]+','+directions[1], heads[0].x, heads[0].y+20);
        
}


function drawEnemy(ctx, enemy) {
    const {
        x,
        y,
        width,
        height
    } = enemy;
    
    ctx.strokeStyle = 'blue';
    ctx.fillStyle = 'green';
    const drawX = ~~x;
    const drawY = ~~y;
    
    ctx.fillRect(drawX, drawY, width, height);
    ctx.strokeRect(drawX, drawY, width, height);
}

/*function doWhilemove(enemy, blocks, dT) {
    const {
        speed,
        ax,
        ay,
        onGround
    } = enemy;

    
    enemy.x += speed * ax * dT;
    enemy.y += speed * ay * dT;
    
    if (ax && onGround) {
        enemy.animationState = 'walk-'+enemy.animationState[enemy.animationState.length - 1];
    }

    
    let collide = false;
    for (const block of blocks) {
        if (checkCollisionWith(enemy, block)) {
            collide = true;
            break;
        }
    }
    if (collide) {
        enemy.x -= speed * ax * dT;
        enemy.y -= speed * ay * dT;
    }

}*/

/*function move(enemy, ax, ay, dT) {
    const {
        speed
    } = enemy;
    enemy.x += speed * ax * dT;
    enemy.y += speed * ay * dT;
}*/