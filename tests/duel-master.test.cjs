const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const game=fs.readFileSync(path.join(root,'js','game.js'),'utf8');
const data=JSON.parse(fs.readFileSync(path.join(root,'data','nemesis_collection_33_cards.json'),'utf8'));
const A=(x,m)=>{if(!x){console.error('FAIL',m);process.exit(1)}else console.log('PASS',m)};
const dm=data.cards.filter(c=>/^DM-\d{3}$/.test(c.id));
A(data.cards.length===33,'Colección externa conserva 33 cartas');
A(dm.length===10,'Duel Master contiene exactamente 10 cartas');
A(data.cards.filter(c=>!String(c.id).startsWith('DM-')).length===23,'23 cartas generales separadas');
A(new Set(dm.map(c=>c.id)).size===10,'IDs Duel Master únicos');
for(let i=1;i<=10;i++){
 const id='DM-'+String(i).padStart(3,'0'),c=dm.find(x=>x.id===id);
 A(!!c,id+' existe');
 A(c.img==='assets/images/external33/'+id.toLowerCase()+'.webp',id+' usa imagen WEBP');
 A(fs.existsSync(path.join(root,c.img)),id+' imagen existe');
}
const onk=dm.find(c=>c.id==='DM-010');
A(onk.hp===13000,'Onkolxón HP 13000');
A(onk.energia===14,'Onkolxón Energía 14');
A(Array.isArray(onk.habilidades)&&onk.habilidades.length===4,'Onkolxón 4 habilidades finales');
A(String(onk.ultimate?.nombre||'').includes('Aurora del Fin Austral'),'Onkolxón Ultimate final');
for(const id of ['DM-001','DM-002','DM-003','DM-004','DM-007','DM-008','DM-009','DM-010']){
 const c=dm.find(x=>x.id===id);A(Array.isArray(c.habilidades)&&c.habilidades.length>=4,id+' habilidades definidas');
}
for(const marker of ['V19.2.9 — DUEL MASTER: motor específico','function dmSkillDescriptor','async function dmUseAbility','async function dmApplyMagic','function dmSyncPassives','function dmAfterDestroyed','function dmTurnStart','NEMESIS_DUEL_MASTER_AUDIT']) A(game.includes(marker),marker);
A(game.includes('img:c.img||'),'adapter respeta imagen definida por carta');
console.log('NÉMESIS DUEL MASTER V19.2.9 STATIC: PASS');
