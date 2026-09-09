// Original compositions. MIDI pitches and note placement are authored here;
// no samples or melodies from existing games are used.
export const tracks = {
  civLobby: {title:'Leisure Suit, Serious Questions', bpm:102, root:48, mode:[0,2,3,5,7,9,10], progression:[0,3,0,4,5,3,1,4], lead:'triangle', motif:[7,9,10,9,7,4,6,7,11,10,9,7,6,4,3,4]},
  civLounge: {title:'Six Sides to Every Pickup Line', bpm:114, root:50, mode:[0,2,4,5,7,9,10], progression:[0,5,3,4,0,1,5,4], lead:'square', motif:[7,7,11,9,12,11,9,7,6,8,10,8,7,5,6,7]},
  civRetro: {title:'My First Save, My Last Dance', bpm:92, root:45, mode:[0,2,3,5,7,8,10], progression:[0,3,4,0,5,3,1,4], lead:'triangle', motif:[7,10,9,7,4,6,7,9,11,9,7,6,4,3,4,7]},
  civRoof: {title:'Seventh Heaven, One More Turn', bpm:88, root:53, mode:[0,2,4,5,7,9,11], progression:[0,2,5,3,0,4,1,4], lead:'triangle', motif:[11,9,7,9,12,11,9,7,8,10,12,14,11,9,7,6]},
  studio: {title:'Two Mics, No Brakes', bpm:104, root:48, mode:[0,2,4,5,7,9,11], progression:[0,5,1,4,0,3,1,4], lead:'triangle', motif:[7,7,9,11,10,8,9,7,4,6,8,7,5,4,6,7]},
  control: {title:'Reverse Gear, Forward Story', bpm:94, root:47, mode:[0,2,3,5,7,8,10], progression:[0,3,5,4,0,5,3,4], lead:'square', motif:[11,9,7,6,7,9,8,6,4,7,9,10,8,7,5,7]},
  courtyard: {title:'Moon over the Deadline', bpm:92, root:50, mode:[0,2,3,5,7,8,10], progression:[0,5,3,4,0,2,5,4], lead:'triangle', motif:[7,9,11,10,9,7,6,4,5,7,9,8,7,5,4,6]},
  amiga: {title:'Forty-two Rooms of RAM', bpm:112, root:48, mode:[0,2,4,5,7,9,11], progression:[0,3,5,4,0,5,1,4], lead:'square', motif:[7,9,11,14,12,11,9,7,8,10,12,10,9,8,6,7]},
  dos: {title:'The Bøttekott Waltz', bpm:78, root:45, mode:[0,1,3,5,7,8,10], progression:[0,1,0,4,5,3,1,4], lead:'sawtooth', motif:[7,8,7,4,6,7,3,4,8,10,8,7,6,4,3,0]},
  newsroom: {title:'The People Behind the Pixels', bpm:86, root:53, mode:[0,2,4,5,7,9,11], progression:[0,4,5,3,0,2,3,4], lead:'triangle', motif:[7,11,9,7,6,9,7,4,5,9,12,11,9,7,6,7]}
};
const pitch=(t,degree)=>t.root+12*Math.floor(degree/7)+t.mode[((degree%7)+7)%7];
export function compose(scene){
 const t=tracks[scene];if(!t)throw new Error('Unknown soundtrack');
 const beats=scene==='dos'?3:4, events=[];
 const add=(beat,n,dur,voice,velocity=.5)=>events.push({beat,n,dur,voice,velocity});
 for(let bar=0;bar<32;bar++){
  const section=Math.floor(bar/8),chord=t.progression[bar%8],start=bar*beats;
  // A / A variation / contrasting B / returning A, with different cadences.
  for(let step=0;step<beats*2;step++){
   const beat=start+step/2,degree=t.motif[(bar*3+step+(section===2?5:0))%16]+(section===2?-3:0);
   if(step%2===0||((bar+step)%3===0&&section!==0))add(beat,pitch(t,degree+(section===3&&bar%4===2?7:0)),step%2===0?.7:.35,'lead',.5);
   const arpeggio=[0,2,4,7,4,2,0,4][step%8];
   if(section!==0||bar>1)add(beat,pitch(t,chord+arpeggio),.22,'pluck',.25);
  }
  add(start,pitch(t,chord-7),beats*.8,'bass',.6);
  if(beats===4)add(start+2,pitch(t,chord-3),1.5,'bass',.45);
  for(const interval of [0,2,4])add(start,pitch(t,chord+interval),beats*.94,'pad',.16);
  if(section>0||scene==='amiga')for(let b=0;b<beats;b++){add(start+b,0,.1,b===0?'kick':b%2?'snare':'hat',.35);if(section!==2)add(start+b+.5,0,.06,'hat',.18)}
 }
 return {title:t.title,bpm:t.bpm,beats:32*beats,seconds:32*beats*60/t.bpm,events:events.sort((a,b)=>a.beat-b.beat)};
}
export class Soundtrack {
 constructor(onChange=()=>{}){this.enabled=true;this.scene='courtyard';this.onChange=onChange;this.ctx=null;this.channel=null;this.timer=null;this.pending=null;this.started=false;}
 status(){this.onChange({enabled:this.enabled,playing:!!this.ctx&&this.ctx.state==='running'&&this.enabled,title:tracks[this.scene].title,seconds:Math.round(compose(this.scene).seconds)})}
 async unlock(){if(!this.enabled)return;try{this.ctx??=new AudioContext();if(!this.pending){this.pending=this.ctx.resume();}await this.pending;this.pending=null;if(this.enabled&&(!this.started||!this.channel)){this.started=true;this.play(this.scene)}this.status()}catch{this.pending=null;this.status()}}
 async toggle(){this.enabled=!this.enabled;if(!this.enabled){this.fadeOut();this.status()}else await this.unlock()}
 fadeOut(){clearInterval(this.timer);this.timer=null;if(this.channel){const old=this.channel,t=this.ctx.currentTime;old.gain.gain.cancelScheduledValues(t);old.gain.gain.setTargetAtTime(0,t,.16);setTimeout(()=>old.gain.disconnect(),1300);this.channel=null}}
 change(scene){if(this.scene===scene)return;this.scene=scene;if(this.ctx?.state==='running'&&this.enabled)this.play(scene);this.status()}
 play(scene){this.fadeOut();const c=this.ctx,score=compose(scene),gain=c.createGain(),delay=c.createDelay(.6),echo=c.createGain();gain.gain.setValueAtTime(0,c.currentTime);gain.gain.linearRampToValueAtTime(.28,c.currentTime+.65);gain.connect(c.destination);delay.delayTime.value=60/score.bpm*.75;echo.gain.value=.15;delay.connect(echo);echo.connect(gain);this.channel={gain,delay};let index=0,cycle=0;const origin=c.currentTime+.08,spb=60/score.bpm,channel=this.channel;
 const schedule=()=>{if(this.channel!==channel)return;while(true){const event=score.events[index],at=origin+(cycle*score.beats+event.beat)*spb;if(at>c.currentTime+.18)break;if(at>=c.currentTime-.03)this.note(event,Math.max(at,c.currentTime),spb,channel,tracks[scene]);index++;if(index===score.events.length){index=0;cycle++}}};schedule();this.timer=setInterval(schedule,60);this.status()}
 note(e,at,spb,ch,track){const c=this.ctx,duration=e.dur*spb,g=c.createGain();g.connect(ch.gain);let source;
 if(['hat','snare'].includes(e.voice)){const length=Math.ceil(c.sampleRate*duration),buffer=c.createBuffer(1,length,c.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1);source=c.createBufferSource();source.buffer=buffer;const filter=c.createBiquadFilter();filter.type='highpass';filter.frequency.value=e.voice==='hat'?7000:1600;source.connect(filter);filter.connect(g)}
 else{source=c.createOscillator();source.type=e.voice==='lead'?track.lead:e.voice==='pluck'?'triangle':e.voice==='pad'?'sine':'triangle';const hz=440*2**((e.n-69)/12);source.frequency.setValueAtTime(e.voice==='kick'?110:hz,at);if(e.voice==='kick')source.frequency.exponentialRampToValueAtTime(35,at+duration);if(e.voice==='lead'&&track.lead!=='triangle'){const filter=c.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1700;source.connect(filter);filter.connect(g)}else source.connect(g);}
 const volume=e.velocity*(e.voice==='pad'?.14:e.voice==='lead'?.22:e.voice==='hat'?.06:.18);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(volume,at+(e.voice==='pad'?.13:.009));g.gain.exponentialRampToValueAtTime(.0001,at+Math.max(.15,duration));if(e.voice==='lead'||e.voice==='pluck')g.connect(ch.delay);source.start(at);source.stop(at+Math.max(.16,duration)+.04);source.onended=()=>{source.disconnect();g.disconnect()}}
 effect(kind='item'){if(!this.enabled||this.ctx?.state!=='running'||!this.channel)return;const notes=kind==='win'?[72,76,79,84]:kind==='wrong'?[48,47]:[72,79];notes.forEach((n,i)=>this.note({n,dur:.23,voice:'pluck',velocity:.55},this.ctx.currentTime+i*.09,1,this.channel,tracks[this.scene]))}
}
