const noise = require('./perlin').moduleP;

function generateSurface(input, temperature, changeMaxH=false,dy=0, maxH1=3000, maxH2=3000) {
    const result = [];
    let time = 0,
        time2 = 0;
    
    let inc = 0.045,
        inc2 = 0.06;
    
    let blockId = 5;
    
    let last = -1;
    
    let posX = 0;
    
    const {blockW, widthInp, generatorSettings, blockH} = input;
    
    let blockSize = blockW;
    
    for (let x = 0; x < widthInp; x++) {
            if (last !== temperature[x]) {
                const settings = generatorSettings.surface.index[temperature[x]];
                
                inc = settings.inc
                inc2 = settings.inc2;
                blockId = settings.top;
                
                if (changeMaxH) {
                    /*maxH1 = settings.maxHeight1;
                    maxH2 = settings.maxHeight2;*/
                    
                    if (settings.dyD !== undefined) {
                        dy += settings.dyD;
                    }
                }
                
                last = temperature[x];
            }    
        
            const r = noise.perlin2(time, 0)*maxH1;
            const r2 = noise.perlin2(time2, 0)*maxH2;
        
            let final = (r+r2) / 2;
            //let final = r2;
            final = Math.round(final / blockH) * blockH;
        
            result.push({x:posX, y:final+dy, /*h:blockH, w:blockW, */id:blockId});
            time += inc;
            time2 += inc2;
            posX+=blockSize;
    }
    
    return result;
}

module.exports = {generateSurface};