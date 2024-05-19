async function loadGame() {
    const sT = performance.now();
    
    const m = loadMap('map.map');
    const s = loadSpritesheets(warrior1Spritesheet);
    const c = loadSpritesheets(chicken1Spritesheet);
    const gBlocks = loadGraphisc('blocks',28, blocksImgs);
    const gItems = loadGraphisc('items',2, itemsImgs);
    
    
    
    Promise.all([m, s, c,gBlocks, gItems]).then((v)=>{
        const dT = performance.now() - sT;
        console.info('Game loaded',dT, v);
        console.info(chicken1Spritesheet);
        npcs[0].x = player.x;
        npcs[0].y = player.y;
        npcs[0].x -= 7 * 50;
        npcs[0].y -= 5 * 50;
        npcs[0].behaviour.init(npcs[0]);
        
        npcs[0].spritesheet = chicken1Spritesheet;
        
        npcs[1].x = player.x;
        npcs[1].y = player.y;
        npcs[1].x -= 8 * 50;
        npcs[1].y -= 5 * 50;
        npcs[1].behaviour.init(npcs[1]);
        
        npcs[1].spritesheet = chicken1Spritesheet;
        loop();
    });
}

function loadSpritesheets(map) {
        const sT = performance.now();
    return new Promise((resolve) => {

        const promises = [];

        map.forEach((spritesheet, key) => {
            promises.push(new Promise(res => {
                const old = map.get(key);
                map.get(key).img.onload = () => res({
                    img: old.img,
                    w: old.img.width,
                    h: old.img.height,
                    s: old,
                    n: key.split('-')[0] + '-l'
                });
            }));
        });

        Promise.all(promises).then(res => {
            console.log(res);
            let y = 0;
            for (const o of res) {
                ctxView.clearRect(0, 0, ctxView.width, ctxView.height);
                canView.width = o.w;
                canView.height = o.h;
                ctxView.save();
                ctxView.scale(-1, 1);
                ctxView.drawImage(o.img, -o.w, 0);
                ctxView.restore();
                map.set(o.n, new Spritesheet(canView.toDataURL(), o.s.allFrames, o.s.refreshTime, {
                    w: o.s.frameW,
                    h: o.s.frameH
                }, 1));
                map.get(o.n).frameCounter = o.s.allFrames - 1;
                map.get(o.n).oldRefreshTime = o.s.oldRefreshTime;
                map.get(o.n).refreshTime = o.s.refreshTime;
            }

            canView.width = 1300;
            canView.height = 800;

            console.log(map);
            
            const dT = performance.now() - sT;
            console.info(`End loading spritesheet ${dT}ms`);
            resolve(1);
        });

    });
}

function loadGraphisc(src, counter, array) {
    return new Promise(resolve => {
        const sT = performance.now();
        
        const promises = [];

        for (let el = 0; el < counter; el++) {
            array[el] = new Image();
            const path = `/img/${src}/${el}.png`;
            array[el].src = path;

            promises.push(new Promise(res => {
                array[el].onload = () => {
                    res(1);
                };
            }));
        }
        
        Promise.all(promises).then((v)=>{
            const dT = performance.now() - sT;
            console.info(`End loading ${src} graphisc ${dT}ms`);
            resolve(1);
        });
    });
}

function loadMap(mapName) {
    const sT = performance.now();
    return new Promise((resolve) => {
        
        fetch(mapName)
            .then((res) => {
                return res.json()
            })
            .then(data => {
                data.chunks.forEach((chunk, chunkId) => {
                    const correctBlocks = [];
                    for (const block of chunk.data) {
                        correctBlocks.push(new Block(block.id, chunkId, block.x, block.y, 50, 50, !unsolidBlocks.some(el => el === block.id)));
                    }

                    chunks.push({
                        x: chunk.x,
                        y: chunk.y,
                        width: 500,
                        height: 500,
                        data: correctBlocks
                    });
                });

                const dT = performance.now() - sT;
                mapSettings = data.mapInfo;
                const middleChunk = data.mapInfo.mapWidth / 2 * 50;
                player.x = middleChunk;
                player.y = 1650;
                player.startYFalling = 1650;
                console.info(`End loading map ${dT}ms`);
                resolve(1)

            })
            .catch((error) => {
                console.log(error)
            });

    });


}