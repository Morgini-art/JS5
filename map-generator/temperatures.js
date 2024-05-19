const noise = require('./perlin').moduleP;

function generateBiomesTemperatures(input) {
    const {widthInp} = input;
    
    let time = 0,
        time2 = 0;
    let inc = 0.0045;
    let maxHeight = 1000;
    let posX = 0;
    const result = [];
    
    
    //SNOW, DESERT, TREE

    for (let x = 0; x < widthInp; x++) {
        const r = noise.perlin2(time, 0);
        let desId = 0;
        const temp = r * -10;
        let d = 0;
        if (temp < -1.6) {
            desId = 0;
        } else if (temp < 2) {
            desId = 10;
            d = 1;
        } else {
            desId = 11;
            d = 2;
        }
        result.push(d);
//        biomesTemperatures.push(2);
        
        
//        const r2 = noise.perlin2(time2, 0) * maxHeight;

        /*const final = Math.round(r * 2500 / blockH) * blockH;

        output.push({
            x: posX,
            y: final+1250,
            id: desId
        });*/
        time += inc;
//        posX += blockW;
    }
    
    return result;
}

module.exports = {generateBiomesTemperatures};