/* A fixed-answer practice set, not semantic or AI grading. No persistence/network. */
const gameSets=[
{id:'helpers',title:'1 · Character & help match',instruction:'Match each paraphrased contribution to its helper.',options:['Athene','Hermes'],cards:[
{id:'shield',text:'Provides a polished shield and instructions to view Medusa indirectly.',answer:'Athene',kind:'Paraphrase'},
{id:'sandals',text:'Provides winged sandals for travel across the sea.',answer:'Hermes',kind:'Paraphrase'}]},
{id:'sequence',title:'2 · Story structure sprint',instruction:'Order these opening events. These are events, not a complete plot diagram.',options:['1 · First','2 · Next','3 · Last'],cards:[
{id:'leap',text:'Perseus leaps from the cliff and travels through the air.',answer:'3 · Last',kind:'Paraphrase'},
{id:'athene',text:'Athene explains how to use the shield to face Medusa.',answer:'1 · First',kind:'Paraphrase'},
{id:'hermes',text:'Hermes explains the sandals and sword; Perseus puts them on.',answer:'2 · Next',kind:'Paraphrase'}]},
{id:'speaker',title:'3 · Who said it?',instruction:'Find this short quotation in the opening. Match its speaker.',options:['Athene','Hermes','Perseus'],cards:[
{id:'quote',text:'“These sandals of mine will bear you across the seas”',answer:'Hermes',kind:'Exact short excerpt'}]},
{id:'figurative',title:'4 · Figurative language detective',instruction:'In Hermes’s description of travel, identify the comparison below. Then explain its effect aloud.',options:['Simile','Metaphor','Personification'],cards:[
{id:'bird',text:'“like a bird”',answer:'Simile',kind:'Exact short excerpt'}]}
];
function checkPlacement(value,answer){return !value?'Choose a destination first.':value===answer?'Matches this fixed answer key. Now explain how the text supports your choice.':'Not this key’s match yet. Reread the opening and try another destination.'}
function buildGames(){
const root=document.getElementById('gameBoards');if(!root)return;
for(const set of gameSets){
 const section=document.createElement('section');section.className='gameboard';section.id='game-'+set.id;
 const h=document.createElement('h3');h.textContent=set.title;section.append(h);
 const p=document.createElement('p');p.textContent=set.instruction;section.append(p);
 const bank=document.createElement('div');bank.className='gamebank';
 const selects={};
 for(const card of set.cards){
  const el=document.createElement('article');el.className='cluecard';el.draggable=true;el.dataset.card=card.id;
  const badge=document.createElement('span');badge.className='small';badge.textContent=card.kind;
  const text=document.createElement('p');text.textContent=card.text;
  const label=document.createElement('label');label.htmlFor='place-'+card.id;label.textContent='Place this card';
  const select=document.createElement('select');select.id='place-'+card.id;selects[card.id]=select;
  for(const name of ['',...set.options]){const o=document.createElement('option');o.value=name;o.textContent=name||'Choose a destination';select.append(o)}
  el.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',set.id+':'+card.id);e.dataTransfer.effectAllowed='move'});
  select.addEventListener('change',()=>{result.textContent='Placement updated. Select Check to compare with the key.';refresh()});
  el.append(badge,text,label,select);bank.append(el);
 }
 section.append(bank);
 const destinations=document.createElement('div');destinations.className='destinations';
 const zones=[];
 for(const option of set.options){
  const zone=document.createElement('div');zone.className='dropzone';const title=document.createElement('strong');title.textContent=option;const list=document.createElement('p');list.className='small';zone.append(title,list);
  zone.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move'});
  zone.addEventListener('drop',e=>{e.preventDefault();const [group,id]=e.dataTransfer.getData('text/plain').split(':');if(group!==set.id||!selects[id])return;selects[id].value=option;result.textContent='Card placed at '+option+'. Select Check to compare with the key.';refresh()});
  destinations.append(zone);zones.push({option,list});
 }
 function refresh(){for(const z of zones){z.list.textContent=set.cards.filter(c=>selects[c.id].value===z.option).map(c=>c.text).join(' • ')||'Drop a card here, or use its menu above.'}}
 const check=document.createElement('button');check.type='button';check.textContent='Check placements';
 const result=document.createElement('div');result.className='gamefeedback';result.setAttribute('role','status');
 check.addEventListener('click',()=>{result.replaceChildren();for(const c of set.cards){const line=document.createElement('p');line.textContent=c.text+' '+checkPlacement(selects[c.id].value,c.answer);result.append(line)}if(set.id==='figurative'){const note=document.createElement('p');note.textContent='Teacher guidance: the comparison uses “like” to connect flight in the sandals with a bird’s movement. Your explanation still needs a human reader.';result.append(note)}});
 const reset=document.createElement('button');reset.type='button';reset.textContent='Reset this activity';reset.addEventListener('click',()=>{Object.values(selects).forEach(s=>s.value='');result.textContent='Activity reset.';refresh()});
 section.append(destinations,check,reset,result);root.append(section);refresh();
}
}
if(typeof document!=='undefined')buildGames();
if(typeof module!=='undefined')module.exports={checkPlacement,gameSets};
if(typeof document!=='undefined'){
 const clear=()=>['notebook-clue','notebook-page','notebook-paragraph','notebook-lines','notebook-why'].forEach(id=>document.getElementById(id).value='');
 document.getElementById('clear-notebook')?.addEventListener('click',clear);
 document.getElementById('reset')?.addEventListener('click',()=>{clear();document.getElementById('gameBoards').replaceChildren();buildGames()});
}
