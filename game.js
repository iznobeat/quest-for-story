import * as castleStory from './story.js';
import * as studioStory from './studio-story.js';
import * as civStory from './civ-story.js';
import {CivProps} from './civ-art.js';
import {StudioProps} from './studio-art.js';
const requestedEpisode=new URLSearchParams(location.search).get('episode');
const studio=requestedEpisode==='studio',civ=requestedEpisode==='civ',episodeId=civ?'civ':studio?'studio':'castle';
const story=civ?civStory:studio?studioStory:castleStory;
const {items,fresh,restore,act,talk,hint,objectives,replies,premise}=story;
const episode=story.episode||null;
const musicScene=id=>episode?.music?.[id]||(studio?(id==='courtyard'?'studio':'control'):id);
import {Characters,characterNames} from './characters.js';
import {Soundtrack} from './music.js';
import {splitSpeech,voices} from './dialogue.js';
const $=s=>document.querySelector(s),canvas=$('#world'),ctx=canvas.getContext('2d');
const preview=new URLSearchParams(location.search).get('preview')==='1';
const saveKey=civ?(preview?'quest-for-story-civ-preview-v1':'quest-for-story-civ-v1'):studio?(preview?'quest-for-story-studio-preview-v1':'quest-for-story-studio-v1'):(preview?'quest-for-story-preview-v2':'quest-for-story-v1');
let state=fresh(),verb='Walk to',selected=null,reveal=false,bubbleTimer,px=43,target=43,duel=0;
let facing=1,lastTime=0,speaker=null,speakUntil=0,pendingAction=null,gestureUntil=0,sceneFade=0;
let speechLines=[],speechIndex=0,afterSpeech=null,showRepliesImmediately=false,dialoguePartner='joachim',portraitFrame=-1;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
try{state=restore(JSON.parse(localStorage.getItem(saveKey)))}catch{}
const characters=new Characters();
for(const a of document.querySelectorAll('.episode-links a')){const u=new URL(a.href);if(preview)u.searchParams.set('preview','1');a.href=u.href;if(u.searchParams.get('episode')===episodeId)a.setAttribute('aria-current','page');}
const music=new Soundtrack(status=>{
 const button=$('#sound');button.innerHTML='♫ <span>Sound '+(status.enabled?'on':'off')+'</span>';
 button.setAttribute('aria-pressed',String(status.enabled));button.dataset.playing=String(status.playing);
 button.dataset.track=status.title;button.dataset.loopSeconds=String(status.seconds);
 button.title=status.enabled?(status.playing?`Playing: ${status.title} · ${status.seconds}s loop`:'Sound enabled — music starts with your first click'):'Enable the scene soundtrack';
 $('#music-label').textContent=status.enabled?`♫ ${status.title}`:'♫ Music paused';
});
const names=episode?.names||{courtyard:'THE CASTLE COURTYARD',amiga:'THE GRAND AMIGA DEPARTMENT',dos:'THE DOS DEPARTMENT · BØTTEKOTT',newsroom:'THE MIDNIGHT NEWSROOM'};
const rooms=episode?.rooms||{
 courtyard:[['amiga','Amiga department',16,31,16,46,'door'],['well','Wishing well',62,48,18,31,'object'],['sign','Signpost',85,40,13,33,'object'],['dos','DOS cupboard →',75,90,20,7,'exit'],['newsroom','Newsroom →',44,90,20,7,'exit']],
 amiga:[['zendar','Zendar',27,59,14,34,'person'],['haj','Haj',47,54,12,34,'person'],['mgjesdal','mgjesdal',59,61,14,36,'person'],['courtyard','← Courtyard',3,90,20,7,'exit']],
 dos:[['izno','Izno',22,44,16,50,'person'],['kiiim','Kiiim',53,40,18,54,'person'],['terminal','DOS terminal',74,26,16,34,'object'],['courtyard','← Courtyard',3,90,20,7,'exit']],
 newsroom:[['desk','Editorial desk',69,41,25,39,'object'],['press','Printing press',7,42,21,36,'object'],['courtyard','← Courtyard',3,90,20,7,'exit']]
};
// Feet are staged on the visible floor, independently of interaction bounds.
const staging=episode?.staging||{
 amiga:{zendar:{y:402,height:145},haj:{y:380,height:139},mgjesdal:{y:419,height:154}},
 dos:{izno:{y:406,height:205},kiiim:{y:406,height:228}}
};
const playerStaging={courtyard:{y:370,height:139},amiga:{y:414,height:154},dos:{y:421,height:215},newsroom:{y:418,height:205}};
const studioProps=studio?new StudioProps():civ?new CivProps():null;
const controlArt=new Image();if(studio)controlArt.src='assets/studio-control-v2.png';
const atlas=new Image();atlas.src=civ?'assets/civ-atlas.png':studio?'assets/studio-atlas.png':'assets/castle-atlas.png';
if(studio){document.title='Quest for Story — '+episode.title;$('.heading p').textContent=episode.title;$('.tagline').innerHTML='Two hosts. One missing take.<br>Absolutely no brakes on the dad jokes.';$('.edition span').textContent='VOL. 02 / ON AIR';$('.below div:nth-child(2) p').innerHTML='<strong>Back on the road. Back on the air.</strong><br>Two studio rooms. Three emergency groans.';}
if(civ){document.title='Quest for Story — '+episode.title;$('.heading p').textContent=episode.subtitle;$('.tagline').innerHTML=episode.tagline;$('.edition span').textContent=episode.edition;$('.below div:nth-child(2) p').innerHTML=episode.below;}
function save(manual=false){try{localStorage.setItem(saveKey,JSON.stringify(state));$('#save-status').textContent=preview?'Preview save · your main adventure is untouched':manual?'Game saved. Your scoop is safe.':'Adventure saved automatically'}catch{$('#save-status').textContent='Storage unavailable — keep this tab open'}}
function say(text,who='joachim'){startSpeech(text,who)}

function command(label){$('#command').textContent=selected?`Use ${items[selected][1]} with ${label||'…'}`:`${verb} ${label||'…'}`}
function button(text,onClick,className=''){const b=document.createElement('button');b.textContent=text;b.className=className;b.onclick=onClick;return b}
function render(){
 $('#location').textContent=names[state.scene];$('#chapter').innerHTML=episode?episode.chapter(state):state.won?'THE END <span>THE PEOPLE BEHIND THE PIXELS</span>':state.flags.evidence?'CHAPTER III <span>CHECK THE PERSON, NOT THE NAME</span>':state.flags.pass?'CHAPTER II <span>A DIRECTORY OF SUSPECTS</span>':'CHAPTER I <span>THE LAST BYTE BEFORE MIDNIGHT</span>';
 $('#verbs').replaceChildren();for(const v of ['Walk to','Look at','Talk to','Pick up','Use','Open'])$('#verbs').append(button(v,()=>{verb=v;selected=null;render()},v===verb?'active':''));
 $('#items').replaceChildren();for(const id of state.inventory){const b=button('',()=>{if(verb==='Look at'){say(items[id][2]);return}selected=selected===id?null:id;verb='Use';render()},'inv-item '+(selected===id?'selected':''));b.setAttribute('aria-label',items[id][1]);b.innerHTML=`<span class="item-icon">${items[id][0]}</span><small>${items[id][1]}</small>`;b.title=items[id][2];$('#items').append(b)}
 $('#item-count').textContent=state.inventory.length+' ITEMS';$('#hotspots').replaceChildren();
 for(const [id,label,x,y,w,h,type] of rooms[state.scene]){if(episode&&!episode.objectVisible(state,id))continue;const b=button('',e=>interact(id,type,x,w),'hotspot '+type);b.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`;b.setAttribute('aria-label',label);b.innerHTML=type==='exit'?label:`<span class="hot-label">${label}</span>`;b.onmouseenter=()=>command(label);b.onmouseleave=()=>command();$('#hotspots').append(b)}command();
}
function moveTo(x,action){target=Math.max(8,Math.min(92,x));pendingAction=action;if(reduced||Math.abs(target-px)<1){px=target;pendingAction=null;action?.()}}
function enter(id){state.scene=id;px=43;target=43;pendingAction=null;speaker=null;$('#bubble').textContent='';sceneFade=performance.now();music.change(musicScene(id));save();render()}
function interact(id,type,x,w){
 if(!$('#dialogue').hidden)return;
 const chosen=selected,chosenVerb=verb;
 if(chosen){selected=null;verb='Walk to';render();moveTo(x+w/2-8,()=>{const wasWon=state.won,before=state.inventory.length;const text=act(state,'Use',id,chosen);say(text,type==='person'?id:'joachim');if(before!==state.inventory.length||chosen==='notebook')music.effect();save();render();if(state.won&&!wasWon){music.effect('win');ending()}});return}
 if((type==='exit'||type==='door')&&['Walk to','Open','Use'].includes(verb)){moveTo(type==='exit'?x:x+w/2,()=>enter(id));return}
 if((studio&&id==='terminal'||episode?.interactive?.includes(id))&&verb==='Use'){moveTo(x-5,()=>conversation(id));return}
 if(verb==='Talk to'||(verb==='Walk to'&&type==='person')){moveTo(x-5,()=>conversation(id));return}
 if(verb==='Walk to'){moveTo(x+w/2-8,()=>say(act(state,'Look at',id)));return}
 moveTo(x+w/2-8,()=>{const before=state.inventory.length;say(act(state,chosenVerb,id));if(before!==state.inventory.length)music.effect();save();render()});
}
function startSpeech(text,partner='joachim',onDone=null,repliesReady=false){
 clearTimeout(bubbleTimer);$('#bubble').textContent='';
 speechLines=Array.isArray(text)?text:splitSpeech(text,partner);speechIndex=0;afterSpeech=onDone;showRepliesImmediately=repliesReady;
 dialoguePartner=voices[partner]?partner:'joachim';showSpeechTurn();
}
function showSpeechTurn(){
 if(speechIndex>=speechLines.length){const done=afterSpeech;afterSpeech=null;speaker=null;speakUntil=0;if(done)done();else closeConversation();return}
 const line=speechLines[speechIndex],voice=voices[line.speaker];
 if(line.speaker!=='joachim')dialoguePartner=line.speaker;
 const d=$('#dialogue');d.hidden=false;d.dataset.speaker=line.speaker;d.style.setProperty('--voice-color',voice.color);
 d.innerHTML='<div class="dialogue-person npc-person"><canvas class="portrait npc-portrait" width="96" height="96" role="img"></canvas><span class="npc-name"></span></div><div class="dialogue-body"><div class="speech-card" role="status"><strong></strong><p></p></div><div class="dialogue-choices" aria-label="Dialogue controls"></div></div><div class="dialogue-person joachim-person"><canvas class="portrait joachim-portrait" width="96" height="96" role="img" aria-label="Joachim portrait"></canvas><span>JOACHIM</span></div>';
 d.querySelector('strong').textContent=voice.name+(line.aside?' · '+line.aside:'');d.querySelector('p').textContent=line.text;
 d.querySelector('.npc-name').textContent=dialoguePartner==='joachim'?'':voices[dialoguePartner].name;
 d.querySelector('.npc-portrait').setAttribute('aria-label',voices[dialoguePartner].name+' portrait');
 d.querySelector('.npc-person').hidden=dialoguePartner==='joachim';
 speaker=line.speaker;speakUntil=performance.now()+Math.min(16000,1800+line.text.length*44);portraitFrame=-1;
 if(speechIndex===speechLines.length-1&&showRepliesImmediately&&afterSpeech){const ready=afterSpeech;afterSpeech=null;ready()}
 refreshPortraits(performance.now());
}
function refreshPortraits(t){
 if($('#dialogue').hidden)return;const frame=Math.floor(t/150);if(frame===portraitFrame)return;portraitFrame=frame;
 const speaking=t<speakUntil&&!reduced;
 characters.portrait($('#dialogue .npc-portrait'),dialoguePartner,{speaking:speaking&&speaker===dialoguePartner,time:t,reduced});
 characters.portrait($('#dialogue .joachim-portrait'),'joachim',{facing:-1,speaking:speaking&&speaker==='joachim',time:t,reduced});
}
function conversationChoices(id,choices){
 const host=$('#dialogue .dialogue-choices');host.replaceChildren();host.setAttribute('aria-label','Joachim’s replies');
 for(const label of choices){const topic=id+':'+label;const choice=button('› '+label,()=>{
  if(!state.visitedTopics.includes(topic)){state.visitedTopics.push(topic);save()}
  music.effect('talk');
  if(label==='Let’s duel.'){startSpeech([{speaker:'joachim',text:label}],'kiiim',()=>{duel=0;showDuel()})}
  else {const text=episode?story.choose(state,id,label):(replies[label]||'A fascinating lead.');save();render();startSpeech([{speaker:'joachim',text:label},...splitSpeech(text,id)],id,()=>episode?conversation(id):conversationChoices(id,choices),!episode);}
 });if(state.visitedTopics.includes(topic)){choice.classList.add('visited-topic');choice.title='Already discussed — click to hear again'}host.append(choice)}
 host.append(button('› I’ll get back to my investigation.',closeConversation));
}
function conversation(id){const [name,text,choices=[]]=talk(state,id);startSpeech(text,id,()=>conversationChoices(id,choices),true);save();render()}
function closeConversation(){
 $('#dialogue').hidden=true;speaker=null;speakUntil=0;speechLines=[];speechIndex=0;afterSpeech=null;portraitFrame=-1;
 clearTimeout(bubbleTimer);$('#bubble').textContent='';
}
const insults=[['Your story has no bite!',['Then you haven’t met my bytes.','I have a very large notebook.','At least it has a mouse.'],0],['You’re nothing but obsolete garbage!',['I’m more of a recycling enthusiast.','Then I’m here for garbage collection.','That’s a floppy accusation.'],1],['You’ll never escape my DOS empire!',['I’ll just reboot your ego.','Have you tried turning it off?','Funny. Your keyboard has an Escape key.'],2]];
function showDuel(){
 const [line,answers,correct]=insults[duel];
 startSpeech(line,'kiiim',()=>{
  const host=$('#dialogue .dialogue-choices');host.replaceChildren();
  answers.forEach((answer,i)=>host.append(button('› '+answer,()=>{
   if(i!==correct){music.effect('wrong');startSpeech([{speaker:'joachim',text:answer},{speaker:'kiiim',text:'Weak! Turn my own words against me.'}],'kiiim',showDuel);return}
   music.effect();startSpeech([{speaker:'joachim',text:answer}],'kiiim',()=>{
    duel++;if(duel===3){state.flags.duel=true;if(!state.notes.includes('Defeated Kiiim in an insult duel.'))state.notes.push('Defeated Kiiim in an insult duel.');say('A fatal exception… to my superiority. Fine. Read the disk. But the credits may contain scenes unsuitable for DOS loyalists.','kiiim');save();render()}else showDuel();
   });
  })));host.append(button('› I need to defragment my thoughts.',closeConversation));
 },true);
}

function modal(html){$('#modal-content').innerHTML=html;if(!$('#modal').open)$('#modal').showModal()}
function journal(){if(episode){modal(`<div class="eyebrow">${civ?'ONE MORE TURN INN · FIELD NOTES':'cd SPILL · STUDIO NOTES'}</div><h2>Joachim’s journal</h2><p>${premise}</p>${objectives.map(([key,title])=>`<p class="journal-entry ${state.flags[key]?'done':''}">${state.flags[key]?'✓':'○'} ${title}</p>`).join('')}<div id="field-notes"></div><p>${civ?'An original adventure parody. These are fictional character preferences; your favourite is your decision.':'A fictional adventure based on the supplied Test Drive III transcript; dialogue and puzzles are newly written.'}</p>`);for(const note of state.notes){const p=document.createElement('p');p.textContent=note;$('#field-notes').append(p)}return}modal(`<div class="eyebrow">SPILLHISTORIE.NO · FIELD NOTES</div><h2>Joachim’s journal</h2><p>${premise}</p>${objectives.map(([key,title])=>`<p class="journal-entry ${state.flags[key]?'done':''}">${state.flags[key]?'✓':'○'} ${title}</p>`).join('')}<div id="field-notes"></div><p class="source-link"><a href="https://spillhistorie.no/2024/11/27/the-story-of-the-amiga-cult-classic-twintris/" target="_blank" rel="noopener">Read the real Twintris investigation ↗</a></p>`);for(const note of state.notes){const p=document.createElement('p');p.textContent=note;$('#field-notes').append(p)}}
function ending(){closeConversation();if(episode){modal(typeof episode.ending==='function'?episode.ending(state):episode.ending);$('#keep-playing').onclick=()=>$('#modal').close();return}modal('<div class="eyebrow">EXHIBITION SAVED · FRONT PAGE MATERIAL</div><h2>The people behind the pixels.</h2><p class="byline">A story by Joachim Froholt · spillhistorie.no</p><p>The original credits, a witness, and Kiiim’s own account tell the same story: the castle’s lost demo was a collaboration. Kiiim wrote its Amiga code. Izno preserved it — and refused to erase the others.</p><p>AUTOEXEC.BAT is cancelled. The exhibition opens with every contributor credited, and a display on the DOS tools that helped make it possible. The little department finally has a story of its own.</p><p>Zendar reconnects the computers. mgjesdal polishes the display case. Izno changes his title to “Restoration Lead”. Kiiim insists he was only evil in compatibility mode.</p><p>“Thanks, Retrogamingpappa,” says everyone.</p><p>“I AM NOT RETROGAMINGPAPPA,” says Haj.</p><p>Joachim prints the denial in full. Some mysteries deserve a follow-up.</p><button class="action" id="keep-playing">Return to the castle</button>');$('#keep-playing').onclick=()=>$('#modal').close()}
$('#journal').onclick=journal;
$('#hint').onclick=()=>{const h=hint(state);modal(`<div class="eyebrow">NO PREMIUM HINT HOTLINE REQUIRED</div><h2>A little nudge</h2><p>${h[0]}</p><button class="action" id="more-hint">Make it a bigger nudge</button><p id="hint-answer"></p>`);$('#more-hint').onclick=()=>$('#hint-answer').textContent=h[1]};
$('#save').onclick=()=>save(true);
$('#hotspot-toggle').onclick=()=>{$('#scene').classList.toggle('reveal');reveal=!reveal;$('#hotspot-toggle').setAttribute('aria-pressed',reveal)};
$('.close').onclick=()=>$('#modal').close();
$('#about').onclick=()=>{if(civ){modal('<div class="eyebrow">EPISODE 03 · HEX APPEAL</div><h2>How to play</h2><p>'+episode.about+'</p><p>Click a person to talk. Choose a verb, then a target. Click inventory items to use them. J opens the journal, H gives hints, Escape cancels. No timer, deaths, or dead ends. This episode has its own save.</p>');return}if(studio){modal('<div class="eyebrow">EPISODE 02 · cd SPILL</div><h2>How to play</h2><p>'+premise+'</p><p>Choose a verb, then a target. Pick up items; click an inventory item and then its target to use it. Select Use, then click the rescue console for its controls. Talk to the hosts for clues and dad jokes.</p><p>J opens the journal, H gives progressive hints, Escape cancels. Click to advance dialogue; reply buttons select answers. Use the sparkle button to reveal objects.</p><p>No timer, deaths, or dead ends. Your studio and castle progress save separately. Switch episodes from the menu.</p><p>All host dialogue and studio mishaps are fictional. Inspired by their Test Drive III discussion; no podcast audio is reproduced.</p>');return}modal('<div class="eyebrow">PLEASE INSERT YOUR CURIOSITY</div><h2>How to play</h2><p>You are Joachim Froholt. Save the castle’s exhibition by recovering the vanished credits, checking your sources, and giving the villain a right of reply.</p><p>Click a doorway to travel or a person to talk. Choose a verb, then a target. Click an inventory item and then its target to use it. Your notebook records important witnesses.</p><p><b>J</b> opens the journal. <b>H</b> gives a hint. <b>Escape</b> cancels an action. The sparkle button reveals interactive objects.</p><p>Music is enabled by default and starts with your first click or key press. Each room has its own original extended theme; the musical-note button mutes it. No deaths, no real-time deadline, no dead ends.</p><p>A fictional comedy inspired by real game-history reporting. Haj’s disputed identity is a running joke, not a biographical claim. <a href="https://spillhistorie.no/2024/11/27/the-story-of-the-amiga-cult-classic-twintris/" target="_blank" rel="noopener">Read the real Twintris feature.</a></p><p>This browser-native game follows the SCUMM interaction model; it does not run inside ScummVM.</p>');};
function confirmRestart(){
 pendingAction=null;target=px;
 modal('<h2>Start a new adventure?</h2><p>This replaces your saved progress and returns Joachim to the episode’s starting room.</p><button class="action" id="confirm-new">Restart adventure</button><button class="action secondary" id="cancel-new">Keep my story</button>');
 $('#cancel-new').onclick=()=>$('#modal').close();
 $('#confirm-new').onclick=()=>{
  state=fresh();selected=null;verb='Walk to';duel=0;facing=1;gestureUntil=0;
  reveal=false;$('#scene').classList.remove('reveal');$('#hotspot-toggle').setAttribute('aria-pressed','false');
  closeConversation();enter('courtyard');$('#modal').close();
  say(episode?.intro||'Midnight exhibition. Missing credits. Kiiim has a batch file. I have a notebook. Let’s see whose story survives.');
 };
}
$('#restart-game').onclick=confirmRestart;
$('#menu').onclick=()=>{
 modal('<h2>Intermission</h2><p>The deadline is dramatic, not a real timer. Take your time.</p><button class="action" id="resume">Resume adventure</button><button class="action secondary" id="restart">Start a new story</button>');
 $('#modal-content').insertAdjacentHTML('beforeend','<nav class="episode-links" aria-label="Choose episode"><a href="?episode=castle'+(preview?'&preview=1':'')+'">01 · The Secret of the Bøttekott</a><a href="?episode=studio'+(preview?'&preview=1':'')+'">02 · Test Mic III: The Last Resort</a><a href="?episode=civ'+(preview?'&preview=1':'')+'">03 · Leisure Suit Joachim</a></nav>');
 $('#resume').onclick=()=>$('#modal').close();$('#restart').onclick=confirmRestart;
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){selected=null;verb='Walk to';pendingAction=null;target=px;closeConversation();render()}if(!$('#modal').open){if(e.key.toLowerCase()==='j')journal();if(e.key.toLowerCase()==='h')$('#hint').click()}});
document.addEventListener('click',e=>{
 if($('#dialogue').hidden||$('#modal').open||e.target.closest('.dialogue-choices button'))return;
 e.preventDefault();e.stopImmediatePropagation();speechIndex++;showSpeechTurn();
},true);
$('#scene').addEventListener('click',e=>{if(e.target!==canvas)return;moveTo((e.clientX-canvas.getBoundingClientRect().left)/canvas.clientWidth*100,null);selected=null;verb='Walk to';command()});
$('#sound').onclick=()=>music.toggle();
const unlock=e=>{if(e.target.closest?.('#sound'))return;music.unlock()};
document.addEventListener('pointerdown',unlock,{capture:true});document.addEventListener('keydown',unlock,{capture:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){music.fadeOut()}else if(music.enabled)music.unlock()});
function draw(t){
 const dt=Math.min((t-(lastTime||t))/1000,.05);lastTime=t;ctx.imageSmoothingEnabled=false;
 const delta=target-px,walking=Math.abs(delta)>.15;if(walking){facing=Math.sign(delta);px+=Math.sign(delta)*Math.min(Math.abs(delta),dt*24)}else if(pendingAction){const action=pendingAction;pendingAction=null;action()}
 if(atlas.complete&&atlas.naturalWidth){if(studio){if(state.scene==='newsroom'&&controlArt.complete&&controlArt.naturalWidth)ctx.drawImage(controlArt,0,0,controlArt.width,controlArt.height,0,0,768,432);else ctx.drawImage(atlas,0,state.scene==='courtyard'?0:atlas.height/2,atlas.width,atlas.height/2,0,0,768,432)}else{const i=['courtyard','amiga','dos','newsroom'].indexOf(state.scene);if(civ){const w=atlas.width/2,h=atlas.height/2;ctx.drawImage(atlas,(i%2)*w,Math.floor(i/2)*h,w,h,0,0,768,432)}else ctx.drawImage(atlas,(i%2)*768,Math.floor(i/2)*512+40,768,472,0,0,768,432)}}else{ctx.fillStyle='#192536';ctx.fillRect(0,0,768,432)}
 studioProps?.draw(ctx,state,episode);
 const aspect=(canvas.clientHeight/432)/(canvas.clientWidth/768),actors=[];
 for(const [id,,x,y,w,h,type]of rooms[state.scene])if(type==='person')actors.push({id,x:(x+w/2)*7.68,...staging[state.scene][id],facing:1});
 actors.push({id:'joachim',x:px*7.68,...(episode?episode.playerStaging[state.scene]:playerStaging[state.scene]),facing});actors.sort((a,b)=>a.y-b.y);
 for(const a of actors){const speaking=speaker===a.id&&t<speakUntil,gesture=a.id==='joachim'&&t<gestureUntil;characters.draw(ctx,a.x,a.y,a.id,{time:t,height:a.height,walking:a.id==='joachim'&&walking,facing:a.facing,speaking,gesture,aspect,reduced})}
 canvas.setAttribute('aria-label',`${names[state.scene]}. Joachim ${walking?'walking':'standing'}. ${speaker&&t<speakUntil?characterNames[speaker]+' speaking.':''}`);
 if(!episode&&state.scene==='courtyard'){ctx.fillStyle=`rgba(255,220,139,${.55+.3*Math.sin(t/530)})`;ctx.fillRect(550,289,3,3)}
 if(!reduced&&t-sceneFade<350){ctx.fillStyle=`rgba(8,13,22,${.5*(1-(t-sceneFade)/350)})`;ctx.fillRect(0,0,768,432)}
 refreshPortraits(t);
 requestAnimationFrame(draw);
}
render();music.scene=musicScene(state.scene);music.status();requestAnimationFrame(draw);
if(!state.notes.length)say(episode?.intro||'Midnight exhibition. Missing credits. Kiiim has a batch file. I have a notebook. Let’s see whose story survives.');
