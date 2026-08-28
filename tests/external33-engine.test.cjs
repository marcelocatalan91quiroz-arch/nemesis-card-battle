
const fs=require('fs'),path=require('path');
const s=fs.readFileSync(path.join(__dirname,'..','js','game.js'),'utf8');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','nemesis_collection_33_cards.json'),'utf8'));
const ids=data.cards.map(c=>c.id);
const A=(x,m)=>{if(!x){console.error('FAIL',m);process.exit(1)}};
A(ids.length===33,'33 cards');
A(new Set(ids).size===33,'unique ids');
A(s.includes('EXTERNAL_GAME_CARDS'),'adapter');
A(s.includes('NEMESIS_PUBLIC_23_IDS'),'public 23');
A(s.includes('NEMESIS_DUEL_MASTER_IDS'),'DM 10');
A(s.includes('state.savedDecks.DUEL_MASTER'),'second deck');
A(s.includes('MOTOR REAL PARA 33 CARTAS EXTERNAS'),'engine');
A(s.includes('applyExternalAbility'),'ability handler');
A(s.includes('applyExternalMagic'),'magic handler');
A(s.includes("sk.kind==='external'"),'creature handler');
A(s.includes("c?.externalCard)return await applyExternalMagic"),'magic route');
A(s.includes('nemesisExternal33Audit'),'runtime audit');
console.log('PASS external33 engine static integration');
