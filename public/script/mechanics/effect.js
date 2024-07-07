function dealDamage(object, dmg, dmgType) {
    if (dmgType === 'fall') {
        if (object.effects.some(e=>e.id === 0)) {
            console.warn(object.effects.find(e=>e.id === 0), object.effects.find(e=>e.id === 0).level);
            object.life -= dmg / (object.effects.find(e=>e.id === 0).level * 1.5);
        } else {
            object.life -= dmg;
        }
    }
}

class Effect {
    constructor(id, name, level, time) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.time = time;
    }
}

const restoreLifeEffectTable = [/*1*/2.6, 3, 3.4];

function effectsLoop(objects, delta) {
    for (const object of objects) {
        if (object.effects !== undefined) {
            object.effects.forEach((effect, i)=>{
                effect.time -= delta;
                
                if (effect.id === 1) {
                    if (object.life < object.maxLife) {
                        console.log(effect.level * 2 / 10);
                        const nLife = object.life + object.maxLife / Math.pow(10, 1*(6-restoreLifeEffectTable[effect.level-1]));
                        object.life = Math.min(nLife,object.maxLife);
                    }
                }
            });
            object.effects = object.effects.filter(e=>e.time > 0);
        }
    }
}

function applyEffect(object, effect, level, time) {
    object.effects.push(new Effect(effect[0], effect[1], level, time));
    console.warn(object.effects[object.effects.length - 1]);
}