function drawJoyState(ctx, axe, deadZone, maxWidth, startX, y) {
    ctx.fillStyle = '#c5d1c2';
    ctx.strokeRect(startX - maxWidth / 2, y, maxWidth, 15);

    if (Math.abs(axe) >= deadZone) {
        ctx.fillStyle = '#3ded1a';
    }


    ctx.fillRect(startX, y, ~~(maxWidth * axe / 2), 15);

    ctx.fillStyle = 'black';
    ctx.fillRect(startX, y, 1, 15);
    ctx.fillRect(startX - ~~(deadZone / 2 * maxWidth), y, 1, 15);
    ctx.fillRect(startX + ~~(deadZone / 2 * maxWidth), y, 1, 15);
}

function drawTriggerState(ctx, trigger, deadZone, maxWidth, startX, y) {
    ctx.fillStyle = '#c5d1c2';
    ctx.strokeRect(startX, y, maxWidth, 15);

    if (Math.abs(trigger) >= deadZone) {
        ctx.fillStyle = '#3ded1a';
    }

    ctx.fillRect(startX, y, ~~(maxWidth * trigger), 15);

    ctx.fillStyle = 'black';
    ctx.fillRect(startX, y, 1, 15);
    ctx.fillRect(startX + ~~(deadZone * maxWidth), y, 1, 15);
}