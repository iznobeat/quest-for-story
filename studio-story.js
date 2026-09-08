// Original fictional adventure inspired by the supplied cd SPILL Test Drive III transcript.
export const premise='Joachim visits the cd SPILL studio for a Test Drive III special. The microphones are silent, the final take is stranded in a driving demo, and the emergency outro is three dad jokes short. Help Mr. Mamen and Sigve get the episode back on the road.';
export const intro='A studio. Two microphones. Zero signal. I came for a Test Drive III story and apparently got the roadside-assistance package.';
export const items={
 notebook:['▤','Notebook','The plan: repair the signal, rescue the take, record a groan, and check the verdict with both hosts.'],
 cable:['⌁','Patch cable','An audio cable. For when your podcast needs a stronger connection than childhood friendship.'],
 manual:['▤','Driving notes','Episode notes: F6 returns you to the road. At the water’s edge, manual reverse can get you away from the drop. The route runs from Pacific to Yosemite. The hosts admired the ambition but found the driving frustrating.'],
 take:['▣','Recovered take','A recovered discussion of Test Drive III: ambitious 3D freedom, miserable steering. Take it to both hosts with your notebook.'],
 groan:['♫','Emergency groan','Three freshly recorded groans. Sustainably sourced dad-joke fuel.'],
 master:['▣','Episode master','The verified discussion, working microphones, and a thoroughly unnecessary joke outro. Use it on the recorder.']
};
export const fresh=()=>({version:1,episode:'studio',scene:'courtyard',inventory:['notebook'],flags:{},notes:[],visitedTopics:[],won:false});
export function restore(s){if(!s||s.episode!=='studio'||!['courtyard','newsroom'].includes(s.scene)||!Array.isArray(s.inventory)||!s.inventory.every(i=>Object.hasOwn(items,i))||!s.flags||typeof s.flags!=='object'||Array.isArray(s.flags)||!Array.isArray(s.notes)||!s.notes.every(x=>typeof x==='string'))return fresh();const flags={...s.flags};if(!Number.isInteger(flags.jokeRound)||flags.jokeRound<0||flags.jokeRound>2)delete flags.jokeRound;return {...fresh(),...s,won:s.won===true,flags,inventory:[...new Set(s.inventory)],visitedTopics:Array.isArray(s.visitedTopics)?s.visitedTopics.filter(x=>typeof x==='string'):[]};}
export const objectives=[['patched','Restore the microphone signal'],['recovered','Rescue the take from the driving demo'],['jokes','Record three emergency dad-joke groans'],['mamenOK','Check Mr. Mamen’s verdict with the notebook'],['sigveOK','Check Sigve’s verdict with the notebook'],['mastered','Assemble the episode at the mixer'],['won','Play the finished master on the recorder']];
function done(s,key,note){s.flags[key]=true;if(!s.notes.includes(note))s.notes.push(note)}
function give(s,id){if(!s.inventory.includes(id))s.inventory.push(id)}
export const mugJokes={
 mugDisk:'Joachim: “EAT. DISK. DRINK COFFEE.” Mamen: I asked for a byte with my coffee. They served me a floppy. Joachim: Was it any good? Mamen: A little hard to digest. Probably needed formatting.',
 mugCulture:'Joachim: “SPILL ♥ KULTUR.” Sigve: This cup is full of culture. Mamen: That is what happens when you leave the coffee here over summer. Joachim: Finally, a civilisation that fits in a mug.',
 mugStories:'Joachim: “LONG ADVENTURES. BETTER PEOPLE.” Mamen: This coffee has been brewing since the Monkey Island disk swap. Sigve: Is it still hot? Mamen: No, but it has an excellent backstory.',
 mug386:'Joachim: “386 4 LIFE.” Sigve: How many cups before this computer wakes up? Mamen: One. It only needs a single espresso core. Joachim: And absolutely no Java updates.',
 mugCtrl:'Joachim: “CTRL ALT SPILL.” Mamen: That is the emergency coffee shortcut. Sigve: What happens if you press it twice? Mamen: You reboot your trousers. Joachim: A full system wash.'
};
export function objectVisible(s,id){return !['cable','manual'].includes(id)||!(s.flags[id]||s.inventory.includes(id));}
export function act(s,verb,id,item){const f=s.flags;
 if(mugJokes[id])return verb==='Look at'?mugJokes[id]:verb==='Pick up'?'The mug stays here. I am collecting evidence, not everyone’s cold brew.':verb==='Use'?'I am not pouring coffee into the evidence. That is how you get a grounds for dismissal.':'Joachim: The mug declines to comment. A surprisingly well-trained source.';
 if(verb==='Look at')return ({
 mamen:'Mr. Mamen is considering whether this chair has a reverse gear. He can explain the lost take and supply the emergency dad-joke challenge.',
 sigve:'Sigve is guarding the microphone. In his defence, it has not crashed into a single cow.',
 mixer:f.patched?'The meters are moving. Use the recovered take here after collecting a groan and checking both hosts’ verdicts.':'The microphone input is empty. A label says PATCH CABLE → MIC IN. At last: a cable with a clear career path.',
 headphones:'Two pairs of headphones. Four ears. Still nobody heard the loose cable.',
 cable:f.cable?'An empty cable hook. Finally, wireless storage.':'A coiled patch cable hangs on the wall. Pick it up.',
 manual:'A marked-up set of driving notes lies on the archive desk. Pick it up: the rescue console follows the same logic.',
 terminal:'The editing machine has stranded the last take in a fictional Test Drive rescue demo. Use the console to get it back. The driving notes explain the controls.',
 recorder:f.mastered?'The recorder is ready. Use the episode master here for the final playback.':'The recorder waits for an episode master. It only accepts sound decisions. That is a lie; it also accepts dad jokes.'
 }[id]||items[id]?.[2]||'A lovingly overqualified collection of old computer equipment.');
 if(verb==='Pick up'&&['cable','manual'].includes(id)){if(!objectVisible(s,id))return 'Already in my inventory. Even this studio cannot duplicate a cable by wishing.';give(s,id);done(s,id,id==='cable'?'Collected the patch cable in the control room.':'Read the driving notes: F6, manual reverse, Pacific to Yosemite.');return id==='cable'?'A patch cable. I am now officially in a long-distance relationship with the mixer.':'The notes explain F6, manual reverse, and the Pacific-to-Yosemite route. An open world still needs directions.';}
 if(verb==='Use'||verb==='Give'){
  if(item&&!s.inventory.includes(item))return 'I need to pick that up first.';
  if(item==='cable'&&id==='mixer'){done(s,'patched','Patched the microphones into the mixer.');return 'Sigve: We have signal! Mamen: So this is a cable podcast now? Joachim: I’m putting that under technical difficulties.';}
  if(item==='manual'&&id==='terminal')return 'The notes are beside the keyboard. Use the console with no inventory item selected to choose the rescue controls.';
  if(item==='notebook'&&['mamen','sigve'].includes(id)){
   if(!f.recovered)return 'Let’s recover the original take first. A blank notebook is not a transcript.';
   done(s,id+'OK',id==='mamen'?'Mr. Mamen: an impressive and sometimes fun return, but too frustrating to say it has held up.':'Sigve: admire the freedom and exploration, but the difficult driving gets in the way.');
   return id==='mamen'?'Mamen: Keep both halves: I was impressed by what they achieved, and frustrated by playing it. It hasn’t held up for me. Joachim: Admiration is not the same as a recommendation. Got it.':'Sigve: Keep the exploration. Fields, an airport, things to discover! But don’t edit out how difficult it was to drive. Joachim: A love letter with a parking ticket attached.';
  }
  if(item==='take'&&id==='mixer'){
   if(!f.patched)return 'The mixer has no microphone signal. Find the patch cable in the control room.';
   if(!f.jokes)return 'The outro needs a groan track. Talk to Mr. Mamen about the emergency dad jokes.';
   if(!f.mamenOK||!f.sigveOK)return 'Check the recovered discussion with BOTH hosts. Use your notebook on each of them.';
   give(s,'master');done(s,'mastered','Mixed the checked discussion with a freshly recorded groan outro.');return 'The master is ready: open roads, closed-loop frustration, and three terrible jokes. Take it to the recorder for playback.';
  }
  if(item==='master'&&id==='recorder'){
   if(!f.mastered)return 'We need to finish the mix first.';
   s.won=true;done(s,'won','Played the completed studio master. The episode is ready for the hosts.');return 'Sigve: We’re back on the road! Mamen: And our podcast has finally passed its sound test. Joachim: Test Drive? More like Test Mic.';
  }
  if(item==='groan'&&id==='mixer')return 'The groan is ready. Use the recovered take here once both hosts have checked the story.';
  if(item==='take'&&['mamen','sigve'].includes(id))return 'That is the recovered discussion. Use the notebook on me to record my verdict.';
  if(item)return 'That connection does not work. We are testing a theory, not every socket in Norway.';
 }
 if(verb==='Pick up')return 'It belongs to the studio. My inventory is generous; their insurance is not.';
 if(verb==='Open')return 'Already open enough. Like the world in Test Drive III, but with fewer cows.';
 return 'Try looking, talking, or using an inventory item. The studio does not respond to interpretive driving.';
}
const mamenTopics=['How was that return trip?','Did you really commute in a supercar?','Did the weather impress you?','Is driver nine the best driver?'];
const sigveTopics=['What made this episode special?','You discovered two more radio songs?','Why were you inspecting the trees?','Did you find the airport?','How do we finish the recording?'];
const jokes=[
 ['Why did the car bring a notebook?',['To keep track of its mileage.','It wanted an auto-biography.','It had a meeting.'],1],
 ['Why did the cow start a podcast?',['It had important farm news.','It wanted a new microphone.','It had a lot of moo-sings.'],2],
 ['Why did the microphone go to driving school?',['To improve its pickup.','To get to work.','To buy a new cable.'],0]
];
export function talk(s,id){const f=s.flags;
 if(id==='terminal')return ['Joachim',f.recovered?'The take is safely recovered. No more parking in the sea.':!f.road?'The demo has gone off-road. Which control brings it back?':!f.reverse?'Back on a jetty, pointing at the water. Accelerating means another splash. How do we get clear?':'Finally facing inland. Which direction is the episode’s route?',f.recovered?[]:!f.road?['Press F1','Press F6','Floor the accelerator']:!f.reverse?['Accelerate again','Select manual reverse','Honk at the sea']:['Yosemite → Pacific','Pacific → Yosemite','Drive in circles']];
 if(id==='mamen')return ['Mr. Mamen',f.jokes?'Three groans. The emergency supply is full. Now check the recovered take with both of us.':f.jokeRound!==undefined?jokes[f.jokeRound][0]:'Welcome to cd SPILL! Our take is lost in the demo. The driving notes in the control room will help. And if we are going to save this outro, I need three dad jokes.',f.jokes?mamenTopics:f.jokeRound!==undefined?jokes[f.jokeRound][1]:['Let’s record the dad jokes.',...mamenTopics]];
 if(id==='sigve')return ['Sigve',f.patched?'Signal is back. Rescue the take at the control-room console, then use your notebook on both of us before mixing it.':'The microphones are silent. There’s a patch cable in the control room; use it on the mixer. I tried saying “open world” louder. Still nothing.',sigveTopics];
 return ['Joachim',act(s,'Look at',id),[]];
}
export const replies={
 'Did you really commute in a supercar?':'Mamen: I slowed right down so I could actually finish. Sigve: Lamborghini outside. Monday morning inside. Joachim: Did you at least beat the traffic? Mamen: I became the traffic. Sigve: Test Drive III: The Pension.',
 'Did the weather impress you?':'Mamen: Rain, dirt on the windscreen, working wipers! In a game this old! Joachim: Finally, Windows that clean themselves. Sigve: The wipers improved visibility enormously. Mamen: Yes. I could see exactly which tree I was about to hit.',
 'Is driver nine the best driver?':'Mamen: You would think a driver with skill nine would help. Sigve: Turns out it is difficulty, not a chauffeur service. Joachim: So what did you select? Mamen: One. Sigve: We looked for zero, but apparently that is a parked car.',
 'You discovered two more radio songs?':'Sigve: I spent my childhood hearing the same tune. Then Mamen pointed out there were two more. Joachim: Three songs? That is a generous streaming plan for 1990. Mamen: No adverts, either. Sigve: Unless you count the police interrupting to discuss my driving.',
 'Why were you inspecting the trees?':'Sigve: I had plenty of opportunities to examine the trees at close range. Joachim: Field research? Mamen: Mostly collision research. Sigve: I was checking the graphics. Joachim: Peer-reviewed by a pine. Mamen: The feedback was wooden.',
 'Did you find the airport?':'Sigve: You can explore the airport and watch a plane take off. Mamen: Meanwhile I was still trying to leave a jetty. Joachim: One of you found departures. The other found repeated arrivals. Sigve: At least my car was not on the runway. Mamen: Mine was more of a splashway.',

 'How was that return trip?':'Mamen: In the discussion, I tried driving slowly to keep control. At one point I ended up facing the water and kept losing lives. It was more commute than race. Joachim: A car crash course in patience.',
 'What made this episode special?':'Sigve: We talked about Test Drive III: The Passion. Driving away from the road, discovering animals and landmarks—remarkable ambition for 1990. Keeping the car under control was another matter. Joachim: Open world. Closed insurance claim.',
 'How do we finish the recording?':'Sigve: Patch the mixer, rescue the take, record Mamen’s three groans, then use the notebook on each of us. Put the recovered take into the mixer and the resulting master into the recorder.'
};
export function choose(s,id,label){const f=s.flags;
 if(id==='terminal'&&!f.recovered){
  const expected=!f.road?'Press F6':!f.reverse?'Select manual reverse':'Pacific → Yosemite';
  if(label!==expected)return !f.road?'Still in the field. The driving notes mention a function key.':!f.reverse?'The sea declines your request. No lives lost here; try a control that takes you away from it.':'The route starts by the ocean and heads inland. Check the driving notes.';
  if(!f.road){f.road=true;return 'F6 returns the demo to the road. Unfortunately, that road ends at a jetty. Use the console again.';}
  if(!f.reverse){f.reverse=true;return 'Manual reverse gets us away from the water. Finally, progress by going backwards. Use the console to choose the route.';}
  give(s,'take');done(s,'recovered','Recovered the take: F6 to road, manual reverse off the jetty, Pacific to Yosemite.');return 'The demo reaches its destination and releases the take. The information superhighway has a working exit!';
 }
 if(label==='Let’s record the dad jokes.'){
  if(!f.patched)return 'The microphone has no signal. Use a patch cable on the mixer before we record the groans.';
  f.jokeRound=0;return 'Three setups. Choose the answer with a double meaning. Talk to me again for the first one.';
 }
 if(id==='mamen'&&Number.isInteger(f.jokeRound)&&!f.jokes){const j=jokes[f.jokeRound];if(label!==j[1][j[2]])return 'That is a perfectly reasonable answer. Unfortunately, this is a dad-joke emergency. Find the pun and try again.';
  f.jokeRound++;if(f.jokeRound===3){delete f.jokeRound;give(s,'groan');done(s,'jokes','Recorded three groans: auto-biography, moo-sings, and microphone pickup.');return 'Mamen: Uuuugh. Sigve: That last one had excellent pickup. Joachim: And terrible delivery. The groan track is ready.';}return 'Mamen: Uuuugh. That one is going on the record. Talk to me for the next setup.';
 }
 return replies[label]||'Let’s check the studio.';
}
export function hint(s){const f=s.flags;return s.won?['The studio master is ready. Enjoy the victory lap.','Switch episodes from the menu to revisit the castle.']:!f.patched?['The silence has a loose end.','Pick up the patch cable in the control room; use it on the studio mixer.']:!f.recovered?['The driving notes explain how to rescue the take.','Use the control-room console: F6, manual reverse, then Pacific → Yosemite.']:!f.jokes?['Mamen needs wordplay, not sensible answers.','Talk to Mamen: record dad jokes, then choose auto-biography, moo-sings, and improve its pickup.']:!f.mamenOK||!f.sigveOK?['A take is not checked until both hosts have heard your conclusion.','Use your notebook on Mr. Mamen and Sigve.']:!f.mastered?['The mixer can combine the recovered take with the outro.','Use the recovered take on the studio mixer.']:['One last playback.','Use the episode master on the control-room recorder.'];}
export const episode={
 title:'Test Mic III: The Last Resort',intro,objectVisible,
 props:[['cable',68.8,11,3.5,16],['manual',48,36.5,6,3.4]],
 playerStaging:{courtyard:{y:414,height:244},newsroom:{y:414,height:244}},
 names:{courtyard:'cd SPILL · RECORDING STUDIO',newsroom:'cd SPILL · CONTROL ROOM'},
 rooms:{courtyard:[['mamen','Mr. Mamen',18,24,17,62,'person'],['sigve','Sigve',73,24,17,62,'person'],['mixer','Mixing console',40,45,18,25,'object'],['headphones','Headphones',86,24,10,34,'object'],['mugDisk','Disk coffee mug',32,46,5,12,'object'],['mugCulture','Culture mug',57,46,5,12,'object'],['mugStories','Adventure mug',69,49,5,13,'object'],['newsroom','Control room →',72,90,25,7,'exit']],newsroom:[['terminal','Rescue console',14,10,14,25,'object'],['manual','Driving notes',48,35,6,6,'object'],['cable','Patch cable',68,10,5,19,'object'],['recorder','Master recorder',77,14,14,25,'object'],['mug386','386 coffee mug',10,29,4,7,'object'],['mugCtrl','Ctrl Alt Spill mug',64,31,5,8,'object'],['courtyard','← Recording studio',3,90,29,7,'exit']]},
 staging:{courtyard:{mamen:{y:382,height:244},sigve:{y:382,height:244}}},
 chapter:s=>s.won?'EPISODE COMPLETE <span>THE GROAN HOME</span>':s.flags.recovered?'SIDE B <span>CHECK, MIX & GROAN</span>':'SIDE A <span>THE LAST RESORT TO RECORD</span>',
 ending:'<div class="eyebrow">EPISODE 02 · MASTER READY</div><h2>Test Mic III: The Last Resort</h2><p>Two working microphones. One rescued discussion. Three unforgivable jokes.</p><p>Mr. Mamen’s mixed verdict and Sigve’s love of exploration both survive the edit: Test Drive III was ambitious, fascinating, and frustrating to steer.</p><p>“This episode has real drive,” says Sigve. “And absolutely no brakes,” says Mamen.</p><p>Joachim closes his notebook. For once, the only thing driven into the ground was the punchline.</p><p class="byline">A fictional studio adventure inspired by cd SPILL’s Test Drive III discussion.</p><button class="action" id="keep-playing">Return to the studio</button>'
};
