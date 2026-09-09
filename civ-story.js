// An original, affectionate late-night adventure parody. All character dialogue is fictional.
export const premise='The One More Turn Inn is holding a Civilization speed-date. Joachim needs a scoop: which edition deserves one more night? Terje courts the original, Kiiim campaigns for V, Izno plans for VI, and Nikolai loves VII despite the heckling. Haj has brought Pirates! and a suspiciously emphatic identity disclaimer. Win their pitches, then choose your own perfect match.';
export const intro='Joachim: A neon hotel. A singles night for strategy games. My editor said “find a civilisation you can settle down with.” Apparently that was an assignment. Not concern for my personal life.';
export const items={
 notebook:['▤','Notebook','Five opinions, one headline. Consent to an interview is not an open-borders treaty.'],
 invitation:['♡','Invitation','ONE MORE TURN INN — A NIGHT OF HEX APPEAL. Dress code: presentable. Relationship status: waiting for the next turn. Show this to the reception bell after visiting the mirror.'],
 comb:['≋','Gold comb','A complimentary comb. “For the distinguished gentleman with a receding tech tree.” Use it at the lobby mirror.'],
 napkin:['▱','Hex napkin','Izno’s cocktail napkin: “A campus likes mountains. A date likes someone who listens.” Use it on the lounge planning board.'],
 flower:['⚘','Red rose','One red rose. It needs a ribbon before it becomes a diplomatic bouquet. The lobby mirror has a gift-wrapping shelf.'],
 ribbon:['⌁','Pink ribbon','For a tasteful finishing touch. Use at the mirror with the rose in your inventory.'],
 dancecard:['♡','Dance card','Record the original, V, VI, VII, and Haj’s pirate objection. Then use this at the rooftop matchmaking machine.'],
 plan:['▧','District plan','A campus beside mountains. An adjacency bonus is the closest this napkin has come to physical intimacy. Show Izno.'],
 bouquet:['⚘','Diplomatic bouquet','A rose with a ribbon. “No conquest implied.” Give it to Nikolai as a friendly invitation to make his case.'],
 ballot:['▤','Complete ballot','Every pitch heard, including the unsolicited pirate one. Use the rooftop matchmaking machine to choose your favourite.'],
 verdict:['▣','Sealed verdict','Your chosen Civilization date. Use it on the lobby reception bell to file the story.']
};
const scenes=['courtyard','amiga','dos','newsroom'];
export const fresh=()=>({version:1,episode:'civ',scene:'courtyard',inventory:['notebook','invitation'],flags:{},notes:[],visitedTopics:[],won:false});
export function restore(s){if(!s||s.episode!=='civ'||!scenes.includes(s.scene)||!Array.isArray(s.inventory)||!s.inventory.every(i=>Object.hasOwn(items,i))||!s.flags||typeof s.flags!=='object'||Array.isArray(s.flags)||!Array.isArray(s.notes)||!s.notes.every(n=>typeof n==='string'))return fresh();const flags={...s.flags};if(!Number.isInteger(flags.flirt)||flags.flirt<0||flags.flirt>2)delete flags.flirt;if(!['original','v','vi','vii'].includes(flags.choice))delete flags.choice;return {...fresh(),...s,won:s.won===true,flags,inventory:[...new Set(s.inventory)],visitedTopics:Array.isArray(s.visitedTopics)?s.visitedTopics.filter(t=>typeof t==='string'):[]};}
export const objectives=[['suave','Tame the fringe at the lobby mirror'],['checkedIn','Check in for Civilization speed-dating'],['civ1','Hear Terje’s original romance'],['civ5','Survive Kiiim’s three pickup lines'],['civ6','Solve Izno’s district-placement date'],['civ7','Give Nikolai a fair hearing about VII'],['pirates','Record Haj’s pirate objection (and denial)'],['ballot','Prepare a complete matchmaking ballot'],['choice','Choose your own favourite Civilization'],['won','File the corniest scoop of Joachim’s career']];
const give=(s,id)=>{if(!s.inventory.includes(id))s.inventory.push(id)};
const take=(s,id)=>{s.inventory=s.inventory.filter(i=>i!==id)};
function done(s,id,note){s.flags[id]=true;if(!s.notes.includes(note))s.notes.push(note)}
const collect=['comb','napkin','flower','ribbon'];
export function objectVisible(s,id){return !collect.includes(id)||!(s.flags['picked_'+id]||s.inventory.includes(id)||(['flower','ribbon'].includes(id)&&s.flags.wrapped));}
const boxAds={
 boxOriginal:['the original Civilization','MATURE STRATEGY SEEKS LONG-TERM SETTLEMENT. Enjoys quiet maps, dependable routines, and being told the sequels meant nothing.'],
 boxV:['Civilization V','SINGLE HEX LOOKING FOR A SERIOUS TURN. Six sides, many possibilities, absolutely no room for your entire stack of emotional baggage.'],
 boxVI:['Civilization VI','LOCATION, LOCATION, FLIRTATION. Campus-educated city seeks good neighbours. Must be comfortable with a sprawling relationship.'],
 boxVII:['Civilization VII','NEW CHAPTER, SAME BUTTERFLIES. Looking for curiosity, a fresh start, and someone who will not bring a comments section to dinner.']
};
const havePitches=s=>['civ1','civ5','civ6','civ7','pirates'].every(k=>s.flags[k]);
export const mugJokes={
 mugHex:'Joachim: “HOT SINGLES IN YOUR HEX.” Izno: It is a single-origin roast. Kiiim: Mine has six sides and no emotional availability. Joachim: Finally, a mug with commitment corners.',
 mugTurn:'Joachim: “JUST ONE MORE SIP.” Kiiim: I said that at eleven. Izno: Last Tuesday. Joachim: This is not coffee. It is a turn-based sleep disorder.',
 mugOld:'Joachim: “1991 WAS MY TYPE.” Terje: Best year. Best Civ. Best coffee. Haj: That cannot still be the same coffee. Terje: I do not upgrade unnecessarily.',
 mugSeven:'Joachim: “SEVENTH HEAVEN. FIRST COFFEE.” Nikolai: Everyone reviews my mug before tasting it. Joachim: I give it seven out of ten. Nikolai: Why? Joachim: There are only seven on the box. This is how rigorous the debate has become.'
};
export function act(s,verb,id,item){const f=s.flags,has=i=>s.inventory.includes(i);
 if(verb==='Look at'&&boxAds[id])return 'Joachim: The personal ad for '+boxAds[id][0]+': '+boxAds[id][1];
 if(verb==='Look at')return mugJokes[id]||({
 mirror:f.suave?'A presentable reporter gazes back. The little shelf also has space to wrap a rose with a ribbon.':'The mirror says SMART CASUAL. My reflection says SAVE FILE NOT FOUND. A comb might establish diplomatic relations with my hair.',
 bell:'Reception: ring with your invitation after grooming. Later, file your sealed verdict here. The bell reads: “NO ROOM FOR ANOTHER EXPANSION.”',
 board:f.sketch?'Izno’s board: place the campus beside mountains. Use the board to submit your plan.':'A dating planner with hexes. A note says: “Bring the hex napkin. Campus seeks mountain. Must enjoy long walks and peer review.”',
 machine:f.ballot?'Your ballot is ready. Use the matchmaking machine to choose your favourite. Everyone gets heard; you make the decision.':'MATCHMAKER 386. “Find the edition for YOU.” Use a fully checked dance card here. Universal consensus sold separately.',
 haj:'Haj, pirate enthusiast and definitely-not-Retrogamingpappa enthusiast. His name tag says HAJ in three different fonts, none of them convincing.',
 terje:'Terje wears a hat with more character than most tech trees. His original Civilization box has pride of place. This is a first date that has lasted decades.',
 kiiim:'Kiiim, self-appointed minister of Hex Appeal. He has prepared three pickup lines and absolutely no contingency for someone enjoying Civ VII.',
 izno:'Izno has divided his romantic life into districts. The campus is thriving. The entertainment complex is awaiting funding.',
 nikolai:'Nikolai, enthusiastically defending Civilization VII. Everyone has an opinion about his opinion. Offer a friendly bouquet and let him finish a sentence.',
 comb:'A gold comb on the lobby pedestal. Pick it up. Hair today, gone next era.',napkin:'A loose hex napkin on the lounge ledge. Pick it up; Izno has annotated the flirting.',flower:'A rose on the nostalgia-room table. Pick it up. Finally, a resource that does not require a settler.',ribbon:'A pink ribbon on the rooftop pedestal. Pick it up. Culture victory, gift-wrapped.'
 }[id]||items[id]?.[2]||'Neon, velvet, and the faint scent of an unpatched adventure game.');
 if(verb==='Pick up'&&collect.includes(id)){if(!objectVisible(s,id))return 'Already collected. I cannot farm infinite romance resources.';give(s,id);done(s,'picked_'+id,'Picked up '+items[id][1]+'.');return ({comb:'A gold comb. My first successful pickup tonight is grooming equipment.',napkin:'A hex napkin. Nothing says romance like zoning permission.',flower:'One rose. Red is the colour of love, or a very unfriendly diplomacy screen.',ribbon:'A ribbon. The finishing touch for a bouquet, or a distressingly small empire.'})[id];}
 if(verb==='Use'||verb==='Give'){
  if(item&&!has(item))return 'I need that in my inventory first. Charm alone cannot synthesize a rose.';
  if(item==='comb'&&id==='mirror'){done(s,'suave','Combed Joachim’s hair. The fringe now has a functioning government.');return 'Joachim: There. Smooth. Distinguished. A man with absolutely no urgent questions about floppy disks. My reflection requests a recount.';}
  if(item==='invitation'&&id==='bell'){if(!f.suave)return 'Reception policy: establish a border between your eyebrows and your hair. Find the comb and use it at the mirror.';give(s,'dancecard');done(s,'checkedIn','Checked in for the One More Turn Inn’s edition speed-date.');return 'DING! Welcome, Joachim. Four eligible editions. Five unsolicited advocates. Please keep all proposals turn-based. Your dance card is ready.';}
  if(item==='ribbon'&&id==='mirror'||item==='flower'&&id==='mirror'){
   if(!has('ribbon')||!has('flower'))return 'A bouquet needs both the rose and the ribbon. One is in the nostalgia room; the other is on the rooftop.';
   take(s,'ribbon');take(s,'flower');give(s,'bouquet');done(s,'wrapped','Wrapped a diplomatic bouquet at the lobby mirror.');return 'A rose with a pink ribbon. My editor wanted a strong opening. I have made a floral one.';
  }
  if(item==='napkin'&&id==='board'){if(!f.checkedIn)return 'Check in with your invitation at reception first. This workshop is for registered romantics.';done(s,'sketch','Pinned Izno’s hex napkin to the planning board: campus seeks mountains.');return 'The napkin fits. Use the planning board to choose the campus’s perfect neighbour.';}
  if(item==='plan'&&id==='izno'){done(s,'civ6','Izno prefers Civilization VI: the pleasure of planning districts and their neighbours.');return 'Izno: Mountains beside the campus! At last, someone understands my needs. Joachim: You mean your adjacency bonuses. Izno: I know what I said. Civ VI is my match. I like planning where everything belongs. Unlike Kiiim, who belongs in the comments.';}
  if(item==='bouquet'&&id==='nikolai'){if(!f.checkedIn)return 'Nikolai: Check in first. I refuse to become an unregistered side quest.';take(s,'bouquet');done(s,'invited7','Offered Nikolai a friendly bouquet and space to make his Civ VII pitch.');return 'Nikolai: A rose? For me? Joachim: A peace offering. The date is with the game box. Nikolai: Honestly, this is the healthiest Civilization debate I have had all week. Ask me why I like VII.';}
  if(item==='notebook'&&id==='haj'){if(!f.checkedIn)return 'Haj: Get your dance card first. Pirates have standards. Mostly about paperwork.';if(!f.denial)return 'Haj: Before I go on the record, ask about the name on this suspiciously familiar mug. Talk to me about Retrogamingpappa.';done(s,'pirates','Haj prefers Sid Meier’s Pirates! and emphatically denies being Retrogamingpappa. His recommendation is outside the Civilization ballot.');return 'Haj: Put down Pirates! Ships, treasure, adventure. A proper court-ship. Joachim: And your name? Haj: HAJ. Not Retrogamingpappa. Joachim: I have underlined it. Haj: Underline the NOT as well.';}
  if(item==='notebook'&&['terje','kiiim','izno','nikolai'].includes(id))return 'I will record the pitch once we have finished this advocate’s challenge. Talking is the first step in both reporting and painfully slow romance.';
  if(item==='dancecard'&&id==='machine'){
   if(!havePitches(s))return 'Four editions and one pirate objection must be heard first. Check your journal: nobody gets eliminated by the loudest wingman.';
   give(s,'ballot');done(s,'ballot','Completed the ballot after hearing all four edition advocates and Haj’s pirate objection.');return 'MATCHES FOUND: ORIGINAL, V, VI, VII. Use the machine to choose. This is your favourite, not a law of physics. Even Kiiim cannot appeal to the Supreme Court of Hexagons.';
  }
  if(item==='ballot'&&id==='machine')return 'Use the machine with no inventory item selected to make your choice.';
  if(item==='verdict'&&id==='bell'){if(!f.choice||!f.ballot||!havePitches(s))return 'The verdict needs a complete ballot and a chosen edition first.';s.won=true;done(s,'won','Published Joachim’s chosen date: '+editionNames[f.choice]+'.');return 'Joachim: Story filed. My perfect date is '+editionNames[f.choice]+'. The evening ends with a meaningful connection, a terrible pun, and absolutely no intention of going to bed before one more turn.';}
  if(item==='flower'&&['terje','haj','nikolai'].includes(id))return 'A bare rose? I should wrap it with the rooftop ribbon at the lobby mirror, then offer the bouquet to Nikolai. Diplomacy deserves presentation.';
  if(item==='comb')return 'Joachim: I would offer to fix your hair, but that feels like a declaration of war.';
  if(mugJokes[id])return 'I am not mixing my inventory with hotel coffee. That is how you get a grounds for divorce.';
  if(item)return 'That combination has no chemistry. Or physics. Or useful adjacency bonus.';
 }
 if(verb==='Pick up')return 'That stays in the hotel. My pockets are large; my expense account is not.';
 if(verb==='Open')return 'Not everything opens with a click. Some things require a heartfelt conversation and a patch.';
 return 'An intriguing move. Unfortunately, charm is not a supported file format.';
}
export const editionNames={original:'the original Civilization',v:'Civilization V',vi:'Civilization VI',vii:'Civilization VII'};
const flirting=[
 ['Kiiim: My perfect date has six sides. Your opening line?',['You have tremendous hex appeal.','I prefer triangles.','Is that a spreadsheet?'],0],
 ['Kiiim: The evening is over. How do you ask for another date?',['I demand an expansion.','Just one more turn together?','Please submit a support ticket.'],1],
 ['Kiiim: A relationship needs boundaries. Your diplomatic proposal?',['Annex the minibar.','Declare surprise war.','Open borders, with mutual consent.'],2]
];
const topics={
 terje:['Why only the original?','Is that your lucky hat?','Can an old flame still surprise you?'],
 kiiim:['Why Civilization V?','What do you think of VII?','Do you always campaign this hard?'],
 izno:['Why Civilization VI?','Do you flirt using urban planning?','What is Kiiim’s problem with VII?'],
 nikolai:['Why do YOU like VII?','Does the teasing bother you?','Can I like a game everyone argues about?'],
 haj:['You are Retrogamingpappa, aren’t you?','Why Pirates! at a Civilization date?','Does Pirates! count as a relationship?']
};
export function talk(s,id){const f=s.flags;
 if(boxAds[id])return ['Joachim','The '+boxAds[id][0]+' box is standing there, looking eligible and suspiciously shrink-wrapped.',['Read the personal ad.','Try a pickup line.']];
 if(id==='board')return ['Joachim',!f.sketch?'Bring Izno’s hex napkin here first. The board is not accepting unlicensed flirting.':f.civ6?'The campus has found its mountain. An academically successful date.':'Campus seeks a neighbour. The napkin says mountains offer a science adjacency bonus. Choose its date.',!f.sketch||f.civ6?[]:['Beside the mountains','In the cocktail glass','Under the disco ball']];
 if(id==='machine')return ['Joachim',f.ballot?'Choose the edition YOU want another evening with. You can change your choice here until you file the verdict at reception.':'The machine needs a complete dance card before it can match you.',f.ballot?Object.values(editionNames):[]];
 if(id==='terje')return ['Terje',f.civ1?'The original still has my heart. Every sequel is somebody else’s second date.':!f.checkedIn?'Welcome. Register at reception before proposing an eternal alliance.':'One question before my pitch. You meet a promising piece of land. What comes first?',!f.checkedIn||f.civ1?topics.terje:['Found a city before ordering a palace','Buy a honeymoon expansion','Demand better graphics',...topics.terje]];
 if(id==='kiiim')return ['Kiiim',f.civ5?'You have earned my endorsement. V has the elegance. The poise. The hex appeal.':Number.isInteger(f.flirt)?flirting[f.flirt][0]:'Civ V is obviously the perfect match. Prove you have sufficient taste: survive my three diplomatic pickup lines.',Number.isInteger(f.flirt)?flirting[f.flirt][1]:[...(!f.civ5?['Begin the hex-appeal challenge.']:[]),...topics.kiiim]];
 if(id==='izno')return ['Izno',f.civ6?'Finally, a relationship with sensible zoning. VI is my pick.':'Take the lounge napkin to that planning board. Find the campus a suitable neighbour, then show me the resulting plan.',topics.izno];
 if(id==='nikolai')return ['Nikolai',f.civ7?'Thanks for hearing me out. You do not have to choose VII. I just wanted my enjoyment counted as evidence.':f.invited7?'Thank you for the bouquet. Now ask why I like VII, instead of asking why the others do not.':'I like Civilization VII. There. That is my scandal. A friendly bouquet would improve the mood around here.',topics.nikolai];
 if(id==='haj')return ['Haj',f.pirates?'My pirate objection is on the record. So is my denial. One of these keeps mysteriously needing repetition.':'Before we start: I am HAJ. I prefer Sid Meier’s Pirates! And no, this is not a clever disguise by Retrogamingpappa.',topics.haj];
 return ['Joachim',act(s,'Look at',id),[]];
}
export const replies={
 'Why only the original?':'Terje: My first love. A map, a city, and a night that mysteriously becomes morning. Joachim: No temptation to upgrade? Terje: I already upgraded my hat. There are limits.',
 'Is that your lucky hat?':'Terje: It protects me from new ideas. Joachim: Does it work? Terje: Civilization, 1991. You tell me. Haj: I could put a feather in it. Terje: That sounds like DLC.',
 'Can an old flame still surprise you?':'Terje: Every map is another chance to make the same terrible decisions. Joachim: That sounds like dating. Terje: Yes, but the settler calls back.',
 'Why Civilization V?':'Kiiim: Elegant hexes. Strategic tension. That unmistakable feeling of just one more turn. Joachim: You have put that on your dating profile. Kiiim: And my tax return. Both require an expansion of my available time.',
 'What do you think of VII?':'Kiiim: Seven? Excessive. Five was sufficient. Nikolai: You have delivered this opinion seven times. Kiiim: Five excellent times and two expansions. Joachim: I am recording the preference, not declaring a winner by volume.',
 'Do you always campaign this hard?':'Kiiim: Of course. I have built a wonder. Joachim: Which one? Kiiim: My own sense of importance. Izno: It gives minus two happiness in every adjacent conversation.',
 'Why Civilization VI?':'Izno: I enjoy planning districts and seeing a city spread across the map. Joachim: So your perfect date has good neighbours? Izno: Exactly. Which is why I keep moving my chair away from Kiiim.',
 'Do you flirt using urban planning?':'Izno: Your campus or mine? Joachim: That is dreadful. Izno: Wait until you see my entertainment complex. Joachim: Somehow that is still about spreadsheets. Izno: Mostly spreadsheets.',
 'What is Kiiim’s problem with VII?':'Izno: He thinks everyone should settle on V. I think he should settle down. Nikolai: I am standing right here. Izno: Sorry. Enjoy VII. I prefer VI; you are allowed to have a good evening anyway.',
 'Does the teasing bother you?':'Nikolai: A joke is fine. A tribunal every time I enjoy a game gets old. Joachim: Then tonight you get a pitch, not a trial. Kiiim: I have prepared a rebuttal. Joachim: Put it in the suggestion hex.',
 'Can I like a game everyone argues about?':'Nikolai: Yes. It is a game, not a group homework assignment. Joachim: That is going in my notebook. Terje: In my day we enjoyed the original. Nikolai: And you still can. We have invented parallel enjoyment.',
 'Why Pirates! at a Civilization date?':'Haj: It has Sid Meier on the box. Boats. Adventure. Court-ship! Joachim: That pun is doing a lot of naval work. Haj: A broadside of romance. Joachim: Please stop boarding this conversation.',
 'Does Pirates! count as a relationship?':'Haj: You spend ages pursuing treasure, then someone steals your ship. Joachim: A cautionary tale. Haj: And I am NOT Retrogamingpappa. Joachim: I asked about relationships. Haj: Preventative clarification.'
};
export function choose(s,id,label){const f=s.flags;
 if(boxAds[id])return label==='Read the personal ad.'?boxAds[id][1]:({
 boxOriginal:'Joachim: Do you come here often? Of course you do. You founded the place. The box offers me a long, meaningful loading screen.',
 boxV:'Joachim: Are you a hex tile? Because I can see six ways this could work out. The box says nothing. Somehow it still has better delivery than Kiiim.',
 boxVI:'Joachim: Your campus or mine? The box remains silent. I appear to have been placed in the friend district.',
 boxVII:'Joachim: Is this a new age, or am I just blushing? The box remains politely sealed. I respect its boundaries. These are premium cardboard boundaries.'
 })[id];
 if(id==='haj'&&label==='You are Retrogamingpappa, aren’t you?'){done(s,'denial','Haj explicitly denied being Retrogamingpappa. Again.');return 'Haj: NO. I am Haj. Different name. Different hat. Terje: That is my hat. Haj: EXACTLY. Joachim: I will record your pirate objection with my notebook. Under HAJ. Haj: Capital letters.';}
 if(id==='terje'&&!f.civ1&&['Found a city before ordering a palace','Buy a honeymoon expansion','Demand better graphics'].includes(label)){
  if(!f.checkedIn)return 'Register at reception first.';
  if(label!=='Found a city before ordering a palace')return 'Terje: Start with the foundation. A first date is not a sequel budget meeting.';
  done(s,'civ1','Terje prefers the original Civilization: familiar foundations and the enduring first-map romance.');return 'Terje: Exactly. Found the city. See what grows. The original is enough for me. Joachim: You had me at settlement. Terje: That is a much better line than “nice assets.”';
 }
 if(id==='kiiim'&&label==='Begin the hex-appeal challenge.'){
  if(!f.checkedIn)return 'Kiiim: Get your dance card at reception. I cannot crush an unregistered romantic.';
  if(f.civ5)return 'Kiiim: Your hex appeal is already certified.';f.flirt=0;return 'Kiiim: Three lines. Find the pun, show some patience, and respect the borders. Joachim: Finally, foreign policy I can put on a coaster.';
 }
 if(id==='kiiim'&&Number.isInteger(f.flirt)){
  const q=flirting[f.flirt];if(label!==q[1][q[2]])return 'Kiiim: That line has negative chemistry. Try the clever, patient, or mutually agreeable answer. Joachim: This is the strangest driving test of my life.';
  f.flirt++;if(f.flirt===3){delete f.flirt;done(s,'civ5','Kiiim’s Civilization V pitch: hex appeal, strategic elegance, and just one more turn.');return 'Kiiim: Three impeccable lines. V is your destiny. Joachim: It is one of my options. Kiiim: I will tolerate that wording until the next turn.';}return 'Kiiim: Acceptable. Your charm stat has increased from tragic to historically interesting.';
 }
 if(id==='board'){
  if(!f.sketch)return 'Pin the hex napkin to the board first.';
  if(label!=='Beside the mountains')return 'The napkin specifically mentions mountains for the campus. Disco balls grant no science. We checked.';
  give(s,'plan');done(s,'planned','Placed the campus by mountains. The district plan is ready for Izno.');return 'The campus and mountain are a match. Show the district plan to Izno. They have agreed to take it one semester at a time.';
 }
 if(id==='nikolai'&&label==='Why do YOU like VII?'){
  if(!f.invited7)return 'Nikolai: First, a peace offering. Wrap the rose with the ribbon at the lobby mirror and bring me the bouquet. Then we can have a conversation without the heckling.';
  done(s,'civ7','Nikolai prefers Civilization VII: a fresh take that makes him curious enough to try another game.');return 'Nikolai: I like the fresh feeling. It makes me curious about what I will try next. I do not need everyone else to agree. Joachim: A different era of your love life? Nikolai: Exactly. Kiiim: V already exists. Joachim: So does an indoor voice, Kiiim.';
 }
 if(id==='machine'){
  if(!f.ballot||!havePitches(s))return 'Complete the dance card first.';
  const choice=Object.keys(editionNames).find(k=>editionNames[k]===label);if(!choice)return 'Choose one of the four editions on the ballot.';
  f.choice=choice;give(s,'verdict');const note='Selected '+editionNames[choice]+' as Joachim’s personal match.';if(!s.notes.includes(note))s.notes.push(note);
  return 'MATCH CONFIRMED: '+editionNames[choice]+'. Your verdict is sealed. Use it on the lobby reception bell to file the story. Last-minute cold feet? You can change your choice here before publishing.';
 }
 return replies[label]||'Joachim: I will put that under “promising, needs another date.”';
}
export function hint(s){const f=s.flags;
 if(s.won)return ['The scoop is filed. Your perfect match awaits one more turn.','Restart this episode to court a different edition, or revisit the other adventures.'];
 if(!f.suave)return ['Every lounge lizard starts with a little grooming.','Pick up the comb in the lobby and use it on the mirror.'];
 if(!f.checkedIn)return ['You are presentable. Now make it official.','Use the invitation on the reception bell.'];
 if(!f.civ1)return ['Terje likes to begin at the beginning.','Talk to Terje in The First Date. Choose “Found a city before ordering a palace.”'];
 if(!f.civ5)return ['Kiiim is guarding V with three terrible pickup lines.','Talk to Kiiim in Hex Appeal. Begin his challenge; choose hex appeal, one more turn together, and open borders with mutual consent.'];
 if(!f.civ6)return ['Izno has written his type on a cocktail napkin.','Pick up the lounge napkin, use it on the planning board, then Use the board. Choose mountains and give the resulting district plan to Izno.'];
 if(!f.civ7)return ['The unpopular opinion deserves a friendly invitation.','Pick up the rose in The First Date and ribbon on the rooftop. Use either at the lobby mirror while carrying both. Give the bouquet to Nikolai, then ask why HE likes VII.'];
 if(!f.pirates)return ['One very insistent pirate is still waiting to go on the record.','Ask Haj if he is Retrogamingpappa, then use your notebook on him.'];
 if(!f.ballot)return ['All the pitches are in. Now the machine can match you.','Use your dance card on the rooftop matchmaking machine.'];
 if(!f.choice)return ['Only your own taste can answer the final question.','Use the matchmaking machine with no inventory item selected. Choose any of the four editions.'];
 return ['One last ring before one more turn.','Use the sealed verdict on the lobby reception bell.'];
}
export const episode={
 title:'Leisure Suit Joachim: Love in the Time of One More Turn',intro,objectVisible,
 subtitle:'Love in the Time of One More Turn',tagline:'Four eligible editions. Five terrible wingmen.<br>Looking for love in all the wrong save slots.',edition:'VOL. 03 / HEX APPEAL',
 below:'<strong>Be charming. Be curious. Be home by 4000 BC.</strong><br>Four rooms. Four editions. Absolutely no consensus.',
 about:'You are Joachim, a reporter at a kitschy Civilization speed-date. Collect the four advocates’ pitches and Haj’s pirate objection, then choose your own favourite. Pick up objects, use them with scenery or characters, and talk for clues. Use the planning board and matchmaking machine without a selected item to make choices. Rose and ribbon combine at the lobby mirror. All dialogue and preferences here are fictional character roles supplied for this parody.',
 music:{courtyard:'civLobby',amiga:'civLounge',dos:'civRetro',newsroom:'civRoof'},
 interactive:['board','machine'],
 props:[['comb','courtyard',48,58,5,3],['napkin','amiga',73,53,6,3],['flower','dos',55,55,7,4],['ribbon','newsroom',43,59,6,3]],
 playerStaging:Object.fromEntries(scenes.map(id=>[id,{y:412,height:230}])),
 names:{courtyard:'THE ONE MORE TURN INN · LOBBY',amiga:'HEX APPEAL · STRATEGY LOUNGE',dos:'THE FIRST DATE · NOSTALGIA BAR',newsroom:'SEVEN HEAVEN · ROOFTOP'},
 rooms:{
 courtyard:[['mirror','Lobby mirror',3,8,16,58,'object'],['bell','Reception bell',79,40,8,9,'object'],['comb','Gold comb',47,56,8,8,'object'],['amiga','Hex Appeal →',72,90,24,7,'exit'],['dos','← The First Date',3,90,25,7,'exit'],['newsroom','Rooftop ↑',39,90,23,7,'exit']],
 amiga:[['boxV','Civilization V date',7,11,18,32,'object'],['boxVI','Civilization VI date',53,11,20,32,'object'],['kiiim','Kiiim',16,29,17,61,'person'],['izno','Izno',58,29,17,61,'person'],['board','Planning board',79,8,20,40,'object'],['napkin','Hex napkin',72,51,8,8,'object'],['mugHex','Hex appeal mug',27,44,6,10,'object'],['mugTurn','One more sip mug',39,44,6,10,'object'],['courtyard','← Lobby',3,90,22,7,'exit']],
 dos:[['boxOriginal','Original Civilization date',39,19,18,29,'object'],['terje','Terje',17,29,17,61,'person'],['haj','Haj',65,29,17,61,'person'],['flower','Red rose',54,53,9,8,'object'],['mugOld','Original coffee mug',16,46,7,10,'object'],['courtyard','← Lobby',3,90,22,7,'exit']],
 newsroom:[['boxVII','Civilization VII date',14,8,25,36,'object'],['nikolai','Nikolai',24,29,18,61,'person'],['machine','Matchmaking machine',74,27,22,39,'object'],['ribbon','Pink ribbon',42,57,8,8,'object'],['mugSeven','Seventh heaven mug',93,54,6,10,'object'],['courtyard','← Lobby',3,90,22,7,'exit']]
 },
 staging:{amiga:{kiiim:{y:394,height:243},izno:{y:394,height:224}},dos:{terje:{y:394,height:235},haj:{y:394,height:222}},newsroom:{nikolai:{y:394,height:232}}},
 chapter:s=>s.won?'THE MORNING AFTER <span>JUST ONE MORE TURN</span>':s.flags.ballot?'ACT III <span>CHOOSE YOUR OWN CIV-MANCE</span>':s.flags.checkedIn?'ACT II <span>LOOKING FOR HEX APPEAL</span>':'ACT I <span>A FRINGE BENEFIT</span>',
 ending:s=>'<div class="eyebrow">EPISODE 03 · A PERSONAL MATCH</div><h2>Love in the Time of One More Turn</h2><p>Joachim’s date is <b>'+editionNames[s.flags.choice]+'</b>. '+({original:'Terje tips his hat. “First love. Best save.”',v:'Kiiim declares a romantic victory and requests a recount anyway.',vi:'Izno reserves a table with excellent adjacency bonuses.',vii:'Nikolai smiles. For once, he can enjoy his game without a defence speech.'}[s.flags.choice]||'')+'</p><p>The other advocates keep their favourites. Nobody has to uninstall a happy memory.</p><p>Haj attempts to sail away with the buffet. “Thank you, Retrogamingpappa,” says the receptionist. “I AM NOT RETROGAMINGPAPPA,” says Haj. The denial earns its own headline.</p><p>Joachim’s editor calls. “Did you get lucky?” “I got a byline.” “And a good ending?” “I am still clicking End Turn.”</p><p class="byline">A fictional, affectionate adventure-game parody. The best Civilization is a personal preference, and every date comes with another save slot.</p><button class="action" id="keep-playing">Return to the inn</button>'
};
