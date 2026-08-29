const fs=require('fs'),p=require('path'),r=p.resolve(__dirname,'..');
const d=JSON.parse(fs.readFileSync(p.join(r,'data','imperio_dragon_deck_v1.json'),'utf8'));
const g=fs.readFileSync(p.join(r,'js','game.js'),'utf8');
const A=(x,m)=>{if(!x){console.error('FAIL',m);process.exit(1)}console.log('PASS',m)};
A(d.deck_ids.length===5,'Imperio Dragón tiene 5/20 cartas iniciales');
A(new Set(d.deck_ids).size===5,'IDs IDR únicos');
for(const id of ['IDR-001','IDR-002','IDR-003','IDR-004','IDR-005']){A(d.cards.some(c=>c.id===id),id+' existe en datos');A(g.includes("id:'"+id+"'"),id+' registrado en motor')}
for(const k of ['IMPERIO_DRAGON_CARDS','IMPERIO_DRAGON_DECK_IDS','idrAddMark','idrOnSummon','idrBeforeAttack','idrAfterKill','idrStormSync'])A(g.includes(k),k+' implementado');
A(g.includes('state.savedDecks.IMPERIO_DRAGON'),'mazo IMPERIO_DRAGON registrado');
A(g.includes('state.savedDecks.OLIMPO'),'OLIMPO intacto');
A(g.includes('state.savedDecks.DUEL_MASTER'),'DUEL_MASTER intacto');
A(g.includes('DRAGON_OJO_DECK'),'campaña Dragón Ojo intacta');
A(g.includes('IRA_RA_BOSS_DECK'),'campaña Ira de Ra intacta');
console.log('IMPERIO DRAGON 5/20 STATIC: PASS');