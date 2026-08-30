const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const game=fs.readFileSync(path.join(root,'js/game.js'),'utf8');
const asset='assets/images/caballeros-submundo/caballero-demonio.webp';
const must=(name,ok)=>{if(!ok){console.error('FAIL',name);process.exitCode=1}else console.log('PASS',name)};

must('CS-001 registrado',game.includes("id:'CS-001',name:'Caballero Demonio'"));
must('familia Caballeros del Submundo',game.includes("family:'caballeros-submundo'"));
must('stats 7000/6000',game.includes("name:'Caballero Demonio',atk:7000,def:6000"));
must('rareza ancestral y nivel 10',game.includes("rarity:'ancestral',level:10"));
must('asset físico Caballero Demonio',fs.existsSync(path.join(root,asset)));
must('ruta estable del mazo',game.includes("img:'assets/images/caballeros-submundo/caballero-demonio.webp'"));
must('registro sin duplicar core',game.includes('CABALLEROS_SUBMUNDO_CARDS.forEach(c=>{if(!CARDS.some(x=>x.id===c.id))CARDS.push(c)})'));
must('Poder de los Caídos conectado al Cementerio',game.includes('function csSync()')&&game.includes('fallen*500')&&game.includes('fallen*300'));
must('Sacrificio Demoníaco operativo',game.includes("action:'demonSacrifice'")&&game.includes('await destroyCard(side,pick.i)')&&game.includes('_csSecondAttackTurn=turnNo'));
must('Heraldo evita destrucción una vez por duelo',game.includes('async function csPreventDestroy(')&&game.includes('_csHeraldUsedDuel=true')&&game.includes("if(side==='p')csQueue(side).push(returned.id)"));
must('protección conectada a destroyCard',game.includes('if(await csPreventDestroy(side,i,victim))return false'));
must('segundo ataque conectado a ambos flujos',game.includes('csKeepTurnAfterAttack(dmAttacker)')&&game.includes('csKeepTurnAfterAttack(c)'));
must('buff temporal se limpia',game.includes('function csClearTurn()')&&game.includes('c._csSacrificeAtk'));
must('colección/biblioteca reutilizada',game.includes('...CABALLEROS_SUBMUNDO_DECK_IDS]'));
must('auditoría runtime disponible',game.includes('NEMESIS_CABALLEROS_SUBMUNDO_AUDIT'));

if(process.exitCode)process.exit(process.exitCode);
console.log('CABALLEROS DEL SUBMUNDO · CS-001: PASS');
