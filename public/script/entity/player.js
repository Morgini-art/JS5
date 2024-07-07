class Player {
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
        this.life = maxLife / 2;
        this.maxLife = maxLife;
        this.invetory = [];
        this.activeSlot = 0;
        this.open = 0;
        this.animationState = 'idle-r';
        this.animationEndEvent = 0;
        this.animationEnd = 0;
        this.startYFalling = y;
        this.effects = [];
        this.invetoryHitboxSlots = [];
    }
}

function drawPlayer(player, ctx) {
    const {
        x,
        y,
        width,
        height
    } = player;

    ctx.strokeStyle = 'red';
    const drawX = ~~x;
    const drawY = ~~y;
}

function doWhilemove(player, blocks, dT) {
    const {
        speed,
        ax,
        ay,
        onGround
    } = player;

    if (ax || ay) {
        player.x += speed * ax * dT;
        player.y += speed * ay * dT;

        if (ax && onGround) {
            player.animationState = 'walk-' + player.animationState[player.animationState.length - 1];
        }


        let collide = false;
        for (const block of blocks) {
            if (block.solid && checkCollisionWith(player, block)) {
                collide = true;
                break;
            }
        }
        if (collide) {
            player.x -= speed * ax * dT;
            player.y -= speed * ay * dT;
        }
    }



}

function move(player, ax, ay, dT) {
    const {
        speed
    } = player;
    player.x += speed * ax * dT;
    player.y += speed * ay * dT;
}