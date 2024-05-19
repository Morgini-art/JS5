function generatePlants(surfaceData, surfacePlantsDataOutput, biomesTemperatures, gameStructures) {
    const result = [];
    
    surfaceData.forEach((block, id) => {
        const r = Math.random();

        if (r < 0.18 && !result[id - 1] && !result[id - 2] && !result[id - 3] && !result[id - 4]) {
            result.push(1);
            if (biomesTemperatures[id] === 1) { //Tree
                const height = Math.floor(Math.random() * (7 - 4) + 4);

                surfacePlantsDataOutput.push({
                    x: block.x,
                    y: block.y - 50 - 0 * 50,
                    id: 12
                });
                for (let n = 1; n < height; n++) {
                    surfacePlantsDataOutput.push({
                        x: block.x,
                        y: block.y - 50 - n * 50,
                        id: 13
                    });
                }

                let leaves;
                if (height >= 6) {
                    leaves = gameStructures.get('tree-leaves-3');
                } else {
                    const d = Math.random();
                    if (d > 0.5) {
                        leaves = gameStructures.get('tree-leaves-2');
                    } else {
                        leaves = gameStructures.get('tree-leaves-1');
                    }
                }

                for (const block2 of leaves.blocks) {
                    surfacePlantsDataOutput.push({
                        x: block.x + (block2.x * 50),
                        y: block.y - height * 50 + (block2.y * 50),
                        id: 10
                    });
                }
            } else if (biomesTemperatures[id] === 2) { //Cactus
                const height = Math.floor(Math.random() * (6 - 4) + 4);

                for (let n = 1; n < height; n++) {
                    surfacePlantsDataOutput.push({
                        x: block.x,
                        y: block.y - n * 50,
                        id: 18
                    });
                }
            }


        } else {
            result.push(0);

            if (biomesTemperatures[id] === 1) {
                const grass = Math.random();

                if (grass > 0.8) {
                    const wichGrass = Math.floor(Math.random() * 4 + 1);
                    surfacePlantsDataOutput.push({
                        x: block.x,
                        y: block.y - 50,
                        id: 18 + wichGrass
                    });
                }
            }


        }
    });
}

module.exports = {generatePlants};