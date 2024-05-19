function objectPhysics1(obj) {
    let onGround = false;
    for (const block of blocks) {
        if (block.solid && checkCollisionWith(obj, block)) {
            onGround = true;
            break;
        }
    }
    
    if (!onGround) {
        obj.y += 3 * deltaTime;
        
        let collide = false;
        for (const block of blocks) {
            if (block.solid && checkCollisionWith(obj, block)) {
                collide = true;
                break;
            }
        }
        if (collide) {
            onGround = true;
            obj.y -= 3 * deltaTime;
        }
    }
}

function objectPhysics2(obj) {
    
    /*for (const block of blocks) {
        if (block.solid && checkCollisionWith(obj, block)) {
            obj.onGround = true;
            break;
        }
    }*/
    
    if (obj.onGround && !obj.jump) {
        let ok = false;
        obj.y += 3 * deltaTime;
        
        for (const block of blocks) {
            if (block.solid && checkCollisionWith(obj, block)) {
                ok = true;
                break;
            }
        }
        if(!ok) {
            obj.onGround = false;
        } else {
            obj.y -= 3 * deltaTime;
        }
    }
    
    if (!obj.onGround && !obj.jump) {
        obj.y += 3 * deltaTime;
        
        let collide = false;
        for (const block of blocks) {
            if (block.solid && checkCollisionWith(obj, block)) {
                collide = true;
                break;
            }
        }
        if (collide) {
            obj.onGround = true;
            obj.y -= 3 * deltaTime;
        }
    }
    
    
    
    if (obj.jump) {
        obj.y -= 3 * deltaTime;
        obj.jumpCounter -= 3 * deltaTime;
//        console.log(obj.jumpCounter);
        
        let ok = true;
        
        for (const block of blocks) {
            if (block.solid && checkCollisionWith(obj, block)) {
                ok = false;
                break;
            }
        }
        if (!ok) {
            obj.onGround = false;
            obj.jump = false;
            obj.y += 3 * deltaTime;
        }
        
        if (obj.jumpCounter === 0) {
            obj.jump = false;
        }
    }
    
    
    
}

function playerPhysics() {  
    if (!player.onGround && !player.jump) {
        move(player, 0, 1, deltaTime);
        
        player.animationState = 'fall-'+player.animationState[player.animationState.length - 1];
        
        let collide = false;
        for (const block of blocks) {
            if (block.solid && checkCollisionWith(player, block)) {
                collide = true;
                break;
            }
        }
        if(collide) {
            player.onGround = true;
            move(player, 0, -1, deltaTime);
            
            if (player.y - player.startYFalling > 250) {
                dealDamage(player, player.life * ((player.y - player.startYFalling) / player.speed * 100 / 100000), 'fall');
            }
        }
    }
    
    if (player.jump) {
        move(player, 0, -1, deltaTime);
        
        let ok = true;
        
        for (const block of blocks) {
            if (block.solid && checkCollisionWith(player, block)) {
                ok = false;
                break;
            }
        }
        if(!ok) {
            player.onGround = false;
            player.jump = false;
        }
        
        player.jumpCounter -= player.speed * deltaTime;
        if(player.jumpCounter<=0) {
            player.jump = false;
            player.startYFalling = player.y;
        }
    }
    
    if (player.onGround && !player.jump) {
        let ok = false;
        move(player, 0, 1, deltaTime);
        
        if (player.animationState.includes('fall')) {
            player.animationState = 'idle-'+player.animationState[player.animationState.length-1];
        }
        
        for (const block of blocks) {
            if (block.solid && checkCollisionWith(player, block)) {
                ok = true;
                break;
            }
        }
        if(!ok) {
            player.onGround = false;
            player.startYFalling = player.y;
        } else {
            move(player, 0, -1, deltaTime);
        }
        
    }
}