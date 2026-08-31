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
must('protección conectada a destroyCard',game.includes("if(await csPreventDestroy(side,i,victim,cause))return false"));
must('segundo ataque conectado a ambos flujos',game.includes('csKeepTurnAfterAttack(dmAttacker)')&&game.includes('csKeepTurnAfterAttack(c)'));
must('buff temporal se limpia',game.includes('function csClearTurn()')&&game.includes('c._csSacrificeAtk'));
must('colección/biblioteca reutilizada',game.includes('...CABALLEROS_SUBMUNDO_DECK_IDS]'));
must('CS-002 registrado',game.includes("id:'CS-002',name:'Caballero de Alas de Oro'"));
must('CS-002 stats supremos 10000/8500',game.includes("name:'Caballero de Alas de Oro',atk:10000,def:8500"));
must('CS-002 conserva familia del mazo',game.includes("id:'CS-002'")&&game.includes("family:'caballeros-submundo'"));
must('CS-002 crecimiento dorado por Cementerio',game.includes("gold?fallen*700:fallen*500")&&game.includes("gold?fallen*500:fallen*300"));
must('CS-002 Sentencia conectada',game.includes("action:'goldenSentence'")&&game.includes("_csUnstoppableSecondTurn=turnNo"));
must('CS-002 Resurrección Dorada conectada',game.includes("if(csIs(victim,'CS-002'))")&&game.includes("_csGoldenResUsedDuel=true")&&game.includes("victim.atk+=2000;victim.def+=2000"));
must('CS-002 Último Juicio implementado',game.includes('function csGoldenPiercingDamage(')&&game.includes('length<5')&&game.includes("toast('ÚLTIMO JUICIO: '+csPierce+' de daño perforante directo.')")&&game.includes("toast('ÚLTIMO JUICIO: el daño perforante aumenta el impacto a '+hpDiff+'.')"));
must('CS-002 ruta estable reservada',game.includes("img:'assets/images/caballeros-submundo/caballero-alas-oro.png'"));
must('CS-003 registrado',game.includes("id:'CS-003',name:'Caballero de Alas de Oro Shiny'"));
must('CS-003 stats 12500/10500',game.includes("name:'Caballero de Alas de Oro Shiny',atk:12500,def:10500"));
must('CS-003 familia correcta',game.includes("id:'CS-003'")&&game.includes("family:'caballeros-submundo'"));
must('CS-003 Shiny Suprema',game.includes("rarity:'shiny-suprema'")&&game.includes("shiny:true"));
must('CS-003 crecimiento Cementerio',game.includes("shiny?fallen*1000")&&game.includes("shiny?fallen*700"));
must('CS-003 Sentencia Suprema',game.includes("action:'shinySentence'")&&game.includes("c.atk+=2000"));
must('CS-003 Resurrección Emperador',game.includes("_csEmperorResUsedDuel=true")&&game.includes("n<3")&&game.includes("victim.atk+=3000;victim.def+=3000"));
must('CS-003 perforación desde 4 caídos',game.includes("(csIs(c,'CS-003')?4:5)"));
must('CS-003 Estado Emperador conectado',game.includes("_csEmperorUsedDuel=true")&&game.includes("_csEmperorUntil=turnNo+1")&&game.includes("c.atk+=3000;c.def+=2000")&&game.includes("_csEmperorFloorAtk")&&game.includes("ESTADO EMPERADOR: la primera destrucción rival queda NEGADA"));
must('CS-003 anti-anulación conectado',game.includes("ESTADO EMPERADOR: la anulación rival queda NEGADA")&&game.includes("delete c._strategicSkillNegatedUntil"));
must('CS-003 Estado Emperador expira',game.includes("turnNo>c._csEmperorUntil")&&game.includes("delete c._csEmperorUntil"));
must('CS-003 ruta estable',game.includes("assets/images/caballeros-submundo/caballero-alas-oro-shiny.webp"));
must('CS-004 registrado',game.includes("id:'CS-004',name:'Caballero Luz de Horus'"));
must('CS-004 stats 9500/11000',game.includes("name:'Caballero Luz de Horus',atk:9500,def:11000"));
must('CS-004 familia correcta',game.includes("id:'CS-004'")&&game.includes("family:'caballeros-submundo'"));
must('CS-004 ruta estable',game.includes("img:'assets/images/caballeros-submundo/caballero-luz-horus.webp'")&&fs.existsSync(path.join(root,'assets/images/caballeros-submundo/caballero-luz-horus.webp')));
must('CS-004 Luz de los Caídos',game.includes("horus?fallen*500")&&game.includes("horus?fallen*800"));
must('CS-004 Ojo de Horus',game.includes('function csHorusEye(')&&game.includes("reduce su efecto en 50%")&&game.includes("csHorusEye(defendedSide,target.c,sk.value)"));
must('CS-004 Luz Funeraria',game.includes("_csHorusFuneralTurn!==turnNo")&&game.includes("horusCard.atk+=1000;horusCard.def+=1000"));
must('CS-004 Juicio Sol Negro',game.includes("action:'horusJudgement'")&&game.includes("_csHorusProtectedUntil=turnNo")&&game.includes("JUICIO DEL SOL NEGRO"));
must('CS-004 Guardián Rey Caído',game.includes('function csHorusBlessResurrection(')&&game.includes("card.atk+=1500;card.def+=1500")&&game.includes("csHorusBlessResurrection(side,rev)"));
must('CS-005 registrado',game.includes("id:'CS-005',name:'Caballero Rose'"));
must('CS-005 stats y familia',game.includes("name:'Caballero Rose',atk:10000,def:8500")&&game.includes("family:'caballeros-submundo'"));
must('CS-005 ruta estable',game.includes("assets/images/caballeros-submundo/caballero-rose.webp")&&fs.existsSync(path.join(root,'assets/images/caballeros-submundo/caballero-rose.webp')));
must('CS-005 Marcas de Rosa',game.includes('function csRoseApplyMark(')&&game.includes("700*d")&&game.includes("500*d"));
must('CS-005 Pétalo',game.includes('function csRoseUseSkill(')&&game.includes("2000 HP directo"));
must('CS-005 Rosa del Caído',game.includes("_csFuneralRoses")&&game.includes("roseCard.atk+=500;roseCard.def+=500"));
must('CS-005 Jardín',game.includes("_csRoseGardenUntil=turnNo+1")&&game.includes("JARDÍN DE LA MUERTE activo durante 2 turnos"));
must('CS-004 sync corregido',game.includes("!csIs(c,'CS-004'))return;"));
must('CS-006 registrado',game.includes("id:'CS-006',name:'Caballero Sombra de Venuz'"));
must('CS-006 stats y familia',game.includes("name:'Caballero Sombra de Venuz',atk:15000,def:13000")&&game.includes("family:'caballeros-submundo'"));
must('CS-006 ruta oficial',game.includes("assets/images/caballeros-submundo/caballero-sombra-de-venuz.webp"));
must('CS-006 Sombra Absoluta',game.includes("_csVenuzAbsorbedFallen")&&game.includes("venuz.atk+=1200*d;venuz.def+=800*d"));
must('CS-006 Eclipse',game.includes("function csVenuzUseSkill(")&&game.includes("pierde 50% ATK/DEF"));
must('CS-006 Retorno',game.includes("_csVenuzReturnUsedDuel")&&game.includes("RETORNO DEL SOBERANO"));
must('CS-006 Eclipse Final',game.includes("_csVenuzFinalUntil=turnNo+1")&&game.includes("csVenuzPiercingDamage"));
must('auditoría runtime disponible',game.includes('NEMESIS_CABALLEROS_SUBMUNDO_AUDIT'));

if(process.exitCode)process.exit(process.exitCode);
console.log('CABALLEROS DEL SUBMUNDO · CS-001: PASS');

// CS-002 final art gate trigger

must('CS-007 Caballero Sombra de Venuz Shiny registrado',game.includes("id:'CS-007',name:'Caballero Sombra de Venuz Shiny'"));
must('CS-007 stats 18000/16000',game.includes("name:'Caballero Sombra de Venuz Shiny',atk:18000,def:16000"));
must('CS-007 no reemplaza CS-006',game.includes("id:'CS-006',name:'Caballero Sombra de Venuz'")&&game.includes("id:'CS-007',name:'Caballero Sombra de Venuz Shiny'"));
must('CS-007 ruta completa estable',game.includes("img:'assets/images/caballeros-submundo/caballero-sombra-de-venuz-shiny.webp'"));
must('CS-007 Sombra Absoluta Shiny',game.includes("_csVenuzShinyAbsorbedFallen")&&game.includes("venuzShiny.atk+=1500*d;venuzShiny.def+=1000*d"));
must('CS-007 Eclipse Supremo',game.includes("action:'venuzShinyEclipse'")&&game.includes("c.atk+=2500"));
must('CS-007 protecciones separadas combate/efecto',game.includes("cause==='combat'?'_csShinyCombatGuardTurn':'_csShinyEffectGuardTurn'")&&game.includes("PROTECCIÓN SUPREMA SHINY"));
must('CS-007 Renacer del Vacío',game.includes("_csShinyRenacerUsedDuel=true")&&game.includes("victim.atk+=4000;victim.def+=4000")&&game.includes("n<2"));
must('CS-007 Eclipse Eternidad',game.includes("_csVenuzShinyFinalUsedDuel=true")&&game.includes("_csShinyEclipseUntil=turnNo+1")&&game.includes("c.atk+=6000;c.def+=4000"));
must('CS-007 Cuerpo Eclipse 70%',game.includes("_csShinyFloorAtk=Math.ceil(c.atk*.7)")&&game.includes("_csShinyFloorDef=Math.ceil(c.def*.7)"));
must('CS-007 perforación conectada',game.includes("function csVenuzShinyPiercingDamage")&&game.includes("if(csIs(c,'CS-007'))return csVenuzShinyPiercingDamage"));
must('CS-007 anti-anulación',game.includes("_csShinyNegateTurn!==turnNo")&&game.includes("la primera anulación dirigida del turno queda NEGADA"));

must('CS-008 registrado',game.includes("id:'CS-008',name:'Caballero Meteoro'"));
must('CS-008 stats 11500/15000',game.includes("name:'Caballero Meteoro',atk:11500,def:15000"));
must('CS-008 familia correcta',game.includes("id:'CS-008'")&&game.includes("family:'caballeros-submundo'"));
must('CS-008 arte físico',game.includes("img:'assets/images/caballeros-submundo/caballero-meteoro.webp'")&&fs.existsSync(path.join(root,'assets/images/caballeros-submundo/caballero-meteoro.webp')));
must('CS-008 Núcleo Estelar',game.includes("action:'meteorCore'")&&game.includes("NÚCLEO ESTELAR")&&game.includes("c.def-=2000;c.atk+=2000"));
must('CS-008 Impacto de Retorno',game.includes("function csMeteorIntercept(")&&game.includes("attacker.atk=Math.max(0,(attacker.atk||0)-2000)"));
must('CS-008 Armadura Meteórica',game.includes("_csMeteorArmorTurn!==turnNo")&&game.includes("victim.def+=1000"));
must('CS-008 Guardián del Submundo',game.includes("_csMeteorGuardianTurn!==turnNo")&&game.includes("m.def=Math.max(0,m.def-1500)"));
must('CS-008 Contraataque Meteoro',game.includes("damageFx(2000")&&game.includes("CONTRAATAQUE METEORO"));
must('CS-008 Ultimate 2 turnos',game.includes("_csMeteorRainUntil=turnNo+1")&&game.includes("_csMeteorRainSelfDef=4000")&&game.includes("_csMeteorRainAllyDef"));
must('CS-008 bloqueo primer ataque',game.includes("function csMeteorRainBlocksAttack(")&&game.includes("_csMeteorRainBlockTurn===turnNo"));
must('CS-008 conectado a combate',game.includes("di=await csMeteorIntercept(defSide,di,A)")&&game.includes("if(csMeteorRainBlocksAttack(defSide))"));
if(process.exitCode)process.exit(process.exitCode);
console.log('CABALLERO METEORO · CS-008: PASS');

must('CS-009 registrado',game.includes("id:'CS-009',name:'Cerberus Oscuro'"));
must('CS-009 stats',game.includes("name:'Cerberus Oscuro',atk:14500,def:11500"));
must('CS-009 arte físico',game.includes("img:'assets/images/caballeros-submundo/cerberus-oscuro.webp'")&&fs.existsSync(path.join(root,'assets/images/caballeros-submundo/cerberus-oscuro.webp')));
must('CS-009 ultimate',game.includes("function csCerberusUseSkill(")&&game.includes("_csCerberusAttackCap=3"));
must('CS-009 escalado',game.includes("csCerberusBeforeAttack")&&game.includes("Math.min(4000,Math.floor(csSubCount(side)/2)*500)"));
must('CS-010 registrado',game.includes("id:'CS-010',name:'Pegasus Negro'"));
must('CS-010 stats',game.includes("name:'Pegasus Negro',atk:15000,def:12500"));
must('CS-010 arte físico',game.includes("img:'assets/images/caballeros-submundo/pegasus-negro.webp'")&&fs.existsSync(path.join(root,'assets/images/caballeros-submundo/pegasus-negro.webp')));
must('CS-010 eclipse',game.includes("function csPegasusUseSkill(")&&game.includes("_csPegasusEclipseUntil=turnNo+1"));
must('CS-010 evasión',game.includes("function csPegasusEvade(")&&game.includes("VUELO DEL ECLIPSE"));
must('CS-010 perforación',game.includes("csIs(c,'CS-010')")&&game.includes("_csPegasusEclipseUntil"));
must('CS-009/010 auditoría',game.includes("'CS-009','CS-010'")&&game.includes("cerberus:typeof csCerberusUseSkill==='function'")&&game.includes("pegasus:typeof csPegasusUseSkill==='function'"));
if(process.exitCode)process.exit(process.exitCode);
console.log('MONSTRUOS DEL SUBMUNDO · CS-009/CS-010: PASS');

for(const [id,name,img] of [
 ['CS-011','Luz de Ares','luz-de-ares.webp'],['CS-012','Sentencia de Venuz','sentencia-de-venuz.webp'],
 ['CS-013','Aguijón de Escorpión','aguijon-de-escorpion.webp'],['CS-014','Agujero Negro','agujero-negro.webp']
]){
 must(id+' registrado',game.includes("id:'"+id+"',name:'"+name+"'"));
 must(id+' es arma',game.includes("id:'"+id+"'")&&game.includes("subtype:'weapon'"));
 must(id+' arte físico',fs.existsSync(path.join(root,'assets/images/caballeros-submundo/'+img)));
}
must('armas usan equipamiento central',game.includes("c?.family==='caballeros-submundo'&&c?.subtype==='weapon'")&&game.includes("nemesisEquip(side,idx,'weapon',c"));
must('Sentencia conserva afinidad Venuz',game.includes("c.id==='CS-012'&&['CS-006','CS-007'].includes(arr[idx].id)"));
if(process.exitCode)process.exit(process.exitCode);
console.log('ARMAS SUBMUNDO · CS-011/CS-014: PASS');

for(const [id,name,img] of [
 ['CS-015','Armadura Olvidada','armadura-olvidada.webp'],
 ['CS-016','Armadura Forjada de Plutón','armadura-forjada-pluton.webp']
]){
 must(id+' registrado',game.includes("id:'"+id+"',name:'"+name+"'"));
 must(id+' es armadura',game.includes("id:'"+id+"'")&&game.includes("subtype:'armor'"));
 must(id+' arte físico',fs.existsSync(path.join(root,'assets/images/caballeros-submundo/'+img)));
}
must('armaduras usan ranura central',game.includes("csSubworldArmorMagic")&&game.includes("nemesisEquip(side,i,'armor',a"));
must('Armadura Olvidada memorias',game.includes("eq.memories=(eq.memories||0)+1")&&game.includes("_csForgottenPierceReady"));
must('Armadura Olvidada evita destrucción',game.includes("NEGARSE A MORIR")&&game.includes("victim.def=1"));
must('Plutón cargas de forja',game.includes("eq.forgeCharges=(eq.forgeCharges||0)+1")&&game.includes("_csPlutoVengeance"));
must('Plutón Poder de los Caídos',game.includes("PODER DE LOS CAÍDOS")&&game.includes("Math.floor(base*.20)"));
must('Ultimates de armadura',game.includes("function csSubworldArmorUltimate(")&&game.includes("armorForgottenUltimate")&&game.includes("armorPlutoUltimate"));
if(process.exitCode)process.exit(process.exitCode);
console.log('ARMADURAS SUBMUNDO · CS-015/CS-016: PASS');


must('CS-017 registrado',game.includes("id:'CS-017',name:'Corazón del Tártaro'"));
must('CS-017 es reliquia',game.includes("id:'CS-017'")&&game.includes("subtype:'relic'"));
must('CS-017 ruta oficial',game.includes("assets/images/caballeros-submundo/corazon-del-tartaro.webp"));
must('CS-017 almas 5 y aura',game.includes("CORAZÓN DEL TÁRTARO: ALMA")&&game.includes("souls*300+(souls>=5?500:0)"));
must('CS-017 Ultimate Puertas del Tártaro',game.includes("action:'tartarusGates'")&&game.includes("PUERTAS DEL TÁRTARO"));
must('CS-018 registrado',game.includes("id:'CS-018',name:'Trono de las Almas Perdidas'"));
must('CS-018 es reliquia',game.includes("id:'CS-018'")&&game.includes("subtype:'relic'"));
must('CS-018 ruta oficial',game.includes("assets/images/caballeros-submundo/trono-almas-perdidas.webp"));
must('CS-018 almas enemigas y debuff',game.includes("ALMA ENEMIGA")&&game.includes("souls*300"));
must('CS-018 Trono Maldito',game.includes("function csSubworldRelicNegateMagic(")&&game.includes("TRONO MALDITO"));
must('CS-018 Ultimate Juicio del Inframundo',game.includes("action:'underworldJudgement'")&&game.includes("JUICIO DEL INFRAMUNDO"));
must('reliquias conectadas a applyMagic',game.includes("subtype==='relic')return await csSubworldRelicMagic(side,c)"));
must('reliquias conectadas a Cementerio',game.includes("grave.push(arr[i]);csSubworldRelicOnDestroyed(side,victim)"));
must('auditoría incluye CS-017/018',game.includes("'CS-016','CS-017','CS-018'"));
if(process.exitCode)process.exit(process.exitCode);
console.log('RELIQUIAS SUBMUNDO · CS-017/CS-018: PASS');

must('CS-019 registrado',game.includes("id:'CS-019',name:'Escudo de Luna'"));
must('CS-019 es mágica de hechizo',game.includes("id:'CS-019'")&&game.includes("subtype:'spell'"));
must('CS-019 arte físico',fs.existsSync(path.join(root,'assets/images/caballeros-submundo/escudo-de-luna.webp')));
must('CS-019 motor operativo',game.includes("m.id==='CS-019'")&&game.includes("ECLIPSE DE LA LUNA INMORTAL"));
must('CS-020 registrado',game.includes("id:'CS-020',name:'Rayo del Submundo'"));
must('CS-020 es mágica de hechizo',game.includes("id:'CS-020'")&&game.includes("subtype:'spell'"));
must('CS-020 arte físico',fs.existsSync(path.join(root,'assets/images/caballeros-submundo/rayo-del-submundo.webp')));
must('CS-020 motor operativo',game.includes("m.id==='CS-020'")&&game.includes("TORMENTA DEL FIN DEL SUBMUNDO"));
must('mágicas conectadas a applyMagic',game.includes("subtype==='spell')return await csSubworldSpellMagic(side,c)"));
must('auditoría completa 20 cartas',game.includes("'CS-018','CS-019','CS-020'")&&game.includes("planned:20"));
if(process.exitCode)process.exit(process.exitCode);
console.log('MÁGICAS SUBMUNDO · CS-019/CS-020: PASS');
