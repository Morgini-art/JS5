const noise = require('./perlin').moduleP;

function generateOre(tY, incr, widthInp, heightInp, blockW, blockH, tender, oreName, oreId) {
    let timeY = tY;
    let increment = incr;
    let width = widthInp;
    let heigth = heightInp;
    let blockWidth = blockW;
    let blockHeight = blockH;

    let tenderness = tender;
    
    const result = [];

    for (let y = 0; y < heigth; y++) {
        let timeX = 0;
        for (let x = 0; x < width; x++) {
            const r = Math.abs(noise.perlin2(timeX, timeY) * 255);
            if (r >= tenderness) {
                result.push({x:x*blockWidth,y:y*blockHeight,type:oreName,id:oreId});
            }
            timeX += increment;
        }
        timeY += increment;
    }
    return result;
}

function generateStone(tY, incr, widthInp, heightInp, blockW, blockH, tender) {
    let timeY = tY;
    let increment = incr
    let width = widthInp;
    let heigth = heightInp;
    let blockWidth = blockW;
    let blockHeight = blockH;

    let tenderness = tender;
    
    const result = [];
    
    for (let y = 0; y < heigth; y++) {
        let timeX = 0;
        for (let x = 0; x < width; x++) {
            const r = Math.abs(noise.perlin2(timeX, timeY) * 255);
            if (r <= tenderness) {
                result.push({x:x*blockWidth,y:y*blockHeight+2500,id:0});
            }
            timeX += increment;
        }
        timeY += increment;
    }
    return result;
}

module.exports = {generateOre, generateStone};