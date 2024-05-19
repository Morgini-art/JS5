class Spritesheet {
    constructor(src ,allFrames, refreshTime, frameSize, invert) {
        this.img = new Image();
        this.img.src = src;
        this.allFrames = allFrames;
        this.refreshTime = refreshTime;
        this.oldRefreshTime = refreshTime;
        this.frameCounter = 0;
        this.frameW = frameSize.w;
        this.frameH = frameSize.h;
        this.invert = invert;
    }
}

function drawFrame(ctx, spritesheet, obj, delta, options) {
    const {
        img,
        frameCounter,
        frameW,
        frameH,
        allFrames,
        invert
    } = spritesheet;
    const {
        x,
        y,
        width,
        height
    } = obj;
    
    const {dx, dy, wm, hm} = options;
//-60,  -95, *2, *2
    ctx.drawImage(img, frameCounter * frameW, 0, frameW, frameH, x + dx, y +dy, frameW * wm, frameH * hm);
    spritesheet.refreshTime-=delta;
    if (spritesheet.refreshTime <= 0) {
        if (invert) {
            spritesheet.frameCounter--;
            if (spritesheet.frameCounter <= 0) {
                spritesheet.frameCounter = allFrames - 1;
            }
        } else {
            spritesheet.frameCounter++;
            if (spritesheet.frameCounter === allFrames) {
                spritesheet.frameCounter = 0;
            }
        }

        spritesheet.refreshTime = spritesheet.oldRefreshTime;
    }
}