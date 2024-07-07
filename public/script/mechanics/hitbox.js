class Hitbox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

function checkCollisionWith(hitbox1, hitbox2) {
    if (hitbox1.x < hitbox2.x + hitbox2.width &&
        hitbox1.x + hitbox1.width > hitbox2.x &&
        hitbox1.y < hitbox2.y + hitbox2.height &&
        hitbox1.height + hitbox1.y > hitbox2.y) {

        return true;

    } else {
        return false;
    }
}

function checkCollisionWithLines(x1, y1, x2, y2, x3, y3, x4, y4) { //Line, line
    const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return true;
    }
    return false;
}

function checkCollisionWithLineRectangle (x1, y1, x2, y2, hitbox) { //Line, Rect
    const {x, y, width, height} = hitbox;
    const left = checkCollisionWithLines(x1, y1, x2, y2, x, y, x, y + height);
    const right = checkCollisionWithLines(x1, y1, x2, y2, x + width, y, x + width, y + height);
    const top = checkCollisionWithLines(x1, y1, x2, y2, x, y, x + width, y);
    const bottom = checkCollisionWithLines(x1, y1, x2, y2, x, y + height, x + width, y + height);
    
    if (left || right || top || bottom) {
        return true;
    }
    return false;
}


function checkCollisionWithLinesSpecial(x1, y1, x2, y2, x3, y3, x4, y4) { // Line, line
    const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        const x = x1 + (uA * (x2-x1));
        const y = y1 + (uA * (y2-y1));
        return {bool:true, x:~~x, y:~~y};
    }
    return {bool:false};
}

function checkCollisionWithLineRectangleSpecial(x1, y1, x2, y2, hitbox) {  //Line, rect
    const {x, y, width, height} = hitbox;
    const left = checkCollisionWithLinesSpecial(x1, y1, x2, y2, x, y, x, y + height);
    const right = checkCollisionWithLinesSpecial(x1, y1, x2, y2, x + width, y, x + width, y + height);
    const top = checkCollisionWithLinesSpecial(x1, y1, x2, y2, x, y, x + width, y);
    const bottom = checkCollisionWithLinesSpecial(x1, y1, x2, y2, x, y + height, x + width, y + height);
    
    if (left.bool || right.bool || top.bool || bottom.bool) {
        let points = [];
        if (left.bool) {
            points.push(left.x,left.y);
        }
        if (right.bool) {
            points.push(right.x,right.y);
        }
        if (top.bool) {
            points.push(top.x,top.y);
        }
        if (bottom.bool) {
            points.push(bottom.x,bottom.y);
        }
        return {bool:true, points: points};
    }
    return {bool:false};
}