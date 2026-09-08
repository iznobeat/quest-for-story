export const premise = 'Tonight, the castle opens its exhibition: The People Behind the Pixels. But the credits disk has vanished. At midnight, Kiiim’s “helpful” AUTOEXEC.BAT will replace the exhibition with DOS: The Only History That Matters. Izno is already getting the blame. Joachim needs the original disk, reliable witnesses, and a better headline.';
export const items = {
 notebook:['▤','Notebook','A reporter’s notebook. No batteries. No subscription. Occasionally needs a pencil patch.'],
 coin:['◉','1 krone','One Norwegian krone. Enough for a wish, provided you accept the default settings.'],
 hook:['♧','Disk hook','A long cord with a hook. Finally, this investigation has an angle.'],
 disk:['▣','Wet floppy','LASTBYTE.adf. An exhibition demo with its credits damaged by a very literal data leak.'],
 drydisk:['▣','Dry floppy','The Last Byte, a forgotten castle demo. The disk is dry; the names in its credits still need checking.'],
 adapter:['⌁','Adapter','Zendar’s bridge reader. Reads the Amiga disk through the DOS terminal without reigniting the format wars.'],
 coffee:['▰','Coffee','Haj’s blend: strongly brewed, vigorously denied. The mug says WORLD’S OKAYEST NOT-PAPPA.'],
 pass:['▱','Press pass','Izno’s access pass. He asked for a fair story, which is a perfectly reasonable price of admission.'],
 clipping:['▤','Archive clipping','Field notes: Twintris (1990). Developer: Svein Berge. Music: Tor Gausen / Walkman. A different Svein Berge is in Röyksopp. Interview by Joachim Froholt and Retrogamingpappa. A handwritten note says: “CHECK THE PERSON, NOT JUST THE NAME.”'],
 testimony:['▧','Haj’s statement','Haj recalls the Last Byte demo’s original credits. He also denies being Retrogamingpappa. Five times. On the record.'],
 response:['▧','Kiiim’s response','Kiiim admits hiding the credits disk. Izno refused to erase the Amiga contributors. Kiiim agrees to stop AUTOEXEC.BAT and restore every credit.'],
 evidence:['▤','Original credits','The Last Byte: Amiga code by Kiiim, bridge by Zendar, graphics by mgjesdal, restoration by Izno. Music: R.G.P. — a name alone is not enough to identify someone.']
};
export const fresh=()=>({version:2,scene:'courtyard',inventory:['notebook','coin'],flags:{},notes:[],visitedTopics:[],won:false});
// Keep existing progress intact; earlier finished games remain finished.
export function restore(saved){if(!saved||!['courtyard','amiga','dos','newsroom'].includes(saved.scene)||!Array.isArray(saved.inventory)||!saved.inventory.every(i=>items[i])||!saved.flags||typeof saved.flags!=='object'||Array.isArray(saved.flags)||!Array.isArray(saved.notes)||!saved.notes.every(n=>typeof n==='string'))return fresh();return {...saved,version:2,inventory:[...new Set(saved.inventory)],flags:{...saved.flags},notes:[...saved.notes],visitedTopics:Array.isArray(saved.visitedTopics)?saved.visitedTopics.filter(t=>typeof t==='string'):[]};}
export const objectives=[['disk','Recover the vanished exhibition disk'],['dry','Restore the disk with the Amiga crew'],['archive','Check the newsroom’s archive clipping'],['pass','Get Izno’s trust and press access'],['duel','Outwit the lord of the command line'],['evidence','Recover the original credits'],['testimony','Record Haj’s account of the demo'],['response','Put the evidence to Kiiim'],['won','Publish the verified story and save the exhibition']];
const give=(s,id)=>{if(!s.inventory.includes(id))s.inventory.push(id)};
function done(s,flag,note){s.flags[flag]=true;if(!s.notes.includes(note))s.notes.push(note)}
export function act(s,verb,id,item){
 const f=s.flags,has=x=>s.inventory.includes(x),take=x=>s.inventory=s.inventory.filter(i=>i!==x);
 if(verb==='Look at')return ({
 well:f.disk?'The well has been thoroughly de-floppied. It is now merely a deep, damp metaphor.':'Something square glints below the bucket. A wishing well: the original crowdfunding platform.',
 sign:'EXHIBITION TONIGHT: THE PEOPLE BEHIND THE PIXELS. Amiga: 42 rooms. DOS: one bøttekott. Kiiim has crossed out “people” and written “DOS”.',
 amiga:'The Amiga wing. Forty-two rooms, three custodians, and not one of them willing to call it a phase.',
 dos:'DOS DEPARTMENT. Maximum occupancy: one villain, one scapegoat, and 640 KB of resentment.',
 newsroom:'The newsroom. A pile of research is waiting beside the printing press. Deadlines are closer than they appear.',
 terminal:f.evidence?'The restored credits tell a very different story from Kiiim’s exhibition. A blinking prompt reads: AUTOEXEC SUSPENDED — AWAITING EDITORIAL REVIEW.':'A prompt reads: MIDNIGHT EXHIBITION REWRITE ARMED. Press access required. The drive needs Zendar’s bridge reader.',
 press:'A loose archive clipping is tucked into the printing press. Pick it up. There may be a story between the lines.',
 desk:'My editorial desk. The checklist reads: original source, independent witness, right of reply. Below: “A scoop without evidence is just a shovel.”',
 zendar:'Zendar, keeper of cables. He can connect two incompatible computers but still cannot get the printer on the network.',
 haj:'Haj. Definitely not Retrogamingpappa, according to Haj. His mug, suspicious knowledge, and everyone else have declined to comment.',
 mgjesdal:'mgjesdal. A moustache you could trust with an archive. He is inspecting a floppy under a warm lamp.',
 kiiim:'Kiiim. A sweeping coat, a chilling stare, and an office that is quite literally a sweeping cupboard.',
 izno:'Izno. The only employee whose name appears in every error log even when the computer is switched off.'
 }[id]||items[id]?.[2]||'A beautiful distraction from the impending editorial disaster.');
 if(verb==='Pick up'&&id==='press'){give(s,'clipping');done(s,'archive','The archive warns against mistaken identity: Twintris involved a different Svein Berge from the musician in Röyksopp. Its music is credited to Tor Gausen.');return 'An old Twintris research clipping. Two Svein Berges, one mistaken identity. And the byline says Retrogamingpappa. Haj will LOVE this.';}
 if(verb==='Use'||verb==='Give'){
  if(item&&!has(item))return 'I need that item in my pockets before I can use it.';
  if(item==='coin'&&id==='well'){take('coin');give(s,'hook');done(s,'hook','The wishing well returned a fishing hook. Apparently it grants leads, not conclusions.');return 'Joachim: I wish for a story with a good hook. …The well takes things very literally.';}
  if(item==='hook'&&id==='well'){if(f.disk)return 'Nothing left down there except my expense claim.';give(s,'disk');done(s,'disk','Fished the Last Byte exhibition disk out of the well. It needs careful drying.');return 'The missing disk! LASTBYTE.adf. Kiiim called this “cloud storage”. Apparently the cloud was raining.';}
  if(item==='disk'&&id==='mgjesdal'){take('disk');give(s,'drydisk');done(s,'dry','mgjesdal dried the Last Byte disk under his lamp. Zendar has the reader to bridge formats.');return 'mgjesdal: A little warmth. No toaster. We are restoring a demo, not making a demo-lition. There! Ask Zendar for his bridge reader.';}
  if(item==='clipping'&&id==='haj'){done(s,'hajClue','Haj recognized the archive clipping and insisted he is not Retrogamingpappa. He remembers the exhibition demo, but wants Joachim to recover its original credits first.');return 'Haj: Retrogamingpappa? Not me. Completely different fellow. Excellent interview technique, though. …Not that I’d know. Your demo has the same trap: initials aren’t a person. Recover the credits, then get your notebook out.';}
  if(item==='coffee'&&id==='izno'){take('coffee');give(s,'pass');done(s,'pass','Izno gave press access. He says he refused an order to erase the Amiga contributors from the exhibition.');return 'Izno: The Not-Pappa blend! Tell Retrogamingpappa thanks. Joachim: He says he isn’t. Izno: Of course he does. Here’s your pass. Kiiim told me to erase the Amiga names. I refused. Now everything is “Izno’s fault”.';}
  if(item==='pass'&&id==='kiiim')return 'Kiiim: Official press access? Fine! But the command line is guarded by THREE devastating insults. Talk to me, if you DOS!';
  if(item==='drydisk'&&id==='terminal'){
   if(!f.pass)return 'Izno: I need to see press access first. I’d help, but my employment is already hanging by a coffee break.';
   if(!f.duel)return 'Kiiim: The terminal stays locked until you win our battle of wits!';
   if(!has('adapter'))return 'The reader is incompatible. Zendar has a bridge adapter. These machines need couples counselling.';
   give(s,'evidence');done(s,'evidence','Original credits recovered: Kiiim wrote the Amiga code; Izno restored the demo. Music is credited only to R.G.P. Those initials are not proof of identity.');
   return 'THE LAST BYTE — Amiga code: Kiiim. Restoration: Izno. Music: R.G.P. Joachim: Our DOS villain wrote an Amiga demo… and his scapegoat saved it. But who is R.G.P.? Better verify the people behind these pixels.';
  }
  if(item==='notebook'&&id==='haj'){
   if(!f.hajClue)return 'Haj: Before this goes on record, read the old research clipping in the newsroom. A familiar name is not a verified source. Especially MY name, which is HAJ.';
   if(!f.evidence)return 'Haj: Recover the original credits first. I can corroborate them, but I won’t write your conclusion before you’ve found your source.';
   give(s,'testimony');done(s,'testimony','Haj corroborated Kiiim’s Amiga code and Izno’s restoration. In this fictional demo, R.G.P. is the label Really Good Paula, not a verified person. His Retrogamingpappa denial remains emphatic.');
   return 'Haj: I saw Kiiim write that Amiga code. Izno rescued the disk. R.G.P. was our music folder: “Really Good Paula”. Don’t credit a person from three letters. And I am NOT Retrogamingpappa. Joachim: Noted. Haj: Under HAJ.';
  }
  if(item==='notebook'&&id==='kiiim'){
   if(!f.evidence)return 'Kiiim: Put actual evidence to me, journalist. My sinister reputation is not a primary source.';
   give(s,'response');done(s,'response','Kiiim admitted hiding the disk because his own Amiga credits undermined his DOS-only exhibition. Izno refused to erase contributors. Kiiim agreed to cancel the rewrite.');
   return 'Kiiim: Yes. I wrote the Amiga code. I hid the disk. Izno would not delete the others’ names. I wanted ONE room where DOS mattered. Joachim: It already matters. You don’t need to erase anyone else. Kiiim: …Put that in. And cancel my batch job.';
  }
  if(item==='evidence'&&id==='desk'){
   if(!f.testimony)return 'Joachim: A recovered file is a start, not a whole story. Show the archive clipping to Haj, then record his account with my notebook.';
   if(!f.response)return 'Joachim: Kiiim deserves a chance to respond. I should put the recovered credits to him with my notebook before publishing.';
   s.won=true;done(s,'won','Published The People Behind the Pixels. The exhibition is saved, Izno is cleared, and every contributor gets a credit. Haj’s denial is printed in full.');
   return 'PUBLISHED! The People Behind the Pixels. Names restored. Batch job cancelled. Scapegoat retired. Joachim: Now THAT is a story worth saving.';
  }
  if(item==='notebook'&&id==='izno')return 'Izno: I wasn’t the bug. I was the person refusing the bad instruction. Please spell my name right. Error messages never do.';
  if(item==='notebook')return 'Joachim: Noted. My notebook has unlimited memory, but the handwriting is lossy compression.';
  if(item==='adapter'&&id==='terminal')return 'The bridge reader fits. Keep it handy and use the dry floppy on the terminal.';
  if(item)return 'Joachim: Those don’t fit together. That’s a theory with a missing connector.';
  if(id==='desk')return 'Use the original credits here once you have a witness and Kiiim’s response. Verification before publication.';
 }
 if(verb==='Pick up')return id==='well'?'The disk is too far down. Every investigation needs a good hook.':'I can’t pocket that. Even adventure-game trousers have editorial standards.';
 if(verb==='Open')return id==='well'?'It’s already open source.':id==='terminal'?'The terminal opens after press access and a battle of wits. The casing opens after a warranty expires.':'It doesn’t open. Maybe ask a more open-ended question.';
 return 'That won’t advance the investigation. It might qualify as a meeting, though.';
}
export function talk(s,id){const f=s.flags;
 if(id==='zendar'){if(f.dry){give(s,'adapter');done(s,'adapter','Zendar supplied a reader to bridge the Amiga disk and DOS terminal.');}return ['Zendar',f.dry?'The disk survived! Take my bridge reader. The Amiga and DOS departments made that demo together, once. Funny how compatibility gets harder when people are involved.':'The exhibition’s credits disk is in the courtyard well. I saw the splash. Try a coin, then a hook. mgjesdal can dry it; I can make it readable. Meanwhile Kiiim is preparing a DOS-only rewrite.',['Why is the Amiga department so large?','Everyone says Haj is Retrogamingpappa.','What is The Last Byte?']];}
 if(id==='haj'){if(!f.coffee){give(s,'coffee');f.coffee=true;}return ['Haj',f.evidence?'You found the credits? Good. Initials are a lead, not a verdict. Show me the archive clipping if you haven’t, then use your notebook. And before you ask: no.':f.hajClue?'Still Haj. Still not Retrogamingpappa. Yes, I remember that demo. Recover its credits before quoting me. In the meantime, Izno could use the coffee I gave you.':'Before you say anything: I am NOT Retrogamingpappa. I’m Haj. Different name. Different… mug. Take this coffee to Izno; the poor fellow is running on blame and no caffeine.',['You’re Retrogamingpappa, aren’t you?','But everyone says you are.','What do you know about Twintris?','Tell me about Kiiim.']];}
 if(id==='mgjesdal')return ['mgjesdal',f.dry?'The disk is dry. Now recover its credits. A game’s history is more than its filename — it’s the people who stayed up far too late making it.':'Kiiim’s about to turn a whole exhibition into a DOS advert. Bring me the wet disk. I have a warm lamp and the patience of a man who has waited for many loading screens.',['What happened to the exhibition?','Didn’t you play Twintris?','Is Haj Retrogamingpappa?','Nice moustache.']];
 if(id==='izno')return ['Izno',f.response?'He finally admitted it? I might have to update my CV. “Former scapegoat” is practically management experience.':f.pass?'Kiiim’s terminal is behind an insult duel. Beat him, read the disk, and check the names. Also: tell Retrogamingpappa his coffee saved my life.':'I restored The Last Byte. Kiiim told me to erase the Amiga names. I said no. Then the disk vanished, and suddenly I was promoted to sole cause of everything. I could use a coffee.',['What are Kiiim’s weaknesses?','What does a scapegoat do?','Who makes that coffee?']];
 if(id==='kiiim')return ['Kiiim',f.response?'The batch job is suspended. Tell the whole story. Even the bit where I wrote an Amiga demo. But describe this room as “intimate”.':f.evidence?'Those credits are… historically inconvenient. If you want my answer on the record, get your notebook.':f.duel?'You won. Read the disk. It probably contains nothing but embarrassing cross-platform collaboration. Hypothetically.':f.pass?'A journalist with a pass? Defeat THREE of my most devastating insults and the terminal is yours. No restore point can save your dignity!':'At midnight, AUTOEXEC.BAT will install DOS: The Only History That Matters. Forty-two Amiga rooms will finally know the joy of a command prompt! Mind the bucket.',['Why a broom cupboard?',...(f.pass&&!f.duel?['Let’s duel.']:[]),'Why erase the Amiga names?','Even you think Haj is Retrogamingpappa?']];
 return ['Joachim','Interviewing furniture again. This is how you get a regular column.'];
}
export const replies={
 'Why is the Amiga department so large?':'Zendar: We requested more memory. The architect heard “more masonry”. The tender was already signed.',
 'Everyone says Haj is Retrogamingpappa.':'Zendar: Of course he is. Haj, from across the room: OF COURSE I’M NOT. Zendar: See? Perfect response time. Very experienced interviewee.',
 'What is The Last Byte?':'Zendar: A demo we all made for the castle exhibition. Amiga artwork, DOS tools, far too much coffee. It proved the machines could cooperate. The humans are still in beta.',
 'You’re Retrogamingpappa, aren’t you?':'Haj: No. Absolutely not. If I were Retrogamingpappa, would I wear a badge saying “Haj”? Joachim: Yes? Haj: This interview is becoming speculative.',
 'But everyone says you are.':'Haj: Repeating an unverified claim does not make it true. Joachim: That’s excellent journalistic advice. Haj: A coincidence. I have never professionally coincided.',
 'What do you know about Twintris?':'Haj: Released in 1990. Svein Berge developed it; Tor Gausen made the music. Not the Svein Berge in Röyksopp. Joachim: You sound well researched. Haj: I read. Innocently. As HAJ.',
 'Tell me about Kiiim.':'Haj: He says Amiga people never move on. He lives next to a mop named CONFIG.SYS. I’m not convinced he has the moral high ground.',
 'What happened to the exhibition?':'mgjesdal: Izno refused to remove our names. Then Kiiim went out with a disk and came back with a bucket. Said he was clearing the cache. Wells have cash, not caches.',
 'Didn’t you play Twintris?':'mgjesdal: Oh yes. We held tournaments and went home to practise. You could torment your opponent while playing at the same time. A multiplayer game — and an excellent way to test a friendship.',
 'Is Haj Retrogamingpappa?':'mgjesdal: Obviously. Haj: NOT OBVIOUSLY! mgjesdal: Sorry. Allegedly obviously.',
 'Nice moustache.':'mgjesdal: Thank you. It has sixteen shades and no downloadable cosmetics. That’s craftsmanship.',
 'What are Kiiim’s weaknesses?':'Izno: His insults practically contain their own answers: sharp bytes, garbage collection, and the Escape key. He calls that “self-documenting evil”.',
 'What does a scapegoat do?':'Izno: Blue screen? My fault. Missing mouse ball? My fault. DOS running out of memory? Apparently I should have thought smaller.',
 'Who makes that coffee?':'Izno: Retrogamingpappa. Joachim: He says he is Haj. Izno: And Kiiim says this is a department. We all need our little stories.',
 'Why a broom cupboard?':'Kiiim: COMPACT COMMAND CENTRE. The bucket is a recycling bin. The broom is a pointing device. The smell is backwards compatibility.',
 'Why erase the Amiga names?':'Kiiim: The Amiga wing has forty-two rooms! DOS gets a cupboard! Joachim: So you’re compressing other people’s achievements? Kiiim: I prefer “optimising the narrative”.',
 'Even you think Haj is Retrogamingpappa?':'Kiiim: Naturally. He once corrected my Sensible Software chronology before I finished threatening him. Haj, very far away: THAT PROVES NOTHING.'
};
export function hint(s){const f=s.flags;
 if(s.won)return ['The exhibition is saved. Enjoy the castle and its extremely dignified staff.','You can start another investigation from the game menu.'];
 return !f.hook?['The wishing well takes requests quite literally.','Use your 1 krone on the wishing well.']:!f.disk?['A good lead needs a good hook.','Use the disk hook on the well.']:!f.dry?['mgjesdal has a warm welcome for damp storage.','Use the wet floppy on mgjesdal in the Amiga wing.']:!s.inventory.includes('adapter')?['The restored disk still speaks a different format.','Talk to Zendar to get his bridge adapter.']:!f.archive?['Joachim has researched mistaken identities before.','In the newsroom, select Pick up and click the printing press.']:!f.pass?['An exhausted scapegoat deserves a break.','Talk to Haj, then use the coffee on Izno in the DOS cupboard.']:!f.duel?['Kiiim’s own words are the key to beating his insults.','Talk to Kiiim and duel. Choose bytes, garbage collection, and the Escape key.']:!f.evidence?['The original file deserves an actual reading.','Use the dry floppy on the DOS terminal.']:!f.hajClue?['That archive byline should get a reaction from Haj.','Use the archive clipping on Haj.']:!f.testimony?['A good reporter records a witness, not a rumour.','Use your notebook on Haj.']:!f.response?['Even this villain gets a right of reply.','Use your notebook on Kiiim.']:['The reporting is done. Time to save the exhibition.','Use the original credits on the editorial desk in the newsroom.'];
}
