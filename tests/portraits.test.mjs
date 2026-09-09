import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Characters} from '../characters.js';
test('all new portraits cycle mouth frames only while speaking',()=>{
 const characters=Object.create(Characters.prototype);
 characters.hostPortraitImage={complete:true,naturalWidth:1536,naturalHeight:1024};
 characters.guestPortraitImage=characters.hostPortraitImage;
 const calls=[],ctx={clearRect(){},drawImage(...args){calls.push(args)}};
 const canvas={width:96,height:96,getContext:()=>ctx};
 for(const [row,id] of ['mamen','sigve','nikolai','terje'].entries()){
  calls.length=0;
  for(let time=0;time<1200;time+=150)characters.portrait(canvas,id,{speaking:true,time});
  assert.deepEqual(new Set(calls.map(c=>c[1])),new Set([0,512,1024]));
  assert(calls.every(c=>c[2]===(row%2)*512&&c[5]===0&&c[6]===0),'Portrait position stays fixed');
  for(const options of [{speaking:false,time:150},{speaking:true,time:150,reduced:true}]){
   calls.length=0;characters.portrait(canvas,id,options);assert.equal(calls[0][1],0,'Closed mouth while listening or reducing motion');
  }
 }
});
