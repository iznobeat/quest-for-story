import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh,restore,act,choose,talk,hint,objectives} from '../studio-story.js';
import {fresh as castleFresh,restore as castleRestore} from '../story.js';
import {splitSpeech} from '../dialogue.js';
const use=(s,item,target)=>act(s,'Use',target,item);
const patch=s=>{act(s,'Pick up','cable');use(s,'cable','mixer')};
const rescue=s=>{for(const label of ['Press F6','Select manual reverse','Pacific → Yosemite'])choose(s,'terminal',label)};
const groans=s=>{choose(s,'mamen','Let’s record the dad jokes.');for(const label of ['It wanted an auto-biography.','It had a lot of moo-sings.','To improve its pickup.'])choose(s,'mamen',label)};
test('studio adventure can be completed with all seven objectives and distinct host speech',()=>{
 const s=fresh();patch(s);act(s,'Pick up','manual');rescue(s);groans(s);
 use(s,'notebook','mamen');use(s,'notebook','sigve');use(s,'take','mixer');
 const ending=use(s,'master','recorder');assert(s.won);assert(objectives.every(([id])=>s.flags[id]));
 assert.deepEqual(splitSpeech(ending).map(x=>x.speaker),['sigve','mamen','joachim']);
 assert.match(hint(s)[0],/ready/);
});
test('studio gates prevent premature recording and mixing, with useful recovery hints',()=>{
 const s=fresh();choose(s,'mamen','Let’s record the dad jokes.');assert.equal(s.flags.jokeRound,undefined);
 assert.match(use(s,'notebook','mamen'),/recover/);assert.match(use(s,'master','recorder'),/pick/);assert(!s.won);
 rescue(s);assert.match(use(s,'take','mixer'),/signal/);patch(s);
 assert.match(use(s,'take','mixer'),/groan/);groans(s);
 assert.match(use(s,'take','mixer'),/BOTH/);use(s,'notebook','sigve');assert.match(use(s,'take','mixer'),/BOTH/);
 use(s,'notebook','mamen');use(s,'take','mixer');assert(s.inventory.includes('master'));
});
test('wrong rescue and joke answers are retryable and cannot skip stages',()=>{
 const s=fresh();choose(s,'terminal','Pacific → Yosemite');assert(!s.flags.road);
 choose(s,'terminal','Press F6');choose(s,'terminal','Accelerate again');assert(!s.flags.reverse);
 choose(s,'terminal','Select manual reverse');choose(s,'terminal','Yosemite → Pacific');assert(!s.flags.recovered);
 choose(s,'terminal','Pacific → Yosemite');assert(s.flags.recovered);
 patch(s);choose(s,'mamen','Let’s record the dad jokes.');choose(s,'mamen','It had a meeting.');assert.equal(s.flags.jokeRound,0);
 choose(s,'mamen','It wanted an auto-biography.');assert.match(talk(s,'mamen')[1],/cow/);
 assert.doesNotThrow(()=>talk(restore({...s,flags:{...s.flags,jokeRound:99}}),'mamen'));
 const saved=restore(JSON.parse(JSON.stringify(s)));assert.equal(saved.flags.jokeRound,1);
 choose(saved,'mamen','It had a lot of moo-sings.');choose(saved,'mamen','To improve its pickup.');assert(saved.flags.jokes);
});
test('studio rewards are idempotent, either puzzle order works, and castle saves stay independent',()=>{
 const s=fresh();patch(s);groans(s);rescue(s);use(s,'notebook','sigve');use(s,'notebook','mamen');use(s,'take','mixer');
 for(let i=0;i<3;i++){act(s,'Pick up','cable');act(s,'Pick up','manual');use(s,'notebook','sigve');use(s,'take','mixer');choose(s,'terminal','Pacific → Yosemite')}
 assert.equal(s.inventory.length,new Set(s.inventory).size);assert.equal(s.notes.length,new Set(s.notes).size);
 use(s,'master','recorder');assert(restore(s).won);assert.deepEqual(restore(castleFresh()),fresh());
 const castle=castleFresh();castle.flags.hook=true;assert(castleRestore(castle).flags.hook);
 for(const invalid of [null,{}, {...s,scene:'dos'},{...s,inventory:['__proto__']},{...s,notes:[42]}])assert.deepEqual(restore(invalid),fresh());
});

test('collected studio props disappear immediately and stay gone after save restoration',async()=>{
 const {episode,objectVisible}=await import('../studio-story.js');
 const {StudioProps}=await import('../studio-art.js');
 const s=fresh();s.scene='newsroom';
 // Exercise the actual draw path without requiring a browser image decoder.
 const props=Object.create(StudioProps.prototype);props.image={};props.cells={cable:{x:0,y:0,w:10,h:10},manual:{x:20,y:0,w:10,h:10}};
 const drawn=[];const ctx={drawImage:(_,x)=>drawn.push(x)};
 props.draw(ctx,s,episode);assert.deepEqual(drawn,[0,20]);
 act(s,'Pick up','cable');drawn.length=0;props.draw(ctx,s,episode);assert.deepEqual(drawn,[20]);
 act(s,'Pick up','manual');const resumed=restore(JSON.parse(JSON.stringify(s)));
 drawn.length=0;props.draw(ctx,resumed,episode);assert.deepEqual(drawn,[]);
 assert(!objectVisible(resumed,'cable'));assert(!objectVisible(resumed,'manual'));
 assert(objectVisible(resumed,'mugCtrl'));
 const legacy=restore({...s,flags:{}});assert(!objectVisible(legacy,'cable'));
});
