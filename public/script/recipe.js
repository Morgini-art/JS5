function craftFromRecipe(reqs, subs, pro) {
    const copy = structuredClone(subs);
    
    console.log('Before:');
    console.log('Reqs:');
    reqs.forEach((z)=>{
        console.log(z);
    });
    console.log('Subs:', subs);
    
    reqs.forEach((req, z)=>{
        console.log('Req::', req);
        let count = 0;
        let cont = true;
        subs.forEach((sub, v) =>{
            if (cont && sub.id === req.id && sub.type === req.type) {
                console.log(count);
                count += Math.min(sub.c, req.c);
                sub.c -= Math.min(sub.c, req.c);
                console.log(count);
                if (sub.c === 0) {
                    sub.id = -1;
                }
                if (count === req.c) {
                    cont = false;
                }
            }
        });
        if (count === req.c) {
            console.log('Enough of:', req);
            req.id = -1;
        } else {
            console.log('Not enough of:', req);
            console.log('Failed', req);
            console.log('Copy::', copy);
            
            return copy;
            console.log('Copy not showed::', copy);
        }
    });
    
    console.log(reqs, reqs.every((el)=>el.id === -1));
    if (reqs.every((el)=>el.id === -1)) {
        for (const p of pro) {
            const freeIndex = subs.findIndex((el)=>el.id === -1);
            
//            freeIndex.id = pro.id;
//            freeIndex.c = pro.c;
            addItem(subs, freeIndex, p.id, p.c, p.type);
            
            console.log(subs.findIndex((el)=>el.id === -1));
        }
    }
    console.log('After:');
    console.log('Reqs:', reqs);
    console.log('Subs:', subs);
    return subs;
}