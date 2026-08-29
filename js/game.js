
// V19.2.1 — BOOT GUARD: evita pantalla negra y muestra error recuperable.
window.addEventListener('error',e=>{
 console.error('[NÉMESIS BOOT]',e.error||e.message);
 const a=document.getElementById('app');
 if(a && !a.innerText.trim()){
   a.innerHTML=`<main style="min-height:100vh;display:grid;place-items:center;background:#05060b;color:white;font-family:Arial;padding:30px;text-align:center">
   <div><h1 style="color:#f2d36b">NÉMESIS</h1><h2>Error de inicio recuperado</h2>
   <p>El juego encontró un error antes de dibujar el menú.</p>
   <button onclick="location.reload()" style="padding:12px 22px;font-weight:900">REINTENTAR</button>
   <pre style="white-space:pre-wrap;max-width:900px;opacity:.65">${String(e.message||'Error desconocido')}</pre></div></main>`;
 }
});
window.addEventListener('unhandledrejection',e=>{
 console.error('[NÉMESIS PROMISE]',e.reason);
});

// NÉMESIS LLAMAS DEL CAOS · V18.9.52 · ARENA ESPECTRAL CAMPAÑA II

const BASE_CARDS=[
 {id:'payaso-oscuro',name:'Payaso Oscuro',atk:1500,def:900,img:'assets/images/img-01.webp'},
 {id:'payaso-ultra',name:'Payaso Ultra',atk:1800,def:1200,img:'assets/images/img-02.webp'},
 {id:'demonio-sombra',name:'Demonio de la Sombra',atk:3000,def:2000,img:'assets/images/img-03.webp'},
 {id:'samurai-trueno',name:'Samurái del Trueno',atk:2500,def:1400,img:'assets/images/img-04.webp'},
 {id:'reina-de-hielo',name:'Reina de Hielo',atk:2200,def:2000,img:'assets/images/img-05.webp'},
 {id:'angel-caido',name:'Ángel Caído',atk:2400,def:1700,img:'assets/images/img-06.webp'},
 {id:'angel-caido-epica',name:'Ángel Caído Celestial',atk:2900,def:2600,img:'assets/images/img-07.webp'},
 {id:'dragon-infernal',name:'Dragón Infernal',atk:2800,def:2600,img:'assets/images/img-08.webp'},
 {id:'ares-maldito',name:'Ares Maldito',atk:3000,def:2900,img:'assets/images/img-09.webp'}
];
const PLAYER_EXCLUSIVE_CARDS=[
 {id:'bestia-zombie-infierno',name:'Bestia Zombie del Infierno',atk:3500,def:4800,type:'monster',playerOnly:true,img:'assets/images/bestia-zombie-infierno.png'},
 {id:'bestia-llanura',name:'Bestia de la Llanura',atk:0,def:4000,type:'monster',playerOnly:true,img:'assets/images/bestia-llanura.png'},
 {id:'minotauro-caido',name:'Minotauro Caído',atk:0,def:3000,type:'monster',playerOnly:true,img:'assets/images/minotauro-caido.png'},
 {id:'nemesis-celestial',name:'NÉMESIS Celestial',atk:5200,def:2800,type:'monster',playerOnly:true,img:'assets/images/nemesis-celestial.png'},
 {id:'trampa-calavera-muerta',name:'Calavera Muerta',atk:0,def:0,type:'trap',effect:'destroyAttacker',playerOnly:true,oneShot:true,img:'assets/images/trampa-calavera-muerta.png'}
];
// V18.9.42 — cartas divinas exclusivas del jugador.
// Se integran a la colección sin reemplazar cartas existentes ni alterar mazos de jefes.
const DIVINE_PLAYER_CARDS=[
 {id:'dios-jupiter',name:'Dios Júpiter',atk:8500,def:3000,type:'monster',rarity:'divina',family:'universo',effect:'solarShield',playerOnly:true,img:'assets/images/dios-jupiter.png'},
 {id:'fantasma-del-universo',name:'Fantasma del Universo',atk:0,def:0,type:'monster',rarity:'divina',family:'universo',effect:'phantomReflect',playerOnly:true,img:'assets/images/fantasma-del-universo.png'},
 {id:'zeus-emperador-rayo',name:'Zeus — Emperador del Rayo',atk:10000,def:6000,type:'monster',rarity:'divina',family:'universo',effect:'zeusThunder',playerOnly:true,img:'assets/images/zeus-emperador-rayo.png'},
 {id:'kronos-devorador-tiempo',name:'Kronos — Devorador del Tiempo',atk:7500,def:8500,type:'monster',rarity:'divina',family:'universo',effect:'kronosTime',playerOnly:true,img:'assets/images/kronos-devorador-tiempo.png'}
];
const DIVINE_FUSION_CARDS=[
 {id:'titan-del-olimpo',name:'Titán del Olimpo',atk:20000,def:15000,type:'fusion',rarity:'suprema-divina',family:'universo',effect:'olympusSupreme',playerOnly:true,materials:['dios-jupiter','zeus-emperador-rayo','kronos-devorador-tiempo'],img:'assets/images/titan-del-olimpo.png'}
];
const NEW_CARDS=[
 {id:'dragon-carmesi-caos',name:'Dragón Carmesí del Caos',atk:3000,def:2500,type:'monster',img:'assets/images/dragon-carmesi.webp'},
 {id:'dragon-abisal-nemesis',name:'Dragón Abisal NÉMESIS',atk:2800,def:2400,type:'monster',img:'assets/images/dragon-abisal.webp'},
 {id:'dragon-negro-ruinas',name:'Dragón Negro de las Ruinas',atk:2600,def:2300,type:'monster',img:'assets/images/dragon-negro-ruinas.webp'},
 {id:'dragon-infernal-sangre',name:'Dragón Infernal de Sangre',atk:2500,def:2100,type:'monster',img:'assets/images/dragon-infernal-sangre.webp'},
 {id:'fusion-caotico-supremo',name:'Dragón Caótico Supremo',atk:4200,def:2000,type:'fusion',img:'assets/images/fusion-caotico-supremo.webp',materials:['dragon-carmesi-caos','dragon-abisal-nemesis']},
 {id:'fusion-dragon-caos',name:'Dragón del Caos',atk:7000,def:6000,type:'fusion',img:'assets/images/fusion-dragon-caos.webp',materials:['dragon-negro-ruinas','dragon-infernal-sangre']},
 {id:'magica-curandero',name:'Curandero NÉMESIS',type:'magic',effect:'heal',value:1000,atk:0,def:0,img:'assets/images/magica-curandero.webp'},
 {id:'magica-nosferatu',name:'Nosferatu',type:'magic',effect:'boost',value:1000,atk:0,def:0,img:'assets/images/magica-nosferatu.webp'},
 {id:'magica-luz-nemesis',name:'Luz de NÉMESIS',type:'magic',effect:'heal',value:1500,cost:2,atk:0,def:0,img:'assets/images/magica-luz-nemesis.webp'},
 {id:'magica-furia-abismo',name:'Furia del Abismo',type:'magic',effect:'boostTurn',value:1200,cost:2,atk:0,def:0,img:'assets/images/magica-furia-abismo.webp'},
 {id:'magica-escudo-caos',name:'Escudo del Caos',type:'magic',effect:'shieldNext',value:1500,cost:2,atk:0,def:0,img:'assets/images/magica-escudo-caos.webp'},
 {id:'magica-resurreccion-oscura',name:'Resurrección Oscura',type:'magic',effect:'resurrect',value:1,cost:2,atk:0,def:0,img:'assets/images/magica-resurreccion-oscura.webp'},
 {id:'magica-llama-purificadora',name:'Llama Purificadora',type:'magic',effect:'purgeSpellTrap',value:1,cost:2,atk:0,def:0,img:'assets/images/magica-llama-purificadora.webp'}
];
// V18.9.23 — mazo completo y exclusivo del Dragón Ojo del Diablo.
// Estas cartas pertenecen al rival de campaña: no entran en la tienda,
// la colección ni el mazo del jugador y no reemplazan cartas existentes.
const DRAGON_OJO_CARDS=[
 {id:'ojo-dragon-escarlata',name:'Dragón Escarlata',atk:2200,def:3000,type:'monster',enemyOnly:true,dragonDeck:true,img:'assets/images/dragon-escarlata.png'},
 {id:'ojo-dragon-escondido-fuego',name:'Dragón Escondido de Fuego',atk:3000,def:1200,type:'monster',enemyOnly:true,dragonDeck:true,img:'assets/images/dragon-escondido-fuego.png'},
 {id:'ojo-dragon-dorado',name:'Dragón Dorado',atk:3000,def:3000,type:'monster',enemyOnly:true,dragonDeck:true,img:'assets/images/dragon-dorado.png'},
 {id:'ojo-dragon-jefe',name:'Dragón Ojo del Diablo',atk:5600,def:8000,type:'monster',enemyOnly:true,dragonDeck:true,special:true,img:'assets/images/carta-dragon-ojo-del-diablo.png'},
 {id:'ojo-dragon-tumba',name:'Dragón de la Tumba',atk:3500,def:0,type:'monster',enemyOnly:true,dragonDeck:true,img:'assets/images/dragon-tumba.png'},
 {id:'ojo-magica-ojo-diablo',name:'Ojo del Diablo',atk:0,def:0,type:'magic',effect:'heal',value:2000,cost:2,enemyOnly:true,dragonDeck:true,img:'assets/images/magica-ojo-del-diablo.png'},
 {id:'ojo-magica-locura-dragon',name:'Locura del Dragón',atk:0,def:0,type:'magic',effect:'damageOpponent',value:1000,cost:2,enemyOnly:true,dragonDeck:true,img:'assets/images/magica-locura-dragon.png'},
 {id:'ojo-mirada-dragon-rojo',name:'Mirada del Dragón Rojo',atk:4000,def:4500,type:'monster',enemyOnly:true,dragonDeck:true,img:'assets/images/mirada-dragon-rojo.png'},
 {id:'ojo-mago-dragon',name:'Mago del Dragón',atk:1000,def:4000,type:'monster',rarity:'epic',enemyOnly:true,dragonDeck:true,img:'assets/images/mago-del-dragon.png'},
 {id:'ojo-dragon-diamante',name:'Dragón Diamante',atk:2000,def:2000,type:'monster',enemyOnly:true,dragonDeck:true,img:'assets/images/dragon-diamante.png'},
 {id:'ojo-rayo-abismo',name:'Rayo del Abismo',atk:3600,def:3000,type:'monster',enemyOnly:true,dragonDeck:true,img:'assets/images/rayo-del-abismo.png'},
 {id:'ojo-sombra-diablo',name:'Sombra del Diablo',atk:5000,def:4800,type:'monster',enemyOnly:true,dragonDeck:true,img:'assets/images/sombra-del-diablo.png'}
];
const DRAGON_OJO_DECK_SLOTS=[
 'ojo-dragon-escarlata',
 'ojo-dragon-escondido-fuego',
 'ojo-dragon-dorado',
 'ojo-dragon-jefe',
 'ojo-dragon-tumba',
 'ojo-magica-ojo-diablo',
 'ojo-magica-locura-dragon',
 'ojo-mirada-dragon-rojo',
 'ojo-mago-dragon',
 'ojo-dragon-diamante',
 'ojo-rayo-abismo',
 'ojo-sombra-diablo'
];
const DRAGON_OJO_DECK=DRAGON_OJO_DECK_SLOTS.filter(Boolean);
// Mazo Ancestral original — jefe Ira de Ra (15 cartas exclusivas del rival).
const ANCESTRAL_CARDS=[
 {id:'anc-ares',name:'Ares, Señor de la Guerra',atk:4200,def:2800,type:'monster',enemyOnly:true,ancestral:true,effect:'aresConqueror',img:'assets/images/ancestral-ares.png'},
 {id:'anc-mjolnir',name:'Mjölnir del Trueno Oscuro',atk:0,def:0,type:'magic',enemyOnly:true,ancestral:true,effect:'boostTurn',value:900,img:'assets/images/ancestral-mjolnir.png'},
 {id:'anc-altar-anubis',name:'Altar de Anubis',atk:0,def:0,type:'magic',enemyOnly:true,ancestral:true,effect:'resurrect',value:1,img:'assets/images/ancestral-altar-anubis.png'},
 {id:'anc-profecia-medusa',name:'Profecía de la Medusa',atk:0,def:0,type:'magic',enemyOnly:true,ancestral:true,effect:'petrifyTurn',value:1,img:'assets/images/ancestral-profecia-medusa.png'},
 {id:'anc-sello-oraculo',name:'Sello del Oráculo',atk:0,def:0,type:'trap',enemyOnly:true,ancestral:true,effect:'negateMagic',img:'assets/images/ancestral-sello-oraculo.png'},
 {id:'anc-fragmento-esencia',name:'Fragmento de Esencia NÉMESIS',atk:0,def:0,type:'magic',enemyOnly:true,ancestral:true,effect:'ancestralEssence',value:1,img:'assets/images/ancestral-fragmento-esencia.png'},
 {id:'anc-ira-ra',name:'Ira de Ra',atk:7000,def:5000,type:'monster',enemyOnly:true,ancestral:true,special:true,effect:'raGrowth',img:'assets/images/ancestral-ira-ra.png'},
 {id:'anc-armadura-ra',name:'Armadura de Ra',atk:0,def:0,type:'magic',enemyOnly:true,ancestral:true,effect:'armorRa',value:1000,img:'assets/images/ancestral-armadura-ra.png'},
 {id:'anc-jepri',name:'El Escarabajo Jepri',atk:0,def:5000,type:'monster',enemyOnly:true,ancestral:true,img:'assets/images/ancestral-jepri.png'},
 {id:'anc-mnevis',name:'El Toro Mnevis',atk:5000,def:3000,type:'monster',enemyOnly:true,ancestral:true,effect:'destroyLowestDef',img:'assets/images/ancestral-mnevis.png'},
 {id:'anc-ojo-ra',name:'El Ojo de Ra',atk:0,def:0,type:'monster',enemyOnly:true,ancestral:true,effect:'raUltimate',img:'assets/images/ancestral-ojo-ra.png'},
 {id:'anc-cetro-was',name:'Cetro Was y Bastón de Ra',atk:4800,def:3000,type:'monster',enemyOnly:true,ancestral:true,effect:'defenseEntry',value:300,img:'assets/images/ancestral-cetro-was.png'},
 {id:'anc-lanza-solar',name:'Lanza Solar Dorada de Ra',atk:6500,def:0,type:'monster',enemyOnly:true,ancestral:true,img:'assets/images/ancestral-lanza-solar.png'},
 {id:'anc-mehen',name:'Mehen, Serpiente Protectora',atk:0,def:5000,type:'monster',enemyOnly:true,ancestral:true,effect:'blockAttacksOneTurn',img:'assets/images/ancestral-mehen.png'},
 {id:'anc-lanza-bronce',name:'Gran Lanza de Bronce',atk:3000,def:4000,type:'monster',enemyOnly:true,ancestral:true,effect:'bronzeGrowth',value:300,img:'assets/images/ancestral-lanza-bronce.png'}
];
const IRA_RA_BOSS_DECK=ANCESTRAL_CARDS.map(c=>c.id);

// V18.9.51 — CAMPAÑA II · CABALLERO DE LAS ALMAS
const SPECTRAL_CARDS=[
 {id:'esp-guerrero-sepulcro',name:'Guerrero del Sepulcro',atk:3200,def:2800,type:'monster',family:'spectral',enemyOnly:true,spectralDeck:true,effect:'soulPersistent',img:'assets/images/c2-guerrero-sepulcro.png'},
 {id:'esp-espectro-cripta',name:'Espectro de la Cripta',atk:2500,def:4000,type:'monster',family:'spectral',enemyOnly:true,spectralDeck:true,effect:'etherealForm',img:'assets/images/c2-espectro-cripta.png'},
 {id:'esp-verdugo-almas',name:'Verdugo de las Almas',atk:4800,def:2500,type:'monster',family:'spectral',enemyOnly:true,spectralDeck:true,effect:'mortalHarvest',img:'assets/images/c2-verdugo-almas.png'},
 {id:'esp-dragon-espectral',name:'Dragón Espectral',atk:6000,def:4500,type:'monster',family:'spectral',enemyOnly:true,spectralDeck:true,effect:'deadFire',value:700,img:'assets/images/c2-dragon-espectral.png'},
 {id:'esp-doncella-tumba',name:'Doncella de la Tumba',atk:1800,def:5000,type:'monster',family:'spectral',enemyOnly:true,spectralDeck:true,effect:'beyondCall',img:'assets/images/c2-doncella-tumba.png'},
 {id:'esp-segador-vacio',name:'Segador del Vacío',atk:5500,def:3000,type:'monster',family:'spectral',enemyOnly:true,spectralDeck:true,effect:'soulScythe',img:'assets/images/c2-segador-vacio.png'},
 {id:'esp-portal-muertos',name:'Portal de los Muertos',atk:0,def:0,type:'magic',family:'spectral',enemyOnly:true,spectralDeck:true,effect:'spectralPortal',img:'assets/images/c2-portal-muertos.png'},
 {id:'esp-ejercito-almas',name:'Ejército de Almas',atk:0,def:0,type:'magic',family:'spectral',enemyOnly:true,spectralDeck:true,effect:'soulArmy',value:500,img:'assets/images/c2-ejercito-almas.png'},
 {id:'esp-corona-condenado',name:'Corona del Condenado',atk:0,def:0,type:'magic',family:'spectral',enemyOnly:true,spectralDeck:true,effect:'condemnedCrown',value:1000,img:'assets/images/c2-corona-condenado.png'},
 {id:'esp-dragon-abismo',name:'Dragón del Abismo',atk:6200,def:4800,type:'monster',family:'spectral',enemyOnly:true,spectralDeck:true,effect:'abyssDragon',img:'assets/images/c2-dragon-abismo.png'}
];
const CABALLERO_ALMAS_DECK=SPECTRAL_CARDS.map(c=>c.id);

// V18.9.55 — REY ESPECTRAL · MAZO MODO BESTIA COMPLETO 10/10
// Diez cartas definitivas integradas conservando las mecánicas y cartas 1–5 de V18.9.54.
const REY_ESPECTRAL_CARDS=[
 {id:'rey-heredero-trono-muerto',name:'Heredero del Trono Muerto',atk:5500,def:5000,type:'monster',family:'spectral',enemyOnly:true,royalDeck:true,effect:'royalBlood',img:'assets/images/rey-01-heredero.png'},
 {id:'rey-general-legion-espectral',name:'General de la Legión Espectral',atk:6500,def:5500,type:'monster',family:'spectral',enemyOnly:true,royalDeck:true,effect:'executionOrder',value:1000,img:'assets/images/rey-02-general.png'},
 {id:'rey-devorador-almas-reales',name:'Devorador de Almas Reales',atk:7500,def:4500,type:'monster',family:'spectral',enemyOnly:true,royalDeck:true,effect:'soulBanquet',value:700,img:'assets/images/rey-03-devorador.png'},
 {id:'rey-dragon-trono-espectral',name:'Dragón del Trono Espectral',atk:8500,def:7000,type:'monster',family:'spectral',enemyOnly:true,royalDeck:true,effect:'underworldBreath',value:1000,img:'assets/images/rey-04-dragon.png'},
 {id:'rey-nigromante-supremo',name:'Nigromante Supremo del Rey',atk:4000,def:7500,type:'monster',family:'spectral',enemyOnly:true,royalDeck:true,effect:'royalResurrection',img:'assets/images/rey-05-nigromante.png'},
 {id:'rey-verdugo-corona-maldita',name:'Verdugo de la Corona Maldita',atk:9000,def:3500,type:'monster',family:'spectral',enemyOnly:true,royalDeck:true,effect:'royalExecution',img:'assets/images/rey-06-verdugo.png'},
 {id:'rey-decreto-del-rey',name:'Decreto del Rey',atk:0,def:0,type:'magic',family:'spectral',enemyOnly:true,royalDeck:true,effect:'royalDecree',costSouls:6,img:'assets/images/rey-07-decreto.png'},
 {id:'rey-portal-real-mas-alla',name:'Portal Real del Más Allá',atk:0,def:0,type:'magic',family:'spectral',enemyOnly:true,royalDeck:true,effect:'royalPortal',costSouls:1,img:'assets/images/rey-08-portal.png'},
 {id:'rey-corona-mil-almas',name:'Corona de las Mil Almas',atk:0,def:0,type:'magic',family:'spectral',enemyOnly:true,royalDeck:true,effect:'thousandSoulCrown',img:'assets/images/rey-09-corona.png'},
 {id:'rey-espada-sin-muerte',name:'Espada del Rey Sin Muerte',atk:0,def:0,type:'magic',family:'spectral',enemyOnly:true,royalDeck:true,effect:'undyingKingSword',img:'assets/images/rey-10-espada.png'}
];
const REY_ESPECTRAL_TEST_DECK=REY_ESPECTRAL_CARDS.map(c=>c.id);


// V18.9.57 — DIOS FANTASMA · MODO BESTIA CELESTIAL · CARTAS 1–5
const DIOS_FANTASMA_CARDS=[
 {id:'df-angel-umbral',name:'Ángel Fantasma del Umbral',atk:6000,def:6500,type:'monster',family:'celestial',tags:['divine','spectral'],enemyOnly:true,celestialDeck:true,effect:'thresholdGuardian',img:'assets/images/df-01-angel.png'},
 {id:'df-arcangel-almas',name:'Arcángel de las Almas Perdidas',atk:7500,def:5500,type:'monster',family:'celestial',tags:['divine','spectral'],enemyOnly:true,celestialDeck:true,effect:'soulSword',img:'assets/images/df-02-arcangel.png'},
 {id:'df-dragon-vacio',name:'Dragón Celestial del Vacío',atk:9000,def:8000,type:'monster',family:'celestial',tags:['divine','spectral'],enemyOnly:true,celestialDeck:true,effect:'voidBreath',img:'assets/images/df-03-dragon.png'},
 {id:'df-emperador-celestial',name:'Emperador Fantasma Celestial',atk:8500,def:9000,type:'monster',family:'celestial',tags:['divine','spectral'],enemyOnly:true,celestialDeck:true,effect:'celestialDominion',img:'assets/images/df-04-emperador.png'},
 {id:'df-serafin-muerte',name:'Serafín de la Muerte Eterna',atk:10000,def:6000,type:'monster',family:'celestial',tags:['divine','spectral'],enemyOnly:true,celestialDeck:true,effect:'eternalSentence',img:'assets/images/df-05-serafin.png'},
 {id:'df-06',name:'Puerta Celestial del Más Allá',atk:0,def:0,type:'magic',family:'celestial',tags:['divine','spectral'],enemyOnly:true,celestialDeck:true,effect:'celestialGate',costEssence:5,img:'assets/images/dios-fantasma/cards/06.png'},
 {id:'df-07',name:'Ojo del Dios Fantasma',atk:0,def:0,type:'magic',family:'celestial',tags:['divine','spectral'],enemyOnly:true,celestialDeck:true,effect:'ghostGodEye',costEssence:4,img:'assets/images/dios-fantasma/cards/07.png'},
 {id:'df-08',name:'Juicio Celestial del Más Allá',atk:0,def:0,type:'magic',family:'celestial',tags:['divine','spectral'],enemyOnly:true,celestialDeck:true,effect:'celestialJudgment',costEssence:7,onceDuel:true,img:'assets/images/dios-fantasma/cards/08.png'},
 {id:'df-09',name:'Resurrección Celestial del Más Allá',atk:0,def:0,type:'magic',family:'celestial',tags:['divine','spectral'],enemyOnly:true,celestialDeck:true,effect:'celestialResurrection',costEssence:6,img:'assets/images/dios-fantasma/cards/09.png'},
 {id:'df-10',name:'Decreto Celestial del Más Allá',atk:0,def:0,type:'magic',family:'celestial',tags:['divine','spectral'],enemyOnly:true,celestialDeck:true,effect:'celestialDecree',costEssence:8,onceDuel:true,img:'assets/images/dios-fantasma/cards/10.png'}
];
const DIOS_FANTASMA_DECK=DIOS_FANTASMA_CARDS.map(c=>c.id);

const INVENTORY_CAPACITY=500;
// V18.9.43 — progresión de cartas por jefe, manteniendo intactos los mazos rivales.
const GUARDIAN_BOSS_CARD_IDS=['dragon-carmesi-caos','dragon-abisal-nemesis','dragon-negro-ruinas','dragon-infernal-sangre','magica-curandero','magica-nosferatu','df-dragon-vacio','dragon','dragon-infernal','esp-dragon-abismo'];
const PLAYER_DRAGON_SHOP=NEW_CARDS.filter(c=>c.type==='monster');
const MAGIC_SHOP=NEW_CARDS.filter(c=>c.type==='magic');
const SHOP_CARDS=[...PLAYER_DRAGON_SHOP,...BASE_CARDS];
SHOP_CARDS.push(...MAGIC_SHOP);
const COLLECTIBLE_CARDS=[...SHOP_CARDS,...PLAYER_EXCLUSIVE_CARDS,...DIVINE_PLAYER_CARDS,...DRAGON_OJO_CARDS,...ANCESTRAL_CARDS,...SPECTRAL_CARDS,...REY_ESPECTRAL_CARDS,...DIOS_FANTASMA_CARDS];
// V18.9.61 — APOLO · GUARDIÁN SOLAR DEL OLIMPO

// V18.9.64 — MAZO ARES · CARTAS 1–5
const ARES_CARDS_1_5=[
 {id:'ares-01-hoplitainmortal',name:'Hoplita Inmortal de Ares',atk:5500,def:7000,type:'monster',family:'ares',enemyOnly:true,aresDeck:true,rarity:'epica',effect:'aresFrontLine',img:'assets/images/campaign3/ares/cards/01.png',
  desc:'PRIMERA LÍNEA: en DEFENSA reduce en 500 el daño que reciben las demás criaturas de Ares por ataques y efectos. Si es destruido por el rival, Ares obtiene +1 Furia.'},
 {id:'ares-02-berserker',name:'Berserker de la Sangre Divina',atk:7500,def:4000,type:'monster',family:'ares',enemyOnly:true,aresDeck:true,rarity:'epica',effect:'aresBloodThirst',img:'assets/images/campaign3/ares/cards/02.png',
  desc:'SED DE GUERRA: cada vez que participa en combate gana +500 ATK permanente. Si destruye una criatura, Ares obtiene +1 Furia.'},
 {id:'ares-03-cerbero',name:'Cerbero de Guerra del Olimpo',atk:8000,def:6500,type:'monster',family:'ares',enemyOnly:true,aresDeck:true,rarity:'epica',effect:'aresThreeMaws',img:'assets/images/campaign3/ares/cards/03.png',
  desc:'TRES FAUCES: puede atacar una segunda vez gastando 2 Furia; si el primer ataque destruyó una criatura, el segundo cuesta 1 Furia. Si destruye criatura, Ares obtiene +1 Furia.'},
 {id:'ares-04-general',name:'General Supremo de Esparta',atk:6500,def:8500,type:'monster',family:'ares',enemyOnly:true,aresDeck:true,rarity:'epica',effect:'aresWarFormation',img:'assets/images/campaign3/ares/cards/04.png',
  desc:'FORMACIÓN DE GUERRA: mientras esté en Campo, las demás criaturas de Ares obtienen +700 ATK y +700 DEF. Si es destruido en batalla, Ares obtiene +1 Furia.'},
 {id:'ares-05-titan',name:'Titán de la Guerra Eterna',atk:10000,def:8000,type:'monster',family:'ares',enemyOnly:true,aresDeck:true,rarity:'epica',effect:'aresTitanicImpact',img:'assets/images/campaign3/ares/cards/05.png',
  desc:'IMPACTO TITÁNICO: al ser Invocado causa 1.000 de daño directo y reduce 500 ATK a las criaturas rivales hasta el final del siguiente turno. En Fase III obtiene +1.500 ATK. Cuando destruye una criatura, Ares obtiene +2 Furia.'},
 {id:'ares-06-lanza',name:'Lanza Rompe-Olimpos',atk:0,def:0,type:'magic',subtype:'weapon',family:'ares',enemyOnly:true,aresDeck:true,rarity:'epica',effect:'aresOlympusBreaker',img:'assets/images/campaign3/ares/cards/06.png',desc:'ARMA DIVINA: +2.500 ATK. Al destruir una criatura genera +1 Furia; si el arma es destruida genera +1 Furia.'},
 {id:'ares-07-coraza',name:'Coraza del Dios de la Guerra',atk:0,def:0,type:'magic',subtype:'armor',family:'ares',enemyOnly:true,aresDeck:true,rarity:'epica',effect:'aresDivineArmor',img:'assets/images/campaign3/ares/cards/07.png',desc:'ARMADURA DIVINA: +2.500 DEF. Reduce 50% del daño de Mágicas/Trampas y puede reflejar 800 al ser atacada.'},
 {id:'ares-08-estandarte',name:'Estandarte de Ares — Señor de la Guerra',atk:0,def:0,type:'magic',subtype:'relic',family:'ares',enemyOnly:true,aresDeck:true,rarity:'epica',effect:'aresWarBanner',img:'assets/images/campaign3/ares/cards/08.png',desc:'RELIQUIA DIVINA: aura +20% ATK/DEF a criaturas Ares. +1 Furia al inicio del turno; una eliminación por turno permite robar 1 carta.'},
 {id:'ares-09-colossus',name:'Colosus de Ares',atk:6000,def:6000,type:'monster',family:'ares',enemyOnly:true,aresDeck:true,rarity:'epica',effect:'aresWarStorm',img:'assets/images/campaign3/ares/cards/09.png',desc:'TORMENTA DE GUERRA: al entrar destruye criaturas rivales boca arriba con ATK menor a 3.000, causa 2.000 daño directo y da +500 ATK/DEF a Ares. Resiste destrucción por Mágicas/Trampas.'},
 {id:'ares-10-ram',name:'Carnero de Guerra de Ares',atk:5500,def:5000,type:'monster',family:'ares',enemyOnly:true,aresDeck:true,rarity:'epica',effect:'aresSiegeRam',costFury:3,img:'assets/images/campaign3/ares/cards/10.png',desc:'EMBESTIDA DEVASTADORA: cuesta 3 Furia. Al entrar inflige 2.500 a criaturas rivales, destruye una carta boca abajo y al atacar ignora 50% DEF.'},
 {id:'ares-11-eye',name:'Ojo de la Guerra',atk:0,def:0,type:'magic',subtype:'weapon',family:'ares',enemyOnly:true,aresDeck:true,rarity:'epica',effect:'aresWarEye',img:'assets/images/campaign3/ares/cards/11.png',desc:'ARMA DEFINITIVA: +3.500 ATK y penetración 30%. MIRADA ANIQUILADORA causa 4.000 daño directo, destruye 2 cartas de menor ATK, genera +3 Furia y el arma se destruye. Uso único.'},
 {id:'ares-12-god',name:'Ares, Dios de la Guerra — El Último Dios del Caos',atk:10000,def:8000,type:'monster',family:'ares',tags:['divine'],enemyOnly:true,aresDeck:true,rarity:'mitica',effect:'aresSupremeWrath',img:'assets/images/campaign3/ares/cards/12.png',desc:'IRA SUPREMA DE ARES: invocación definitiva de Fase III. +5 Furia, 6.000 daño directo, destruye Mágicas/Trampas rivales, aliados Ares +1.000 ATK/DEF y una destrucción táctica por turno.'}
];
const ARES_CARDS=ARES_CARDS_1_5;

const APOLO_PLAYER_CARDS=[{
 id:'apolo-guardian-solar',name:'Apolo — Guardián Solar del Olimpo',atk:6500,def:8500,type:'monster',
 rarity:'divina',family:'olimpo',cost:4,element:'solar',playerOnly:true,img:'assets/images/apolo-guardian-solar-olimpo.png',
 effect:'apoloSolarGuardian',
 desc:'La luz del sol protege al Olimpo y a sus hijos.',
 skill:'SANTUARIO DEL SOL — al entrar crea 2 turnos de escudo solar: el rival puede combatir criaturas, pero no infligir daño directo al HP.',
 summonEffect:'LLAMADO DE LOS DIOSES — una vez por duelo busca en el mazo el componente faltante entre Júpiter, Zeus o Kronos y lo agrega a la mano.',
 passive:'PROTECTOR DE LA FUSIÓN DIVINA — mientras Apolo esté en campo, Júpiter, Zeus y Kronos no pueden ser enviados directamente de mano/mazo al Cementerio por efectos enemigos.',
 deathEffect:'ÚLTIMO RESPLANDOR — al ser destruido concede 1 turno de Protección de Fusión para Júpiter, Zeus y Kronos.',
 entryEffect:'DESCENSO DEL SOL — portal solar, rayos, partículas, descenso, onda de luz, impacto de cámara y título.'
}];


// V18.9.66 — MAZO OLIMPO 11/11 (Titán del Olimpo permanece en Zona de Fusión)
const OLIMPO_PLAYER_CARDS=[
 {id:'olimpo-atenea',name:'Atenea — Guardiana del Olimpo',atk:6500,def:8500,type:'monster',rarity:'epica',family:'olimpo',tags:['divine'],playerOnly:true,effect:'athenaAegis',img:'assets/images/olimpo/05.png',desc:'ÉGIDA DIVINA: una vez por turno protege 1 DIVINA aliada contra destrucción/anulación/selección enemiga hasta el final del turno.'},
 {id:'olimpo-poseidon',name:'Poseidón — Señor de los Mares',atk:8500,def:7000,type:'monster',rarity:'epica',family:'olimpo',tags:['divine'],playerOnly:true,effect:'poseidonTide',img:'assets/images/olimpo/06.png',desc:'MAREMOTO OLÍMPICO: al entrar devuelve 1 Mágica/Trampa/Equipamiento rival sin activar efectos de destrucción. Al atacar debilita -500 ATK a criaturas rivales ese turno.'},
 {id:'olimpo-hermes',name:'Hermes — Mensajero Divino',atk:5000,def:4500,type:'monster',rarity:'epica',family:'olimpo',tags:['divine'],playerOnly:true,effect:'hermesSpeed',img:'assets/images/olimpo/07.png',desc:'VELOCIDAD DIVINA: una vez por duelo busca Júpiter, Zeus o Kronos que falte y lo lleva a la mano. Si el rival lo destruye, roba 1 carta.'},
 {id:'olimpo-egida',name:'Égida del Olimpo',atk:0,def:0,type:'magic',subtype:'armor',rarity:'epica',family:'olimpo',playerOnly:true,effect:'olympusAegisArmor',img:'assets/images/olimpo/08.png',desc:'ARMADURA DIVINA: +2.000 DEF. Sustituye la primera destrucción de la criatura equipada; al realizar la Fusión Divina va al Cementerio y no transfiere bonos.'},
 {id:'olimpo-rayo-maestro',name:'Rayo Maestro del Olimpo',atk:0,def:0,type:'magic',subtype:'weapon',rarity:'epica',family:'olimpo',playerOnly:true,effect:'olympusMasterBolt',img:'assets/images/olimpo/09.png',desc:'ARMA DIVINA: +2.500 ATK. Tras una destrucción por batalla puede romper 1 equipamiento rival; después bloquea nuevos equipamientos rivales por ese turno.'},
 {id:'olimpo-consejo',name:'Consejo de los Dioses',atk:0,def:0,type:'magic',rarity:'epica',family:'olimpo',playerOnly:true,effect:'olympusCouncil',oneShot:true,img:'assets/images/olimpo/10.png',desc:'SABIDURÍA DEL OLIMPO: una vez por duelo busca el material faltante de la Fusión. Si ya están los tres disponibles, protege la preparación contra la primera anulación.'},
 {id:'olimpo-ascension',name:'Ascensión del Olimpo',atk:0,def:0,type:'magic',rarity:'epica',family:'olimpo',playerOnly:true,effect:'olympusAscension',oneShot:true,img:'assets/images/olimpo/11.png',desc:'INVOCACIÓN OLÍMPICA: con Júpiter + Zeus + Kronos disponibles protege la Fusión Divina contra la primera respuesta y prepara la invocación del Titán del Olimpo. Una vez por duelo.'}
];
const OLIMPO_DECK_IDS=['dios-jupiter','zeus-emperador-rayo','kronos-devorador-tiempo','apolo-guardian-solar','olimpo-atenea','olimpo-poseidon','olimpo-hermes','olimpo-egida','olimpo-rayo-maestro','olimpo-consejo','olimpo-ascension'];


// V18.9.70 — HADES · MAZO PARCIAL 5/12
const HADES_CARDS=[
 {id:'hades-cerbero',name:'Cerbero — Guardián de las Tres Puertas',atk:8000,def:9000,type:'monster',rarity:'epica',family:'hades',effect:'hadesThreeGates',img:'assets/images/campaign3/hades/cards/01-cerbero.png',desc:'TRES PUERTAS: intercepta una salida del Cementerio rival una vez por turno y la envía al Tártaro.'},
 {id:'hades-caronte',name:'Caronte — Barquero del Estigia',atk:4500,def:7500,type:'monster',rarity:'epica',family:'hades',effect:'hadesFerryman',img:'assets/images/campaign3/hades/cards/02-caronte.png',desc:'PRECIO DEL VIAJE: genera Óbolos con el Tártaro y puede gastar 2 para recuperar una carta propia.'},
 {id:'hades-persefone',name:'Perséfone — Reina del Inframundo',atk:6500,def:8500,type:'monster',rarity:'epica',family:'hades',effect:'hadesTwoWorlds',img:'assets/images/campaign3/hades/cards/03-persefone.png',desc:'REINA DE DOS MUNDOS: recupera del Tártaro o debilita -1.500 ATK durante 2 turnos.'},
 {id:'hades-thanatos',name:'Thanatos — Encarnación de la Muerte',atk:9500,def:5000,type:'monster',rarity:'epica',family:'hades',effect:'hadesDeathSentence',img:'assets/images/campaign3/hades/cards/04-thanatos.png',desc:'SENTENCIA MORTAL: marca una criatura; si queda con DEF 2.000 o menos tras combate, va al Tártaro.'},
 {id:'hades-nyx',name:'Nyx — Madre de la Noche Eterna',atk:7000,def:9500,type:'monster',rarity:'epica',family:'hades',effect:'hadesEternalNight',img:'assets/images/campaign3/hades/cards/05-nyx.png',desc:'NOCHE ETERNA: bloquea por 1 turno la selección del Cementerio rival mediante efectos.'},
 {id:'hades-soberano',name:'Hades — Soberano del Tártaro',atk:10500,def:8500,type:'monster',rarity:'divina',family:'hades',effect:'hadesDominion',img:'assets/images/campaign3/hades/cards/06-hades-soberano.png',desc:'DOMINIO DEL INFRAMUNDO: gasta 3 Óbolos para enviar al Tártaro una carta visible del Cementerio rival.'},
 {id:'hades-cadenas',name:'Cadenas Eternas del Tártaro',atk:0,def:0,type:'trap',rarity:'epica',family:'hades',effect:'hadesChains',img:'assets/images/campaign3/hades/cards/07-cadenas-tartaro.png',desc:'CONDENA INQUEBRANTABLE: retiene una criatura que intenta abandonar el Campo y anula temporalmente sus habilidades.'},
 {id:'hades-moneda',name:'Moneda Negra de Caronte',atk:0,def:0,type:'relic',rarity:'epica',family:'hades',effect:'hadesBlackCoin',img:'assets/images/campaign3/hades/cards/08-moneda-caronte.png',desc:'Genera 1 Óbolo; una vez por duelo puede sacrificarse para cubrir hasta 2 Óbolos de un coste.'},
 {id:'hades-cerbero-umbral',name:'Cerbero — Guardián del Umbral',atk:6500,def:6500,type:'monster',rarity:'epica',family:'hades',effect:'hadesThresholdWatch',img:'assets/images/campaign3/hades/cards/09-cerbero-umbral.png',desc:'VIGILANCIA DEL UMBRAL: destruye una mágica/trampa una vez por turno; 2 Óbolos pueden evitar su destrucción.'},
 {id:'hades-hypnos',name:'Hypnos — Señor del Sueño Eterno',atk:2500,def:7000,type:'monster',rarity:'epica',family:'hades',effect:'hadesDeepSleep',img:'assets/images/campaign3/hades/cards/10-hypnos.png',desc:'SUEÑO PROFUNDO: por 2 Óbolos inmoviliza una carta rival durante 2 turnos.'},
 {id:'hades-erinias',name:'Erinias — Furias del Castigo',atk:3800,def:4800,type:'monster',rarity:'epica',family:'hades',effect:'hadesGuiltWhip',img:'assets/images/campaign3/hades/cards/11-erinias.png',desc:'LATIGAZO DE CULPA: por 2 Óbolos marca, bloquea y reduce 800 ATK por turno a una amenaza rival.'},
 {id:'hades-portal',name:'Portal del Tártaro',atk:0,def:6000,type:'trap',rarity:'epica',family:'hades',effect:'hadesPortal',img:'assets/images/campaign3/hades/cards/12-portal-tartaro.png',desc:'PUERTA HACIA LA OSCURIDAD: cuesta 3 Óbolos, acumula contadores y con 6 invoca a Hades — Soberano del Tártaro.'}
];
const HADES_DECK_IDS=HADES_CARDS.map(c=>c.id);

// V19.1 — TRES CARTAS ÚNICAS 1/1 (contenido aislado del Santuario)
const UNIQUE_CARD_DEFS=[
 {id:'nemesis-primigenio',name:'NÉMESIS PRIMIGENIO',type:'Entidad Primordial',rarity:'ÚNICA 1/1',atk:25000,def:20000,img:'assets/images/unique/nemesis-primigenio.png',special:'primordialAuthority',text:'Autoridad Primordial · Existencia Absoluta · Juicio de NÉMESIS'},
 {id:'aion-unico',name:'AION',type:'Dios del Tiempo',rarity:'ÚNICA 1/1',atk:18000,def:24000,img:'assets/images/unique/aion.png',special:'timeBroken',text:'Tiempo Roto · Punto Temporal · Último Segundo'},
 {id:'azathiel-unico',name:'AZATHIEL',type:'Entidad del Vacío',rarity:'ÚNICA 1/1',atk:30000,def:10000,img:'assets/images/unique/azathiel.png',special:'worldHunger',text:'Hambre de Mundos · Colapso · Fin de la Realidad'}
];


const NEMESIS_EXTERNAL_RAW=Array.isArray(window.NEMESIS_EXTERNAL_COLLECTION_33)?window.NEMESIS_EXTERNAL_COLLECTION_33:[];
function nemesisExternalType(c){
 const k=String(c.clase||'').toUpperCase();
 if(k.includes('TRAMPA'))return 'trap';
 if(k.includes('MAGICA')||k.includes('ARMA')||k.includes('ARMADURA')||k.includes('RELIQUIA'))return 'magic';
 return 'monster'
}
function nemesisExternalCard(c){
 const type=nemesisExternalType(c),atk=Number(c.atk??c.atk_bonus??c.bonos?.atk??0),def=Number(c.def??c.def_bonus??c.bonos?.def??0);
 return {
   id:c.id,name:c.nombre,type,atk,def,hp:Number(c.hp??0),energia:Number(c.energia??0),velocidad:c.velocidad||null,value:0,
   img:c.img||`assets/images/external33/${String(c.id).toLowerCase()}.svg`,
   rarity:String(c.rareza||'especial').toLowerCase(),family:String(c.familia||'external').toLowerCase(),
   effect:`external_${String(c.id).replace(/-/g,'_')}`,special:true,externalCard:true,externalData:c,
   tags:[...(c.tipos||[]),...(c.elementos||[])].map(x=>String(x).toLowerCase())
 }
}
const EXTERNAL_GAME_CARDS=NEMESIS_EXTERNAL_RAW.map(nemesisExternalCard);
const NEMESIS_PUBLIC_23_IDS=EXTERNAL_GAME_CARDS.filter(c=>!c.id.startsWith('DM-')).map(c=>c.id);
const NEMESIS_DUEL_MASTER_IDS=EXTERNAL_GAME_CARDS.filter(c=>c.id.startsWith('DM-')).map(c=>c.id);

const IMPERIO_DRAGON_CARDS=[
 {id:"IDR-001",name:"Dragón Carmesí Joven",atk:1800,def:1600,type:"monster",family:'imperio-dragon',tags:["fuego","dragon"],rarity:"comun",effect:"idr_001",img:"assets/images/imperio-dragon/idr-001.svg",desc:"SANGRE IMPERIAL:  Cada vez que ataca gana 1 Marca de Ascensión (máx. 2). Si destruye un monstruo en batalla, inflige 300 de daño directo y permite buscar 1 carta Imperio Dragón del Deck.",ascensionMax:2,transformTo:"Dragón Carmesí Imperial",idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-001.png",idrImageStatus:"ORIGINAL_RECUPERADA_FUENTE_CHAT__FALLBACK_REPO_ACTIVO"},
 {id:"IDR-002",name:"Dragón Guerrero Escarlata",atk:2300,def:1900,type:"monster",family:'imperio-dragon',tags:["fuego","dragon"],rarity:"rara",effect:"idr_002",img:"assets/images/imperio-dragon/idr-002.svg",desc:"FURIA ESCARLATA:  Una vez por turno, si destruye un monstruo en batalla, gana 500 ATK y puede atacar nuevamente. Al ser Invocada de Modo Normal, busca 1 carta Imperio Dragón del Deck. Si Dragón Carmesí Joven está en Campo o Cementerio, gana 300 ATK.",ascensionMax:3,transformTo:"Dragón Guerrero Escarlata Supremo",idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-002.png",idrImageStatus:"ORIGINAL_RECUPERADA_FUENTE_CHAT__FALLBACK_REPO_ACTIVO"},
 {id:"IDR-003",name:"Dragón Llamasangre",atk:2300,def:2000,type:"monster",family:'imperio-dragon',tags:["fuego","dragon"],rarity:"epica",effect:"idr_003",img:"assets/images/imperio-dragon/idr-003.svg",desc:"ALIENTO INCINERADOR:  Al declarar un ataque, puede destruir 1 Mágica o Trampa rival; si lo hace, ese ataque gana 500 ATK. Si es destruida en batalla, puede Invocar de Modo Especial 1 Dragón Carmesí Joven desde mano, Deck o Cementerio.",ascensionMax:2,transformTo:"Dragón Llamasangre Supremo",idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-003.png",idrImageStatus:"ORIGINAL_RECUPERADA_FUENTE_CHAT__FALLBACK_REPO_ACTIVO"},
 {id:"IDR-004",name:"Dragón Obsidiana Escamarreal",atk:2400,def:1800,type:"monster",family:'imperio-dragon',tags:["fuego","dragon"],rarity:"epica",effect:"idr_004",img:"assets/images/imperio-dragon/idr-004.svg",desc:"LANZA DEL CATACLISMO:  Al atacar, inflige 400 de daño por cada monstruo que controle el adversario. Si ese ataque destruye una carta, gana 1 Marca de Ascensión. Si es destruida en batalla, puede Invocar de Modo Especial 1 Dragón Carmesí Joven desde el Cementerio; el invocado gana 1 Marca de Ascensión.",ascensionMax:3,transformTo:"Dragón Obsidiana Escamarreal Supremo",idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-004.png",idrImageStatus:"ORIGINAL_RECUPERADA_FUENTE_CHAT__FALLBACK_REPO_ACTIVO"},
 {id:"IDR-005",name:"Dragón Ala de Tormenta",atk:2600,def:2100,type:"monster",family:'imperio-dragon',tags:["fuego","dragon"],rarity:"epica",effect:"idr_005",img:"assets/images/imperio-dragon/idr-005.svg",desc:"DOMINIO DEL CLIMA:  Una vez por turno puede cambiar el clima a Tormenta de Fuego; mientras esté activo, todas tus cartas Imperio Dragón ganan 300 ATK y 300 DEF. Si es Invocada de Modo Especial, puede destruir hasta 2 cartas en el Campo rival.",ascensionMax:3,transformTo:"Dragón Alas de Tormenta Supremo",idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-005.png",idrImageStatus:"ORIGINAL_RECUPERADA_FUENTE_CHAT__FALLBACK_REPO_ACTIVO"},
 {id:"IDR-006",name:"Dragón Guardián de la Forja",atk:2500,def:2800,type:"monster",family:'imperio-dragon',tags:["fuego","dragon","tierra"],rarity:"epica",effect:"idr_006",img:"assets/images/imperio-dragon/idr-006.svg",desc:"ESCAMAS DE LA FORJA: Muro defensivo del Imperio Dragón; protege piezas clave y acelera Ascensión. Una vez por turno, protege 1 carta Imperio Dragón en el Campo de la destrucción por efectos de cartas durante ese turno. Si esa carta hubiera sido destruida, en su lugar gana 1 Marca de Ascensión. Mientras esta carta esté en el Campo, todas tus criaturas Imperio Dragón ganan 300 DEF.",ascensionMax:3,transformTo:"Dragón Guardián de la Forja Supremo",idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-006.png",idrImageStatus:"ORIGINAL_GENERADA_EN_CHAT__PENDIENTE_SUBIR_BINARIO_GITHUB"},
 {id:"IDR-007",name:"Dragón Azoth del Abismo",atk:3200,def:2000,type:"monster",family:'imperio-dragon',tags:["fuego","dragon","oscuridad"],rarity:"epica",effect:"idr_007",img:"assets/images/imperio-dragon/idr-007.svg",desc:"VÓRTICE DEL ABISMO: Agresor de control; elimina cartas rivales y escala con Ascensión. Una vez por turno, puedes destruir 1 carta que controle el adversario; si lo haces, esta carta gana ATK igual al ATK original de esa carta destruida hasta el final del turno. Si esta carta es Invocada de Modo Especial, puedes destruir 1 carta Mágica o Trampa en el Campo. ALMA DEL CAOS: mientras tenga 2 o más Marcas de Ascensión, no puede ser objetivo de efectos de cartas del adversario.",ascensionMax:3,transformTo:"Azoth, Señor Supremo del Abismo",idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-007.png",idrImageStatus:"ORIGINAL_GENERADA_EN_CHAT__PENDIENTE_SUBIR_BINARIO_GITHUB"},
 {id:"IDR-008",name:"Dragón Emperador Infernal",atk:3500,def:3000,type:"monster",family:'imperio-dragon',tags:["fuego","dragon"],rarity:"epica",effect:"idr_008",img:"assets/images/imperio-dragon/idr-008.svg",desc:"INFIERNO DOMINANTE: Líder ofensivo; convierte destrucción, daño directo y Marcas de Ascensión en presión constante. Una vez por turno, puedes destruir 1 carta en el Campo; si lo haces, esta carta gana 500 ATK y tu adversario pierde 500 LP. Si esta carta fuera a ser destruida, puedes desterrar 1 carta Imperio Dragón de tu Cementerio en su lugar. AURA INFERNAL: todas tus criaturas Imperio Dragón ganan 200 ATK por cada Marca de Ascensión que tengan.",ascensionMax:3,transformTo:"Emperador Dragón del Cataclismo",idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-008.png",idrImageStatus:"ORIGINAL_REGENERADA_EN_CHAT__PENDIENTE_SUBIR_BINARIO_GITHUB"},
 {id:"IDR-009",name:"Dragón Carmesí Imperial",atk:3200,def:2600,type:"monster",family:'imperio-dragon',tags:["fuego","dragon"],rarity:"mitica",effect:"idr_009",img:"assets/images/imperio-dragon/idr-009.svg",desc:"CORONA CARMESÍ: Primera transformación del arquetipo; presión y daño explosivo. Solo puede aparecer transformando a Dragón Carmesí Joven con 2 Marcas de Ascensión. Al transformarse, inflige 800 de daño directo. Una vez por turno, si destruye una carta en batalla, gana 500 ATK permanente.",ascensionMax:2,transformOrigin:"IDR-001",idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-009.png",idrImageStatus:"PENDIENTE_ILUSTRACION_OFICIAL"},
 {id:"IDR-010",name:"Emperador Dragón NÉMESIS",atk:4800,def:4200,type:"monster",family:'imperio-dragon',tags:["fuego","dragon","divina"],rarity:"ancestral",effect:"idr_010",img:"assets/images/imperio-dragon/idr-010.svg",desc:"TRONO DE LOS MIL DRAGONES: Transformación suprema y condición de cierre del mazo. Solo puede aparecer transformando a Dragón Primogénito del Imperio con 4 Marcas de Ascensión. Al transformarse, todas tus cartas Imperio Dragón ganan 700 ATK/DEF. Una vez por duelo, destruye hasta 2 cartas rivales y este turno puede realizar un segundo ataque.",ascensionMax:4,transformOrigin:"IDR-008",idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-010.png",idrImageStatus:"PENDIENTE_ILUSTRACION_OFICIAL"},
 {id:"IDR-011",name:"Llamado de la Sangre Imperial",atk:0,def:0,type:"magic",family:'imperio-dragon',tags:["fuego","dragon"],rarity:"epica",effect:"idr_011",img:"assets/images/imperio-dragon/idr-011.svg",desc:"CONVOCATORIA IMPERIAL: Consistencia: busca la criatura necesaria para iniciar o continuar Ascensión. Busca 1 criatura Imperio Dragón de Nivel 6 o menor y añádela a tu mano. Si controlas una carta transformada, puedes además colocar 1 Marca de Ascensión en un dragón aliado.",idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-011.png",idrImageStatus:"PENDIENTE_ILUSTRACION_OFICIAL"},
 {id:"IDR-012",name:"Rugido de Ascensión",atk:0,def:0,type:"magic",family:'imperio-dragon',tags:["fuego","dragon"],rarity:"epica",effect:"idr_012",img:"assets/images/imperio-dragon/idr-012.svg",desc:"ASCENSIÓN INMEDIATA: Acelera transformaciones en respuesta a una amenaza. Selecciona 1 dragón aliado; gana 1 Marca de Ascensión. Si con esa marca alcanza el requisito de transformación, puede transformarse inmediatamente antes de resolver la acción rival.",subtype:'quick',idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-012.png",idrImageStatus:"PENDIENTE_ILUSTRACION_OFICIAL"},
 {id:"IDR-013",name:"Cielo del Imperio Ardiente",atk:0,def:0,type:"magic",family:'imperio-dragon',tags:["fuego","dragon","viento"],rarity:"mitica",effect:"idr_013",img:"assets/images/imperio-dragon/idr-013.svg",desc:"DOMINIO DRACÓNICO: Campo central del arquetipo y fuente constante de presión. Todos tus dragones ganan 400 ATK/DEF. La primera vez por turno que un dragón tuyo ataca, gana 1 Marca de Ascensión después del combate. Si esta carta es destruida, roba 1 carta.",subtype:'field',idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-013.png",idrImageStatus:"PENDIENTE_ILUSTRACION_OFICIAL"},
 {id:"IDR-014",name:"Contraataque de Escamas",atk:0,def:0,type:"trap",family:'imperio-dragon',tags:["dragon","fuego"],rarity:"epica",effect:"idr_014",img:"assets/images/imperio-dragon/idr-014.svg",desc:"ESCAMAS REACTIVAS: Defiende una criatura clave y castiga ataques superiores. Cuando un dragón aliado es atacado, gana 1200 DEF hasta el final del combate. Si sobrevive, el atacante pierde 600 ATK hasta el final de su próximo turno.",idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-014.png",idrImageStatus:"PENDIENTE_ILUSTRACION_OFICIAL"},
 {id:"IDR-015",name:"Ira del Último Dragón",atk:0,def:0,type:"trap",family:'imperio-dragon',tags:["fuego","dragon","caos"],rarity:"legendaria",effect:"idr_015",img:"assets/images/imperio-dragon/idr-015.svg",desc:"ÚLTIMO RUGIDO: Respuesta de emergencia cuando el campo está a punto de caer. Cuando una carta Imperio Dragón fuera a ser destruida por un efecto rival, niega esa destrucción. Luego destruye 1 carta rival. Si la carta protegida estaba transformada, roba 1 carta.",subtype:'response',idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-015.png",idrImageStatus:"PENDIENTE_ILUSTRACION_OFICIAL"},
 {id:"IDR-016",name:"Espada Colmillo del Emperador",atk:0,def:0,type:"magic",family:'imperio-dragon',tags:["fuego","dragon"],rarity:"mitica",effect:"idr_016",img:"assets/images/imperio-dragon/idr-016.svg",desc:"FILO DEL EMPERADOR: Arma ofensiva para rematar combates y acelerar Ascensión. La criatura equipada gana 1400 ATK. Cuando destruye una criatura en batalla, gana 1 Marca de Ascensión. Una vez por duelo, su ataque ignora 50% de la DEF del objetivo.",atkBonus:1400,subtype:"weapon",idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-016.png",idrImageStatus:"PENDIENTE_ILUSTRACION_OFICIAL"},
 {id:"IDR-017",name:"Lanza de Ala Carmesí",atk:0,def:0,type:"magic",family:'imperio-dragon',tags:["fuego","viento","dragon"],rarity:"legendaria",effect:"idr_017",img:"assets/images/imperio-dragon/idr-017.svg",desc:"PICADO IMPERIAL: Arma de precisión para dragones voladores y ataques directos. La criatura equipada gana 1000 ATK y 400 DEF. Si tiene afinidad Viento o está transformada, puede atacar una segunda vez una vez por duelo. El segundo ataque inflige como máximo 1500 de daño directo.",atkBonus:1000,defBonus:400,subtype:"weapon",idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-017.png",idrImageStatus:"PENDIENTE_ILUSTRACION_OFICIAL"},
 {id:"IDR-018",name:"Corona del Primer Dragón",atk:0,def:0,type:"magic",family:'imperio-dragon',tags:["divina","dragon"],rarity:"ancestral",effect:"idr_018",img:"assets/images/imperio-dragon/idr-018.svg",desc:"HERENCIA DEL TRONO: Reliquia de control y motor de recursos para formas superiores. Una vez por turno, cuando coloques una Marca de Ascensión, puedes colocar una segunda marca en otra criatura distinta. Tus cartas transformadas no pueden perder Marcas de Ascensión. Si esta reliquia deja el Campo, recupera 1 carta Imperio Dragón del Cementerio a la mano.",subtype:"relic",idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-018.png",idrImageStatus:"PENDIENTE_ILUSTRACION_OFICIAL"},
 {id:"IDR-019",name:"Dragón Eclipse de la Corona",atk:5200,def:3800,type:"fusion",family:'imperio-dragon',tags:["fuego","oscuridad","dragon"],rarity:"ancestral",effect:"idr_019",img:"assets/images/imperio-dragon/idr-019.svg",desc:"ECLIPSE DRACÓNICO: Fusión agresiva que limpia soportes y convierte Ascensión en daño. Materiales: IDR-003 + IDR-004. Al ser Invocada por Fusión, destruye todas las Mágicas y Trampas rivales. Gana 300 ATK por cada Marca de Ascensión que tenían sus materiales al fusionarse. Una vez por duelo, puede atacar a todos los monstruos rivales una vez cada uno.",materials:["IDR-003","IDR-004"],idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-019.png",idrImageStatus:"PENDIENTE_ILUSTRACION_OFICIAL"},
 {id:"IDR-020",name:"NÉMESIS Dracónico — Emperador del Fin",atk:6500,def:5500,type:"fusion",family:'imperio-dragon',tags:["fuego","dragon","divina","caos"],rarity:"nemesis_unica",effect:"idr_020",img:"assets/images/imperio-dragon/idr-020.svg",desc:"APOCALIPSIS IMPERIAL: Carta final del arquetipo; recompensa haber completado la cadena de Ascensión. Materiales: 1 carta transformada Imperio Dragón + IDR-008. Al ser Invocada, coloca el Campo Cielo del Imperio Ardiente desde Deck o Cementerio. Una vez por duelo, destruye hasta 3 cartas rivales; por cada una destruida gana 500 ATK hasta el final del turno. Si fuera destruida, puedes retirar 3 Marcas de Ascensión de tu Campo para evitarlo.",materials:["TRANSFORMADA_IMPERIO_DRAGON","IDR-008"],idrSlot:true,idrOfficialImage:"assets/images/imperio-dragon/idr-020.png",idrImageStatus:"PENDIENTE_ILUSTRACION_OFICIAL"}
];
const IMPERIO_DRAGON_DECK_IDS=IMPERIO_DRAGON_CARDS.map(c=>c.id);
// V19.4.2 — MAZO MAGO ROJO · 20 CARTAS · integración aislada
const MAGO_ROJO_CARDS=[
 {id:'MGR-001',name:"Mago Rojo",atk:2800,def:2400,type:'monster',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'epica',effect:'mgr_001',img:'assets/images/mago-rojo/mgr-001.svg',desc:"DOMINIO ESCARLATA: Cada Mágica Mago Rojo activada genera 1 Sello Arcano. Con 3 Sellos recupera 1 Mágica Mago Rojo del Cementerio y gana 500 ATK.",special:true,magoRojo:true},
 {id:'MGR-002',name:"Aprendiz de las Brasas",atk:1700,def:1900,type:'monster',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'comun',effect:'mgr_002',img:'assets/images/mago-rojo/mgr-002.svg',desc:"MEMORIA DE FUEGO: al ser invocado recupera 1 Mágica Mago Rojo del Cementerio. Mientras controles Mago Rojo gana 300 ATK.",special:true,magoRojo:true},
 {id:'MGR-003',name:"Salamandra de Rubí",atk:2100,def:1800,type:'monster',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'rara',effect:'mgr_003',img:'assets/images/mago-rojo/mgr-003.svg',desc:"PIEL INCANDESCENTE: si recibe daño y sobrevive genera 1 Sello Arcano. Con Sellos Arcanos gana 300 DEF.",special:true,magoRojo:true},
 {id:'MGR-004',name:"Caballero de Ceniza",atk:2600,def:2600,type:'monster',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'epica',effect:'mgr_004',img:'assets/images/mago-rojo/mgr-004.svg',desc:"GUARDIA ARDIENTE: protege una criatura Mago Rojo de destrucción por efectos una vez por turno y refuerza su DEF en combate.",special:true,magoRojo:true},
 {id:'MGR-005',name:"Bruja de la Llama Negra",atk:2700,def:2200,type:'monster',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'epica',effect:'mgr_005',img:'assets/images/mago-rojo/mgr-005.svg',desc:"PACTO DE LLAMAS: consume Sellos Arcanos para debilitar cartas rivales y alimentar la presión del arquetipo.",special:true,magoRojo:true},
 {id:'MGR-006',name:"Guardián de la Forja Roja",atk:2500,def:3200,type:'monster',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'epica',effect:'mgr_006',img:'assets/images/mago-rojo/mgr-006.svg',desc:"FORJA PROTECTORA: protege Mágicas, Trampas y Reliquias Mago Rojo y actúa como muro defensivo.",special:true,magoRojo:true},
 {id:'MGR-007',name:"Fénix Carmesí",atk:3400,def:2500,type:'monster',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'legendaria',effect:'mgr_007',img:'assets/images/mago-rojo/mgr-007.svg',desc:"RENACER DE LAS CENIZAS: la primera vez que es destruido puede regresar desde el Cementerio y generar 1 Sello Arcano.",special:true,magoRojo:true},
 {id:'MGR-008',name:"Hechicero del Eclipse",atk:3200,def:2600,type:'monster',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'epica',effect:'mgr_008',img:'assets/images/mago-rojo/mgr-008.svg',desc:"ECLIPSE ARDIENTE: una vez por turno potencia 600 ATK a Mago Rojo; con 3 Sellos gana 800 ATK y puede reducir 400 ATK/DEF a una carta rival.",special:true,magoRojo:true},
 {id:'MGR-009',name:"Dragón Rubí Ancestral",atk:5500,def:4200,type:'monster',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'legendaria',effect:'mgr_009',img:'assets/images/mago-rojo/mgr-009.svg',desc:"HERENCIA ANCESTRAL: potencia 500 ATK a Mago Rojo; gana 300 ATK por cada Mago Rojo aliado y puede protegerse desterrando una carta Mago Rojo del Cementerio.",special:true,magoRojo:true},
 {id:'MGR-010',name:"Archimago de las Siete Llamas",atk:4800,def:3600,type:'monster',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'legendaria',effect:'mgr_010',img:'assets/images/mago-rojo/mgr-010.svg',desc:"LEGADO DE LAS SIETE LLAMAS: al ser Invocado Especialmente inflige 800, busca 1 Mago Rojo y protege el arquetipo de destrucción por efectos ese turno.",special:true,magoRojo:true},
 {id:'MGR-011',name:"Círculo de Invocación Roja",atk:0,def:0,type:'magic',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'epica',effect:'mgr_011',img:'assets/images/mago-rojo/mgr-011.svg',desc:"Busca 1 carta Mago Rojo del Deck. Con 3 Sellos Arcanos puede recuperar desde Cementerio y buscar un material de Fusión.",special:true,magoRojo:true},
 {id:'MGR-012',name:"Ráfaga Escarlata",atk:0,def:0,type:'magic',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'epica',effect:'mgr_012',img:'assets/images/mago-rojo/mgr-012.svg',desc:"Selecciona 1 carta rival e inflige 1500 de daño; si controlas 2 Mago Rojo, añade 500 de daño.",special:true,magoRojo:true},
 {id:'MGR-013',name:"Renacer entre Cenizas",atk:0,def:0,type:'magic',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'epica',effect:'mgr_013',img:'assets/images/mago-rojo/mgr-013.svg',desc:"Invoca Especialmente 1 Mago Rojo del Cementerio con 500 ATK/DEF; con 2 Sellos entra con 800 ATK/DEF.",special:true,magoRojo:true},
 {id:'MGR-014',name:"Convergencia Carmesí",atk:0,def:0,type:'magic',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'epica',effect:'mgr_014',img:'assets/images/mago-rojo/mgr-014.svg',desc:"MÁGICA DE FUSIÓN: usa Hechicero del Eclipse + Dragón Rubí Ancestral para Invocar Archimago del Dragón Carmesí.",special:true,magoRojo:true},
 {id:'MGR-015',name:"Prisión de Fuego",atk:0,def:0,type:'trap',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'epica',effect:'mgr_015',img:'assets/images/mago-rojo/mgr-015.svg',desc:"Al declarar un ataque contra Mago Rojo, niega el ataque; el atacante pierde 1000 ATK y no puede atacar hasta su liberación.",special:true,magoRojo:true},
 {id:'MGR-016',name:"Espejo de Brasas",atk:0,def:0,type:'trap',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'epica',effect:'mgr_016',img:'assets/images/mago-rojo/mgr-016.svg',desc:"TRAMPA DE RESPUESTA: niega un efecto que seleccione Mago Rojo y lo refleja; una vez por turno el reflejo inflige 800 de daño.",special:true,magoRojo:true},
 {id:'MGR-017',name:"Última Llama",atk:0,def:0,type:'trap',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'mitica',effect:'mgr_017',img:'assets/images/mago-rojo/mgr-017.svg',desc:"TRAMPA DE RESPUESTA: puede proteger o recuperar una pieza clave Mago Rojo consumiendo Sellos Arcanos. Solo una activación decisiva por turno.",special:true,magoRojo:true},
 {id:'MGR-018',name:"Grimorio de las Siete Llamas",atk:0,def:0,type:'magic',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'ancestral',effect:'mgr_018',img:'assets/images/mago-rojo/mgr-018.svg',desc:"RELIQUIA: registra Mágicas Mago Rojo diferentes; a 1/2/3/4/5/6/7 llamas desbloquea ATK, protección, robo, ATK/DEF, curación, anulación e invocación final.",special:true,magoRojo:true},
 {id:'MGR-019',name:"Archimago del Dragón Carmesí",atk:7500,def:6500,type:'monster',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'ancestral',effect:'mgr_019',img:'assets/images/mago-rojo/mgr-019.svg',desc:"FUSIÓN: requiere Hechicero del Eclipse + Dragón Rubí Ancestral mediante Convergencia Carmesí. Potencia Mago Rojo y domina con las Siete Llamas.",special:true,magoRojo:true},
 {id:'MGR-020',name:"Bastón de Ignis",atk:0,def:0,type:'magic',family:'mago-rojo',tags:['fuego','mago-rojo'],rarity:'ancestral',effect:'mgr_020',img:'assets/images/mago-rojo/mgr-020.svg',desc:"ARMA: solo Mago Rojo. Otorga +1800 ATK, +1200 DEF, energía y velocidad; con Grimorio de las Siete Llamas potencia sus efectos.",special:true,magoRojo:true}
];
const MAGO_ROJO_DECK_IDS=MAGO_ROJO_CARDS.map(c=>c.id);

// V19.4.1 — REGISTRO ÚNICO DE CARTAS.
// Varias familias ya estaban incluidas dentro de COLLECTIBLE_CARDS y se volvían a
// concatenar aquí. Eso generaba IDs repetidos y hacía que card(id) resolviera
// versiones equivocadas. Se construye una sola fuente por ID, conservando la
// primera definición oficial y agregando únicamente familias todavía no incluidas.
const CARDS_RAW=[...COLLECTIBLE_CARDS,...IMPERIO_DRAGON_CARDS,...MAGO_ROJO_CARDS,...APOLO_PLAYER_CARDS,...OLIMPO_PLAYER_CARDS,...HADES_CARDS,...ARES_CARDS_1_5,...DIVINE_FUSION_CARDS,...EXTERNAL_GAME_CARDS];
const CARDS=[...new Map(CARDS_RAW.map(c=>[c.id,c])).values()];
const AS={tirano:'assets/images/img-10.webp',guardian:'assets/images/guardian-dragones.webp',bg1:'assets/images/img-12.webp',bg2:'assets/images/img-13.webp',dragonOjo:'assets/images/dragon-ojo-del-diablo.png',dragonOjoBg:'assets/images/castillo-dragon-ojo-diablo.webp',iraRa:'assets/images/ira-de-ra-jefe.png',iraRaBg:'assets/images/ruinas-piramide-ira-ra.png',caballeroAlmas:'assets/images/caballero-de-las-almas.png',caballeroAlmasBg:'assets/images/reino-espectral-cinematico.png',reyEspectral:'assets/images/rey-espectral.png',reyEspectralBg:'assets/images/reino-espectral-cinematico.png'};
// Las ÚNICAS se agregan también sin permitir colisión de ID.
UNIQUE_CARD_DEFS.forEach(c=>{if(!CARDS.some(x=>x.id===c.id))CARDS.push(c)});

const NEMESIS_TREASURE_PRICE=1000;
const NEMESIS_TREASURE_CARDS=[
 {id:'TN-MAG-001',name:'Eclipse de la Eternidad',atk:0,def:0,type:'magic',family:'universal',rarity:'nemesis-unique',elements:['OSCURIDAD','TIEMPO'],treasure:true,shopExclusive:true,priceStars:1000,img:'assets/images/treasures/tn-mag-001.webp',effect:'treasureEclipse',description:'Anula efectos enemigos este turno, destruye una Magica/Trampa rival y protege tu campo de destruccion por efectos hasta tu proximo turno.'},
 {id:'TN-MAG-002',name:'Renacimiento del Nexo',atk:0,def:0,type:'magic',family:'universal',rarity:'nemesis-unique',elements:['LUZ','DIMENSIONAL'],treasure:true,shopExclusive:true,priceStars:1000,img:'assets/images/treasures/tn-mag-002.webp',effect:'treasureNexus',unnegatable:true,description:'Recupera hasta 2 cartas del Cementerio al Deck, roba 2 cartas y cura 2000 HP.'},
 {id:'TN-ARM-001',name:'Excalibur NEMESIS - Filo del Destino',atk:0,def:0,type:'magic',family:'universal',rarity:'nemesis-unique',elements:['LUZ','DIVINA'],treasure:true,shopExclusive:true,priceStars:1000,img:'assets/images/treasures/tn-arm-001.webp',effect:'treasureExcalibur',treasureKind:'weapon',atkBonus:3000,defBonus:0,description:'Arma universal: +3000 ATK, penetracion y una proteccion de destruccion por duelo.'},
 {id:'TN-ARM-002',name:'Guadana del Vacio Absoluto',atk:0,def:0,type:'magic',family:'universal',rarity:'nemesis-unique',elements:['VACIO','OSCURIDAD'],treasure:true,shopExclusive:true,priceStars:1000,img:'assets/images/treasures/tn-arm-002.webp',effect:'treasureScythe',treasureKind:'weapon',atkBonus:2200,defBonus:1200,description:'Arma universal: +2200 ATK/+1200 DEF. Al destruir una criatura inflige 1000 HP adicionales.'},
 {id:'TN-TRP-001',name:'Juicio Final NEMESIS',atk:0,def:0,type:'trap',family:'universal',rarity:'nemesis-unique',elements:['CAOS','DIVINA'],treasure:true,shopExclusive:true,priceStars:1000,img:'assets/images/treasures/tn-trp-001.webp',effect:'treasureJudgement',treasureKind:'trap-response',unnegatable:true,description:'Trampa de respuesta: anula una accion decisiva, destruye la carta rival de mayor ATK y termina su turno.'}
];
CARDS.push(...NEMESIS_TREASURE_CARDS);
function nemesisTreasureOwned(id){return Array.isArray(state.owned)&&state.owned.includes(id)}
function nemesisTreasureRedeem(id){const c=NEMESIS_TREASURE_CARDS.find(x=>x.id===id);if(!c||nemesisTreasureOwned(id))return false;if((state.stars||0)<1000){alert('Necesitas 1000 estrellas.');return false}state.stars-=1000;state.owned.push(id);save();return true}
window.NEMESIS_TREASURE_AUDIT=()=>({count:NEMESIS_TREASURE_CARDS.length,price:1000,unique:new Set(NEMESIS_TREASURE_CARDS.map(c=>c.id)).size===5});
function nemesisTreasureScene(){
 const cards=NEMESIS_TREASURE_CARDS;
 app.innerHTML=`<section class="deck"><div class="deckbar"><div><h2>TESOROS NÉMESIS</h2><small>EDICIÓN NÉMESIS · 5 CARTAS ÚNICAS · SOLO CANJE</small></div><b>★ ${state.stars||0}</b></div>
 <p style="max-width:1100px;margin:0 auto 14px">Estas cartas no se obtienen en campañas ni se añaden automáticamente a ningún mazo. Cada una cuesta <b>★ 1000</b> y solo puede canjearse una vez.</p>
 <div class="grid shop-grid">${cards.map(c=>{const owned=nemesisTreasureOwned(c.id);return `<article class="card shop-card ${owned?'owned':''}"><img src="${c.img}" alt="${esc(c.name)}"><b>${c.name}</b><small>${c.description}</small><button class="btn treasure-buy" data-id="${c.id}" ${owned?'disabled':''}>${owned?'YA LA TIENES':'★ 1000 · CANJEAR'}</button></article>`}).join('')}</div>
 <div class="deckbar"><button class="btn" id="treasureBack">VOLVER</button></div></section>`;
 document.querySelectorAll('.treasure-buy:not([disabled])').forEach(b=>b.onclick=()=>{if(nemesisTreasureRedeem(b.dataset.id))nemesisTreasureScene()});
 treasureBack.onclick=menuScene
}
window.nemesisTreasureScene=nemesisTreasureScene;

const INITIAL_OWNED=SHOP_CARDS.slice(0,20).map(c=>c.id);
let state={name:'',profileCreated:false,battlesPlayed:0,lastBattleResult:null,lastBattleKey:null,lastAutosaveAt:0,dialog:0,fear:null,stars:0,retryBattle:null,campaignStage:'guardian',guardianDefeated:false,dragonDefeated:false,raDefeated:false,campaign1Completed:false,campaign2Unlocked:false,campaign2Started:false,campaign2Stage:'intro',caballeroAlmasDefeated:false,reyEspectralDefeated:false,diosFantasmaDefeated:false,campaign3Unlocked:false,campaign3Started:false,campaign3Stage:'locked',aresDefeated:false,hadesIntroSeen:false,hadesDefeated:false,savedDecks:{},activeDeckName:'OLIMPO',owned:INITIAL_OWNED.slice(),deck:INITIAL_OWNED.slice(0,11)};


// V18.9.18 — MEMORY CARD SEGURA
// Solo persiste progreso. NO interviene en el motor del duelo.
const NEMESIS_MC_KEY='nemesis_memory_card_v1';

function v18918LoadMemoryCard(){
 try{
  const raw=localStorage.getItem(NEMESIS_MC_KEY);
  if(!raw)return;
  const mc=JSON.parse(raw);
  if(mc&&typeof mc==='object'){
   if(typeof mc.name==='string')state.name=mc.name;
   if(typeof mc.profileCreated==='boolean')state.profileCreated=mc.profileCreated;
   if(Number.isFinite(Number(mc.battlesPlayed)))state.battlesPlayed=Math.max(0,Math.floor(Number(mc.battlesPlayed)));
   if(typeof mc.lastBattleResult==='string')state.lastBattleResult=mc.lastBattleResult;
   if(typeof mc.lastBattleKey==='string')state.lastBattleKey=mc.lastBattleKey;
   if(Number.isFinite(Number(mc.lastAutosaveAt)))state.lastAutosaveAt=Number(mc.lastAutosaveAt);
   if(Number.isFinite(Number(mc.stars))) state.stars=Math.max(0,Math.floor(Number(mc.stars)));
   if(Array.isArray(mc.owned)) state.owned=nemesisNormalizeCardIds(mc.owned);
   if(Array.isArray(mc.deck)) state.deck=nemesisNormalizeCardIds(mc.deck,11);
   if(['guardian','dragon-ojo-diablo','ira-ra','campaign1-complete','campaign2-intro','campaign2-hub'].includes(mc.campaignStage))state.campaignStage=mc.campaignStage;
   if(typeof mc.guardianDefeated==='boolean')state.guardianDefeated=mc.guardianDefeated;
   if(typeof mc.dragonDefeated==='boolean')state.dragonDefeated=mc.dragonDefeated;
   if(typeof mc.raDefeated==='boolean')state.raDefeated=mc.raDefeated;
   if(typeof mc.campaign1Completed==='boolean')state.campaign1Completed=mc.campaign1Completed;
   if(typeof mc.campaign2Unlocked==='boolean')state.campaign2Unlocked=mc.campaign2Unlocked;
   if(typeof mc.campaign2Started==='boolean')state.campaign2Started=mc.campaign2Started;
   if(typeof mc.campaign2Stage==='string')state.campaign2Stage=mc.campaign2Stage;
   if(typeof mc.caballeroAlmasDefeated==='boolean')state.caballeroAlmasDefeated=mc.caballeroAlmasDefeated;
   if(typeof mc.reyEspectralDefeated==='boolean')state.reyEspectralDefeated=mc.reyEspectralDefeated;
   if(typeof mc.diosFantasmaDefeated==='boolean')state.diosFantasmaDefeated=mc.diosFantasmaDefeated;
   if(typeof mc.campaign3Unlocked==='boolean')state.campaign3Unlocked=mc.campaign3Unlocked;
   if(typeof mc.campaign3Started==='boolean')state.campaign3Started=mc.campaign3Started;
   if(typeof mc.campaign3Stage==='string')state.campaign3Stage=mc.campaign3Stage;
   if(typeof mc.aresDefeated==='boolean')state.aresDefeated=mc.aresDefeated;
   if(typeof mc.hadesIntroSeen==='boolean')state.hadesIntroSeen=mc.hadesIntroSeen;
   if(typeof mc.hadesDefeated==='boolean')state.hadesDefeated=mc.hadesDefeated;
   if(typeof mc.retryBattle==='string')state.retryBattle=mc.retryBattle;
   if(mc.savedDecks&&typeof mc.savedDecks==='object')state.savedDecks=mc.savedDecks;
   if(typeof mc.activeDeckName==='string')state.activeDeckName=mc.activeDeckName;
   if(mc.sanctuary&&typeof mc.sanctuary==='object')state.sanctuary=mc.sanctuary;
  }
 }catch(err){
  console.warn('Memory Card dañada; se usa el save normal.',err);
 }
}

function v18918SaveMemoryCard(){
 try{
  const payload={
   name:typeof state.name==='string'?state.name:'',
   profileCreated:state.profileCreated===true,
   battlesPlayed:Math.max(0,Math.floor(Number(state.battlesPlayed)||0)),
   lastBattleResult:state.lastBattleResult||null,
   lastBattleKey:state.lastBattleKey||null,
   lastAutosaveAt:Number(state.lastAutosaveAt)||0,
   stars:Math.max(0,Math.floor(Number(state.stars)||0)),
   owned:[...new Set(Array.isArray(state.owned)?state.owned:[])],
   deck:[...new Set(Array.isArray(state.deck)?state.deck:[])].slice(0,11),
   campaignStage:['guardian','dragon-ojo-diablo','ira-ra','campaign1-complete','campaign2-intro','campaign2-hub'].includes(state.campaignStage)?state.campaignStage:'guardian',
   guardianDefeated:state.guardianDefeated===true,
   dragonDefeated:state.dragonDefeated===true,
   raDefeated:state.raDefeated===true,
   campaign1Completed:state.campaign1Completed===true,
   campaign2Unlocked:state.campaign2Unlocked===true,
   campaign2Started:state.campaign2Started===true,
   campaign2Stage:typeof state.campaign2Stage==='string'?state.campaign2Stage:'intro',
   caballeroAlmasDefeated:state.caballeroAlmasDefeated===true,
   reyEspectralDefeated:state.reyEspectralDefeated===true,
   diosFantasmaDefeated:state.diosFantasmaDefeated===true,
   campaign3Unlocked:state.campaign3Unlocked===true,
   campaign3Started:state.campaign3Started===true,
   campaign3Stage:typeof state.campaign3Stage==='string'?state.campaign3Stage:'locked',
   aresDefeated:state.aresDefeated===true,
   hadesIntroSeen:state.hadesIntroSeen===true,
   hadesDefeated:state.hadesDefeated===true,
   savedDecks:state.savedDecks&&typeof state.savedDecks==='object'?state.savedDecks:{},
   activeDeckName:typeof state.activeDeckName==='string'?state.activeDeckName:'OLIMPO',
   sanctuary:state.sanctuary&&typeof state.sanctuary==='object'?state.sanctuary:{awake:false,claimed:[],trials:{primordial:false,time:false,void:false}},
   retryBattle:typeof state.retryBattle==='string'?state.retryBattle:null,
   savedAt:Date.now()
  };
  localStorage.setItem(NEMESIS_MC_KEY,JSON.stringify(payload));
 }catch(err){
  console.warn('No se pudo guardar Memory Card.',err);
 }
}

function v18918SanitizeMemoryCard(){
 // Solo IDs válidos del juego. Nunca crea objetos paralelos.
 state.owned=[...new Set((state.owned||[]).filter(id=>CARDS.some(c=>c.id===id)))];
 state.deck=[...new Set((state.deck||[]).filter(id=>state.owned.includes(id)&&CARDS.some(c=>c.id===id)))].slice(0,11);

 // Si por alguna corrupción quedara vacío, conserva el mazo estable original.
 if(!state.owned.length) state.owned=INITIAL_OWNED.slice();
 if(!state.deck.length) state.deck=state.owned.slice(0,11);
}

try{Object.assign(state,JSON.parse(localStorage.getItem('nemesis_visible_v2')||localStorage.getItem('nemesis_visible_v1')||'{}'))}catch{}
v18918LoadMemoryCard();
// V18.9.50 — migración segura: una partida que ya derrotó a Ra entra al final de Campaña I
// sin perder estrellas, colección, mazo ni recompensas obtenidas.
if(state.raDefeated===true){
 state.campaign1Completed=true;
 state.campaign2Unlocked=true;
 if(!state.campaign2Started&&state.campaignStage==='ira-ra')state.campaignStage='campaign1-complete';
}
if(!Array.isArray(state.owned)||!state.owned.length)state.owned=INITIAL_OWNED.slice();
if(!Array.isArray(state.deck))state.deck=[];
if(!state.v8GuardianOwnershipFixed){
 const v7Granted=new Set(['dragon-carmesi-caos','dragon-abisal-nemesis','dragon-negro-ruinas','dragon-infernal-sangre','magica-curandero','magica-nosferatu','fusion-caotico-supremo','fusion-dragon-caos']);
 state.owned=state.owned.filter(id=>!v7Granted.has(id)); state.deck=state.deck.filter(id=>!v7Granted.has(id)); state.v8GuardianOwnershipFixed=true;
}
state.owned=[...new Set(state.owned)].filter(id=>CARDS.some(c=>c.id===id));
const playerExclusiveIds=PLAYER_EXCLUSIVE_CARDS.map(c=>c.id);
state.owned=[...new Set([...playerExclusiveIds,...state.owned])];
state.deck=[...new Set([...playerExclusiveIds,...state.deck])].slice(0,11);
const v18919MagicIds=NEW_CARDS.filter(c=>c.type==='magic'&&!GUARDIAN_BOSS_CARD_IDS.includes(c.id)).map(c=>c.id);
if(!state.v18919MagicCardsGranted){state.owned=[...new Set([...state.owned,...v18919MagicIds])];state.v18919MagicCardsGranted=true;}
const guardianAlreadyUnlocked=state.guardianDefeated===true||state.campaignStage!=='guardian'||state.dragonDefeated===true||state.raDefeated===true;
if(!state.v18943BossProgressionFixed){
 if(!guardianAlreadyUnlocked){state.owned=state.owned.filter(id=>!GUARDIAN_BOSS_CARD_IDS.includes(id));state.deck=state.deck.filter(id=>!GUARDIAN_BOSS_CARD_IDS.includes(id))}
 state.v18943BossProgressionFixed=true;
}
const v18942DivineIds=DIVINE_PLAYER_CARDS.map(c=>c.id);
if(!state.v18942DivineCardsGranted){
 state.owned=[...new Set([...state.owned,...v18942DivineIds])];
 for(const id of v18942DivineIds){if(!state.deck.includes(id)&&state.deck.length<11)state.deck.push(id)}
 state.v18942DivineCardsGranted=true;
}
const v18949OlympusIds=['zeus-emperador-rayo','kronos-devorador-tiempo'];
if(!state.v18949OlympusCardsGranted){state.owned=[...new Set([...state.owned,...v18949OlympusIds])];for(const id of v18949OlympusIds){if(!state.deck.includes(id)&&state.deck.length<11)state.deck.push(id)}state.v18949OlympusCardsGranted=true;}
// V18.9.59 — RECUPERACIÓN OLIMPO.
// Repara partidas antiguas donde el indicador de concesión quedó guardado pero las cartas
// desaparecieron de owned/deck durante una migración posterior. No reemplaza ninguna carta.
const v18959OlympusRecoveryIds=['dios-jupiter','zeus-emperador-rayo','kronos-devorador-tiempo'];
state.owned=[...new Set([...(state.owned||[]),...v18959OlympusRecoveryIds])];
for(const id of v18959OlympusRecoveryIds){
  if(!state.deck.includes(id)&&state.deck.length<11)state.deck.push(id);
}
state.v18949OlympusCardsGranted=true;
if(!state.owned.includes('apolo-guardian-solar'))state.owned.push('apolo-guardian-solar');
if(!state.deck.includes('apolo-guardian-solar')&&state.deck.length<11)state.deck.push('apolo-guardian-solar');
v18918SanitizeMemoryCard();

const save=()=>{
 localStorage.setItem('nemesis_visible_v2',JSON.stringify(state));
 v18918SaveMemoryCard();
};

// V18.12.00 — MAZOS PERSISTENTES / OLIMPO COMO MAZO OFICIAL
// No vuelve a pisar el mazo activo en cada carga.
for(const id of OLIMPO_DECK_IDS)if(card(id)&&!state.owned.includes(id))state.owned.push(id);
if(!state.savedDecks||typeof state.savedDecks!=='object')state.savedDecks={};
if(!Array.isArray(state.savedDecks.OLIMPO)||!state.savedDecks.OLIMPO.length){
 state.savedDecks.OLIMPO=OLIMPO_DECK_IDS.filter(id=>card(id)).slice(0,11);
}
if(!state.activeDeckName||!Array.isArray(state.savedDecks[state.activeDeckName]))state.activeDeckName='OLIMPO';
const restoredDeck=(state.savedDecks[state.activeDeckName]||state.savedDecks.OLIMPO||[]).filter(id=>state.owned.includes(id)&&card(id)).slice(0,11);
if(restoredDeck.length)state.deck=restoredDeck;
state.olympoDeckUnlocked=true;
save();
v18918SaveMemoryCard();
const app=document.getElementById('app');

// V18.9.4 — indicador de fase VISUAL. No controla el flujo del duelo.
function v1894PhaseLabel(){}


// V19.2.8 — Colección externa y segundo mazo Duel Master
state.owned=[...new Set([...(state.owned||[]),...NEMESIS_PUBLIC_23_IDS,...NEMESIS_DUEL_MASTER_IDS])];
state.savedDecks=state.savedDecks||{};
if(!Array.isArray(state.savedDecks.OLIMPO)||!state.savedDecks.OLIMPO.length)state.savedDecks.OLIMPO=OLIMPO_DECK_IDS.filter(id=>card(id)).slice(0,11);
state.savedDecks.DUEL_MASTER=NEMESIS_DUEL_MASTER_IDS.filter(id=>card(id));
state.owned=[...new Set([...(state.owned||[]),...MAGO_ROJO_DECK_IDS])];
if(!Array.isArray(state.savedDecks.MAGO_ROJO)||!state.savedDecks.MAGO_ROJO.length)state.savedDecks.MAGO_ROJO=MAGO_ROJO_DECK_IDS.filter(id=>card(id));
state.owned=[...new Set([...(state.owned||[]),...IMPERIO_DRAGON_DECK_IDS])];
state.savedDecks.IMPERIO_DRAGON=IMPERIO_DRAGON_DECK_IDS.filter(id=>card(id));
if(!state.activeDeckName)state.activeDeckName='OLIMPO';

function card(id){
 return CARDS.find(c=>c.id===id);
}

// V19.4.1 — saneamiento de Memory Card: elimina IDs inexistentes/repetidos
// sin borrar progreso ni cartas válidas del jugador.
function nemesisNormalizeCardIds(ids,limit=Infinity){
 const out=[],seen=new Set();
 for(const id of Array.isArray(ids)?ids:[]){
  if(seen.has(id)||!card(id))continue;
  seen.add(id);out.push(id);
  if(out.length>=limit)break;
 }
 return out;
}
window.NEMESIS_CARD_REGISTRY_AUDIT=()=>({
 total:CARDS.length,
 uniqueIds:new Set(CARDS.map(c=>c.id)).size,
 duplicateIds:CARDS.length-new Set(CARDS.map(c=>c.id)).size,
 missingImages:CARDS.filter(c=>!c.img).map(c=>c.id)
});


// V19.1 — MOTOR AISLADO DEL SANTUARIO
const NEMESIS_UNIQUE_CARDS=Object.freeze([
 {id:'nemesis-primigenio',name:'NÉMESIS PRIMIGENIO',subtitle:'EL QUE ESTÁ SOBRE LOS DIOSES',atk:25000,def:20000,img:'assets/images/unique/nemesis-primigenio.png',pedestal:'PRIMORDIAL',trial:'JUICIO PRIMORDIAL',role:'DOMINIO DEL CAMPO'},
 {id:'aion-unico',name:'AION',subtitle:'SOBERANO DEL ÚLTIMO SEGUNDO',atk:18000,def:24000,img:'assets/images/unique/aion.png',pedestal:'TIEMPO',trial:'DESAFÍO DEL TIEMPO',role:'DOMINIO DEL TIEMPO'},
 {id:'azathiel-unico',name:'AZATHIEL',subtitle:'DEVORADOR DE REALIDADES',atk:30000,def:10000,img:'assets/images/unique/azathiel.png',pedestal:'VACÍO',trial:'SELLO DEL VACÍO',role:'DESTRUCCIÓN Y VACÍO'}
]);
function nemesisEnsureSanctuary(){
 if(!state.sanctuary||typeof state.sanctuary!=='object')state.sanctuary={awake:false,claimed:[],trials:{primordial:false,time:false,void:false}};
 if(!Array.isArray(state.sanctuary.claimed))state.sanctuary.claimed=[];
 if(!state.sanctuary.trials)state.sanctuary.trials={primordial:false,time:false,void:false};
}
function nemesisUniqueOwned(id){nemesisEnsureSanctuary();return state.sanctuary.claimed.includes(id)||state.owned.includes(id)}
function nemesisUniqueDeckRule(ids){
 const unique=[...new Set(ids||[])].filter(id=>NEMESIS_UNIQUE_CARDS.some(x=>x.id===id));
 return {ok:unique.length<=1,unique};
}
function nemesisClaimUnique(id){
 nemesisEnsureSanctuary();
 const u=NEMESIS_UNIQUE_CARDS.find(x=>x.id===id); if(!u)return false;
 const key=id==='nemesis-primigenio'?'primordial':id==='aion-unico'?'time':'void';
 if(nemesisUniqueOwned(id)){toast(`${u.name} ya es tu ÚNICA 1/1.`);return false}
 if(!state.sanctuary.trials[key]){toast(`${u.trial} permanece sellado.`);return false}
 state.sanctuary.claimed.push(id);
 if(!state.owned.includes(id))state.owned.push(id);
 save(); try{v18918SaveMemoryCard?.()}catch(e){}
 toast(`ÚNICA 1/1 OBTENIDA · ${u.name}`); return true;
}
window.NEMESIS_SANCTUARY=Object.freeze({cards:NEMESIS_UNIQUE_CARDS,claim:nemesisClaimUnique,deckRule:nemesisUniqueDeckRule});

// V18.12.00 — COLECCIÓN GLOBAL NÉMESIS
function nemesisEnsureDeckLibrary(){
 if(!state.savedDecks||typeof state.savedDecks!=='object')state.savedDecks={};
 if(!Array.isArray(state.savedDecks.OLIMPO)||!state.savedDecks.OLIMPO.length)
   state.savedDecks.OLIMPO=OLIMPO_DECK_IDS.filter(id=>card(id)).slice(0,11);
 if(!state.activeDeckName||!Array.isArray(state.savedDecks[state.activeDeckName]))
   state.activeDeckName='OLIMPO';
}
function nemesisSyncActiveDeck(){
 nemesisEnsureDeckLibrary();
 const src=state.savedDecks[state.activeDeckName]||[];
 state.deck=[...new Set(src.filter(id=>state.owned.includes(id)&&card(id)))].slice(0,11);
}
function nemesisSaveCurrentDeck(){
 nemesisEnsureDeckLibrary();
 state.savedDecks[state.activeDeckName]=[...new Set(state.deck.filter(id=>state.owned.includes(id)&&card(id)))].slice(0,11);
 save();return state.savedDecks[state.activeDeckName];
}
function nemesisSelectDeck(name){
 nemesisEnsureDeckLibrary();
 if(!Array.isArray(state.savedDecks[name]))return false;
 state.activeDeckName=name;nemesisSyncActiveDeck();save();return true;
}
function nemesisCreateDeck(){
 nemesisEnsureDeckLibrary();
 let n=Object.keys(state.savedDecks).length+1,name=`MAZO ${n}`;
 while(state.savedDecks[name])name=`MAZO ${++n}`;
 state.savedDecks[name]=[];state.activeDeckName=name;state.deck=[];save();return name;
}
function nemesisBossDeckIds(id){
 const x=window.NEMESIS_BOSS_REGISTRY?.[id];
 return Array.isArray(x?.deck)?x.deck.filter(cid=>card(cid)):bossRewardPool(id).filter(cid=>card(cid));
}
function nemesisUnlockCards(ids,source='RECOMPENSA'){
 let added=0;
 for(const id of [...new Set(ids||[])]){
  if(card(id)&&!state.owned.includes(id)){state.owned.push(id);added++}
 }
 state.owned=[...new Set(state.owned)].filter(id=>card(id));
 if(added)pcLog?.(`${source}: ${added} carta(s) pasan a la Colección Global.`,'effect');
 return added;
}
function nemesisUnlockCampaignDecks(campaignId,silent=false){
 const profile=NEMESIS_CAMPAIGN_PROFILES[campaignId];if(!profile)return 0;
 let total=0;
 for(const boss of profile.bosses)total+=nemesisUnlockCards(nemesisBossDeckIds(boss),`${profile.name} · ${boss}`);
 if(total&&!silent)toast(`${profile.name} COMPLETADA · ${total} cartas nuevas guardadas en tu inventario.`);
 save();return total;
}
function nemesisMigrateCompletedCampaignRewards(){
 if(state.campaign1Completed||state.raDefeated)nemesisUnlockCampaignDecks('campaign1',true);
 if(state.diosFantasmaDefeated)nemesisUnlockCampaignDecks('campaign2',true);
 if(state.hadesDefeated)nemesisUnlockCampaignDecks('campaign3',true);
 nemesisEnsureDeckLibrary();nemesisSyncActiveDeck();save();
}
window.NEMESIS_COLLECTION=Object.freeze({
 unlockCampaign:nemesisUnlockCampaignDecks,
 selectDeck:nemesisSelectDeck,
 saveDeck:nemesisSaveCurrentDeck,
 createDeck:nemesisCreateDeck,
 get activeDeck(){return state.activeDeckName},
 get decks(){return JSON.parse(JSON.stringify(state.savedDecks||{}))},
 get owned(){return state.owned.slice()}
});

function cardStats(c){
 if(c?.externalCard){const d=c.externalData||{};return c.type==='monster'?`${d.rareza||'ESPECIAL'} · ATK ${c.atk} · DEF ${c.def}`:`${d.clase||'CARTA'} · ${d.rareza||'ESPECIAL'}`}
 if(c.type!=='magic')return `${c.rarity==='divina'?'DIVINA · ':''}${c.family==='universo'?'UNIVERSO · ':''}ATK ${c.atk} · DEF ${c.def}`;
 const labels={heal:`RECUPERA ${c.value} HP`,damageOpponent:`QUITA ${c.value} HP AL RIVAL`,boost:`+${c.value} ATK · DUELO`,boostTurn:`+${c.value} ATK · TURNO`,shieldNext:`+${c.value} DEF · PRÓXIMO ATAQUE`,resurrect:'RESUCITA 1 MONSTRUO',purgeSpellTrap:'DESTRUYE MÁGICA/TRAMPA'};
 return labels[c.effect]||'CARTA MÁGICA';
}
function esc(v=''){return String(v).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
function title(){menuScene()}
function continueCampaign(){
 state.dialog=0;state.fear=null;
 if(state.campaign3Started){
   if(state.hadesDefeated)return menuScene();
   if(state.aresDefeated||String(state.campaign3Stage||'').startsWith('hades')){
     if(state.hadesIntroSeen)return battle('hades');
     return hadesAfterAresCinematic();
   }
   return aresCampaign3Scene();
 }
 if(state.campaignStage==='campaign2-hub')campaign2Hub();
 else if(state.campaignStage==='campaign2-intro')campaign2Intro();
 else if(state.campaignStage==='campaign1-complete'&&state.campaign2Unlocked){state.campaign2Started=true;state.campaignStage='campaign2-intro';save();campaign2Intro()}
 else if(state.campaignStage==='ira-ra')iraRaScene();
 else if(state.campaignStage==='dragon-ojo-diablo')dragonOjoScene();
 else tirano();
}
function guardianCardsUnlocked(){return state.guardianDefeated===true||state.campaignStage!=='guardian'||state.dragonDefeated===true||state.raDefeated===true}
function unlockedShopCards(){
 const list=SHOP_CARDS.filter(c=>!GUARDIAN_BOSS_CARD_IDS.includes(c.id)||guardianCardsUnlocked());
 if(state.dragonDefeated)list.push(...DRAGON_OJO_CARDS);
 if(state.raDefeated)list.push(...ANCESTRAL_CARDS);
 return [...new Map(list.map(c=>[c.id,c])).values()];
}
async function requestNemesisFullscreen(){try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch(err){console.warn('Pantalla completa no disponible',err)}}

function sanctuaryScene(){
 nemesisEnsureSanctuary();
 const cards=NEMESIS_UNIQUE_CARDS.map(u=>{
  const key=u.id==='nemesis-primigenio'?'primordial':u.id==='aion-unico'?'time':'void';
  const trial=state.sanctuary.trials[key],owned=nemesisUniqueOwned(u.id);
  return `<article class="unique-pedestal ${trial?'trial-open':''} ${owned?'claimed':''}">
   <div class="unique-aura"></div><img src="${u.img}" alt="${u.name}">
   <div class="unique-info"><small>${u.pedestal} · ÚNICA 1/1</small><h2>${u.name}</h2><p>${u.subtitle}</p>
   <b>ATK ${u.atk.toLocaleString('es-CL')} · DEF ${u.def.toLocaleString('es-CL')}</b><em>${u.role}</em>
   <button class="btn" data-unique="${u.id}" ${owned||!trial?'disabled':''}>${owned?'OBTENIDA 1/1':trial?'RECLAMAR ÚNICA':'SELLADA · '+u.trial}</button></div></article>`;
 }).join('');
 app.innerHTML=`<section class="sanctuary-scene"><div class="sanctuary-sky"></div>
 <header><button class="btn" id="sanctuaryBack">VOLVER</button><div><small>ZONA PERMANENTE · MOTOR AISLADO</small><h1>SANTUARIO DE LAS TRES ÚNICAS</h1><p>Tres cartas irrepetibles. Ninguna se obtiene automáticamente.</p></div><div class="unique-law">LEY DE UNICIDAD<br><b>1/1</b></div></header>
 <div class="sanctuary-gate"><span>◈</span><b>${state.sanctuary.awake?'SANTUARIO DESPERTADO':'SANTUARIO SELLADO'}</b><small>${state.sanctuary.awake?'Los pedestales esperan sus desafíos.':'Se despierta tras derrotar a Hades. Los desafíos siguen independientes.'}</small></div>
 <div class="pedestal-grid">${cards}</div></section>`;
 sanctuaryBack.onclick=menuScene;
 document.querySelectorAll('[data-unique]').forEach(b=>b.onclick=()=>{if(nemesisClaimUnique(b.dataset.unique))sanctuaryScene()});
}
window.sanctuaryScene=sanctuaryScene;


/* V19.5 — RETOS / REVANCHA PERMANENTE
   Un rival solo aparece tras ser derrotado en Campaña.
   Guardianes: ★100. Jefes: ★200 (doble).
   Reutiliza battle() y los mazos/jefes oficiales; no duplica el motor. */
const NEMESIS_RETRY_ROSTER=Object.freeze([
 {id:'guardian',name:'Guardián de los Dragones',role:'GUARDIÁN',flag:'guardianDefeated',reward:100,img:AS.guardian,battleKey:null},
 {id:'dragon-ojo',name:'Dragón Ojo del Diablo',role:'JEFE',flag:'dragonDefeated',reward:200,img:'assets/images/dragon-ojo-del-diablo.png',battleKey:'dragon-ojo'},
 {id:'ira-ra',name:'Ira de Ra',role:'JEFE',flag:'raDefeated',reward:200,img:'assets/images/ira-de-ra-jefe.png',battleKey:'ira-ra'},
 {id:'caballero-almas',name:'Caballero de las Almas',role:'GUARDIÁN',flag:'caballeroAlmasDefeated',reward:100,img:AS.caballeroAlmas,battleKey:'caballero-almas'},
 {id:'rey-espectral',name:'Rey Espectral',role:'JEFE',flag:'reyEspectralDefeated',reward:200,img:AS.reyEspectral,battleKey:'rey-espectral'},
 {id:'dios-fantasma',name:'Dios Fantasma',role:'JEFE',flag:'diosFantasmaDefeated',reward:200,img:'assets/images/dios-fantasma/dios-fantasma.png',battleKey:'dios-fantasma'},
 {id:'ares',name:'Ares',role:'JEFE',flag:'aresDefeated',reward:200,img:'assets/images/campaign3/ares/ares-personaje.png',battleKey:'ares'},
 {id:'hades',name:'Hades',role:'JEFE',flag:'hadesDefeated',reward:200,img:'assets/images/campaign3/hades/hades-personaje.png',battleKey:'hades'}
]);
function nemesisRetryUnlocked(r){return state[r.flag]===true}
function nemesisRetryActive(){return state.retryBattle&&NEMESIS_RETRY_ROSTER.some(r=>r.id===state.retryBattle)}
function nemesisRetryRewardFor(key){
 const r=NEMESIS_RETRY_ROSTER.find(x=>x.id===state.retryBattle);
 if(!r)return null;
 const expected=r.battleKey||'guardian',actual=key||'guardian';
 return expected===actual?r:null
}
function nemesisStartRetry(id){
 const r=NEMESIS_RETRY_ROSTER.find(x=>x.id===id);if(!r||!nemesisRetryUnlocked(r))return;
 if(!state.deck.length){alert('Selecciona al menos 1 carta para tu mazo.');return}
 state.retryBattle=id;save();battle(r.battleKey||undefined);
}
function nemesisRetryScene(){
 const unlocked=NEMESIS_RETRY_ROSTER.filter(nemesisRetryUnlocked);
 app.innerHTML=`<section class="deck retry-hall"><div class="deckbar"><div><h2>RETOS · REVANCHA</h2><small>Rivales derrotados en Campaña · puedes retarlos todas las veces que quieras</small></div><b>★ ${state.stars||0}</b></div>
 <div class="retry-rules"><b>GANA ESTRELLAS EN CADA VICTORIA</b><span>GUARDIÁN ★100 · JEFE ★200 · LOS JEFES DAN EL DOBLE</span><small>Las revanchas reutilizan el rival, mazo, IA, fases y efectos oficiales.</small></div>
 <div class="retry-grid">${NEMESIS_RETRY_ROSTER.map(r=>{const open=nemesisRetryUnlocked(r);return `<article class="retry-card ${open?'open':'locked'}"><div class="retry-portrait">${open?`<img src="${r.img}" alt="${esc(r.name)}">`:'<div class="retry-lock">🔒</div>'}</div><small>${r.role}</small><h3>${open?esc(r.name):'RIVAL BLOQUEADO'}</h3><b>VICTORIA · ★${r.reward}</b><button class="btn retry-fight" data-retry="${r.id}" ${open?'':'disabled'}>${open?'RETAR OTRA VEZ':'DERROTAR EN CAMPAÑA'}</button></article>`}).join('')}</div>
 <div class="deckbar"><span>Desbloqueados ${unlocked.length}/${NEMESIS_RETRY_ROSTER.length}</span><button class="btn" id="retryBack">VOLVER AL MENÚ</button></div></section>`;
 document.querySelectorAll('.retry-fight:not([disabled])').forEach(b=>b.onclick=()=>nemesisStartRetry(b.dataset.retry));
 retryBack.onclick=menuScene;
}
window.nemesisRetryScene=nemesisRetryScene;
window.NEMESIS_RETRY_AUDIT=()=>({total:NEMESIS_RETRY_ROSTER.length,unlocked:NEMESIS_RETRY_ROSTER.filter(nemesisRetryUnlocked).length,guardianReward:100,bossReward:200,active:state.retryBattle||null});


function nemesisValidPlayerName(v){
 const name=String(v||'').trim().replace(/\s+/g,' ');
 return name.length>=1&&name.length<=24?name:'';
}
function nemesisCreateProfileScene(){
 app.innerHTML=`<section class="profile-create"><div class="profile-create-card">
  <div class="logo">NÉMESIS<small>CARD BATTLE</small></div>
  <small class="profile-kicker">CREAR JUGADOR</small>
  <h1>ELIGE TU NOMBRE</h1>
  <p>Este nombre quedará guardado en tu partida y aparecerá en campañas, retos y duelos.</p>
  <input id="playerCreateName" maxlength="24" autocomplete="off" placeholder="ESCRIBE TU NOMBRE">
  <button class="btn big-start" id="playerCreateBtn">CREAR JUGADOR</button>
  <span id="playerCreateError"></span>
  <small class="mc-safe">MEMORY CARD · AUTO-GUARDADO ACTIVO</small>
 </div></section>`;
 const input=document.getElementById('playerCreateName'),btn=document.getElementById('playerCreateBtn'),err=document.getElementById('playerCreateError');
 const commit=()=>{const name=nemesisValidPlayerName(input.value);if(!name){err.textContent='Escribe un nombre para continuar.';input.focus();return}state.name=name;state.profileCreated=true;state.lastAutosaveAt=Date.now();save();menuScene()};
 btn.onclick=commit;input.addEventListener('keydown',e=>{if(e.key==='Enter')commit()});setTimeout(()=>input.focus(),40);
}
function nemesisEnsureProfile(){
 if(nemesisValidPlayerName(state.name)){state.profileCreated=true;return true}
 state.profileCreated=false;nemesisCreateProfileScene();return false
}
function menuScene(){
 if(!nemesisEnsureProfile())return;
 const unlockedCount=unlockedShopCards().length;
 const campaignButton=state.campaign3Started?(state.hadesDefeated?'CAMPAÑA III · HADES DERROTADO':'CONTINUAR CAMPAÑA III'):state.campaign1Completed&&!state.campaign2Started?'INICIAR CAMPAÑA II':state.campaign2Started?'CONTINUAR CAMPAÑA II':state.campaignStage!=='guardian'?'CONTINUAR CAMPAÑA I':'EMPEZAR CAMPAÑA I';
 const campaignStatus=state.campaign1Completed?`<div class="campaign-progress-card complete"><small>PROGRESO DE CAMPAÑA</small><b>✓ CAMPAÑA I COMPLETADA</b><span>Guardián ✓ · Dragón Ojo del Diablo ✓ · Ira de Ra ✓</span><em>${state.campaign2Started?'CAMPAÑA II EN CURSO':'CAMPAÑA II DESBLOQUEADA'}</em></div>`:`<div class="campaign-progress-card"><small>PROGRESO DE CAMPAÑA</small><b>CAMPAÑA I</b><span>Guardián ${state.guardianDefeated?'✓':'○'} · Dragón ${state.dragonDefeated?'✓':'○'} · Ira de Ra ${state.raDefeated?'✓':'○'}</span></div>`;
 app.innerHTML=`<section class="deck menu-home"><div class="deckbar"><div><div class="logo" style="font-size:42px">NÉMESIS<small>CARD BATTLE</small></div><small>PREPARA TU MAZO ANTES DE ENTRAR AL REINO</small></div><b>★ ${state.stars||0}</b></div>
 ${campaignStatus}
 <div class="menu-panel"><h2>JUGADOR</h2><div class="name-row"><input id="nm" maxlength="24" placeholder="NOMBRE DEL JUGADOR" value="${esc(state.name||'')}"><button class="btn" id="changeName">CAMBIAR</button></div><small>Tu nombre aparecerá en la historia y en los duelos.</small></div>
 <div class="menu-actions"><button class="btn" id="shopBtn">INTERCAMBIAR CARTAS · ${unlockedCount}</button><button class="btn" id="deckBtn">MI COLECCIÓN · ${state.owned.length}/${INVENTORY_CAPACITY}</button><button class="btn" id="treasureBtn">TESOROS NÉMESIS · ★1000</button><button class="btn retry-entry" id="retryBtn">RETOS · REVANCHA ★</button><button class="btn sanctuary-entry" id="sanctuaryBtn">SANTUARIO · 3 ÚNICAS</button><button class="btn" id="menuFullscreen">⛶ PANTALLA COMPLETA</button></div>
 <div class="menu-panel"><h2>MAZO DE BATALLA</h2><p>Elige hasta <b>11 cartas</b> de tu colección para usar en batalla.</p><div class="mini-deck">${state.deck.map(id=>{const c=card(id);return c?`<img src="${c.img}" alt="${esc(c.name)}" title="${esc(c.name)}">`:''}).join('')}</div><b>${state.deck.length}/11 seleccionadas</b></div>
 <div class="deckbar"><span>Tu colección, estrellas, cartas ganadas y mazo se conservan entre campañas. <small class="mc-safe">MEMORY CARD · AUTO-GUARDADO · ${state.battlesPlayed||0} PELEAS</small></span><button class="btn big-start" id="startStory">${campaignButton}</button></div></section>`;
 changeName.onclick=()=>{const next=nemesisValidPlayerName(nm.value);if(!next){alert('Escribe un nombre válido.');return}state.name=next;state.profileCreated=true;state.lastAutosaveAt=Date.now();save();changeName.textContent='GUARDADO ✓';setTimeout(()=>menuScene(),500)};
 shopBtn.onclick=shopScene;deckBtn.onclick=collectionScene;if(typeof treasureBtn!=='undefined'&&treasureBtn)treasureBtn.onclick=nemesisTreasureScene;
if(typeof sanctuaryBtn!=='undefined'&&sanctuaryBtn)sanctuaryBtn.onclick=sanctuaryScene;
if(typeof retryBtn!=='undefined'&&retryBtn)retryBtn.onclick=nemesisRetryScene;
menuFullscreen.onclick=requestNemesisFullscreen;startStory.onclick=()=>{const next=nemesisValidPlayerName(nm.value)||nemesisValidPlayerName(state.name);if(!next){nemesisCreateProfileScene();return}state.name=next;state.profileCreated=true;state.lastAutosaveAt=Date.now();if(!state.deck.length){alert('Selecciona al menos 1 carta para tu mazo.');return}if(state.campaign1Completed&&!state.campaign2Started){state.campaign2Started=true;state.campaignStage='campaign2-intro';state.campaign2Stage='intro'}save();continueCampaign()};
}
function shopPrice(c,i){return Math.max(50,Math.round((c.atk+c.def)/20/10)*10 + (i%5)*20)}
function shopScene(){
 const available=unlockedShopCards();
 const locks=[];if(!guardianCardsUnlocked())locks.push('Vence al GUARDIÁN para desbloquear sus cartas');if(!state.dragonDefeated)locks.push('Vence al DRAGÓN OJO DEL DIABLO para desbloquear su mazo');if(!state.raDefeated)locks.push('Vence a IRA DE RA para desbloquear su mazo ancestral');
 app.innerHTML=`<section class="deck"><div class="deckbar"><div><h2>INTERCAMBIO NÉMESIS</h2><small>${available.length} cartas desbloqueadas${locks.length?` · ${locks.join(' · ')}`:''}</small></div><b>★ ${state.stars||0}</b></div><div class="grid shop-grid">${available.map((c,i)=>{const owned=state.owned.includes(c.id),price=shopPrice(c,i);return `<article class="card shop-card ${owned?'owned':''}"><img src="${c.img}"><b>${c.name}</b><small>${cardStats(c)}</small><button class="btn buy" data-id="${c.id}" data-price="${price}" ${owned?'disabled':''}>${owned?'YA LA TIENES':`★ ${price} · CANJEAR`}</button></article>`}).join('')}</div><div class="deckbar"><button class="btn" id="backMenu">VOLVER AL MENÚ</button></div></section>`;
 document.querySelectorAll('.buy:not([disabled])').forEach(b=>b.onclick=()=>{const id=b.dataset.id,price=Number(b.dataset.price)||0;if((state.stars||0)<price){alert(`Necesitas ${price} estrellas.`);return}state.stars-=price;state.owned.push(id);save();shopScene()});backMenu.onclick=menuScene;
}
function collectionScene(){
 nemesisEnsureDeckLibrary();
 const ownedCards=state.owned.map(id=>card(id)).filter(Boolean),emptyCount=Math.max(0,INVENTORY_CAPACITY-ownedCards.length);
 const emptySlots=Array.from({length:emptyCount},(_,i)=>`<div class="card empty-card" aria-label="Espacio vacío ${ownedCards.length+i+1}"><div class="empty-card-mark">${ownedCards.length+i+1}</div><b>ESPACIO VACÍO</b><small>PRÓXIMA CARTA</small></div>`).join('');
 const deckNames=Object.keys(state.savedDecks);
 app.innerHTML=`<section class="deck collection-global"><div class="deckbar"><div><h2>COLECCIÓN NÉMESIS GLOBAL</h2><small>${ownedCards.length}/${INVENTORY_CAPACITY} cartas · Campañas I–III comparten inventario</small></div><b>MAZO ${state.deck.length}/11</b></div>
 <div class="saved-deck-console"><div><small>MAZO ACTIVO</small><select id="savedDeckSelect">${deckNames.map(n=>`<option ${n===state.activeDeckName?'selected':''}>${n}</option>`).join('')}</select></div><div><button class="btn" id="createSavedDeck">NUEVO MAZO</button><button class="btn" id="saveCurrentDeck">GUARDAR MAZO</button></div></div>
 <p style="max-width:1100px;margin:0 auto 14px">Las cartas obtenidas de cualquier campaña permanecen en tu inventario. Toca una carta para <b>CANJEARLA</b> entre la Colección y el mazo activo. La carta nunca se borra del inventario.</p>
 <div class="grid inventory-grid">${ownedCards.map(c=>`<button class="card ${state.deck.includes(c.id)?'sel':''}" data-id="${c.id}"><img src="${c.img}"><b>${c.name}</b><small>${cardStats(c)}</small><small>${state.deck.includes(c.id)?'EN MAZO · TOCA PARA QUITAR':'CANJEAR AL MAZO'}</small></button>`).join('')}${emptySlots}</div>
 <div class="deckbar"><button class="btn" id="backMenu">VOLVER</button><button class="btn" id="startFromDeck">EMPEZAR · ${state.deck.length}/11</button></div></section>`;
 document.querySelectorAll('.card[data-id]').forEach(b=>b.onclick=()=>{
   const id=b.dataset.id;
   if(state.deck.includes(id))state.deck=state.deck.filter(x=>x!==id);
   else if(state.deck.length<11)state.deck.push(id);
   else{alert('El mazo puede tener máximo 11 cartas.');return}
   nemesisSaveCurrentDeck();collectionScene()
 });
 savedDeckSelect.onchange=()=>{nemesisSelectDeck(savedDeckSelect.value);collectionScene()};
 createSavedDeck.onclick=()=>{nemesisCreateDeck();collectionScene()};
 saveCurrentDeck.onclick=()=>{nemesisSaveCurrentDeck();toast('Mazo guardado en Memory Card.')};
 backMenu.onclick=menuScene;
 startFromDeck.onclick=()=>{if(!state.deck.length){alert('Selecciona al menos 1 carta.');return}nemesisSaveCurrentDeck();continueCampaign()};
}
const lines=n=>[`Bienvenido, ${n}.`,'Has llegado a las ruinas de un reino que alguna vez desafió el poder de NÉMESIS.','Muchos han entrado buscando gloria.','Muy pocos regresaron.','Si deseas continuar tendrás que demostrar que tus cartas responden a tu voluntad.','Delante de ti se encuentra el primer castillo.'];
function story(name,text,buttons,bg,ch){app.innerHTML=`<section class="story" style="background-image:url('${bg}')"><img class="char" src="${ch}"><div class="dialog"><h2>${name}</h2><div>${text}</div><div class="choices">${buttons}</div></div></section>`}
function tirano(){let l=lines(state.name),last=state.dialog>=l.length-1;story('EL TIRANO',l[state.dialog],`<button class="btn" id="next">${last?'ENTRAR AL CASTILLO':'SIGUIENTE'}</button>`,AS.bg1,AS.tirano);next.onclick=()=>{if(last){state.dialog=0;guardian()}else{state.dialog++;tirano()}}}
function guardian(){let text=state.fear===null?`Soy el GUARDIÁN DE LOS DRAGONES. No te dejaré pasar, ${state.name}. Primero me debes RETAR.`:state.fear?'Mis dragones no conocen la piedad. ¿Aceptas el duelo?':'Entonces regresa cuando tengas el valor de enfrentar a los dragones.';story('GUARDIÁN DE LOS DRAGONES',text,state.fear===null?`<button class="btn" id="yes">RETAR</button><button class="btn" id="no">VOLVER</button>`:`<button class="btn" id="yes">SÍ · DUELO</button><button class="btn" id="no">NO · VOLVER</button>`,AS.bg2,AS.guardian);yes.onclick=()=>{if(state.fear===null){state.fear=true;guardian()}else battle()};no.onclick=()=>{state.fear=false;guardian()}}
function dragonOjoScene(){story('DRAGÓN OJO DEL DIABLO',`Te enfrentarás a mi ira del diablo.<br><small>HP 12000 · MAZO DEL DRAGÓN ${DRAGON_OJO_DECK.length}/${DRAGON_OJO_DECK_SLOTS.length}</small>`,`<button class="btn" id="prepareDragon">INICIAR DUELO</button>`,AS.dragonOjoBg,AS.dragonOjo);prepareDragon.onclick=()=>battle('dragon')}
const IRA_RA_CINEMATIC='assets/videos/ira-de-ra-entrada.mp4';
let iraRaCinematicActive=false,iraRaPreloader=null;
function preloadIraRaCinematic(){if(iraRaPreloader)return;iraRaPreloader=document.createElement('video');iraRaPreloader.preload='auto';iraRaPreloader.playsInline=true;iraRaPreloader.src=IRA_RA_CINEMATIC;iraRaPreloader.load()}
function releaseIraRaVideo(video){try{video.pause();video.removeAttribute('src');video.load();video.remove()}catch{}iraRaCinematicActive=false;iraRaPreloader=null}
function playIraRaCinematic(){
 if(iraRaCinematicActive)return;iraRaCinematicActive=true;
 const scene=document.createElement('section');scene.className='ira-ra-cinematic';scene.innerHTML=`<div class="ira-ra-film"><video id="iraRaVideo" preload="auto" playsinline><source src="${IRA_RA_CINEMATIC}" type="video/mp4"></video><div class="ira-ra-cinematic-shade"></div><div class="ira-ra-cinematic-title"><small>NÉMESIS · JEFE ANCESTRAL</small><b>IRA DE RA</b></div><button id="skipIraRa" class="ira-ra-skip">SALTAR CINEMÁTICA</button></div>`;
 document.body.appendChild(scene);const video=scene.querySelector('#iraRaVideo'),skip=scene.querySelector('#skipIraRa');let completed=false;
 const enterBattle=()=>{if(completed)return;completed=true;scene.classList.add('is-ending');setTimeout(()=>{releaseIraRaVideo(video);scene.remove();battle('ra')},520)};
 video.addEventListener('ended',enterBattle,{once:true});video.addEventListener('error',()=>{console.error('[NÉMESIS] No se pudo reproducir la cinemática de Ira de Ra.');enterBattle()},{once:true});skip.onclick=enterBattle;
 scene.offsetWidth;scene.classList.add('is-playing');video.volume=1;video.muted=false;
 const start=video.play();if(start?.catch)start.catch(()=>{video.muted=true;video.play().catch(enterBattle)});
}
function iraRaScene(){story('IRA DE RA',`Mataste al jefe de los dragones. Muy bien... pero no pasarás de aquí.<br><b>MI IRA NO PODRÁS PARAR.</b><br><small>HP 15000 · MAZO ANCESTRAL ${IRA_RA_BOSS_DECK.length}/15</small>`,`<button class="btn" id="prepareRa">RETAR A IRA DE RA</button>`,AS.iraRaBg,AS.iraRa);preloadIraRaCinematic();prepareRa.onclick=playIraRaCinematic}

// V18.9.50 — estructura de Campaña II.
// No duplica el motor de duelo: conserva la misma colección, mazo, estrellas, Memory Card y sistemas existentes.
function campaign2Intro(){
 state.campaign2Started=true;state.campaign2Unlocked=true;state.campaign2Stage='intro';state.campaignStage='campaign2-intro';save();
 story('CAMPAÑA II',`La primera campaña terminó con la derrota de IRA DE RA.<br><br><b>${esc(state.name)}, tus cartas ganadas, estrellas y mazo permanecen contigo.</b><br><br>Un nuevo camino se abre. Esta campaña continuará sobre la misma partida, sin reiniciar tu progreso.`,`<button class="btn" id="enterCampaign2">ENTRAR A CAMPAÑA II</button><button class="btn" id="campaign2Back">VOLVER AL INICIO</button>`,'assets/images/arena-abismo-premium.webp','assets/images/nemesis-celestial.png');
 enterCampaign2.onclick=()=>{state.campaign2Stage='hub';state.campaignStage='campaign2-hub';save();campaign2Hub()};
 campaign2Back.onclick=menuScene;
}
function campaign2Hub(){
 state.campaign2Started=true;state.campaign2Unlocked=true;state.campaignStage='campaign2-hub';if(state.campaign2Stage==='intro')state.campaign2Stage='caballero-almas';save();
 const reyUnlocked=state.caballeroAlmasDefeated&&!state.reyEspectralDefeated;
 const ghostUnlocked=state.reyEspectralDefeated&&!state.diosFantasmaDefeated;
 app.innerHTML=`<section class="deck campaign-two-hub spectral-hub" style="background-image:linear-gradient(#09031299,#090312dd),url('${AS.caballeroAlmasBg}')"><div class="deckbar"><div><div class="logo" style="font-size:38px">NÉMESIS<small>CAMPAÑA II · DIOS FANTASMA</small></div><small>REINO DE LAS ALMAS</small></div><b>★ ${state.stars||0}</b></div><div class="campaign-progress-card complete"><small>MEMORY CARD ACTIVA</small><b>CAMPAÑA I ✓ · CAMPAÑA II</b><span>Caballero de las Almas ${state.caballeroAlmasDefeated?'✓':'○'} · Rey Espectral ${state.reyEspectralDefeated?'✓':'○'} · Dios Fantasma ○</span><em>${state.owned.length} CARTAS CONSERVADAS</em></div><div class="menu-panel campaign-two-panel"><h2>${reyUnlocked?'REY ESPECTRAL':'CABALLERO DE LAS ALMAS'}</h2><p>${reyUnlocked?'Segundo soberano del Reino Espectral. 25.000 HP, Almas Reales, Decreto del Rey y Corona de la Eternidad. Mazo Modo Bestia activo: primeras 5 cartas definitivas, Almas Reales, resurrección y combos inteligentes.':'Primer guardián del Reino Espectral. Su mazo convierte el Cementerio en un recurso: revive criaturas, acumula almas y se fortalece con cada caída.'}</p></div><div class="menu-actions"><button class="btn" id="campaign2Challenge" ${state.reyEspectralDefeated?'disabled':''}>${state.reyEspectralDefeated?'REY ESPECTRAL DERROTADO':reyUnlocked?'DESAFIAR AL REY ESPECTRAL':state.caballeroAlmasDefeated?'CAMINO AL REY ABIERTO':'ENTRAR AL REINO ESPECTRAL'}</button><button class="btn" id="campaign2Deck">MI COLECCIÓN · ${state.owned.length}/${INVENTORY_CAPACITY}</button><button class="btn" id="campaign2Home">VOLVER AL INICIO</button></div></section>`;
 if(campaign2Challenge){
 campaign2Challenge.disabled=false;
 if(ghostUnlocked){campaign2Challenge.textContent='DESAFIAR AL DIOS FANTASMA';campaign2Challenge.onclick=()=>{if(typeof window.showDiosFantasmaIntro==='function')window.showDiosFantasmaIntro({onWorld:campaign2Hub,onFight:()=>battle('dios-fantasma')});else battle('dios-fantasma')}}
 else campaign2Challenge.onclick=reyUnlocked?reyEspectralScene:caballeroAlmasScene;
}campaign2Deck.onclick=collectionScene;campaign2Home.onclick=menuScene;
}
function caballeroAlmasScene(){
 story('CABALLERO DE LAS ALMAS',`Has derrotado a los dioses del mundo de los vivos...<br><br><b>Pero aquí sus nombres no significan nada.</b><br><br>Cada criatura que destruyas alimentará mi ejército.<br><br>Si buscas al Dios Fantasma... <b>primero tendrás que atravesarme.</b><br><br><small>LOS MUERTOS TAMBIÉN LUCHAN · MAZO ESPECTRAL 10/10</small>`,`<button class="btn" id="challengeSoulKnight">⚔ RETAR</button><button class="btn" id="soulBack">VOLVER</button>`,AS.caballeroAlmasBg,AS.caballeroAlmas);
 challengeSoulKnight.onclick=()=>battle('caballero-almas');soulBack.onclick=campaign2Hub;
}


window.nemesisCampaign2Hub=()=>campaign2Hub();
function reyEspectralScene(){
 story('REY ESPECTRAL',`Has atravesado mi reino...<br><br>Has hecho caer a mi guardián.<br><br><b>Pero aquí no existen victorias. Cada alma que destruyas será mía.</b><br><br>¿Listo para servir al verdadero rey?<br><br><small>LOS MUERTOS ME PERTENECEN · HP 25.000 · MODO BESTIA</small>`,`<button class="btn" id="challengeSpectralKing">♛ RETAR AL REY</button><button class="btn" id="spectralKingBack">VOLVER</button>`,AS.reyEspectralBg,AS.reyEspectral);
 challengeSpectralKing.onclick=()=>battle('rey-espectral');spectralKingBack.onclick=campaign2Hub;
}



// V18.9.69 — HADES · ENTRADA PC ULTRA
window.NEMESIS_HADES={id:'hades',name:'Hades — Rey del Inframundo',hp:32000,maxHp:32000,deckSize:12,resource:'ÓBOLOS DEL INFRAMUNDO',zone:'TÁRTARO',mechanic:'PACTO DEL ESTIGIA',ai:'MODO DIOS II',background:'assets/images/campaign3/hades/hades-tartaro-pc-ultra.png',character:'assets/images/campaign3/hades/hades-personaje.png',status:'HADES_COMPLETO_12_12',
 phases:[{n:1,name:'REY DEL INFRAMUNDO',from:32000,to:21001},{n:2,name:'SEÑOR DEL TÁRTARO',from:21000,to:9001},{n:3,name:'HADES DESENCADENADO',from:9000,to:1}]};
async function hadesAfterAresCinematic(){
 const old=document.getElementById('hades-after-ares');if(old)old.remove();
 const d=document.createElement('div');d.id='hades-after-ares';
 d.innerHTML=`<div class="hades-darkness"></div><div class="hades-bg"></div><div class="hades-rift"></div><div class="hades-ares-fall"><b>ARES</b><span>DIOS DE LA GUERRA · DERROTADO</span></div><img class="hades-god" src="${window.NEMESIS_HADES.character}" alt="Hades"><div class="hades-dialogue"><small id="hadesSpeaker"></small><p id="hadesLine"></p><button id="hadesNext">CONTINUAR</button></div><div class="hades-chapter"><small>CAMPAÑA III · GUERRA DE LOS DIOSES</small><b>CAPÍTULO II</b><strong>HADES — REY DEL INFRAMUNDO</strong><span>32.000 HP · TÁRTARO · ÓBOLOS · IA MODO DIOS II</span><button id="hadesEnter">ENTRAR AL INFRAMUNDO</button></div>`;
 document.body.appendChild(d);requestAnimationFrame(()=>d.classList.add('show'));
 const lines=[['ARES','Imposible... La guerra no debía terminar así...'],['???','¿Terminar?'],['???','Hermano... tu guerra apenas me ha entregado nuevas almas.'],['ARES','...Hades.'],['HADES','Has derrotado al Dios de la Guerra.'],['HADES','Has reunido a los dioses del Olimpo...'],['HADES','Incluso posees el poder para crear al Titán.'],['HADES','Pero hay algo que todavía no comprendes.'],['HADES','Todo dios... toda criatura... toda carta que cae...'],['HADES','termina en MI reino.'],['HADES','Tu Cementerio ya no será un lugar seguro.'],['HADES','Ven al Inframundo.'],['HADES','Y veremos cuánto vale realmente... tu Olimpo.']];
 let i=0,sp=d.querySelector('#hadesSpeaker'),ln=d.querySelector('#hadesLine'),nx=d.querySelector('#hadesNext');
 const paint=()=>{const [a,b]=lines[i];sp.textContent=a;ln.textContent=b;d.classList.toggle('hades-arrives',i>=4);d.classList.toggle('tartarus-opens',i>=9);if(i===1){sfx('thunder');v1892ScreenShake()}if(i===4){sfx('boss');v1892ScreenShake();pcLog('HADES emerge del Tártaro.','effect')}if(i===9){sfx('magic');pcLog('El TÁRTARO se abre. Una presencia espectral es arrastrada fuera del Cementerio.','effect')}};
 nx.onclick=()=>{i++;if(i<lines.length){paint();return}d.classList.add('chapter-mode');nx.style.display='none'};
 d.querySelector('#hadesEnter').onclick=()=>{state.campaign3Stage='hades-intro-complete';state.hadesIntroSeen=true;save();d.classList.add('out');setTimeout(()=>{d.remove();battle('hades')},420)};
 paint()
}
window.nemesisHadesAfterAres=hadesAfterAresCinematic;

function aresCampaign3Scene(){
 if(typeof window.nemesisUnlockCampaign3Ares==='function')window.nemesisUnlockCampaign3Ares();
 if(typeof window.nemesisShowAresIntro==='function'){window.nemesisShowAresIntro({onWorld:menuScene});return}
 story('ARES — DIOS DE LA GUERRA',`CAMPAÑA III · GUERRA DE LOS DIOSES<br><b>30.000 HP · 3 FASES · FURIA DE GUERRA · IA MODO DIOS</b>`,`<button class="btn" id="challengeAres">RETAR A ARES</button>`, 'assets/images/campaign3/ares/ares-arena-pc-ultra.png','assets/images/campaign3/ares/ares-personaje.png');challengeAres.onclick=()=>battle('ares')
}
window.nemesisCampaign3Ares=aresCampaign3Scene;

async function battle(opponent='guardian'){
window.__mgrP={seals:0,flames:0,magicUses:0,mirrorDamageTurn:-1,_battle:Date.now(),_resetPending:false};
window.__mgrE={seals:0,flames:0,magicUses:0,mirrorDamageTurn:-1,_battle:Date.now(),_resetPending:false};
const duelKey=['ra','dragon','caballero-almas','rey-espectral','dios-fantasma','ares','hades'].includes(opponent)?opponent:'guardian';
const isDragon=duelKey==='dragon',isRa=duelKey==='ra',isSoulKnight=duelKey==='caballero-almas',isSpectralKing=duelKey==='rey-espectral',isGhostGod=duelKey==='dios-fantasma',isAres=duelKey==='ares',isHades=duelKey==='hades';
window.NEMESIS_ARES_DUEL_ACTIVE=isAres;if(isAres&&window.NEMESIS_ARES){window.NEMESIS_ARES.fury=0;window.NEMESIS_ARES.hp=30000;}
const enemyDisplayName=isHades?'HADES · REY DEL INFRAMUNDO':isAres?'ARES · DIOS DE LA GUERRA':isGhostGod?'DIOS FANTASMA':isSpectralKing?'REY ESPECTRAL':isSoulKnight?'CABALLERO DE LAS ALMAS':isRa?'IRA DE RA':isDragon?'DRAGÓN OJO DEL DIABLO':'GUARDIÁN DE LOS DRAGONES';
const enemyTurnName=isHades?'HADES':isAres?'ARES':isGhostGod?'DIOS FANTASMA':isSpectralKing?'REY ESPECTRAL':isSoulKnight?'CABALLERO':isRa?'IRA DE RA':isDragon?'DRAGÓN OJO DEL DIABLO':'GUARDIÁN';
const playerMaxHp=10000;
const enemyMaxHp=isHades?32000:isAres?30000:isGhostGod?35000:isSpectralKing?25000:isSoulKnight?18000:isRa?15000:isDragon?12000:10000;
if(isGhostGod){window.__nemesisCelestialEssence=0;window.__nemesisGhostFinal=false;}
if(isSpectralKing){window.__nemesisRoyalSouls=0;window.__nemesisKingCrownUsed=false;window.__nemesisRoyalDecreeUsed=false;}
const guardianDeckIds=GUARDIAN_BOSS_CARD_IDS.slice();
const activeEnemyDeckIds=isHades?HADES_DECK_IDS.slice():isAres?ARES_CARDS.map(c=>c.id):isGhostGod?DIOS_FANTASMA_DECK.slice():isSpectralKing?REY_ESPECTRAL_TEST_DECK.slice():isSoulKnight?CABALLERO_ALMAS_DECK.slice():isRa?IRA_RA_BOSS_DECK.slice():isDragon?DRAGON_OJO_DECK.slice():guardianDeckIds;
const META={
 'payaso-oscuro':{attackName:'RISA DE LA TUMBA',type:'DARK',color:0xa54cff},
 'payaso-ultra':{attackName:'CARCAJADA DEL VACÍO',type:'VOID',color:0xd14cff},
 'demonio-sombra':{attackName:'CORTE DEL ABISMO',type:'DARK',color:0x8d36ff},
 'samurai-trueno':{attackName:'FILO RELÁMPAGO',type:'LIGHTNING',color:0x55a8ff},
 'reina-hielo':{attackName:'PRISIÓN GLACIAL',type:'ICE',color:0x6edcff},
 'angel-caido':{attackName:'JUICIO OSCURO',type:'DARK',color:0xb86dff},
 'angel-caido-epica':{attackName:'JUICIO CELESTIAL',type:'LIGHT',color:0xffe0a3},
 'dragon-infernal':{attackName:'ALIENTO DEL INFIERNO',type:'FIRE',color:0xff5b1f},
 'ares-maldito':{attackName:'DEVASTACIÓN DE ARES',type:'BLOOD',color:0xff2444},
 'dragon-carmesi-caos':{attackName:'ALIENTO CARMESÍ',color:0xff321a},
 'dragon-abisal-nemesis':{attackName:'VÓRTICE ABISAL',color:0xa34cff},
 'dragon-negro-ruinas':{attackName:'SOMBRAS ANCESTRALES',color:0x7527d8},
 'dragon-infernal-sangre':{attackName:'ALIENTO HEMÁTICO',color:0xff2200},
 'fusion-caotico-supremo':{attackName:'ALIENTO CAÓTICO SUPREMO',color:0xd04cff},
 'fusion-dragon-caos':{attackName:'ALIENTO DEL ABISMO CAÓTICO',color:0xff3b25},
 'dios-jupiter':{attackName:'RAYO DEL PADRE DEL CIELO',type:'LIGHTNING',color:0xffe36b},
 'anc-ira-ra':{attackName:'JUICIO DEL SOL',type:'SOLAR',color:0xffb51f},
 'ojo-dragon-jefe':{attackName:'IRA DEL OJO DEL DIABLO',type:'FIRE',color:0xff321f}
};
const boss=card(isGhostGod?'df-serafin-muerte':isSpectralKing?'esp-dragon-abismo':isSoulKnight?'esp-dragon-abismo':isRa?'anc-ira-ra':isDragon?'ojo-dragon-jefe':'dragon-carmesi-caos');
app.innerHTML=`<section class="battle ${isHades?'hades-battle campaign3-battle':isAres?'ares-battle campaign3-battle':isSpectralKing?'spectral-battle spectral-king-battle':isSoulKnight?'spectral-battle':isRa?'ra-battle':isDragon?'dragon-battle':''}"><div id="stage"></div><button class="pc-graphics-button" id="graphicsBtn">◆ PC ULTRA</button><div class="turnphase" id="turnphase">TU TURNO · ROBAR<small>ROBAR · COLOCAR · ACCIÓN · COMBATE · FIN</small></div><div class="boss-phase-badge" id="bossPhaseBadge"><small>JEFE · FASE I</small><b>${enemyDisplayName}</b><span>ESTRATEGIA INICIAL</span></div><div class="battlehud"><div class="enemy"><div class="panel"><b id="ename">${enemyDisplayName} · CARTA OCULTA</b><div class="bar"><div id="ehp" class="fill" style="width:100%"></div></div><small id="etxt">HP ${enemyMaxHp}/${enemyMaxHp}</small></div></div><div class="player"><div class="panel"><b>${state.name}</b><div class="bar"><div id="php" class="fill" style="width:100%"></div></div><small id="ptxt">HP ${playerMaxHp}/${playerMaxHp}</small></div></div></div><div class="actions hidden" id="battleActions"><button class="btn" id="atk">ATACAR</button><button class="btn" id="def">DEFENDER</button><button class="btn skill-action" id="skill">HABILIDAD</button><button class="btn player-power" id="playerPower">PODER NÉMESIS</button><button class="btn" id="fus">FUSIÓN</button></div><div class="duelzones"><span>${enemyTurnName} · MONSTRUOS</span><span>${enemyTurnName} · MÁGICAS</span><span>TÚ · MÁGICAS</span><span>TÚ · MONSTRUOS</span></div><div class="graveui enemygrave" id="enemygrave">☠ CEMENTERIO RIVAL <b>0</b></div><div class="graveui playergrave" id="playergrave">☠ TU CEMENTERIO <b>0</b></div><div class="targetbanner hidden" id="targetbanner">SELECCIONA EL OBJETIVO</div><div class="pc-deck-counters"><div><small>MAZO RIVAL</small><b id="enemyDeckCount">0</b></div><div><small>CEMENTERIO RIVAL</small><b id="enemyGraveCount">0</b></div><div><small>TURNO</small><b id="pcTurnCount">1</b></div><div><small>TU CEMENTERIO</small><b id="playerGraveCount">0</b></div><div><small>TU MAZO</small><b id="playerDeckCount">0</b></div></div><aside class="pc-card-preview" id="pcCardPreview"><img id="pcPreviewImg" alt="Vista ampliada de carta"><div><small>INSPECCIÓN PC</small><b id="pcPreviewName">PASA EL MOUSE SOBRE UNA CARTA</b><span id="pcPreviewStats">ATK · DEF · EFECTO</span><strong id="pcPreviewAbility">HABILIDAD</strong><p id="pcPreviewHistory">Historia y efecto estratégico de la carta.</p></div></aside><aside class="pc-duel-log"><header><b>REGISTRO DEL DUELO</b><button id="pcClearLog" title="Limpiar registro">×</button></header><ol id="pcDuelLog"></ol></aside><div class="pc-bonus-layer" id="pcBonusLayer"></div><div class="pc-player-ability"><small>HABILIDAD DE ${esc(state.name)}</small><b>IMPULSO NÉMESIS</b><span>+800 ATK · RECARGA 2 TURNOS</span></div><div class="pc-equipment-slots"><div><b>EQUIPO RIVAL</b><span>⚔ ARMA</span><span>⬟ ARMADURA</span><span>◆ RELIQUIA</span></div><div><b>TU EQUIPO</b><span>⚔ ARMA</span><span>⬟ ARMADURA</span><span>◆ RELIQUIA</span></div></div><div class="pc-permanent-labels"><span>ALTAR RIVAL</span><span>RELIQUIA RIVAL</span><span>RELIQUIA PROPIA</span><span>ALTAR PROPIO</span></div><button class="pc-fullscreen" id="pcFullscreen" title="Pantalla completa">⛶</button><div class="hint3d" id="hint3d">Selecciona una carta de tu mano y luego toca un slot del tablero.</div><div class="cardinfo panel" id="cardinfo"><b>SELECCIONA CARTA</b><small>ATK / DEF / EFECTO</small></div><div class="hand" id="hand">${state.deck.slice(0,5).map(id=>`<img data-id="${id}" src="${card(id).img}">`).join('')}</div></section>`;
const skillBtn=document.getElementById('skill'),playerPowerBtn=document.getElementById('playerPower');
let THREE;try{THREE=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js')}catch(e){stage.innerHTML='<div style="padding:30px;color:#fff">No se pudo iniciar WebGL/Three.js.</div>';return}
const scene=new THREE.Scene();scene.background=null;scene.fog=new THREE.FogExp2((isSoulKnight||isSpectralKing)?0x16052b:0x110916,(isSoulKnight||isSpectralKing)?.020:.012);const cam=new THREE.PerspectiveCamera(47,innerWidth/innerHeight,.1,130);cam.position.set(0,19,27);const look=new THREE.Vector3(0,0,-1),camGoal=cam.position.clone(),lookGoal=look.clone();
const r=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});r.setPixelRatio(Math.min(devicePixelRatio,1.5));r.setSize(innerWidth,innerHeight);r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;r.outputColorSpace=THREE.SRGBColorSpace;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.18;stage.appendChild(r.domElement);
// Límite seguro para texturas de cartas. Siempre existe antes de crear el primer mesh.
let graphicsAnisotropy=Math.min(16,r.capabilities.getMaxAnisotropy());
const GRAPHICS_PROFILES={
 MEDIA:{label:'MEDIA',pixel:1,shadow:512,anisotropy:4,exposure:1.05,particles:.65},
 ALTA:{label:'ALTA',pixel:1.35,shadow:1024,anisotropy:8,exposure:1.15,particles:1},
 ULTRA:{label:'ULTRA',pixel:1.75,shadow:2048,anisotropy:16,exposure:1.24,particles:1.45}
};
let graphicsMode=localStorage.getItem('nemesis_pc_graphics_v2')||'ULTRA';
if(!GRAPHICS_PROFILES[graphicsMode])graphicsMode='ULTRA';
let graphicsParticleMultiplier=GRAPHICS_PROFILES[graphicsMode].particles;
let pcResolution=localStorage.getItem('nemesis_pc_resolution')||'1080',pcFpsLimit=localStorage.getItem('nemesis_pc_fps')||'60';
let pcShadows=localStorage.getItem('nemesis_pc_shadows')!=='off',pcParticles=localStorage.getItem('nemesis_pc_particles')!=='off',pcReflections=localStorage.getItem('nemesis_pc_reflections')!=='off',pcCinematicCamera=localStorage.getItem('nemesis_pc_camera')!=='off';
const PC_RESOLUTION_SCALE={1080:1,1440:1.333,2160:2};
scene.add(new THREE.HemisphereLight(isSoulKnight?0x8d70ff:0xc09bff,isSoulKnight?0x080311:0x1d090d,isSoulKnight?1.55:1.9));const key=new THREE.DirectionalLight(isSoulKnight?0xb7c9ff:0xffe2cf,isSoulKnight?1.72:2.15);key.position.set(6,18,12);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);const violet=new THREE.PointLight(isSoulKnight?0x692cff:0x8734ff,isSoulKnight?88:72,35,2),red=new THREE.PointLight(isSoulKnight?0x21c8ff:0xff294b,isSoulKnight?58:62,32,2);violet.position.set(-10,6,-3);red.position.set(10,6,-4);scene.add(violet,red);
function applyGraphicsProfile(mode,notify=true){
 const p=GRAPHICS_PROFILES[mode]||GRAPHICS_PROFILES.ULTRA;graphicsMode=mode;
 const requestedPixel=p.pixel*PC_RESOLUTION_SCALE[pcResolution];
 // V18.9.45: Ira de Ra conserva la calidad seleccionada, pero limita el coste interno
 // de render para evitar caídas severas de FPS en su escenario más pesado.
 const bossPixelCap=isRa?1.35:Infinity;
 r.setPixelRatio(Math.min(devicePixelRatio,requestedPixel,bossPixelCap));r.setSize(innerWidth,innerHeight);r.toneMappingExposure=p.exposure;
 r.shadowMap.enabled=pcShadows;graphicsParticleMultiplier=pcParticles?p.particles*(isRa?.72:1):0;document.querySelector('.battle')?.classList.toggle('pc-no-reflections',!pcReflections);
 const safeShadow=isRa?Math.min(p.shadow,1024):p.shadow;key.shadow.mapSize.set(safeShadow,safeShadow);key.shadow.map?.dispose?.();graphicsAnisotropy=Math.min(p.anisotropy,r.capabilities.getMaxAnisotropy());
 document.querySelector('.battle')?.setAttribute('data-graphics',mode);document.getElementById('graphicsBtn').textContent=`◆ PC ${p.label}`;
 localStorage.setItem('nemesis_pc_graphics_v2',mode);if(notify)toast(`Calidad gráfica ${p.label} activada.`)
}
function openGraphicsPanel(){
 const old=document.getElementById('graphicsPanel');if(old){old.remove();return}
 const panel=document.createElement('div');panel.id='graphicsPanel';panel.className='graphics-panel';panel.innerHTML=`<div class="graphics-dialog pc-settings"><button class="graphics-close" aria-label="Cerrar">×</button><h2>PC ULTRA</h2><p>Gráficos, rendimiento y sonido del duelo.</p><div class="graphics-options">${Object.keys(GRAPHICS_PROFILES).map(k=>`<button data-mode="${k}" class="${k===graphicsMode?'active':''}"><b>${GRAPHICS_PROFILES[k].label}</b><small>${GRAPHICS_PROFILES[k].shadow}px sombras · ${GRAPHICS_PROFILES[k].anisotropy}x</small></button>`).join('')}</div><div class="pc-setting-grid"><label>RESOLUCIÓN<select id="pcResolution"><option value="1080">1080p</option><option value="1440">1440p</option><option value="2160">4K</option></select></label><label>LÍMITE FPS<select id="pcFps"><option value="30">30 FPS</option><option value="60">60 FPS</option><option value="120">120 FPS</option><option value="0">ILIMITADOS</option></select></label></div><div class="pc-toggle-grid"><label><input id="pcShadows" type="checkbox"> Sombras</label><label><input id="pcParticles" type="checkbox"> Partículas</label><label><input id="pcReflections" type="checkbox"> Reflejos</label><label><input id="pcCamera" type="checkbox"> Cámara cinematográfica</label><label><input id="graphicsAuto" type="checkbox" ${localStorage.getItem('nemesis_pc_auto')!=='off'?'checked':''}> Ajuste automático</label></div><h3>SONIDO</h3><label>Música <input id="pcMusicVolume" type="range" min="0" max="100" value="${localStorage.getItem('nemesis_music_volume')||45}"></label><label>Voces <input id="pcVoiceVolume" type="range" min="0" max="100" value="${localStorage.getItem('nemesis_voice_volume')||70}"></label><label>Efectos <input id="pcFxVolume" type="range" min="0" max="100" value="${localStorage.getItem('nemesis_fx_volume')||75}"></label><div class="pc-performance-readout"><small id="graphicsFps">FPS: calculando…</small><small id="pcGpuMemory">MEMORIA GRÁFICA: calculando…</small></div></div>`;
 panel.querySelector('.graphics-close').onclick=()=>panel.remove();panel.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{applyGraphicsProfile(b.dataset.mode);panel.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x===b))});const res=panel.querySelector('#pcResolution'),fps=panel.querySelector('#pcFps');res.value=pcResolution;fps.value=pcFpsLimit;res.onchange=e=>{pcResolution=e.target.value;localStorage.setItem('nemesis_pc_resolution',pcResolution);applyGraphicsProfile(graphicsMode)};fps.onchange=e=>{pcFpsLimit=e.target.value;localStorage.setItem('nemesis_pc_fps',pcFpsLimit)};for(const [id,key] of [['pcShadows','shadows'],['pcParticles','particles'],['pcReflections','reflections'],['pcCamera','camera']]){const el=panel.querySelector('#'+id);el.checked=({shadows:pcShadows,particles:pcParticles,reflections:pcReflections,camera:pcCinematicCamera})[key];el.onchange=e=>{if(key==='shadows')pcShadows=e.target.checked;if(key==='particles')pcParticles=e.target.checked;if(key==='reflections')pcReflections=e.target.checked;if(key==='camera')pcCinematicCamera=e.target.checked;localStorage.setItem('nemesis_pc_'+key,e.target.checked?'on':'off');applyGraphicsProfile(graphicsMode,false)}}panel.querySelector('#graphicsAuto').onchange=e=>localStorage.setItem('nemesis_pc_auto',e.target.checked?'on':'off');for(const [id,key] of [['pcMusicVolume','music'],['pcVoiceVolume','voice'],['pcFxVolume','fx']])panel.querySelector('#'+id).oninput=e=>pcSetAudioVolume(key,e.target.value/100);document.body.appendChild(panel)
}
document.getElementById('graphicsBtn').onclick=openGraphicsPanel;applyGraphicsProfile(graphicsMode,false);
document.getElementById('pcFullscreen').onclick=requestNemesisFullscreen;
const floor=new THREE.Mesh(new THREE.BoxGeometry(25,1.6,27),new THREE.MeshStandardMaterial({color:0x383040,roughness:.72,metalness:.16,transparent:true,opacity:0}));floor.position.y=-.8;floor.receiveShadow=true;scene.add(floor);const top=new THREE.Mesh(new THREE.BoxGeometry(23,.35,24.8),new THREE.MeshStandardMaterial({color:0x57485d,roughness:.82,metalness:.08,transparent:true,opacity:0}));top.position.y=.15;top.receiveShadow=true;scene.add(top);for(let z=-11;z<=11;z+=4)for(let x=-10;x<=10;x+=4){const tile=new THREE.Mesh(new THREE.BoxGeometry(3.6,.14,3.5),new THREE.MeshStandardMaterial({color:(x+z)%8===0?0x594a60:0x453a4a,roughness:.94,transparent:true,opacity:0}));tile.position.set(x,.38,z);scene.add(tile)}
const center=new THREE.Mesh(new THREE.TorusGeometry(4.2,.18,12,72),new THREE.MeshBasicMaterial({color:0xb657ff}));center.rotation.x=Math.PI/2;center.position.y=.55;center.visible=false;scene.add(center);const center2=new THREE.Mesh(new THREE.TorusGeometry(2.4,.08,10,64),new THREE.MeshBasicMaterial({color:0xff4468}));center2.rotation.x=Math.PI/2;center2.position.y=.57;center2.visible=false;scene.add(center2);
const pcLava=[],pcFloatingRuins=[],pcTorches=[],pcElementSystems=[];let pcSolarRay=null;
for(const x of [-11.4,11.4])for(const z of [-10.5,0,10.5]){const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.7,1,6.6,8),new THREE.MeshStandardMaterial({color:0x332c37,roughness:.75}));shaft.position.set(x,3.4,z);shaft.castShadow=true;shaft.visible=false;scene.add(shaft)}const portal=new THREE.Mesh(new THREE.TorusGeometry(2.8,.3,16,64),new THREE.MeshStandardMaterial({color:0x7027ad,emissive:0x7d2cff,emissiveIntensity:3}));portal.position.set(0,4,-13);portal.visible=false;scene.add(portal);
const SLOT_X=[-7.2,-3.6,0,3.6,7.2],PZ=7.15,EZ=-7.15,slotMeshes=[],board={p:Array(5).fill(null),e:Array(5).fill(null)};/* Slots de interacción invisibles: el tablero Llamas del Caos ya dibuja las zonas visuales. */for(const side of ['p','e'])for(let i=0;i<5;i++){const z=side==='p'?PZ:EZ;const m=new THREE.Mesh(new THREE.PlaneGeometry(3.35,4.75),new THREE.MeshBasicMaterial({color:side==='p'?0x5b35a8:0xa52a45,transparent:true,opacity:.10,depthWrite:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(SLOT_X[i],.7,z);m.userData={slot:true,side,index:i};scene.add(m);slotMeshes.push(m);const edge=new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),new THREE.LineBasicMaterial({color:side==='p'?0xb47aff:0xff667e,transparent:true,opacity:.48}));edge.rotation.copy(m.rotation);edge.position.copy(m.position);edge.userData={slotGuide:true,side,index:i};scene.add(edge);m.userData.edge=edge}
// Zonas estratégicas adicionales: visuales y aisladas del motor lógico existente.
const pcStrategicZones=new THREE.Group();scene.add(pcStrategicZones);
for(const side of ["p","e"]){
 const z=side==="p"?3.25:-3.25,color=side==="p"?0x36c9ba:0xe09b3c;
 for(let i=0;i<5;i++){const zone=new THREE.Mesh(new THREE.PlaneGeometry(2.55,1.35),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.075,side:THREE.DoubleSide,depthWrite:false}));zone.rotation.x=-Math.PI/2;zone.position.set(SLOT_X[i],.54,z);pcStrategicZones.add(zone);const edge=new THREE.LineSegments(new THREE.EdgesGeometry(zone.geometry),new THREE.LineBasicMaterial({color,transparent:true,opacity:.34}));edge.rotation.copy(zone.rotation);edge.position.copy(zone.position);pcStrategicZones.add(edge)}
 const permanentZ=side==="p"?5.15:-5.15;
 for(const x of [-10.15,10.15]){const ring=new THREE.Mesh(new THREE.RingGeometry(.72,1.05,6),new THREE.MeshBasicMaterial({color:0xffcc68,transparent:true,opacity:.32,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.set(x,.56,permanentZ);pcStrategicZones.add(ring)}
}
const pcAttackLineGeometry=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]);
const pcAttackLine=new THREE.Line(pcAttackLineGeometry,new THREE.LineBasicMaterial({color:0xff334f,transparent:true,opacity:.95,depthTest:false}));pcAttackLine.visible=false;pcAttackLine.renderOrder=30;scene.add(pcAttackLine);
function pcSetAttackLine(targetIndex){if(phase!=="TARGET"||active<0||!playerCards[active]||!enemyCards[targetIndex]){pcAttackLine.visible=false;return}const a=pos("p",active),b=pos("e",targetIndex);a.y=2.15;b.y=2.15;pcAttackLine.geometry.setFromPoints([a,b]);pcAttackLine.visible=true}
function pcEquipmentShape(kind='weapon',material){
 const item=new THREE.Group();
 if(kind==='armor'){
  const chest=new THREE.Mesh(new THREE.BoxGeometry(.58,.72,.18),material),left=new THREE.Mesh(new THREE.BoxGeometry(.22,.34,.2),material),right=left.clone();chest.scale.x=.82;left.position.set(-.43,.16,0);right.position.set(.43,.16,0);item.add(chest,left,right);
 }else if(kind==='relic'){
  const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.27,1),material),ring=new THREE.Mesh(new THREE.TorusGeometry(.43,.055,8,28),material);ring.rotation.x=Math.PI/2;item.add(core,ring);
 }else{
  const blade=new THREE.Mesh(new THREE.BoxGeometry(.12,1.18,.1),material),tip=new THREE.Mesh(new THREE.ConeGeometry(.12,.28,5),material),guard=new THREE.Mesh(new THREE.BoxGeometry(.58,.1,.14),material),grip=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.42,8),material);blade.position.y=.22;tip.position.y=.95;guard.position.y=-.35;grip.position.y=-.58;item.add(blade,tip,guard,grip);item.rotation.z=-.58;
 }
 return item
}
function pcEquipVisual(cardGroup,kind='weapon',label='EQUIPO',temporary=false){
 if(!cardGroup)return;cardGroup.userData.equipment=cardGroup.userData.equipment||{};
 if(cardGroup.userData.equipment[label])return cardGroup.userData.equipment[label];
 const group=new THREE.Group(),color=kind==='armor'?0xf2c86d:kind==='relic'?0x72e8ff:0xffb64b;
 const mat=new THREE.MeshPhysicalMaterial({color,emissive:kind==='relic'?0x159aaa:0x8b4800,emissiveIntensity:1.25,metalness:.9,roughness:.14,clearcoat:1});
 const item=pcEquipmentShape(kind,mat);item.position.set(1.82,.42,.72);item.castShadow=true;
 const lineGeo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(.92,.18,.32),item.position.clone()]);
 const line=new THREE.Line(lineGeo,new THREE.LineBasicMaterial({color,transparent:true,opacity:.9,depthTest:false}));line.renderOrder=25;
 const halo=new THREE.Mesh(new THREE.RingGeometry(.36,.48,24),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.5,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthTest:false}));halo.position.copy(item.position);halo.position.z-=.03;
 group.add(item,line,halo);group.scale.set(.01,.01,.01);group.userData={kind,label,temporary,item,halo};cardGroup.add(group);cardGroup.userData.equipment[label]=group;sfx('equip');
 if(window.gsap){gsap.to(group.scale,{x:1,y:1,z:1,duration:.4,ease:'back.out(1.8)'});gsap.fromTo(item.rotation,{y:-1.2},{y:0,duration:.48,ease:'power2.out'})}else group.scale.set(1,1,1);
 pcLog(`${label} equipado físicamente.`,'effect');pcUpdateEquipmentHud();return group
}
function pcRemoveEquipment(cardGroup,label,broken=false){
 const eq=cardGroup?.userData?.equipment?.[label];if(!eq)return;delete cardGroup.userData.equipment[label];
 const done=()=>{try{cardGroup.remove(eq)}catch{}pcUpdateEquipmentHud()};
 if(broken){const wp=new THREE.Vector3();eq.getWorldPosition(wp);burst(wp,0xffc75a,isRa?12:24);sfx('destroy')}
 if(window.gsap)gsap.to(eq.scale,{x:.01,y:.01,z:.01,duration:.25,ease:'power2.in',onComplete:done});else done()
}

// V18.9.62 — SISTEMA CENTRAL DE EQUIPAMIENTO
// Una criatura puede mantener simultáneamente 1 ARMA + 1 ARMADURA + 1 RELIQUIA.
// Todos los equipos nuevos deben pasar por estas funciones para conservar bonificaciones,
// destrucción, Cementerio y representación física 3D.
function nemesisEquipmentSlots(c){
 if(!c)return null;
 c._equipmentSlots=c._equipmentSlots||{weapon:null,armor:null,relic:null};
 return c._equipmentSlots;
}
function nemesisEquipmentGrave(side){return side==='p'?playerGrave:enemyGrave}
function nemesisUnequip(side,i,kind,{broken=false,toGrave=true,reason=''}={}){
 const arr=side==='p'?playerCards:enemyCards,c=arr?.[i],slots=nemesisEquipmentSlots(c);
 if(!c||!slots||!slots[kind])return false;
 const eq=slots[kind];
 if(eq.atkBonus)c.atk=Math.max(0,(c.atk||0)-eq.atkBonus);
 if(eq.defBonus)c.def=Math.max(0,(c.def||0)-eq.defBonus);
 if(eq.flag)delete c[eq.flag];
 if(kind==='weapon'&&eq.sourceEffect==='undyingKingSword'){delete c._undyingSword;delete c._undyingSwordSoulBonus}
 if(kind==='relic'&&eq.sourceEffect==='thousandSoulCrown'){delete c._thousandCrown;delete c._thousandCrownSoulBonus}
 if(kind==='relic'&&eq.sourceEffect==='condemnedCrown')delete c._condemnedCrown;
 pcRemoveEquipment(board?.[side]?.[i],eq.label,broken);
 if(toGrave&&eq.sourceCard){nemesisEquipmentGrave(side).push({...eq.sourceCard,_wasEquipment:true})}
 slots[kind]=null;
 if(reason)pcLog(`${eq.label}: ${reason}.`,'effect');
 updatePcStrategicHud();pcUpdateEquipmentHud();return true
}
function nemesisEquip(side,i,kind,sourceCard,opts={}){
 const arr=side==='p'?playerCards:enemyCards,c=arr?.[i];
 if(!c||!['weapon','armor','relic'].includes(kind))return false;
 const slots=nemesisEquipmentSlots(c);
 if(slots[kind])nemesisUnequip(side,i,kind,{broken:true,toGrave:true,reason:`reemplazado por ${sourceCard?.name||'nuevo equipo'}`});
 const meta={
  kind,label:opts.label||sourceCard?.name||kind.toUpperCase(),
  sourceId:sourceCard?.id||null,sourceEffect:sourceCard?.effect||null,
  sourceCard:sourceCard?{...sourceCard}:null,
  atkBonus:Number(opts.atkBonus||0),defBonus:Number(opts.defBonus||0),
  temporary:!!opts.temporary,expiresTurn:opts.expiresTurn??null,flag:opts.flag||null
 };
 if(meta.atkBonus){c.atk=(c.atk||0)+meta.atkBonus;olympusNotifyAttackIncrease(side,meta.atkBonus)}
 if(meta.defBonus)c.def=(c.def||0)+meta.defBonus;
 if(meta.flag)c[meta.flag]=true;
 slots[kind]=meta;
 pcEquipVisual(board?.[side]?.[i],kind,meta.label,meta.temporary);
 pcLog(`${meta.label} ocupa la ranura ${kind==='weapon'?'ARMA':kind==='armor'?'ARMADURA':'RELIQUIA'} de ${c.name}.`,'effect');
 update();return true
}
function nemesisBreakAllEquipment(side,i){
 const arr=side==='p'?playerCards:enemyCards,c=arr?.[i],slots=nemesisEquipmentSlots(c);
 if(!slots)return;
 for(const kind of ['weapon','armor','relic'])if(slots[kind])nemesisUnequip(side,i,kind,{broken:true,toGrave:true,reason:'destruido junto a la criatura'})
}
function nemesisExpireEquipment(){
 for(const side of ['p','e']){
  const arr=side==='p'?playerCards:enemyCards;
  arr.forEach((c,i)=>{
   const slots=nemesisEquipmentSlots(c);if(!slots)return;
   for(const kind of ['weapon','armor','relic']){
    const eq=slots[kind];
    if(eq&&eq.expiresTurn!=null&&turnNo>eq.expiresTurn)nemesisUnequip(side,i,kind,{broken:false,toGrave:true,reason:'efecto finalizado'})
   }
  })
 }
}

function pcClearTemporaryEquipment(){for(const side of ['p','e'])for(let i=0;i<5;i++){const g=board[side]?.[i];if(!g?.userData?.equipment)continue;Object.entries({...g.userData.equipment}).forEach(([label,eq])=>{if(eq?.userData?.temporary)pcRemoveEquipment(g,label,false)})}}
function pcUpdateEquipmentHud(){
 const panels=[...document.querySelectorAll('.pc-equipment-slots>div')];if(panels.length<2)return;
 [['e',panels[0]],['p',panels[1]]].forEach(([side,panel])=>{const found={weapon:[],armor:[],relic:[]};for(let i=0;i<5;i++){const g=board[side]?.[i];Object.values(g?.userData?.equipment||{}).forEach(eq=>{if(eq?.userData?.kind)found[eq.userData.kind].push(eq.userData.label)})}const spans=panel.querySelectorAll('span');[['weapon','⚔ ARMA'],['armor','⬟ ARMADURA'],['relic','◆ RELIQUIA']].forEach(([k,t],j)=>{if(spans[j]){spans[j].textContent=found[k].length?`${t}: ${found[k].join(' / ')}`:t;spans[j].classList.toggle('equipped',!!found[k].length)}})})
}
function pcApplyCardEquipment(side,i,c){const g=board[side]?.[i];if(!g||!c)return;if(c.id==='anc-ojo-ra'||c.id==='anc-lanza-solar'||c.id==='anc-lanza-bronce')pcEquipVisual(g,'weapon',c.name);if(c.id==='anc-cetro-was'||c.id==='anc-fragmento-esencia')pcEquipVisual(g,'relic',c.name);if(c._armorRa)pcEquipVisual(g,'armor','Armadura de Ra')}


const loader=new THREE.TextureLoader();function backTexture(){const c=document.createElement('canvas');c.width=256;c.height=356;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,256,356);g.addColorStop(0,'#07020e');g.addColorStop(.5,'#2e084d');g.addColorStop(1,'#07020e');x.fillStyle=g;x.fillRect(0,0,256,356);x.strokeStyle='#b05bff';x.lineWidth=8;x.strokeRect(10,10,236,336);x.font='900 27px Georgia';x.textAlign='center';x.fillStyle='#f0dfff';x.shadowBlur=14;x.shadowColor='#9b3cff';x.fillText('NÉMESIS',128,178);x.font='700 13px Georgia';x.fillStyle='#c38ae9';x.fillText('CARD BATTLE',128,201);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}const backTex=backTexture();
function cardMesh(c){const g=new THREE.Group();g.userData.card=c;g.userData.faceDown=true;const geo=new THREE.PlaneGeometry(2.62,3.72),frontTex=loader.load(c.img);frontTex.colorSpace=THREE.SRGBColorSpace;frontTex.anisotropy=Math.min(graphicsAnisotropy,r.capabilities.getMaxAnisotropy());const frontMat=new THREE.MeshPhysicalMaterial({map:frontTex,side:THREE.FrontSide,roughness:.3,metalness:.08,clearcoat:.72,clearcoatRoughness:.16,emissive:0x110916,emissiveIntensity:.12}),backMat=new THREE.MeshStandardMaterial({map:backTex,side:THREE.FrontSide,roughness:.38,metalness:.08});const front=new THREE.Mesh(geo,frontMat);front.position.z=.07;front.castShadow=true;const back=new THREE.Mesh(geo,backMat);back.position.z=-.07;back.rotation.y=Math.PI;back.castShadow=true;const frameMat=new THREE.MeshPhysicalMaterial({color:0x4a1b66,emissive:0x6a23a0,emissiveIntensity:.45,metalness:.72,roughness:.2,clearcoat:.8});const topF=new THREE.Mesh(new THREE.BoxGeometry(2.76,.07,.12),frameMat),botF=topF.clone(),leftF=new THREE.Mesh(new THREE.BoxGeometry(.07,3.88,.12),frameMat),rightF=leftF.clone();topF.position.y=1.94;botF.position.y=-1.94;leftF.position.x=-1.36;rightF.position.x=1.36;[topF,botF,leftF,rightF].forEach(x=>{x.castShadow=true;g.add(x)});g.add(front,back);g.rotation.x=Math.PI/2;g.rotation.y=0;g.rotation.z=0;g.userData.front=front;g.userData.back=back;const rare=c.ancestral||c.special||c.rarity==='epic'||c.type==='fusion';if(rare){const aura=new THREE.Mesh(new THREE.PlaneGeometry(2.96,4.08),new THREE.MeshBasicMaterial({color:c.ancestral?0xffbf4a:0xb657ff,transparent:true,opacity:.52,wireframe:true,depthTest:false,blending:THREE.AdditiveBlending}));aura.position.z=.2;aura.renderOrder=11;g.add(aura);g.userData.aura=aura;const glow=new THREE.PointLight(c.ancestral?0xffbd55:0xb657ff,12,4,2);glow.position.z=.28;g.add(glow);g.userData.glow=glow}return g}
const tweens=[];
function twVec(obj,to,d=450){return new Promise(res=>{let done=false;const finish=()=>{if(done)return;done=true;try{obj.copy(to)}catch{}res()};tweens.push({kind:'v',obj,from:obj.clone(),to:to.clone(),start:performance.now(),d,res:finish});setTimeout(finish,d+900)})}
function twNum(obj,k,to,d=450){return new Promise(res=>{let done=false;const finish=()=>{if(done)return;done=true;try{obj[k]=to}catch{}res()};tweens.push({kind:'n',obj,k,from:obj[k],to,start:performance.now(),d,res:finish});setTimeout(finish,d+900)})}
const wait=ms=>new Promise(q=>setTimeout(q,ms));
async function guardStep(promise,ms=3000,label='animación'){let timer;try{return await Promise.race([promise,new Promise((_,rej)=>timer=setTimeout(()=>rej(new Error('Timeout '+label)),ms))])}finally{clearTimeout(timer)}}
function camTo(p,t,d=520){
 camGoal.copy(p);lookGoal.copy(t);
 const dur=Math.max(180,Math.min(d,780));
 return Promise.all([twVec(cam.position,p,dur),twVec(look,t,dur)]).then(()=>{cam.position.copy(p);look.copy(t);cam.lookAt(look)});
}
function pos(side,i){return new THREE.Vector3(SLOT_X[i],1.05,side==='p'?PZ:EZ)}

const v1892ShockMat=new THREE.MeshBasicMaterial({
 color:0xc05cff,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false
});
const v1892Shock=new THREE.Mesh(new THREE.RingGeometry(.45,.62,48),v1892ShockMat);
v1892Shock.rotation.x=-Math.PI/2;
v1892Shock.visible=false;
scene.add(v1892Shock);

function v1892FinalTransform(side,i,mode='ATAQUE'){
 const p=pos(side,i);
 return {
  x:p.x,
  y:mode==='DEFENSA'?.62:1.05,
  z:p.z,
  rotX:-Math.PI/2,
  rotY:0,
  rotZ:mode==='DEFENSA'?Math.PI/2:0,
  scale:.94
 };
}
function v1892ResetCardTransform(g,side,i,mode='ATAQUE'){
 if(!g)return;
 const q=v1892FinalTransform(side,i,mode);
 g.rotation.set(q.rotX,q.rotY,q.rotZ);
 g.position.set(q.x,q.y,q.z);
 g.scale.set(q.scale,q.scale,q.scale);
 g.userData.v182BaseY=q.y;
}
function v1892Shockwave(x,z,color=0xc05cff){
 try{
  v1892Shock.material.color.setHex(color);
  v1892Shock.position.set(x,.28,z);
  v1892Shock.scale.set(1,1,1);
  v1892Shock.material.opacity=.78;
  v1892Shock.visible=true;
  if(window.gsap){
   gsap.killTweensOf(v1892Shock.scale);
   gsap.killTweensOf(v1892Shock.material);
   gsap.to(v1892Shock.scale,{x:8,y:8,z:8,duration:.38,ease:'power1.out'});
   gsap.to(v1892Shock.material,{opacity:0,duration:.38,ease:'power1.out',onComplete:()=>v1892Shock.visible=false});
  }else{
   setTimeout(()=>{v1892Shock.visible=false;v1892Shock.material.opacity=0},400);
  }
 }catch(e){}
}
function v1892ScreenShake(){
 if(!window.gsap||!cam||enAnimacionGSAP)return;
 const y=cam.position.y;
 const tl=gsap.timeline();
 tl.to(cam.position,{y:y-.16,duration:.045,yoyo:true,repeat:3,ease:'none'})
   .to(cam.position,{y:y,duration:.05,ease:'none'});
}

const particles=[];function burst(p,color=0xb657ff,count=28){if(!pcParticles||graphicsParticleMultiplier<=0)return;count=Math.max(8,Math.round(count*graphicsParticleMultiplier));const a=[];for(let i=0;i<count;i++)a.push(p.x+(Math.random()-.5)*.7,p.y+Math.random()*1.8,p.z+(Math.random()-.5)*.7);const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(a,3));const mat=new THREE.PointsMaterial({color,size:.18,transparent:true,opacity:1,depthWrite:false});const q=new THREE.Points(geo,mat);q.userData.birth=performance.now();scene.add(q);particles.push(q)}
let pcAudio=null,pcMusicTimer=0;function pcAudioInit(){try{if(pcAudio)return pcAudio;const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;const ctx=window.__nemAudio=window.__nemAudio||new A(),master=ctx.createGain(),music=ctx.createGain(),voice=ctx.createGain(),fx=ctx.createGain();music.connect(master);voice.connect(master);fx.connect(master);master.connect(ctx.destination);pcAudio={ctx,master,music,voice,fx};pcSetAudioVolume('music',(localStorage.getItem('nemesis_music_volume')||45)/100);pcSetAudioVolume('voice',(localStorage.getItem('nemesis_voice_volume')||70)/100);pcSetAudioVolume('fx',(localStorage.getItem('nemesis_fx_volume')||75)/100);return pcAudio}catch{return null}}
function pcSetAudioVolume(type,value){localStorage.setItem(`nemesis_${type}_volume`,Math.round(value*100));const a=pcAudioInit();if(a?.[type])a[type].gain.setTargetAtTime(value,a.ctx.currentTime,.03)}
function pcTone(freq,duration=.22,type='sine',bus='fx',volume=.075){const a=pcAudioInit();if(!a)return;try{if(a.ctx.state==='suspended')a.ctx.resume();const o=a.ctx.createOscillator(),g=a.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,a.ctx.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(32,freq*.48),a.ctx.currentTime+duration);g.gain.setValueAtTime(volume,a.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.ctx.currentTime+duration);o.connect(g);g.connect(a[bus]);o.start();o.stop(a.ctx.currentTime+duration)}catch{}}
function pcStartBossMusic(){clearInterval(pcMusicTimer);const notes=isRa?[110,165,220,147]:isDragon?[82,123,164,110]:[98,147,196,131];let n=0;pcTone(notes[0],1.8,'triangle','music',.035);pcMusicTimer=setInterval(()=>pcTone(notes[n++%notes.length],1.65,isRa?'sine':'triangle','music',.035),1450)}
function sfx(kind){const f={place:170,flip:260,attack:95,impact:55,fusion:320,destroy:62,fire:115,thunder:48,roar:74,equip:410}[kind]||140;pcTone(f,kind==='roar'?.55:.22,kind==='impact'||kind==='destroy'?'sawtooth':'triangle','fx',kind==='impact'?.12:.075)}
pcStartBossMusic();
document.addEventListener('pointerdown',()=>{const a=pcAudioInit();a?.ctx?.resume?.();if(!pcMusicTimer)pcStartBossMusic()},{once:true});
// V18.9.48 — Invocaciones y Ultimates cinematográficos PC.
// Solo añade presentación audiovisual: no modifica ATK/DEF, daño, habilidades ni IA.
const PC_CINEMATIC_PROFILES={
 'dios-jupiter':{label:'DIVINA · UNIVERSO',summon:'DESCENSO DEL PADRE DEL CIELO',attack:'RAYO DEL PADRE DEL CIELO',skill:'ESCUDO SOLAR',tone:'lightning',color:0xffe36b},
 'zeus-emperador-rayo':{label:'DIVINA · UNIVERSO',summon:'TRONO DEL RELÁMPAGO',attack:'FULGOR DEL OLIMPO',skill:'CASTIGO CELESTIAL',tone:'lightning',color:0x66bfff},
 'kronos-devorador-tiempo':{label:'DIVINA · UNIVERSO',summon:'RUPTURA DEL TIEMPO',attack:'ERA DEVORADA',skill:'DETENER EL TIEMPO',tone:'cosmic',color:0x9a55ff},
 'titan-del-olimpo':{label:'SUPREMA DIVINA · UNIVERSO',summon:'FUSIÓN DIVINA SUPREMA',attack:'JUICIO DEL OLIMPO',skill:'JUICIO DE LOS TRES DIOSES',tone:'solar',color:0xffd45c},
 'apolo-guardian-solar':{label:'DIVINA · OLIMPO',summon:'DESCENSO DEL SOL',attack:'FLECHA DEL SOL ETERNO',skill:'SANTUARIO DEL SOL',tone:'solar',color:0xffc93f},
 'olimpo-atenea':{label:'DIVINA · OLIMPO',summon:'JURAMENTO DE LA GUARDIANA',attack:'LANZA DE LA SABIDURÍA',skill:'ÉGIDA DIVINA',tone:'solar',color:0xf3d37a},
 'olimpo-poseidon':{label:'DIVINA · OLIMPO',summon:'TRONO DE LAS MAREAS',attack:'TRIDENTE DEL ABISMO CELESTIAL',skill:'MAREMOTO OLÍMPICO',tone:'cosmic',color:0x35a9ff},
 'olimpo-hermes':{label:'DIVINA · OLIMPO',summon:'PASO ENTRE LOS CIELOS',attack:'GOLPE DEL MENSAJERO',skill:'VELOCIDAD DIVINA',tone:'lightning',color:0xe8d36a},
 'hades-cerbero':{label:'INFRAMUNDO · HADES',summon:'LAS TRES PUERTAS SE ABREN',attack:'MORDIDA DEL TÁRTARO',skill:'TRES PUERTAS',tone:'shadow',color:0x7a42ff},
 'hades-caronte':{label:'INFRAMUNDO · HADES',summon:'CRUCE DEL ESTIGIA',attack:'REMO DE LAS ALMAS',skill:'PRECIO DEL VIAJE',tone:'shadow',color:0x5136aa},
 'hades-persefone':{label:'DIVINA · INFRAMUNDO',summon:'REINA DE DOS MUNDOS',attack:'CORONA DEL INFRAMUNDO',skill:'REINA DE DOS MUNDOS',tone:'shadow',color:0xa05cff},
 'hades-thanatos':{label:'MUERTE · HADES',summon:'LA SENTENCIA HA SIDO DICTADA',attack:'GUADAÑA DE LA MUERTE',skill:'SENTENCIA MORTAL',tone:'shadow',color:0x7624d8},
 'hades-nyx':{label:'PRIMORDIAL · HADES',summon:'CAE LA NOCHE ETERNA',attack:'ECLIPSE PRIMORDIAL',skill:'NOCHE ETERNA',tone:'cosmic',color:0x442288},
 'hades-soberano':{label:'DIOS · INFRAMUNDO',summon:'EL SOBERANO DESCIENDE',attack:'JUICIO DEL TÁRTARO',skill:'DOMINIO DEL INFRAMUNDO',tone:'shadow',color:0x6e39ff},
 'hades-cerbero-umbral':{label:'BESTIA DIVINA · HADES',summon:'VIGILANTE DEL UMBRAL',attack:'DESGARRO DEL UMBRAL',skill:'VIGILANCIA DEL UMBRAL',tone:'shadow',color:0x7638ff},
 'hades-hypnos':{label:'DIVINA · SUEÑO',summon:'EL VELO DEL OLVIDO',attack:'SUEÑO SIN RETORNO',skill:'SUEÑO PROFUNDO',tone:'cosmic',color:0x6640bb},
 'hades-erinias':{label:'DIVINAS · CASTIGO',summon:'LAS FURIAS TE HAN VISTO',attack:'LÁTIGO DE CULPA',skill:'CASTIGO ETERNO',tone:'shadow',color:0x8c35dd},
 'anc-ira-ra':{label:'ANCESTRAL · DIOS SOLAR',summon:'DESPERTAR DEL SOL ANCESTRAL',attack:'JUICIO DEL SOL',skill:'EXPLOSIÓN SOLAR',tone:'solar',color:0xffb51f},
 'ojo-dragon-jefe':{label:'JEFE · DRAGÓN MALDITO',summon:'DESPERTAR DEL OJO DEL DIABLO',attack:'IRA DEL OJO DEL DIABLO',skill:'MIRADA MALDITA',tone:'fire',color:0xff321f}
};
function pcCinematicProfile(c){return c&&PC_CINEMATIC_PROFILES[c.id]||null}
function pcCinematicLabel(c,kind,p){return kind==='summon'?p.summon:kind==='skill'?p.skill:p.attack}
function pcCinematic3DFx(side,i,c,kind){
 const p=pcCinematicProfile(c),g=board?.[side]?.[i];if(!p||!g)return;
 const pos=g.position.clone(),col=p.color,quality=isRa?0.72:1;
 const ring=new THREE.Mesh(new THREE.RingGeometry(.7,1.05,48),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.9,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));
 ring.rotation.x=-Math.PI/2;ring.position.copy(pos);ring.position.y+=.08;scene.add(ring);pcElementSystems.push(ring);ring.userData={kind:'CINEMATIC_RING',birth:performance.now(),life:kind==='summon'?950:720,spin:2.4,opacity:.9};
 const pillarGeo=new THREE.CylinderGeometry(.10,.42,5.2,24,1,true),pillarMat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.20,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}),pillar=new THREE.Mesh(pillarGeo,pillarMat);
 pillar.position.copy(pos);pillar.position.y+=2.35;scene.add(pillar);pcElementSystems.push(pillar);pillar.userData={kind:'CINEMATIC_PILLAR',birth:performance.now(),life:kind==='summon'?920:650,spin:.4,opacity:.22};
 burst(pos,col,Math.round((kind==='summon'?72:54)*quality));
 if(kind!=='skill')v1892ScreenShake();
 if(p.tone==='lightning'){sfx('thunder');pcTone(660,.34,'square','fx',.05)}
 else if(p.tone==='solar'){pcTone(220,.52,'sine','fx',.06);pcTone(440,.38,'triangle','fx',.035)}
 else{sfx('roar');sfx('fire')}
}
async function pcCardCinematic(kind,side,i,c){
 const p=pcCinematicProfile(c);if(!p)return;
 // Las cartas de jefe permanecen ocultas hasta su revelación normal.
 if(side==='e'&&kind==='summon'&&!enemyRevealed?.[i])return;
 document.querySelector('.pc-card-cinematic')?.remove();
 const d=document.createElement('div');d.className=`pc-card-cinematic ${p.tone} ${kind}`;
 d.innerHTML=`<div class="pc-cine-vignette"></div><div class="pc-cine-energy"></div><section><small>${esc(p.label)}</small><img src="${c.img}" alt="${esc(c.name)}"><div><span>${kind==='summon'?'INVOCACIÓN CINEMATOGRÁFICA':kind==='skill'?'HABILIDAD CINEMATOGRÁFICA':'ULTIMATE CINEMATOGRÁFICO'}</span><b>${esc(c.name)}</b><strong>${esc(pcCinematicLabel(c,kind,p))}</strong></div></section>`;
 document.body.appendChild(d);document.body.classList.add('pc-cinematic-active');d.offsetWidth;d.classList.add('show');
 pcCinematic3DFx(side,i,c,kind);pcLog(`${c.name}: ${pcCinematicLabel(c,kind,p)}.`,'effect');
 const ms=kind==='summon'?1050:kind==='skill'?900:760;await wait(ms);
 d.classList.add('out');await wait(180);d.remove();document.body.classList.remove('pc-cinematic-active');
}

async function applyApoloEntry(i,c){
 if(!c||c.id!=='apolo-guardian-solar')return;
 if(typeof window.nemesisApoloEpicEntry==='function')window.nemesisApoloEpicEntry();
 playerDirectShieldUntil=Math.max(playerDirectShieldUntil,turnNo+1);
 toast('SANTUARIO DEL SOL: tus HP quedan protegidos del daño directo durante 2 turnos.');
 pcLog('Apolo activa Santuario del Sol.','effect');
 if(!window.__nemesisApoloCallUsed){
  const olympians=['dios-jupiter','zeus-emperador-rayo','kronos-devorador-tiempo'];
  const present=new Set([...handState,...playerCards.filter(Boolean).map(x=>x.id)]);
  const wanted=olympians.find(id=>!present.has(id)&&deckQueue.includes(id));
  if(wanted){
   const di=deckQueue.indexOf(wanted);deckQueue.splice(di,1);handState.push(wanted);renderHand();
   window.__nemesisApoloCallUsed=true;toast(`LLAMADO DE LOS DIOSES: ${card(wanted).name} pasa del Mazo a tu Mano.`);pcLog(`Apolo busca a ${card(wanted).name}.`,'effect');
  }
 }
}
function apoloFusionGuardActive(){
 return playerCards.some(c=>c&&c.id==='apolo-guardian-solar')||playerFusionProtectionUntil>=turnNo
}

async function place(side,i,c){
 const g=cardMesh(c);
 const q=v1892FinalTransform(side,i,'ATAQUE');

 // reset absoluto de transformaciones antes de animar
 g.rotation.set(q.rotX,q.rotY,0);
 g.position.set(q.x,6,q.z);
 g.scale.set(q.scale,q.scale,q.scale);
 g.userData.v182BaseY=q.y;
 scene.add(g);
 board[side][i]=g;
 sfx('place');
 v188Sound('summon');

 try{
  if(window.gsap){
   await new Promise(resolve=>{
    gsap.to(g.position,{
     y:q.y,
     duration:.40,
     ease:'power2.in',
     onComplete:()=>{
      g.position.set(q.x,q.y,q.z);
      v1892Shockwave(q.x,q.z,side==='p'?0x9b4dff:0xff465f);
      v1892ScreenShake();
      v184CrearChispas(new THREE.Vector3(q.x,q.y+.18,q.z),side==='p'?0xb75cff:0xff4d64,24);
      resolve();
     }
    })
   });
  }else{
   await twVec(g.position,new THREE.Vector3(q.x,q.y,q.z),420);
   v1892Shockwave(q.x,q.z,side==='p'?0x9b4dff:0xff465f);
  }
 }catch(e){
  g.position.set(q.x,q.y,q.z);
 }
 g.rotation.set(q.rotX,q.rotY,0);
 g.scale.set(q.scale,q.scale,q.scale);
 g.userData.v182BaseY=q.y;
 pcApplyCardEquipment(side,i,c);
 if(side==='p'&&pcCinematicProfile(c))await pcCardCinematic('summon',side,i,c);
 if(side==='p'&&c.id==='apolo-guardian-solar')await applyApoloEntry(i,c);
 if(side==='e'&&aresIsBoss())await aresOnSummon(side,i,c);
 if(side==='e'&&aresIsBoss())await aresSpecialSummon(i,c);
 if(side==='p')await olympusOnSummon(side,i,c);
 if(side==='e')await hadesOnSummon(side,i,c);
}
async function flip(side,i){const g=board[side][i];if(!g||!g.userData.faceDown)return;sfx('flip');await twNum(g.rotation,'x',g.rotation.x-Math.PI,520);g.userData.faceDown=false;burst(g.position,side==='p'?0xb75cff:0xff4962,32)}async function focus(side,i){return v16Cam(side==='p'?'PLAYER_CARD':'TARGET_CARD',side,i)}async function overview(){return v16Cam('OVERVIEW','p',2)}
async function v14PlayerTurnView(){return v16PlayerTurnCamera()}
async function v14EnemyTargetView(){return v16TargetCamera(null)}
async function v14ReturnBattleView(){document.body.classList.remove('v14-target-turn');document.body.classList.remove('v14-player-turn');return v16Cam('OVERVIEW','p',2)}

function v16Mobile(){return innerWidth<700||innerHeight>innerWidth}
function v16Preset(name,side='p',i=2){
 const m=v16Mobile(),p=pos(side,Math.max(0,Math.min(4,i)));
 const presets={
  OVERVIEW:[new THREE.Vector3(0,m?21.8:19.4,m?31.5:29),new THREE.Vector3(0,.45,-.5),520],
  PLAYER_HAND:[new THREE.Vector3(0,m?13.2:12.2,m?22.5:21),new THREE.Vector3(0,1.0,m?8.3:7.7),420],
  PLACE:[new THREE.Vector3(p.x*.14,m?13.8:12.8,m?21.5:20),new THREE.Vector3(p.x,.9,PZ),360],
  MODE:[new THREE.Vector3(p.x*.18,m?10.8:10.2,m?18.3:17.2),new THREE.Vector3(p.x,1.0,PZ),330],
  PLAYER_CARD:[new THREE.Vector3(p.x*.22,m?11.2:10.5,m?18.8:17.7),new THREE.Vector3(p.x,1.05,PZ),320],
  ENEMY_FIELD:[new THREE.Vector3(0,m?9.7:8.8,m?-15.3:-14.2),new THREE.Vector3(0,.95,EZ),430],
  TARGET_CARD:[new THREE.Vector3(p.x*.18,m?7.9:7.3,m?-13.1:-12.3),new THREE.Vector3(p.x,1.0,EZ),300],
  ATTACK_PLAYER:[new THREE.Vector3(p.x*.12,m?9.8:9.2,m?17.8:16.7),new THREE.Vector3(p.x,1.25,p.z-2.3),300],
  ATTACK_ENEMY:[new THREE.Vector3(p.x*.12,m?9.4:8.9,m?-17.1:-16),new THREE.Vector3(p.x,1.2,p.z+2.2),300],
  IMPACT_PLAYER:[new THREE.Vector3(p.x*.16,m?7.6:7.1,m?13.5:12.7),new THREE.Vector3(p.x,1.2,p.z),260],
  IMPACT_ENEMY:[new THREE.Vector3(p.x*.16,m?7.6:7.1,m?-12.7:-12),new THREE.Vector3(p.x,1.2,p.z),260],
  TRAP:[new THREE.Vector3(0,m?8.7:8.1,m?14.2:13.5),new THREE.Vector3(0,1.0,PZ),300],
  GRAVE_PLAYER:[new THREE.Vector3(-7,m?8.5:7.8,m?15.4:14.6),new THREE.Vector3(-8,.5,PZ+2.2),300],
  GRAVE_ENEMY:[new THREE.Vector3(7,m?8.5:7.8,m?-14.8:-14),new THREE.Vector3(8,.5,EZ-2.0),300]
 };
 return presets[name]||presets.OVERVIEW;
}
async function v16Cam(name,side='p',i=2){
 if(!pcCinematicCamera&&/^(ATTACK|IMPACT|TRAP|GRAVE)/.test(name))return Promise.resolve();
 const map={OVERVIEW:'DUEL',PLAYER_HAND:'HAND',PLACE:'PLACE',MODE:'MODE',PLAYER_CARD:'PLAYER_CARD',ENEMY_FIELD:'ENEMY_SELECT',TARGET_CARD:'ENEMY_CARD',ATTACK_PLAYER:'ATTACK_P',ATTACK_ENEMY:'ATTACK_E',IMPACT_PLAYER:'IMPACT_P',IMPACT_ENEMY:'IMPACT_E',TRAP:'TRAP',GRAVE_PLAYER:'GRAVE_P',GRAVE_ENEMY:'GRAVE_E'};
 return v17Camera(map[name]||'DUEL',side,i)
}
async function v16PlayerTurnCamera(){document.body.classList.add('v14-player-turn');document.body.classList.remove('v14-target-turn');return v16Cam('PLAYER_HAND','p',2)}
async function v16TargetCamera(i=2){document.body.classList.remove('v14-player-turn');document.body.classList.add('v14-target-turn');return v16Cam(i===null?'ENEMY_FIELD':'TARGET_CARD','e',i??2)}

const V17CAM={locked:false,last:'',token:0};let v17PendingTarget=-1;
function v17Viewport(){
 const w=innerWidth,h=innerHeight,portrait=h>w;
 return {portrait,aspect:w/Math.max(h,1),small:w<700};
}
function v17Shot(name,side='p',i=2){
 const v=v17Viewport(), p=pos(side,Math.max(0,Math.min(4,i))), portrait=v.portrait;
 const z=portrait?1:0;
 const shots={
  DUEL:[new THREE.Vector3(0,portrait?23.6:20.2,portrait?30.8:29.2),new THREE.Vector3(0,.35,-.4),480],
  HAND:[new THREE.Vector3(0,portrait?12.8:11.4,portrait?22.4:20.4),new THREE.Vector3(0,.75,7.5),360],
  PLACE:[new THREE.Vector3(p.x*.16,portrait?12.1:10.8,portrait?19.0:17.4),new THREE.Vector3(p.x,.8,PZ),300],
  MODE:[new THREE.Vector3(p.x*.20,portrait?9.8:8.9,portrait?16.1:14.8),new THREE.Vector3(p.x,1.0,PZ),280],
  ENEMY_SELECT:[new THREE.Vector3(0,portrait?12.8:10.8,portrait?13.8:12.2),new THREE.Vector3(0,.8,EZ),420],
  ENEMY_CARD:[new THREE.Vector3(p.x*.16,portrait?10.4:8.8,portrait?10.6:9.4),new THREE.Vector3(p.x,1.05,EZ),320],
  PLAYER_CARD:[new THREE.Vector3(p.x*.14,portrait?7.8:6.9,portrait?13.5:12.4),new THREE.Vector3(p.x,1.05,PZ),260],
  ATTACK_P:[new THREE.Vector3(p.x*.10,portrait?9.1:8.2,portrait?15.5:14.2),new THREE.Vector3(p.x,1.1,1.0),250],
  ATTACK_E:[new THREE.Vector3(p.x*.10,portrait?11.2:9.4,portrait?11.8:10.4),new THREE.Vector3(p.x,1.1,EZ),300],
  IMPACT_P:[new THREE.Vector3(p.x*.12,portrait?7.0:6.3,portrait?12.0:11.0),new THREE.Vector3(p.x,1.05,PZ),220],
  IMPACT_E:[new THREE.Vector3(p.x*.12,portrait?9.2:7.8,portrait?9.8:8.7),new THREE.Vector3(p.x,1.05,EZ),260],
  TRAP:[new THREE.Vector3(0,portrait?7.9:7.0,portrait?12.9:11.8),new THREE.Vector3(0,.9,PZ),260],
  SUMMON:[new THREE.Vector3(p.x*.08,portrait?8.8:7.8,portrait?14.6:13.2),new THREE.Vector3(p.x,1.15,PZ),260],
  GRAVE_P:[new THREE.Vector3(-7.2,portrait?7.7:6.8,portrait?13.4:12.3),new THREE.Vector3(-7.7,.45,PZ+1.5),240],
  GRAVE_E:[new THREE.Vector3(7.2,portrait?10.0:8.5,portrait?10.8:9.5),new THREE.Vector3(7.7,.45,EZ-1.5),280]
 };
 return shots[name]||shots.DUEL;
}
async function v17Camera(name,side='p',i=2,hold=0){
 V17CAM.last=name;document.body.dataset.camera=name;
 const cinematic=/^(ATTACK_|IMPACT_|TRAP_|SUMMON_|GRAVE_)/.test(name);
 if(!cinematic)return v182Base();
 let r;
 if(name.startsWith('ATTACK_'))r=await v182AttackShot(side,i);
 else if(name.startsWith('IMPACT_'))r=await v182ImpactShot(side,i);
 else r=await v182Base();
 if(hold)await wait(Math.min(hold,240));
 return r;
}

function v171HideAttackConfirm(){
 const x=document.getElementById('v171confirm');if(x)x.remove();
}


const V182_BASE={
 portrait:{pos:new THREE.Vector3(0,18.8,27.5),look:new THREE.Vector3(0,.35,0)},
 landscape:{pos:new THREE.Vector3(0,15.2,25.8),look:new THREE.Vector3(0,.35,0)}
};
function v182Base(){
 const q=innerHeight>innerWidth?V182_BASE.portrait:V182_BASE.landscape;
 return camTo(q.pos.clone(),q.look.clone(),360);
}
async function v182AttackShot(side,i){
 const p=pos(side,i),portrait=innerHeight>innerWidth;
 const cp=side==='p'
   ?new THREE.Vector3(p.x*.18,portrait?10.5:9.1,portrait?16.4:15.1)
   :new THREE.Vector3(p.x*.18,portrait?10.5:9.1,portrait?13.6:12.4);
 return camTo(cp,new THREE.Vector3(p.x,1.05,p.z),260);
}
async function v182ImpactShot(side,i){
 const p=pos(side,i),portrait=innerHeight>innerWidth;
 const cp=new THREE.Vector3(p.x*.14,portrait?8.8:7.7,side==='p'?(portrait?13.8:12.7):(portrait?11.4:10.5));
 return camTo(cp,new THREE.Vector3(p.x,1.0,p.z),230);
}
function v181ReturnOverview(){
 try{v12TargetCamera(false)}catch(e){}
 v17PendingTarget=-1;
 return v182Base().catch(()=>{});
}
function v172ClosePicker(){
 const p=document.getElementById('v172picker');if(p)p.remove();
 document.body.classList.remove('v172-picker-open');
 if(typeof pcAttackLine!=='undefined')pcAttackLine.visible=false;
}
function v172OpenPicker(){
 v172ClosePicker();v171HideAttackConfirm();
 const cards=(enemyCards||[]).map((c,i)=>({c,i})).filter(x=>x.c);
 const p=document.createElement('div');p.id='v172picker';p.className='v172picker';
 p.innerHTML=`<div class="v172panel"><div class="v172head"><h2>ELIGE CARTA RIVAL</h2><p>Toca una carta para revisar ATK/DEF y confirmar el ataque.</p></div><div class="v172grid"></div><button class="v172back">VOLVER</button></div>`;
 const grid=p.querySelector('.v172grid');
 cards.forEach(({c,i})=>{
   const mode=enemyModes?.[i]||'ATAQUE';
   const b=document.createElement('button');b.className='v172card';
   b.innerHTML=`<img src="${c.img||c.image||''}" alt="${c.name||'Carta rival'}"><div><b>${c.name||'Carta rival'}</b><span>ATK ${c.atk??c.power??0}</span><span>DEF ${c.def??0}</span><em>${mode}</em></div>`;
   b.onmouseenter=()=>{pcSetAttackLine(i);pcPreviewCard(c)};
   b.onclick=()=>{v17PendingTarget=i;v17CardReadout('e',i);v171ShowAttackConfirm(i)};
   grid.appendChild(b);
 });
 p.querySelector('.v172back').onclick=()=>{v172ClosePicker();v17PendingTarget=-1;targetbanner?.classList.add('hidden');setPhase('ACTION',`TU TURNO ${turnNo} · ACCIÓN`);battleActions.classList.remove('hidden');toast('Ataque cancelado.')};
 document.body.appendChild(p);document.body.classList.add('v172-picker-open');
}
function v171ShowAttackConfirm(i){
 v171HideAttackConfirm();
 const c=enemyCards?.[i];if(!c)return;
 const mode=enemyModes?.[i]||'ATAQUE';
 const attacker=playerCards?.[active];if(!attacker)return;
 const attack=attacker.atk??attacker.power??0,targetValue=mode==='DEFENSA'?(c.def??0):(c.atk??c.power??0),difference=attack-targetValue;
 pcSetAttackLine(i);
 const x=document.createElement('div');x.id='v171confirm';x.className='v171confirm';
 x.innerHTML=`<div class="v171confirmbox"><small>CONFIRMACIÓN DE ATAQUE</small><div class="v171versus"><b>${attacker.name||'TU CARTA'}</b><i>➜</i><b>${c.name||'CARTA RIVAL'}</b></div><div><span>ATK ${attack}</span><span>${mode==='DEFENSA'?'DEF':'ATK'} ${targetValue}</span><em>${mode}</em></div><p class="v171prediction ${difference>=0?'advantage':'danger'}">${difference>0?`Ventaja estimada: ${difference}`:difference===0?'Choque equilibrado':`Riesgo estimado: ${Math.abs(difference)}`}</p><button id="v171attack">CONFIRMAR ATAQUE</button><button id="v171cancel">VOLVER</button></div>`;
 document.body.appendChild(x);
 x.querySelector('#v171cancel').onclick=()=>{v171HideAttackConfirm();v17PendingTarget=-1;pcAttackLine.visible=false;toast('Elige otra carta rival.')};
 x.querySelector('#v171attack').onclick=async()=>{
   v171HideAttackConfirm();v172ClosePicker();
   if(busy||phase!=='TARGET'||!enemyCards?.[i])return;
   v17PendingTarget=-1;v12TargetCamera(false);targetbanner?.classList.add('hidden');
   busy=true;enemySlot=i;
   try{
     await guardStep(resolveBattle('p',active,'e',i),6500,'combate jugador');
     const dmAttacker=playerCards[active];await nemesisDmAfterPlayerAttack(dmAttacker);
     if(ehpv<=0){
       if(ghostGodFinalFormSave()){await ghostGodContinueAfterFinalForm();return}
       if(spectralKingCrownSave()){await spectralKingContinueAfterCrown();return}
       return finish(true)
     };
     if(phpv<=0)return finish(false);
     if(nemesisDmKeepTurnAfterAttack(dmAttacker)){setPhase('ACTION',`TU TURNO ${turnNo} · ATAQUE ADICIONAL`,{force:true});battleActions.classList.remove('hidden');return}
     await enemyTurn();
   }catch(err){
     console.error('target battle',err);
     toast('El combate se recuperó automáticamente.');
     setPhase('ACTION',`TU TURNO ${turnNo} · ACCIÓN`);
     battleActions.classList.remove('hidden');
   }finally{busy=false;v181ReturnOverview()}
 };
}
function v17CardReadout(side,i){
 const c=side==='e'?enemyCards?.[i]:playerCards?.[i];if(!c)return;
 let r=document.getElementById('v17readout');
 if(!r){r=document.createElement('div');r.id='v17readout';r.className='v17readout';document.body.appendChild(r)}
 const mode=(side==='e'?enemyModes?.[i]:playerModes?.[i])||'ATAQUE';
 r.innerHTML=`<b>${c.name||'CARTA'}</b><span>ATK ${c.atk??c.power??0}</span><span>DEF ${c.def??0}</span><em>${mode}</em>`;
 r.classList.add('show');clearTimeout(r._t);r._t=setTimeout(()=>r.classList.remove('show'),1700)
}



function v15Inspect(card){
 if(!card)return;
 let old=document.getElementById('v15inspect'); if(old)old.remove();
 let d=document.createElement('div');d.id='v15inspect';d.className='v15inspect';
 const img=card.img||card.image||'';
 d.innerHTML=`<div class="v15inspectbox">${img?`<img src="${img}">`:''}<h2>${card.name||'CARTA'}</h2><div class="v15stats">ATK ${card.atk??card.power??0} · DEF ${card.def??0}</div><p>${card.text||card.effectText||card.description||''}</p><button>CERRAR</button></div>`;
 document.body.appendChild(d);d.onclick=(e)=>{if(e.target===d||e.target.tagName==='BUTTON')d.remove()}
}
function v15Flash(kind='attack'){
 let f=document.createElement('div');f.className='v15flash '+kind;document.body.appendChild(f);setTimeout(()=>f.remove(),520)
}
function v15TrapFX(){
 let f=document.createElement('div');f.className='v15trapfx';f.innerHTML='<div>☠</div><b>CALAVERA MUERTA</b><span>¡TRAMPA ACTIVADA!</span>';document.body.appendChild(f);setTimeout(()=>f.remove(),1100)
}
function v15SummonFX(card){
 if(!card||((card.atk||0)<4000 && card.type!=='fusion'))return;
 let f=document.createElement('div');f.className='v15summon';f.innerHTML=`<span>INVOCACIÓN ESPECIAL</span><b>${card.name||'NÉMESIS'}</b>`;document.body.appendChild(f);setTimeout(()=>f.remove(),950)
}

function titleFx(c,attack){const d=document.createElement('div');d.className='attackname';d.innerHTML=`<b>${c.name}</b><span>“${attack}”</span>`;app.appendChild(d);setTimeout(()=>d.remove(),1100)}function damageFx(v,side){const d=document.createElement('div');d.className='damage3d '+(side==='e'?'enemy':'player');d.textContent='-'+v+' HP';app.appendChild(d);pcLog(`${side==='e'?'Rival':'Jugador'} pierde ${v} HP.`,'damage');setTimeout(()=>d.remove(),1000)}


// V18.4 — partículas y destrucción estilo PS1

let v188AudioCtx=null;
function v188Audio(){
 try{
  if(!v188AudioCtx)v188AudioCtx=new (window.AudioContext||window.webkitAudioContext)();
  if(v188AudioCtx.state==='suspended')v188AudioCtx.resume();
  return v188AudioCtx;
 }catch(e){return null}
}
function v188Sound(type){
 const ctx=v188Audio();if(!ctx)return;
 const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);
 const t=ctx.currentTime;
 if(type==='draw'){
  o.type='triangle';o.frequency.setValueAtTime(587,t);o.frequency.exponentialRampToValueAtTime(880,t+.1);
  g.gain.setValueAtTime(.11,t);g.gain.exponentialRampToValueAtTime(.001,t+.13);o.start(t);o.stop(t+.13)
 }else if(type==='summon'){
  o.type='sawtooth';o.frequency.setValueAtTime(440,t);o.frequency.exponentialRampToValueAtTime(110,t+.28);
  g.gain.setValueAtTime(.09,t);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.start(t);o.stop(t+.3)
 }else if(type==='defense'){
  o.type='sine';o.frequency.setValueAtTime(180,t);o.frequency.exponentialRampToValueAtTime(85,t+.18);
  g.gain.setValueAtTime(.15,t);g.gain.exponentialRampToValueAtTime(.001,t+.21);o.start(t);o.stop(t+.21)
 }else if(type==='impact'){
  o.type='square';o.frequency.setValueAtTime(120,t);
  for(let i=0;i<12;i++)o.frequency.setValueAtTime(45+Math.random()*220,t+i*.012);
  g.gain.setValueAtTime(.18,t);g.gain.exponentialRampToValueAtTime(.001,t+.22);o.start(t);o.stop(t+.22)
 }else if(type==='trap'){
  o.type='sawtooth';o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(55,t+.35);
  g.gain.setValueAtTime(.13,t);g.gain.exponentialRampToValueAtTime(.001,t+.36);o.start(t);o.stop(t+.36)
 }
}

const v184Chispas=[],v184Fuego=[];
function v184CrearChispas(o,color=0xffd36a,n=28){
 for(let k=0;k<n;k++){
  const p=new THREE.Mesh(new THREE.SphereGeometry(.035+Math.random()*.045,5,4),new THREE.MeshBasicMaterial({color,transparent:true,opacity:1}));
  p.position.copy(o);p.position.x+=(Math.random()-.5)*.5;p.position.y+=(Math.random()-.5)*.35;p.position.z+=(Math.random()-.5)*.5;
  p.userData={vX:(Math.random()-.5)*.11,vY:.045+Math.random()*.13,vZ:(Math.random()-.5)*.11,gravedad:.006+Math.random()*.004,vida:.65+Math.random()*.55};
  scene.add(p);v184Chispas.push(p);
 }
}
function v184CrearFuegoConsumidor(obj){
 if(!obj)return;const b=obj.position.clone();
 for(let k=0;k<48;k++){
  const color=k%3===0?0x8d2cff:(k%2?0xff3c24:0xffa21a);
  const p=new THREE.Mesh(new THREE.SphereGeometry(.06+Math.random()*.09,6,4),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.92}));
  p.position.set(b.x+(Math.random()-.5)*1.6,b.y-.5+Math.random()*1.5,b.z+(Math.random()-.5)*.8);p.scale.setScalar(.65+Math.random()*.8);p.visible=false;
  p.userData={vX:(Math.random()-.5)*.025,vY:.035+Math.random()*.075,vZ:(Math.random()-.5)*.025,vida:.75+Math.random()*.8,retraso:Math.random()*.32};
  scene.add(p);v184Fuego.push(p);
 }
 v184CrearChispas(new THREE.Vector3(b.x,b.y+.5,b.z),0xff512f,34);
}

function v185TrimFX(){
 if(v184Chispas.length>180){
  while(v184Chispas.length>140){const p=v184Chispas.shift();try{scene.remove(p)}catch(e){}}
 }
 if(v184Fuego.length>180){
  while(v184Fuego.length>140){const p=v184Fuego.shift();try{scene.remove(p)}catch(e){}}
 }
}
function v184UpdateFX(){
 for(let i=v184Chispas.length-1;i>=0;i--){const p=v184Chispas[i];p.position.x+=p.userData.vX;p.position.y+=p.userData.vY;p.position.z+=p.userData.vZ;p.userData.vY-=p.userData.gravedad;p.userData.vida-=.03;p.material.opacity=Math.max(0,p.userData.vida);if(p.userData.vida<=0){scene.remove(p);v184Chispas.splice(i,1)}}
 for(let i=v184Fuego.length-1;i>=0;i--){const p=v184Fuego[i];if(p.userData.retraso>0){p.userData.retraso-=.02;if(p.userData.retraso<=0)p.visible=true;continue}p.position.x+=p.userData.vX;p.position.y+=p.userData.vY;p.position.z+=p.userData.vZ;p.userData.vida-=.025;p.scale.multiplyScalar(.965);p.material.opacity=Math.max(0,p.userData.vida);if(p.userData.vida<=0){scene.remove(p);v184Fuego.splice(i,1)}}
}


let v185CameraRecoveryTimer=0;


function v188UpdateHUD(){
 try{
  phpv=Math.max(0,Math.min(playerMaxHp,phpv));ehpv=Math.max(0,Math.min(enemyMaxHp,ehpv));
  const pp=(phpv/playerMaxHp)*100,ep=(ehpv/enemyMaxHp)*100;
  php.style.width=`${pp}%`;ehp.style.width=`${ep}%`;
  php.dataset.level=pp<30?'danger':pp<60?'warn':'ok';
  ehp.dataset.level=ep<30?'danger':ep<60?'warn':'ok';
  ptxt.textContent=`HP ${phpv}/${playerMaxHp}`;etxt.textContent=`HP ${ehpv}/${enemyMaxHp}`;
 }catch(e){}
}
function v185HudSync(){v188UpdateHUD()}


async function v188SafeReturn(){
 try{
  if(window.gsap){gsap.killTweensOf(cam.position);gsap.killTweensOf(camTargetGSAP)}
 }catch(e){}
 try{await v182Base()}catch(e){try{v185HardResetCamera()}catch(_){}}
 document.body.classList.remove('gsap-cinematic');
 enAnimacionGSAP=false;
}
function v185HardResetCamera(){
 try{
  if(window.gsap){
   gsap.killTweensOf(cam.position);
   gsap.killTweensOf(camTargetGSAP);
  }
 }catch(e){}
 try{
  const q=innerHeight>innerWidth?V182_BASE.portrait:V182_BASE.landscape;
  cam.position.copy(q.pos);
  camGoal.copy(q.pos);
  camTargetGSAP.copy(q.look);
  look.copy(q.look);
  lookGoal.copy(q.look);
  cam.lookAt(q.look);
 }catch(e){}
 enAnimacionGSAP=false;
 document.body.classList.remove('gsap-cinematic');
 clearTimeout(v185CameraRecoveryTimer);
 v185HudSync();
}

function v185ArmCameraRecovery(ms=5000){
 clearTimeout(v185CameraRecoveryTimer);
 v185CameraRecoveryTimer=setTimeout(()=>{
  if(enAnimacionGSAP){
   console.warn('V18.5: recuperación automática de cámara');
   v185HardResetCamera();
   busy=false;
  }
 },ms);
}

let enAnimacionGSAP=false;
const camTargetGSAP=new THREE.Vector3(0,.35,0);

function v183BasePose(){
 const q=innerHeight>innerWidth?V182_BASE.portrait:V182_BASE.landscape;
 return {pos:q.pos.clone(),look:q.look.clone()};
}
function v183AttackPose(side,i){
 const p=pos(side,i),portrait=innerHeight>innerWidth;
 if(side==='p'){
  return {
   pos:new THREE.Vector3(p.x*.23+(p.x<0?-1.0:1.0),portrait?8.9:7.8,portrait?14.8:13.5),
   look:new THREE.Vector3(p.x*.32,1.1,-1.8)
  };
 }
 return {
  pos:new THREE.Vector3(p.x*.23+(p.x<0?-1.0:1.0),portrait?8.9:7.8,portrait?12.8:11.6),
  look:new THREE.Vector3(p.x*.32,1.1,1.8)
 };
}
function v183ImpactPose(side,i){
 const p=pos(side,i),portrait=innerHeight>innerWidth;
 return {
  pos:new THREE.Vector3(p.x*.17,portrait?7.7:6.8,side==='p'?(portrait?12.2:11.2):(portrait?10.7:9.8)),
  look:new THREE.Vector3(p.x,1.0,p.z)
 };
}
function v183GsapCameraTo(tl,pose,duration=.42,position='>'){
 tl.to(cam.position,{x:pose.pos.x,y:pose.pos.y,z:pose.pos.z,duration,ease:'power2.inOut'},position);
 tl.to(camTargetGSAP,{x:pose.look.x,y:pose.look.y,z:pose.look.z,duration,ease:'power2.inOut'},'<');
}

// V18.9.46 — Animaciones avanzadas PC por elemento.
// Capa visual aislada: no modifica ATK/DEF, HP, turnos, IA ni resolución de efectos.
function pcCardElement(c,meta={}){
 const raw=`${meta.type||''} ${c?.family||''} ${c?.name||''} ${c?.id||''}`.toUpperCase();
 if(/HIELO|ICE|GLACIAL/.test(raw))return 'ICE';
 if(/TRUENO|RAYO|MJÖLNIR|MJOLNIR|LIGHTNING/.test(raw))return 'LIGHTNING';
 if(/SOLAR|RA\b|JÚPITER|JUPITER|CELESTIAL|LIGHT/.test(raw))return 'LIGHT';
 if(/SANGRE|BLOOD|ARES/.test(raw))return 'BLOOD';
 if(/UNIVERSO|FANTASMA|COSMIC|VACÍO|VACIO|VOID/.test(raw))return 'COSMIC';
 if(/SOMBRA|ABISMO|DARK|OSCUR/.test(raw))return 'DARK';
 if(/FUEGO|INFERNAL|CARMES|DRAGÓN|DRAGON|FIRE/.test(raw))return 'FIRE';
 return 'ARCANE';
}
function pcElementColor(element,fallback=0xb657ff){
 return ({FIRE:0xff5a22,ICE:0x88eaff,LIGHTNING:0x58a8ff,LIGHT:0xffdf72,BLOOD:0xff2348,COSMIC:0xc05cff,DARK:0x7a42e8,ARCANE:fallback})[element]||fallback;
}
function pcDisposeObject3D(o){
 if(!o)return;try{o.traverse(x=>{if(x.geometry)x.geometry.dispose?.();if(x.material){const mats=Array.isArray(x.material)?x.material:[x.material];mats.forEach(m=>m.dispose?.())}});scene.remove(o)}catch(e){}
}
function pcBuildElementProjectile(element,color){
 const group=new THREE.Group();
 const mat=new THREE.MeshPhysicalMaterial({color,emissive:color,emissiveIntensity:2.2,roughness:.18,metalness:.18,transparent:true,opacity:.96,depthWrite:false});
 let core;
 if(element==='ICE')core=new THREE.Mesh(new THREE.OctahedronGeometry(.34,0),mat);
 else if(element==='LIGHTNING')core=new THREE.Mesh(THREE.CapsuleGeometry?new THREE.CapsuleGeometry(.10,.62,4,8):new THREE.CylinderGeometry(.10,.10,.7,8),mat);
 else if(element==='DARK'||element==='COSMIC'){core=new THREE.Mesh(new THREE.SphereGeometry(.25,14,10),mat);const ring=new THREE.Mesh(new THREE.TorusGeometry(.38,.045,8,28),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false}));ring.rotation.x=Math.PI/2;group.add(ring)}
 else if(element==='FIRE'||element==='BLOOD')core=new THREE.Mesh(new THREE.IcosahedronGeometry(.30,1),mat);
 else core=new THREE.Mesh(new THREE.SphereGeometry(.27,14,10),mat);
 group.add(core);const light=new THREE.PointLight(color,element==='LIGHT'?15:10,4.5,2);group.add(light);group.userData.spin=element==='LIGHTNING'?8:4;return group;
}
async function pcLaunchElementProjectile(from,to,element,color,duration=260){
 if(!pcParticles||graphicsParticleMultiplier<=0)return;
 const q=pcBuildElementProjectile(element,color);q.position.copy(from);scene.add(q);
 const trailTimer=setInterval(()=>{if(!q.parent)return;burst(q.position,color,isRa?5:8)},70);
 try{
  if(window.gsap){await new Promise(res=>gsap.to(q.position,{x:to.x,y:to.y,z:to.z,duration:duration/1000,ease:'power3.in',onUpdate:()=>{q.rotation.x+=.12;q.rotation.z+=.16},onComplete:res}))}
  else await twVec(q.position,to,duration);
 }catch(e){}finally{clearInterval(trailTimer);pcDisposeObject3D(q)}
}
function pcElementImpactFx(element,point,color,destruction=false){
 color=pcElementColor(element,color);v1892Shockwave(point.x,point.z,color);
 const n=isRa?(destruction?10:8):(destruction?22:14);v184CrearChispas(point,color,n);burst(point,color,n);
 if(element==='FIRE'||element==='BLOOD')sfx('fire');else if(element==='LIGHTNING')sfx('thunder');else sfx('impact');
 // Forma secundaria exclusiva por elemento, breve y de bajo coste.
 let geo;if(element==='ICE')geo=new THREE.RingGeometry(.18,.52,6);else if(element==='LIGHTNING')geo=new THREE.RingGeometry(.12,.68,12);else if(element==='DARK'||element==='COSMIC')geo=new THREE.TorusGeometry(.42,.055,8,24);else geo=new THREE.RingGeometry(.22,.60,24);
 const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.82,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));m.position.copy(point);m.rotation.x=-Math.PI/2;scene.add(m);pcElementSystems.push(m);m.userData={birth:performance.now(),life:destruction?720:480,spin:element==='COSMIC'?3:1.2,opacity:.82};
}

async function attackAnim(side,i,targetSide,targetI,c,damage){
 if(pcCinematicProfile(c))await pcCardCinematic('attack',side,i,c);
 if(!window.gsap||!pcCinematicCamera)return attackAnimFallback(side,i,targetSide,targetI,c,damage);
 if(enAnimacionGSAP)return;
 const g=board[side]?.[i],t=board[targetSide]?.[targetI];
 if(!g)return;
 enAnimacionGSAP=true;document.body.classList.add('gsap-cinematic');v185ArmCameraRecovery(5200);

 const basePos=g.position.clone(),baseScale=g.scale.clone();
 const baseRot={x:g.rotation.x,y:g.rotation.y,z:g.rotation.z};
 const meta=META[c.id]||{attackName:'GOLPE NÉMESIS',color:0xb657ff};
 const element=pcCardElement(c,meta),elementColor=pcElementColor(element,meta.color);
 const attackPose=v183AttackPose(side,i);
 const impactPose=t?v183ImpactPose(targetSide,targetI):attackPose;
 const basePose=v183BasePose();
 const targetPoint=t?new THREE.Vector3(t.position.x,t.position.y+.55,t.position.z):
                     new THREE.Vector3(0,1,side==='p'?EZ:PZ);
 camTargetGSAP.copy(look);

 try{
  await new Promise((resolve,reject)=>{
   const tl=gsap.timeline({
    defaults:{overwrite:'auto'},
    onUpdate:()=>{try{cam.lookAt(camTargetGSAP)}catch(e){}},
    onComplete:resolve,
    onInterrupt:resolve
   });

   titleFx(c,meta.attackName);
   sfx('attack');

   // Corte 1: cámara viaja al costado del atacante.
   v183GsapCameraTo(tl,attackPose,.40,0);

   // La carta se levanta y encara al objetivo mientras llega la cámara.
   tl.to(g.position,{
      y:basePos.y+1.35,
      z:basePos.z+(side==='p'?-1.15:1.15),
      duration:.30,ease:'power2.out'
   },.12);
   tl.to(g.scale,{x:.92,y:.92,z:.92,duration:.30,ease:'power2.out'},.12);
   tl.to(g.rotation,{
      x:Math.PI*.18,
      y:side==='p'?0:Math.PI,
      duration:.30,ease:'power2.out'
   },.12);
   tl.call(()=>{burst(g.position,elementColor,isRa?14:26);pcElementImpactFx(element,g.position,elementColor,false)},null,.34);

   // Corte 2: cámara salta suavemente al receptor y la carta embiste.
   v183GsapCameraTo(tl,impactPose,.28,.48);
   tl.call(()=>{pcLaunchElementProjectile(g.position.clone(),targetPoint.clone(),element,elementColor,isRa?230:270)},null,.49);
   if(t){
    tl.to(g.position,{
      x:t.position.x,
      y:t.position.y+1.05,
      z:t.position.z+(side==='p'?1.8:-1.8),
      duration:.24,ease:'power3.in'
    },.50);
    tl.call(()=>{
      pcElementImpactFx(element,targetPoint,elementColor,false);v188Sound('impact');
      v1892ScreenShake();
      v15Flash('attack');
      if(damage>0)damageFx(damage,targetSide);
    },null,.73);
    const tr={x:t.rotation.x,y:t.rotation.y,z:t.rotation.z};
    tl.to(t.rotation,{z:tr.z+(side==='p'?.13:-.13),duration:.065,yoyo:true,repeat:3,ease:'none'},.72);
    tl.to(t.rotation,{x:tr.x,y:tr.y,z:tr.z,duration:.08,ease:'power1.out'},.94);
   }else if(damage>0){
    tl.call(()=>{pcElementImpactFx(element,targetPoint,elementColor,false);v1892ScreenShake();damageFx(damage,targetSide)},null,.70);
   }

   // Retorno de la carta al slot.
   tl.to(g.position,{x:basePos.x,y:basePos.y,z:basePos.z,duration:.30,ease:'power2.out'},.82);
   tl.to(g.scale,{x:baseScale.x,y:baseScale.y,z:baseScale.z,duration:.30,ease:'power2.out'},.82);
   tl.to(g.rotation,{x:baseRot.x,y:baseRot.y,z:baseRot.z,duration:.30,ease:'power2.out'},.82);

   // Regreso exacto a la cámara PS1 base.
   v183GsapCameraTo(tl,basePose,.46,.92);
  });
 }catch(err){
  console.error('GSAP attackAnim',err);
  try{
   g.position.copy(basePos);g.scale.copy(baseScale);
   g.rotation.set(baseRot.x,baseRot.y,baseRot.z);g.userData.v182BaseY=basePos.y;
  try{
   const currentMode=(side==='p'?playerModes:enemyModes)[i]||'ATAQUE';
   v1892ResetCardTransform(g,side,i,currentMode);
  }catch(e){}
  }catch(e){}
  await attackAnimFallback(side,i,targetSide,targetI,c,damage);
 }finally{
  const bp=v183BasePose();
  cam.position.copy(bp.pos);
  camTargetGSAP.copy(bp.look);
  look.copy(bp.look);lookGoal.copy(bp.look);camGoal.copy(bp.pos);
  cam.lookAt(bp.look);
  v185HudSync();
  await v188SafeReturn();v185HardResetCamera();
 }
}

async function attackAnimFallback(side,i,targetSide,targetI,c,damage){
 const g=board[side][i],t=board[targetSide]?.[targetI];if(!g)return;
 const base=g.position.clone(),rotX=g.rotation.x,rotY=g.rotation.y,rotZ=g.rotation.z,baseScale=g.scale.clone();
 try{
  await guardStep(v16Cam(side==='p'?'ATTACK_PLAYER':'ATTACK_ENEMY',side,i),1800,'cámara atacante');
  const meta=META[c.id]||{attackName:'GOLPE NÉMESIS',color:0xb657ff},element=pcCardElement(c,meta),elementColor=pcElementColor(element,meta.color);titleFx(c,meta.attackName);
  const faceY=side==='p'?0:Math.PI,lift=new THREE.Vector3(g.position.x,2.15,g.position.z+(side==='p'?-.25:.25));
  await guardStep(Promise.all([twVec(g.position,lift,220),twVec(g.scale,new THREE.Vector3(.88,.88,.88),220),twNum(g.rotation,'x',Math.PI*.18,220),twNum(g.rotation,'y',faceY,220)]),1800,'levantar carta');
  burst(g.position,meta.color,24);sfx('attack');
  if(t){
    await guardStep(v16Cam(targetSide==='p'?'IMPACT_PLAYER':'IMPACT_ENEMY',targetSide,targetI),1400,'cámara objetivo');
    const hitPoint=new THREE.Vector3(t.position.x,t.position.y+.55,t.position.z);
    await guardStep(pcLaunchElementProjectile(g.position.clone(),hitPoint.clone(),element,elementColor,isRa?230:280),1700,'proyectil elemental');
    pcElementImpactFx(element,hitPoint,elementColor,false);v1892ScreenShake();v15Flash('attack');await wait(120)
  }
  if(damage>0)damageFx(damage,targetSide);await wait(120)
 }catch(err){console.error('attackAnim',err);toast('Ataque completado con animación reducida.')}finally{
  if(board[side][i]===g){try{await guardStep(Promise.all([twVec(g.position,base,220),twVec(g.scale,baseScale,220),twNum(g.rotation,'x',rotX,220),twNum(g.rotation,'y',rotY,220),twNum(g.rotation,'z',rotZ,220)]),1800,'retorno de carta')}catch{g.position.copy(base);g.scale.copy(baseScale);g.rotation.set(rotX,rotY,rotZ)}}
  await guardStep(v182Base(),1800,'vista general').catch(()=>{})
 }
}
async function fusionAnim(a,b,result,slot){
 const v184FusionBurst=true;try{v184CrearChispas(new THREE.Vector3(0,2,0),0xc85cff,54)}catch(e){}
const ga=board.p[a],gb=board.p[b];if(!ga||!gb)return;const tag=document.createElement('div');tag.className='fusiontag';tag.innerHTML=`FUSIÓN NÉMESIS<br><small>${result.name}</small>`;app.appendChild(tag);sfx('fusion');await camTo(new THREE.Vector3(0,12,18),new THREE.Vector3(0,1,0),430);await Promise.all([twVec(ga.position,new THREE.Vector3(-1.3,4,0),520),twVec(gb.position,new THREE.Vector3(1.3,4,0),520)]);await Promise.all([twNum(ga.rotation,'z',ga.rotation.z+Math.PI*2,650),twNum(gb.rotation,'z',gb.rotation.z-Math.PI*2,650)]);burst(new THREE.Vector3(0,3.5,0),0xe269ff,70);scene.remove(ga);scene.remove(gb);board.p[a]=board.p[b]=null;await wait(260);await place('p',slot,result);await flip('p',slot);setTimeout(()=>tag.remove(),500);await overview()}
let phpv=playerMaxHp,ehpv=enemyMaxHp,selectedHand=-1,active=-1,enemySlot=-1,busy=false,phase='PLACE',turnNo=1;
let busySince=0;setInterval(()=>{if(busy&&!busySince)busySince=Date.now();if(!busy)busySince=0;if(busySince&&Date.now()-busySince>12000&&phase!=='END'){console.warn('NEMESIS watchdog: desbloqueando duelo');busy=false;busySince=0;battleActions.classList.add('hidden');const canPlace=handState?.length>0&&playerCards?.some(c=>!c);setPhase(canPlace?'PLACE':'ACTION',canPlace?`TU TURNO ${turnNo} · COLOCAR`:`TU TURNO ${turnNo} · ACCIÓN`);toast('Duelo desbloqueado automáticamente. Continúa jugando.')}} ,1000);
const playerCards=Array(5).fill(null),enemyCards=Array(5).fill(null),enemyRevealed=Array(5).fill(false),playerModes=Array(5).fill(null),enemyModes=Array(5).fill(null);

let playerGrave=[],enemyGrave=[];

// V18.9.72 — RUNTIME LOCAL DEL DUELO
// V18.9.64 — MOTOR ARES CARTAS 1–5
function aresIsBoss(){return window.NEMESIS_ARES_DUEL_ACTIVE===true}
function aresFury(){return Number(window.NEMESIS_ARES?.fury||0)}
function aresGainFury(n,reason=''){if(typeof window.nemesisAresGainFury==='function')return window.nemesisAresGainFury(n,reason);return 0}
function aresSpendFury(n){return typeof window.nemesisAresSpendFury==='function'?window.nemesisAresSpendFury(n):false}

function aresFrontLineReduction(defSide,defIndex,amount){
 if(!aresIsBoss()||defSide!=='e')return amount;
 const guard=enemyCards.find((c,i)=>c&&c.effect==='aresFrontLine'&&enemyModes[i]==='DEFENSA'&&i!==defIndex);
 if(!guard)return amount;
 const reduced=Math.max(0,amount-500);
 if(reduced!==amount)toast(`PRIMERA LÍNEA reduce el daño: ${amount} → ${reduced}.`);
 return reduced;
}
function aresApplyFormation(){
 if(!aresIsBoss())return;
 const generals=enemyCards.filter(c=>c&&c.effect==='aresWarFormation').length;
 enemyCards.forEach(c=>{
  if(!c||c.effect==='aresWarFormation')return;
  const old=c._aresFormationBonus||0,next=generals*700;
  c.atk=Math.max(0,(c.atk||0)-old+next);
  c.def=Math.max(0,(c.def||0)-old+next);
  c._aresFormationBonus=next;
 });
}
function aresClearPlayerTitanDebuff(){
 playerCards.forEach(c=>{
  if(!c)return;
  if(c._aresTitanDebuffUntil!=null&&turnNo>c._aresTitanDebuffUntil){
   c.atk+=(c._aresTitanAtkLost||0);
   delete c._aresTitanDebuffUntil;delete c._aresTitanAtkLost;
  }
 });
}
async function aresOnSummon(side,i,c){
 if(!aresIsBoss()||side!=='e'||!c)return;
 if(c.effect==='aresWarFormation'){aresApplyFormation();toast('FORMACIÓN DE GUERRA: las tropas de Ares reciben +700 ATK/DEF.')}
 if(c.effect==='aresTitanicImpact'){
  phpv=Math.max(0,phpv-1000);damageFx(1000,'p');
  playerCards.forEach(x=>{if(!x)return;x.atk=Math.max(0,x.atk-500);x._aresTitanAtkLost=(x._aresTitanAtkLost||0)+500;x._aresTitanDebuffUntil=turnNo+1});
  if(window.nemesisAresPhaseFor?.(ehpv)?.id===3&&!c._aresPhase3Titan){c.atk+=1500;c._aresPhase3Titan=true}
  toast('IMPACTO TITÁNICO: 1.000 de daño directo y -500 ATK al ejército rival.');
 }
}
function aresOnDestroyed(side,victim){
 if(!aresIsBoss()||side!=='e'||!victim)return;
 if(['aresFrontLine','aresWarFormation'].includes(victim.effect))aresGainFury(1,`${victim.name} fue destruido`);
 if(victim.effect==='aresWarFormation')aresApplyFormation();
}
function aresOnCombatParticipation(side,i){
 if(!aresIsBoss()||side!=='e')return;
 const c=enemyCards[i];if(c?.effect==='aresBloodThirst'){c.atk+=500;c._aresBloodBonus=(c._aresBloodBonus||0)+500;toast(`${c.name}: SED DE GUERRA +500 ATK permanente.`)}
}
async function aresOnKill(side,i,victim){
 if(!aresIsBoss()||side!=='e')return;
 const c=enemyCards[i];if(!c)return;
 if(c.effect==='aresBloodThirst')aresGainFury(1,`${c.name} destruyó una criatura`);
 if(c.effect==='aresThreeMaws')aresGainFury(1,`${c.name} destruyó una criatura`);
 if(c.effect==='aresTitanicImpact')aresGainFury(2,`${c.name} destruyó una criatura`);
}
async function aresCerberusSecondAttack(i,firstKilled=false){
 if(!aresIsBoss())return false;if(olympusConsumeExtraAttackSeal('el segundo ataque de Cerbero'))return true;
 const c=enemyCards[i];if(!c||c.effect!=='aresThreeMaws'||c._aresSecondAttackTurn===turnNo)return false;
 const cost=firstKilled?1:2;if(aresFury()<cost||!aresSpendFury(cost))return false;
 c._aresSecondAttackTurn=turnNo;toast(`TRES FAUCES: segundo ataque por ${cost} Furia.`);
 const targets=playerCards.map((x,j)=>x?j:-1).filter(j=>j>=0);
 if(!targets.length){if(playerDirectShieldUntil>=turnNo){toast('El escudo bloquea el segundo ataque directo.');return true}phpv=Math.max(0,phpv-c.atk);damageFx(c.atk,'p');update();return true}
 const t=targets.slice().sort((x,y)=>(playerModes[x]==='DEFENSA'?playerCards[x].def:playerCards[x].atk)-(playerModes[y]==='DEFENSA'?playerCards[y].def:playerCards[y].atk))[0];
 await resolveBattle('e',i,'p',t);return true;
}

window.nemesisAresDeckIds=function(){return ARES_CARDS_1_5.map(c=>c.id)};
window.nemesisStartAresPartialDuel=function(){
 window.NEMESIS_ARES_DUEL_ACTIVE=true;
 if(window.NEMESIS_ARES){window.NEMESIS_ARES.fury=0;window.NEMESIS_ARES.hp=30000}
 return {boss:'Ares — Dios de la Guerra',hp:30000,deck:window.nemesisAresDeckIds(),partial:true,version:'18.9.64'};
};


// ================================================================
// V18.9.65 — ARES 12/12 · MODO DIOS COMPLETO
// ================================================================
let aresLastPhase=1,aresBannerTurn=-1,aresBannerDrawTurn=-1,aresSupremeDestroyTurn=-1,aresEyeUsed=false;
function aresPhase(){return !aresIsBoss()?1:(ehpv>20000?1:ehpv>8000?2:3)}
function aresPhaseName(p){return p===1?'ESTRATEGA DEL OLIMPO':p===2?'DIOS DE LA GUERRA':'BESTIA DIVINA DE ARES'}
function aresSyncPhase(){
 if(!aresIsBoss())return;const p=aresPhase();window.NEMESIS_ARES.hp=ehpv;
 if(p===aresLastPhase)return;aresLastPhase=p;bossPhaseLevel=p;
 const badge=document.getElementById('bossPhaseBadge');if(badge){badge.innerHTML=`<small>ARES · FASE ${p}</small><b>${aresPhaseName(p)}</b><span>${p===2?'ARMAS + COMBOS + CAMPO FRACTURADO':'IA OFENSIVA TOTAL · BUSCA LETAL'}</span>`}
 document.body.classList.remove('ares-phase-1','ares-phase-2','ares-phase-3');document.body.classList.add(`ares-phase-${p}`);
 toast(`ARES CAMBIA DE FASE — ${aresPhaseName(p)}`);pcLog(`TRANSICIÓN CINEMATOGRÁFICA: ${aresPhaseName(p)}.`,'effect');
 if(p===2){window.nemesisShowAresFieldWarning?.({warning:'FASE II · DIOS DE LA GUERRA',desc:'La arena se fractura. Ares prioriza armas, combos y presión.'});aresGainFury(2,'inicio de Fase II')}
 if(p===3){window.nemesisShowAresFieldWarning?.({warning:'FASE III · BESTIA DIVINA',desc:'Ares deja de conservar recursos y busca una combinación letal.'});aresGainFury(3,'transformación Bestia Divina');enemyCards.forEach(c=>{if(c?.effect==='aresTitanicImpact'&&!c._aresPhase3Titan){c.atk+=1500;c._aresPhase3Titan=true}})}
}
function aresBestEquipTarget(){return enemyCards.map((c,i)=>({c,i})).filter(o=>o.c&&o.c.type!=='magic').sort((x,y)=>(y.c.atk+y.c.def)-(x.c.atk+x.c.def))[0]}
function aresHasEquipment(effect){return enemyCards.some(c=>{const sl=nemesisEquipmentSlots(c);return sl&&Object.values(sl).some(e=>e?.sourceEffect===effect)})}
async function aresEquipCard(card,kind,opts){
 const pick=aresBestEquipTarget();if(!pick)return false;nemesisEquip('e',pick.i,kind,card,opts);return true
}
function aresBannerActive(){return aresHasEquipment('aresWarBanner')}
function aresApplyBannerAura(){
 const active=aresBannerActive();
 enemyCards.forEach(c=>{if(!c||c.family!=='ares')return;const oa=c._aresBannerAtk||0,od=c._aresBannerDef||0;
  c.atk=Math.max(0,c.atk-oa);c.def=Math.max(0,c.def-od);c._aresBannerAtk=0;c._aresBannerDef=0;
  if(active){c._aresBannerAtk=Math.round(c.atk*.20);c._aresBannerDef=Math.round(c.def*.20);c.atk+=c._aresBannerAtk;c.def+=c._aresBannerDef}
 })
}
function aresStartTurnPowers(){
 if(!aresIsBoss())return;aresSyncPhase();aresApplyFormation();aresApplyBannerAura();
 if(aresBannerActive()&&aresBannerTurn!==turnNo){aresBannerTurn=turnNo;aresGainFury(1,'Presencia de la Guerra')}
 const ev=window.nemesisAresFieldEvent?.(turnNo);if(ev)pcLog(`EVENTO DE CAMPO: ${ev.name}.`,'effect');
}
async function aresMagic(card){
 if(!aresIsBoss())return false;
 if(card.effect==='aresOlympusBreaker'){const ok=await aresEquipCard(card,'weapon',{atkBonus:2500});if(ok)toast('LANZA ROMPE-OLIMPOS: +2.500 ATK.');return ok}
 if(card.effect==='aresDivineArmor'){const ok=await aresEquipCard(card,'armor',{defBonus:2500,flag:'_aresDivineArmor'});if(ok)toast('CORAZA DIVINA: +2.500 DEF y Protección Divina.');return ok}
 if(card.effect==='aresWarBanner'){const ok=await aresEquipCard(card,'relic',{flag:'_aresWarBanner'});if(ok){aresApplyBannerAura();toast('ESTANDARTE DE ARES: aura +20% ATK/DEF y generación de Furia.')}return ok}
 if(card.effect==='aresWarEye'){
  if(aresEyeUsed)return false;const pick=aresBestEquipTarget();if(!pick)return false;aresEyeUsed=true;
  nemesisEquip('e',pick.i,'weapon',card,{atkBonus:3500,flag:'_aresWarEye'});aresGainFury(3,'Ojo de la Guerra');
  const victims=playerCards.map((c,i)=>({c,i})).filter(o=>o.c).sort((x,y)=>(x.c.atk||0)-(y.c.atk||0)).slice(0,2);
  for(const v of victims)await destroyCard('p',v.i);
  phpv=Math.max(0,phpv-4000);damageFx(4000,'p');toast('MIRADA ANIQUILADORA: 4.000 daño directo y hasta 2 cartas destruidas.');
  nemesisUnequip('e',pick.i,'weapon',{broken:true,toGrave:true,reason:'uso único completado'});update();return true
 }
 return false
}
async function aresSpecialSummon(i,c){
 if(!aresIsBoss()||!c)return;
 if(c.effect==='aresWarStorm'){
  for(let j=0;j<playerCards.length;j++)if(playerCards[j]&&playerCards[j].atk<3000)await destroyCard('p',j);
  phpv=Math.max(0,phpv-2000);damageFx(2000,'p');enemyCards.forEach(x=>{if(x&&x.family==='ares'){x.atk+=500;x.def+=500}});toast('TORMENTA DE GUERRA: purga tropas débiles, 2.000 daño directo y +500 ATK/DEF a Ares.')
 }
 if(c.effect==='aresSiegeRam'){
  if(!c._aresCostPaid){if(aresFury()<3){c._aresDormant=true;toast('CARNERO: Furia insuficiente; queda contenido.');return}aresSpendFury(3);c._aresCostPaid=true}
  for(let j=0;j<playerCards.length;j++)if(playerCards[j]){playerCards[j].atk=Math.max(0,playerCards[j].atk-2500);playerCards[j]._aresRamLoss=(playerCards[j]._aresRamLoss||0)+2500}
  toast('EMBESTIDA DEVASTADORA: 2.500 de impacto al ejército rival.')
 }
 if(c.effect==='aresSupremeWrath'){
  if(aresPhase()<3){c._aresSealed=true;toast('ARES ANCESTRAL queda sellado hasta Fase III.');return}
  aresGainFury(5,'Invocación definitiva');phpv=Math.max(0,phpv-6000);damageFx(6000,'p');
  enemyCards.forEach(x=>{if(x&&x!==c&&x.family==='ares'){x.atk+=1000;x.def+=1000}});
  toast('IRA SUPREMA DE ARES: 6.000 daño directo · ejército +1.000 ATK/DEF.');pcLog('INVOCACIÓN DEFINITIVA — ARES, EL ÚLTIMO DIOS DEL CAOS.','effect')
 }
}
function aresAttackDefense(defSide,di,def){
 if(!aresIsBoss()||defSide!=='p')return def;const atk=enemyCards[enemySlot];
 if(atk?.effect==='aresSiegeRam')return Math.round(def*.5);
 if(atk?._aresWarEye)return Math.round(def*.7);
 return def
}


// V18.9.66 — MOTOR ESTRATÉGICO OLIMPO
let olympusHermesUsed=false,olympusCouncilUsed=false,olympusAscensionUsed=false;
let olympusFusionGuardCharges=0,olympusAthenaProtectedId=null,olympusAthenaProtectedTurn=-1;

function olympusMaterialIds(){return ['dios-jupiter','zeus-emperador-rayo','kronos-devorador-tiempo']}
function olympusPresentIds(){return new Set([...playerCards.filter(Boolean),...playerQueue.filter(Boolean)].map(c=>c.id))}
function olympusMissingMaterial(){const have=olympusPresentIds();return olympusMaterialIds().find(id=>!have.has(id))||null}
function olympusPullMaterial(id){
 if(!id)return false;
 let q=playerQueue.findIndex(c=>c?.id===id);
 if(q>=0)return true;
 const c=card(id);if(!c)return false;playerQueue.unshift({...c});toast(`${c.name} responde al llamado del OLIMPO.`);return true
}
function olympusChooseProtection(){
 const preferred=['dios-jupiter','zeus-emperador-rayo','kronos-devorador-tiempo','apolo-guardian-solar'];
 const c=preferred.map(id=>playerCards.find(x=>x?.id===id)).find(Boolean)||playerCards.find(x=>x&&(x.tags?.includes('divine')||x.family==='olimpo'));
 if(c){olympusAthenaProtectedId=c.id;olympusAthenaProtectedTurn=turnNo;toast(`ÉGIDA DIVINA protege a ${c.name} este turno.`)}
}
async function olympusOnSummon(side,i,c){
 if(side!=='p'||!c)return;
 if(c.effect==='athenaAegis'){olympusChooseProtection()}
 if(c.effect==='poseidonTide'){
   // Devuelve equipamiento rival sin destruirlo: rompe enlace visual/bono pero no dispara efecto de destrucción.
   let done=false;
   for(let j=0;j<enemyCards.length&&!done;j++){const sl=nemesisEquipmentSlots(enemyCards[j]);if(!sl)continue;for(const k of ['weapon','armor','relic'])if(sl[k]){nemesisUnequip('e',j,k,{broken:false,toGrave:false,reason:'Maremoto Olímpico'});done=true;break}}
   if(done)toast('MAREMOTO OLÍMPICO devuelve un equipamiento rival sin activar su destrucción.');
 }
 if(c.effect==='hermesSpeed'&&!olympusHermesUsed){olympusHermesUsed=true;const miss=olympusMissingMaterial();if(miss)olympusPullMaterial(miss);toast('VELOCIDAD DIVINA: Hermes acelera la preparación de la Fusión.')}
}
function olympusPreventDestroy(side,victim){
 if(side!=='p'||!victim)return false;
 if(victim.id===olympusAthenaProtectedId&&olympusAthenaProtectedTurn===turnNo){toast(`ÉGIDA DIVINA: ${victim.name} evita la destrucción.`);return true}
 const sl=nemesisEquipmentSlots(victim);
 if(sl?.armor?.sourceEffect==='olympusAegisArmor'&&!victim._olympusAegisSpent){
   victim._olympusAegisSpent=true;
   const idx=playerCards.indexOf(victim);nemesisUnequip('p',idx,'armor',{broken:true,toGrave:true,reason:'Protección del Olimpo'});
   toast(`ÉGIDA DEL OLIMPO se sacrifica por ${victim.name}.`);return true
 }
 return false
}
async function olympusMagic(side,c){
 if(side!=='p'||!c)return false;
 if(c.effect==='olympusAegisArmor'){
   const i=playerCards.findIndex(x=>x&&(x.tags?.includes('divine')||x.family==='olimpo'||olympusMaterialIds().includes(x.id)));
   if(i<0)return false;nemesisEquip('p',i,'armor',c,{defBonus:2000,flag:'_olympusAegis'});toast('ÉGIDA DEL OLIMPO: +2.000 DEF.');return true
 }
 if(c.effect==='olympusMasterBolt'){
   const i=playerCards.map((x,j)=>({x,j})).filter(o=>o.x&&(o.x.tags?.includes('divine')||o.x.family==='olimpo'||olympusMaterialIds().includes(o.x.id))).sort((a,b)=>b.x.atk-a.x.atk)[0]?.j;
   if(i==null)return false;nemesisEquip('p',i,'weapon',c,{atkBonus:2500,flag:'_olympusMasterBolt'});toast('RAYO MAESTRO: +2.500 ATK.');return true
 }
 if(c.effect==='olympusCouncil'&&!olympusCouncilUsed){
   olympusCouncilUsed=true;const miss=olympusMissingMaterial();
   if(miss)olympusPullMaterial(miss);else{olympusFusionGuardCharges=Math.max(olympusFusionGuardCharges,1);toast('CONSEJO DE LOS DIOSES: la primera anulación de Fusión será bloqueada.')}
   return true
 }
 if(c.effect==='olympusAscension'&&!olympusAscensionUsed){
   const have=olympusPresentIds();if(!olympusMaterialIds().every(id=>have.has(id))){toast('ASCENSIÓN requiere Júpiter + Zeus + Kronos disponibles.');return false}
   olympusAscensionUsed=true;olympusFusionGuardCharges=Math.max(olympusFusionGuardCharges,1);playerFusionProtectionUntil=Math.max(playerFusionProtectionUntil,turnNo);
   toast('ASCENSIÓN DEL OLIMPO: FUSIÓN DIVINA protegida.');pcLog('Ascensión del Olimpo protege la Invocación del Titán.','effect');return true
 }
 return false
}
function olympusOnPlayerAttack(i){
 const c=playerCards[i];if(!c)return;
 if(c.effect==='poseidonTide'){enemyCards.forEach(x=>{if(x){x.atk=Math.max(0,x.atk-500);x._poseidonLoss=(x._poseidonLoss||0)+500;x._poseidonLossUntil=turnNo}});toast('MAREMOTO: -500 ATK al ejército rival durante este turno.')}
}
function olympusRestoreTide(){enemyCards.forEach(x=>{if(x&&x._poseidonLoss&&x._poseidonLossUntil<turnNo){x.atk+=x._poseidonLoss;delete x._poseidonLoss;delete x._poseidonLossUntil}})}

window.NEMESIS_OLIMPO={deckIds:OLIMPO_DECK_IDS.slice(),fusion:'titan-del-olimpo',materials:olympusMaterialIds(),strategy:'buscar → proteger → controlar equipamiento → Fusión Divina'};

// V18.9.68 — SINERGIA DEL OLIMPO
let olympusSynergyState={storm:false,bastion:false,eternal:false};
let olympusStormCharges=0,olympusBastionCharges=0,olympusEternalUsed=false,olympusCancelExtraAttack=false;
function olympusFieldHas(id){return playerCards.some(c=>c&&c.id===id)}
function olympusDivineOnField(){
 const ids=['dios-jupiter','zeus-emperador-rayo','kronos-devorador-tiempo','apolo-guardian-solar','olimpo-atenea','olimpo-poseidon','olimpo-hermes','titan-del-olimpo'];
 return playerCards.filter(c=>c&&ids.includes(c.id))
}
function olympusPair(a,b){return olympusFieldHas(a)&&olympusFieldHas(b)}
function olympusFusionReadyVisible(){return olympusMaterialIds().every(olympusFieldHas)}
function olympusEvaluateSynergies(){
 const storm=olympusPair('zeus-emperador-rayo','olimpo-poseidon');
 const bastion=olympusPair('olimpo-atenea','apolo-guardian-solar');
 const eternal=olympusPair('olimpo-hermes','kronos-devorador-tiempo');
 if(storm&&!olympusSynergyState.storm){olympusStormCharges=2;toast('SINERGIA · TORMENTA DEL OLIMPO: Zeus + Poseidón cargan 2 descargas celestiales.');pcLog('Sinergia activada: TORMENTA DEL OLIMPO.','effect')}
 if(bastion&&!olympusSynergyState.bastion){olympusBastionCharges=1;toast('SINERGIA · BASTIÓN CELESTIAL: Atenea + Apolo preparan una protección absoluta.');pcLog('Sinergia activada: BASTIÓN CELESTIAL.','effect')}
 if(eternal&&!olympusSynergyState.eternal&&!olympusEternalUsed){
   olympusEternalUsed=true;olympusCancelExtraAttack=true;
   if(deckQueue.length){const id=deckQueue.shift();handState.push(id);renderHand();toast(`INSTANTE ETERNO: Hermes + Kronos roban ${card(id)?.name||'1 carta'} y sellan el próximo ataque adicional enemigo.`)}
   else toast('INSTANTE ETERNO: Hermes + Kronos sellan el próximo ataque adicional enemigo.');
   pcLog('Sinergia activada: INSTANTE ETERNO.','effect')
 }
 olympusSynergyState={storm,bastion,eternal};
}
function olympusSynergyAttack(attSide,ai){
 if(attSide!=='p'||olympusStormCharges<=0||!olympusSynergyState.storm)return 0;
 const c=playerCards[ai];if(!c||!['zeus-emperador-rayo','olimpo-poseidon'].includes(c.id))return 0;
 olympusStormCharges--;const dmg=700;ehpv=Math.max(0,ehpv-dmg);damageFx(dmg,'e');
 toast(`TORMENTA DEL OLIMPO: descarga encadenada de ${dmg} HP.`);pcLog(`${c.name} libera una descarga de Tormenta del Olimpo.`,'effect');return dmg
}
function olympusSynergyPreventDestroy(side,victim){
 if(side==='p'&&victim&&olympusBastionCharges>0&&olympusSynergyState.bastion&&(victim.tags?.includes('divine')||victim.family==='olimpo'||olympusMaterialIds().includes(victim.id)||victim.id==='apolo-guardian-solar')){
   olympusBastionCharges--;toast(`BASTIÓN CELESTIAL evita la destrucción de ${victim.name}.`);pcLog(`Bastión Celestial protege a ${victim.name}.`,'effect');return true
 }
 return false
}
function olympusConsumeExtraAttackSeal(source='ataque adicional'){
 if(!olympusCancelExtraAttack)return false;
 olympusCancelExtraAttack=false;toast(`INSTANTE ETERNO cancela ${source}.`);pcLog(`Instante Eterno cancela ${source}.`,'effect');return true
}

// ZONA DEL OLIMPO — visual, sin otorgar estadísticas automáticas.
function olympusEnsureZone(){
 let z=document.getElementById('olympus-zone-hud');
 if(z)return z;
 z=document.createElement('div');z.id='olympus-zone-hud';
 z.innerHTML='<div class="olympus-zone-temple">Ω</div><div><small>ZONA DEL OLIMPO</small><b>LATENTE</b><span>0 dioses en campo</span></div><div class="olympus-zone-portal"></div>';
 document.querySelector('.battle')?.appendChild(z);return z
}
function olympusUpdateZone(){
 const z=olympusEnsureZone();if(!z)return;
 const gods=olympusDivineOnField(),n=gods.length,ready=olympusFusionReadyVisible();
 z.classList.toggle('awake',n>=2);z.classList.toggle('temple',n>=3);z.classList.toggle('fusion-ready',ready);
 const b=z.querySelector('b'),sp=z.querySelector('span');
 if(ready){b.textContent='PORTAL DE FUSIÓN ABIERTO';sp.textContent='JÚPITER + ZEUS + KRONOS LISTOS'}
 else if(n>=3){b.textContent='TEMPLO CELESTIAL MANIFESTADO';sp.textContent=`${n} dioses · energía máxima visual`}
 else if(n>=2){b.textContent='OLIMPO DESPIERTA';sp.textContent=`${n} dioses · escenario reaccionando`}
 else{b.textContent='LATENTE';sp.textContent=`${n} dios${n===1?'':'es'} en campo`}
}

// IA MODO DIOS solo usa información pública: cartas visibles en el Campo.
// Nunca inspecciona la mano para decidir a quién atacar.
function olympusAiPublicRead(){
 const visible=playerCards.filter(Boolean),materials=visible.filter(c=>olympusMaterialIds().includes(c.id));
 const distractions=visible.filter(c=>['olimpo-atenea','olimpo-poseidon','apolo-guardian-solar'].includes(c.id));
 return {visibleMaterials:materials.length,fusionThreat:materials.length>=2,fusionReady:materials.length===3,
         hermesVisible:visible.some(c=>c.id==='olimpo-hermes'),distractions:distractions.map(c=>c.id)}
}
window.NEMESIS_OLIMPO.aiPublicRead=olympusAiPublicRead;

// Ventana visual del rival antes de una FUSIÓN DIVINA.
// La IA solo puede ANULAR si realmente posee un efecto de negación visible/disponible.
async function olympusFusionResponseWindow(protectedActivation=false){
 const negator=enemyCards.find(c=>c&&(c.effect==='negateMagic'||c.effect==='ghostGodEye'))||((window.__nemesisGhostEyeCharges||0)>0?{name:'Ojo del Dios Fantasma',effect:'ghostGodEye'}:null);
 return await new Promise(resolve=>{
  const old=document.getElementById('olympus-fusion-response');if(old)old.remove();
  const d=document.createElement('div');d.id='olympus-fusion-response';
  d.innerHTML=`<section><small>VENTANA DE RESPUESTA RIVAL</small><h2>FUSIÓN DIVINA</h2><div class="fusion-response-actions"><button>RESPONDER</button><button>ANULAR</button><button>DEJAR PASAR</button></div><p>La IA evalúa únicamente amenazas visibles del Campo.</p></section>`;
  document.body.appendChild(d);requestAnimationFrame(()=>d.classList.add('show'));
  setTimeout(()=>{
    let allow=true;
    if(protectedActivation){d.querySelectorAll('button')[2].classList.add('chosen');pcChainLog('Protección Olímpica obliga al rival a DEJAR PASAR la Fusión.')}
    else if(negator){d.querySelectorAll('button')[1].classList.add('chosen');allow=false;pcChainLog(`${negator.name||'Respuesta rival'} intenta ANULAR la Fusión Divina.`)}
    else{d.querySelectorAll('button')[2].classList.add('chosen');pcChainLog('El rival DEJA PASAR la Fusión Divina.')}
    setTimeout(()=>{d.classList.add('out');setTimeout(()=>{d.remove();resolve(allow)},180)},520)
  },620)
 })
}

// PC ULTRA: secuencia previa a la animación 3D original.
// No sustituye fusionAnim; la precede y luego el motor original resuelve materiales/resultado.
async function olympusFusionUltraCinematic(slots,result){
 const ids=olympusMaterialIds(),cards=ids.map(id=>card(id)),titan=result||card('titan-del-olimpo');
 const old=document.getElementById('olympus-fusion-ultra');if(old)old.remove();
 const d=document.createElement('div');d.id='olympus-fusion-ultra';
 d.innerHTML=`<div class="ofu-sky"></div><div class="ofu-ring"></div><div class="ofu-title"><small>INVOCACIÓN SUPREMA</small><b>FUSIÓN DIVINA DEL OLIMPO</b></div>
 <div class="ofu-materials">${cards.map((c,i)=>`<figure style="--i:${i}"><img src="${c.img}"><figcaption>${c.name}</figcaption></figure>`).join('')}</div>
 <div class="ofu-titan"><img src="${titan.img}"><b>TITÁN DEL OLIMPO</b><span>20.000 ATK · 15.000 DEF</span></div>`;
 document.body.appendChild(d);document.body.classList.add('olympus-fusion-active');requestAnimationFrame(()=>d.classList.add('phase1'));
 pcLog('Júpiter, Zeus y Kronos abandonan sus ranuras para la Zona de Fusión.','effect');
 await wait(700);d.classList.add('phase2');sfx('thunder');await wait(760);d.classList.add('phase3');v1892ScreenShake();await wait(850);
 d.classList.add('out');await wait(220);d.remove();document.body.classList.remove('olympus-fusion-active')
}



// V18.9.70 — MOTOR BASE HADES 5/12
let hadesObols=0,hadesTartarus=[],hadesThreeGatesTurn=-1,hadesFerrymanTurn=-1,hadesObolGainTurn=-1,hadesNightUntil=-1,hadesMarked=null;
function hadesIsCard(c){return !!c&&c.family==='hades'}
function hadesTartarusSend(c,owner='p',reason='Tártaro'){
 if(!c)return false;
 hadesTartarus.push({card:{...c},owner,turn:turnNo,reason});
 pcLog(`${c.name} es enviado al TÁRTARO (${reason}).`,'effect');toast(`${c.name} → TÁRTARO`);
 // Caronte: solo la primera entrada por turno genera Óbolo.
 if(enemyCards.some(x=>x?.id==='hades-caronte')&&hadesObolGainTurn!==turnNo){hadesObolGainTurn=turnNo;hadesObols++;toast(`CARONTE cobra el viaje · ÓBOLOS ${hadesObols}`)}
 return true
}
function hadesGraveSelectionBlocked(side){return side==='p'&&turnNo<=hadesNightUntil}
function hadesTryInterceptRevive(side,c){
 if(side!=='p'||!c)return false;
 if(enemyCards.some(x=>x?.id==='hades-cerbero')&&hadesThreeGatesTurn!==turnNo){
   hadesThreeGatesTurn=turnNo;hadesTartarusSend(c,'p','TRES PUERTAS');toast('CERBERO bloquea la salida del Cementerio.');return true
 }
 return false
}
function hadesBestPlayerTarget(){
 return playerCards.map((c,i)=>({c,i,score:c?(c.atk+c.def+(olympusMaterialIds().includes(c.id)?3500:0)): -1})).sort((a,b)=>b.score-a.score)[0]
}
async function hadesOnSummon(side,i,c){
 if(side!=='e'||!hadesIsCard(c))return;
 if(c.effect==='hadesTwoWorlds'){
   const own=hadesTartarus.filter(x=>x.owner==='e');
   const threat=hadesBestPlayerTarget();
   if(own.length&&(!threat?.c||ehpv<12000)){
     const x=own.pop(),idx=hadesTartarus.indexOf(x);if(idx>=0)hadesTartarus.splice(idx,1);enemyGrave.push(x.card);toast(`PERSÉFONE devuelve ${x.card.name} del Tártaro al Cementerio.`)
   }else if(threat?.c){threat.c.atk=Math.max(0,threat.c.atk-1500);threat.c._persephoneLoss=(threat.c._persephoneLoss||0)+1500;threat.c._persephoneUntil=turnNo+2;toast(`PERSÉFONE debilita a ${threat.c.name} · -1.500 ATK / 2 turnos.`)}
 }
 if(c.effect==='hadesDeathSentence'){
   const t=hadesBestPlayerTarget();if(t?.c){hadesMarked={id:t.c.id,index:t.i,turn:turnNo};toast(`THANATOS marca a ${t.c.name} con SENTENCIA MORTAL.`)}
 }
 if(c.effect==='hadesEternalNight'){hadesNightUntil=turnNo+1;toast('NYX cubre el duelo con NOCHE ETERNA · Cementerio rival bloqueado 1 turno.')}
}
function hadesAfterPlayerDamaged(i){
 const c=playerCards[i];if(!c||!hadesMarked||hadesMarked.turn!==turnNo||hadesMarked.id!==c.id)return false;
 if((c.def||0)<=2000){hadesTartarusSend(c,'p','SENTENCIA MORTAL');playerCards[i]=null;hadesMarked=null;toast('THANATOS ejecuta SENTENCIA MORTAL.');return true}
 return false
}
function hadesFerrymanAi(){
 const caronte=enemyCards.find(c=>c?.id==='hades-caronte');if(!caronte||hadesFerrymanTurn===turnNo||hadesObols<2||!enemyGrave.length)return false;
 const best=enemyGrave.slice().sort((a,b)=>(b.atk+b.def)-(a.atk+a.def))[0];if(!best)return false;
 const gi=enemyGrave.indexOf(best);enemyGrave.splice(gi,1);enemyQueue.unshift({...best});hadesObols-=2;hadesFerrymanTurn=turnNo;toast(`CARONTE paga 2 Óbolos y recupera ${best.name}.`);return true
}
window.NEMESIS_HADES_ENGINE={get obols(){return hadesObols},get tartarus(){return hadesTartarus.slice()},graveBlocked:hadesGraveSelectionBlocked,status:'5/12 cartas funcionales'};


// V18.9.71 — HADES 12/12 · MOTOR DE JEFE
let hadesPhase=1,hadesPortalCounters=0,hadesCoinUsed=false,hadesCoinAvailable=false,hadesPortalActive=false,hadesChainsArmed=false,hadesSleep=null,hadesGuilt=null,hadesDominionTurn=-1,hadesThresholdUsedTurn=-1;
function hadesIsBoss(){return opponent==='hades'}
function hadesSyncPhase(){if(!hadesIsBoss())return;const p=ehpv<=9000?3:ehpv<=21000?2:1;if(p===hadesPhase)return;hadesPhase=p;document.body.dataset.hadesPhase=String(p);const n=['','REY DEL INFRAMUNDO','SEÑOR DEL TÁRTARO','HADES DESENCADENADO'][p];toast(`HADES · FASE ${p} — ${n}`);pcLog(`Cambio de fase: ${n}.`,'effect');sfx('boss');v1892ScreenShake()}
function hadesPay(n){if(hadesObols>=n){hadesObols-=n;return true}if(!hadesCoinUsed&&hadesCoinAvailable&&hadesObols+2>=n){const need=Math.max(0,n-hadesObols);hadesCoinUsed=true;hadesCoinAvailable=false;hadesObols=0;toast(`MONEDA NEGRA cubre ${need} Óbolo(s) y se sacrifica.`);pcLog('Moneda Negra de Caronte fue sacrificada.','effect');return true}return false}
function hadesDominionAi(){if(!hadesIsBoss()||hadesDominionTurn===turnNo||!enemyCards.some(c=>c?.id==='hades-soberano')||hadesObols<3||!playerGrave?.length)return false;const best=playerGrave.slice().sort((a,b)=>((olympusMaterialIds().includes(b.id)?5000:0)+(b.atk||0)+(b.def||0))-((olympusMaterialIds().includes(a.id)?5000:0)+(a.atk||0)+(a.def||0)))[0];hadesObols-=3;hadesDominionTurn=turnNo;playerGrave.splice(playerGrave.indexOf(best),1);return hadesTartarusSend(best,'p','DOMINIO DEL INFRAMUNDO')}

async function hadesApplySupport(c){
 if(!isHades||!c)return false;
 if(c.effect==='hadesBlackCoin'){if(hadesCoinAvailable||hadesCoinUsed)return true;hadesCoinAvailable=true;hadesObols++;toast(`MONEDA NEGRA: +1 Óbolo · total ${hadesObols}.`);return true}
 if(c.effect==='hadesChains'){hadesChainsArmed=true;toast('CADENAS ETERNAS DEL TÁRTARO preparadas.');return true}
 if(c.effect==='hadesPortal'){if(hadesPortalActive)return true;if(!hadesPay(3))return false;hadesPortalActive=true;hadesPortalCounters=1;toast('PORTAL DEL TÁRTARO: 1 contador.');return true}
 return false
}
function hadesPortalTick(){
 if(!isHades||!hadesPortalActive)return;
 if(hadesPortalCounters<6)hadesPortalCounters++;
 if(hadesPortalCounters>=3){playerCards.forEach(c=>{if(!c)return;if(!c._hadesPortalBase)c._hadesPortalBase={atk:c.atk,def:c.def};c.atk=Math.max(0,c._hadesPortalBase.atk-500*hadesPortalCounters);c.def=Math.max(0,c._hadesPortalBase.def-500*hadesPortalCounters)})}
 if(hadesPortalCounters>=6&&!enemyCards.some(c=>c?.id==='hades-soberano')){const slot=enemyCards.findIndex(x=>!x),h=card('hades-soberano');if(slot>=0&&h){enemyCards[slot]={...h};enemyModes[slot]='ATAQUE';enemyRevealed[slot]=false;hadesPortalCounters=0;place('e',slot,enemyCards[slot]).then(()=>hadesOnSummon('e',slot,enemyCards[slot])).catch(()=>{});toast('PORTAL DEL TÁRTARO invoca a HADES — SOBERANO DEL TÁRTARO.')}}
}
function hadesThresholdAi(){
 if(!isHades||hadesThresholdUsedTurn===turnNo||!enemyCards.some(c=>c?.effect==='hadesThresholdWatch'))return false;
 const targets=[];playerCards.forEach((c,i)=>{const slots=nemesisEquipmentSlots(c);if(slots)for(const kind of ['weapon','armor','relic'])if(slots[kind])targets.push({i,kind,label:slots[kind].label})});
 if(!targets.length)return false;const t=targets[0];hadesThresholdUsedTurn=turnNo;nemesisUnequip('p',t.i,t.kind,{broken:true,toGrave:true,reason:'Vigilancia del Umbral'});toast(`CERBERO DEL UMBRAL destruye ${t.label}.`);return true
}
function hadesChainsInterceptFusion(slots){
 if(!isHades||!hadesChainsArmed||!slots?.length)return false;
 const target=slots.map(i=>({i,c:playerCards[i]})).filter(x=>x.c).sort((a,b)=>(b.c.atk+b.c.def)-(a.c.atk+a.c.def))[0];
 if(!target)return false;hadesChainsArmed=false;target.c._hadesChainedUntil=turnNo+1;toast(`CADENAS ETERNAS retienen a ${target.c.name}. La Fusión no puede completarse.`);return true
}

function hadesControlAi(){if(!hadesIsBoss())return;hadesSyncPhase();hadesPortalTick();hadesThresholdAi();if(enemyCards.some(c=>c?.effect==='hadesDeepSleep')&&(!hadesSleep||turnNo>hadesSleep.until)&&hadesPay(2)){const t=hadesBestPlayerTarget();if(t?.c){t.c._hadesSleepUntil=turnNo+2;hadesSleep={id:t.c.id,until:turnNo+2};toast(`HYPNOS duerme a ${t.c.name}.`)}}if(enemyCards.some(c=>c?.effect==='hadesGuiltWhip')&&!hadesGuilt&&hadesPay(2)){const t=hadesBestPlayerTarget();if(t?.c){t.c._hadesGuilt=true;hadesGuilt={id:t.c.id,index:t.i,last:turnNo};toast(`ERINIAS marca a ${t.c.name}.`)}}if(hadesGuilt&&hadesGuilt.last!==turnNo){const c=playerCards[hadesGuilt.index];if(c&&c.id===hadesGuilt.id){c.atk=Math.max(0,c.atk-800);hadesGuilt.last=turnNo}else hadesGuilt=null}hadesDominionAi();hadesFerrymanAi()}
function hadesCanAct(c){return !(c&&((c._hadesSleepUntil||0)>=turnNo||c._hadesGuilt))}
function startHadesDuel(){return battle('hades')}
window.startHadesDuel=()=>battle('hades');


// V18.9.17 — CEMENTERIO 3D VISUAL AISLADO
// No modifica turnos, fases, busy, cartas lógicas ni resolución de combate.
const v18917GraveMeshes={p:[],e:[]};
function v18917SendVisualToGrave(side,sourceMesh){
 try{
  if(!sourceMesh||!sourceMesh.geometry)return;
  const clone=sourceMesh.clone();
  // clone materials so opacity/animation cannot affect the original card.
  if(Array.isArray(sourceMesh.material)) clone.material=sourceMesh.material.map(m=>m.clone());
  else if(sourceMesh.material) clone.material=sourceMesh.material.clone();

  clone.position.copy(sourceMesh.position);
  clone.rotation.copy(sourceMesh.rotation);
  clone.scale.set(.92,.92,.92);
  clone.visible=true;
  scene.add(clone);

  const pile=v18917GraveMeshes[side];
  const n=pile.length;
  pile.push(clone);

  // Lateral cemetery zones, outside the five combat slots.
  const tx=side==='p'?5.65:-5.65;
  const tz=side==='p'?6.45:-6.45;
  const ty=.22+(n*.045);

  // Purely visual animation; no await and no game-state dependency.
  const finish=()=>{
   clone.position.set(tx,ty,tz);
   clone.rotation.set(-Math.PI/2,0,side==='p'?0:Math.PI);
   clone.scale.set(.82,.82,.82);
  };

  if(window.gsap){
   gsap.timeline({onComplete:finish})
    .to(clone.position,{x:tx,y:3.2,z:tz,duration:.38,ease:'power1.out'})
    .to(clone.rotation,{y:clone.rotation.y+Math.PI*2,duration:.38,ease:'none'},0)
    .to(clone.position,{y:ty,duration:.30,ease:'power2.in'})
    .to(clone.rotation,{x:-Math.PI/2,z:side==='p'?0:Math.PI,duration:.12},'-=.10');
  }else finish();
 }catch(err){
  console.warn('Cementerio 3D visual omitido:',err);
 }
}

const deckQueue=state.deck.slice(0,11),handState=deckQueue.splice(0,5);

// V18.10.00 — CAMPO DE BATALLA HEROICO PC
const HEROIC={climaxP:0,climaxE:0,max:100,weather:'NEUTRAL',will:{storm:0,death:0,war:0},lastFormation:''};
function heroicStatus(c,type,turns,power=0){if(!c)return;c._heroicStatus=c._heroicStatus||[];const x=c._heroicStatus.find(v=>v.type===type);if(x){x.until=Math.max(x.until,turnNo+turns);x.power=Math.max(x.power,power)}else c._heroicStatus.push({type,until:turnNo+turns,power,tick:-1});toast(`${c.name} · ${type}`)}
function heroicHas(c,t){return !!c?._heroicStatus?.some(x=>x.type===t&&x.until>=turnNo)}
function heroicCanAct(c){return !!c&&!heroicHas(c,'ATURDIDO')&&!heroicHas(c,'CONGELADO')&&!heroicHas(c,'SILENCIO')}
function heroicGain(side,n,msg=''){const k=side==='p'?'climaxP':'climaxE';HEROIC[k]=Math.min(100,HEROIC[k]+n);if(msg&&n>=15)pcLog(`${side==='p'?'OLIMPO':'JEFE'} +${n} CLÍMAX · ${msg}`,'effect')}
function heroicFormation(){
 const a=playerCards.filter(Boolean),has=id=>a.some(c=>c.id===id),center=playerCards[2];
 if(has('poseidon')&&has('zeus'))return {id:'storm',name:'TORMENTA DEL OLIMPO'};
 if(has('atenea')&&has('apolo'))return {id:'bastion',name:'BASTIÓN CELESTIAL'};
 if(has('hermes')&&has('kronos'))return {id:'time',name:'INSTANTE ETERNO'};
 if(a.filter(c=>['jupiter','zeus','kronos','apolo','atenea','poseidon','hermes'].includes(c.id)).length>=3&&center&&['jupiter','zeus','kronos'].includes(center.id))return {id:'trident',name:'TRIDENTE OLÍMPICO'};
 return null
}
function heroicSync(){
 const f=heroicFormation(),id=f?.id||'';if(id&&id!==HEROIC.lastFormation){HEROIC.lastFormation=id;heroicGain('p',15,f.name);toast(`FORMACIÓN HEROICA · ${f.name}`)}if(!id)HEROIC.lastFormation='';
 const gods=playerCards.filter(c=>c&&['jupiter','zeus','kronos','apolo','atenea','poseidon','hermes'].includes(c.id)).length;document.body.dataset.heroicOlympus=String(gods)
}
function heroicAttack(side,a,d){
 if(!a)return;heroicGain(side,8,'Ataque heroico');
 if(side==='p'&&a.id==='poseidon'&&d){heroicStatus(d,'MOJADO',2);HEROIC.will.storm++}
 if(side==='p'&&['zeus','jupiter'].includes(a.id)&&d&&heroicHas(d,'MOJADO')){heroicStatus(d,'ATURDIDO',1);heroicGain('p',20,'TORMENTA DEL OLIMPO');HEROIC.will.storm+=2;toast('⚡ COMBO HEROICO · TORMENTA DEL OLIMPO');v1892ScreenShake()}
 if(isAres&&d&&aresPhase>=2){HEROIC.will.war++;if(HEROIC.will.war%3===0)heroicStatus(d,'QUEMADURA',2,500)}
 if(isHades&&d&&hadesPhase>=2){HEROIC.will.death++;if(HEROIC.will.death%3===0)heroicStatus(d,'MALDICION',2,350)}
}
function heroicTick(side){
 const arr=side==='p'?playerCards:enemyCards;arr.forEach(c=>{if(!c)return;c._heroicStatus=(c._heroicStatus||[]).filter(x=>x.until>=turnNo);c._heroicStatus.forEach(x=>{if(x.tick===turnNo)return;x.tick=turnNo;if(x.type==='QUEMADURA'){if(side==='p')phpv=Math.max(0,phpv-(x.power||400));else ehpv=Math.max(0,ehpv-(x.power||400))}if(x.type==='MALDICION'){c.atk=Math.max(0,c.atk-(x.power||300));c.def=Math.max(0,c.def-(x.power||300))}})})
}
function heroicClimax(side){
 const k=side==='p'?'climaxP':'climaxE';if(HEROIC[k]<100)return;HEROIC[k]=0;
 if(side==='p'){const gods=playerCards.filter(c=>c&&['jupiter','zeus','kronos','apolo','atenea','poseidon','hermes'].includes(c.id));if(gods.length>=3){gods.forEach(c=>{c.atk+=800;c.def+=800});toast('☀ CLÍMAX HEROICO · DOMINIO CELESTIAL')}else{phpv=Math.min(20000,phpv+1500);toast('CLÍMAX HEROICO · SEGUNDO ALIENTO')}v1892ScreenShake();return}
 if(isHades){playerCards.filter(Boolean).forEach(c=>heroicStatus(c,'MALDICION',2,400));hadesObols+=2;toast('☠ HADES · ECLIPSE DEL TÁRTARO');return}
 if(isAres){playerCards.filter(Boolean).forEach(c=>heroicStatus(c,'QUEMADURA',2,600));toast('🔥 ARES · GUERRA TOTAL');return}
 ehpv=Math.min(enemyMaxHp,ehpv+1200);toast('CLÍMAX DEL JEFE · VOLUNTAD INQUEBRANTABLE')
}
function heroicIntent(){
 const fusion=playerCards.filter(c=>c&&['jupiter','zeus','kronos'].includes(c.id)).length;
 const equip=playerCards.reduce((n,c)=>{const q=nemesisEquipmentSlots(c);return n+(q?['weapon','armor','relic'].filter(k=>q[k]).length:0)},0);
 return fusion>=2?'ROMPER FUSIÓN':equip>=2?'DESTRUIR EQUIPAMIENTO':playerGrave.filter(c=>(c?.atk||0)>=5000).length>=2?'CONTROLAR CEMENTERIO':phpv<=5000?'BUSCAR LETAL':'CONTROLAR CENTRO'
}
function heroicField(){
 HEROIC.weather=HEROIC.will.storm>=5?'TORMENTA DIVINA':HEROIC.will.death>=5?'ECLIPSE DEL INFRAMUNDO':HEROIC.will.war>=5?'CIELO DE GUERRA':'NEUTRAL';document.body.dataset.heroicWeather=HEROIC.weather
}
function heroicTurn(side){heroicTick(side);heroicSync();heroicField();if(side==='p'&&HEROIC.climaxP>=100)heroicClimax('p');if(side==='e'&&HEROIC.climaxE>=100)heroicClimax('e')}

const enemyDeck=activeEnemyDeckIds.map(card).filter(Boolean);
const enemyQueue=enemyDeck.map(c=>({...c}));
let dragonRageLevel=0,dragonAttackBonus=0,playerAttackBlockedUntil=0,playerDirectShieldUntil=0,bossPhaseLevel=1;
let playerFusionProtectionUntil=0;
window.__nemesisApoloCallUsed=false;
window.__nemesisGhostEyeCharges=0;
window.__nemesisGhostJudgmentUsed=false;
window.__nemesisGhostDecreeUsed=false;
window.__nemesisVoidSecondAttackUsed=false;
window.__nemesisGhostDamageTurn=-1;
window.__nemesisGhostDamageReducedThisTurn=false;
function dragonRageBanner(title,text){
 if(!isDragon||phase==='END')return;
 const old=document.querySelector('.dragon-rage-alert');if(old)old.remove();
 const d=document.createElement('div');d.className='dragon-rage-alert';d.innerHTML=`<b>${title}</b><span>${text}</span>`;app.appendChild(d);
 requestAnimationFrame(()=>d.classList.add('show'));setTimeout(()=>d.remove(),2600);
}
function applyDragonRage(){
 if(!isDragon||phase==='END')return;
 if(ehpv<=8000&&dragonRageLevel<1){
  dragonRageLevel=1;dragonAttackBonus=500;
  sfx('roar');pcTone(164,1.3,'sawtooth','music',.055);
  enemyCards.forEach(c=>{if(c&&!c._dragonRageBonus){c.atk+=500;c._dragonRageBonus=500}});
  dragonRageBanner('IRA DEL DIABLO','Todos sus monstruos ganan +500 ATK.');
  toast('¡Ira del Diablo activada! Los monstruos enemigos ganan +500 ATK.');
 }
 if(ehpv<=4000&&dragonRageLevel<2){
  dragonRageLevel=2;document.querySelector('.battle')?.classList.add('dragon-rage-phase2');
  sfx('roar');pcTone(82,1.8,'sawtooth','music',.065);
  dragonRageBanner('IRA DEL DIABLO · FASE II','El Dragón colocará una carta adicional por turno.');
  toast('¡Segunda fase! El Dragón Ojo del Diablo puede colocar dos cartas por turno.');
 }
}
function bossPhaseBanner(title,text,level){
 if(phase==='END')return;
 const old=document.querySelector('.boss-phase-alert');if(old)old.remove();
 const d=document.createElement('div');d.className=`boss-phase-alert phase-${level}`;d.innerHTML=`<small>FASE ${level}</small><b>${title}</b><span>${text}</span>`;app.appendChild(d);
 requestAnimationFrame(()=>d.classList.add('show'));setTimeout(()=>d.remove(),3000);
}
function updateBossPhaseBadge(){
 const badge=document.getElementById('bossPhaseBadge');if(!badge)return;
 const labels=isSpectralKing?['REY DE LOS CONDENADOS','TRONO DE LAS ALMAS','REY SIN MUERTE']:isRa?['DIOS SOLAR','IRA DESATADA','JUICIO DEL SOL']:isDragon?['CAZADOR DRACÓNICO','IRA DEL DIABLO','FURIA DRACÓNICA']:['GUARDIÁN','GUARDIA FEROZ','ÚLTIMO RUGIDO'];
 badge.className=`boss-phase-badge phase-${bossPhaseLevel}`;badge.innerHTML=`<small>JEFE · FASE ${['I','II','III'][bossPhaseLevel-1]}</small><b>${enemyDisplayName}</b><span>${labels[bossPhaseLevel-1]}</span>`;
}
function applyBossPhases(){
 if(phase==='END')return;
 let next=1;
 if(isSpectralKing){if(ehpv<=8000)next=3;else if(ehpv<=16000)next=2}
 else if(isRa){if(ehpv<=5000)next=3;else if(ehpv<=10000)next=2}
 else if(isDragon){if(ehpv<=4000)next=3;else if(ehpv<=8000)next=2}
 else {if(ehpv<=3000)next=3;else if(ehpv<=6500)next=2}
 if(next<=bossPhaseLevel){updateBossPhaseBadge();return}
 bossPhaseLevel=next;const root=document.querySelector('.battle');root?.classList.remove('boss-phase-2','boss-phase-3');root?.classList.add(`boss-phase-${bossPhaseLevel}`);
 if(isSpectralKing){
  if(next===2){bossPhaseBanner('TRONO DE LAS ALMAS','Todos los caídos alimentan al Rey. La IA aumenta presión, control y resurrección.',2);pcLog('Rey Espectral entra en Fase II: Trono de las Almas.','effect');toast('¡TRONO DE LAS ALMAS! Todos los que has destruido ahora le pertenecen.')}
  if(next===3){bossPhaseBanner('REY SIN MUERTE','El Rey abandona toda cautela y busca combinaciones de victoria.',3);pcLog('Rey Espectral entra en Fase III: Rey Sin Muerte.','effect');toast('¡REY SIN MUERTE! La Corona de la Eternidad despierta.')}
 }else if(isRa){
  if(next===2){bossPhaseBanner('IRA DESATADA','Ra prioriza combinaciones, control y eliminación de amenazas.',2);pcLog('IRA DE RA entra en Fase II: Ira Desatada.','effect');toast('¡IRA DESATADA! Ra cambia su estrategia y juega de forma más agresiva.')}
  if(next===3){bossPhaseBanner('JUICIO DEL SOL','Ra busca jugadas decisivas, protege sus cartas clave y calcula el daño letal.',3);pcLog('IRA DE RA entra en Fase III: Juicio del Sol.','effect');toast('¡JUICIO DEL SOL! Ira de Ra entra en su fase final.')}
 }else if(isDragon){
  if(next===2){bossPhaseBanner('IRA DEL DIABLO','El Dragón entra en su fase de furia.',2);pcLog('Dragón Ojo del Diablo entra en Fase II.','effect')}
  if(next===3){bossPhaseBanner('FURIA DRACÓNICA','El Dragón acelera su presión y busca cerrar el duelo.',3);pcLog('Dragón Ojo del Diablo entra en Fase III.','effect')}
 }else{
  if(next===2){bossPhaseBanner('GUARDIA FEROZ','El Guardián empieza a priorizar tus amenazas principales.',2);pcLog('Guardián entra en Fase II.','effect')}
  if(next===3){bossPhaseBanner('ÚLTIMO RUGIDO','El Guardián abandona la cautela y busca el golpe final.',3);pcLog('Guardián entra en Fase III.','effect')}
 }
 updateBossPhaseBadge();sfx('roar');
}
function bossAggression(){return bossPhaseLevel===3?1.28:bossPhaseLevel===2?1.12:1}
function applyRaTurnGrowth(){
 if(!isRa)return;
 pcTone(220,.55,'sine','music',.04);
 enemyCards.forEach(c=>{if(!c)return;if(c.id==='anc-ira-ra'){c.atk+=500;olympusNotifyAttackIncrease('e',500);toast(`Ira de Ra aumenta +500 ATK. Poder actual: ${c.atk}.`)}if(c.id==='anc-lanza-bronce'){const attackers=playerCards.filter((x,i)=>x&&playerModes[i]==='ATAQUE').length;c.atk+=attackers*300;if(attackers)olympusNotifyAttackIncrease('e',attackers*300)}})
}
async function applyRaEntryEffect(slot,c){
 if(!isRa||!c)return;
 if(c.id==='anc-mnevis'){const valid=playerCards.map((x,i)=>({c:x,i})).filter(x=>x.c).sort((a,b)=>a.c.def-b.c.def);if(valid[0]){toast('Toro Mnevis destruye la carta rival con menor DEF.');await destroyCard('p',valid[0].i)}}
 if(c.id==='anc-cetro-was'){enemyCards.forEach(x=>{if(x)x.def+=300});toast('Cetro Was: todas las cartas de Ra ganan +300 DEF.')}
 if(c.id==='anc-ojo-ra'){const victims=playerCards.map((x,i)=>({c:x,i})).filter(x=>x.c).sort((a,b)=>a.c.atk-b.c.atk).slice(0,2);for(const v of victims)await destroyCard('p',v.i);if(enemyCards[slot])await destroyCard('e',slot);toast('El Ojo de Ra consumó su arma definitiva.')}
 if(c.id==='anc-mehen'){playerAttackBlockedUntil=turnNo+1;toast('Mehen bloquea tus ataques durante este turno.')}
}
let playerPowerReadyTurn=1;

// V19.2.8 — MOTOR REAL PARA 33 CARTAS EXTERNAS
function extTextList(c){
 const d=c?.externalData||{},out=[];
 for(const x of (d.habilidades||[]))out.push(typeof x==='string'?x:`${x.nombre||'Habilidad'}: ${x.efecto||''}`);
 const e=d.efectos||d.efecto;if(Array.isArray(e))for(const x of e)out.push(typeof x==='string'?x:`${x.nombre||'Efecto'}: ${x.efecto||''}`);
 else if(typeof e==='string')out.push(e);
 return out.filter(Boolean)
}
function extUltimateText(c){
 const u=c?.externalData?.ultimate||c?.externalData?.definitivo;
 return typeof u==='string'?u:(u?`${u.nombre||'ULTIMATE'}: ${u.efecto||''}`:'')
}
function extNum(text,def=1000){
 const m=String(text||'').replace(/\./g,'').match(/(?:\+|de |inflige |recupera )(\d{3,5})/i);return m?Number(m[1]):def
}
async function extDraw(side,n=1){
 if(side!=='p')return false;
 const dmHandLimit=5+(playerCards?.some(c=>dmIs(c,'DM-007'))?1:0);for(let k=0;k<n;k++){if(deckQueue.length&&handState.length<dmHandLimit){handState.push(deckQueue.shift())}}
 renderHand();updatePcStrategicHud();return true
}
async function extRecoverGrave(side,n=1){
 const grave=side==='p'?playerGrave:enemyGrave;
 if(!grave.length)return false;
 if(side==='p'){for(let k=0;k<n&&grave.length;k++){const x=grave.pop();if(x&&!state.deck.includes(x.id))handState.push(x.id)}renderHand();return true}
 return false
}
async function extDestroyStrongest(side,n=1){
 const rivals=side==='p'?enemyCards:playerCards,enemySide=side==='p'?'e':'p';
 const list=rivals.map((c,i)=>({c,i})).filter(x=>x.c).sort((a,b)=>(b.c.atk||0)-(a.c.atk||0)).slice(0,n);
 for(const x of list)await destroyCard(enemySide,x.i);return !!list.length
}
async function extStealStrongest(side){
 if(side!=='p')return false;
 const t=enemyCards.map((c,i)=>({c,i})).filter(x=>x.c).sort((a,b)=>(b.c.atk||0)-(a.c.atk||0))[0];
 const free=playerCards.findIndex(x=>!x);if(!t||free<0)return false;
 const stolen={...t.c};await destroyCard('e',t.i);playerCards[free]=stolen;playerModes[free]='ATAQUE';
 await place('p',free,stolen);await flip('p',free);await setMode('p',free,'ATAQUE');toast(`${stolen.name} pasa temporalmente a tu control.`);return true
}
async function extResurrect(side,n=1){
 const arr=side==='p'?playerCards:enemyCards,grave=side==='p'?playerGrave:enemyGrave,modes=side==='p'?playerModes:enemyModes;
 let done=0;
 while(done<n){
   const free=arr.findIndex(x=>!x),gi=grave.map((c,i)=>({c,i})).filter(x=>x.c&&x.c.type!=='magic'&&x.c.type!=='trap').sort((a,b)=>(b.c.atk||0)-(a.c.atk||0))[0];
   if(free<0||!gi)break;
   const rev={...gi.c};grave.splice(gi.i,1);arr[free]=rev;modes[free]='ATAQUE';await place(side,free,rev);await flip(side,free);await setMode(side,free,'ATAQUE');done++;
 }
 return done>0
}

/* NEMESIS DUEL MASTER V19.2.9 — MOTOR ESPECIFICO
   Capa incremental: no reemplaza resolveBattle, campañas ni daño base. */
function dmIs(c,id=null){return !!c&&String(c.id||'').startsWith('DM-')&&(!id||c.id===id)}
function dmCards(side){return side==='p'?playerCards:enemyCards}
function dmRivalCards(side){return side==='p'?enemyCards:playerCards}
function dmGrave(side){return side==='p'?playerGrave:enemyGrave}
function dmRivalGrave(side){return side==='p'?enemyGrave:playerGrave}
function dmTags(c){return [...(c?.tags||[]),...(c?.externalData?.tipos||[]),...(c?.externalData?.elementos||[])].map(x=>String(x).toLowerCase())}
function dmHas(c,t){return dmTags(c).includes(String(t).toLowerCase())}
function dmState(c){
 if(!c._dm)c._dm={energy:Number(c.energia??c.externalData?.energia??0),charges:0,solar:0,pact:0,austral:0,uses:0,destroyedOwn:0,phase:1,fieldTurns:0};
 return c._dm
}

function dmDeepState(side){
 const key=side==='p'?'__dmDeepP':'__dmDeepE';
 if(!window[key])window[key]={eclipseTurn:-1,eclipseDestinyUsed:false,titanShieldTurn:-1,afroditaGuardTurn:-1,medusaReflectTurn:-1,holyPurifyTurn:-1};
 return window[key]
}
function dmEq(c,kind,id=null){const eq=nemesisEquipmentSlots(c)?.[kind];return !!eq&&(!id||eq.sourceId===id)}
function dmActiveEquipment(side,id){return dmCards(side).some(c=>c&&['weapon','armor','relic'].some(k=>dmEq(c,k,id)))}
function dmTypeSet(side){
 const set=new Set();
 dmCards(side).filter(c=>dmIs(c)).forEach(c=>{
  [...(c.tags||[]),...(c.externalData?.tipos||[]),...(c.externalData?.elementos||[])].forEach(x=>set.add(String(x).toLowerCase()));
  if(c.type)set.add(String(c.type).toLowerCase())
 });
 return set
}
function dmCost(c,n){
 const side=playerCards.includes(c)?'p':enemyCards.includes(c)?'e':null;
 let discount=0;if(side){if(dmActiveEquipment(side,'DM-016'))discount++;if(dmDeepState(side).eclipseTurn===turnNo)discount+=2}
 return Math.max(1,Math.max(0,Number(n)||0)-discount)
}
function dmHasDeep(c,t){
 t=String(t||'').toLowerCase();
 return dmHas(c,t)||Array.isArray(c?._dmFusionTypes)&&c._dmFusionTypes.includes(t)
}
function dmDeepSync(){
 for(const side of ['p','e']){
  const own=dmCards(side),deep=dmDeepState(side),crown=dmActiveEquipment(side,'DM-016'),torch=dmActiveEquipment(side,'DM-014'),shiny=own.find(c=>dmIs(c,'DM-018')),types=dmTypeSet(side),domain=crown&&types.size>=5;
  own.forEach(c=>{
   if(!dmIs(c)||c.type==='magic'||c.type==='trap')return;
   dmAura(c,'deepCrown',1000,1000,crown);
   dmAura(c,'deepTorch',1000,1000,torch);
   dmAura(c,'deepDomain',2000,0,domain);
   dmAura(c,'deepShinyGuard',0,1000,!!shiny&&c!==shiny);
   const champion=(c.id==='DM-004'||c.id==='DM-018')&&dmEq(c,'weapon','DM-015')&&torch&&crown;
   dmAura(c,'deepChampion',0,1000,champion);
   c._dmDomainProtected=domain;
   c._dmTorchProtected=torch&&(dmHasDeep(c,'divina')||/zeus|thor/i.test(c.name||''));
   if(deep.eclipseTurn===turnNo){
    dmAura(c,'deepEclipse',3000,3000,true);c._dmDirectAttackTurn=turnNo;
   }else dmAura(c,'deepEclipse',3000,3000,false);
  });
 }
}
async function dmTransformAt(side,i,newId){
 const arr=dmCards(side),modes=side==='p'?playerModes:enemyModes,old=arr[i],next=card(newId);
 if(!old||!next)return false;
 const eq=old._equipmentSlots?JSON.parse(JSON.stringify(old._equipmentSlots)):null,mode=modes[i]||'ATAQUE';
 if(board?.[side]?.[i]){scene.remove(board[side][i]);board[side][i]=null}
 const n={...next,_dmShinyAwakened:true,_dmTransformedFrom:old.id};if(eq)n._equipmentSlots=eq;
 arr[i]=n;modes[i]=mode;await place(side,i,n);await flip(side,i);await setMode(side,i,mode);
 if(eq)for(const kind of ['weapon','armor','relic'])if(eq[kind])pcEquipVisual(board?.[side]?.[i],kind,eq[kind].label,eq[kind].temporary);
 toast('TRANSFORMACIÓN SHINY: '+old.name+' → '+n.name);dmDeepSync();update();return true
}
async function dmTryShinyAwakening(side='p'){
 const own=dmCards(side),thorIndex=own.findIndex(c=>dmIs(c,'DM-004')&&dmEq(c,'weapon','DM-015'));
 if(thorIndex<0||!dmActiveEquipment(side,'DM-014')||!dmActiveEquipment(side,'DM-016'))return false;
 let found=false;
 if(side==='p'){
  let h=handState.indexOf('DM-018');if(h>=0){handState.splice(h,1);renderHand();found=true}
  if(!found){const q=deckQueue.indexOf('DM-018');if(q>=0){deckQueue.splice(q,1);found=true}}
 }else{
  const q=enemyQueue.findIndex(x=>(typeof x==='string'?x:x?.id)==='DM-018');if(q>=0){enemyQueue.splice(q,1);found=true}
 }
 if(!found)return false;
 return await dmTransformAt(side,thorIndex,'DM-018')
}
async function dmTitanJudgement(side,source,kind='ataque'){
 const own=dmCards(side),idx=own.findIndex(c=>dmIs(c,'DM-019')&&c._dmTitanTrap);
 if(idx<0)return false;const trap=own[idx],atk=Math.max(0,Number(source?.atk)||0),dmg=Math.max(2000,atk);
 trap._dmTitanTrap=false;await (side==='p'?revealPlayer(idx):revealEnemy(idx));dmHit(side,dmg);dmDeepState(side).titanShieldTurn=turnNo;
 const q=side==='p'?enemyQueue:deckQueue;if(atk>=6000&&q?.length)q.shift();
 toast('JUICIO DE LOS TITANES: '+kind+' anulado · '+dmg+' de castigo.');
 await destroyCard(side,idx);return true
}
function dmPurify(c){
 for(const k of ['_skillDebuff','_enemySkillAtkBonus','_petrifiedUntil','_dmPetrifiedUntil','_hadesChainedUntil','_dmAphroditeLockedUntil','_attackDisabledUntil']){
  if(c&&c[k]!=null){if(k==='_skillDebuff'){c.atk+=(c[k]||0)}delete c[k]}
 }
}
async function dmRealmFusion(side){
 const own=dmCards(side),deep=dmDeepState(side),types=[...dmTypeSet(side)];
 deep.eclipseTurn=turnNo;deep.eclipseDestinyUsed=false;
 own.filter(c=>dmIs(c)).forEach(c=>{c._dmFusionTypes=types;c._dmDirectAttackTurn=turnNo});
 let activated=0;
 for(let i=0;i<own.length&&activated<5;i++){
  const c=own[i];if(!dmIs(c)||c.type!=='monster'||c.id==='DM-018')continue;
  const d=c.externalData||{},list=d.habilidades||[];if(!list.length)continue;
  try{await dmUseAbility(side,i,c,{kind:'dmAbility',dmIndex:0,name:'SINFONÍA DE LOS REINOS'});activated++}catch(e){console.warn('dm realm fusion',c.id,e)}
 }
 dmDeepSync();toast('FUSIÓN DE REINOS: '+activated+' habilidad(es) enlazadas.');return activated
}
async function dmReviveLow(side,max=3){
 const own=dmCards(side),grave=dmGrave(side),modes=side==='p'?playerModes:enemyModes;let n=0;
 for(let gi=grave.length-1;gi>=0&&n<max;gi--){const c=grave[gi],free=own.findIndex(x=>!x);if(free<0)break;if(!dmIs(c)||(c.atk||0)>2000)continue;
  grave.splice(gi,1);const rev={...c};own[free]=rev;modes[free]='DEFENSA';await place(side,free,rev);await flip(side,free);await setMode(side,free,'DEFENSA');n++;
 }return n
}

function dmHit(side,n){n=Math.max(0,Math.floor(Number(n)||0));if(side==='p'){ehpv=Math.max(0,ehpv-n);damageFx(n,'e')}else{phpv=Math.max(0,phpv-n);damageFx(n,'p')}return n}
function dmHeal(side,n){n=Math.max(0,Math.floor(Number(n)||0));if(side==='p')phpv=Math.min(playerMaxHp,phpv+n);else ehpv=Math.min(enemyMaxHp,ehpv+n);return n}
function dmPay(c,n){const st=dmState(c),cost=dmCost(c,n);if(st.energy<cost){toast(c.name+': Energía insuficiente ('+st.energy+'/'+cost+').');return false}st.energy-=cost;return true}
function dmBest(side){return dmRivalCards(side).map((c,i)=>({c,i})).filter(x=>x.c).sort((a,b)=>(b.c.atk||0)-(a.c.atk||0))[0]||null}
async function dmBanish(side,targetIndex){
 const targetSide=side==='p'?'e':'p',arr=targetSide==='p'?playerCards:enemyCards,modes=targetSide==='p'?playerModes:enemyModes,g=board[targetSide]?.[targetIndex],c=arr[targetIndex];
 if(!c)return false;
 nemesisBreakAllEquipment(targetSide,targetIndex);
 if(g){try{v18917SendVisualToGrave(targetSide,g)}catch(e){};scene.remove(g);board[targetSide][targetIndex]=null}
 arr[targetIndex]=null;modes[targetIndex]=null;c._dmBanished=true;update();toast(c.name+' fue DESTERRADA.');return true
}
async function dmDestroy(side,targetIndex){return await destroyCard(side==='p'?'e':'p',targetIndex)}
async function dmDestroyAll(side){
 let n=0,a=dmRivalCards(side);for(let i=0;i<a.length;i++)if(a[i]&&await dmDestroy(side,i))n++;return n
}
function dmAura(c,key,atk,def,on){
 const k='_dmAura_'+key;if(on&&!c[k]){c.atk=(c.atk||0)+atk;c.def=(c.def||0)+def;c[k]=true}
 else if(!on&&c[k]){c.atk=Math.max(0,(c.atk||0)-atk);c.def=Math.max(0,(c.def||0)-def);delete c[k]}
}
function nemesisDmSync(){
 for(const side of ['p','e']){
  const own=dmCards(side),riv=dmRivalCards(side);
  const zeus=own.find(c=>dmIs(c,'DM-001')),dragon=own.find(c=>dmIs(c,'DM-002')),tirana=own.find(c=>dmIs(c,'DM-009')),onk=own.find(c=>dmIs(c,'DM-010'));
  own.forEach(c=>{if(!c)return;dmAura(c,'zeus',2000,1500,!!zeus&&c!==zeus&&dmHas(c,'divina'));dmAura(c,'dragon',1500,1000,!!dragon&&c!==dragon&&dmHas(c,'dragon'))});
  const thor=own.find(c=>dmIs(c,'DM-004'));if(thor){const st=dmState(thor),want=st.charges*500,old=thor._dmChargeAtk||0;if(want!==old){thor.atk=Math.max(0,thor.atk-old+want);thor._dmChargeAtk=want}}
  if(tirana){const st=dmState(tirana),want=st.pact*300,old=tirana._dmPactBonus||0;if(want!==old){tirana.atk=Math.max(0,tirana.atk-old+want);tirana.def=Math.max(0,tirana.def-old+want);tirana._dmPactBonus=want}riv.forEach(c=>{if(!c)return;dmAura(c,'tirana',-800,-800,st.pact>=4)})}
  if(onk){const st=dmState(onk),hp=side==='p'?phpv:ehpv,max=side==='p'?playerMaxHp:enemyMaxHp,phase=(hp<=2000||own.filter(Boolean).length===0)?3:(hp<max*.5?2:1);if(st.phase!==phase){st.phase=phase;toast(onk.name+' · FASE '+phase+(phase===3?' · FIN AUSTRAL':''))}const want=phase>=2?Math.floor(Math.max(0,max-hp)/2000)*1000:0,old=onk._dmResilient||0;if(want!==old){onk.atk=Math.max(0,onk.atk-old+want);onk.def=Math.max(0,onk.def-old+want);onk._dmResilient=want}const deb=st.destroyedOwn*300;riv.forEach(c=>{if(!c)return;const oldDeb=c._dmOnkolxonDebuff||0;if(oldDeb!==deb){c.atk=Math.max(0,c.atk+oldDeb-deb);c._dmOnkolxonDebuff=deb}})}
 }
 dmDeepSync()
}
function dmAbilityText(x){return typeof x==='string'?x:((x?.nombre||'Habilidad')+': '+(x?.efecto||''))}
function dmSkillDescriptor(c){
 if(!dmIs(c)||c.type!=='monster')return null;
 const d=c.externalData||{},list=d.habilidades||[],st=dmState(c),ult=d.ultimate||d.definitivo;
 if(ult&&!c._extUltimateUsed&&st.uses>=Math.max(1,list.length)){const txt=dmAbilityText(ult);return{name:String(typeof ult==='string'?ult:(ult.nombre||'ULTIMATE')).split(':')[0].toUpperCase(),kind:'dmUltimate',desc:txt,onceDuel:true}}
 const x=list.length?list[st.uses%list.length]:'Poder Duel Master',txt=dmAbilityText(x),name=String(typeof x==='string'?x:(x.nombre||'Habilidad')).split(':')[0].toUpperCase();
 return{name,kind:'dmAbility',desc:txt,dmIndex:list.length?st.uses%list.length:0}
}
async function dmUseAbility(side,i,c,sk){
 const st=dmState(c),k=sk.dmIndex??0,own=dmCards(side),riv=dmRivalCards(side),rgrave=dmRivalGrave(side);
 let t;
 if(sk.kind==='dmUltimate'){
  if(c._extUltimateUsed)return false;
  if(c.id==='DM-001'){if(!dmPay(c,4))return false;const n=await dmDestroyAll(side);dmHit(side,n*8000);if(n>5)window.__nemesisDmEffectLockUntil=turnNo+1}
  else if(c.id==='DM-002'){if(!dmPay(c,5))return false;const n=await dmDestroyAll(side);c.atk+=n*3000;c._dmUnlimitedAttacksTurn=turnNo}
  else if(c.id==='DM-003'){if(!dmPay(c,6))return false;await extDraw(side,2);window.__nemesisDmOracleUntil=turnNo+1;c.atk+=3000}
  else if(c.id==='DM-004'){if(st.charges<3||!dmPay(c,5)){toast('Thor requiere 3 Cargas de Tormenta y 5 Energía.');return false}st.charges-=3;dmHit(side,6000);for(let j=0;j<riv.length;j++){const x=riv[j];if(x&&(x.def||0)<=Math.floor((c.atk||0)/2))await dmDestroy(side,j)}}
  else if(c.id==='DM-007'){const cost=c._dmAscended?4:8;if(!dmPay(c,cost))return false;c._dmAscended=true;c._dmReturnTurn=turnNo+1;c._immortalUntil=turnNo+2;c.atk+=5000;c.def+=5000;dmHeal(side,2000)}
  else if(c.id==='DM-008'){if(st.solar<5||!dmPay(c,10)){toast('Moctezuma requiere 5 Contadores Solares y 10 Energía.');return false}st.solar-=5;let total=0;for(const ss of ['p','e']){const a=dmCards(ss);for(let j=0;j<a.length;j++)if(a[j]){total+=a[j].atk||0;await destroyCard(ss,j)}}dmHit(side,total);c.atk+=5000;c.def+=5000}
  else if(c.id==='DM-009'){if(st.pact<6||!dmPay(c,12)){toast('La Tirana requiere 6 Cargas de Pacto y 12 Energía.');return false}st.pact-=6;riv.forEach(x=>{if(x){x.atk=Math.max(0,x.atk-1200);x.def=Math.max(0,x.def-1200);x._dmTiranaLockUntil=turnNo}});window.__nemesisDmEffectLockUntil=turnNo;if(!riv.some(Boolean))dmHit(side,5000)}
  else if(c.id==='DM-010'){const hp=side==='p'?phpv:ehpv;if(st.energy<16&&hp>2000&&own.some(Boolean)){toast('Aurora requiere 16 Energía o estado crítico.');return false}st.energy=Math.max(0,st.energy-16);st.austral+=5;dmHeal(side,3000);await dmDestroyAll(side);for(let q=0;q<5;q++)await extResurrect(side,1);own.forEach(x=>{if(x){x.atk+=1500;x.def+=1500;x._dmDirectAttackTurn=turnNo}})}
  c._extUltimateUsed=true;toast(c.name+' · ULTIMATE '+sk.name);update();return true
 }
 if(c.id==='DM-001'){
  if(k===0){t=dmBest(side);if(t){const ally=t.c.type!=='magic'&&t.c.type!=='trap';await dmBanish(side,t.i);if(ally)dmHit(side,3000)}}
  else if(k===1){c._dmChainThunderTurn=turnNo}
  else if(k===2){c._dmOlympusShield=true}
  else if(k===3){const q=side==='p'?enemyQueue:deckQueue;if(q?.length){const gone=q.shift(),gc=typeof gone==='string'?card(gone):gone;if(gc){gc._dmBanished=true;toast((gc.name||'Carta rival')+' fue apartada por Mirada de Zeus.')}}}
  else window.__nemesisDmBattleLockUntil=turnNo;
 }else if(c.id==='DM-002'){
  if(k===0){t=dmBest(side);if(t){t.c.def=Math.max(0,(t.c.def||0)-6000);if(t.c.def===0){await dmDestroy(side,t.i);dmHit(side,3000)}}}
  else if(k===1){window.__nemesisDmEffectLockUntil=turnNo;st.energy+=2;t=riv.map((x,j)=>({c:x,i:j})).find(x=>x.c&&(x.c.type==='magic'||x.c.type==='trap'));if(t)await dmDestroy(side,t.i)}
  else if(k===2){c._dmZeroDamageTurn=turnNo;c._immortalUntil=Math.max(c._immortalUntil||0,turnNo)}
  else {const x=rgrave.map((c,j)=>({c,j})).filter(x=>x.c).sort((a,b)=>(b.c.atk||0)-(a.c.atk||0))[0];if(x){rgrave.splice(x.j,1);x.c._dmBanished=true;if(x.c.type!=='magic'&&x.c.type!=='trap')dmHit(side,4000)}}
 }else if(c.id==='DM-003'){
  if(k===0)await extDraw(side,1);
  else if(k===1){if(side==='p'&&handState.length&&handState.length<6){handState.push(handState[0]);renderHand();c._dmEchoTurn=turnNo}}
  else if(k===2)window.__nemesisDmEffectLockUntil=turnNo;
  else if(own.filter(x=>x&&dmHas(x,'divina')).length>=2){await extDraw(side,2);st.energy++}
 }else if(c.id==='DM-004'){
  if(k===0){if(st.charges<1){toast('Thor necesita 1 Carga de Tormenta.');return false}st.charges--;dmHit(side,2500);t=riv.map((x,j)=>({c:x,i:j})).find(x=>x.c&&(x.c.def||0)<=4000);if(t)await dmDestroy(side,t.i)}
  else if(k===1){const slots=nemesisEquipmentSlots(c);if(slots?.weapon){riv.forEach(x=>{if(x)x.def=Math.max(0,(x.def||0)-3000)})}else{c.atk+=3000;c._dmMjolnir=true}}
  else if(k===2){if(st.charges<2){toast('Thor necesita 2 Cargas de Tormenta.');return false}st.charges-=2;c._dmSecondAttackTurn=turnNo;c.atk+=1000}
  else {const slots=nemesisEquipmentSlots(c);if(slots?.weapon){nemesisUnequip(side,i,'weapon',{broken:true,toGrave:true,reason:'Protector de los Dioses'});c._dmThorGuard=true}else{toast('Thor necesita un Arma equipada.');return false}}
 }else if(c.id==='DM-007'){
  if(k===0){c._dmAscended=true;c._dmReturnTurn=turnNo+1;c._immortalUntil=Math.max(c._immortalUntil||0,turnNo+1)}
  else if(k===1){c.atk+=3000;c.def+=3000;st.charges=Math.min(3,st.charges+1)}
  else if(k===2){dmHeal(side,3000);t=riv.map((x,j)=>({c:x,i:j})).find(x=>x.c&&(x.c.type==='magic'||x.c.type==='trap'));if(t)await dmBanish(side,t.i)}
  else {riv.forEach(x=>{if(x)x.def=Math.max(0,(x.def||0)-2000)});c._dmSweepTurn=turnNo}
 }else if(c.id==='DM-008'){
  if(k===0&&side==='p'&&deckQueue.length>=3){const top=deckQueue.splice(0,3).reverse();deckQueue.unshift(...top)}
  else if(k===1){t=own.map((x,j)=>({c:x,i:j})).find(x=>x.c&&x.c!==c);if(!t){toast('No hay carta para Ofrenda de Guerra.');return false}await destroyCard(side,t.i);c.atk+=2000;c._dmOfferTurn=turnNo}
  else if(k===2&&st.solar>=5)own.forEach(x=>{if(x&&dmHas(x,'fuego')){x.atk+=1500;x.def+=1500;x._dmSunTurn=turnNo}});
  else if(k===3){let total=0,n=0;for(let j=0;j<own.length&&n<5;j++)if(own[j]&&own[j]!==c){total+=own[j].atk||0;await destroyCard(side,j);n++}if(total)dmHit(side,total)}
 }else if(c.id==='DM-009'){
  if(k===0){t=riv.map((x,j)=>({c:x,i:j})).find(x=>x.c&&(x.c.type==='magic'||x.c.type==='trap'));if(t){await dmBanish(side,t.i);c._dmUsurped=t.c}}
  else if(k===1)st.pact=Math.min(6,st.pact+1);
  else if(k===2&&rgrave.length){const x=rgrave.splice(Math.max(0,rgrave.length-5),1)[0];if(x)x._dmBanished=true}
  else if(k===3){c._dmRetributionTurn=turnNo;await extDraw(side,1)}
 }else if(c.id==='DM-010'){
  if(k===0&&((side==='p'?phpv:ehpv)<=4000))c._immortalUntil=Math.max(c._immortalUntil||0,turnNo+1);
  else if(k===1){let n=Math.min(3,st.austral);while(n-->0){t=dmBest(side);if(!t)break;await dmBanish(side,t.i);st.austral--}}
  else if(k===2){const grave=dmGrave(side),pick=grave.map((x,j)=>({c:x,j})).find(x=>x.c&&(dmHas(x.c,'espiritu')||dmHas(x.c,'hielo')));const free=own.findIndex(x=>!x);if(pick&&free>=0){const rev={...pick.c};grave.splice(pick.j,1);own[free]=rev;(side==='p'?playerModes:enemyModes)[free]='DEFENSA';await place(side,free,rev);await flip(side,free);await setMode(side,free,'DEFENSA')}}
  else if(k===3&&st.austral>=5){st.austral-=5;await extDraw(side,2);dmHeal(side,1000)}
 }else if(c.id==='DM-011'){
  if(k===0){t=dmBest(side);if(t){t.c.atk=Math.max(0,(t.c.atk||0)-1500);t.c._dmAphroditeLockedUntil=turnNo;toast('SEDUCCIÓN DEL ALMA: '+t.c.name+' pierde 1500 ATK y queda contenida.')}}
  else if(k===1){c._dmAfroditaBondTurn=turnNo;toast('VÍNCULO DE AFRODITA protege a Duel Master este turno.')}
  else if(k===2){if(st.fieldTurns<3){toast('CORAZÓN CAUTIVO requiere 3 turnos en Campo.');return false}if(side==='p')await extStealStrongest(side);else{t=dmBest(side);if(t)await dmBanish(side,t.i)}}
 }else if(c.id==='DM-012'){
  if(k===0){t=dmBest(side);if(t){t.c._dmPetrifiedUntil=turnNo+1;t.c._petrifiedUntil=turnNo+1;t.c._attackDisabledUntil=turnNo+1;c.atk+=500;c.def+=500;c._dmStoneBonus=Math.min(2000,(c._dmStoneBonus||0)+500);toast('MIRADA PETRIFICANTE: '+t.c.name+' queda petrificada.')}}
  else if(k===1){c._dmReflectReadyTurn=turnNo;toast('REFLEJO DE GORGONA preparado.')}
  else if(k===2){const petrified=riv.filter(x=>x&&((x._dmPetrifiedUntil||-1)>=turnNo)).length,want=Math.min(2000,petrified*500),old=c._dmGalleryBonus||0;c.atk=Math.max(0,c.atk-old+want);c.def=Math.max(0,c.def-old+want);c._dmGalleryBonus=want}
 }else if(c.id==='DM-018'){
  if(k===0){riv.forEach(x=>{if(x){x.atk=Math.max(0,(x.atk||0)-1500);x._dmShinyDebuff=(x._dmShinyDebuff||0)+1500}});dmHit(side,2500);toast('TRUENO ETERNO domina el Campo.')}
  else if(k===1){const gods=[...own,...dmGrave(side)].filter(x=>x&&dmIs(x)&&(dmHasDeep(x,'dios')||dmHasDeep(x,'divina'))).length,bonus=Math.max(1000,gods*1000);c.atk+=bonus;c._dmShinyTempAtk=(c._dmShinyTempAtk||0)+bonus}
  else if(k===2){own.forEach(x=>{if(dmIs(x)){x._dmShinyProtectedUntil=turnNo;x._shieldBonus=(x._shieldBonus||0)+1000;x._shieldPending=true}})}
  else if(k===3){if(!dmPay(c,3))return false;for(let j=0;j<riv.length;j++){const x=riv[j];if(x&&(x.atk||0)<=4000)await dmDestroy(side,j)}dmHit(side,4000);c._extUltimateUsed=true;toast('GOLPE DEL BIFRÖST: ULTIMATE SHINY.')}
 }
 st.uses++;c._extSkillUses=(c._extSkillUses||0)+1;nemesisDmSync();update();return true
}
async function nemesisDmPreventDestroy(side,i,victim){
 if(!dmIs(victim))return false;const own=dmCards(side);
 if(victim.id==='DM-001'&&victim._dmOlympusShield){const j=own.findIndex((x,k)=>k!==i&&x&&dmHas(x,'divina'));if(j>=0){victim._dmOlympusShield=false;await destroyCard(side,j);toast('ESCUDO DEL OLIMPO evita la destrucción de Zeus.');return true}}
 if(victim.id==='DM-004'&&victim._dmThorGuard){victim._dmThorGuard=false;toast('PROTECTOR DE LOS DIOSES evita la destrucción de Thor.');return true}
 if(victim.id==='DM-010'&&own.filter(Boolean).length<=1){toast('GUARDIÁN DEL ÚLTIMO ALIENTO evita la destrucción de Onkolxón.');return true}
 const deep=dmDeepState(side);
 if(deep.titanShieldTurn===turnNo){toast('ESCUDO DE LOS TITANES evita la destrucción.');return true}
 if((victim._dmShinyProtectedUntil||-1)>=turnNo){toast('PROTECTOR DE LOS NUEVE REINOS evita la destrucción.');return true}
 const afro=own.find(c=>dmIs(c,'DM-011'));if(afro&&afro!==victim&&deep.afroditaGuardTurn!==turnNo){deep.afroditaGuardTurn=turnNo;toast('VÍNCULO DE AFRODITA protege a '+victim.name+'.');return true}
 if(victim.id==='DM-012'&&(victim._dmReflectReadyTurn===turnNo||deep.medusaReflectTurn!==turnNo)){deep.medusaReflectTurn=turnNo;const t=dmBest(side);if(t){toast('REFLEJO DE GORGONA devuelve la destrucción.');await dmDestroy(side,t.i)}return true}
 if(victim._dmDomainProtected||victim._dmTorchProtected){toast('DOMINIO DUEL MASTER protege a '+victim.name+'.');return true}
 if(dmEq(victim,'weapon','DM-017')){nemesisUnequip(side,i,'weapon',{broken:true,toGrave:true,reason:'Bendición del Portador'});toast('ARMA SANTA se sacrifica y protege a '+victim.name+'.');return true}
 return false
}
function nemesisDmAfterDestroyed(side,victim){
 const own=dmCards(side),rival=dmRivalCards(side);
 own.forEach(c=>{if(!dmIs(c))return;const st=dmState(c);st.destroyedOwn++;if(c.id==='DM-008'&&c!==victim){st.solar=Math.min(10,st.solar+1);c.atk+=500;c.def+=500}if(c.id==='DM-010'&&c!==victim)st.austral++;if(c.id==='DM-004'&&c!==victim)dmHit(side,800)});
 rival.forEach(c=>{if(dmIs(c,'DM-009')){const st=dmState(c);st.pact=Math.min(6,st.pact+1)}});nemesisDmSync()
}
function nemesisDmTurnStart(){
 playerCards.forEach(c=>{if(!dmIs(c))return;const st=dmState(c);st.fieldTurns=(st.fieldTurns||0)+1;if(c.id==='DM-004')st.charges=Math.min(5,st.charges+1);if(c.id==='DM-007'&&c._dmReturnTurn&&turnNo>=c._dmReturnTurn){c._dmReturnTurn=0;c.atk+=3000;c.def+=3000;st.charges=Math.min(3,st.charges+1);toast('RETORNO DEL ETERNO: Quetzalcóatl regresa fortalecido.')}});
 playerGrave.forEach(c=>{if(dmIs(c,'DM-010'))dmState(c).austral++});dmTryShinyAwakening('p').catch(()=>{});nemesisDmSync()
}
function nemesisDmEndTurn(){
 const q=playerCards.find(c=>dmIs(c,'DM-007'));if(q){const n=Math.min(5,playerGrave.filter(x=>x&&(dmHas(x,'viento')||dmHas(x,'luz'))).length);if(n)dmHeal('p',n*1000)}
 const deep=dmDeepState('p');if(deep.eclipseTurn===turnNo&&!deep.eclipseDestinyUsed&&ehpv<=5000){deep.eclipseDestinyUsed=true;dmHit('p',5000);toast('DESTINO SELLADO: Eclipse de los Reinos inflige 5000 de daño final.')}
}
async function dmSpecialMagic(side,c,target=null){
 if(c.id==='DM-005'){window.__nemesisOriginsUntil=turnNo+2;window.__nemesisDmEffectLockUntil=Math.max(window.__nemesisDmEffectLockUntil||0,turnNo);dmCards(side).forEach(x=>{if(x){delete x._skillDebuff;delete x._petrifiedUntil;delete x._hadesChainedUntil}});await extDraw(side,2);toast('ORÍGENES: ALTERACIÓN PRIMORDIAL activa durante 2 turnos.');return true}
 if(c.id==='DM-006'){const t=target||dmBest(side);if(!t?.c)return false;const ownMax=Math.max(0,...dmCards(side).filter(Boolean).map(x=>x.atk||0)),atk=t.c.atk||0,diff=Math.max(0,atk-ownMax);dmHit(side,diff);if(atk>=6000)await dmDestroy(side,t.i);if(atk>=10000)window.__nemesisDmEffectLockUntil=turnNo;if(atk>=15000){for(let j=0;j<dmRivalCards(side).length;j++){const x=dmRivalCards(side)[j];if(x&&(x.atk||0)<atk/2)await dmDestroy(side,j)}window.__nemesisDmSpecialSummonLockUntil=turnNo}toast('CACERÍA DE DEMONIOS · SENTENCIA ESCALANTE.');return true}
 return false
}
async function nemesisDmCheckHunterTrap(){
 const idx=playerCards.findIndex(c=>dmIs(c,'DM-006'));if(idx<0)return false;
 const t=enemyCards.map((c,i)=>({c,i})).filter(x=>x.c&&(x.c.atk||0)>=3000&&!x.c._dmHunterCheckedTurn).sort((a,b)=>(b.c.atk||0)-(a.c.atk||0))[0];
 if(!t)return false;t.c._dmHunterCheckedTurn=turnNo;await revealPlayer(idx);await dmSpecialMagic('p',playerCards[idx],t);await destroyCard('p',idx);return true
}
async function nemesisDmAfterPlayerAttack(c){
 if(!dmIs(c))return;
 if(dmEq(c,'weapon','DM-015')&&c._dmMjolnirHitTurn!==turnNo){c._dmMjolnirHitTurn=turnNo;dmHit('p',1000);toast('IMPACTO DEL TRUENO: 1000 de daño directo.')}
 if(dmEq(c,'weapon','DM-017')){dmPurify(c);dmDeepState('p').holyPurifyTurn=turnNo;toast('PURIFICACIÓN: Arma Santa elimina efectos negativos.')}
 if(c.id==='DM-001'&&c._dmChainThunderTurn===turnNo){let n=0;for(let j=0;j<enemyCards.length;j++)if(enemyCards[j]){enemyCards[j].def=Math.max(0,(enemyCards[j].def||0)-4000);n++}if(n)dmHit('p',Math.min(8000,n*4000));await extDraw('p',1)}
}
async function nemesisDmAfterKill(side,c,victim){
 if(!dmIs(c))return;
 if(dmEq(c,'weapon','DM-013')){
  const grave=side==='p'?enemyGrave:playerGrave,gi=grave.lastIndexOf(victim);if(gi>=0)grave.splice(gi,1);victim._dmBanished=true;toast('CONDENA DEL ABISMO: '+victim.name+' queda desterrada.');
  const t=dmBest(side);if(t){t.c._attackDisabledUntil=turnNo+1;t.c._dmChainedUntil=turnNo+1}
 }
 if(dmEq(c,'weapon','DM-015')&&(c.id==='DM-004'||c.id==='DM-018'))c._dmSecondAttackTurn=turnNo;
}
function nemesisDmKeepTurnAfterAttack(c){
 if(!dmIs(c))return false;
 if(c.id==='DM-002'){if(c._dmUnlimitedAttacksTurn===turnNo)return true;if(c._dmExtraAttackUsedTurn!==turnNo){c._dmExtraAttackUsedTurn=turnNo;return true}}
 if((c.id==='DM-004'||c.id==='DM-018')&&c._dmSecondAttackTurn===turnNo&&c._dmSecondAttackUsedTurn!==turnNo){c._dmSecondAttackUsedTurn=turnNo;return true}
 return false
}
window.NEMESIS_DUEL_MASTER_AUDIT=()=>{const cards=NEMESIS_DUEL_MASTER_IDS.map(id=>card(id)),o=card('DM-010'),missing=NEMESIS_DUEL_MASTER_IDS.filter(id=>!card(id)),handlers=cards.filter(Boolean).map(c=>({id:c.id,type:c.type,handler:c.type==='monster'?!!dmSkillDescriptor(c):['DM-005','DM-006','DM-013','DM-014','DM-015','DM-016','DM-017','DM-019','DM-020'].includes(c.id)}));return{total:cards.filter(Boolean).length,unique:new Set(NEMESIS_DUEL_MASTER_IDS).size,missing,ids:cards.filter(Boolean).map(c=>c.id),images:cards.filter(Boolean).map(c=>c.img),onkolxon:o?{hp:o.externalData?.hp,energia:o.externalData?.energia}:null,handlers,systems:{deep:typeof dmDeepSync==='function',shiny:typeof dmTryShinyAwakening==='function',realmFusion:typeof dmRealmFusion==='function',titanCounter:typeof dmTitanJudgement==='function'},ok:cards.filter(Boolean).length===20&&new Set(NEMESIS_DUEL_MASTER_IDS).size===20&&missing.length===0&&handlers.every(x=>x.handler)&&o?.externalData?.hp===13000&&o?.externalData?.energia===14}}


/* V19.3.0 — 23 CARTAS GENERALES: motor específico.
   Incremental: usa el motor actual, no reemplaza campañas ni daño base. */
const NEMESIS_PUBLIC23_SET=new Set(NEMESIS_PUBLIC_23_IDS);
function pub23Is(c,id=null){return !!c&&NEMESIS_PUBLIC23_SET.has(c.id)&&(!id||c.id===id)}
function pub23Own(side){return side==='p'?playerCards:enemyCards}
function pub23Rival(side){return side==='p'?enemyCards:playerCards}
function pub23Grave(side){return side==='p'?playerGrave:enemyGrave}
function pub23RivalGrave(side){return side==='p'?enemyGrave:playerGrave}
function pub23Queue(side){return side==='p'?deckQueue:enemyQueue}
function pub23State(c){if(!c)return{};if(!c._p23)c._p23={uses:0,turns:0,once:{},ragnarok:false,abismo:0};return c._p23}
function pub23Has(c,t){t=String(t||'').toLowerCase();return !!c&&[...(c.tags||[]),...(c.externalData?.tipos||[]),...(c.externalData?.elementos||[])].map(x=>String(x).toLowerCase()).includes(t)}
function pub23Damage(side,n){n=Math.max(0,Math.floor(Number(n)||0));if(side==='p'){ehpv=Math.max(0,ehpv-n);damageFx(n,'e')}else{phpv=Math.max(0,phpv-n);damageFx(n,'p')}return n}
function pub23Heal(side,n){n=Math.max(0,Math.floor(Number(n)||0));if(side==='p')phpv=Math.min(playerMaxHp,phpv+n);else ehpv=Math.min(enemyMaxHp,ehpv+n);return n}
function pub23Targets(side){return pub23Rival(side).map((c,i)=>({c,i})).filter(x=>x.c)}
function pub23Strong(side){return pub23Targets(side).sort((a,b)=>(b.c.atk||0)-(a.c.atk||0))[0]||null}
async function pub23Destroy(side,t){if(!t?.c)return false;return await destroyCard(side==='p'?'e':'p',t.i)}
async function pub23DestroyMany(side,n=1,filter=null){
 let done=0;for(let k=0;k<n;k++){let arr=pub23Targets(side).filter(x=>!filter||filter(x.c));if(!arr.length)break;arr.sort((a,b)=>(b.c.atk||0)-(a.c.atk||0));if(await pub23Destroy(side,arr[0]))done++}return done
}
async function pub23ResurrectSpecific(side,c){
 const arr=pub23Own(side),grave=pub23Grave(side),modes=side==='p'?playerModes:enemyModes;
 const free=arr.findIndex(x=>!x),gi=grave.indexOf(c);if(free<0||gi<0)return false;
 grave.splice(gi,1);const rev={...c,_p23RevivePending:0};arr[free]=rev;modes[free]='ATAQUE';
 await place(side,free,rev);await flip(side,free);await setMode(side,free,'ATAQUE');return true
}
function pub23Text(c){return extTextList(c)}
function pub23Descriptor(c){
 const list=pub23Text(c),st=pub23State(c),u=extUltimateText(c);
 if(u&&!c._extUltimateUsed&&st.uses>=Math.max(1,list.length))return{name:'DEFINITIVA',kind:'public23Ultimate',desc:u,onceDuel:true};
 const raw=list.length?list[st.uses%list.length]:'Poder NÉMESIS';
 return{name:String(raw).split(':')[0].slice(0,52).toUpperCase(),kind:'public23Ability',desc:raw,p23Index:list.length?st.uses%list.length:0}
}
function pub23Sync(){
 for(const side of ['p','e']){
  const own=pub23Own(side),grave=pub23Grave(side),riv=pub23Rival(side);
  const cab=own.find(c=>pub23Is(c,'UNI-001'));
  if(cab){
   const dark=grave.filter(c=>c&&pub23Has(c,'oscuridad')).length,want=dark*200,old=cab._p23ShadowDef||0;
   if(old!==want){cab.def=Math.max(0,(cab.def||0)-old+want);cab._p23ShadowDef=want}
  }
  const odin=own.find(c=>pub23Is(c,'ML-001'));
  if(odin){
   const on=own.filter(c=>c&&pub23Has(c,'divina')).length>=2;
   own.forEach(c=>{if(!c)return;const old=c._p23OdinAura||0,want=on?500:0;if(old!==want){c.atk=Math.max(0,(c.atk||0)-old+want);c.def=Math.max(0,(c.def||0)-old+want);c._p23OdinAura=want}})
  }
  const crystal=own.find(c=>pub23Is(c,'UNI-008'));
  if(crystal&&!crystal._p23CorruptionApplied){
   riv.forEach(c=>{if(c){c.atk=Math.max(0,(c.atk||0)-300);c.def=Math.max(0,(c.def||0)-300)}});crystal._p23CorruptionApplied=true
  }
  const rupture=own.find(c=>pub23Is(c,'UNI-012'));
  if(rupture)window.__nemesisRuptureDimensional=true;
 }
}
async function pub23PreventDestroy(side,i,c){
 if(!pub23Is(c))return false;
 const st=pub23State(c);
 if(c.id==='UNI-001'&&!st.once.immortal){
   const g=pub23Grave(side),j=g.findIndex(x=>x&&pub23Has(x,'oscuridad'));
   if(j>=0){g.splice(j,1);st.once.immortal=true;toast('CABALLERO INMORTAL: sacrifica una carta OSCURIDAD y evita la destrucción.');return true}
 }
 if(c.id==='UNI-002'&&!st.once.revive){st.once.revive=true;c._p23RevivePending=turnNo+1}
 if(c.id==='UNI-003'&&!st.once.timeSave){
   const g=pub23Grave(side);if(g.length){g.splice(g.length-1,1);st.once.timeSave=true;pub23Queue(side).unshift(c.id);toast('MANIPULACIÓN DEL TIEMPO: vuelve a la parte superior del Deck.');return true}
 }
 if(c.id==='ML-003'&&!st.once.finalFire){
   st.once.finalFire=true;await pub23DestroyMany(side,99,x=>x.type==='magic'||x.type==='trap');pub23Damage(side,1500)
 }
 return false
}
function pub23AfterDestroyed(side,victim){
 if(!victim)return;
 const own=pub23Own(side),rival=pub23Rival(side);
 rival.forEach(c=>{
  if(pub23Is(c,'ML-002')){
   const st=pub23State(c),old=c._p23Hunger||0,add=Math.min(800,4800-old);
   if(add>0){c.atk+=add;c._p23Hunger=old+add}
  }
 });
 if(pub23Is(victim,'UNI-002')&&victim._p23RevivePending)victim._p23RevivePending=turnNo+1;
}
async function pub23TurnStart(){
 for(const side of ['p','e']){
  const own=pub23Own(side),grave=pub23Grave(side);
  for(const c of own){
   if(!pub23Is(c))continue;const st=pub23State(c);st.turns++;
   if(c.id==='ML-003'){c.atk+=500;c.def+=300}
   if(c.id==='ML-008'&&side==='p'){await extDraw(side,1);c._p23NoEffectDamageUntil=turnNo}
  }
  const phoenix=grave.find(c=>pub23Is(c,'UNI-002')&&c._p23RevivePending&&c._p23RevivePending<=turnNo);
  if(phoenix&&await pub23ResurrectSpecific(side,phoenix)){toast('RENACER DE LA AURORA: Fénix regresa del Cementerio.')} 
 }
 pub23Sync()
}
async function pub23UseAbility(side,i,c,sk){
 const st=pub23State(c),k=sk.p23Index||0,t=pub23Strong(side);
 if(sk.kind==='public23Ultimate'){
  if(c._extUltimateUsed)return false;
  if(c.id==='ML-001'){if(t){await extStealStrongest(side);t.c._silencedUntil=turnNo}}
  else if(c.id==='ML-002'){await pub23DestroyMany(side,99,x=>pub23Has(x,'divina'));if(st.ragnarok)enemySkipTurns=Math.max(enemySkipTurns,1)}
  else if(c.id==='ML-003'){c._p23SecondAttackTurn=turnNo}
  else if(c.id==='ML-004'){await pub23DestroyMany(side,99);await extResurrect(side,1);c.atk+=3000}
  else if(c.id==='ML-005'){const hadDiv=pub23Targets(side).some(x=>pub23Has(x.c,'divina'));await pub23DestroyMany(side,3);if(hadDiv)c.atk+=Number(c.externalData?.atk||c.atk||0)}
  else return await applyExternalAbility(side,i,c,sk.desc,true);
  c._extUltimateUsed=true;toast(c.name+': DEFINITIVA activada.');update();return true
 }
 if(c.id==='UNI-001'){
  if(k===0)pub23Sync();
  else if(k===1){const g=pub23Grave(side),j=g.findIndex(x=>x&&pub23Has(x,'oscuridad'));if(j<0){toast('Necesitas 1 carta OSCURIDAD en Cementerio.');return false}g.splice(j,1);c.atk+=300;c._p23SecondAttackTurn=turnNo}
  else c._immortalUntil=Math.max(c._immortalUntil||0,turnNo)
 }else if(c.id==='UNI-002'){
  if(k===0)c._p23RevivePending=turnNo+1;
  else if(k===1){c.atk+=800;c.def+=800}
  else await pub23DestroyMany(side,1,x=>x.type==='magic'||x.type==='trap')
 }else if(c.id==='UNI-003'){
  if(k===0){const q=pub23Queue(side==='p'?'e':'p');if(q.length>2){const a=q.splice(0,3);q.unshift(a[2],a[0],a[1])}}
  else if(k===1){if(t){const arr=pub23Rival(side);arr[t.i]=null;pub23Queue(side==='p'?'e':'p').unshift(t.c.id);toast('RETROCESO TEMPORAL: carta devuelta al Deck.')}}
  else c._immortalUntil=Math.max(c._immortalUntil||0,turnNo)
 }else if(c.id==='ML-001'){
  if(k===0)await extDraw(side,1);
  else if(k===1){const own=pub23Own(side),j=own.findIndex(x=>x&&x!==c);if(j>=0){await destroyCard(side,j);window.__nemesisDmLockUntil=turnNo}}
  else pub23Sync()
 }else if(c.id==='ML-002'){
  if(k===0){c.atk+=Math.min(800,4800-(c._p23Hunger||0));c._p23Hunger=Math.min(4800,(c._p23Hunger||0)+800)}
  else if(k===1){st.ragnarok=true;c.atk+=3000;c._p23SecondAttackTurn=turnNo}
  else {c.atk+=1000;c._p23PiercingDivineTurn=turnNo}
 }else if(c.id==='ML-003'){
  if(k===0){await pub23DestroyMany(side,2);c.atk+=1200}
  else if(k===1){c.atk+=500;c.def+=300}
  else {await pub23DestroyMany(side,99,x=>x.type==='magic'||x.type==='trap');pub23Damage(side,1500)}
 }else if(c.id==='ML-004'){
  if(k===0){for(const x of pub23Targets(side).slice(0,2)){x.c.atk=Math.max(0,x.c.atk-500);x.c.def=Math.max(0,x.c.def-500);x.c._p23Abismo=true}}
  else if(k===1&&t){t.c._silencedUntil=turnNo;t.c._cannotAttackUntil=turnNo}
  else {await pub23DestroyMany(side,1);await extDraw(side,2)}
 }else if(c.id==='ML-005'){
  if(k===0){const q=pub23Queue(side==='p'?'e':'p');if(q.length)q.shift()}
  else if(k===1)window.__nemesisDuatUntil=turnNo+2;
  else {await destroyCard(side,i);await extResurrect(side,1)}
 }else return await applyExternalAbility(side,i,c,sk.desc,false);
 st.uses++;c._extSkillUses=(c._extSkillUses||0)+1;update();return true
}
async function pub23UseMagic(side,c){
 const id=c.id,own=pub23Own(side),riv=pub23Rival(side),grave=pub23Grave(side);
 if(id==='UNI-009'){await pub23DestroyMany(side,1);enemySkipTurns=Math.max(enemySkipTurns,1);await extDraw(side,1);toast('INTERRUPCIÓN ABSOLUTA: activación anulada.');return true}
 if(id==='UNI-010'){for(let n=0;n<2&&grave.length;n++){const x=grave.pop();if(x)pub23Queue(side).push(x.id)}if(side==='p'&&phpv<=2000){pub23Heal(side,1500);await extDraw(side,1)}if(side==='e'&&ehpv<=2000){pub23Heal(side,1500);await extDraw(side,1)}window.__nemesisPortalProtectionUntil=turnNo;return true}
 if(id==='UNI-011'){await pub23DestroyMany(side,99,x=>x.type==='magic'||x.type==='trap');const attrs=new Set(own.filter(Boolean).flatMap(x=>x.tags||[]));pub23Damage(side,Math.min(5000,2000+attrs.size*500));if(pub23Targets(side).length>own.filter(Boolean).length)await pub23DestroyMany(side,1);riv.forEach(x=>{if(x){x.atk=Math.max(0,x.atk-1000);x.def=Math.max(0,x.def-1000);x._p23DebuffUntil=turnNo+2}});return true}
 if(id==='UNI-012'){window.__nemesisRuptureDimensional=true;window.__nemesisRuptureOwner=side;toast('RUPTURA DIMENSIONAL: Campo activo.');return true}
 if(id==='UNI-008'){await pub23DestroyMany(side,1);pub23Heal(side,500);window.__nemesisVoidCrystalUntil=turnNo;return true}
 if(id==='ML-011'){await pub23DestroyMany(side,99);pub23Damage(side,5000);await extResurrect(side,2);return true}
 if(['UNI-004','UNI-005','UNI-006','UNI-007','ML-006','ML-007','ML-008','ML-009','ML-010'].includes(id)){
   const idx=await magicAllyIndex(side,'ELIGE CARTA PARA EQUIPAR '+c.name);if(idx<0)return false;
   const d=c.externalData||{},cls=String(d.clase||'').toUpperCase(),kind=cls.includes('ARMA')?'weapon':cls.includes('ARMADURA')?'armor':'relic';
   const ab=Number(d.atk_bonus??d.bonos?.atk??0),db=Number(d.def_bonus??d.bonos?.def??0);
   nemesisEquip(side,idx,kind,c,{atkBonus:ab,defBonus:db,flag:'_p23_'+id.replace(/-/g,'_')});
   const target=own[idx];if(target){
    if((id==='ML-006'||id==='ML-010')&&target._p23Mjolnir){toast('Esta criatura ya tiene una variante de Mjölnir equipada.');return false}
    target._p23Equip=target._p23Equip||{};target._p23Equip[id]=true;
    if(id==='UNI-004'){target._p23EclipseWeapon=true}
    if(id==='UNI-005'){target._p23DragonArmor=true}
    if(id==='UNI-006'){target._p23AstralAegis=true}
    if(id==='ML-006'||id==='ML-010'){target._p23Mjolnir=true}
    if(id==='ML-009'){target._p23Piercing=true}
    if(id==='ML-007'&&pub23Is(target,'ML-002')){pub23State(target).ragnarok=false;target._p23Gleipnir=true}
   }
   toast(c.name+' equipada y efectos activados.');return true
 }
 return false
}
window.NEMESIS_PUBLIC23_AUDIT=()=>({
 total:NEMESIS_PUBLIC_23_IDS.length,
 unique:new Set(NEMESIS_PUBLIC_23_IDS).size,
 handlers:NEMESIS_PUBLIC_23_IDS.map(id=>({id,card:!!card(id),type:card(id)?.type})),
 rupture:!!window.__nemesisRuptureDimensional,
 ok:NEMESIS_PUBLIC_23_IDS.length===23&&new Set(NEMESIS_PUBLIC_23_IDS).size===23
});

function extAbilityDescriptor(c){
 if(pub23Is(c)&&c.type==='monster')return pub23Descriptor(c);
 const list=extTextList(c),uses=c._extSkillUses||0,ultimate=extUltimateText(c);
 if(ultimate&&uses>=Math.min(2,Math.max(1,list.length-1))&&!c._extUltimateUsed)return{name:'ULTIMATE',kind:'externalUltimate',desc:ultimate,onceDuel:true};
 const text=list.length?list[uses%list.length]:'Poder NÉMESIS externo.';
 const name=String(text).split(':')[0].slice(0,48).toUpperCase();
 return{name,kind:'external',desc:text}
}
async function applyExternalAbility(side,i,c,text,isUltimate=false){
 text=String(text||'');const low=text.toLowerCase(),value=extNum(text,isUltimate?3000:1000);
 if(isUltimate)c._extUltimateUsed=true;
 if(/roba|robar/.test(low))await extDraw(side,isUltimate?2:1);
 if(/cementerio|resuc|reviv|invoca/.test(low))await extResurrect(side,isUltimate?2:1);
 if(/recupera.*hp|cura|restaura.*hp/.test(low)){if(side==='p')phpv=Math.min(playerMaxHp,phpv+value);else ehpv=Math.min(enemyMaxHp,ehpv+value)}
 if(/destruye|destierra|elimina|juicio/.test(low))await extDestroyStrongest(side,isUltimate?2:1);
 if(/control|apropia|usurpa|toma temporalmente/.test(low))await extStealStrongest(side);
 if(/turno|tiempo|paradoja/.test(low)&&side==='p')enemySkipTurns=Math.max(enemySkipTurns,1);
 if(/anula|niega|inmune|protege|evitar.*destru/.test(low)){c._immortalUntil=Math.max(c._immortalUntil||0,turnNo+(isUltimate?2:1));playerDirectShieldUntil=Math.max(playerDirectShieldUntil,turnNo)}
 if(/atk|ataque|fueria|furia|fortalec/.test(low)){const b=Math.max(500,value);c.atk+=b;c._skillAtkBonus=(c._skillAtkBonus||0)+b;olympusNotifyAttackIncrease(side,b)}
 if(/def|escudo|armadura|coraza/.test(low)){const b=Math.max(500,value);c._shieldBonus=(c._shieldBonus||0)+b;c._shieldPending=true}
 if(/daño directo|inflige|castigo/.test(low)){const d=Math.max(700,Math.min(8000,value));if(side==='p'){ehpv=Math.max(0,ehpv-d);damageFx(d,'e')}else{phpv=Math.max(0,phpv-d);damageFx(d,'p')}}
 if(/regresa|retorno|abandona temporalmente|ascensión/.test(low)){c._immortalUntil=Math.max(c._immortalUntil||0,turnNo+1);c.atk+=1000;c.def+=1000}
 if(/remontada|estado crítico|peor.*situación/.test(low)&&side==='p'){const missing=playerMaxHp-phpv;const gain=Math.min(5000,Math.max(1500,Math.round(missing*.35)));phpv=Math.min(playerMaxHp,phpv+gain);c.atk+=Math.round(missing*.15);c.def+=Math.round(missing*.12);await extDraw(side,2)}
 if(isUltimate&&!/(destruye|destierra|daño|inflige|cementerio|resuc|control|turno|tiempo|remontada)/.test(low)){c.atk+=2500;c.def+=2500;await extDraw(side,1)}
 c._extSkillUses=(c._extSkillUses||0)+1;toast(`${c.name}: ${isUltimate?'ULTIMATE':'habilidad'} ejecutada.`);update();return true
}
async function applyExternalMagic(side,c){
 if(pub23Is(c)&&await pub23UseMagic(side,c))return true;
 if(dmIs(c)&&(c.id==='DM-005'||c.id==='DM-006'))return await dmSpecialMagic(side,c);
 if(dmIs(c)&&c.id==='DM-019'){c._dmTitanTrap=true;c._trapArmed=true;toast('EL JUICIO DE LOS TITANES preparado: contrahechizo listo.');return true;}
 if(dmIs(c)&&c.id==='DM-020'){
  await dmRealmFusion(side);const revived=await dmReviveLow(side,3);
  if(side==='p')phpv=Math.min(playerMaxHp,phpv+3000);else ehpv=Math.min(enemyMaxHp,ehpv+3000);
  toast('ECLIPSE DE LOS REINOS: Fusión estratégica activa · '+revived+' resurrección(es).');update();return true;
 }
 if(dmIs(c)&&['DM-013','DM-014','DM-015','DM-016','DM-017'].includes(c.id)){
  const idx=await magicAllyIndex(side,'ELIGE PORTADOR PARA '+c.name);if(idx<0)return false;
  const own=side==='p'?playerCards:enemyCards,target=own[idx],d=c.externalData||{};
  nemesisEquip(side,idx,(c.id==='DM-014'||c.id==='DM-016')?'relic':'weapon',c,{atkBonus:Number(d.atk_bonus||0),defBonus:Number(d.def_bonus||0),flag:'_dm_'+c.id.replace('-','_')});
  if(c.id==='DM-014'){target._dmTorch=true}
  if(c.id==='DM-015'&&target&&/thor/i.test(target.name)){target.atk+=1500;target._dmMjolnir=true}
  if(c.id==='DM-016'){target._dmCrown=true;if(side==='p')phpv=Math.min(playerMaxHp,phpv+2000);else ehpv=Math.min(enemyMaxHp,ehpv+2000)}
  if(c.id==='DM-017'&&target){target._dmHolyWeapon=true;target._immortalUntil=Math.max(target._immortalUntil||0,turnNo+1)}
  if(c.id==='DM-013'&&target)target._dmTartarus=true;
  dmDeepSync();if(['DM-014','DM-015','DM-016'].includes(c.id))await dmTryShinyAwakening(side);toast(c.name+' equipada y sinergia Duel Master activada.');return true;
 }
 const d=c.externalData||{},cls=String(d.clase||'').toUpperCase();
 if(cls.includes('ARMA')||cls.includes('ARMADURA')||cls.includes('RELIQUIA')){
   const kind=cls.includes('ARMA')?'weapon':cls.includes('ARMADURA')?'armor':'relic',idx=await magicAllyIndex(side,`ELIGE CARTA PARA EQUIPAR ${c.name}`);
   if(idx<0)return false;
   const ab=Number(d.atk_bonus??d.bonos?.atk??0),db=Number(d.def_bonus??d.bonos?.def??0);
   nemesisEquip(side,idx,kind,c,{atkBonus:ab,defBonus:db,flag:`_ext_${c.id.replace(/-/g,'_')}`});
   const target=(side==='p'?playerCards:enemyCards)[idx];if(target){if(ab)target.atk+=0;if(db)target.def+=0}
   const texts=extTextList(c);for(const t of texts.slice(0,2))await applyExternalAbility(side,idx,target||c,t,false);
   toast(`${c.name} equipada como ${kind.toUpperCase()}.`);return true
 }
 const texts=extTextList(c),ultimate=extUltimateText(c);
 for(const t of texts)await applyExternalAbility(side,active>=0?active:0,(side==='p'?playerCards[active]:enemyCards[0])||c,t,false);
 if(ultimate)await applyExternalAbility(side,active>=0?active:0,(side==='p'?playerCards[active]:enemyCards[0])||c,ultimate,true);
 return true
}

function skillFor(c){if(mgrIs(c)&&c.type==='monster')return mgrSkillDescriptor(c);if(dmIs(c)&&c.type==='monster')return dmSkillDescriptor(c);if(c?.externalCard&&c.type==='monster')return extAbilityDescriptor(c);if(!c||c.type==='magic'||c.type==='trap'||c.effect==='phantomReflect'||c.id==='apolo-guardian-solar')return null;const custom={
 'dios-jupiter':{name:'ESCUDO SOLAR',kind:'solarShield',value:2,desc:'Durante 2 turnos, el rival no puede atacar directamente a tus HP.'},
 'zeus-emperador-rayo':{name:'CASTIGO CELESTIAL',kind:'destroyEquipment',value:1,onceDuel:true,desc:'Una vez por duelo, destruye 1 arma, armadura o reliquia enemiga. Zeus todavía puede atacar.'},
 'kronos-devorador-tiempo':{name:'DETENER EL TIEMPO',kind:'stopTime',value:1,onceDuel:true,desc:'Una vez por duelo, el rival pierde su siguiente turno completo.'},
 'titan-del-olimpo':{name:'JUICIO DE LOS TRES DIOSES',kind:'destroyEquipment',value:2,onceDuel:true,desc:'Una vez por duelo, destruye hasta 2 equipamientos enemigos. El Titán todavía puede atacar.'},
 'ojo-dragon-jefe':{name:'MIRADA MALDITA',kind:'debuff',value:700,desc:'Reduce 700 ATK a la criatura rival más fuerte durante el turno.'},
 'anc-ira-ra':{name:'EXPLOSIÓN SOLAR',kind:'damage',value:800,desc:'Inflige 800 HP directamente al jugador rival.'},
 'dragon-carmesi-caos':{name:'ESCAMAS ARDIENTES',kind:'shield',value:600,desc:'Obtiene +600 DEF durante el próximo ataque enemigo.'},
 'dragon-abisal-nemesis':{name:'FURIA ABISAL',kind:'attack',value:650,desc:'Gana +650 ATK durante este turno.'},
 'dragon-negro-ruinas':{name:'ALMA DE LAS RUINAS',kind:'heal',value:400,desc:'Recupera 400 HP de su invocador.'},
 'dragon-infernal-sangre':{name:'SANGRE INFERNAL',kind:'attack',value:700,desc:'Gana +700 ATK durante este turno.'},
 'fusion-caotico-supremo':{name:'DOMINIO CAÓTICO',kind:'attack',value:1000,desc:'Gana +1000 ATK durante este turno.'},
 'fusion-dragon-caos':{name:'CORAZÓN DEL ABISMO',kind:'shield',value:1000,desc:'Obtiene +1000 DEF para el próximo ataque.'},
 'anc-jepri':{name:'RENACER DEL AMANECER',kind:'heal',value:500,desc:'Recupera 500 HP de su invocador.'},
 'anc-ares':{name:'FURIA DEL CONQUISTADOR',kind:'attack',value:700,desc:'Gana +700 ATK durante este turno.'},
 'anc-mnevis':{name:'EMBESTIDA DE HELIÓPOLIS',kind:'attack',value:600,desc:'Gana +600 ATK durante este turno.'},
 'anc-mehen':{name:'ESPIRAL PROTECTORA',kind:'shield',value:800,desc:'Obtiene +800 DEF durante el próximo ataque.'}
 };if(custom[c.id])return custom[c.id];const roots=['INSTINTO','JURAMENTO','PODER','DESPERTAR'],sum=[...(c.name||'NÉMESIS')].reduce((a,x)=>a+x.charCodeAt(0),0);return{name:`${roots[sum%roots.length]} DE ${c.name.toUpperCase()}`,kind:sum%3===0?'shield':'attack',value:400+(sum%3)*100,desc:sum%3===0?'Refuerza su DEF durante el próximo ataque.':'Aumenta su ATK durante este turno.'}}
function skillFx(side,i,skill,c){const g=board[side]?.[i];if(g){burst(g.position,skill.kind==='heal'?0x61ffb0:(skill.kind==='shield'||skill.kind==='solarShield')?0x69ccff:0xffb53f,55);if(g.userData.glow)g.userData.glow.intensity=22}sfx(skill.kind==='damage'?'thunder':'equip');const d=document.createElement('div');d.className='pc-skill-banner';d.innerHTML=`<small>${esc(c.name)}</small><b>${esc(skill.name)}</b><span>${esc(skill.desc)}</span>`;app.appendChild(d);setTimeout(()=>d.remove(),1800);pcLog(`${c.name} activa ${skill.name}.`,'effect')}
let enemySkipTurns=0;
function olympusNotifyAttackIncrease(side,amount=0){
 const rivals=side==='p'?enemyCards:playerCards;const zeus=rivals?.find(c=>c&&c.id==='zeus-emperador-rayo');
 if(zeus&&amount>0){zeus.atk+=500;zeus._zeusThunderBonus=(zeus._zeusThunderBonus||0)+500;toast(`SEÑOR DEL TRUENO: Zeus gana +500 ATK (${zeus.atk}).`);pcLog('Zeus responde al aumento de ATK rival: +500 ATK.','effect')}
}
async function destroyEnemyEquipment(side,count=1,source=null){
 const targetSide=side==='p'?'e':'p',arr=targetSide==='e'?enemyCards:playerCards,options=[];
 arr.forEach((c,i)=>{const slots=nemesisEquipmentSlots(c);if(slots)for(const kind of ['weapon','armor','relic'])if(slots[kind])options.push({c,i,label:slots[kind].label,kind})});
 // Compatibilidad hacia atrás: si existe un visual antiguo sin registro lógico, también puede destruirse.
 arr.forEach((c,i)=>{const eq=board?.[targetSide]?.[i]?.userData?.equipment||{};Object.keys(eq).forEach(label=>{if(!options.some(o=>o.i===i&&o.label===label))options.push({c,i,label,kind:eq[label]?.userData?.kind||'relic',legacy:true})})});
 if(!options.length){toast('No hay armas, armaduras ni reliquias enemigas equipadas.');return false}
 for(let n=0;n<count&&options.length;n++){
  let pick=options[0];
  if(side==='p'&&options.length>1){const chosen=await chooseMagicTarget(`CASTIGO CELESTIAL · ELIGE EQUIPAMIENTO ${n+1}/${count}`,options.map((x,j)=>({c:{...x.c,name:`${x.label} · ${x.c.name}`,img:x.c.img,atk:x.c.atk,def:x.c.def},i:j})),'e');if(!chosen)break;pick=options[chosen.i]}
  const g=board?.[targetSide]?.[pick.i];if(!g)continue;
  if(pick.legacy){if(pick.label==='Armadura de Ra'&&arr[pick.i]){arr[pick.i].def=Math.max(0,arr[pick.i].def-1000);delete arr[pick.i]._armorRa}pcRemoveEquipment(g,pick.label,true)}
  else nemesisUnequip(targetSide,pick.i,pick.kind,{broken:true,toGrave:true,reason:`destruido por ${source?.name||'Poder divino'}`});
  toast(`${source?.name||'Poder divino'} destruye ${pick.label}.`);pcLog(`${source?.name||'Poder divino'} destruye ${pick.label}.`,'effect');
  const k=options.indexOf(pick);if(k>=0)options.splice(k,1)
 }
 return true
}
function applyTitanDominion(){
 const titan=playerCards?.some(c=>c&&c.id==='titan-del-olimpo');
 playerCards?.forEach(c=>{if(!c||c.id==='titan-del-olimpo'||c.rarity!=='divina')return;if(titan&&!c._titanAuraBonus){c.atk+=500;c.def+=500;c._titanAuraBonus=true}else if(!titan&&c._titanAuraBonus){c.atk=Math.max(0,c.atk-500);c.def=Math.max(0,c.def-500);delete c._titanAuraBonus}})
}
function updateSkillButtons(){const c=playerCards?.[active],sk=skillFor(c),action=phase==='ACTION'&&!!c,used=sk?.onceDuel?c?._skillUsedDuel:c?._skillUsedTurn===turnNo;if(skillBtn){skillBtn.disabled=!action||!sk||!!used;skillBtn.textContent=sk?(used?'HABILIDAD USADA':sk.name):'HABILIDAD'}if(playerPowerBtn){const remain=Math.max(0,playerPowerReadyTurn-turnNo);playerPowerBtn.disabled=!action||remain>0;playerPowerBtn.textContent=remain?`PODER · ${remain}T`:'PODER NÉMESIS'}}
async function useCreatureSkill(side,i){const arr=side==='p'?playerCards:enemyCards,c=arr[i],sk=skillFor(c);if(side==='e'&&c&&sk&&await dmTitanJudgement('p',c,'habilidad'))return false;if(!c||!sk||(sk.onceDuel?c._skillUsedDuel:c._skillUsedTurn===turnNo))return false;if(sk.onceDuel)c._skillUsedDuel=true;else c._skillUsedTurn=turnNo;if(pcCinematicProfile(c))await pcCardCinematic('skill',side,i,c);skillFx(side,i,sk,c);if(sk.kind==='dmAbility'||sk.kind==='dmUltimate'){await dmUseAbility(side,i,c,sk)}else if(sk.kind==='public23Ability'||sk.kind==='public23Ultimate'){await pub23UseAbility(side,i,c,sk)}else if(sk.kind==='external'){await applyExternalAbility(side,i,c,sk.desc,false)}else if(sk.kind==='externalUltimate'){await applyExternalAbility(side,i,c,sk.desc,true)}else if(sk.kind==='magoRojo'){await mgrUseSkill(side,i,c,sk)}
 else if(sk.kind==='dmAphrodite'){const rival=side==='p'?enemyCards:playerCards,t=rival.filter(Boolean).sort((a,b)=>(b.atk||0)-(a.atk||0))[0];if(t){t.atk=Math.max(0,t.atk-1500);t._dmAphroditeLockedUntil=turnNo;toast('SEDUCCIÓN DEL ALMA: '+t.name+' queda sometida este turno.')}c._immortalUntil=Math.max(c._immortalUntil||0,turnNo+1)}
 else if(sk.kind==='dmThorShiny'){const rival=side==='p'?enemyCards:playerCards;rival.filter(Boolean).forEach(t=>{t.atk=Math.max(0,t.atk-1500)});if(side==='p'){ehpv=Math.max(0,ehpv-2500);damageFx(2500,'e')}else{phpv=Math.max(0,phpv-2500);damageFx(2500,'p')}c.atk+=1000;toast('THOR SHINY: TRUENO ETERNO desatado.');}
 else if(sk.kind==='dmMedusa'){const rival=side==='p'?enemyCards:playerCards,t=rival.filter(Boolean).sort((a,b)=>(b.atk||0)-(a.atk||0))[0];if(t){t._dmPetrifiedUntil=turnNo+1;t._attackDisabledUntil=turnNo+1;c.atk+=500;c.def+=500;c._dmStoneBonus=Math.min(2000,(c._dmStoneBonus||0)+500);toast('MIRADA PETRIFICANTE: '+t.name+' queda petrificada.')}}else if(sk.kind==='attack'){c.atk+=sk.value;olympusNotifyAttackIncrease(side,sk.value);const key=side==='p'?'_skillAtkBonus':'_enemySkillAtkBonus';c[key]=(c[key]||0)+sk.value}else if(sk.kind==='shield'){c._shieldBonus=(c._shieldBonus||0)+sk.value;c._shieldPending=true}else if(sk.kind==='heal'){if(side==='p')phpv=Math.min(playerMaxHp,phpv+sk.value);else ehpv=Math.min(enemyMaxHp,ehpv+sk.value)}else if(sk.kind==='damage'){if(side==='p')ehpv=Math.max(0,ehpv-sk.value);else phpv=Math.max(0,phpv-sk.value);damageFx(sk.value,side==='p'?'e':'p')}else if(sk.kind==='solarShield'){if(side==='p'){playerDirectShieldUntil=Math.max(playerDirectShieldUntil,turnNo+1);toast(`${c.name}: Escudo Solar protege tus HP de ataques directos durante 2 turnos.`)}else{toast(`${c.name}: Escudo Solar activado.`)}}else if(sk.kind==='debuff'){const rivals=side==='p'?enemyCards:playerCards,target=rivals.map((x,j)=>({c:x,j})).filter(x=>x.c).sort((a,b)=>b.c.atk-a.c.atk)[0];if(target){target.c.atk=Math.max(0,target.c.atk-sk.value);target.c._skillDebuff=(target.c._skillDebuff||0)+sk.value;toast(`${target.c.name} pierde ${sk.value} ATK durante este turno.`)}}else if(sk.kind==='stopTime'){if(side==='p'){enemySkipTurns=Math.max(enemySkipTurns,1);toast('KRONOS DETIENE EL TIEMPO: el rival perderá su siguiente turno completo.')}else{playerAttackBlockedUntil=Math.max(playerAttackBlockedUntil,turnNo+1)}}else if(sk.kind==='destroyEquipment'){await destroyEnemyEquipment(side,sk.value||1,c)}update();updateSkillButtons();await wait(280);return true}
function clearSkillTurnEffects(){mgrClearTurn();playerCards.forEach(c=>{if(c?._idrBreathBonus){c.atk=Math.max(0,c.atk-c._idrBreathBonus);delete c._idrBreathBonus}if(c?._idrFuryBonus){c.atk=Math.max(0,c.atk-c._idrFuryBonus);delete c._idrFuryBonus}if(c?._skillDebuff){c.atk+=c._skillDebuff;delete c._skillDebuff}if(c?._treasureHungerBonus){c.atk=Math.max(0,c.atk-c._treasureHungerBonus);delete c._treasureHungerBonus}});enemyCards.forEach(c=>{if(c?._idrBreathBonus){c.atk=Math.max(0,c.atk-c._idrBreathBonus);delete c._idrBreathBonus}if(c?._idrFuryBonus){c.atk=Math.max(0,c.atk-c._idrFuryBonus);delete c._idrFuryBonus}if(c?._enemySkillAtkBonus){c.atk=Math.max(0,c.atk-c._enemySkillAtkBonus);delete c._enemySkillAtkBonus}if(c?._treasureHungerBonus){c.atk=Math.max(0,c.atk-c._treasureHungerBonus);delete c._treasureHungerBonus}})}
function update(){mgrSync();idrStormSync();treasureSyncEquipmentBonuses();pub23Sync();nemesisDmSync();heroicSync();const hp=document.getElementById('heroicP'),he=document.getElementById('heroicE'),hpt=document.getElementById('heroicPT'),het=document.getElementById('heroicET'),hf=document.getElementById('heroicFormation'),hi=document.getElementById('heroicIntent'),hw=document.getElementById('heroicWeather');if(hp)hp.style.width=HEROIC.climaxP+'%';if(he)he.style.width=HEROIC.climaxE+'%';if(hpt)hpt.textContent=HEROIC.climaxP+'%';if(het)het.textContent=HEROIC.climaxE+'%';if(hf)hf.textContent=heroicFormation()?.name||'SIN FORMACIÓN';if(hi)hi.textContent='IA: '+heroicIntent();if(hw)hw.textContent=HEROIC.weather;if(aresIsBoss())aresSyncPhase();if(hadesIsBoss())hadesSyncPhase();applyTitanDominion();v188UpdateHUD();applyDragonRage();applyBossPhases();olympusEvaluateSynergies();olympusUpdateZone();updatePcStrategicHud();updateSkillButtons()}
const NEMESIS_PHASES=Object.freeze(['DRAW','PLACE','ACTION','TARGET','ENEMY','END']);
const NEMESIS_PHASE_TRANSITIONS=Object.freeze({
 DRAW:['PLACE','ACTION','ENEMY','END'],
 PLACE:['ACTION','ENEMY','END'],
 ACTION:['TARGET','ENEMY','PLACE','END'],
 TARGET:['ACTION','ENEMY','END'],
 ENEMY:['DRAW','PLACE','ACTION','END'],
 END:[]
});
let nemesisPhaseHistory=[];
function setPhase(t,msg,meta={}){
 if(!NEMESIS_PHASES.includes(t)){console.error('[NÉMESIS FLOW] fase inválida',t);return false}
 const from=phase;
 const allowed=NEMESIS_PHASE_TRANSITIONS[from]||[];
 if(from&&from!==t&&!allowed.includes(t)&&!meta.force){
   console.warn('[NÉMESIS FLOW] transición protegida',from,'→',t,msg||'');
 }
 phase=t;
 nemesisPhaseHistory.push({turn:turnNo,from,to:t,boss:duelKey,at:Date.now()});
 if(nemesisPhaseHistory.length>80)nemesisPhaseHistory.shift();
 turnphase.firstChild.textContent=msg||t;
 // Regla global: ACTION siempre debe ser jugable; otras fases deciden su propia UI.
 if(t==='ACTION'&&playerCards.some(Boolean))battleActions.classList.remove('hidden');
 if(t==='TARGET')battleActions.classList.add('hidden');
 updatePcStrategicHud();updateSkillButtons();
 return true
}
function info(c,i,side='p'){if(!c){cardinfo.innerHTML='<b>SELECCIONA CARTA</b>';return}const mode=i>=0?(side==='p'?playerModes[i]:enemyModes[i]):'',sk=skillFor(c);cardinfo.innerHTML=`<b>${c.name}</b><small>${c.type==='magic'?'CARTA MÁGICA':`ATK ${c.atk} · DEF ${c.def}`}</small><small>${mode?`MODO ${mode}`:((META[c.id]||{}).attackName||'EFECTO NÉMESIS')}</small>${sk?`<strong>${sk.name}</strong><small>${sk.desc}</small>`:''}`;updateSkillButtons()}
function pcEquipmentText(c){const slots=nemesisEquipmentSlots(c);if(!slots)return '';const list=['weapon','armor','relic'].map(k=>slots[k]?.label).filter(Boolean);return list.length?` · EQUIPO: ${list.join(' / ')}`:''}
function pcAbilityText(c){if(c?.externalCard){const d=c.externalData||{},txt=[...extTextList(c),extUltimateText(c)].filter(Boolean).join(' · ');return `${d.clase||'CARTA'} · ${txt||'Efecto NÉMESIS externo.'}`}const effects={heal:`Recupera ${c.value} HP.`,damageOpponent:`Inflige ${c.value} HP al jugador rival.`,boost:`Otorga +${c.value} ATK.`,boostTurn:`Otorga +${c.value} ATK durante el turno.`,shieldNext:`Protege con +${c.value} DEF el próximo ataque.`,resurrect:'Devuelve una criatura del Cementerio al campo.',purgeSpellTrap:'Destruye una carta mágica o trampa rival.',petrifyTurn:'Cambia una criatura rival a defensa y bloquea su ataque.',negateMagic:'Anula una carta mágica rival.',raGrowth:'Gana +500 ATK por turno sin límite.',armorRa:'Ira de Ra gana +1000 DEF.',destroyLowestDef:'Destruye la criatura rival con menor DEF.',raUltimate:'Destruye dos cartas rivales y se consume.',defenseEntry:'Las cartas aliadas ganan +300 DEF.',blockAttacksOneTurn:'Bloquea los ataques rivales durante un turno.',bronzeGrowth:'Gana +300 ATK por cada atacante rival.',solarShield:'Durante 2 turnos, el rival no puede atacar directamente a los HP del jugador.',phantomReflect:'Cuando es atacada, copia el ATK de la carta atacante y causa esa misma cantidad de daño directamente a los HP del rival.',zeusThunder:'Castigo Celestial destruye equipamiento; Señor del Trueno gana +500 ATK cuando el rival aumenta ATK.',kronosTime:'Detener el Tiempo salta el próximo turno rival; Retroceso Temporal evita su primera destrucción.',olympusSupreme:'Fusión de Júpiter + Zeus + Kronos. Juicio destruye hasta 2 equipamientos; Voluntad evita su primera destrucción; Dominio potencia otras DIVINAS.'},sk=skillFor(c),base=effects[c.effect]||((META[c.id]||{}).attackName?`Ataque: ${(META[c.id]||{}).attackName}.`:'Criatura de combate NÉMESIS.');return (sk?`${sk.name}: ${sk.desc} · EFECTO ORIGINAL: ${base}`:base)+pcEquipmentText(c)}
function pcHistoryText(c){if(c.ancestral)return 'Carta del mazo ancestral. Su poder proviene de los mitos, dioses y reliquias del mundo de NÉMESIS.';if(c.dragonDeck)return 'Carta forjada para el ejército del Dragón Ojo del Diablo.';if(c.type==='magic')return 'Hechizo de apoyo que altera el curso estratégico del duelo.';if(c.type==='trap')return 'Trampa oculta que responde a las acciones del enemigo.';return 'Guerrero de NÉMESIS preparado para conquistar los castillos del reino.'}
function pcPreviewCard(c){const img=document.getElementById('pcPreviewImg'),name=document.getElementById('pcPreviewName'),stats=document.getElementById('pcPreviewStats'),ability=document.getElementById('pcPreviewAbility'),history=document.getElementById('pcPreviewHistory');if(!img||!name||!stats||!c)return;img.src=c.img;img.classList.add('visible');name.textContent=c.name;stats.textContent=cardStats(c);if(ability)ability.textContent=pcAbilityText(c);if(history)history.textContent=pcHistoryText(c)}
let pcLastLog='',pcLastLogAt=0;function pcLog(msg,type='event'){const list=document.getElementById('pcDuelLog');if(!list||!msg)return;const now=Date.now();if(msg===pcLastLog&&now-pcLastLogAt<250)return;pcLastLog=msg;pcLastLogAt=now;const li=document.createElement('li');li.className=type;li.dataset.type=type;li.innerHTML=`<small>T${turnNo}</small><span>${esc(msg)}</span>`;list.prepend(li);while(list.children.length>32)list.lastElementChild.remove()}
function updatePcStrategicHud(){const pd=document.getElementById('playerDeckCount'),ed=document.getElementById('enemyDeckCount'),pg=document.getElementById('playerGraveCount'),eg=document.getElementById('enemyGraveCount'),tc=document.getElementById('pcTurnCount');if(pd)pd.textContent=deckQueue.length;if(ed)ed.textContent=enemyQueue.length;if(pg)pg.textContent=playerGrave.length;if(eg)eg.textContent=enemyGrave.length;if(tc)tc.textContent=turnNo;slotMeshes.forEach(m=>{const side=m.userData.side,i=m.userData.index,occupied=!!board[side][i],attackReady=phase==='ACTION'&&side==='p'&&occupied&&playerModes[i]==='ATAQUE',target=phase==='TARGET'&&side==='e'&&occupied,placeable=phase==='PLACE'&&side==='p'&&!occupied;m.material.color.setHex(target?0xff183d:attackReady?0x20e879:side==='p'?0x5b35a8:0xa52a45);m.material.opacity=placeable?.30:target?.38:attackReady?.24:occupied?.045:.10;if(m.userData.edge){m.userData.edge.material.color.setHex(target?0xff2448:attackReady?0x53ff9a:side==='p'?0xb47aff:0xff667e);m.userData.edge.material.opacity=placeable?.9:target?.98:attackReady?.9:occupied?.22:.48}const g=board[side][i];if(g?.userData?.front?.material)g.userData.front.material.emissiveIntensity=attackReady?.48:target?.34:.12})}
function updatePcBonusBadges(){const layer=document.getElementById('pcBonusLayer');if(!layer)return;for(const side of ['p','e'])for(let i=0;i<5;i++){const key=side+i;let badge=layer.querySelector(`[data-card="${key}"]`);if(!badge){badge=document.createElement('div');badge.dataset.card=key;layer.appendChild(badge)}const c=(side==='p'?playerCards:enemyCards)[i],g=board[side][i];if(!c||!g){badge.hidden=true;continue}const tags=[];if(c._turnAtkBonus)tags.push(`+${c._turnAtkBonus} ATK`);if(c._skillAtkBonus)tags.push(`HABILIDAD +${c._skillAtkBonus}`);if(c._playerPowerBonus)tags.push(`NÉMESIS +${c._playerPowerBonus}`);if(c._enemySkillAtkBonus)tags.push(`HABILIDAD +${c._enemySkillAtkBonus}`);if(c._skillDebuff)tags.push(`-${c._skillDebuff} ATK`);if(c._shieldPending)tags.push(`+${c._shieldBonus||0} DEF`);if(c._dragonRageBonus)tags.push(`IRA +${c._dragonRageBonus}`);if(c._petrifiedUntil>=turnNo)tags.push('PETRIFICADA');if(c.id==='anc-ira-ra')tags.push('+500 ATK/TURNO');if(c.id==='anc-lanza-bronce')tags.push('+300 × ATACANTE');if(!tags.length){badge.hidden=true;continue}const p=g.position.clone().project(cam),rect=r.domElement.getBoundingClientRect();badge.hidden=false;badge.textContent=tags.join(' · ');badge.style.left=`${rect.left+(p.x+1)*rect.width/2}px`;badge.style.top=`${rect.top+(-p.y+1)*rect.height/2-28}px`}}
document.getElementById('pcClearLog').onclick=()=>{document.getElementById('pcDuelLog').innerHTML=''};
function toast(msg){hint3d.textContent=msg;pcLog(msg)}
async function setMode(side,i,mode){
 const g=board[side][i];if(!g)return;
 if(g.userData.faceDown)await flip(side,i);

 const q=v1892FinalTransform(side,i,mode);
 // reseteo absoluto evita acumulación de rotaciones de animaciones anteriores
 g.rotation.set(0,0,0);
 g.position.set(q.x,q.y,q.z);
 g.rotation.set(q.rotX,q.rotY,q.rotZ);
 g.scale.set(q.scale,q.scale,q.scale);
 g.userData.v182BaseY=q.y;

 if(mode==='DEFENSA')v188Sound('defense');
 (side==='p'?playerModes:enemyModes)[i]=mode;
}
function askMode(){return new Promise(res=>{const d=document.createElement('div');d.style='position:absolute;z-index:80;left:50%;top:48%;transform:translate(-50%,-50%);background:#08040def;border:1px solid #b55cff;border-radius:14px;padding:18px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center';d.innerHTML='<b style="width:100%;text-align:center">ELIGE POSICIÓN</b><button class="btn" id="mAtk">ATAQUE</button><button class="btn" id="mDef">DEFENSA</button>';app.appendChild(d);d.querySelector('#mAtk').onclick=()=>{d.remove();res('ATAQUE')};d.querySelector('#mDef').onclick=()=>{d.remove();res('DEFENSA')}})}
function refreshRoyalSoulPower(){
 if(!isSpectralKing)return;const souls=window.__nemesisRoyalSouls||0;
 enemyCards.forEach(c=>{if(!c)return;if(c.effect==='royalBlood'){const prev=c._royalSoulBonus||0,next=souls*300;c.atk=Math.max(0,c.atk-prev+next);c._royalSoulBonus=next;}if(c._thousandCrown){const prev=c._thousandCrownSoulBonus||0,next=Math.floor(souls/2)*500;c.atk=Math.max(0,c.atk-prev+next);c._thousandCrownSoulBonus=next;}if(c._undyingSword){const prev=c._undyingSwordSoulBonus||0,next=souls>=6?1000:0;c.atk=Math.max(0,c.atk-prev+next);c._undyingSwordSoulBonus=next;}});
}

function ghostRefreshSoulSword(){
 if(!isGhostGod)return;const e=window.__nemesisCelestialEssence||0;
 enemyCards.forEach(c=>{if(!c||c.effect!=='soulSword')return;const old=c._soulSwordBonus||0,next=e>=4?1000:0;c.atk=Math.max(0,(c.atk||0)-old+next);c._soulSwordBonus=next})
}
function ghostSpendEssence(n){if((window.__nemesisCelestialEssence||0)<n)return false;window.__nemesisCelestialEssence-=n;ghostRefreshSoulSword();return true}
function clearExpiredCelestialEffects(){
 playerCards.forEach(c=>{if(!c)return;if(c._celestialDominionUntil&&turnNo>c._celestialDominionUntil){c.atk+=(c._celestialDominionAtk||0);c.def+=(c._celestialDominionDef||0);delete c._celestialDominionUntil;delete c._celestialDominionAtk;delete c._celestialDominionDef}})
 enemyCards.forEach(c=>{if(!c)return;if(c._celestialGateUntil&&turnNo>c._celestialGateUntil){c.atk=Math.max(0,c.atk-(c._celestialGateAtk||0));c.def=Math.max(0,c.def-(c._celestialGateDef||0));delete c._celestialGateUntil;delete c._celestialGateAtk;delete c._celestialGateDef}})
}
async function applyGhostEntryEffect(i,c){
 if(!isGhostGod||!c)return;
 if(c.effect==='thresholdGuardian'){window.__nemesisCelestialEssence=(window.__nemesisCelestialEssence||0)+1;toast(`GUARDIÁN DEL UMBRAL: +1 Esencia Celestial. Total ${window.__nemesisCelestialEssence}.`)}
 if(c.effect==='voidBreath'){phpv=Math.max(0,phpv-1200);damageFx(1200,'p');toast('ALIENTO DEL VACÍO: 1.200 de daño directo.')}
 if(c.effect==='celestialDominion'){
  const pick=playerCards.map((x,j)=>({x,j})).filter(o=>o.x).sort((a,b)=>(b.x.atk||0)-(a.x.atk||0))[0];
  if(pick){pick.x.atk=Math.max(0,pick.x.atk-1500);pick.x.def=Math.max(0,pick.x.def-1500);pick.x._celestialDominionAtk=(pick.x._celestialDominionAtk||0)+1500;pick.x._celestialDominionDef=(pick.x._celestialDominionDef||0)+1500;pick.x._celestialDominionUntil=turnNo+2;toast(`DOMINIO CELESTIAL: ${pick.x.name} pierde 1.500 ATK/DEF durante 2 turnos.`)}
  enemyCards.forEach(x=>{if(x&&x.family==='spectral')x.def+=500});
 }
 ghostRefreshSoulSword();update()
}
async function ghostAfterKill(attSide,ai,defender){
 if(!isGhostGod||attSide!=='e')return;
 const a=enemyCards[ai];if(!a)return;
 if(a.effect==='soulSword'){window.__nemesisCelestialEssence=(window.__nemesisCelestialEssence||0)+2;toast(`ESPADA DE LAS ALMAS: +2 Esencias Celestiales. Total ${window.__nemesisCelestialEssence}.`);ghostRefreshSoulSword()}
 if(a.effect==='eternalSentence'&&defender&&ghostSpendEssence(2)){
  const gi=playerGrave.findIndex(x=>x&&x.id===defender.id);if(gi>=0){const [banished]=playerGrave.splice(gi,1);window.__nemesisVoid=window.__nemesisVoid||[];window.__nemesisVoid.push(banished);toast(`SENTENCIA ETERNA: ${defender.name} es enviada al VACÍO y no puede ser revivida.`)}
 }
}
function ghostReduceIncomingHpDamage(amount,attacker){
 if(!isGhostGod)return amount;
 const divine=attacker?.rarity==='divina'||attacker?.rarity==='suprema-divina'||attacker?.tags?.includes('divine')||attacker?.type==='fusion';
 if(divine)return amount;
 if(window.__nemesisGhostDamageTurn!==turnNo){window.__nemesisGhostDamageTurn=turnNo;window.__nemesisGhostDamageReducedThisTurn=false}
 if(window.__nemesisGhostDamageReducedThisTurn)return amount;
 window.__nemesisGhostDamageReducedThisTurn=true;const reduced=Math.round(amount*.70);toast(`CUERPO ENTRE DOS MUNDOS reduce el primer daño normal del turno: ${amount} → ${reduced}.`);return reduced
}
async function ghostSecondAttackIfPossible(ai){
 if(olympusConsumeExtraAttackSeal('el segundo ataque del Dragón Celestial'))return true;
 const c=enemyCards[ai];if(!isGhostGod||!c||c.effect!=='voidBreath'||window.__nemesisVoidSecondAttackUsed||(window.__nemesisCelestialEssence||0)<3)return false;
 if(!ghostSpendEssence(3))return false;window.__nemesisVoidSecondAttackUsed=true;toast('DRAGÓN CELESTIAL DEL VACÍO consume 3 Esencias: ¡SEGUNDO ATAQUE!');
 const targets=playerCards.map((x,i)=>x?i:-1).filter(i=>i>=0);
 if(!targets.length){if(playerDirectShieldUntil>=turnNo){toast('Escudo Solar bloquea el segundo ataque directo.');return true}await attackAnim('e',ai,'p',0,c,c.atk);phpv=Math.max(0,phpv-c.atk);damageFx(c.atk,'p');update();return true}
 const target=targets.slice().sort((a,b)=>(playerModes[a]==='DEFENSA'?playerCards[a].def:playerCards[a].atk)-(playerModes[b]==='DEFENSA'?playerCards[b].def:playerCards[b].atk))[0];
 await resolveBattle('e',ai,'p',target);return true
}

function ghostGodFinalFormSave(){
 if(!isGhostGod||ehpv>0||window.__nemesisGhostFinal)return false;
 window.__nemesisGhostFinal=true;ehpv=5000;bossPhaseLevel=4;
 window.__nemesisVoidSecondAttackUsed=false;
 setPhase('ENEMY','DIOS FANTASMA · FORMA CELESTIAL FINAL');
 toast('FORMA CELESTIAL FINAL: DIOS FANTASMA renace con 5.000 HP.');
 pcLog('El Dios Fantasma rompe el velo y entra en su Forma Celestial Final.','boss');
 v15Flash('boss');v1892ScreenShake();update();return true;
}
async function ghostGodContinueAfterFinalForm(){
 if(!isGhostGod||!window.__nemesisGhostFinal||ehpv<=0)return false;
 await wait(650);
 pcLog('La Forma Celestial Final estabiliza el duelo y continúa el turno.','boss');
 await enemyTurn();
 return true;
}
function spectralKingCrownSave(){
 if(!isSpectralKing||ehpv>0||window.__nemesisKingCrownUsed)return false;
 window.__nemesisKingCrownUsed=true;ehpv=2500;bossPhaseLevel=3;
 v172ClosePicker();v171HideAttackConfirm();v17PendingTarget=-1;
 setPhase('ENEMY','REY ESPECTRAL · CORONA DE LA ETERNIDAD');
 toast('CORONA DE LA ETERNIDAD: el Rey evita la derrota y renace con 2.500 HP.');
 pcLog('Corona de la Eternidad se rompe: Rey Espectral renace con 2.500 HP.','effect');
 v15Flash('boss');v1892ScreenShake();updateBossPhaseBadge();update();return true;
}
async function spectralKingContinueAfterCrown(){
 if(!isSpectralKing||!window.__nemesisKingCrownUsed||ehpv<=0)return false;
 await wait(600);
 pcLog('El Rey Espectral estabiliza la Corona rota y continúa el combate.','effect');
 await enemyTurn();
 return true;
}
async function royalResurrectStrongest(){
 const free=enemyCards.map((x,i)=>x?-1:i).filter(i=>i>=0),valid=enemyGrave.map((x,i)=>({c:x,i})).filter(x=>x.c&&x.c.family==='spectral'&&x.c.type==='monster').sort((a,b)=>(b.c.atk||0)-(a.c.atk||0));
 if(!free.length||!valid.length)return false;const picked=valid[0],revived={...picked.c};enemyGrave.splice(picked.i,1);enemyCards[free[0]]=revived;enemyModes[free[0]]='ATAQUE';await place('e',free[0],revived);await flip('e',free[0]);await setMode('e',free[0],'ATAQUE');toast(`RESURRECCIÓN REAL: ${revived.name} regresa con todo su poder.`);return true;
}
async function applyRoyalEntryEffect(i,c){
 if(!isSpectralKing||!c)return;
 if(c.effect==='executionOrder'){const allies=enemyCards.map((x,j)=>({x,j})).filter(o=>o.x&&o.j!==i&&o.x.family==='spectral').sort((a,b)=>(b.x.atk||0)-(a.x.atk||0));const target=allies[0]?.x||c;target.atk+=1000;target._royalOrderBonus=(target._royalOrderBonus||0)+1000;target._royalOrderUntil=turnNo+2;toast(`ORDEN DE EJECUCIÓN: ${target.name} obtiene +1.000 ATK durante 2 turnos.`);}
 if(c.effect==='soulBanquet'){const n=Math.min(3,window.__nemesisRoyalSouls||0);if(n){window.__nemesisRoyalSouls-=n;c.atk+=n*700;toast(`BANQUETE DE ALMAS: consume ${n} Alma(s) Real(es) y obtiene +${n*700} ATK permanente.`);refreshRoyalSoulPower();}}
 if(c.effect==='underworldBreath'){phpv=Math.max(0,phpv-1000);damageFx(1000,'p');toast('ALIENTO DEL INFRAMUNDO: 1.000 de daño directo.');}
 if(c.effect==='royalResurrection'&&!c._royalResUsed){c._royalResUsed=true;await royalResurrectStrongest();}
 refreshRoyalSoulPower();update();
}
function clearExpiredRoyalBuffs(){if(!isSpectralKing)return;enemyCards.forEach(c=>{if(!c)return;if(c._royalOrderBonus&&turnNo>c._royalOrderUntil){c.atk=Math.max(0,c.atk-c._royalOrderBonus);c._royalOrderBonus=0;}if(c._royalPortalUntil&&turnNo>c._royalPortalUntil){c.atk=Math.max(0,c.atk-(c._royalPortalAtk||0));c.def=Math.max(0,c.def-(c._royalPortalDef||0));c._royalPortalAtk=0;c._royalPortalDef=0;c._royalPortalUntil=0;}});}
async function destroyCard(side,i){const arr=side==='p'?playerCards:enemyCards,grave=side==='p'?playerGrave:enemyGrave,g=board[side][i],victim=arr[i];if(!victim)return false;if(await treasurePreventDestroy(side,i,victim))return false;if(await pub23PreventDestroy(side,i,victim))return false;if(await nemesisDmPreventDestroy(side,i,victim))return false;if(await mgrPreventDestroy(side,i,victim))return false;aresOnDestroyed(side,victim);if(olympusSynergyPreventDestroy(side,victim))return false;if(olympusPreventDestroy(side,victim))return false;if(victim._immortalUntil>=turnNo){toast(`${victim.name} es INMORTAL este turno y evita su destrucción.`);return false;}if(side==='p'&&victim.id==='apolo-guardian-solar'){playerFusionProtectionUntil=Math.max(playerFusionProtectionUntil,turnNo+1);toast('ÚLTIMO RESPLANDOR: la Fusión Divina queda protegida durante 1 turno.');pcLog('Apolo cae, pero protege a Júpiter, Zeus y Kronos para la Fusión Divina.','effect');}if(isGhostGod&&side==='e'&&victim.effect==='thresholdGuardian'&&!victim._celestialSaved&&(window.__nemesisCelestialEssence||0)>=2){victim._celestialSaved=true;window.__nemesisCelestialEssence-=2;victim.def=1500;toast('GUARDIÁN DEL UMBRAL: consume 2 Esencias y permanece con 1.500 DEF.');update();return false;}if(isSpectralKing&&side==='e'&&victim.effect==='underworldBreath'&&!victim._royalDragonSaved&&(window.__nemesisRoyalSouls||0)>=2){victim._royalDragonSaved=true;window.__nemesisRoyalSouls-=2;victim.def=1000;refreshRoyalSoulPower();toast('RESURGIR ESPECTRAL: el Dragón consume 2 Almas Reales, evita su primera destrucción y queda con 1.000 DEF.');update();return false;}if(victim.id==='kronos-devorador-tiempo'&&!victim._retrocesoUsed){victim._retrocesoUsed=true;victim.def=8500;burst(g?.position||new THREE.Vector3(),0x9a55ff,48);toast('RETROCESO TEMPORAL: Kronos evita su primera destrucción y recupera 8500 DEF.');pcLog('Kronos altera el tiempo y evita su destrucción.','effect');update();return false}if(victim.id==='titan-del-olimpo'&&!victim._olympusWillUsed){victim._olympusWillUsed=true;victim.def=3000;burst(g?.position||new THREE.Vector3(),0xffd45c,64);toast('VOLUNTAD DEL OLIMPO: el Titán evita su primera destrucción y permanece con 3000 DEF.');pcLog('Titán del Olimpo resiste su primera destrucción.','effect');update();return false}v15Flash('destroy');sfx('destroy');const v184Victim=board?.[side]?.[i];if(v184Victim){v184CrearFuegoConsumidor(v184Victim);await wait(320);}if(g)v18917SendVisualToGrave(side,g);grave.push(arr[i]);pub23AfterDestroyed(side,victim);nemesisDmAfterDestroyed(side,victim);if(isGhostGod&&(victim.family==='celestial'||victim.family==='spectral'||victim.tags?.includes('divine'))){window.__nemesisCelestialEssence=(window.__nemesisCelestialEssence||0)+1;toast(`ESENCIA CELESTIAL: +1 · Total ${window.__nemesisCelestialEssence}`);}
if(isSpectralKing){const gain=(side==='e'&&victim.effect==='royalBlood')?2:1;window.__nemesisRoyalSouls=(window.__nemesisRoyalSouls||0)+gain;toast(`${victim.effect==='royalBlood'?'SANGRE REAL':'ALMA REAL'}: +${gain} Alma(s) Real(es). Total ${window.__nemesisRoyalSouls}.`);refreshRoyalSoulPower();if(window.__nemesisRoyalSouls>=2&&ehpv<enemyMaxHp*.40){window.__nemesisRoyalSouls-=2;ehpv=Math.min(enemyMaxHp,ehpv+700);refreshRoyalSoulPower();toast('EL REY NO LUCHA SOLO: consume 2 Almas Reales y recupera 700 HP.')}}if(isSoulKnight&&side==='e'&&victim.family==='spectral'){window.__nemesisSoulCount=(window.__nemesisSoulCount||0)+1;if(victim.effect==='soulPersistent'){ehpv=Math.min(enemyMaxHp,ehpv+300);toast('ALMA PERSISTENTE: +300 HP al Caballero.')}if(window.__nemesisSoulCount%2===0){ehpv=Math.min(enemyMaxHp,ehpv+400);toast('REINO DE LOS MUERTOS: dos almas alimentan al Caballero (+400 HP).')}}if(g){nemesisBreakAllEquipment(side,i);if(g.userData?.equipment)Object.keys({...g.userData.equipment}).forEach(label=>pcRemoveEquipment(g,label,true));const destroyedCard=arr[i],destroyedElement=pcCardElement(destroyedCard,META[destroyedCard?.id]||{}),destroyedColor=pcElementColor(destroyedElement,side==='p'?0xa34cff:0xff334f);pcDestructionFx(destroyedElement,g.position);pcElementImpactFx(destroyedElement,g.position.clone(),destroyedColor,true);burst(g.position,destroyedColor,isRa?28:54);if(window.gsap){await Promise.all([new Promise(res=>gsap.to(g.scale,{x:.06,y:.06,z:.06,duration:.34,ease:'power2.in',onComplete:res})),new Promise(res=>gsap.to(g.rotation,{z:g.rotation.z+Math.PI*1.5,y:g.rotation.y+Math.PI*.7,duration:.34,ease:'power2.in',onComplete:res}))])}else await twVec(g.scale,new THREE.Vector3(.08,.08,.08),380);scene.remove(g)}board[side][i]=null;arr[i]=null;(side==='p'?playerModes:enemyModes)[i]=null;const el=document.getElementById(side==='p'?'playergrave':'enemygrave');if(el)el.innerHTML=`☠ ${side==='p'?'TU CEMENTERIO':'CEMENTERIO RIVAL'} <b>${grave.length}</b>`;toast(`Carta destruida → Cementerio ${grave.length}`);if(mgrIs(victim,'MGR-007')&&!victim._mgrPhoenixReturned)setTimeout(()=>mgrPhoenixReturn(side,victim),120);await v16Cam(side==='p'?'GRAVE_PLAYER':'GRAVE_ENEMY',side,i).catch(()=>{});await wait(120);update();return true}
function clearNextEnemyShields(){playerCards.forEach((c,i)=>{if(c){delete c._shieldBonus;delete c._shieldPending;const g=board.p?.[i];if(g?.userData?.equipment)Object.entries({...g.userData.equipment}).forEach(([label,eq])=>{if(eq?.userData?.kind==='armor'&&eq?.userData?.temporary)pcRemoveEquipment(g,label,true)})}})}
function endPlayerMagicTurn(){pcClearTemporaryEquipment();playerCards.forEach(c=>{if(!c)return;if(c._turnAtkBonus){c.atk=Math.max(0,c.atk-c._turnAtkBonus);delete c._turnAtkBonus}if(c._skillAtkBonus){c.atk=Math.max(0,c.atk-c._skillAtkBonus);delete c._skillAtkBonus}if(c._playerPowerBonus){c.atk=Math.max(0,c.atk-c._playerPowerBonus);delete c._playerPowerBonus}})}
function royalAfterKill(attSide,ai,defender){if(!isSpectralKing||attSide!=='e')return;const a=enemyCards[ai];if(!a)return;if(a._undyingSword){window.__nemesisRoyalSouls=(window.__nemesisRoyalSouls||0)+1;toast('ESPADA DEL REY SIN MUERTE: +1 Alma Real por la criatura destruida.');refreshRoyalSoulPower();}if(a.effect==='royalExecution'&&defender&&(defender.def||0)<=4000){window.__nemesisRoyalSouls=(window.__nemesisRoyalSouls||0)+1;toast('CORTE MALDITO: +1 Alma Real adicional.');refreshRoyalSoulPower();}}
async function resolveBattle(attSide,ai,defSide,di){
 const _preA=(attSide==='p'?playerCards:enemyCards)[ai];
 if(_preA?._treasureScythe&&_preA._treasureHungerTurn!==turnNo){
  const _gr=attSide==='p'?playerGrave:enemyGrave;
  if(_gr.length){_gr.pop();_preA.atk+=500;_preA._treasureHungerBonus=(_preA._treasureHungerBonus||0)+500;_preA._treasureHungerTurn=turnNo;toast('HAMBRE INFINITA: consume 1 carta del Cementerio · +500 ATK este turno.')}
 }
 const _heroA=attSide==='p'?playerCards[ai]:enemyCards[ai],_heroD=defSide==='p'?playerCards[di]:enemyCards[di];if(_heroA&&!heroicCanAct(_heroA)){toast(`${_heroA.name} no puede actuar por su estado heroico.`);return}heroicAttack(attSide,_heroA,_heroD);if(attSide==='p'&&!hadesCanAct(playerCards[ai])){toast('El control del Inframundo impide atacar.');return;}if(attSide==='p'){olympusOnPlayerAttack(ai);olympusSynergyAttack(attSide,ai);}aresOnCombatParticipation(attSide,ai);const A=(attSide==='p'?playerCards:enemyCards)[ai],D=(defSide==='p'?playerCards:enemyCards)[di];if(!A||!D)return;
 await idrBeforeAttack(attSide,ai,A);
 if(D.effect==='phantomReflect'){
  const reflected=Math.max(0,Number(A.atk)||0);D.atk=reflected;
  skillFx(defSide,di,{name:'REFLEJO FANTASMAL',kind:'damage',value:reflected,desc:`Copia ${reflected} ATK y lo refleja directamente a los HP del rival.`},D);
  if(defSide==='p')ehpv=Math.max(0,ehpv-reflected);else phpv=Math.max(0,phpv-reflected);
  damageFx(reflected,defSide==='p'?'e':'p');update();toast(`${D.name}: copia ${reflected} ATK y causa ${reflected} de daño directo al rival.`);await wait(320);
  if((defSide==='p'&&ehpv<=0)||(defSide==='e'&&phpv<=0))return;
 }
 const rewardAres=()=>{if(A.id==="anc-ares"){A.atk+=500;toast(`Furia del Conquistador: Ares gana +500 ATK (${A.atk}).`)}};const dm=(defSide==='p'?playerModes:enemyModes)[di]||'ATAQUE';await (defSide==='e'?revealEnemy(di):revealPlayer(di));const shieldBonus=D._shieldPending?(Number(D._shieldBonus)||0):0;const defenseValue=A._treasurePiercing?0:(dm==='DEFENSA'?D.def:D.atk)+shieldBonus;const diff=A.atk-defenseValue;if(shieldBonus)toast(`${D.name}: protección de habilidad aporta +${shieldBonus} DEF.`);await attackAnim(attSide,ai,defSide,di,A,Math.max(0,diff));if(attSide==='e')clearNextEnemyShields();else if(shieldBonus){delete D._shieldBonus;delete D._shieldPending}if(A.effect==='royalExecution'&&(D.def||0)<=4000){await destroyCard(defSide,di);royalAfterKill(attSide,ai,D);await ghostAfterKill(attSide,ai,D);await aresOnKill(attSide,ai,D);await treasureOnBattleKill(attSide,A);await idrAfterKill(attSide,A);await nemesisDmAfterKill(attSide,A,D);toast(`EJECUCIÓN: ${D.name} es destruida por la Corona Maldita.`);update();return}if(dm==='DEFENSA'){
 if(diff>0){
  await destroyCard(defSide,di);royalAfterKill(attSide,ai,D);await ghostAfterKill(attSide,ai,D);await aresOnKill(attSide,ai,D);await treasureOnBattleKill(attSide,A);await idrAfterKill(attSide,A);await nemesisDmAfterKill(attSide,A,D);rewardAres();
  toast('Defensa superada. La carta defensora fue destruida, pero no se pierden HP.');
 }else if(diff<0){
  const rebote=Math.abs(diff);
  if(attSide==='p')phpv=Math.max(0,phpv-rebote);else ehpv=Math.max(0,ehpv-rebote);
  damageFx(rebote,attSide);
  toast(`¡Muro impenetrable! El atacante rebota y pierde ${rebote} HP.`);mgrAfterSurvive(defSide,D);
 }else{
  toast('Ataque y defensa iguales. Nadie recibe daño.');
 }
 update();
 return
}
 if(diff>0){await destroyCard(defSide,di);royalAfterKill(attSide,ai,D);await ghostAfterKill(attSide,ai,D);await aresOnKill(attSide,ai,D);await treasureOnBattleKill(attSide,A);await idrAfterKill(attSide,A);await nemesisDmAfterKill(attSide,A,D);rewardAres();let hpDiff=(defSide==='e'?ghostReduceIncomingHpDamage(diff,A):diff);hpDiff=aresFrontLineReduction(defSide,di,hpDiff);if(defSide==='e')ehpv-=hpDiff;else phpv-=hpDiff;damageFx(hpDiff,defSide)}else if(diff<0){await destroyCard(attSide,ai);mgrAfterSurvive(defSide,D);if(attSide==='p')phpv-=Math.abs(diff);else ehpv-=Math.abs(diff);damageFx(Math.abs(diff),attSide)}else{await destroyCard(attSide,ai);await destroyCard(defSide,di)}update()}
function chooseMagicTarget(titleText,cards,side='p'){
 return new Promise(resolve=>{
  const old=document.getElementById('magicTargetPicker');if(old)old.remove();
  const p=document.createElement('div');p.id='magicTargetPicker';p.className='v172picker';
  p.innerHTML=`<div class="v172panel"><div class="v172head"><h2>${titleText}</h2><p>Selecciona una carta para aplicar el efecto.</p></div><div class="v172grid"></div><button class="v172back">CANCELAR</button></div>`;
  const grid=p.querySelector('.v172grid');
  cards.forEach(({c,i})=>{const b=document.createElement('button');b.className='v172card';b.innerHTML=`<img src="${c.img}" alt="${esc(c.name)}"><div><b>${c.name}</b><span>${cardStats(c)}</span><em>${i>=0?`SLOT ${i+1}`:'CEMENTERIO'}</em></div>`;b.onclick=()=>{p.remove();resolve({c,i})};grid.appendChild(b)});
  p.querySelector('.v172back').onclick=()=>{p.remove();resolve(null)};document.body.appendChild(p)
 })
}
async function magicAllyIndex(side,titleText){
 const arr=side==='p'?playerCards:enemyCards;
 const choices=arr.map((c,i)=>({c,i})).filter(x=>x.c&&x.c.type!=='magic'&&x.c.type!=='trap');
 if(!choices.length)return -1;
 if(side==='e')return choices.sort((a,b)=>b.c.atk-a.c.atk)[0].i;
 const picked=await chooseMagicTarget(titleText,choices,side);return picked?picked.i:-1
}
let pcResponseOpen=false,pcEffectChain=[];
function pcChainLog(text){pcEffectChain.push({turn:turnNo,text});pcEffectChain=pcEffectChain.slice(-12);pcLog(`CADENA: ${text}`,'effect')}
async function pcResponseWindow(side,c){
 pcChainLog(`${c.name} activada por ${side==='p'?'jugador':'rival'}.`);if(side!=='e'||pcResponseOpen)return true;pcResponseOpen=true;
 const mgrCounter=playerCards.findIndex(x=>mgrIs(x,'MGR-016')),regularCounter=playerCards.findIndex(x=>x&&x.effect==='negateMagic'),zeusCounter=playerCards.findIndex(x=>dmIs(x,'DM-001')&&x._dmZeusNegateTurn!==turnNo),counter=regularCounter>=0?regularCounter:(mgrCounter>=0?mgrCounter:zeusCounter),mgrResponse=regularCounter<0&&mgrCounter>=0,zeusResponse=regularCounter<0&&mgrCounter<0&&zeusCounter>=0;return await new Promise(resolve=>{let done=false,remaining=6;const d=document.createElement('div');d.className='pc-response-window';d.innerHTML=`<section><small>VENTANA DE RESPUESTA</small><h2>${c.name}</h2><div class="pc-response-timer"><i></i><b>${remaining}</b></div><div class="pc-chain-history">${pcEffectChain.slice(-5).map(x=>`<p>T${x.turn} · ${esc(x.text)}</p>`).join('')}</div><div class="pc-response-actions"><button id="pcRespond">RESPONDER <kbd>1</kbd></button><button id="pcNegate" ${counter<0?'disabled':''}>ANULAR <kbd>2</kbd></button><button id="pcPass">DEJAR PASAR <kbd>3</kbd></button></div><p class="pc-response-help">PC: 1 RESPONDER · 2 ANULAR · 3 DEJAR PASAR · ESC DEJAR PASAR</p></section>`;document.body.appendChild(d);const bar=d.querySelector('.pc-response-timer i'),num=d.querySelector('.pc-response-timer b');const keyHandler=e=>{if(e.key==='1')d.querySelector('#pcRespond')?.click();if(e.key==='2')d.querySelector('#pcNegate')?.click();if(e.key==='3'||e.key==='Escape')d.querySelector('#pcPass')?.click()};addEventListener('keydown',keyHandler);const finish=async allow=>{if(done)return;done=true;clearInterval(timer);removeEventListener('keydown',keyHandler);d.classList.add('closing');await wait(160);d.remove();pcResponseOpen=false;resolve(allow)};d.querySelector('#pcRespond').onclick=()=>{if(counter>=0){d.querySelector('#pcNegate').classList.add('ready');toast('Contrahechizo preparado. Pulsa ANULAR para encadenarlo.')}else toast('No tienes un contrahechizo disponible en el campo.')};d.querySelector('#pcNegate').onclick=async()=>{if(counter<0)return;if(mgrResponse){const m=playerCards[mgrCounter];pcChainLog(m.name+' refleja '+c.name+'.');mgrHit('p',800);await destroyCard('p',mgrCounter);toast('ESPEJO DE BRASAS: efecto anulado y 800 de daño reflejado.');finish(false)}else if(zeusResponse){const z=playerCards[zeusCounter];z._dmZeusNegateTurn=turnNo;pcChainLog(z.name+' anula '+c.name+'.');dmHit('p',2000);toast('JUICIO DE ZEUS: efecto anulado · 2000 de daño directo.');finish(false)}else{pcChainLog(`${playerCards[counter].name} anula ${c.name}.`);await destroyCard('p',counter);finish(false)}};d.querySelector('#pcPass').onclick=()=>{pcChainLog(`${c.name} continúa sin respuesta.`);finish(true)};const timer=setInterval(()=>{remaining--;num.textContent=remaining;bar.style.width=`${remaining/6*100}%`;if(remaining<=0){pcChainLog(`Tiempo agotado: ${c.name} continúa.`);finish(true)}},1000)})
}

function idrIs(c){return !!c&&c.family==='imperio-dragon'}
function idrMarks(c){return Math.max(0,Number(c?._idrAscension)||0)}
function idrAddMark(c,n=1){
 if(!idrIs(c))return 0;
 c._idrAscension=Math.min(Number(c.ascensionMax)||3,idrMarks(c)+Math.max(0,n));
 toast(c.name+' · ASCENSIÓN '+c._idrAscension+'/'+(c.ascensionMax||3));
 return c._idrAscension
}
function idrStormSync(){
 const active=window.__idrFireStorm===true;
 for(const arr of [playerCards,enemyCards])arr.forEach(c=>{
  if(!idrIs(c))return;
  const old=c._idrStormBonus||0,want=active?300:0;
  if(old!==want){c.atk=Math.max(0,(c.atk||0)-old+want);c.def=Math.max(0,(c.def||0)-old+want);c._idrStormBonus=want}
 })
}
function idrSearchSupport(side){
 const q=side==='p'?deckQueue:enemyQueue;
 const idx=q.findIndex(x=>idrIs(side==='p'?card(x):x));
 if(idx<0)return false;
 if(side==='p'){
  const id=q.splice(idx,1)[0],c=card(id);handState.push(id);renderHand();
  toast('IMPERIO DRAGÓN: '+c.name+' fue buscada del Deck.');return true
 }
 const c=q.splice(idx,1)[0];q.unshift(c);toast('IMPERIO DRAGÓN: '+c.name+' fue priorizada en el Deck rival.');return true
}
async function idrOnSummon(side,i,c,special=false){
 if(!idrIs(c))return;
 if(c.id==='IDR-002'){
  idrSearchSupport(side);
  const own=side==='p'?playerCards:enemyCards,grave=side==='p'?playerGrave:enemyGrave;
  if([...own,...grave].some(x=>x?.id==='IDR-001')&&!c._idrYoungBond){c.atk+=300;c._idrYoungBond=300;toast('GUERRERO IMPERIAL: +300 ATK por Dragón Carmesí Joven.')}
 }
 if(c.id==='IDR-005'&&!c._idrStormActivated){window.__idrFireStorm=true;c._idrStormActivated=true;idrStormSync();toast('TORMENTA DE FUEGO: Imperio Dragón obtiene +300 ATK / +300 DEF.')}
 if(c.id==='IDR-005'&&special){
  const rival=side==='p'?enemyCards:playerCards,rs=side==='p'?'e':'p';
  let n=0;for(let j=0;j<rival.length&&n<2;j++)if(rival[j]){await destroyCard(rs,j);n++}
  if(n)toast('VUELO SUPREMO: '+n+' carta(s) rival(es) destruidas.')
 }
}
async function idrBeforeAttack(side,i,c){
 if(!idrIs(c))return;
 if(c.id==='IDR-001')idrAddMark(c,1);
 if(c.id==='IDR-004'){
  const rival=side==='p'?enemyCards:playerCards,n=rival.filter(x=>x&&x.type!=='magic'&&x.type!=='trap').length,dmg=n*400;
  if(dmg){if(side==='p'){ehpv=Math.max(0,ehpv-dmg);damageFx(dmg,'e')}else{phpv=Math.max(0,phpv-dmg);damageFx(dmg,'p')}toast('LANZA DEL CATACLISMO: '+dmg+' de daño directo.')}
 }
 if(c.id==='IDR-003'&&c._idrBreathTurn!==turnNo){
  const rival=side==='p'?enemyCards:playerCards,rs=side==='p'?'e':'p';
  const j=rival.findIndex(x=>x&&(x.type==='magic'||x.type==='trap'));
  if(j>=0){await destroyCard(rs,j);c.atk+=500;c._idrBreathBonus=(c._idrBreathBonus||0)+500;c._idrBreathTurn=turnNo;toast('ALIENTO INCINERADOR: Mágica/Trampa destruida · +500 ATK este ataque.')}
 }
}
async function idrAfterKill(side,c){
 if(!idrIs(c))return;
 if(c.id==='IDR-001'){if(side==='p'){ehpv=Math.max(0,ehpv-300);damageFx(300,'e')}else{phpv=Math.max(0,phpv-300);damageFx(300,'p')}idrSearchSupport(side)}
 if(c.id==='IDR-002'&&c._idrFuryTurn!==turnNo){c.atk+=500;c._idrFuryBonus=(c._idrFuryBonus||0)+500;c._idrFuryTurn=turnNo;c._dmUnlimitedAttacksTurn=turnNo;toast('FURIA ESCARLATA: +500 ATK y segundo ataque habilitado.')}
 if(c.id==='IDR-004')idrAddMark(c,1);
}


// V19.4.3 — MOTOR AISLADO MAGO ROJO
function mgrIs(c,id=null){return !!c&&c.family==='mago-rojo'&&(!id||c.id===id)}
function mgrOwn(side){return side==='p'?playerCards:enemyCards}
function mgrGrave(side){return side==='p'?playerGrave:enemyGrave}
function mgrQueue(side){return side==='p'?deckQueue:enemyQueue}
function mgrState(side){
 const key=side==='p'?'__mgrP':'__mgrE';
 if(!window[key]||window[key]._battle!==turnNo&&window[key]._resetPending){window[key]=null}
 if(!window[key])window[key]={seals:0,flames:0,magicUses:0,mirrorDamageTurn:-1,_battle:turnNo,_resetPending:false};
 return window[key]
}
function mgrSealCount(side){return Math.max(0,Number(mgrState(side).seals)||0)}
function mgrAddSeal(side,n=1,reason='SELLO ARCANO'){
 const st=mgrState(side);st.seals=Math.min(7,Math.max(0,st.seals+Number(n||0)));toast(reason+': '+st.seals+'/7');return st.seals
}
function mgrSpendSeals(side,n){
 const st=mgrState(side),need=Math.max(0,Number(n)||0);if(st.seals<need){toast('SELLOS ARCANOS insuficientes: '+st.seals+'/'+need);return false}
 st.seals-=need;toast('SELLOS ARCANOS: '+st.seals+'/7');return true
}
function mgrHit(side,n){n=Math.max(0,Number(n)||0);if(side==='p'){ehpv=Math.max(0,ehpv-n);damageFx(n,'e')}else{phpv=Math.max(0,phpv-n);damageFx(n,'p')}}
function mgrHeal(side,n){n=Math.max(0,Number(n)||0);if(side==='p')phpv=Math.min(playerMaxHp,phpv+n);else ehpv=Math.min(enemyMaxHp,ehpv+n)}
function mgrSearch(side,predicate,label='MAGO ROJO'){
 const q=mgrQueue(side);
 if(side==='p'){
  const idx=q.findIndex(id=>{const c=card(id);return c&&predicate(c)});
  if(idx<0)return false;const id=q.splice(idx,1)[0];handState.push(id);renderHand();toast(label+': '+card(id).name+' añadida a la mano.');return true
 }
 const idx=q.findIndex(x=>x&&predicate(x));if(idx<0)return false;const c=q.splice(idx,1)[0];q.unshift(c);return true
}
function mgrMagicActivated(side,c){
 if(!mgrIs(c))return;
 const st=mgrState(side);st.magicUses++;if(c.id!=='MGR-018')mgrAddSeal(side,1,'MAGIA CARMESÍ');
 const own=mgrOwn(side),grim=own.some(x=>mgrIs(x)&&x._mgrGrimorio)||own.some(x=>x?._mgrGrimorio);
 if(grim){st.flames=Math.min(7,st.flames+1);toast('GRIMORIO · LLAMA '+st.flames+'/7')}
}
function mgrSync(){
 for(const side of ['p','e']){
  const own=mgrOwn(side),st=mgrState(side),dragon=own.some(x=>mgrIs(x,'MGR-009')),grimCarrier=own.find(x=>x?._mgrGrimorio);
  own.forEach(c=>{
   if(!mgrIs(c)||c.type==='magic'||c.type==='trap')return;
   const oldAura=c._mgrDragonAura||0,wantAura=dragon&&c.id!=='MGR-009'?500:0;
   if(oldAura!==wantAura){c.atk=Math.max(0,(c.atk||0)-oldAura+wantAura);c._mgrDragonAura=wantAura}
   const oldGrimAtk=c._mgrGrimAtk||0,oldGrimDef=c._mgrGrimDef||0;
   let ga=0,gd=0;if(grimCarrier){if(st.flames>=1)ga+=300;if(st.flames>=4){ga+=500;gd+=500}}
   if(oldGrimAtk!==ga){c.atk=Math.max(0,(c.atk||0)-oldGrimAtk+ga);c._mgrGrimAtk=ga}
   if(oldGrimDef!==gd){c.def=Math.max(0,(c.def||0)-oldGrimDef+gd);c._mgrGrimDef=gd}
  });
  const anc=own.find(x=>mgrIs(x,'MGR-009'));if(anc){const count=own.filter(x=>mgrIs(x)&&x.type==='monster'&&x!==anc).length,want=count*300,old=anc._mgrKinBonus||0;if(want!==old){anc.atk=Math.max(0,anc.atk-old+want);anc._mgrKinBonus=want}}
 }
}
function mgrSkillDescriptor(c){
 const map={
  'MGR-001':{name:'DOMINIO ESCARLATA',kind:'magoRojo',action:'recoverMagic',desc:'Consume 3 Sellos Arcanos para recuperar 1 Mágica Mago Rojo del Cementerio.'},
  'MGR-004':{name:'GUARDIA ARDIENTE',kind:'magoRojo',action:'guard',desc:'Protege una criatura Mago Rojo y le concede +1000 DEF para el próximo combate.'},
  'MGR-005':{name:'PACTO DE LLAMAS',kind:'magoRojo',action:'witch',desc:'Consume 1 Sello Arcano para reducir 1500 ATK a la criatura rival más fuerte este turno.'},
  'MGR-006':{name:'FORJA PROTECTORA',kind:'magoRojo',action:'forge',desc:'Refuerza +700 DEF a una criatura Mago Rojo y protege soportes del arquetipo este turno.'},
  'MGR-007':{name:'LLAMA RENACIDA',kind:'magoRojo',action:'phoenix',desc:'Con 3 Sellos Arcanos gana +500 ATK este turno.'},
  'MGR-008':{name:'ECLIPSE ARDIENTE',kind:'magoRojo',action:'eclipse',desc:'Tus Mago Rojo ganan +600 ATK este turno y la amenaza rival pierde 400 ATK/DEF.'},
  'MGR-009':{name:'HERENCIA ANCESTRAL',kind:'magoRojo',action:'ancestral',desc:'Destruye 1 soporte rival; si no existe, inflige 700 de daño directo.'},
  'MGR-010':{name:'LEGADO DE LAS SIETE LLAMAS',kind:'magoRojo',action:'seven',desc:'Gana +700 ATK este turno; con 3 Sellos, además roba/busca una carta Mago Rojo.'},
  'MGR-019':{name:'CONVERGENCIA ESCARLATA',kind:'magoRojo',action:'fusion',desc:'Consume Sellos para elegir poder ofensivo, protección o control.'}
 };return map[c?.id]||null
}
async function mgrUseSkill(side,i,c,sk){
 const own=mgrOwn(side),rival=side==='p'?enemyCards:playerCards,rs=side==='p'?'e':'p';
 if(sk.action==='recoverMagic'){
  if(!mgrSpendSeals(side,3))return false;const grave=mgrGrave(side),idx=[...grave].map((x,j)=>({x,j})).reverse().find(o=>mgrIs(o.x)&&o.x.type==='magic');
  if(!idx){mgrAddSeal(side,3,'SELLOS DEVUELTOS');toast('No hay Mágicas Mago Rojo en el Cementerio.');return false}
  const gidx=grave.lastIndexOf(idx.x);if(side==='p'){grave.splice(gidx,1);handState.push(idx.x.id);renderHand()}else{grave.splice(gidx,1);mgrQueue(side).unshift(idx.x)}toast('DOMINIO ESCARLATA recupera '+idx.x.name+'.');return true
 }
 if(sk.action==='guard'){const j=side==='p'?await magicAllyIndex(side,'GUARDIA ARDIENTE · ELIGE PROTEGIDO'):own.findIndex(x=>mgrIs(x));if(j<0)return false;own[j]._mgrGuardUntil=turnNo;own[j]._shieldBonus=(own[j]._shieldBonus||0)+1000;own[j]._shieldPending=true;return true}
 if(sk.action==='witch'){if(!mgrSpendSeals(side,1))return false;const t=rival.map((x,j)=>({c:x,j})).filter(x=>x.c&&x.c.type!=='magic'&&x.c.type!=='trap').sort((a,b)=>(b.c.atk||0)-(a.c.atk||0))[0];if(!t)return false;t.c.atk=Math.max(0,t.c.atk-1500);t.c._mgrDebuff=(t.c._mgrDebuff||0)+1500;toast('PACTO DE LLAMAS: '+t.c.name+' pierde 1500 ATK.');return true}
 if(sk.action==='forge'){const j=side==='p'?await magicAllyIndex(side,'FORJA PROTECTORA · ELIGE ALIADO'):own.findIndex(x=>mgrIs(x));if(j<0)return false;own[j]._shieldBonus=(own[j]._shieldBonus||0)+700;own[j]._shieldPending=true;c._mgrForgeProtectTurn=turnNo;return true}
 if(sk.action==='phoenix'){if(mgrSealCount(side)<3)return false;c.atk+=500;c._mgrTempAtk=(c._mgrTempAtk||0)+500;return true}
 if(sk.action==='eclipse'){own.forEach(x=>{if(mgrIs(x)&&x.type==='monster'){x.atk+=600;x._mgrTempAtk=(x._mgrTempAtk||0)+600}});const t=rival.map((x,j)=>({c:x,j})).filter(x=>x.c&&x.c.type!=='magic'&&x.c.type!=='trap').sort((a,b)=>(b.c.atk||0)-(a.c.atk||0))[0];if(t){t.c.atk=Math.max(0,t.c.atk-400);t.c.def=Math.max(0,t.c.def-400);t.c._mgrDebuff=(t.c._mgrDebuff||0)+400;t.c._mgrDefDebuff=(t.c._mgrDefDebuff||0)+400}return true}
 if(sk.action==='ancestral'){const j=rival.findIndex(x=>x&&(x.type==='magic'||x.type==='trap'));if(j>=0){await destroyCard(rs,j);return true}mgrHit(side,700);return true}
 if(sk.action==='seven'){c.atk+=700;c._mgrTempAtk=(c._mgrTempAtk||0)+700;if(mgrSealCount(side)>=3)mgrSearch(side,x=>mgrIs(x)&&x.id!==c.id,'SIETE LLAMAS');return true}
 if(sk.action==='fusion'){if(mgrSpendSeals(side,2)){c.atk+=1200;c._mgrTempAtk=(c._mgrTempAtk||0)+1200;c._mgrFusionGuardUntil=turnNo;return true}c._mgrFusionGuardUntil=turnNo;return true}
 return false
}
async function mgrOnSummon(side,i,c,special=false){
 if(!mgrIs(c)||c.type!=='monster')return;
 if(c.id==='MGR-002'){
  const grave=mgrGrave(side),found=[...grave].reverse().find(x=>mgrIs(x)&&x.type==='magic');
  if(found){const gi=grave.lastIndexOf(found);grave.splice(gi,1);if(side==='p'){handState.push(found.id);renderHand()}else mgrQueue(side).unshift(found);toast('MEMORIA DE FUEGO recupera '+found.name+'.')}
 }
 if(c.id==='MGR-005')mgrAddSeal(side,2,'PACTO DE LLAMAS');
 if(c.id==='MGR-010'&&special){mgrHit(side,800);mgrSearch(side,x=>mgrIs(x)&&x.type==='monster'&&x.id!=='MGR-010','SIETE LLAMAS');const own=mgrOwn(side);own.forEach(x=>{if(mgrIs(x))x._mgrProtectedUntil=turnNo})}
 if(c.id==='MGR-019'){mgrOwn(side).forEach(x=>{if(mgrIs(x)&&x!==c){x.atk+=800;x.def+=800;x._mgrFusionAuraAtk=(x._mgrFusionAuraAtk||0)+800;x._mgrFusionAuraDef=(x._mgrFusionAuraDef||0)+800}})}
 mgrSync()
}
async function mgrPhoenixReturn(side,victim){
 if(!mgrIs(victim,'MGR-007')||victim._mgrPhoenixReturned)return false;
 const own=mgrOwn(side),modes=side==='p'?playerModes:enemyModes,free=own.findIndex(x=>!x);if(free<0)return false;
 const grave=mgrGrave(side),gi=grave.lastIndexOf(victim);if(gi<0)return false;grave.splice(gi,1);
 const revived={...victim,_mgrPhoenixReturned:true,atk:Math.max(2400,Math.round((victim.atk||3400)*.7)),def:Math.max(1700,Math.round((victim.def||2500)*.7))};own[free]=revived;modes[free]='ATAQUE';await place(side,free,revived);await flip(side,free);await setMode(side,free,'ATAQUE');mgrAddSeal(side,1,'RENACER CARMESÍ');toast('FÉNIX CARMESÍ regresa de las cenizas.');return true
}
async function mgrPreventDestroy(side,i,victim){
 if(!victim)return false;const own=mgrOwn(side);
 if(mgrIs(victim)&&((victim._mgrGuardUntil||-1)>=turnNo||(victim._mgrProtectedUntil||-1)>=turnNo||(victim._mgrFusionGuardUntil||-1)>=turnNo)){toast('PROTECCIÓN CARMESÍ evita la destrucción.');return true}
 if(mgrIs(victim,'MGR-009')&&!victim._mgrAncestorSave){const grave=mgrGrave(side),j=grave.findIndex(x=>mgrIs(x));if(j>=0){victim._mgrAncestorSave=true;grave.splice(j,1);victim.def+=1000;toast('HERENCIA ANCESTRAL evita la destrucción.');return true}}
 const last=own.findIndex(x=>mgrIs(x,'MGR-017')&&!x._mgrConsuming);
 if(mgrIs(victim)&&last>=0&&mgrSealCount(side)>=3){const trap=own[last];trap._mgrConsuming=true;if(mgrSpendSeals(side,3)){toast('ÚLTIMA LLAMA evita la destrucción de '+victim.name+'.');setTimeout(()=>{try{destroyCard(side,last)}catch(e){}},0);return true}}
 const forge=own.find(x=>mgrIs(x,'MGR-006'));
 if(mgrIs(victim)&&(victim.type==='magic'||victim.type==='trap')&&forge&&forge._mgrForgeProtectTurn===turnNo){toast('FORJA PROTECTORA conserva '+victim.name+'.');return true}
 return false
}
function mgrAfterSurvive(side,c){
 if(!mgrIs(c,'MGR-003')||c._mgrSurviveTurn===turnNo)return;c._mgrSurviveTurn=turnNo;mgrAddSeal(side,1,'PIEL INCANDESCENTE')
}
async function mgrTryAttackTrap(attackerIndex,targetIndex){
 const trap=playerCards.findIndex(x=>mgrIs(x,'MGR-015'));if(trap<0||!enemyCards[attackerIndex])return false;
 const a=enemyCards[attackerIndex];await revealPlayer(trap);a.atk=Math.max(0,(a.atk||0)-1000);a._mgrPrisonDebuff=(a._mgrPrisonDebuff||0)+1000;a._mgrAttackBlockedUntil=turnNo;toast('PRISIÓN DE FUEGO: ataque negado · '+a.name+' pierde 1000 ATK.');await destroyCard('p',trap);return true
}
async function mgrApplyMagic(side,c){
 mgrMagicActivated(side,c);
 const own=mgrOwn(side),rival=side==='p'?enemyCards:playerCards,rs=side==='p'?'e':'p',st=mgrState(side);
 if(c.id==='MGR-011'){const ok=mgrSearch(side,x=>mgrIs(x)&&x.id!=='MGR-011','CÍRCULO DE INVOCACIÓN');if(mgrSealCount(side)>=3)mgrSearch(side,x=>x.id==='MGR-008'||x.id==='MGR-009','CÍRCULO · MATERIAL');return ok||true}
 if(c.id==='MGR-012'){let dmg=1500;if(own.filter(x=>mgrIs(x)&&x.type==='monster').length>=2)dmg+=500;mgrHit(side,dmg);toast('RÁFAGA ESCARLATA: '+dmg+' de daño directo.');return true}
 if(c.id==='MGR-013'){
  const grave=mgrGrave(side),free=own.findIndex(x=>!x),valid=grave.map((x,i)=>({c:x,i})).filter(x=>mgrIs(x.c)&&x.c.type==='monster');if(free<0||!valid.length)return false;
  const pick=side==='p'?await chooseMagicTarget('RENACER ENTRE CENIZAS',valid,side):valid[0];if(!pick)return false;const revived={...pick.c};grave.splice(pick.i,1);const bonus=mgrSealCount(side)>=2?800:500;revived.atk=Math.max(500,bonus);revived.def=Math.max(500,bonus);own[free]=revived;(side==='p'?playerModes:enemyModes)[free]='ATAQUE';await place(side,free,revived);await flip(side,free);await setMode(side,free,'ATAQUE');await mgrOnSummon(side,free,revived,true);return true
 }
 if(c.id==='MGR-014'){
  const a=own.findIndex(x=>mgrIs(x,'MGR-008')),b=own.findIndex(x=>mgrIs(x,'MGR-009'));if(a<0||b<0){toast('CONVERGENCIA CARMESÍ requiere Hechicero del Eclipse + Dragón Rubí Ancestral en Campo.');return false}
  const slots=[a,b].sort((x,y)=>y-x);for(const j of slots)await destroyCard(side,j);const free=own.findIndex(x=>!x);if(free<0)return false;const fused={...card('MGR-019')};own[free]=fused;(side==='p'?playerModes:enemyModes)[free]='ATAQUE';await place(side,free,fused);await flip(side,free);await setMode(side,free,'ATAQUE');await mgrOnSummon(side,free,fused,true);toast('FUSIÓN CARMESÍ: ARCHIMAGO DEL DRAGÓN CARMESÍ.');return true
 }
 if(c.id==='MGR-018'){
  const j=side==='p'?await magicAllyIndex(side,'EQUIPA EL GRIMORIO'):own.findIndex(x=>mgrIs(x)&&x.type==='monster');if(j<0)return false;own[j]._mgrGrimorio=true;nemesisEquip(side,j,'relic',c,{flag:'_mgrGrimorio'});st.flames=Math.max(1,st.flames);mgrSync();toast('GRIMORIO DE LAS SIETE LLAMAS activado.');return true
 }
 if(c.id==='MGR-020'){
  const choices=own.map((x,i)=>({c:x,i})).filter(x=>mgrIs(x.c)&&x.c.type==='monster');if(!choices.length)return false;const pick=side==='p'?await chooseMagicTarget('BASTÓN DE IGNIS · ELIGE PORTADOR',choices,side):choices[0];if(!pick)return false;nemesisEquip(side,pick.i,'weapon',c,{atkBonus:1800,defBonus:1200,flag:'_mgrIgnis'});pick.c._mgrIgnis=true;toast('BASTÓN DE IGNIS: +1800 ATK / +1200 DEF.');return true
 }
 return true
}
function mgrTurnStart(){
 for(const side of ['p','e']){const st=mgrState(side),own=mgrOwn(side);if(own.some(x=>x?._mgrGrimorio)&&st.flames>=5)mgrHeal(side,1000);if(own.some(x=>x?._mgrGrimorio)&&st.flames>=7&&!own.some(x=>mgrIs(x,'MGR-019'))){const free=own.findIndex(x=>!x);if(free>=0){const fused={...card('MGR-019')};own[free]=fused;(side==='p'?playerModes:enemyModes)[free]='ATAQUE';place(side,free,fused).then(()=>flip(side,free)).then(()=>setMode(side,free,'ATAQUE')).then(()=>mgrOnSummon(side,free,fused,true)).catch(()=>{})}}}mgrSync()
}
function mgrClearTurn(){
 for(const arr of [playerCards,enemyCards])arr.forEach(c=>{if(!c)return;if(c._mgrTempAtk){c.atk=Math.max(0,c.atk-c._mgrTempAtk);delete c._mgrTempAtk}if(c._mgrDebuff){c.atk+=c._mgrDebuff;delete c._mgrDebuff}if(c._mgrDefDebuff){c.def+=c._mgrDefDebuff;delete c._mgrDefDebuff}if(c._mgrPrisonDebuff){c.atk+=c._mgrPrisonDebuff;delete c._mgrPrisonDebuff}})
 mgrSync()
}
window.NEMESIS_MAGO_ROJO_ENGINE={mgrIs,mgrSealCount,mgrAddSeal,mgrSpendSeals,mgrApplyMagic,mgrOnSummon,mgrTurnStart,mgrSync};

function treasureIs(c,id=null){return !!c&&String(c.id||'').startsWith('TN-')&&(!id||c.id===id)}
function treasureOwn(side){return side==='p'?playerCards:enemyCards}
function treasureGrave(side){return side==='p'?playerGrave:enemyGrave}
function treasureQueue(side){return side==='p'?deckQueue:enemyQueue}
function treasureTags(c){return [...(c?.tags||[]),...(c?.elements||[]),...(c?.externalData?.elementos||[])].map(x=>String(x).toUpperCase())}
function treasureHit(side,n){n=Math.max(0,Number(n)||0);if(side==='p'){ehpv=Math.max(0,ehpv-n);damageFx(n,'e')}else{phpv=Math.max(0,phpv-n);damageFx(n,'p')}}
function treasureSyncEquipmentBonuses(){
 for(const side of ['p','e']){
  const own=treasureOwn(side),count=own.filter(x=>x&&(treasureTags(x).includes('OSCURIDAD')||treasureTags(x).includes('VACIO'))).length;
  own.forEach(x=>{if(!x||!x._treasureScythe)return;const old=x._treasureScytheAura||0,next=count*300;if(old!==next){x.atk=Math.max(0,(x.atk||0)-old+next);x._treasureScytheAura=next}})
 }
}
async function treasurePreventDestroy(side,i,victim){
 if(!victim)return false;
 if((victim._treasureProtectedUntil||0)>=turnNo){toast('PARADOJA PROTECTORA: la destrucción fue evitada.');return true}
 if(victim._treasureExcalibur&&!victim._treasureExcaliburSaved){
  victim._treasureExcaliburSaved=true;victim._treasureLife=1000;toast('VOLUNTAD DEL REY: Excalibur evita la destrucción una vez por duelo.');return true
 }
 if(treasureIs(victim,'TN-TRP-001')&&!victim._treasureConsuming){toast('JUICIO FINAL NÉMESIS no puede ser destruida por efectos.');return true}
 return false
}
async function treasureOnBattleKill(side,attacker){
 if(!attacker)return;
 if(attacker._treasureScythe){treasureHit(side,1000);toast('COSECHA DEL VACÍO: 1000 de daño directo.')}
}
async function treasureTryJudgement(){
 const ti=playerCards.findIndex(c=>treasureIs(c,'TN-TRP-001'));
 if(ti<0)return false;
 const trap=playerCards[ti];trap._treasureConsuming=true;
 await revealPlayer(ti).catch(()=>{});
 const strongest=enemyCards.map((c,i)=>({c,i})).filter(x=>x.c).sort((a,b)=>(b.c.atk||0)-(a.c.atk||0))[0];
 if(strongest)await destroyCard('e',strongest.i);
 await destroyCard('p',ti);
 window.__treasureEndEnemyTurn=turnNo;
 toast('JUICIO FINAL NÉMESIS: acción anulada · carta rival más fuerte destruida · turno terminado.');
 return true
}
async function applyTreasureMagic(side,c){
 if(!treasureIs(c))return false;
 const own=treasureOwn(side),grave=treasureGrave(side);
 if(c.id==='TN-MAG-001'){
   window.__treasureEnemyEffectLockUntil=turnNo;
   own.forEach(x=>{if(x)x._treasureProtectedUntil=turnNo+1});
   const rival=side==='p'?enemyCards:playerCards,enemySide=side==='p'?'e':'p';
   const target=rival.map((x,i)=>({c:x,i})).find(x=>x.c&&(x.c.type==='magic'||x.c.type==='trap'));
   if(target)await destroyCard(enemySide,target.i);
   toast('ECLIPSE DE LA ETERNIDAD: efectos rivales anulados y tu campo queda protegido.');update();return true
 }
 if(c.id==='TN-MAG-002'){
   let moved=0;while(grave.length&&moved<2){const x=grave.pop();if(x){treasureQueue(side).push(x.id);moved++}}
   if(side==='p'){for(let k=0;k<2;k++)await drawPlayerCard()}else{for(let k=0;k<2;k++){const q=enemyQueue.shift();if(q)enemyQueue.push(q)}}
   if(side==='p')phpv=Math.min(playerMaxHp,phpv+2000);else ehpv=Math.min(enemyMaxHp,ehpv+2000);
   toast('RENACIMIENTO DEL NEXO: 2 cartas recicladas · roba 2 · +2000 HP.');update();return true
 }
 if(c.id==='TN-ARM-001'||c.id==='TN-ARM-002'){
   const idx=await magicAllyIndex(side,`ELIGE PORTADOR PARA ${c.name}`);if(idx<0)return false;
   const target=own[idx];
   nemesisEquip(side,idx,'weapon',c,{atkBonus:c.atkBonus||0,defBonus:c.defBonus||0,flag:'_treasureWeapon'});
   if(c.id==='TN-ARM-001'){
     target._treasureExcalibur=true;target._treasurePiercing=true;
     if(treasureTags(target).some(t=>t==='LUZ'||t==='DIVINA')){target.atk+=500;target._treasureExcaliburResonance=500}
     toast('EXCALIBUR NÉMESIS equipada: +3000 ATK · penetración · Voluntad del Rey.')
   }else{
     target._treasureScythe=true;treasureSyncEquipmentBonuses();
     toast('GUADAÑA DEL VACÍO equipada: +2200 ATK · +1200 DEF · Cosecha del Vacío.')
   }
   update();return true
 }
 return false
}

async function applyMagic(side,c){
 if(side==='e'&&window.__treasureEnemyEffectLockUntil>=turnNo){toast('TIEMPO MUERTO: el efecto rival fue anulado.');return true}
 if(side==='e'&&await treasureTryJudgement())return true;
 if(!c?.unnegatable&&!await pcResponseWindow(side,c)){toast(`${c.name} fue anulada por la cadena de respuesta.`);return true}
 if(side==='p'&&isGhostGod&&(window.__nemesisGhostEyeCharges||0)>0){window.__nemesisGhostEyeCharges--;toast(`OJO DEL DIOS FANTASMA anula ${c.name}.`);pcChainLog(`Ojo del Dios Fantasma anula ${c.name}.`);return true}
 if(side==='p'){const counter=enemyCards.findIndex(x=>x&&x.effect==='negateMagic');if(counter>=0){toast(`Sello del Oráculo anuló ${c.name} y fue enviado al Cementerio.`);await destroyCard('e',counter);return true}}
 if(treasureIs(c))return await applyTreasureMagic(side,c);
 if(c?.magoRojo)return await mgrApplyMagic(side,c);
 if(c?.externalCard)return await applyExternalMagic(side,c);
 if(c.effect==='heal'){if(side==='p')phpv=Math.min(playerMaxHp,phpv+c.value);else ehpv=Math.min(enemyMaxHp,ehpv+c.value);update();toast(`${c.name}: +${c.value} HP`);return true}
 if(c.effect==='damageOpponent'){const target=side==='p'?'e':'p';if(target==='e')ehpv=Math.max(0,ehpv-c.value);else phpv=Math.max(0,phpv-c.value);damageFx(c.value,target);update();toast(`${c.name}: el jugador rival pierde ${c.value} HP.`);return true}
 if(c.effect==='boost'||c.effect==='boostTurn'||c.effect==='shieldNext'){
  const arr=side==='p'?playerCards:enemyCards,idx=await magicAllyIndex(side,c.effect==='shieldNext'?'ELIGE CARTA PARA PROTEGER':'ELIGE CARTA PARA POTENCIAR');
  if(idx<0){toast('No hay una carta aliada válida para aplicar el efecto.');return false}
  if(c.effect==='shieldNext'){arr[idx]._shieldBonus=(arr[idx]._shieldBonus||0)+c.value;arr[idx]._shieldPending=true;nemesisEquip(side,idx,'armor',c,{temporary:true,expiresTurn:turnNo+1});toast(`${c.name}: ${arr[idx].name} gana +${c.value} DEF durante el próximo ataque enemigo.`);return true}
  nemesisEquip(side,idx,'weapon',c,{atkBonus:c.value,temporary:c.effect==='boostTurn',expiresTurn:c.effect==='boostTurn'?turnNo:null});if(c.effect==='boostTurn')arr[idx]._turnAtkBonus=(arr[idx]._turnAtkBonus||0)+c.value;info(arr[idx],idx,side);toast(`${c.name}: ${arr[idx].name} gana +${c.value} ATK${c.effect==='boostTurn'?' hasta terminar el turno.':' hasta el final del duelo.'}`);return true
 }
 if(c.effect==='resurrect'){
  if(side==='p'&&hadesGraveSelectionBlocked('p')){toast('NOCHE ETERNA: no puedes seleccionar tu Cementerio este turno.');return false}
  const arr=side==='p'?playerCards:enemyCards,grave=side==='p'?playerGrave:enemyGrave,modes=side==='p'?playerModes:enemyModes,free=arr.map((x,i)=>x? -1:i).filter(i=>i>=0),valid=grave.map((x,i)=>({c:x,i})).filter(x=>x.c&&x.c.type!=='magic'&&x.c.type!=='trap');
  if(!free.length||!valid.length){toast(!free.length?'No hay un espacio libre en el campo.':'No hay monstruos en el Cementerio.');return false}
  const picked=side==='p'?await chooseMagicTarget('ELIGE MONSTRUO DEL CEMENTERIO',valid,side):valid[0];if(!picked)return false;if(side==='p'&&hadesTryInterceptRevive(side,picked.c)){grave.splice(picked.i,1);return true}
  const revived={...picked.c};delete revived._turnAtkBonus;delete revived._shieldBonus;delete revived._shieldPending;const slot=free[0];grave.splice(picked.i,1);arr[slot]=revived;modes[slot]='ATAQUE';await place(side,slot,revived);await flip(side,slot);await setMode(side,slot,'ATAQUE');const el=document.getElementById(side==='p'?'playergrave':'enemygrave');if(el)el.innerHTML=`☠ ${side==='p'?'TU CEMENTERIO':'CEMENTERIO RIVAL'} <b>${grave.length}</b>`;toast(`${c.name}: ${revived.name} vuelve al campo en modo ataque.`);return true
 }
 if(c.effect==='purgeSpellTrap'){
  const rivals=side==='p'?enemyCards:playerCards,enemySide=side==='p'?'e':'p',valid=rivals.map((x,i)=>({c:x,i})).filter(x=>x.c&&(x.c.type==='magic'||x.c.type==='trap'));
  if(!valid.length){toast('El rival no tiene cartas mágicas ni trampas en el campo.');return false}
  const picked=side==='p'?await chooseMagicTarget('ELIGE MÁGICA O TRAMPA RIVAL',valid,enemySide):valid[0];if(!picked)return false;await destroyCard(enemySide,picked.i);toast(`${c.name}: ${picked.c.name} fue destruida.`);return true
 }
 if(c.effect==='petrifyTurn'){const targets=playerCards.map((x,i)=>({c:x,i})).filter(x=>x.c).sort((a,b)=>b.c.atk-a.c.atk);if(!targets[0])return false;playerModes[targets[0].i]='DEFENSA';targets[0].c._petrifiedUntil=turnNo+1;await setMode('p',targets[0].i,'DEFENSA');toast(`Profecía de Medusa petrifica a ${targets[0].c.name} durante 1 turno.`);return true}
 if(c.effect==='armorRa'){const ri=enemyCards.findIndex(x=>x&&x.id==='anc-ira-ra'),ra=enemyCards[ri];if(!ra){toast('Armadura de Ra no encontró a Ira de Ra en el campo.');return true}nemesisEquip('e',ri,'armor',c,{defBonus:c.value,flag:'_armorRa'});toast(`Armadura de Ra: Ira de Ra gana +${c.value} DEF.`);return true}
 if(c.effect==='spectralPortal'){const free=enemyCards.map((x,i)=>x?-1:i).filter(i=>i>=0),valid=enemyGrave.map((x,i)=>({c:x,i})).filter(x=>x.c&&x.c.family==='spectral'&&x.c.type==='monster');if(!free.length||!valid.length)return false;const picked=valid.sort((a,b)=>b.c.atk-a.c.atk)[0],revived={...picked.c};enemyGrave.splice(picked.i,1);enemyCards[free[0]]=revived;enemyModes[free[0]]='DEFENSA';await place('e',free[0],revived);await flip('e',free[0]);await setMode('e',free[0],'DEFENSA');toast(`Portal de los Muertos revive a ${revived.name} en DEFENSA.`);return true}
 if(c.effect==='soulArmy'){enemyCards.forEach(x=>{if(x&&x.family==='spectral'){x.atk+=500;x.def+=500;x._soulArmyUntil=turnNo+2}});toast('EJÉRCITO DE ALMAS: +500 ATK / +500 DEF durante 2 turnos.');update();return true}
 if(c.effect==='condemnedCrown'){const pick=enemyCards.map((x,i)=>({x,i})).filter(o=>o.x&&o.x.family==='spectral').sort((a,b)=>b.x.def-a.x.def)[0];if(!pick)return false;nemesisEquip('e',pick.i,'relic',c,{defBonus:1000,flag:'_condemnedCrown'});toast(`Corona del Condenado: ${pick.x.name} gana +1000 DEF.`);update();return true}
 if(c.effect==='royalDecree'){if(!isSpectralKing||window.__nemesisRoyalDecreeUsed||(window.__nemesisRoyalSouls||0)<6)return false;const free=enemyCards.map((x,i)=>x?-1:i).filter(i=>i>=0),valid=enemyGrave.map((x,i)=>({c:x,i})).filter(x=>x.c&&x.c.family==='spectral'&&x.c.type==='monster').sort((a,b)=>(b.c.atk||0)-(a.c.atk||0));if(!free.length||!valid.length)return false;window.__nemesisRoyalSouls-=6;window.__nemesisRoyalDecreeUsed=true;const n=Math.min(2,free.length,valid.length);for(let k=0;k<n;k++){const picked=valid[k],gi=enemyGrave.indexOf(picked.c);if(gi<0)continue;const revived={...picked.c},slot=free[k];enemyGrave.splice(gi,1);enemyCards[slot]=revived;enemyModes[slot]=k===0?'ATAQUE':'DEFENSA';await place('e',slot,revived);await flip('e',slot);await setMode('e',slot,enemyModes[slot]);}refreshRoyalSoulPower();toast(`DECRETO DEL REY: ${n} criatura(s) espectral(es) regresan del Cementerio.`);update();return true}
 if(c.effect==='royalPortal'){if(!isSpectralKing||(window.__nemesisRoyalSouls||0)<1)return false;const free=enemyCards.map((x,i)=>x?-1:i).filter(i=>i>=0),valid=enemyGrave.map((x,i)=>({c:x,i})).filter(x=>x.c&&x.c.family==='spectral'&&x.c.type==='monster').sort((a,b)=>(b.c.atk||0)-(a.c.atk||0));if(!free.length||!valid.length)return false;window.__nemesisRoyalSouls-=1;const picked=valid[0],revived={...picked.c},slot=free[0];enemyGrave.splice(picked.i,1);revived.atk+=1000;revived.def+=1000;revived._royalPortalAtk=1000;revived._royalPortalDef=1000;revived._royalPortalUntil=turnNo+2;enemyCards[slot]=revived;enemyModes[slot]='ATAQUE';await place('e',slot,revived);await flip('e',slot);await setMode('e',slot,'ATAQUE');refreshRoyalSoulPower();toast(`PORTAL REAL: ${revived.name} revive con +1.000 ATK / +1.000 DEF durante 2 turnos.`);update();return true}
 if(c.effect==='thousandSoulCrown'){const pick=enemyCards.map((x,i)=>({x,i})).filter(o=>o.x&&o.x.family==='spectral'&&o.x.type==='monster').sort((a,b)=>b.x.def-a.x.def)[0];if(!pick)return false;nemesisEquip('e',pick.i,'relic',c,{defBonus:1500,flag:'_thousandCrown'});pick.x._thousandCrownSoulBonus=0;refreshRoyalSoulPower();toast(`CORONA DE LAS MIL ALMAS: ${pick.x.name} obtiene +1.500 DEF y poder por Almas Reales.`);update();return true}
 if(c.effect==='undyingKingSword'){const pick=enemyCards.map((x,i)=>({x,i})).filter(o=>o.x&&o.x.family==='spectral'&&o.x.type==='monster').sort((a,b)=>b.x.atk-a.x.atk)[0];if(!pick)return false;nemesisEquip('e',pick.i,'weapon',c,{atkBonus:2000,flag:'_undyingSword'});pick.x._undyingSwordSoulBonus=0;refreshRoyalSoulPower();toast(`ESPADA DEL REY SIN MUERTE: ${pick.x.name} obtiene +2.000 ATK.`);update();return true}
 if(c.effect==='ancestralEssence'){const ri=enemyCards.findIndex(x=>x&&x.id==='anc-ira-ra'),ra=enemyCards[ri];if(ra){nemesisEquip('e',ri,'relic',c,{atkBonus:500});toast('Fragmento de Esencia alimenta a Ira de Ra: +500 ATK.')}else toast('Fragmento de Esencia ancestral activado.');return true}
 if(c.effect==='celestialGate'){
  if(!isGhostGod||!ghostSpendEssence(5))return false;const free=enemyCards.map((x,i)=>x?-1:i).filter(i=>i>=0),valid=enemyGrave.map((x,i)=>({c:x,i})).filter(o=>o.c&&(o.c.family==='celestial'||o.c.family==='spectral'||o.c.tags?.includes('divine'))&&o.c.type!=='magic'&&o.c.type!=='trap').sort((a,b)=>(b.c.atk||0)-(a.c.atk||0));if(!free.length||!valid.length)return false;const p=valid[0],rev={...p.c},slot=free[0];enemyGrave.splice(p.i,1);rev.atk+=1000;rev.def+=1000;rev._celestialGateAtk=1000;rev._celestialGateDef=1000;rev._celestialGateUntil=turnNo+2;enemyCards[slot]=rev;enemyModes[slot]='ATAQUE';await place('e',slot,rev);await flip('e',slot);await setMode('e',slot,'ATAQUE');toast(`PUERTA CELESTIAL: ${rev.name} revive con +1.000 ATK/DEF durante 2 turnos.`);return true
 }
 if(c.effect==='ghostGodEye'){
  if(!isGhostGod||!ghostSpendEssence(4))return false;window.__nemesisGhostEyeCharges=Math.max(1,window.__nemesisGhostEyeCharges||0);toast('OJO DEL DIOS FANTASMA queda preparado para anular una habilidad, mágica o Fusión crítica.');return true
 }
 if(c.effect==='celestialJudgment'){
  if(!isGhostGod||window.__nemesisGhostJudgmentUsed||!ghostSpendEssence(7))return false;window.__nemesisGhostJudgmentUsed=true;const victims=playerCards.map((x,i)=>({x,i})).filter(o=>o.x).sort((a,b)=>(b.x.atk||0)-(a.x.atk||0)).slice(0,2);for(const v of victims)await destroyCard('p',v.i);const free=enemyCards.map((x,i)=>x?-1:i).filter(i=>i>=0),valid=enemyGrave.map((x,i)=>({c:x,i})).filter(o=>o.c&&(o.c.family==='celestial'||o.c.family==='spectral'||o.c.tags?.includes('divine'))&&o.c.type!=='magic'&&o.c.type!=='trap').sort((a,b)=>(b.c.atk||0)-(a.c.atk||0));if(free.length&&valid.length){const p=valid[0],rev={...p.c};enemyGrave.splice(p.i,1);enemyCards[free[0]]=rev;enemyModes[free[0]]='ATAQUE';await place('e',free[0],rev);await flip('e',free[0]);await setMode('e',free[0],'ATAQUE')}toast('JUICIO CELESTIAL DEL MÁS ALLÁ: hasta 2 amenazas son juzgadas y una criatura celestial regresa.');return true
 }
 if(c.effect==='celestialResurrection'){
  if(!isGhostGod||!ghostSpendEssence(6))return false;const free=enemyCards.map((x,i)=>x?-1:i).filter(i=>i>=0),valid=enemyGrave.map((x,i)=>({c:x,i})).filter(o=>o.c&&o.c.type!=='magic'&&o.c.type!=='trap').sort((a,b)=>(b.c.atk||0)-(a.c.atk||0));const n=Math.min(2,free.length,valid.length);if(!n)return false;for(let k=0;k<n;k++){const p=valid[k],gi=enemyGrave.indexOf(p.c);if(gi<0)continue;const rev={...p.c},slot=free[k];enemyGrave.splice(gi,1);rev.atk=Math.max(1000,Math.round((rev.atk||0)*.5));rev.def=Math.max(1000,Math.round((rev.def||0)*.5));rev._immortalUntil=turnNo;enemyCards[slot]=rev;enemyModes[slot]=k===0?'ATAQUE':'DEFENSA';await place('e',slot,rev);await flip('e',slot);await setMode('e',slot,enemyModes[slot])}if(n===2){ehpv=Math.min(enemyMaxHp,ehpv+1500);toast('RESURRECCIÓN CELESTIAL: 2 criaturas regresan INMORTALES y Dios Fantasma recupera 1.500 HP.')}else toast('RESURRECCIÓN CELESTIAL: una criatura regresa INMORTAL durante este turno.');update();return true
 }
 if(c.effect==='celestialDecree'){
  if(!isGhostGod||window.__nemesisGhostDecreeUsed||ehpv>=enemyMaxHp*.30||!ghostSpendEssence(8))return false;window.__nemesisGhostDecreeUsed=true;
  const totalAtk=enemyCards.filter(Boolean).reduce((a,x)=>a+(x.atk||0),0),strongest=playerCards.map((x,i)=>({x,i})).filter(o=>o.x).sort((a,b)=>(b.x.atk||0)-(a.x.atk||0))[0];
  if(totalAtk>=phpv&&totalAtk>0){phpv=0;damageFx(totalAtk,'p');toast(`JUICIO FINAL: ${totalAtk} de daño directo inevitable.`)}
  else if(strongest&&strongest.x.atk>=7000){const free=enemyCards.findIndex(x=>!x);if(free>=0){const stolen={...strongest.x};await destroyCard('p',strongest.i);enemyCards[free]=stolen;enemyModes[free]='ATAQUE';await place('e',free,stolen);await flip('e',free);await setMode('e',free,'ATAQUE');toast(`DOMINIO ETERNO: ${stolen.name} pasa al campo del Dios Fantasma.`)}}
  else{for(let i=playerCards.length-1;i>=0;i--)if(playerCards[i]&&!playerCards[i]._immortalUntil)await destroyCard('p',i);playerGrave.length=0;deckQueue.length=0;toast('DESTRUCCIÓN ABSOLUTA: el Decreto arrasa Campo, Cementerio y Mazo rival.')}
  update();return true
 }
 if(side==='e'&&isHades&&await hadesApplySupport(c))return true;
 if(side==='e'&&aresIsBoss()&&await aresMagic(c))return true;
 if(side==='p'&&await olympusMagic(side,c))return true;
 return false
}
async function resumePlayerAfterMagic(){
 const fieldIndex=playerCards.findIndex(Boolean);
 if(fieldIndex>=0){active=fieldIndex;setPhase('ACTION',`TU TURNO ${turnNo} · ACCIÓN`);toast('Efecto aplicado. Toca una carta de tu Arena para atacar, defender o fusionar.');await v188SafeReturn();return}
 if(handState.length>0){setPhase('PLACE',`TU TURNO ${turnNo} · COLOCAR`);toast('Efecto aplicado. Ahora coloca una carta en el campo.');await v16PlayerTurnCamera().catch(()=>{});return}
 toast(`Efecto aplicado. ${enemyTurnName} continúa el duelo.`);await enemyTurn()
}
let handImgs=[];function renderHand(){hand.innerHTML=handState.map((id,i)=>{const c=card(id);return c?`<img data-hi="${i}" data-id="${id}" src="${c.img}">`:''}).join('');handImgs=[...document.querySelectorAll('#hand img')];handImgs.forEach((x,i)=>{x.onmouseenter=()=>pcPreviewCard(card(x.dataset.id));x.onclick=async()=>{if(busy||phase!=='PLACE')return;const c=card(x.dataset.id);pcPreviewCard(c);if(c.type==='magic'){busy=true;const applied=await applyMagic('p',c);if(applied){handState.splice(i,1);renderHand();await resumePlayerAfterMagic()}busy=false;return}
if(c.type==='trap'){handImgs.forEach(y=>y.classList.remove('sel'));x.classList.add('sel');selectedHand=i;info(c,-1);toast('Calavera Muerta: toca un espacio libre. Quedará boca abajo y oculta para el rival.');return}handImgs.forEach(y=>y.classList.remove('sel'));x.classList.add('sel');selectedHand=i;info(c,-1);toast('Ahora toca uno de tus espacios libres del tablero.')}});updatePcStrategicHud()}
function playerHasCardsToPlay(){return handState.length>0||deckQueue.length>0||playerCards.some(Boolean)}
function enemyHasCardsToPlay(){return enemyQueue.length>0||enemyCards.some(Boolean)}
function checkNoCards(){if(phase==='END')return true;if(!playerHasCardsToPlay()){finish(false,`Te quedaste sin cartas para jugar. ${enemyDisplayName} gana el duelo.`);return true}if(!enemyHasCardsToPlay()){finish(true,`${enemyDisplayName} se quedó sin cartas para jugar. ¡Ganas el duelo!`);return true}return false}
function v186DrawAnimation(id){
 const c=card(id);if(!c)return;
 const ghost=document.createElement('div');ghost.className='v186draw';
 ghost.innerHTML=`<div class="v186back">NÉMESIS</div><img src="${c.img}" alt="${c.name||'Carta robada'}">`;
 document.body.appendChild(ghost);
 requestAnimationFrame(()=>requestAnimationFrame(()=>ghost.classList.add('tohand')));
 setTimeout(()=>ghost.classList.add('flip'),260);
 setTimeout(()=>ghost.remove(),650);
}
async function drawPlayerCard(){
 if(deckQueue.length&&handState.length<5){
  const id=deckQueue.shift();
  v188Sound('draw');v186DrawAnimation(id);
  await wait(430);handState.push(id);renderHand();const imgs=[...document.querySelectorAll('#hand img')];const last=imgs[imgs.length-1];if(last){last.classList.add('v186new');setTimeout(()=>last.classList.remove('v186new'),700)}
 }
 return handState.length>0||deckQueue.length>0||playerCards.some(Boolean)
}renderHand();
function bossAiCardScore(c){
 if(!c)return -99999;
 const field=enemyCards.filter(Boolean),player=playerCards.filter(Boolean),raOnField=field.some(x=>x.id==='anc-ira-ra');
 const playerStrongest=Math.max(0,...player.map(x=>x.atk||0)),playerLowestDef=Math.min(...player.map(x=>x.def||0),99999);
 let score=(c.atk||0)*.7+(c.def||0)*.35;
 if(c.type==='magic')score=1200;
 if(c.effect==='heal')score=ehpv<=enemyMaxHp*.45?6200:ehpv<=enemyMaxHp*.72?3200:-5000;
 if(c.effect==='damageOpponent')score=phpv<=Number(c.value||0)?9000:4200;
 if(c.effect==='resurrect')score=enemyGrave.some(x=>x&&x.type!=='magic'&&x.type!=='trap')?5400:-4500;
 if(c.effect==='petrifyTurn')score=playerStrongest>0?5000:-3500;
 if(c.effect==='negateMagic')score=player.length?3600:1800;
 if(c.effect==='armorRa')score=raOnField?6800:-5000;
 if(c.effect==='ancestralEssence')score=raOnField?6100:-4200;
 if(c.effect==='boostTurn')score=field.length?4700:-3500;
 if(c.effect==='spectralPortal')score=enemyGrave.some(x=>x&&x.family==='spectral'&&x.type==='monster')?6500:-5000;
 if(c.effect==='soulArmy')score=field.filter(x=>x&&x.family==='spectral').length>=2?6100:1800;
 if(c.effect==='condemnedCrown')score=field.some(x=>x&&x.family==='spectral')?5200:-4000;
 if(isGhostGod&&c.effect==='thresholdGuardian')score+=2600;
 if(isGhostGod&&c.effect==='soulSword')score+=3800;
 if(isGhostGod&&c.effect==='voidBreath')score+=phpv<=1200?7600:4300;
 if(isGhostGod&&c.effect==='celestialDominion')score+=player.some(x=>x)?5200:1800;
 if(isGhostGod&&c.effect==='eternalSentence')score+=6200;
 if(isGhostGod&&c.effect==='celestialGate')score+=((window.__nemesisCelestialEssence||0)>=5&&enemyGrave.some(x=>x&&x.type!=='magic'&&x.type!=='trap'))?7200:-8000;
 if(isGhostGod&&c.effect==='ghostGodEye')score+=((window.__nemesisCelestialEssence||0)>=4&&!window.__nemesisGhostEyeCharges)?6800:-6500;
 if(isGhostGod&&c.effect==='celestialJudgment')score+=((window.__nemesisCelestialEssence||0)>=7&&!window.__nemesisGhostJudgmentUsed&&player.length>=2)?9800:-9000;
 if(isGhostGod&&c.effect==='celestialResurrection')score+=((window.__nemesisCelestialEssence||0)>=6&&enemyGrave.filter(x=>x&&x.type!=='magic'&&x.type!=='trap').length>=1)?8200:-8500;
 if(isGhostGod&&c.effect==='celestialDecree')score+=((window.__nemesisCelestialEssence||0)>=8&&!window.__nemesisGhostDecreeUsed&&ehpv<enemyMaxHp*.30)?12000:-12000;
 if(isSpectralKing&&c.effect==='royalBlood')score+=2600;
 if(isSpectralKing&&c.effect==='executionOrder')score+=field.length?3000:1800;
 if(isSpectralKing&&c.effect==='soulBanquet')score+=(window.__nemesisRoyalSouls||0)*900;
 if(isSpectralKing&&c.effect==='underworldBreath')score+=phpv<=1000?7000:2800;
 if(isSpectralKing&&c.effect==='royalResurrection')score+=enemyGrave.some(x=>x&&x.family==='spectral'&&x.type==='monster')?5200:600;
 if(isSpectralKing&&c.effect==='royalExecution')score+=player.some(x=>x&&(x.def||0)<=4000)?5200:1600;
 if(isSpectralKing&&c.effect==='royalDecree')score+=(!window.__nemesisRoyalDecreeUsed&&(window.__nemesisRoyalSouls||0)>=6&&enemyGrave.some(x=>x&&x.family==='spectral'&&x.type==='monster'))?9000:-8000;
 if(isSpectralKing&&c.effect==='royalPortal')score+=((window.__nemesisRoyalSouls||0)>=1&&enemyGrave.some(x=>x&&x.family==='spectral'&&x.type==='monster'))?6500:-6500;
 if(isSpectralKing&&c.effect==='thousandSoulCrown')score+=field.some(x=>x&&x.family==='spectral')?5000:-5000;
 if(isSpectralKing&&c.effect==='undyingKingSword')score+=field.some(x=>x&&x.family==='spectral')?6200:-5000;
 if(c.id==='anc-ira-ra')score+=isRa?9000:0;
 if(c.id==='anc-mehen'&&player.some((x,i)=>x&&playerModes[i]==='ATAQUE'))score+=5000;
 if(c.id==='anc-ojo-ra')score+=player.length>=2?7600:player.length?4200:-3000;
 if(c.id==='anc-mnevis')score+=player.length?Math.max(0,4200-playerLowestDef*.15):0;
 if(c.id==='anc-cetro-was')score+=field.length*650;
 if(c.special)score+=1800;
 if(bossPhaseLevel>=2){if(c.effect==='damageOpponent'||c.effect==='petrifyTurn'||c.effect==='negateMagic')score+=900;if(c.atk>=playerStrongest&&c.type!=='magic')score+=650}
 if(bossPhaseLevel>=3){if(c.effect==='heal'&&ehpv<=enemyMaxHp*.35)score+=1800;if(c.id==='anc-ira-ra'||c.id==='ojo-dragon-jefe')score+=1400;if(c.type!=='magic'&&c.atk>=phpv)score+=3500}
 
 if(isAres){
  const ph=aresPhase(),f=aresFury(),threat=playerCards.filter(Boolean).sort((a,b)=>(b.atk||0)-(a.atk||0))[0];
  if(c.effect==='aresWarFormation')score+=ph===1?7000:3500;
  if(c.effect==='aresFrontLine')score+=ph===1?6200:2600;
  if(c.effect==='aresBloodThirst')score+=ph>=2?5200:3400;
  if(c.effect==='aresThreeMaws')score+=f>=2?6800:4200;
  if(c.effect==='aresTitanicImpact')score+=ph===3?9000:6000;
  if(c.effect==='aresOlympusBreaker')score+=enemyCards.some(Boolean)?6200:-7000;
  if(c.effect==='aresDivineArmor')score+=enemyCards.some(Boolean)?5800:-7000;
  if(c.effect==='aresWarBanner')score+=enemyCards.filter(Boolean).length>=2?7600:3000;
  if(c.effect==='aresWarStorm')score+=playerCards.some(x=>x&&x.atk<3000)?8200:5200;
  if(c.effect==='aresSiegeRam')score+=f>=3?(ph>=2?8500:6000):-9000;
  if(c.effect==='aresWarEye')score+=(!aresEyeUsed&&playerCards.filter(Boolean).length>=2)?10000:-10000;
  if(c.effect==='aresSupremeWrath')score+=ph===3?14000:-14000;
  if(threat?.id==='titan-del-olimpo')score+=2500;
  const oread=olympusAiPublicRead();if(oread.fusionThreat)score+=900;if(oread.fusionReady)score+=1600;
 }
return score;
}
function bossAiPickQueueIndex(){
 if(!enemyQueue.length)return -1;
 let best=0,bestScore=-Infinity;
 enemyQueue.forEach((c,i)=>{const score=bossAiCardScore(c)+(i===0?120:0);if(score>bestScore){best=i;bestScore=score}});
 return best;
}
function bossAiMode(c){
 if(!c)return 'ATAQUE';
 const targets=playerCards.map((x,i)=>x?{c:x,i}:null).filter(Boolean);
 if(!targets.length)return 'ATAQUE';
 const canBeat=targets.some(t=>{const v=playerModes[t.i]==='DEFENSA'?(t.c.def||0):(t.c.atk||0);return (c.atk||0)>v&&t.c.effect!=='phantomReflect'});
 const strongestPlayer=Math.max(0,...targets.map(t=>t.c.atk||0));
 if(canBeat)return 'ATAQUE';
 const aggr=bossAggression();
 if(bossPhaseLevel===3&&(c.atk||0)>=strongestPlayer*.62)return 'ATAQUE';
 if(bossPhaseLevel===2&&(c.atk||0)>=strongestPlayer*.78)return 'ATAQUE';
 if((c.def||0)>=(c.atk||0)*(1.08*aggr)||(c.atk||0)<strongestPlayer*(.72/aggr))return 'DEFENSA';
 return 'ATAQUE';
}
function bossAiAttackChoice(){
 const attackers=enemyCards.map((c,i)=>c&&enemyModes[i]==='ATAQUE'?i:-1).filter(i=>i>=0),targets=playerCards.map((c,i)=>c?i:-1).filter(i=>i>=0);
 if(!attackers.length)return null;
 if(!targets.length){const ai=attackers.slice().sort((a,b)=>(enemyCards[b].atk||0)-(enemyCards[a].atk||0))[0];return{attacker:ai,target:-1}}
 let best=null,bestScore=-Infinity;
 for(const ai of attackers){const A=enemyCards[ai];for(const di of targets){const D=playerCards[di],dm=playerModes[di]||'ATAQUE',defense=dm==='DEFENSA'?(D.def||0):(D.atk||0);let score=(A.atk||0)-defense;
   if(D.effect==='phantomReflect')score-=Math.max(6000,(A.atk||0)*1.4);
   if(score>=0)score+=4200;else score-=Math.abs(score)*1.25;
   if(dm==='DEFENSA')score+=Math.max(0,(D.def||0)-(D.atk||0))*.15;
   if((D.atk||0)>=playerMaxHp*.35)score+=900;
   if(D.id==='dios-jupiter')score+=1400;
   const olympusRead=olympusAiPublicRead();
   if(olympusRead.fusionThreat&&olympusMaterialIds().includes(D.id))score+=2400;
   if(olympusRead.fusionReady&&olympusMaterialIds().includes(D.id))score+=2200;
   // Atenea/Poseidón pueden convertirse en distracciones reales: si su amenaza de campo
   // supera al material, la IA puede priorizarlos y no "adivina" la mano.
   if(olympusRead.fusionThreat&&['olimpo-atenea','olimpo-poseidon'].includes(D.id)&&(D.atk||0)>=6500)score+=1750;
   if(bossPhaseLevel>=2){score+=Math.max(0,(D.atk||0)-2200)*.16;if((A.atk||0)>=defense)score+=900}
   if(bossPhaseLevel>=3){score+=Math.max(0,(A.atk||0)-defense)*.35;if((D.atk||0)>=4500)score+=1100;if((A.atk||0)>=phpv&&D.effect!=='phantomReflect')score+=2600}
   if(score>bestScore){bestScore=score;best={attacker:ai,target:di}}
 }}
 return best||{attacker:attackers[0],target:targets[0]};
}
async function enemyPlace(){const free=[0,1,2,3,4].filter(i=>!enemyCards[i]);if(!enemyQueue.length)return -1;const pick=(isRa||isDragon||isSoulKnight||isSpectralKing||isGhostGod||isAres||isHades)?bossAiPickQueueIndex():0;if(pick<0)return -1;const ec=enemyQueue.splice(pick,1)[0];if(['magic','trap','relic'].includes(ec.type)){
 if(isHades){
  if(ec.effect==='hadesPortal'&&!hadesPortalActive&&hadesObols<3&&!hadesCoinAvailable){enemyQueue.push(ec);return -1}
  if(ec.effect==='hadesChains'&&hadesChainsArmed){enemyQueue.push(ec);return -1}
  if(ec.effect==='hadesBlackCoin'&&(hadesCoinAvailable||hadesCoinUsed)){enemyQueue.push(ec);return -1}
 }
 if(isAres){
  if(['aresOlympusBreaker','aresDivineArmor','aresWarBanner','aresWarEye'].includes(ec.effect)&&!enemyCards.some(Boolean)){enemyQueue.push(ec);return -1}
  if(ec.effect==='aresWarEye'&&aresEyeUsed){enemyQueue.push(ec);return -1}
 }
 if(isGhostGod){
  const essence=window.__nemesisCelestialEssence||0;
  const need={celestialGate:5,ghostGodEye:4,celestialJudgment:7,celestialResurrection:6,celestialDecree:8}[ec.effect]||0;
  if(need&&essence<need){enemyQueue.push(ec);return -1}
  if(ec.effect==='celestialGate'&&!enemyGrave.some(x=>x&&x.type!=='magic'&&x.type!=='trap')){enemyQueue.push(ec);return -1}
  if(ec.effect==='celestialResurrection'&&!enemyGrave.some(x=>x&&x.type!=='magic'&&x.type!=='trap')){enemyQueue.push(ec);return -1}
  if(ec.effect==='celestialJudgment'&&window.__nemesisGhostJudgmentUsed){enemyQueue.push(ec);return -1}
  if(ec.effect==='celestialDecree'&&(window.__nemesisGhostDecreeUsed||ehpv>=enemyMaxHp*.30)){enemyQueue.push(ec);return -1}
 }
 if(isSpectralKing&&ec.effect==='royalDecree'&&(window.__nemesisRoyalDecreeUsed||(window.__nemesisRoyalSouls||0)<6||!enemyGrave.some(x=>x&&x.family==='spectral'&&x.type==='monster'))){enemyQueue.push(ec);return -1}if(isSpectralKing&&ec.effect==='royalPortal'&&((window.__nemesisRoyalSouls||0)<1||!enemyGrave.some(x=>x&&x.family==='spectral'&&x.type==='monster'))){enemyQueue.push(ec);return -1}if(isSpectralKing&&(ec.effect==='thousandSoulCrown'||ec.effect==='undyingKingSword')&&!enemyCards.some(x=>x&&x.family==='spectral'&&x.type==='monster')){enemyQueue.push(ec);return -1}if(ec.effect==='heal'&&ehpv>=enemyMaxHp){enemyQueue.push(ec);return -1}if((ec.effect==='armorRa'||ec.effect==='ancestralEssence')&&!enemyCards.some(x=>x&&x.id==='anc-ira-ra')){enemyQueue.push(ec);return -1}if(ec.effect==='resurrect'&&!enemyGrave.some(x=>x&&x.type!=='magic'&&x.type!=='trap')){enemyQueue.push(ec);return -1}await applyMagic('e',ec);if(window.__treasureEndEnemyTurn===turnNo)return -1;return -1}if(!free.length){enemyQueue.push(ec);return -1}enemySlot=free[0];enemyCards[enemySlot]={...ec};if(isDragon&&dragonAttackBonus&&!enemyCards[enemySlot]._dragonRageBonus){enemyCards[enemySlot].atk+=dragonAttackBonus;enemyCards[enemySlot]._dragonRageBonus=dragonAttackBonus}enemyRevealed[enemySlot]=false;await place('e',enemySlot,enemyCards[enemySlot]);await idrOnSummon('e',enemySlot,enemyCards[enemySlot],false);await mgrOnSummon('e',enemySlot,enemyCards[enemySlot],false);const mode=(isRa||isDragon||isSoulKnight||isSpectralKing||isGhostGod||isAres||isHades)?bossAiMode(enemyCards[enemySlot]):((enemyCards[enemySlot].def>enemyCards[enemySlot].atk)?'DEFENSA':'ATAQUE');enemyModes[enemySlot]=mode;if(isSoulKnight){const sc=enemyCards[enemySlot];if(sc.effect==='deadFire'){phpv=Math.max(0,phpv-700);damageFx(700,'p');toast('FUEGO DE LOS MUERTOS: 700 de daño directo.')}if(sc.effect==='soulScythe'){const n=enemyGrave.filter(x=>x&&x.family==='spectral'&&x.type==='monster').length;sc.atk+=n*300;if(n)toast(`GUADAÑA DE ALMAS: +${n*300} ATK.`)}}
 if(isSpectralKing)await applyRoyalEntryEffect(enemySlot,enemyCards[enemySlot]);
 if(isGhostGod)await applyGhostEntryEffect(enemySlot,enemyCards[enemySlot]);
 v1892ResetCardTransform(board.e[enemySlot],'e',enemySlot,mode);
 if(isDragon&&ec.id==='ojo-dragon-jefe')dragonRageBanner('DRAGÓN OJO DEL DIABLO','¡Ahora conocerás la verdadera ira del diablo!');
 await applyRaEntryEffect(enemySlot,enemyCards[enemySlot]);
 return enemySlot}
async function handleSlot(side,i){if(busy||enAnimacionGSAP)return;if(side==='p'&&phase==='PLACE'&&selectedHand>=0&&!playerCards[i]){busy=true;const id=handState[selectedHand],c={...card(id)};playerCards[i]=c;await v16Cam('PLACE','p',i);await place('p',i,c);await idrOnSummon('p',i,c,false);await mgrOnSummon('p',i,c,false);let mode;
if(c.type==='trap'){mode='TRAMPA';playerModes[i]=mode;board.p[i].rotation.y=Math.PI;toast('Calavera Muerta colocada boca abajo. Se activará una sola vez cuando el rival ataque.')}else{await v16Cam('MODE','p',i);mode=await askMode();await setMode('p',i,mode)}handState.splice(selectedHand,1);selectedHand=-1;renderHand();active=i;setPhase('ACTION',`TU TURNO ${turnNo} · ACCIÓN`);toast(`Carta colocada en ${mode}. Tócala para actuar.`);await v16Cam('PLAYER_CARD','p',i);await v188SafeReturn();busy=false;return}
 if(side==='p'&&playerCards[i]&&phase==='ACTION'){active=i;info(playerCards[i],i,'p');battleActions.classList.remove('hidden');toast(playerModes[i]==='DEFENSA'?'Esta carta está en DEFENSA. Puedes cambiarla a ataque y atacar.':'ATACAR o FUSIÓN.');await focus('p',i);return}
 if(side==='e'&&enemyCards[i]&&phase==='TARGET'){return}}
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
function pcRaySlot(e){const q=r.domElement.getBoundingClientRect();mouse.x=((e.clientX-q.left)/q.width)*2-1;mouse.y=-((e.clientY-q.top)/q.height)*2+1;ray.setFromCamera(mouse,cam);return ray.intersectObjects(slotMeshes,false)[0]}
r.domElement.addEventListener('pointermove',e=>{const h=pcRaySlot(e);r.domElement.style.cursor=h?'pointer':'default';if(h){const side=h.object.userData.side,i=h.object.userData.index,c=(side==='p'?playerCards:enemyCards)[i];if(c&&(side==='p'||enemyRevealed[i]))pcPreviewCard(c);if(phase==='TARGET'&&side==='e'&&c)pcSetAttackLine(i);else if(phase==='TARGET')pcAttackLine.visible=false}else if(phase==='TARGET')pcAttackLine.visible=false});
r.domElement.addEventListener('pointerup',e=>{const h=pcRaySlot(e);if(h)handleSlot(h.object.userData.side,h.object.userData.index)});
function pcOpenInspector(c,side,i){
 if(!c||side==='e'&&!enemyRevealed[i])return;
 document.getElementById('pcInspector')?.remove();
 const x=document.createElement('div');x.id='pcInspector';x.className='pc-inspector-modal';
 x.innerHTML=`<section><button class="pc-inspector-close" aria-label="Cerrar">×</button><img src="${c.img||c.image||''}" alt="${c.name||'Carta'}"><div><small>INSPECCIÓN ESTRATÉGICA · ${side==='p'?'TU CAMPO':'CAMPO RIVAL'}</small><h2>${c.name||'CARTA'}</h2><h3>ATK ${c.atk??c.power??0} · DEF ${c.def??0}</h3><strong>${pcAbilityText(c)}</strong><p>${pcHistoryText(c)}</p></div></section>`;
 document.body.appendChild(x);x.querySelector('.pc-inspector-close').onclick=()=>x.remove();x.onclick=e=>{if(e.target===x)x.remove()};
}
r.domElement.addEventListener('contextmenu',e=>{e.preventDefault();const h=pcRaySlot(e);if(!h)return;const side=h.object.userData.side,i=h.object.userData.index,c=(side==='p'?playerCards:enemyCards)[i];pcOpenInspector(c,side,i)});
async function revealEnemy(i=enemySlot){if(i<0||!enemyCards[i]||enemyRevealed[i])return;setPhase('ENEMY',`REVELACIÓN DE ${enemyTurnName}`);await flip('e',i);enemyRevealed[i]=true;board.e[i].rotation.z=enemyModes[i]==='DEFENSA'?Math.PI/2:0;ename.textContent=enemyCards[i].name;if(pcCinematicProfile(enemyCards[i])&&!enemyCards[i]._cinematicSummoned){enemyCards[i]._cinematicSummoned=true;await pcCardCinematic('summon','e',i,enemyCards[i])}await wait(220)}
async function revealPlayer(i){if(board.p[i]?.userData.faceDown)await flip('p',i);if(board.p[i])board.p[i].rotation.z=playerModes[i]==='DEFENSA'?Math.PI/2:0}

function v12TargetCamera(on){
  const board=document.querySelector('.board3d')||document.querySelector('.arena3d')||document.querySelector('.duel3d');
  document.body.classList.toggle('v12-target-mode',!!on);
  if(board) board.classList.toggle('v12-target-focus',!!on);
  const enemyArea=document.querySelector('.enemy-field')||document.querySelector('.enemySlots')||document.querySelector('#enemySlots');
  if(on && enemyArea && enemyArea.scrollIntoView){
    try{enemyArea.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){}
  }
}
function v12EnemyCardInfo(i){
  const c=enemyCards&&enemyCards[i]; if(!c)return;
  const mode=(enemyModes&&enemyModes[i])||'ATAQUE';
  const atk=c.atk??c.power??0, def=c.def??0;
  const b=document.getElementById('targetbanner');
  if(b){b.innerHTML=`<b>${c.name||'Carta rival'}</b><small>ATK ${atk} · DEF ${def} · ${mode}</small>`;b.classList.remove('hidden');}
}



// V18.12.00 — PERFILES DE CAMPAÑA AISLADOS
const NEMESIS_CAMPAIGN_PROFILES=Object.freeze({
 campaign1:Object.freeze({
  id:'campaign1',name:'CAMPAÑA I',bosses:['guardian','dragon','ra'],
  systems:['Guardian AI','Dragon Rage','Ira de Ra','efectos ancestrales'],
  completionBoss:'ra'
 }),
 campaign2:Object.freeze({
  id:'campaign2',name:'CAMPAÑA II',bosses:['caballero-almas','rey-espectral','dios-fantasma'],
  systems:['Cementerio','Almas','Almas Reales','Esencia Celestial','Resurrección','formas finales'],
  completionBoss:'dios-fantasma'
 }),
 campaign3:Object.freeze({
  id:'campaign3',name:'CAMPAÑA III · GUERRA DE LOS DIOSES',bosses:['ares','hades'],
  systems:['Furia','Óbolos','Tártaro','IA Modo Dios','Campo Heroico','PC Ultra'],
  completionBoss:'hades'
 })
});
window.NEMESIS_CAMPAIGN_PROFILES=NEMESIS_CAMPAIGN_PROFILES;

// V18.11 — ADAPTADORES AISLADOS DE JEFE
// Cada jefe conserva su motor; este adaptador decide qué hooks puede ejecutar.
const NEMESIS_BOSS_ADAPTERS=Object.freeze({
 guardian:{id:'guardian',campaign:1},
 dragon:{id:'dragon',campaign:1},
 ra:{id:'ra',campaign:1},
 'caballero-almas':{id:'caballero-almas',campaign:2},
 'rey-espectral':{id:'rey-espectral',campaign:2,turnStart:()=>clearExpiredRoyalBuffs(),recover:()=>spectralKingCombatRecovery()},
 'dios-fantasma':{id:'dios-fantasma',campaign:2,turnStart:()=>clearExpiredCelestialEffects(),recover:()=>ghostCombatRecovery()},
 ares:{id:'ares',campaign:3,turnStart:()=>{aresClearPlayerTitanDebuff();aresStartTurnPowers()}},
 hades:{id:'hades',campaign:3,turnStart:()=>hadesControlAi()}
});
const bossAdapter=NEMESIS_BOSS_ADAPTERS[duelKey]||NEMESIS_BOSS_ADAPTERS.guardian;
function nemesisBossTurnStart(){
 nemesisDmEndTurn();
 // Comunes primero.
 heroicTurn('e');olympusRestoreTide();nemesisExpireEquipment();
 // Solo el jefe activo ejecuta su motor privado.
 try{bossAdapter.turnStart?.()}catch(e){console.error(`[${duelKey}] turnStart`,e)}
}
function nemesisBossRecover(){
 try{bossAdapter.recover?.()}catch(e){console.warn(`[${duelKey}] recover`,e)}
}

async function enemyTurn(){
/* NEMESIS_ENEMY_TURN_GUARD V19 */
try{
nemesisBossTurnStart();endPlayerMagicTurn();v172ClosePicker();v171HideAttackConfirm();v17PendingTarget=-1;v181ReturnOverview();v12TargetCamera(false);targetbanner?.classList.add('hidden');
 if(phase==='END')return;
 if(enemySkipTurns>0){enemySkipTurns--;setPhase('ENEMY','KRONOS · TIEMPO DETENIDO');toast(`${enemyTurnName} pierde su turno completo por DETENER EL TIEMPO.`);pcLog(`${enemyTurnName} pierde el turno por Kronos.`,'effect');await wait(900);clearSkillTurnEffects();turnNo++;await drawPlayerCard();await pub23TurnStart();nemesisDmTurnStart();mgrTurnStart();const canPlace=handState.length>0&&playerCards.some(c=>!c);setPhase(canPlace?'PLACE':'ACTION',canPlace?`TU TURNO ${turnNo} · COLOCAR`:`TU TURNO ${turnNo} · ACCIÓN`);active=playerCards.findIndex(Boolean);battleActions.classList.toggle('hidden',canPlace);await v16PlayerTurnCamera().catch(()=>{});busy=false;return}
 if(isRa){if(playerAttackBlockedUntil&&playerAttackBlockedUntil<=turnNo){const mehen=enemyCards.findIndex(c=>c&&c.id==='anc-mehen');if(mehen>=0)await destroyCard('e',mehen);playerAttackBlockedUntil=0;toast('Mehen completó su protección y fue destruida.')}applyRaTurnGrowth()}
 if(checkNoCards())return;
 setPhase('ENEMY',`TURNO ${turnNo} DE ${enemyTurnName} · COLOCAR`);battleActions.classList.add('hidden');await v16Cam('ENEMY_FIELD','e',2);
 try{
  await wait(220);await guardStep(enemyPlace(),3500,'colocación rival');await nemesisDmCheckHunterTrap();if(window.__treasureEndEnemyTurn===turnNo)return;if(phpv<=0)return finish(false);
  if(isDragon&&dragonRageLevel>=2&&enemyQueue.length){setPhase('ENEMY',`TURNO ${turnNo} DE ${enemyTurnName} · IRA DEL DIABLO`);await wait(260);await guardStep(enemyPlace(),3500,'segunda colocación rival');await nemesisDmCheckHunterTrap();if(phpv<=0)return finish(false)}
  const attackers=enemyCards.map((c,i)=>c&&enemyModes[i]==='ATAQUE'?i:-1).filter(i=>i>=0),targets=playerCards.map((c,i)=>c?i:-1).filter(i=>i>=0),aiChoice=(isRa||isDragon||isSoulKnight||isSpectralKing||isGhostGod||isAres||isHades)?bossAiAttackChoice():null;
  if(attackers.length&&await treasureTryJudgement())return;
  if(attackers.length&&!targets.length){
   enemySlot=aiChoice?.attacker??attackers[Math.floor(Math.random()*attackers.length)];
   await guardStep(revealEnemy(enemySlot),2200,'revelación rival');if(await dmTitanJudgement('p',enemyCards[enemySlot],'ataque')){clearNextEnemyShields();}else{setPhase('ENEMY',`TURNO ${turnNo} DE ${enemyTurnName} · HABILIDAD`);await guardStep(useCreatureSkill('e',enemySlot),1800,'habilidad rival');if(phpv<=0)return finish(false);
   setPhase('ENEMY',`TURNO ${turnNo} DE ${enemyTurnName} · COMBATE`);const attacker=enemyCards[enemySlot];
   if(playerDirectShieldUntil>=turnNo){await guardStep(attackAnim('e',enemySlot,'p',0,attacker,0),5000,'ataque directo bloqueado');toast(`ESCUDO SOLAR: ${attacker.name} no puede atacar directamente tus HP.`);pcLog(`Escudo Solar bloquea el ataque directo de ${attacker.name}.`,'effect')}
   else{await guardStep(attackAnim('e',enemySlot,'p',0,attacker,attacker.atk),5000,'ataque directo rival');phpv=Math.max(0,phpv-attacker.atk);damageFx(attacker.atk,'p');update();toast(`${attacker.name} causa ${attacker.atk} de daño directo a tus HP.`)}}
  }
  else if(attackers.length&&targets.length){
   enemySlot=aiChoice?.attacker??attackers[Math.floor(Math.random()*attackers.length)];
   if(await mgrTryAttackTrap(enemySlot,targets[0])){
    clearNextEnemyShields();
   }else if(await dmTitanJudgement('p',enemyCards[enemySlot],'ataque')){clearNextEnemyShields();}
   else{
    const trapIndex=playerCards.findIndex(c=>c&&c.type==='trap'&&c.effect==='destroyAttacker');
    if(trapIndex>=0&&enemyCards[enemySlot]){
     setPhase('ENEMY',`TURNO ${turnNo} DE ${enemyTurnName} · TRAMPA`);
     await v16Cam('TRAP','p',trapIndex);v188Sound('trap');v15TrapFX();
     toast('¡CALAVERA MUERTA SE ACTIVA! La carta atacante será destruida.');
     await revealPlayer(trapIndex);await wait(240);await destroyCard('e',enemySlot);await wait(180);await destroyCard('p',trapIndex);clearNextEnemyShields();
     toast('La carta atacante fue destruida. Calavera Muerta se consumió y fue al Cementerio.');
    }else{
     const target=aiChoice?.target??targets.slice().sort((a,b)=>{const va=(playerModes[a]==='DEFENSA'?playerCards[a].def:playerCards[a].atk),vb=(playerModes[b]==='DEFENSA'?playerCards[b].def:playerCards[b].atk);return va-vb})[0];
     await guardStep(revealEnemy(enemySlot),2200,'revelación rival');
     setPhase('ENEMY',`TURNO ${turnNo} DE ${enemyTurnName} · HABILIDAD`);
     await guardStep(useCreatureSkill('e',enemySlot),1800,'habilidad rival');
     if(phpv<=0)return finish(false);
     setPhase('ENEMY',`TURNO ${turnNo} DE ${enemyTurnName} · COMBATE`);
     await guardStep(resolveBattle('e',enemySlot,'p',target),6500,'ataque rival');
    }
   }
  }
  if(isGhostGod&&enemySlot>=0&&enemyCards[enemySlot]?.effect==='voidBreath'&&phpv>0)await ghostSecondAttackIfPossible(enemySlot);
  if(phpv<=0)return finish(false);if(ehpv<=0){if(ghostGodFinalFormSave()){await ghostGodContinueAfterFinalForm();return}if(spectralKingCrownSave()){await spectralKingContinueAfterCrown();return}return finish(true)};if(checkNoCards())return
 }catch(err){console.error('enemyTurn',err);toast('El turno rival se recuperó automáticamente.')}finally{
  if(phase!=='END'){
   clearSkillTurnEffects();
   turnNo++;await drawPlayerCard();await pub23TurnStart();nemesisDmTurnStart();mgrTurnStart();if(checkNoCards())return;const canPlace=handState.length>0&&playerCards.some(c=>!c);setPhase(canPlace?'PLACE':'ACTION',canPlace?`TU TURNO ${turnNo} · COLOCAR`:`TU TURNO ${turnNo} · ACCIÓN`);active=playerCards.findIndex(Boolean);toast(canPlace?'Coloca una nueva carta.':'Toca una carta de tu Arena para actuar.');battleActions.classList.toggle('hidden',canPlace);await guardStep(v16PlayerTurnCamera(),1600,'vista de turno').catch(()=>{});busy=false
  }
 }

} catch(e){
 console.error('[NÉMESIS enemyTurn]',e);
 pcLog?.('La IA encontró un error y el motor recuperó el turno.','effect');
} finally {
 if(phase!=='END'&&phase==='ENEMY'){
   turnNo++;
   const canPlace=(typeof handState!=='undefined'&&Array.isArray(handState)&&handState.length>0&&playerCards.some(x=>!x));
   setPhase(canPlace?'PLACE':'ACTION',canPlace?`TU TURNO ${turnNo} · COLOCAR`:`TU TURNO ${turnNo} · ACCIÓN`,{force:true});
   if(!canPlace&&playerCards.some(Boolean))battleActions.classList.remove('hidden');
 }
}
}



function nemesisFlowSupervisor(){
 if(phase==='END'||busy)return;
 // TARGET no puede sobrevivir si ya no existe objetivo.
 if(phase==='TARGET'&&!enemyCards.some(Boolean)){
   try{v172ClosePicker?.();v171HideAttackConfirm?.()}catch(e){}
   v17PendingTarget=-1;
   try{targetbanner?.classList.add('hidden')}catch(e){}
   setPhase('ACTION',`TU TURNO ${turnNo} · ACCIÓN`,{force:true});
   battleActions.classList.remove('hidden');
   toast('INTEGRIDAD: objetivo eliminado; duelo recuperado.');
 }
 // ACTION siempre debe ser jugable si existe carta propia.
 if(phase==='ACTION'&&playerCards.some(Boolean)&&battleActions.classList.contains('hidden')){
   battleActions.classList.remove('hidden');
 }
 // PLACE sólo puede quedar activo si existe espacio y mano.
 if(phase==='PLACE'){
   const hasSlot=playerCards.some(x=>!x),hasHand=(typeof handState!=='undefined'&&Array.isArray(handState)&&handState.length>0);
   if(!hasSlot||!hasHand){
     setPhase('ACTION',`TU TURNO ${turnNo} · ACCIÓN`,{force:true});
     if(playerCards.some(Boolean))battleActions.classList.remove('hidden');
   }
 }
 // ENEMY limpia selección residual del turno del jugador.
 if(phase==='ENEMY'){
   v17PendingTarget=-1;
   try{targetbanner?.classList.add('hidden')}catch(e){}
 }
 try{nemesisBossRecover?.()}catch(e){}
}
const nemesisFlowSupervisorTimer=setInterval(()=>{try{nemesisFlowSupervisor()}catch(e){console.warn('flow supervisor',e)}},900);

function spectralKingCombatRecovery(){
 if(!isSpectralKing||phase==='END'||busy)return;
 if(phase==='TARGET'&&!enemyCards.some(Boolean)){
   v172ClosePicker();v171HideAttackConfirm();v17PendingTarget=-1;targetbanner?.classList.add('hidden');
   setPhase('ACTION',`TU TURNO ${turnNo} · ACCIÓN`);
   battleActions.classList.remove('hidden');
   toast('RECUPERACIÓN REAL: ya no hay objetivo rival. Puedes continuar.');
 }
 if(phase==='ACTION'&&playerCards.some(Boolean)){
   battleActions.classList.remove('hidden');
 }
}
const spectralKingRecoveryTimer=setInterval(()=>{try{spectralKingCombatRecovery()}catch(e){console.warn('spectral king recovery',e)}},1000);

function ghostCombatRecovery(){
 if(!isGhostGod||phase==='END'||busy)return;
 const validTarget=phase!=='TARGET'||enemyCards.some(Boolean);
 if(!validTarget){
   v172ClosePicker();v171HideAttackConfirm();v17PendingTarget=-1;
   setPhase('ACTION',`TU TURNO ${turnNo} · ACCIÓN`);
   battleActions.classList.remove('hidden');
   toast('RECUPERACIÓN CELESTIAL: el objetivo ya no existe. Puedes continuar.');
 }
}
const ghostRecoveryTimer=setInterval(()=>{try{ghostCombatRecovery()}catch(e){console.warn('ghost recovery',e)}},1200);


function nemesisBattleInvariantAudit(){
 const errors=[],warnings=[];
 if(!Array.isArray(activeEnemyDeckIds)||!activeEnemyDeckIds.length)errors.push('enemy-deck-empty');
 const missing=activeEnemyDeckIds.filter(id=>!card(id));if(missing.length)errors.push('missing-cards:'+missing.join(','));
 if(enemyMaxHp<=0)errors.push('invalid-boss-hp');
 if(!NEMESIS_PHASES.includes(phase))errors.push('invalid-phase:'+phase);
 if(phase==='ACTION'&&playerCards.some(Boolean)&&battleActions.classList.contains('hidden'))warnings.push('action-controls-hidden');
 if(phase==='TARGET'&&!enemyCards.some(Boolean))warnings.push('target-without-enemy-card');
 const result={boss:duelKey,campaign:bossAdapter.campaign,deck:activeEnemyDeckIds.length,hpMax:enemyMaxHp,phase,errors,warnings,ok:errors.length===0};
 window.__NEMESIS_LAST_BATTLE_AUDIT=result;
 return result
}
window.nemesisBattleInvariantAudit=nemesisBattleInvariantAudit;

skillBtn.onclick=async()=>{if(busy||phase!=='ACTION'||active<0||!playerCards[active])return;if(!hadesCanAct(playerCards[active])){toast('El control del Inframundo bloquea la habilidad.');return}busy=true;try{await revealPlayer(active);if(isGhostGod&&(window.__nemesisGhostEyeCharges||0)>0){window.__nemesisGhostEyeCharges--;toast(`OJO DEL DIOS FANTASMA anula la habilidad de ${playerCards[active].name}.`);pcChainLog(`Ojo del Dios Fantasma anula una habilidad.`);}else await useCreatureSkill('p',active);if(ehpv<=0){if(ghostGodFinalFormSave()){setPhase('ACTION',`TU TURNO ${turnNo} · ACCIÓN`);battleActions.classList.remove('hidden');toast('El Dios Fantasma entra en Forma Celestial Final. Tu turno continúa.');return}if(spectralKingCrownSave()){setPhase('ACTION',`TU TURNO ${turnNo} · ACCIÓN`);battleActions.classList.remove('hidden');toast('La Corona salvó al Rey. Tu turno continúa.');return}return finish(true)};toast(`${playerCards[active].name} puede continuar y atacar.`)}catch(err){console.error('player skill',err);toast('La habilidad se recuperó sin bloquear el duelo.')}finally{busy=false;if(phase!=='END'){setPhase('ACTION',`TU TURNO ${turnNo} · ACCIÓN`);battleActions.classList.remove('hidden')}}};
playerPowerBtn.onclick=async()=>{if(busy||phase!=='ACTION'||active<0||!playerCards[active]||turnNo<playerPowerReadyTurn)return;busy=true;try{const c=playerCards[active];playerPowerReadyTurn=turnNo+2;c.atk+=800;c._playerPowerBonus=(c._playerPowerBonus||0)+800;skillFx('p',active,{name:'IMPULSO NÉMESIS',kind:'attack',value:800,desc:`${state.name} concede +800 ATK durante este turno.`},{name:state.name});toast(`¡${state.name} activa Impulso NÉMESIS! ${c.name} gana +800 ATK.`);update()}finally{busy=false;setPhase('ACTION',`TU TURNO ${turnNo} · ACCIÓN`);battleActions.classList.remove('hidden')}};
atk.onclick=async()=>{if(busy||active<0||!playerCards[active])return;if(isRa&&playerAttackBlockedUntil>=turnNo){toast("Mehen bloquea los ataques durante este turno. Puedes defender para continuar.");return}if(playerCards[active]._petrifiedUntil>=turnNo){toast("Esta criatura está petrificada y no puede atacar este turno.");return}busy=true;try{await guardStep(revealPlayer(active),2200,'revelar carta');if(playerModes[active]==='DEFENSA'){await guardStep(setMode('p',active,'ATAQUE'),2200,'cambiar ataque');toast('Carta cambiada a MODO ATAQUE. Elige una carta rival.')}const targets=enemyCards.map((c,i)=>c?i:-1).filter(i=>i>=0);battleActions.classList.add('hidden');if(!targets.length){const c=playerCards[active];const directDmg=ghostReduceIncomingHpDamage(c.atk,c);await guardStep(attackAnim('p',active,'e',0,c,directDmg),5000,'ataque directo');ehpv-=directDmg;update();await nemesisDmAfterPlayerAttack(c);if(ehpv<=0){if(ghostGodFinalFormSave()){await ghostGodContinueAfterFinalForm();return}if(spectralKingCrownSave()){await spectralKingContinueAfterCrown();return}return finish(true)};if(nemesisDmKeepTurnAfterAttack(c)){setPhase('ACTION',`TU TURNO ${turnNo} · ATAQUE ADICIONAL`,{force:true});battleActions.classList.remove('hidden');busy=false;return}await enemyTurn();return}v171HideAttackConfirm();v17PendingTarget=-1;setPhase('TARGET','ELIGE CARTA RIVAL');targetbanner?.classList.add('hidden');v12TargetCamera(false);await v17Camera('DUEL','p',2);v172OpenPicker();toast('Elige una carta rival en la vista de selección.');}catch(err){console.error('player attack',err);toast('El ataque se recuperó. Puedes continuar.');setPhase('ACTION',`TU TURNO ${turnNo} · ACCIÓN`);battleActions.classList.remove('hidden')}finally{if(phase!=='TARGET'&&phase!=='ENEMY'&&phase!=='END')busy=false;else if(phase==='TARGET')busy=false}}
def.onclick=async()=>{if(busy||active<0)return;if(!hadesCanAct(playerCards[active])){toast('El control del Inframundo impide cambiar de posición.');return}busy=true;try{await guardStep(revealPlayer(active),2200,'revelar defensa');await guardStep(setMode('p',active,'DEFENSA'),2200,'modo defensa');toast('Carta colocada en MODO DEFENSA. Fin del turno.');await enemyTurn()}catch(err){console.error('defense',err);toast('Turno recuperado.');setPhase('ACTION',`TU TURNO ${turnNo} · ACCIÓN`)}finally{busy=false;v181ReturnOverview()}}
fus.onclick=async()=>{if(busy||enAnimacionGSAP)return;if(await dmTryShinyAwakening('p')){toast('FUSIÓN/TRANSFORMACIÓN DUEL MASTER completada.');update();return}const combos=[{m:['dios-jupiter','zeus-emperador-rayo','kronos-devorador-tiempo'],r:'titan-del-olimpo',divine:true},{m:['dragon-carmesi-caos','dragon-abisal-nemesis'],r:'fusion-caotico-supremo'},{m:['dragon-negro-ruinas','dragon-infernal-sangre'],r:'fusion-dragon-caos'}];let found=null;for(const co of combos){const slots=co.m.map(id=>playerCards.findIndex(c=>c&&c.id===id));if(slots.every(i=>i>=0)){found={slots,r:card(co.r),divine:co.divine};break}}if(!found){toast('No tienes una combinación de FUSIÓN válida en la Arena.');return}
if(hadesChainsInterceptFusion(found.slots))return;
if(found.divine){
 const protectedActivation=apoloFusionGuardActive()||olympusFusionGuardCharges>0;
 const allowed=await olympusFusionResponseWindow(protectedActivation);
 if(!allowed&&!protectedActivation){
   if((window.__nemesisGhostEyeCharges||0)>0)window.__nemesisGhostEyeCharges--;
   toast('La FUSIÓN DIVINA fue anulada por la respuesta rival.');return
 }
 if(protectedActivation&&olympusFusionGuardCharges>0)olympusFusionGuardCharges--;
 await olympusFusionUltraCinematic(found.slots,found.r);
}
busy=true;try{battleActions.classList.add('hidden');for(let n=0;n<found.slots.length;n++)await guardStep(revealPlayer(found.slots[n]),2200,`revelar fusión ${n+1}`);const dest=found.slots[0];await guardStep(fusionAnim(found.slots[0],found.slots[1],found.r,dest),7000,'fusión');for(const slot of found.slots){if(slot===dest)continue;nemesisBreakAllEquipment('p',slot);const material=playerCards[slot];if(material)playerGrave.push(material);if(board.p[slot]){scene.remove(board.p[slot]);board.p[slot]=null}playerCards[slot]=null;playerModes[slot]=null}nemesisBreakAllEquipment('p',dest);const firstMaterial=playerCards[dest];if(firstMaterial)playerGrave.push(firstMaterial);playerCards[dest]={...found.r};playerModes[dest]='ATAQUE';if(board.p[dest]){scene.remove(board.p[dest]);board.p[dest]=null}await place('p',dest,playerCards[dest]);await flip('p',dest);await setMode('p',dest,'ATAQUE');active=dest;if(found.divine){await pcCardCinematic('summon','p',dest,playerCards[dest]);toast('¡FUSIÓN DIVINA SUPREMA! Júpiter + Zeus + Kronos → TITÁN DEL OLIMPO.')}else toast(`¡FUSIÓN! ${found.r.name} invocado.`);update();await enemyTurn()}catch(err){console.error('fusion',err);toast('La fusión se recuperó. Puedes continuar.');setPhase('ACTION',`TU TURNO ${turnNo} · ACCIÓN`)}finally{busy=false;v181ReturnOverview()}};

// V18.9.45 — Controles PC: teclado + mouse, reutilizando las acciones existentes.
const pcShortcutHandler=e=>{
 if(phase==='END'||pcResponseOpen)return;const tag=(e.target?.tagName||'').toLowerCase();if(tag==='input'||tag==='select'||tag==='textarea')return;
 const key=e.key.toLowerCase();
 if(key==='f'){e.preventDefault();document.getElementById('pcFullscreen')?.click();return}
 if(key==='escape'){document.getElementById('pcInspector')?.remove();if(phase==='TARGET'){document.querySelector('.v172back')?.click()}return}
 if(['1','2','3','4','5'].includes(key)){
  const idx=Number(key)-1;if(phase==='PLACE'){document.querySelectorAll('#hand img')[idx]?.click();return}
  if(phase==='ACTION'&&playerCards[idx]){active=idx;info(playerCards[idx],idx,'p');battleActions.classList.remove('hidden');focus('p',idx);toast(`Carta ${idx+1}: ${playerCards[idx].name}.`);return}
 }
 if(phase!=='ACTION'||busy)return;
 if(key==='a'){e.preventDefault();atk?.click()}else if(key==='d'){e.preventDefault();def?.click()}else if(key==='h'){e.preventDefault();skillBtn?.click()}else if(key==='n'){e.preventDefault();playerPowerBtn?.click()}else if(key==='g'){e.preventDefault();fus?.click()}
};
addEventListener('keydown',pcShortcutHandler);
const pcShortcutHint=document.createElement('div');pcShortcutHint.className='pc-shortcuts';pcShortcutHint.innerHTML='<b>CONTROLES PC</b><span>1–5 CARTA · A ATACAR · D DEFENDER · H HABILIDAD · N PODER · G FUSIÓN · F FULLSCREEN</span>';document.querySelector('.battle')?.appendChild(pcShortcutHint);
function updatePcEnvironment(now,dt){pcLava.forEach((m,i)=>{m.material.emissiveIntensity=1.15+Math.sin(now*.0018+i)*.3;m.position.z=-2.1+i*.35});pcFloatingRuins.forEach((m,i)=>{m.position.y=m.userData.baseY+Math.sin(now*.00055+i)*.22;m.rotation.y+=dt*(.08+i*.012)});pcTorches.forEach((t,i)=>{t.flame.scale.y=.9+Math.sin(now*.012+i)*.16;t.light.intensity=2.2+Math.sin(now*.01+i)*.55});if(pcSolarRay){pcSolarRay.material.opacity=.16+Math.sin(now*.0012)*.06;pcSolarRay.rotation.z+=dt*.025}}
function updatePcElementSystems(now,dt){for(let i=pcElementSystems.length-1;i>=0;i--){const o=pcElementSystems[i],u=o.userData||{},age=(now-(u.birth||now))/(u.life||900);if(u.kind==='DESTRUCTION_SHARD'){o.position.x+=(u.vx||0)*dt;o.position.y+=(u.vy||0)*dt;o.position.z+=(u.vz||0)*dt;o.rotation.x+=dt*3;o.rotation.y+=dt*2}else{o.rotation.z+=dt*(u.spin||.7);o.scale.setScalar(1+Math.max(0,age)*.5)}if(o.material)o.material.opacity=Math.max(0,1-age)*(u.opacity||.8);if(age>=1){scene.remove(o);if(o.geometry)o.geometry.dispose();pcElementSystems.splice(i,1)}}}
function pcDestructionFx(type,point){const col=pcElementColor(type,0xff7040);const shardCount=isRa?8:14;for(let i=0;i<shardCount;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.07+Math.random()*.16,.07+Math.random()*.16,.07+Math.random()*.16),new THREE.MeshPhysicalMaterial({color:col,emissive:col,emissiveIntensity:1.4,metalness:.5,roughness:.25}));m.position.copy(point);m.userData={kind:'DESTRUCTION_SHARD',birth:performance.now(),life:520+Math.random()*380,vx:(Math.random()-.5)*2.2,vy:Math.random()*2.4,vz:(Math.random()-.5)*1.6,opacity:.9};scene.add(m);pcElementSystems.push(m)}}
function bossRewardPool(duelKey){
 if(duelKey==='hades')return HADES_DECK_IDS.slice();
 if(duelKey==='ares')return ARES_CARDS.map(c=>c.id);
 if(duelKey==='dios-fantasma')return DIOS_FANTASMA_DECK.slice();
 if(duelKey==='rey-espectral')return REY_ESPECTRAL_TEST_DECK.slice();
 if(duelKey==='caballero-almas')return CABALLERO_ALMAS_DECK.slice();
 if(duelKey==='ra')return IRA_RA_BOSS_DECK.slice();
 if(duelKey==='dragon')return DRAGON_OJO_DECK.slice();
 return GUARDIAN_BOSS_CARD_IDS.slice();
}
function grantRandomBossCard(duelKey){
 const unique=[...new Set(bossRewardPool(duelKey))].filter(id=>card(id));
 const remaining=unique.filter(id=>!state.owned.includes(id));
 if(!remaining.length)return null;
 const id=remaining[Math.floor(Math.random()*remaining.length)];
 state.owned=[...new Set([...state.owned,id])];
 return card(id);
}
function finish(win,reason=''){clearInterval(nemesisFlowSupervisorTimer);clearInterval(spectralKingRecoveryTimer);clearInterval(ghostRecoveryTimer);clearInterval(pcMusicTimer);removeEventListener('keydown',pcShortcutHandler);v185HardResetCamera();v172ClosePicker();v171HideAttackConfirm();if(phase==='END')return;
 setPhase('END',win?'VICTORIA':'DERROTA');battleActions.classList.add('hidden');busy=false;document.body.classList.remove('v14-target-turn','v14-player-turn');
 let rewardCard=null;
 if(win){
  const retryReward=nemesisRetryRewardFor(duelKey);
  const starsWon=retryReward?retryReward.reward:100;
  state.stars=(state.stars||0)+starsWon;
  if(retryReward){
   state.retryBattle=null;
  }else if(isHades){state.hadesDefeated=true;state.campaign3Unlocked=true;state.campaign3Started=true;state.campaign3Stage='hades-defeated'}
  else if(isAres){state.aresDefeated=true;state.campaign3Unlocked=true;state.campaign3Started=true;state.campaign3Stage='hades-revealed'}
  else if(isGhostGod){state.diosFantasmaDefeated=true;state.campaign2Stage='complete';state.campaignStage='campaign2-hub';state.campaign3Unlocked=true;state.campaign3Started=true;state.campaign3Stage='ares-intro'}
  else if(isSpectralKing){state.reyEspectralDefeated=true;state.campaign2Stage='dios-fantasma';state.campaignStage='campaign2-hub'}
  else if(isSoulKnight){state.caballeroAlmasDefeated=true;state.campaign2Stage='rey-espectral';state.campaignStage='campaign2-hub'}
  else if(isRa){state.raDefeated=true;state.campaign1Completed=true;state.campaign2Unlocked=true;state.campaign2Started=false;state.campaign2Stage='intro';state.campaignStage='campaign1-complete'}
  else if(isDragon){state.dragonDefeated=true;state.campaignStage='ira-ra'}
  else{state.guardianDefeated=true;state.campaignStage='dragon-ojo-diablo'}
  rewardCard=retryReward?null:grantRandomBossCard(duelKey);
  if(!retryReward&&isRa)nemesisUnlockCampaignDecks('campaign1');
  if(!retryReward&&isGhostGod)nemesisUnlockCampaignDecks('campaign2');
  if(!retryReward&&isHades)nemesisUnlockCampaignDecks('campaign3');
  save();
 }
 state.battlesPlayed=Math.max(0,Math.floor(Number(state.battlesPlayed)||0))+1;
 state.lastBattleResult=win?'VICTORIA':'DERROTA';
 state.lastBattleKey=String(duelKey||'guardian');
 state.lastAutosaveAt=Date.now();
 save();
 let d=document.createElement('div');d.className='result';
 const retryHtml=retryReward?`<div class="retry-win-reward"><b>REVANCHA GANADA</b><span>${retryReward.role} · ★ +${starsWon} ESTRELLAS</span><small>${retryReward.role==='JEFE'?'BONO JEFE · RECOMPENSA DOBLE':'RECOMPENSA GUARDIÁN'}</small></div>`:'';
 const rewardHtml=rewardCard?`<div class="boss-card-reward"><small>CARTA GANADA AL AZAR DEL MAZO RIVAL</small><img src="${rewardCard.img}" alt="${esc(rewardCard.name)}"><b>${esc(rewardCard.name)}</b><span>${cardStats(rewardCard)}</span><em>AGREGADA A MI COLECCIÓN</em></div>`:`<p class="boss-card-reward-complete">Mazo rival ya completado en tu colección.</p>`;
 if(win){
  d.classList.add('guardian-defeat');
  if(isHades)d.innerHTML=`<div class="guardian-defeat-card spectral-victory"><img src="assets/images/campaign3/hades/hades-personaje.png" alt="Hades"><div class="guardian-defeat-dialog"><h2>HADES DERROTADO</h2><p>El Tártaro se cierra.</p><p>★ +100 ESTRELLAS</p>${retryHtml}${rewardHtml}<button class="btn" id="again">VOLVER AL INICIO</button></div></div>`;
  else if(isAres)d.innerHTML=`<div class="guardian-defeat-card"><img src="assets/images/campaign3/ares/ares-personaje.png" alt="Ares"><div class="guardian-defeat-dialog"><h2>ARES DERROTADO</h2><p>La guerra se detiene... y surge una risa desde la oscuridad.</p><p class="dark-warning">HADES TE ESPERA</p><p>★ +100 ESTRELLAS</p>${retryHtml}${rewardHtml}<button class="btn" id="again">CONTINUAR</button></div></div>`;
  else if(isGhostGod)d.innerHTML=`<div class="guardian-defeat-card spectral-victory"><img src="assets/images/dios-fantasma.png" alt="Dios Fantasma"><div class="guardian-defeat-dialog"><h2>DIOS FANTASMA DERROTADO</h2><p>Me vengaré...</p><p class="dark-warning">CAMPAÑA III DESBLOQUEADA</p><p>★ +100 ESTRELLAS</p>${retryHtml}${rewardHtml}<button class="btn" id="again">ENTRAR A CAMPAÑA III</button></div></div>`;
  else if(isSpectralKing)d.innerHTML=`<div class="guardian-defeat-card spectral-victory"><img src="${AS.reyEspectral}" alt="Rey Espectral"><div class="guardian-defeat-dialog"><h2>REY ESPECTRAL DERROTADO</h2><p>La Corona de la Eternidad se rompe y el trono queda en silencio.</p><p class="dark-warning">SIGUIENTE: DIOS FANTASMA</p><p>★ +100 ESTRELLAS</p>${retryHtml}${rewardHtml}<button class="btn" id="again">VOLVER A CAMPAÑA II</button></div></div>`;
  else if(isSoulKnight)d.innerHTML=`<div class="guardian-defeat-card spectral-victory"><img src="${AS.caballeroAlmas}" alt="Caballero de las Almas"><div class="guardian-defeat-dialog"><h2>CABALLERO DE LAS ALMAS DERROTADO</h2><p>Las almas se dispersan y el camino hacia el Rey Espectral queda abierto.</p><p class="dark-warning">SIGUIENTE: REY ESPECTRAL</p><p>★ +100 ESTRELLAS</p>${retryHtml}${rewardHtml}<button class="btn" id="again">VOLVER A CAMPAÑA II</button></div></div>`;
  else if(isRa)d.innerHTML=`<div><h1>CAMPAÑA I COMPLETADA</h1><p>Has derrotado a IRA DE RA y superado el poder del Sol ancestral.</p><p class="dark-warning">CAMPAÑA II DESBLOQUEADA</p><p>★ +100 ESTRELLAS</p><p>La Memory Card guardó tus cartas ganadas, estrellas, colección y mazo.</p>${retryHtml}${rewardHtml}<button class="btn" id="again">VOLVER AL INICIO</button></div>`;
  else if(isDragon)d.innerHTML=`<div class="guardian-defeat-card"><img src="assets/images/dragon-ojo-del-diablo.png" alt="Dragón Ojo del Diablo"><div class="guardian-defeat-dialog"><h2>DRAGÓN OJO DEL DIABLO</h2><p>No soy el más poderoso... ¡JA, JA, JA!</p><p class="dark-warning">IRA DE RA TE ESPERA</p><p>★ +100 ESTRELLAS</p>${retryHtml}${rewardHtml}<button class="btn" id="again">VOLVER AL MENÚ</button></div></div>`;
  else d.innerHTML=`<div class="guardian-defeat-card"><img src="assets/images/guardian-dragones.webp" alt="Guardián de los Dragones"><div class="guardian-defeat-dialog"><h2>GUARDIÁN DE LOS DRAGONES</h2><p>Oh... me mataste.</p><p class="dark-warning">Pero te enfrentarás a la oscuridad.</p><p>★ +100 ESTRELLAS</p><p>Sus cartas quedaron desbloqueadas en INTERCAMBIO NÉMESIS.</p>${retryHtml}${rewardHtml}<button class="btn" id="again">CONTINUAR</button></div></div>`
 }else{const msg=reason||`${enemyDisplayName} te ha derrotado.`;d.innerHTML=`<div><h1>DERROTA</h1><p>${msg}</p><button class="btn" id="again">REINTENTAR</button></div>`}
 app.appendChild(d);if(win&&isDragon)preloadIraRaCinematic();d.querySelector('#again').onclick=()=>{
 if(!win)return battle(duelKey);
 if(isSpectralKing){
  if(typeof window.showDiosFantasmaIntro==='function'){
   window.showDiosFantasmaIntro({
    onWorld:()=>campaign2Hub(),
    onFight:()=>battle('dios-fantasma')
   });
  }else campaign2Hub();
  return;
 }
 if(isHades)return menuScene();
 if(isAres){try{hadesAfterAresCinematic()}catch(e){console.error(e);menuScene()}return}
 if(isGhostGod){state.campaign3Unlocked=true;state.campaign3Started=true;state.campaign3Stage='ares-intro';save();return aresCampaign3Scene()}
 if(isSoulKnight)return campaign2Hub();
 if(isRa)return menuScene();
 if(isDragon)return iraRaScene();
 return dragonOjoScene();
 }
}
let fpsFrames=0,fpsSample=performance.now(),fpsLowSamples=0;let last=performance.now(),pcLastRendered=0;function loop(now){requestAnimationFrame(loop);const cap=Number(pcFpsLimit);if(cap&&now-pcLastRendered<1000/cap)return;pcLastRendered=now;const dt=Math.min(.04,(now-last)/1000);last=now;fpsFrames++;if(now-fpsSample>=1000){const fps=Math.round(fpsFrames*1000/(now-fpsSample)),fpsEl=document.getElementById("graphicsFps"),memEl=document.getElementById('pcGpuMemory');if(fpsEl)fpsEl.textContent=`FPS: ${fps}`;if(memEl){const info=r.info.memory,estimated=Math.round(info.textures*5.5+info.geometries*.35);memEl.textContent=`MEMORIA GRÁFICA APROX.: ${estimated} MB · ${info.textures} TEXTURAS`;}if(fps<38)fpsLowSamples++;else fpsLowSamples=0;if(fpsLowSamples>=4&&localStorage.getItem("nemesis_pc_auto")!=="off"){const next=graphicsMode==="ULTRA"?"ALTA":graphicsMode==="ALTA"?"MEDIA":null;if(next){applyGraphicsProfile(next);toast(`Rendimiento ajustado automáticamente a ${next}.`)}fpsLowSamples=0}fpsFrames=0;fpsSample=now}updatePcEnvironment(now,dt);updatePcElementSystems(now,dt);center.rotation.z+=dt*.22;center2.rotation.z-=dt*.3;portal.rotation.z+=dt*.16;violet.intensity=66+Math.sin(now*.002)*12;red.intensity=58+Math.cos(now*.0023)*10;if(enAnimacionGSAP){
 cam.lookAt(camTargetGSAP);
}else{
 cam.position.lerp(camGoal,.075);
 look.lerp(lookGoal,.1);
 cam.lookAt(look);
}for(let i=tweens.length-1;i>=0;i--){const t=tweens[i],q=Math.min(1,(now-t.start)/t.d),k=q*q*(3-2*q);if(t.kind==='v')t.obj.lerpVectors(t.from,t.to,k);else t.obj[t.k]=t.from+(t.to-t.from)*k;if(q>=1){tweens.splice(i,1);t.res()}}for(let i=particles.length-1;i>=0;i--){const p=particles[i],age=(now-p.userData.birth)/850;p.material.opacity=1-age;p.position.y+=dt*.65;if(age>=1){scene.remove(p);p.geometry.dispose();p.material.dispose();particles.splice(i,1)}}for(const side of ['p','e'])for(let i=0;i<5;i++){const g=board[side]?.[i];Object.values(g?.userData?.equipment||{}).forEach((eq,j)=>{if(eq?.userData?.halo)eq.userData.halo.rotation.z=now*.0012+j;if(eq?.userData?.item)eq.userData.item.position.y=.42+Math.sin(now*.003+j)*.055})}updatePcBonusBadges();pcUpdateEquipmentHud();r.render(scene,cam)}loop(performance.now());addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();r.setSize(innerWidth,innerHeight)});update();busy=true;setPhase('ENEMY',`${enemyDisplayName} PREPARA SU CAMPO`);try{await enemyPlace()}catch(err){console.error('[NÉMESIS] Error preparando campo rival',err);toast('El campo rival se recuperó automáticamente.')}finally{busy=false}if(phpv<=0)return finish(false);setPhase('PLACE','TU TURNO 1 · COLOCAR');hint3d.textContent='Selecciona una carta de tu mano y colócala en un espacio libre.';await v16PlayerTurnCamera();}




window.NEMESIS_GHOST_GOD_AUDIT={
 boss:'dios-fantasma',hp:35000,finalFormHp:5000,
 cards:{
  'df-angel-umbral':'thresholdGuardian: esencia + supervivencia por esencia',
  'df-arcangel-almas':'soulSword: +2 esencia al destruir y bonus con esencia',
  'df-dragon-vacio':'voidBreath: 1200 daño de entrada + segundo ataque por esencia',
  'df-emperador-celestial':'celestialDominion: debuff temporal + defensa espectral',
  'df-serafin-muerte':'eternalSentence: destierro al Vacío tras destruir',
  'df-06':'celestialGate: resurrección celestial potenciada',
  'df-07':'ghostGodEye: anulación de habilidad/mágica/fusión',
  'df-08':'celestialJudgment: destruye amenazas + revive',
  'df-09':'celestialResurrection: revive hasta 2 + curación',
  'df-10':'celestialDecree: fase crítica / control avanzado'
 },
 ai:['bossAiCardScore','bossAiPickQueueIndex','bossAiAttackChoice','ghostSpendEssence'],
 protection:['ghostReduceIncomingHpDamage','ghostGodFinalFormSave','ghostCombatRecovery']
};


window.NEMESIS_SPECTRAL_KING_AUDIT={
 boss:'rey-espectral',hp:25000,crownFinalHp:2500,
 cards:{
  'rey-heredero-trono-muerto':'royalBlood · genera 2 Almas al caer y escala +300 ATK/Alma',
  'rey-general-legion-espectral':'executionOrder · +1000 ATK temporal',
  'rey-devorador-almas-reales':'soulBanquet · consume hasta 3 Almas por +700 ATK permanente',
  'rey-dragon-trono-espectral':'underworldBreath · 1000 daño directo + resurgir por 2 Almas',
  'rey-nigromante-supremo':'royalResurrection · revive la criatura espectral más fuerte',
  'rey-verdugo-corona-maldita':'royalExecution · ejecuta DEF <= 4000 y genera Alma adicional',
  'rey-decreto-del-rey':'royalDecree · consume 6 Almas y revive hasta 2',
  'rey-portal-real-mas-alla':'royalPortal · consume 1 Alma y revive con +1000/+1000',
  'rey-corona-mil-almas':'thousandSoulCrown · +1500 DEF y escala ATK por Almas',
  'rey-espada-sin-muerte':'undyingKingSword · +2000 ATK, genera Almas y bonus con 6'
 },
 systems:['Almas Reales','Cementerio','Resurrección','Equipamiento','Corona de la Eternidad','IA de prioridad','recuperación anti-softlock']
};




window.NEMESIS_MAGO_ROJO_AUDIT=function(){const ids=MAGO_ROJO_DECK_IDS.slice(),cards=ids.map(id=>card(id));return{deck:'MAGO_ROJO',count:ids.length,unique:new Set(ids).size,missing:ids.filter(id=>!card(id)),types:{monster:cards.filter(c=>c?.type==='monster').length,magic:cards.filter(c=>c?.type==='magic').length,trap:cards.filter(c=>c?.type==='trap').length},fusion:!!card('MGR-019'),relic:!!card('MGR-018'),weapon:!!card('MGR-020'),ok:ids.length===20&&new Set(ids).size===20&&ids.every(id=>!!card(id))};};

window.NEMESIS_GUARDIAN_AUDIT=function(){
 const ids=GUARDIAN_BOSS_CARD_IDS.slice();
 const missing=ids.filter(id=>!card(id));
 const duplicates=ids.filter((id,i)=>ids.indexOf(id)!==i);
 return {boss:'guardian',hp:10000,deckCount:ids.length,uniqueCount:new Set(ids).size,missing,duplicates:[...new Set(duplicates)],ok:ids.length===10&&new Set(ids).size===10&&!missing.length};
};

// V19.0 — AUDITORÍA DE RESTAURACIÓN ESTABLE
window.NEMESIS_V19_AUDIT=function(){
 const bossIds=['guardian','dragon','ra','caballero-almas','rey-espectral','dios-fantasma','ares','hades'];
 const bosses={};
 for(const id of bossIds){
   const r=window.NEMESIS_BOSS_REGISTRY?.[id];
   const deck=Array.isArray(r?.deck)?r.deck:[];
   bosses[id]={hp:r?.hp||0,deckCount:deck.length,missing:deck.filter(cid=>{
     try{
       const all=(typeof CARDS!=='undefined'&&Array.isArray(CARDS))?CARDS:[];
       return !all.some(c=>c&&c.id===cid);
     }catch(e){return false}
   })};
 }
 const result={
   version:'19.0',
   bosses,
   phaseGuard:typeof setPhase==='function',
   flowSupervisor:typeof nemesisFlowSupervisor==='function',
   collection:!!window.NEMESIS_COLLECTION,
   campaigns:!!window.NEMESIS_CAMPAIGN_PROFILES,
   olympo:typeof OLIMPO_DECK_IDS!=='undefined',
   hades:typeof HADES_DECK_IDS!=='undefined',
   ok:Object.values(bosses).every(b=>b.hp>0&&b.deckCount>0&&!b.missing.length)
 };
 console.info('[NÉMESIS V19 AUDIT]',result);
 return result;
};

// V18.9.73 — PUENTE SEGURO MÓDULO ↔ SCRIPTS DE CAMPAÑA
window.battle=battle;
window.menuScene=menuScene;
window.continueCampaign=continueCampaign;
window.campaign2Hub=campaign2Hub;
window.aresCampaign3Scene=aresCampaign3Scene;
window.hadesAfterAresCinematic=hadesAfterAresCinematic;


const NEMESIS_EFFECT_ROUTING=Object.freeze({
 etherealForm:'GENERIC_CREATURE_SKILL_AND_COMBAT',
 mortalHarvest:'GENERIC_CREATURE_SKILL_AND_KILL_ENGINE',
 beyondCall:'GENERIC_CREATURE_SKILL_AND_GRAVE_ENGINE',
 abyssDragon:'GENERIC_CREATURE_SKILL_AND_SPECTRAL_ENGINE',
 aresConqueror:'CUSTOM_SKILL_BY_CARD_ID',
 apoloSolarGuardian:'APOLO_SPECIAL_ENGINE',
 hadesDeepSleep:'HADES_MODO_DIOS_II',
 hadesGuiltWhip:'HADES_MODO_DIOS_II',
 hadesThresholdWatch:'HADES_MODO_DIOS_II'
});
window.NEMESIS_EFFECT_ROUTING=NEMESIS_EFFECT_ROUTING;


window.NEMESIS_ARCHITECTURE_RULES=Object.freeze({
 sharedCore:['turn-state','damage','graveyard','equipment','responses','fusion','heroic-battlefield','memory-card','global-collection'],
 isolatedCampaigns:['campaign1','campaign2','campaign3'],
 rule:'Una campaña nueva crea perfiles/adaptadores nuevos. No modifica IA, fases, mazos, recursos ni efectos privados de campañas anteriores.',
 inventory:'Al completar una campaña, los mazos de sus jefes pasan a la Colección Global y pueden usarse en mazos personales sin alterar los mazos enemigos originales.',
 savedDecks:true,deckLimit:11
});

// V18.9.72 — REGISTRO CENTRAL Y AUTOAUDITORÍA
window.NEMESIS_CORE_VERSION='19.2.8';
window.NEMESIS_MAGO_ROJO_VERSION='1.0.0';
window.NEMESIS_BOSS_REGISTRY={
 guardian:{hp:10000,deck:GUARDIAN_BOSS_CARD_IDS.slice()},
 dragon:{hp:12000,deck:DRAGON_OJO_DECK.slice()},
 ra:{hp:15000,deck:IRA_RA_BOSS_DECK.slice()},
 'caballero-almas':{hp:18000,deck:CABALLERO_ALMAS_DECK.slice()},
 'rey-espectral':{hp:25000,deck:REY_ESPECTRAL_TEST_DECK.slice()},
 'dios-fantasma':{hp:35000,deck:DIOS_FANTASMA_DECK.slice()},
 ares:{hp:30000,deck:ARES_CARDS.map(c=>c.id)},
 hades:{hp:32000,deck:HADES_DECK_IDS.slice()}
};
window.nemesisIntegrityAudit=function(){
 const ids=CARDS.map(c=>c.id),dup=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))],bosses={};
 for(const [id,b] of Object.entries(window.NEMESIS_BOSS_REGISTRY)){const missing=b.deck.filter(x=>!card(x));bosses[id]={hp:b.hp,count:b.deck.length,missing,ok:!missing.length}}
 const specialEffects=Object.keys(window.NEMESIS_EFFECT_ROUTING||{}),unrouted=specialEffects.filter(e=>!(window.NEMESIS_EFFECT_ROUTING||{})[e]);
 const campaigns={
  c1:['guardian','dragon','ra'].every(x=>bosses[x]?.ok),
  c2:['caballero-almas','rey-espectral','dios-fantasma'].every(x=>bosses[x]?.ok),
  c3:['ares','hades'].every(x=>bosses[x]?.ok)
 };
 const result={version:window.NEMESIS_CORE_VERSION,totalCards:CARDS.length,duplicateIds:dup,bosses,campaigns,specialEffects:{count:specialEffects.length,unrouted},memory:{deck:state.deck.length,owned:state.owned.length,campaign3Stage:state.campaign3Stage},bridges:{battle:typeof window.battle==='function',menu:typeof window.menuScene==='function'},architecture:{centralPhaseGuard:true,bossRegistry:true,bossAdapters:true,flowSupervisor:true,campaignProfiles:!!window.NEMESIS_CAMPAIGN_PROFILES,globalCollection:!!window.NEMESIS_COLLECTION,savedDecks:!!state.savedDecks},ok:!dup.length&&!unrouted.length&&Object.values(bosses).every(x=>x.ok)&&Object.values(campaigns).every(Boolean)};
 console.info('[NÉMESIS INTEGRITY]',result);return result
};
setTimeout(()=>window.nemesisIntegrityAudit(),250);

nemesisMigrateCompletedCampaignRewards();
if(typeof state!=='undefined'&&state){
 nemesisEnsureSanctuary();
 if(state.hadesDefeated)state.sanctuary.awake=true;
 save();
}

title();

document.addEventListener('dblclick',(e)=>{const el=e.target.closest?.('.card3d,.hand-card,.card');if(!el)return;let idx=Number(el.dataset?.index);let side=el.dataset?.side;if(Number.isInteger(idx)){let c=side==='e'?enemyCards?.[idx]:playerCards?.[idx];if(c)v15Inspect(c)}});

let v17ResizeTimer=0;
addEventListener('resize',()=>{clearTimeout(v17ResizeTimer);v17ResizeTimer=setTimeout(()=>{if(typeof cam!=='undefined'&&cam&&phase!=='TARGET'&&!busy)v17Camera(phase==='PLACE'?'HAND':'DUEL','p',2)},220)});

let v182Resize=0;
addEventListener('resize',()=>{clearTimeout(v182Resize);v182Resize=setTimeout(()=>{if(typeof cam!=='undefined'&&cam&&!busy&&phase!=='TARGET')v182Base()},260)});


addEventListener('orientationchange',()=>{
 setTimeout(()=>{
  try{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);v185HardResetCamera()}catch(e){}
 },220)
});


// V18.9.60 — FIX VISUAL CABALLERO DE LAS ALMAS
// Mantiene el fondo cinematográfico separado y fuerza el PNG transparente correcto del personaje.
window.NEMESIS_CABALLERO_ALMAS_ASSETS = Object.freeze({
  character: 'assets/images/caballero-de-las-almas.png',
  background: 'assets/images/reino-espectral-cinematico.png'
});

window.NEMESIS_APOLO={
 sanctuary:{turns:2,blockDirectHpDamage:true},
 callOfGods:{oncePerDuel:true,targets:['dios-jupiter','zeus-emperador-rayo','kronos-devorador-tiempo']},
 fusionGuard:{whileOnField:true,targets:['dios-jupiter','zeus-emperador-rayo','kronos-devorador-tiempo'],protectHandDeckToGrave:true},
 lastRadiance:{turns:1,protectFusionComponents:true}
};
window.nemesisApoloMissingOlympian=function(deck=[],hand=[],field=[]){
 const present=new Set([...hand,...field].map(x=>typeof x==='string'?x:x?.id));
 return NEMESIS_APOLO.callOfGods.targets.find(id=>!present.has(id)&&deck.some(x=>(typeof x==='string'?x:x?.id)===id))||null;
};
window.nemesisApoloEpicEntry=function(){
 const d=document.createElement('div');d.id='nemesis-apolo-cinematic';
 d.innerHTML='<div class="apolo-sun"></div><div class="apolo-title">APOLO<small>GUARDIÁN SOLAR DEL OLIMPO</small></div>';
 document.body.appendChild(d);requestAnimationFrame(()=>d.classList.add('impact'));setTimeout(()=>d.remove(),2700);
};

// V18.9.63: Campaign III unlock is handled by campaign3-ares.js via existing campaign3Unlocked progress flag.


// V19.2.7 — COLECCIÓN EXTERNA 33 CARTAS
(function(){
  try{
    const ext=Array.isArray(window.NEMESIS_EXTERNAL_COLLECTION_33)?window.NEMESIS_EXTERNAL_COLLECTION_33:[];
    window.NEMESIS_EXTERNAL_COLLECTION=ext.slice();
    window.NEMESIS_EXTERNAL_COLLECTION_INDEX=Object.fromEntries(ext.map(c=>[c.id,c]));
    if(window.NEMESIS_COLLECTION&&typeof window.NEMESIS_COLLECTION==='object'){
      window.NEMESIS_COLLECTION.externalCards=ext.map(c=>c.id);
      window.NEMESIS_COLLECTION.externalCount=ext.length;
    }
  }catch(e){console.warn('[NÉMESIS colección externa]',e)}
})();


window.nemesisExternal33Audit=function(){
 const ext=(typeof EXTERNAL_GAME_CARDS!=='undefined'?EXTERNAL_GAME_CARDS:[]);
 const dm=typeof NEMESIS_DUEL_MASTER_IDS!=='undefined'?NEMESIS_DUEL_MASTER_IDS:[];
 const pub=typeof NEMESIS_PUBLIC_23_IDS!=='undefined'?NEMESIS_PUBLIC_23_IDS:[];
 return {
  version:window.NEMESIS_CORE_VERSION,
  total:ext.length,unique:new Set(ext.map(c=>c.id)).size,
  public23:pub.length,duelMaster10:dm.length,
  allInCards:ext.every(x=>!!card(x.id)),
  allOwned:ext.every(x=>state.owned.includes(x.id)),
  olympoDeck:Array.isArray(state.savedDecks?.OLIMPO)?state.savedDecks.OLIMPO.length:0,
  duelMasterDeck:Array.isArray(state.savedDecks?.DUEL_MASTER)?state.savedDecks.DUEL_MASTER.length:0,
  handlers:ext.filter(x=>x.type==='monster').every(x=>!!skillFor(x))&&ext.filter(x=>x.type!=='monster').every(x=>x.externalCard),
  ok:ext.length===33&&new Set(ext.map(c=>c.id)).size===33&&pub.length===23&&dm.length===10&&ext.every(x=>!!card(x.id))&&state.savedDecks?.DUEL_MASTER?.length===10
 }
};
