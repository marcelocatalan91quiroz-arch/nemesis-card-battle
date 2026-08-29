const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const game=fs.readFileSync(path.join(root,'js','game.js'),'utf8');
const data=JSON.parse(fs.readFileSync(path.join(root,'data','nemesis_collection_33_cards.json'),'utf8'));
const A=(x,m)=>{if(!x){console.error('FAIL',m);process.exit(1)}console.log('PASS',m)};
const pub=data.cards.filter(c=>!String(c.id).startsWith('DM-'));
const dm=data.cards.filter(c=>String(c.id).startsWith('DM-'));
A(data.cards.length===33,'Colección conserva 33 cartas');
A(pub.length===23,'23 cartas generales exactas');
A(dm.length===10,'Duel Master conserva 10 cartas');
A(new Set(pub.map(c=>c.id)).size===23,'IDs generales únicos');
A(pub.find(c=>c.id==='UNI-006')?.nombre==='Égida Astral','UNI-006 autoritativa conservada');
A(pub.find(c=>c.id==='UNI-007')?.nombre==='Altar de los Dioses','UNI-007 autoritativa conservada');
A(pub.find(c=>c.id==='UNI-008')?.nombre==='Cristal del Vacío','UNI-008 autoritativa conservada');
const artIds=['UNI-001','UNI-002','UNI-003','UNI-004','UNI-005','UNI-008','UNI-009','UNI-010','UNI-011','UNI-012','ML-001','ML-002','ML-003','ML-004','ML-005','ML-006','ML-007','ML-008','ML-009','ML-010','ML-011'];
for(const id of artIds){
 const c=pub.find(x=>x.id===id);A(!!c,id+' existe');
 const expected='assets/images/public23/'+id.toLowerCase()+'.webp';
 A(c.img===expected,id+' apunta a arte oficial');
 A(fs.existsSync(path.join(root,expected)),id+' arte existe');
}
for(const marker of ['V19.3.0 — 23 CARTAS GENERALES','function pub23UseAbility','async function pub23UseMagic','async function pub23PreventDestroy','async function pub23ResurrectSpecific','async function pub23TurnStart','NEMESIS_PUBLIC23_AUDIT']) A(game.includes(marker),marker);
A(game.includes('pub23AfterDestroyed(side,victim);nemesisDmAfterDestroyed(side,victim);'),'hook Cementerio general + Duel Master');
A(game.includes('await pub23TurnStart();nemesisDmTurnStart();'),'hook inicio turno');
A(game.includes('pub23Sync();nemesisDmSync();'),'hook actualización');
console.log('NÉMESIS PUBLIC23 V19.3.0 STATIC: PASS');
