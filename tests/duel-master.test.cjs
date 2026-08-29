const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const game=fs.readFileSync(path.join(root,'js','game.js'),'utf8');
const data=JSON.parse(fs.readFileSync(path.join(root,'data','nemesis_collection_33_cards.json'),'utf8'));
const A=(x,m)=>{if(!x){console.error('FAIL',m);process.exit(1)}else console.log('PASS',m)};
const dm=data.cards.filter(c=>/^DM-\d{3}$/.test(c.id));
A(dm.length===20,'Duel Master contiene 20 cartas');
A(new Set(dm.map(c=>c.id)).size===20,'IDs DM únicos');
for(let i=1;i<=20;i++){
 const id='DM-'+String(i).padStart(3,'0'),c=dm.find(x=>x.id===id);
 A(!!c,id+' existe');
 A(c.img==='assets/images/external33/'+id.toLowerCase()+'.svg',id+' imagen final mapeada');
 A(fs.existsSync(path.join(root,c.img)),id+' asset existe');
}
A(fs.existsSync(path.join(root,'assets/images/external33/duel-master-sprite.webp')),'sprite real Duel Master existe');
const onk=dm.find(c=>c.id==='DM-010');
A(onk.hp===13000,'Onkolxón HP 13000');
A(onk.energia===14,'Onkolxón Energía 14');
A(Array.isArray(onk.habilidades)&&onk.habilidades.length===4,'Onkolxón 4 habilidades finales');
A(String(onk.ultimate?.nombre||'').includes('Aurora del Fin Austral'),'Onkolxón Ultimate final');
for(const id of ['DM-001','DM-002','DM-003','DM-004','DM-007','DM-008','DM-009','DM-010','DM-011','DM-012','DM-018']){
 const c=dm.find(x=>x.id===id);A(Array.isArray(c.habilidades)&&c.habilidades.length>=4,id+' habilidades completas');
}
A(game.includes('NEMESIS DUEL MASTER V19.2.9 — MOTOR ESPECIFICO'),'motor DM específico');
A(game.includes('function dmSkillDescriptor'),'descriptor DM');
A(game.includes('async function dmUseAbility'),'handler habilidades DM');
A(game.includes('async function nemesisDmCheckHunterTrap'),'trigger Cacería');
A(game.includes('zeusResponse'),'respuesta especial Zeus');
A(game.includes('function nemesisDmPreventDestroy'),'protecciones DM');
A(game.includes('function nemesisDmAfterDestroyed'),'Cementerio/contadores DM');
A(game.includes('function nemesisDmKeepTurnAfterAttack'),'ataques adicionales DM');
A(game.includes('NEMESIS_DUEL_MASTER_AUDIT'),'auditoría runtime DM');
A(game.includes('function dmDeepSync'),'sinergia profunda 20/20');
A(game.includes('function dmTryShinyAwakening'),'transformación Thor Shiny');
A(game.includes('function dmRealmFusion'),'fusión estratégica Eclipse de los Reinos');
A(game.includes('function dmTitanJudgement'),'contrahechizo Juicio de Titanes');
A(game.includes('function nemesisDmAfterKill'),'efectos de armas tras destrucción');
A(game.includes("dmEq(c,'weapon','DM-015')"),'Martillo de Thor conectado');
A(game.includes("dmEq(c,'weapon','DM-017')"),'Arma Santa conectada');
A(game.includes("dmActiveEquipment(side,'DM-016')"),'Corona del Dominio global');
A(game.includes("dmActiveEquipment(side,'DM-014')"),'Antorcha del Olimpo global');
console.log('NÉMESIS DUEL MASTER 20/20 DEEP STATIC: PASS');
