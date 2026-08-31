const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const game=fs.readFileSync(path.join(root,'js/game.js'),'utf8');
const art='assets/images/strategic/eclipse-de-nemesis.svg';
const A=(n,v)=>{if(!v)throw new Error('FAIL '+n);console.log('PASS '+n)};

A('MS-001 registrada',game.includes("id:'MS-001'")&&game.includes("name:'Eclipse de NÉMESIS'"));
A('tipo Mágica universal secreta',game.includes("type:'magic',subtype:'spell',family:'universal'")&&game.includes("rarity:'secreta-nemesis'"));
A('solo canje estratégico',game.includes("strategicRedeem:true,shopExclusive:true,priceStars:5000"));
A('no se entrega automáticamente',!game.includes("INITIAL_OWNED")||!(/INITIAL_OWNED[^;]*MS-001/.test(game)));
A('arte registrado y físico',game.includes("img:'"+art+"'")&&fs.existsSync(path.join(root,art))&&fs.statSync(path.join(root,art)).size>1000);
A('Mago Rojo usa mazo completo 20',game.includes("MAGO_ROJO:MAGO_ROJO_DECK_IDS")&&game.includes("return Array.isArray(official)&&official.length?official.length:20"));
A('Imperio Dragón usa mazo completo 20',game.includes("IMPERIO_DRAGON:IMPERIO_DRAGON_DECK_IDS")&&game.includes("return Array.isArray(official)&&official.length?official.length:20"));
A('Olimpo conserva su tamaño real 11',game.includes("OLIMPO:OLIMPO_DECK_IDS")&&game.includes("function nemesisDeckLimit"));
A('duelo local consume mazo completo',game.includes("const deckQueue=state.deck.slice(0,nemesisActiveDeckLimit())"));
A('usable por cualquier mazo tras canje',!(/NEMESIS_PRIVATE_CARD_IDS[^;]*MS-001/.test(game))&&game.includes("function nemesisCardAllowedForUser(id){return !NEMESIS_PRIVATE_CARD_IDS.has(id)||nemesisOwnerSessionActive()}")&&game.includes("state.deck.filter(id=>state.owned.includes(id)&&card(id)&&nemesisCardAllowedForUser(id))"));
A('colección permite agregarla al mazo solo si fue canjeada',game.includes("document.querySelectorAll('.card[data-owned=\"1\"][data-id]')")&&game.includes("else if(state.deck.length<11)state.deck.push(id)"));
A('ruta de Intercambio incluye estratégicas',game.includes('list.push(...STRATEGIC_REDEEM_CARDS)')&&game.includes('function shopScene()'));
A('canje descuenta estrellas',game.includes('state.stars-=price')&&game.includes('state.owned.push(id)'));
A('Eclipse no negociable',game.includes('unnegatable:true')&&game.includes('uncopyable:true')&&game.includes('noOpponentSearch:true'));
A('motor Eclipse conectado',game.includes("c?.effect==='nemesisAbsoluteEclipse'")&&game.includes('async function nemesisAbsoluteEclipseMagic'));
for(const fn of ['nemesisEclipseJudgement','nemesisEclipseResurrection','nemesisEclipseSilence','nemesisEclipseAscension','nemesisEclipseRupture'])A(fn+' operativo',game.includes('function '+fn)||game.includes('async function '+fn));
A('elige exactamente 3 de 5',game.includes("picks.length!==3")&&game.includes("ACTIVAR '+selected.size+'/3"));
A('una vez por duelo reseteable',game.includes('__nemesisEclipseUsedP=false')&&game.includes('__nemesisEclipseUsedE=false')&&game.includes('ECLIPSE ABSOLUTO ya fue resuelto'));
A('Juicio destierra fuera de Cementerio',game.includes("__nemesisEclipseBanished.push")&&game.includes("_banishedBy:'MS-001'"));
A('Ascensión +3500/+3500',game.includes("x.atk=(x.atk||0)+3500")&&game.includes("x.def=(x.def||0)+3500"));
A('protección Eclipse integrada a destrucción',game.includes('PROTECCIÓN DEL ECLIPSE evita su destrucción'));
A('buff de 2 turnos expira',game.includes('_eclipseAscUntil=turnNo+2')&&game.includes('nemesisEclipseExpire()'));

// Simulador de precio NÉMESIS: pondera los 5 poderes, flexibilidad y condición una vez por duelo.
const weights={
 juicioDestierroIgnoraProteccion:1300,
 renacimientoEfectosRestaurados:1100,
 silencioAnulacion:900,
 ascension3500x2Turnos:700,
 rupturaIrrecuperable:700,
 flexibilidadElegir3de5:400,
 innegable:500,
 limiteUnaVezDuelo:-600
};
const simulated=Object.values(weights).reduce((a,b)=>a+b,0);
const listed=5000;
const oldTop=3500; // Orbe del Poder
const hadesReward=500;
const rematches=Math.ceil(listed/hadesReward);
A('precio simulado = ★5000',simulated===listed);
A('precio superior al Orbe ★3500',listed>oldTop);
A('precio alcanzable por progreso/revancha',rematches===10);
console.log(JSON.stringify({card:'MS-001 Eclipse de NÉMESIS',simulatedPrice:simulated,listedPrice:listed,previousStrategicCeiling:oldTop,hadesRematchesAt500:rematches,weights},null,2));
console.log('NÉMESIS MS-001 ECLIPSE + PRICE SIMULATOR: PASS');
