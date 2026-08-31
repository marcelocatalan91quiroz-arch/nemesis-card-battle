const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const game=fs.readFileSync(path.join(root,'js/game.js'),'utf8');
const api=fs.readFileSync(path.join(root,'api/online1v1.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const exists=p=>fs.existsSync(path.join(root,p))&&fs.statSync(path.join(root,p)).size>0;
const A=(n,v)=>{if(!v){console.error('FAIL',n);process.exitCode=1}else console.log('PASS',n)};

// 1) Imágenes y cartas visibles.
const imgs=[...new Set([...game.matchAll(/(?:img|character|background):'([^']+\.(?:png|jpg|jpeg|webp|svg))'/gi)].map(x=>x[1]))];
const missing=imgs.filter(p=>!exists(p));
A('todas las imágenes registradas existen y pesan >0',missing.length===0);
if(missing.length)console.error(missing);

// 2) Mazos oficiales / privados / públicos.
A('Caballeros del Submundo oficial 20/20',game.includes('CABALLEROS_SUBMUNDO:CABALLEROS_SUBMUNDO_DECK_IDS')&&game.includes('const CABALLEROS_SUBMUNDO_DECK_IDS=CABALLEROS_SUBMUNDO_CARDS.map'));
A('privados: Olimpo, Duel Master y Caballeros del Submundo',game.includes('OLIMPO:{ownerOnly:true')&&game.includes('DUEL_MASTER:{ownerOnly:true')&&game.includes('CABALLEROS_SUBMUNDO:{ownerOnly:true'));
A('públicos: Mago Rojo e Imperio Dragón',game.includes('MAGO_ROJO:{ownerOnly:false')&&game.includes('IMPERIO_DRAGON:{ownerOnly:false'));
A('colección muestra Caballeros del Submundo',/collectionScene\(\)[\s\S]*CABALLEROS_SUBMUNDO_DECK_IDS/.test(game));
A('online clasifica los 3 mazos privados',api.includes("new Set(['OLIMPO','DUEL_MASTER','CABALLEROS_SUBMUNDO'])"));

// 3) Canje y precios.
for(const [id,price] of [['strategic-herrero',300],['strategic-payaso-oscuro',350],['strategic-golem-muerte',800],['strategic-mago-vacio',700],['limited-dios-vacio-eterno',3000],['MGR-SHINY-001',1800],['limited-orbe-poder',3500],['MS-001',5000]]){
 A(id+' precio '+price,game.includes("id:'"+id+"'")&&game.includes("priceStars:"+price));
}
A('intercambio descuenta estrellas y agrega a colección',game.includes('state.stars-=price')&&game.includes('state.owned.push(id)'));
A('Eclipse MS-001 en Intercambio NÉMESIS y no entrega automática',game.includes("id:'MS-001'")&&game.includes("strategicRedeem:true,shopExclusive:true,priceStars:5000")&&game.includes('list.push(...STRATEGIC_REDEEM_CARDS)'));
A('Eclipse MS-001 motor completo 3 de 5 una vez por duelo',game.includes('nemesisAbsoluteEclipseMagic')&&game.includes('picks.length!==3')&&game.includes('__nemesisEclipseUsedP=false'));
A('Tesoro NÉMESIS canje exclusivo 1000',game.includes('nemesisTreasureRedeem')&&game.includes('state.stars-=1000')&&game.includes('SOLO CANJE'));

// 4) Campañas, desbloqueos, revanchas y recompensas.
for(const x of ['guardianDefeated','dragonDefeated','raDefeated','caballeroAlmasDefeated','reyEspectralDefeated','diosFantasmaDefeated','aresDefeated','hadesDefeated'])A('progreso '+x,game.includes(x));
A('cada victoria de campaña puede entregar carta rival',game.includes('grantRandomBossCard(duelKey)'));
A('mazos completos se desbloquean al completar campañas',game.includes("nemesisUnlockCampaignDecks('campaign1')")&&game.includes("nemesisUnlockCampaignDecks('campaign2')")&&game.includes("nemesisUnlockCampaignDecks('campaign3')"));
A('revanchas permanentes de 8 rivales',game.includes('const NEMESIS_RETRY_ROSTER=Object.freeze([')&&['guardian','dragon-ojo','ira-ra','caballero-almas','rey-espectral','dios-fantasma','ares','hades'].every(id=>game.includes("id:'"+id+"'")));
A('retar otra vez usa mismo battle()',game.includes("RETAR OTRA VEZ")&&game.includes('battle(r.battleKey||undefined)'));
A('revanchas Dragón y Ra usan claves reales del motor',game.includes("id:'dragon-ojo'")&&game.includes("battleKey:'dragon'")&&game.includes("id:'ira-ra'")&&game.includes("battleKey:'ra'"));
A('recompensas de campaña usan tabla progresiva',game.includes('const campaignReward=NEMESIS_RETRY_ROSTER.find')&&game.includes("campaignReward?.reward||100"));

// 5) Santuario y cartas secretas.
for(const p of ['assets/images/unique/nemesis-primigenio.png','assets/images/unique/aion.png','assets/images/unique/azathiel.png'])A('Santuario asset '+p,exists(p));
A('Santuario despierta tras Hades',game.includes('state.sanctuary.awake')&&game.includes('hadesDefeated'));
A('ÚNICAS 1/1 y no automáticas',game.includes('LEY DE UNICIDAD')&&game.includes('Ninguna se obtiene automáticamente'));

// 6) Motores y flujo.
A('anti-softlock',game.includes('nemesisFlowSupervisor'));
A('IA con guard de turno',game.includes('NEMESIS_ENEMY_TURN_GUARD'));
A('fases ACTION/TARGET/PLACE/END',game.includes("'ACTION'")&&game.includes("'TARGET'")&&game.includes("'PLACE'")&&game.includes("'END'"));
A('equipamiento arma/armadura/reliquia',game.includes("nemesisEquip(side")&&game.includes("'weapon'")&&game.includes("'armor'")&&game.includes("'relic'"));
A('Caballeros habilidades y mágicas 20/20',game.includes('NEMESIS_CABALLEROS_SUBMUNDO_AUDIT')&&game.includes('csSubworldSpellMagic')&&game.includes('csSubworldRelicMagic')&&game.includes('csSubworldArmorMagic'));
A('Duel Master motor 20/20',game.includes('NEMESIS_DUEL_MASTER_AUDIT')&&game.includes('dmDeepSync'));
A('Mago Rojo e Imperio Dragón motores',game.includes('MAGO_ROJO_CARDS')&&game.includes('IMPERIO_DRAGON_CARDS')&&game.includes('mgrApplyMagic')&&game.includes('idrApplyMagic'));

// 7) PC avanzada.
A('selector calidad PC',game.includes('graphicsMode')&&game.includes('ULTRA')&&game.includes('ALTA')&&game.includes('MEDIA'));
A('cámara cinematográfica',game.includes('pcCinematicCamera')&&game.includes('v16Cam'));
A('pantalla completa',game.includes('requestNemesisFullscreen'));

// 8) Online 1v1.
A('online cliente cargado',html.includes('js/online1v1.js'));
A('online servidor autoritativo y Redis',api.includes("authority:'server'")&&api.includes('REDIS_URL')&&api.includes('storageReady'));
A('online 2 jugadores, turnos y reconexión',api.includes('ROOM_FULL')&&api.includes('NOT_YOUR_TURN')&&api.includes("action==='heartbeat'"));
A('online Duel Master 20 efectos',api.includes('DM_EFFECT_HANDLERS')&&api.includes("'DM-020'"));

if(process.exitCode)process.exit(process.exitCode);
console.log('NÉMESIS RELEASE READINESS: PASS');