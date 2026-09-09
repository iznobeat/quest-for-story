import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh,restore,act,choose,talk,hint,episode,editionNames,objectVisible,objectives,replies,mugJokes} from '../civ-story.js';
import {splitSpeech,voices} from '../dialogue.js';
import {CivProps} from '../civ-art.js';
const use=(s,item,target)=>act(s,'Use',target,item);
function checkin(s){act(s,'Pick up','comb');use(s,'comb','mirror');use(s,'invitation','bell')}
function pitches(s){
 choose(s,'terje','Found a city before ordering a palace');
 choose(s,'kiiim','Begin the hex-appeal challenge.');
 for(const line of ['You have tremendous hex appeal.','Just one more turn together?','Open borders, with mutual consent.'])choose(s,'kiiim',line);
 act(s,'Pick up','napkin');use(s,'napkin','board');choose(s,'board','Beside the mountains');use(s,'plan','izno');
 act(s,'Pick up','flower');act(s,'Pick up','ribbon');use(s,'ribbon','mirror');use(s,'bouquet','nikolai');choose(s,'nikolai','Why do YOU like VII?');
 choose(s,'haj','You are Retrogamingpappa, aren’t you?');use(s,'notebook','haj');
}
test('every Civilization can be chosen and has a reachable complete ending',()=>{
 for(const [id,name] of Object.entries(editionNames)){
  const s=fresh();checkin(s);pitches(s);use(s,'dancecard','machine');choose(s,'machine',name);use(s,'verdict','bell');
  assert(s.won);assert.equal(s.flags.choice,id);assert(objectives.every(([key])=>s.flags[key]));
  assert(episode.ending(s).includes(name));assert(episode.ending(s).includes('NOT RETROGAMINGPAPPA'));
 }
});
test('grooming, fair hearing, notebook and final ballot gates cannot be skipped',()=>{
 const s=fresh();use(s,'invitation','bell');assert(!s.flags.checkedIn);
 choose(s,'terje','Found a city before ordering a palace');choose(s,'kiiim','Begin the hex-appeal challenge.');assert(!s.flags.civ1);assert.equal(s.flags.flirt,undefined);
 checkin(s);use(s,'notebook','haj');assert(!s.flags.pirates);
 choose(s,'nikolai','Why do YOU like VII?');assert(!s.flags.civ7);
 use(s,'dancecard','machine');choose(s,'machine',editionNames.vii);assert(!s.flags.ballot);assert(!s.flags.choice);
 use(s,'verdict','bell');assert(!s.won);
 pitches(s);use(s,'dancecard','machine');choose(s,'machine',editionNames.v);choose(s,'machine',editionNames.vii);
 assert.equal(s.flags.choice,'vii');assert(!s.won);use(s,'verdict','bell');assert(s.won);
});
test('wrong puzzle answers preserve progress and mid-challenge saves resume',()=>{
 const s=fresh();checkin(s);choose(s,'terje','Demand better graphics');assert(!s.flags.civ1);
 choose(s,'kiiim','Begin the hex-appeal challenge.');choose(s,'kiiim','I prefer triangles.');assert.equal(s.flags.flirt,0);
 choose(s,'kiiim','You have tremendous hex appeal.');const resumed=restore(JSON.parse(JSON.stringify(s)));
 assert.equal(resumed.flags.flirt,1);assert(talk(resumed,'kiiim')[1].includes('evening'));
 choose(resumed,'kiiim','Just one more turn together?');choose(resumed,'kiiim','Open borders, with mutual consent.');assert(resumed.flags.civ5);
 act(s,'Pick up','napkin');use(s,'napkin','board');choose(s,'board','Under the disco ball');assert(!s.inventory.includes('plan'));
 assert.doesNotThrow(()=>talk(restore({...s,flags:{flirt:100}}),'kiiim'));
});
test('consumed rose and ribbon stay gone and collection never duplicates rewards',()=>{
 const s=fresh();s.scene='dos';const art=Object.create(CivProps.prototype);art.image={};art.cells={flower:{x:1,y:2,w:3,h:4}};
 let count=0;const ctx={drawImage(){count++}};art.draw(ctx,s,episode);assert.equal(count,1);
 act(s,'Pick up','flower');art.draw(ctx,s,episode);assert.equal(count,1);
 act(s,'Pick up','ribbon');use(s,'flower','mirror');assert(s.inventory.includes('bouquet'));assert(!s.inventory.includes('flower'));
 const resumed=restore(JSON.parse(JSON.stringify(s)));assert(!objectVisible(resumed,'flower'));assert(!objectVisible(resumed,'ribbon'));
 act(resumed,'Pick up','flower');assert(!resumed.inventory.includes('flower'));
 checkin(resumed);use(resumed,'bouquet','nikolai');choose(resumed,'nikolai','Why do YOU like VII?');choose(resumed,'nikolai','Why do YOU like VII?');
 assert.equal(resumed.notes.length,new Set(resumed.notes).size);
 for(const item of ['comb','napkin']){act(resumed,'Pick up',item);act(resumed,'Pick up',item)}assert.equal(resumed.inventory.length,new Set(resumed.inventory).size);
});
test('new exchanges use valid speaking portraits and all mugs are reachable',()=>{
 for(const text of [...Object.values(replies),...Object.values(mugJokes)])for(const line of splitSpeech(text))assert(voices[line.speaker]);
 const ids=Object.values(episode.rooms).flat().map(r=>r[0]);for(const id of Object.keys(mugJokes))assert(ids.includes(id));
 for(const [scene,room] of Object.entries(episode.rooms))for(const [id,,, ,,,type] of room)if(type==='exit')assert(episode.rooms[id]);else if(type==='person')assert(episode.staging[scene][id]);
 assert.match(hint(fresh())[1],/comb/);assert.equal(restore({episode:'studio'}).episode,'civ');
});
