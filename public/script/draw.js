function drawUi() {
    //Player hp
    if (player.life > 0) {
        ctxView.fillStyle = '#c22f27';
        ctxView.fillRect(60, 50,percentFrom(numberToPercent(player.life, player.maxLife),300),30);
    }
    ctxView.strokeRect(60, 50,300,30);
    
    //Player effects
    player.effects.forEach((effect, y)=>{
        ctxView.fillStyle = '#d9991a';
        ctxView.fillRect(20, 50+y*25, 20,20);  
        drawTextOutline(~~(effect.time/1000), 20, 50+y*25+15, '1000 15px Monospace'); 
    });
    
    //Command console
    if (commandLine.active) {
        ctxView.globalAlpha = 0.5;
        ctxView.fillStyle = 'gray';
        ctxView.fillRect(0, 0, 1300, 23);
        drawTextOutline(commandLine.value, 0, 20, '1000 20px Monospace'); 
        ctxView.globalAlpha = 1;
    }
    
    //Invetory
    let y = 120;
    let x = 0;
    
    const {activeSlot, invetory, invetoryOpen} = player;
    
    ctxView.fillStyle = '#f0e8af';
    ctxView.fillRect(60+activeSlot*60, 120, 50, 50);
    
    
    for (const item of invetory) {
        if (x === 5) {
            if (invetoryOpen) {
                y += 60;
                x = 0;
            } else {
                break;
            }
        }
        
        const dX = 60 + x * 60;
        
        ctxView.strokeRect(dX, y, 50, 50);
        
        if (item.id !== -1) {
            let drawingContext = [];
            if (!item.type) { //x === 0
                drawingContext = blocksImgs;
            } else if (item.type === 1) { //
                drawingContext = itemsImgs;
            }
//            console.log(item);
            ctxView.drawImage(drawingContext[item.id],dX+12,y+12,25,25);
            drawTextOutline(item.c, dX+30, y+42, '1000 18px Monospace');
        }
        x++;
    }
    
    if (invetory[activeSlot].id !== -1) {
        const t = invetory[activeSlot].name;
        ctxView.textAlign = 'center';
        drawTextOutline(t+'-'+invetory[activeSlot].type, 210, 110, '1000 27px Monospace');
        ctxView.textAlign = 'left';
    }
    
    if (invetoryMouseState.state) {
        let drawingContext = [];
        if (!invetoryMouseState.temp1.type) { //x === 0
            drawingContext = blocksImgs;
        } else if (invetoryMouseState.temp1.type === 1) {
            drawingContext = itemsImgs;
        }
        
        if (invetoryMouseState.temp2) {
        ctxView.drawImage(drawingContext[invetoryMouseState.temp2.id],mouseX,mouseY,25,25);
        drawTextOutline(invetoryMouseState.temp2.c, mouseX+30, mouseY+42, '1000 18px Monospace');
            
        }
        ctxView.drawImage(drawingContext[invetoryMouseState.temp1.id],mouseX,mouseY,25,25);
        drawTextOutline(invetoryMouseState.temp1.c, mouseX+30, mouseY+42, '1000 18px Monospace');
    }
    
    //Dev info
    if (devInfo) {
        ctxView.font = '20px Monospace';
        ctxView.fillStyle = 'black';
        ctxView.strokeRect(1000, 60, 260, 330);
        ctxView.fillText('JS5 Dev', 1040, 100);
        ctxView.fillText('Chunks:' + actualChunks.length + '/' + chunks.length, 1040, 140);
        ctxView.fillText('Depth:' + ~~(player.y / 50), 1040, 170);

    }
    //Gamepad settings
    if (gamepadSettings.showGamepadSettings && gamepad) {
        const {
            deadZone1,
            deadZone2,
            triggers,
            ui
        } = gamepadSettings;
        
        const {axes, buttons} = gamepad;
        
        
        
        ctxView.globalAlpha = 0.8;
        ctxView.fillStyle = 'black';
        
        ctxView.fillRect(100, 100, 1100, 600);
        
        ctxView.fillStyle = ctxView.strokeStyle ='white';
        
        
        ctxView.textAlign = 'center';
        ctxView.fillText('Gamepad settings',650, 130);
        
        ctxView.strokeRect(120, 160, 160, 220);
        ctxView.fillText('Joy 1',200, 180);
        
        ctxView.strokeRect(120, 400, 160, 220);
        ctxView.fillText('Joy 2',200, 420);
        
        ctxView.strokeRect(300, 160, 200, 99);
        ctxView.fillText('Trigger left',400, 180);
        
        ctxView.strokeRect(300, 280, 200, 99);
        ctxView.fillText('Trigger right',400, 300);
        
        //Joy 1
        drawJoyState(ctxView, axes[0], deadZone1, 140, 200, 210);
        drawJoyState(ctxView, axes[1], deadZone1, 140, 200, 245);
        
        //Joy 2
        drawJoyState(ctxView, axes[2], deadZone2, 140, 200, 450);
        drawJoyState(ctxView, axes[3], deadZone2, 140, 200, 485);
        
        //Trigger left
        drawTriggerState(ctxView, buttons[6].value, triggers.left.deadZone, 180, 310, 200);
        drawTriggerState(ctxView, buttons[7].value, triggers.left.deadZone, 180, 310, 310);
        
        for (const input of ui.inputs) {
            input.draw();
        }
        
        ui.inputs[0].value = deadZone1;
        ui.inputs[1].value = deadZone2;
        
        ctxView.globalAlpha = 1;
    }
}