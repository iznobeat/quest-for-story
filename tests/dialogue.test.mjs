import {test} from 'node:test';
import assert from 'node:assert/strict';
import {splitSpeech,voices} from '../dialogue.js';
test('exchanges display ordered turns without embedded speaker labels',()=>{
 const turns=splitSpeech('Izno: I kept the disk. Joachim: A backup plan? Izno: Precisely.','izno');
 assert.deepEqual(turns.map(({speaker,text})=>({speaker,text})),[{speaker:'izno',text:'I kept the disk.'},{speaker:'joachim',text:'A backup plan?'},{speaker:'izno',text:'Precisely.'}]);
});
test('offscreen Haj interruptions carry his portrait identity and stage direction',()=>{
 for(const aside of ['very far away','from across the room']){
 const turns=splitSpeech(`Kiiim: Retrogamingpappa! Haj, ${aside}: I AM NOT!`,'kiiim');
 assert.equal(turns[1].speaker,'haj');assert.equal(turns[1].aside,aside);assert.equal(turns[1].text,'I AM NOT!');
 }
});
test('unlabelled speech preserves normal colons and each character has a distinct colour',()=>{
 assert.deepEqual(splitSpeech('The answer: 42.','mgjesdal'),[{speaker:'mgjesdal',text:'The answer: 42.'}]);
 assert.equal(new Set(Object.values(voices).map(v=>v.color)).size,6);
});
