
const fs=require('fs'),path=require('path');
const s=fs.readFileSync(path.join(__dirname,'..','js','game.js'),'utf8');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','nemesis_collection_33_cards.json'),'utf8'));
const ids=data.cards.map(c=>c.id);
const A=(x,m)=>{if(!x){console.error('FAIL',m);process.exit(1)}};
A(ids.length===43,'43 cards: 23 públicas + 20 Duel Master');
A(new Set(ids).size===43,'unique ids');
A(s.includes('EXTERNAL_GAME_CARDS'),'adapter');
A(s.includes('NEMESIS_PUBLIC_23_IDS'),'public 23');
A(s.includes('NEMESIS_DUEL_MASTER_IDS'),'DM 20');
A(s.includes('NEMESIS_OFFICIAL_DECK_REGISTRY')&&s.includes('DUEL_MASTER:NEMESIS_DUEL_MASTER_IDS'),'second deck en fuente oficial');
A(s.includes('MOTOR REAL PARA 33 CARTAS EXTERNAS'),'engine');
A(s.includes('applyExternalAbility'),'ability handler');
A(s.includes('applyExternalMagic'),'magic handler');
A(s.includes("sk.kind==='external'"),'creature handler');
A(s.includes("c?.externalCard)return await applyExternalMagic"),'magic route');
A(s.includes('nemesisExternal33Audit'),'runtime audit');
console.log('PASS external33 engine static integration');
