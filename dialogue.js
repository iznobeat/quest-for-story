export const voices={
 joachim:{name:'Joachim',color:'#f2d184'},
 zendar:{name:'Zendar',color:'#f0a193'},
 haj:{name:'Haj',color:'#8ecfff'},
 mgjesdal:{name:'mgjesdal',color:'#bbe18d'},
 kiiim:{name:'Kiiim',color:'#d9a1fa'},
 izno:{name:'Izno',color:'#f0b77c'}
};
// Convert authored exchanges into individual turns. Stage directions belong
// to the speaker label, never to the sentence shown beside the portrait.
export function splitSpeech(text,fallback='joachim'){
 const pattern=/\b(Joachim|Zendar|Haj|mgjesdal|Kiiim|Izno)(?:,\s*(from across the room|very far away))?:\s*/gi;
 const matches=[...text.matchAll(pattern)],lines=[];
 if(!matches.length)return [{speaker:voices[fallback]?fallback:'joachim',text}];
 const intro=text.slice(0,matches[0].index).trim();if(intro)lines.push({speaker:voices[fallback]?fallback:'joachim',text:intro});
 for(let i=0;i<matches.length;i++){const m=matches[i],body=text.slice(m.index+m[0].length,matches[i+1]?.index??text.length).trim();if(body)lines.push({speaker:m[1].toLowerCase(),text:body,aside:m[2]||''})}
 return lines;
}
