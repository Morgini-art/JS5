class NPC {
    constructor(x, y ,width, height, behaviour, spritesheet) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.behaviour = behaviour;
        this.spritesheet = spritesheet;
        this.animationState = 'idle-r';
        this.onGround = false;
        this.jump = false;
        this.jumpCounter = 0;
    }
}

function drawNpc(ctx, npc) {
    const {x, y, width, height} = npc;
//    console.log(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
    
}

class ChickenBehaviour{
    constructor() {
        this.state = 'drifting';
        let r = Math.random();
        if (r > 0.5) {
            r = -1;
        } else {
            r = 1;
        }
        this.objectiveX = ~~(Math.random() * 300 + 150) * r;
        this.dir = 0;
        this.walk = true;
        this.wait = 0;
        this.time = 0;
    }
    
    init(npc) {
        const {x} = npc;
        const {objectiveX} = this;
        
        this.objectiveX += x;
        
        if (x > this.objectiveX) {
            this.dir = -1;
            npc.animationState = 'walk-'+'l';
        } else {
            this.dir = 1;
            npc.animationState = 'walk-'+'r';
        }
    }
    
    reinit(npc) {
        let r = Math.random();
        if (r > 0.5) {
            r = -1;
        } else {
            r = 1;
        }
        this.objectiveX = ~~(Math.random() * 300 + 150) * r;
        this.dir = 0;

        
        this.init(npc);
    }
    
    randomAwait() {
        this.wait = 1;
        this.time = ~~(Math.random() * 800 + 300);
    }
    
    loop(ctx ,npc, blocks,delta) {
        const {x, y, jump} = npc;
        const {objectiveX, dir, walk} = this;
        
        /*ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = 'blue';
        ctx.fillStyle = 'blue';
        ctx.fillText(npc.onGround+'/'+npc.jump+'/'+this.walk, x ,y );
        ctx.lineTo(objectiveX, y);
        ctx.stroke();
        ctx.closePath();*/
        
        
        
//        console.log(walk);
        if (walk && !jump) {
            
            let walked = false;
            
            if (dir === -1) {
                if (x >= objectiveX) {
                    npc.x += 0.5 * dir * delta;
                    walked = true;
                } else if (x < objectiveX) {
                    this.walk = false;
                    npc.animationState = 'idle-'+npc.animationState[npc.animationState.length - 1];
                    this.randomAwait();
                }
            } else {
                if (x <= objectiveX) {
                    npc.x += 0.5 * dir * delta;
                    walked = true;
                } else if (x > objectiveX) {
                    this.walk = false;
                    npc.animationState = 'idle-'+npc.animationState[npc.animationState.length - 1];
                    this.randomAwait();
                }
            }
            if (walked) {
                let ok = true;
                
                for (const block of blocks) {
                    if (checkCollisionWith(block, npc) && block.solid && npc.onGround) {
                        ok = false;
                        npc.x -= 0.5 * dir * delta;
                        npc.jump = true;
//                        this.walk = false;
                        npc.jumpCounter = 48;
                        break;
                    }
                }
            }
        } else if (this.wait) {
            this.time -= delta;
//            console.log(this.time)
            
            if (this.time <= 0) {
                this.wait = 0;
                this.walk = true;
                this.reinit(npc);
            }
        }
        
        
        /*if (jump) {
            
            npc.y -= 3;
            npc.jumpCounter -= 3;
            console.log(npc.jumpCounter);
            
//            if (npc.jumpCounter < 0) {
//                npc.jump = false;
//            }
        }*/
        
    }
}