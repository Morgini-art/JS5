function distanceBetweenPoints(obj1, obj2) {
    const dX = Math.abs(obj1.x - obj2.x);
    const dY = Math.abs(obj1.y - obj2.y);
    return Math.sqrt(dX ** 2 + dY ** 2);
}

function directionBetweenPoints(obj1, obj2) {
    const res = [];
    
    if (obj1.x < obj2.x) {
        res.push(1);
    } else {
        res.push(-1);
    }
    
    if (obj1.y > obj2.y) {
        res.push(1);
    } else {
        res.push(-1);
    }
    
    return res;
}

function numberToPercent(part, all) {
    return part / all * 100;
}

function percentFrom(percent, number) {
    return number * percent / 100;
}