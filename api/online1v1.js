const crypto=require('crypto');
const ownerAuth=require('../lib/owner-auth');
const ownerAuthReady=()=>ownerAuth.ready();
const verifyOwnerToken=token=>ownerAuth.verifyToken(token);


const ROOM_TTL_MS=1000*60*60*2;
const MEMORY=globalThis.__NEMESIS_ONLINE_ROOMS||(globalThis.__NEMESIS_ONLINE_ROOMS=new Map());
const REDIS_URL=process.env.REDIS_URL||'';
const REST_URL=process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL||'';
const REST_TOKEN=process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN||'';

const hasRedisCloud=()=>Boolean(REDIS_URL);
const hasRestKv=()=>Boolean(REST_URL&&REST_TOKEN);
const hasPersistentStorage=()=>hasRedisCloud()||hasRestKv();
const isProduction=()=>process.env.VERCEL_ENV==='production'||process.env.NODE_ENV==='production';
const storageMode=()=>hasRedisCloud()?'REDIS_CLOUD':hasRestKv()?'REST_KV':isProduction()?'PERSISTENCE_REQUIRED':'FLUID_MEMORY_DEV';
const storageReady=()=>hasPersistentStorage()||!isProduction();
const now=()=>Date.now();
const code=()=>Array.from({length:6},()=> 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[crypto.randomInt(0,32)]).join('');
const id=(n=18)=>crypto.randomBytes(n).toString('base64url');
const cleanName=v=>String(v||'Jugador').replace(/[<>]/g,'').trim().slice(0,24)||'Jugador';
const roomKey=c=>'nemesis:online1v1:'+c;
const tokenHash=token=>crypto.createHash('sha256').update(String(token||'')).digest('hex');

const DM_CATALOG={
 'DM-001':{name:'El Gran Zeus — Soberano del Juicio',kind:'MONSTER',atk:20000,def:18000,energy:12,tags:['DIVINA','RAYO'],abilities:['Dominio Celestial','Cadena del Trueno','Escudo del Olimpo','Mirada de Zeus','Ley Suprema'],ultimate:'Juicio de los Cielos',img:'assets/images/external33/dm-001.svg'},
 'DM-002':{name:'Dragón Dorado — Emperador Celestial',kind:'MONSTER',atk:20000,def:18000,energy:12,tags:['DRAGON','DIVINA','LUZ'],abilities:['Cometa Dorado','Resplandor Celestial','Escamas de Inmortalidad','Devorador de Dioses'],ultimate:'Ira del Emperador Dorado',img:'assets/images/external33/dm-002.svg'},
 'DM-003':{name:'Oráculo de Delfos — La Visión Inevitable',kind:'MONSTER',atk:12000,def:11000,energy:8,tags:['DIVINA','TIEMPO'],abilities:['Lectura del Destino','Eco del Futuro','Paradoja Divina','Ciclo de Apolo'],ultimate:'Visión Inevitable',img:'assets/images/external33/dm-003.svg'},
 'DM-004':{name:'Thor — Heredero de la Tormenta',kind:'MONSTER',atk:15000,def:13000,energy:10,tags:['DIVINA','GUERRERO','RAYO'],abilities:['Golpe del Trueno','Lanzamiento de Mjölnir','Furia Asgardiana','Protector de los Dioses'],ultimate:'Ragnarök del Trueno',img:'assets/images/external33/dm-004.svg'},
 'DM-005':{name:'Orígenes — Antes del Primer Dios',kind:'SUPPORT',supportType:'MAGIC_CONTINUOUS',atk:0,def:0,img:'assets/images/external33/dm-005.svg'},
 'DM-006':{name:'Cacería de Demonios — Sentencia del Cazador',kind:'SUPPORT',supportType:'TRAP_RESPONSE',atk:0,def:0,img:'assets/images/external33/dm-006.svg'},
 'DM-007':{name:'Quetzalcóatl — Serpiente del Cielo Eterno',kind:'MONSTER',atk:13000,def:12000,energy:10,tags:['DRAGON','DIVINA','LUZ','VIENTO'],abilities:['Ascensión Celestial','Retorno del Eterno','Vientos Renovadores','Torbellino Sagrado'],ultimate:'Pluma de la Eternidad',img:'assets/images/external33/dm-007.svg'},
 'DM-008':{name:'Moctezuma — Emperador del Último Sol',kind:'MONSTER',atk:12500,def:10500,energy:9,tags:['DIVINA','FUEGO','GUERRERO'],abilities:['Estratega Supremo','Ofrenda de Guerra','Sol Naciente','Último Tlatoani'],ultimate:'Eclipse del Quinto Sol',img:'assets/images/external33/dm-008.svg'},
 'DM-009':{name:'La Tirana — Reina del Pacto Oscuro',kind:'MONSTER',atk:0,def:0,energy:12,tags:['OSCURIDAD','ESPIRITU'],abilities:['Usurpación Arcana','Pacto de Sombras','Dominio del Cementerio','Retribución Oscura'],ultimate:'Pacto de la Tirana Suprema',img:'assets/images/external33/dm-009.svg'},
 'DM-010':{name:'Onkolxón — Espíritu del Fin Austral',kind:'MONSTER',atk:0,def:0,energy:14,tags:['ESPIRITU','HIELO','OSCURIDAD'],abilities:['Respiro del Abismo','Nevada de Destinos','Llamado del Vacío','Ciclo del Deshielo'],ultimate:'Aurora del Fin Austral',img:'assets/images/external33/dm-010.svg'},
 'DM-011':{name:'Alma de Afrodita',kind:'MONSTER',atk:8500,def:12000,energy:0,tags:['DIVINA','ESPIRITU'],abilities:['Seducción del Alma','Vínculo de Afrodita','Corazón Cautivo'],ultimate:null,img:'assets/images/external33/dm-011.svg'},
 'DM-012':{name:'Medusa',kind:'MONSTER',atk:9000,def:10500,energy:0,tags:['MITO','PIEDRA'],abilities:['Mirada Petrificante','Reflejo de Gorgona','Galería de Piedra'],ultimate:null,img:'assets/images/external33/dm-012.svg'},
 'DM-013':{name:'Arma del Tártaro',kind:'SUPPORT',supportType:'WEAPON',atk:0,def:0,img:'assets/images/external33/dm-013.svg'},
 'DM-014':{name:'Antorcha del Olimpo',kind:'SUPPORT',supportType:'RELIC',atk:0,def:0,img:'assets/images/external33/dm-014.svg'},
 'DM-015':{name:'Martillo de Thor',kind:'SUPPORT',supportType:'WEAPON',atk:0,def:0,img:'assets/images/external33/dm-015.svg'},
 'DM-016':{name:'Corona del Dominio',kind:'SUPPORT',supportType:'RELIC',atk:0,def:0,img:'assets/images/external33/dm-016.svg'},
 'DM-017':{name:'Arma Santa',kind:'SUPPORT',supportType:'WEAPON',atk:0,def:0,img:'assets/images/external33/dm-017.svg'},
 'DM-018':{name:'Thor Shiny — Señor de la Tormenta Eterna',kind:'MONSTER',atk:6000,def:4500,energy:6,tags:['DIVINA','GUERRERO','RAYO','SHINY'],abilities:['Trueno Eterno','Ira del Asgard','Protector de los Nueve Reinos','Golpe del Bifröst'],ultimate:null,img:'assets/images/external33/dm-018.svg'},
 'DM-019':{name:'El Juicio de los Titanes',kind:'SUPPORT',supportType:'TRAP_RESPONSE',atk:0,def:0,img:'assets/images/external33/dm-019.svg'},
 'DM-020':{name:'Eclipse de los Reinos',kind:'SUPPORT',supportType:'MAGIC',atk:0,def:0,img:'assets/images/external33/dm-020.svg'}
};
const DM_DECK=Object.keys(DM_CATALOG);
const MGR_DATA=require('../data/mago_rojo_deck_v1.json');
const IDR_DATA=require('../data/imperio_dragon_deck_v1.json');
function normalizeDeckCard(c,deckName){
 const type=String(c.tipo||'').toUpperCase();
 const monster=type==='CRIATURA'||type==='FUSION'||type==='TRANSFORMACION';
 const supportType=type==='ARMA'?'WEAPON':type==='RELIQUIA'?'RELIC':type.includes('TRAMPA')?'TRAP_RESPONSE':'MAGIC';
 return {
  name:c.nombre||c.id,kind:monster?'MONSTER':'SUPPORT',supportType:monster?null:supportType,
  atk:Number(c.atk||0),def:Number(c.def||0),energy:0,tags:[...(c.afinidades||[]),...(c.arquetipos||[])].map(x=>String(x).toUpperCase()),
  abilities:monster&&c.habilidad?[String(c.habilidad)]:[],ultimate:null,img:c.img_game||c.img,deckName,
  specialOnly:(deckName==='IMPERIO_DRAGON'&&['IDR-009','IDR-010','IDR-019','IDR-020'].includes(c.id))||(deckName==='MAGO_ROJO'&&c.id==='MGR-019')
 };
}
const MGR_CATALOG=Object.fromEntries(MGR_DATA.cards.map(c=>[c.id,normalizeDeckCard(c,'MAGO_ROJO')]));
const IDR_CATALOG=Object.fromEntries(IDR_DATA.cards.map(c=>[c.id,normalizeDeckCard(c,'IMPERIO_DRAGON')]));
const MGR_DECK=MGR_DATA.deck_ids.slice();
const IDR_DECK=IDR_DATA.deck_ids.slice();
const ALL_ONLINE_CATALOG=Object.freeze({...DM_CATALOG,...MGR_CATALOG,...IDR_CATALOG});
const ONLINE_DECK_IDS=Object.freeze({DUEL_MASTER:DM_DECK,MAGO_ROJO:MGR_DECK,IMPERIO_DRAGON:IDR_DECK});
function catalogCard(id){return ALL_ONLINE_CATALOG[id]||null}
function canonicalOnlineDeck(name){
 name=cleanDeckName(name);
 if(name==='MAGO_ROJO'||name==='IMPERIO_DRAGON'||name==='DUEL_MASTER')return name;
 return 'DUEL_MASTER'
}

const DM_START_HP=30000;
// El núcleo conserva el motor Duel Master existente. El mazo elegido se registra de forma
// autoritativa por jugador para que los motores Mago Rojo / Imperio Dragón puedan enchufarse
// sin cambiar salas, Redis, sincronización ni protocolo.
const PUBLIC_DECKS=new Set(['MAGO_ROJO','IMPERIO_DRAGON']);
const OWNER_DECKS=new Set(['OLIMPO','DUEL_MASTER','CABALLEROS_SUBMUNDO']);
function cleanDeckName(v){return String(v||'').trim().toUpperCase().replaceAll(' ','_').replace('DRAGÓN','DRAGON').slice(0,40)}
function cleanDeckIds(v){return [...new Set((Array.isArray(v)?v:[]).map(x=>String(x||'').trim()).filter(Boolean))].slice(0,40)}
function playerDeckMeta(b,req){
 let deckName=cleanDeckName(b.deckName),owner=ownerAuth.verifyRequest(req)||(!isProduction()&&verifyOwnerToken(b.ownerToken));
 if(OWNER_DECKS.has(deckName)&&!owner)return {error:'OWNER_AUTH_REQUIRED',deckName,deckIds:[],deckClass:'OWNER'};
 if(!ONLINE_DECK_IDS[deckName]){
  if(OWNER_DECKS.has(deckName))return {error:'ONLINE_DECK_ENGINE_PENDING',deckName,deckIds:[],deckClass:'OWNER'};
  deckName='MAGO_ROJO'
 }
 const official=ONLINE_DECK_IDS[deckName].slice(),allowed=new Set(official),requested=cleanDeckIds(b.deckIds);
 if(requested.some(id=>!allowed.has(id)))return {error:'ONLINE_DECK_INVALID_CARD',deckName,deckIds:[],deckClass:OWNER_DECKS.has(deckName)?'OWNER':'PUBLIC'};
 const deckIds=(requested.length?requested:official).slice(0,official.length);
 if(!deckIds.length)return {error:'ONLINE_DECK_EMPTY',deckName,deckIds:[],deckClass:OWNER_DECKS.has(deckName)?'OWNER':'PUBLIC'};
 return {deckName,deckIds,deckClass:OWNER_DECKS.has(deckName)?'OWNER':'PUBLIC',ownerAuthenticated:owner}
}

const DM_EFFECT_HANDLERS=Object.freeze(Object.fromEntries(DM_DECK.map(id=>[id,true])));
const ONLINE_EFFECT_HANDLERS=Object.freeze({
 DUEL_MASTER:Object.freeze(Object.fromEntries(DM_DECK.map(id=>[id,true]))),
 MAGO_ROJO:Object.freeze(Object.fromEntries(MGR_DECK.map(id=>[id,true]))),
 IMPERIO_DRAGON:Object.freeze(Object.fromEntries(IDR_DECK.map(id=>[id,true])))
});
function onlineEngineAudit(){return Object.fromEntries(Object.entries(ONLINE_EFFECT_HANDLERS).map(([deck,h])=>[deck,{count:Object.keys(h).length,all:Object.values(h).every(Boolean),ids:Object.keys(h)}]))}

function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=crypto.randomInt(0,i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function initOnlinePlayer(meta,seat){
 const deckName=canonicalOnlineDeck(meta?.deckName),deck=shuffle((Array.isArray(meta?.deckIds)&&meta.deckIds.length?meta.deckIds:(ONLINE_DECK_IDS[deckName]||DM_DECK)).slice()),hand=deck.splice(0,5);
 return {seat,deckName,hp:DM_START_HP,deck,hand,monsters:Array(5).fill(null),supports:Array(5).fill(null),grave:[],banished:[],cardState:{},attacked:[],summonedThisTurn:false,effectLockUntil:0,originsUntil:0,titanShieldUntil:0,archetype:{seals:0,flames:0,magicUses:0,sky:false}};
}
function initDmPlayer(seat){return initOnlinePlayer({deckName:'DUEL_MASTER'},seat)}
function initMonsterState(id){const c=catalogCard(id);return {energy:Number(c?.energy||0),uses:0,ultimateUsed:false,charges:0,solar:0,pact:0,austral:0,marks:0,fieldTurns:0,atkMod:0,defMod:0,equipment:{weapon:null,relic:null},flags:{}}}
function initDuel(room){
 if(room.duel)return;
 const host=room.players.find(x=>x.seat==='HOST'),guest=room.players.find(x=>x.seat==='GUEST');
 room.duel={mode:'MULTI_DECK',turn:1,activeSeat:'HOST',phase:'MAIN',winnerSeat:null,players:{HOST:initOnlinePlayer(host,'HOST'),GUEST:initOnlinePlayer(guest,'GUEST')},log:[]};
 pushEvent(room,'MULTIDECK_BOARD_READY','SYSTEM',{decks:{HOST:host?.deckName,GUEST:guest?.deckName},deckSize:20,zones:{monsters:5,supports:5},effects:{DUEL_MASTER:20,MAGO_ROJO:20,IMPERIO_DRAGON:20}});
}
function duelPlayer(room,seat){return room.duel?.players?.[seat]||null}
function duelOpponentSeat(seat){return seat==='HOST'?'GUEST':'HOST'}
function monsterState(p,zone){if(!p.cardState[zone])p.cardState[zone]=initMonsterState(p.monsters[zone]);return p.cardState[zone]}
function cardPublic(id){const c=catalogCard(id);return c?{id,name:c.name,kind:c.kind,atk:c.atk,def:c.def,energy:c.energy||0,supportType:c.supportType||null,abilities:c.abilities||[],ultimate:c.ultimate||null,img:c.img}:null}
function hasTag(id,tag){return (catalogCard(id)?.tags||[]).includes(tag)}
function findMonster(p,id){return p.monsters.findIndex(x=>x===id)}
function equippedAnywhere(p,id){return p.monsters.some((x,i)=>x&&Object.values(monsterState(p,i).equipment||{}).includes(id))}
function distinctTags(p){const z=new Set();p.monsters.filter(Boolean).forEach(id=>(catalogCard(id)?.tags||[]).forEach(t=>z.add(t)));return z.size}
function effectiveStats(room,p,zone){
 const id=p.monsters[zone],c=catalogCard(id);if(!c)return {atk:0,def:0};
 const st=monsterState(p,zone),opp=duelPlayer(room,duelOpponentSeat(p.seat));
 let atk=(c.atk||0)+(st.atkMod||0),def=(c.def||0)+(st.defMod||0);
 const zeus=findMonster(p,'DM-001')>=0,dragon=findMonster(p,'DM-002')>=0,shiny=findMonster(p,'DM-018')>=0;
 if(zeus&&id!=='DM-001'&&hasTag(id,'DIVINA')){atk+=2000;def+=1500}
 if(dragon&&id!=='DM-002'&&hasTag(id,'DRAGON')){atk+=1500;def+=1000}
 const tir=findMonster(opp,'DM-009');if(tir>=0&&monsterState(opp,tir).pact>=4){atk-=800;def-=800}
 if(id==='DM-010'&&p.hp<DM_START_HP*.5){const r=Math.floor((DM_START_HP-p.hp)/2000)*1000;atk+=r;def+=r}
 if(equippedAnywhere(p,'DM-014')){atk+=1000;def+=1000}
 if(equippedAnywhere(p,'DM-016')){atk+=1000;def+=1000;if(distinctTags(p)>=5)atk+=2000}
 if(shiny&&id!=='DM-018')def+=1000;
 if(st.flags.eclipseUntil>=room.duel.turn){atk+=3000;def+=3000}
 if(st.equipment.weapon==='DM-015'&&(id==='DM-004'||id==='DM-018'))atk+=1500;
 if(id.startsWith('MGR-')&&equippedAnywhere(p,'MGR-018')){const f=p.archetype?.flames||0;if(f>=1)atk+=300;if(f>=4){atk+=500;def+=500}}
 if(id.startsWith('IDR-')&&p.archetype?.sky){atk+=400;def+=400}
 atk=Math.max(0,atk);def=Math.max(0,def);return {atk,def}
}
function monsterView(room,p,zone){
 const id=p.monsters[zone];if(!id)return null;
 const base=cardPublic(id),st=monsterState(p,zone),stats=effectiveStats(room,p,zone);
 return {...base,atk:stats.atk,def:stats.def,state:{energy:st.energy,uses:st.uses,ultimateUsed:st.ultimateUsed,charges:st.charges,solar:st.solar,pact:st.pact,austral:st.austral,fieldTurns:st.fieldTurns,equipment:{...st.equipment},petrifiedUntil:st.flags.petrifiedUntil||0,protectedUntil:st.flags.protectedUntil||0}};
}
function supportView(slot,owner=false){if(!slot)return null;return {id:owner||!slot.faceDown?slot.id:null,faceDown:!!slot.faceDown,active:!!slot.active,card:owner||!slot.faceDown?cardPublic(slot.id):null}}
function sanitizeDuel(room,seat){
 if(!room.duel)return null;
 const me=duelPlayer(room,seat),opp=duelPlayer(room,duelOpponentSeat(seat));
 const expose=(p,owner)=>({
   hp:p.hp,deckName:p.deckName,deckCount:p.deck.length,handCount:p.hand.length,graveCount:p.grave.length,banishedCount:p.banished.length,archetype:{...(p.archetype||{})},
   monsters:p.monsters.map((_,i)=>monsterView(room,p,i)),
   supports:p.supports.map(x=>supportView(x,owner))
 });
 return {
   mode:room.duel.mode,turn:room.duel.turn,activeSeat:room.duel.activeSeat,phase:room.duel.phase,winnerSeat:room.duel.winnerSeat,
   mySeat:seat,isMyTurn:room.duel.activeSeat===seat,
   me:{...expose(me,true),hand:me.hand.map(cardPublic),attacked:me.attacked.slice(),summonedThisTurn:me.summonedThisTurn,effectLockUntil:me.effectLockUntil},
   opponent:expose(opp,false),
   log:room.duel.log.slice(-40)
 };
}
function duelLog(room,type,seat,payload={}){room.duel.log.push({at:now(),type,seat,payload});if(room.duel.log.length>160)room.duel.log=room.duel.log.slice(-160)}
function drawOne(p){if(!p.deck.length)return null;const id=p.deck.shift();p.hand.push(id);return id}
function drawMany(p,n){const out=[];while(n-->0){const x=drawOne(p);if(!x)break;out.push(x)}return out}
function findHand(p,id){return p.hand.indexOf(id)}
function strongestZone(room,p){let best=-1,val=-1;p.monsters.forEach((id,i)=>{if(!id)return;const x=effectiveStats(room,p,i).atk;if(x>val){val=x;best=i}});return best}
function firstFreeMonster(p){return p.monsters.findIndex(x=>!x)}
function firstSupport(p,pred){return p.supports.findIndex(x=>x&&(!pred||pred(x)))}
function damagePlayer(room,p,n,source){n=Math.max(0,Math.floor(Number(n)||0));p.hp=Math.max(0,p.hp-n);duelLog(room,'DAMAGE',source||'SYSTEM',{target:p.seat,amount:n});if(p.hp<=0)finishDuel(room,duelOpponentSeat(p.seat),'HP_ZERO');return n}
function healPlayer(room,p,n,source){n=Math.max(0,Math.floor(Number(n)||0));p.hp=Math.min(DM_START_HP,p.hp+n);duelLog(room,'HEAL',source||p.seat,{target:p.seat,amount:n});return n}
function moveEquipmentToGrave(p,st){for(const k of ['weapon','relic']){if(st.equipment[k]){const gone=st.equipment[k];p.grave.push(gone);st.equipment[k]=null;if(gone==='IDR-018'){const gi=p.grave.findIndex(x=>x!=='IDR-018'&&x.startsWith('IDR-'));if(gi>=0)p.hand.push(p.grave.splice(gi,1)[0])}}}}
function onDestroyed(room,p,id){
 p.monsters.forEach((x,i)=>{if(!x)return;const st=monsterState(p,i);if(x==='DM-008'&&x!==id){st.solar=Math.min(10,st.solar+1);st.atkMod+=500;st.defMod+=500}if(x==='DM-010'&&x!==id)st.austral=Math.min(10,st.austral+1)});
 const opp=duelPlayer(room,duelOpponentSeat(p.seat));const tir=findMonster(opp,'DM-009');if(tir>=0)monsterState(opp,tir).pact=Math.min(6,monsterState(opp,tir).pact+1);
}
function canPreventDestroy(room,p,zone,attackerSeat){
 const id=p.monsters[zone],st=monsterState(p,zone);if(!id)return false;
 const archetypeWhy=archetypePreventDestroy(room,p,zone,{attackerSeat});if(archetypeWhy)return archetypeWhy;
 if(st.flags.zeroDamageUntil>=room.duel.turn)return 'ZERO_DAMAGE';
 if(st.flags.immortalUntil>=room.duel.turn)return 'IMMORTAL';
 if(st.flags.protectedUntil>=room.duel.turn)return 'PROTECTED';
 if(p.titanShieldUntil>=room.duel.turn)return 'TITAN_SHIELD';
 if(id==='DM-001'&&st.flags.olympusShield){const ally=p.monsters.findIndex((x,i)=>i!==zone&&x&&hasTag(x,'DIVINA'));if(ally>=0){st.flags.olympusShield=false;destroyMonster(room,p,ally,{ignoreProtection:true,reason:'ZEUS_SHIELD'});return 'OLYMPUS_SHIELD'}}
 if(id==='DM-004'&&st.flags.thorGuard){st.flags.thorGuard=false;return 'THOR_GUARD'}
 if(id==='DM-010'&&p.monsters.filter(Boolean).length<=1)return 'LAST_BREATH';
 if(st.equipment.weapon==='DM-017'){p.grave.push('DM-017');st.equipment.weapon=null;st.atkMod=Math.max(0,st.atkMod);return 'HOLY_WEAPON'}
 const afro=findMonster(p,'DM-011');if(afro>=0&&afro!==zone){const ast=monsterState(p,afro);if(ast.flags.bondUsedTurn!==room.duel.turn){ast.flags.bondUsedTurn=room.duel.turn;return 'APHRODITE_BOND'}}
 if(id==='DM-012'&&st.flags.reflectUntil>=room.duel.turn){st.flags.reflectUntil=0;const enemy=duelPlayer(room,attackerSeat||duelOpponentSeat(p.seat)),z=strongestZone(room,enemy);if(z>=0)destroyMonster(room,enemy,z,{ignoreProtection:true,reason:'GORGON_REFLECT'});return 'GORGON_REFLECT'}
 if(equippedAnywhere(p,'DM-014')&&(hasTag(id,'DIVINA')||id==='DM-004'||id==='DM-018'))return 'OLYMPUS_TORCH';
 if(equippedAnywhere(p,'DM-016')&&distinctTags(p)>=5)return 'DOMAIN';
 return false
}
function destroyMonster(room,p,zone,opts={}){
 const id=p.monsters[zone];if(!id)return false;
 if(!opts.ignoreProtection){const why=canPreventDestroy(room,p,zone,opts.attackerSeat);if(why){duelLog(room,'DESTRUCTION_PREVENTED',p.seat,{id,zone,why});return false}}
 const st=monsterState(p,zone);moveEquipmentToGrave(p,st);p.monsters[zone]=null;delete p.cardState[zone];
 if(opts.banish)p.banished.push(id);else p.grave.push(id);
 onDestroyed(room,p,id);duelLog(room,opts.banish?'BANISH':'DESTROY',opts.sourceSeat||'SYSTEM',{targetSeat:p.seat,id,zone,reason:opts.reason||null});return true
}
function banishStrongest(room,p,sourceSeat){const z=strongestZone(room,p);if(z<0)return null;const id=p.monsters[z];destroyMonster(room,p,z,{ignoreProtection:true,banish:true,sourceSeat,reason:'BANISH'});return id}
function discardSupportToGrave(p,zone){const s=p.supports[zone];if(!s)return null;p.supports[zone]=null;p.grave.push(s.id);return s.id}
function equipSupport(room,p,supportZone,targetZone){
 const slot=p.supports[supportZone];if(!slot||!p.monsters[targetZone])return {error:'TARGET_REQUIRED'};
 const id=slot.id,c=catalogCard(id),st=monsterState(p,targetZone),kind=c.supportType==='RELIC'?'relic':'weapon';
 if(!['DM-013','DM-014','DM-015','DM-016','DM-017'].includes(id))return {error:'NOT_EQUIPMENT'};
 if(st.equipment[kind])p.grave.push(st.equipment[kind]);
 st.equipment[kind]=id;p.supports[supportZone]=null;duelLog(room,'EQUIP',p.seat,{id,targetZone,kind});
 if(id==='DM-017'){for(const k of ['petrifiedUntil','attackDisabledUntil','aphroditeLockUntil'])delete st.flags[k]}
 tryShinyAwakening(room,p);
 return {ok:true}
}
function tryShinyAwakening(room,p){
 const thor=findMonster(p,'DM-004');if(thor<0)return false;
 const st=monsterState(p,thor);if(st.equipment.weapon!=='DM-015'||!equippedAnywhere(p,'DM-014')||!equippedAnywhere(p,'DM-016'))return false;
 let from='hand',idx=p.hand.indexOf('DM-018');if(idx<0){from='deck';idx=p.deck.indexOf('DM-018')}if(idx<0)return false;
 if(from==='hand')p.hand.splice(idx,1);else p.deck.splice(idx,1);
 p.monsters[thor]='DM-018';const next=initMonsterState('DM-018');next.equipment=st.equipment;next.fieldTurns=st.fieldTurns;next.flags.awakened=true;p.cardState[thor]=next;
 duelLog(room,'SHINY_AWAKENING',p.seat,{from:'DM-004',to:'DM-018',zone:thor});return true
}
function tryZeusNegate(room,actingSeat,kind){
 const defender=duelPlayer(room,duelOpponentSeat(actingSeat)),z=findMonster(defender,'DM-001');if(z<0)return false;
 const st=monsterState(defender,z);if(st.flags.negateUsedTurn===room.duel.turn)return false;
 st.flags.negateUsedTurn=room.duel.turn;damagePlayer(room,duelPlayer(room,actingSeat),2000,defender.seat);duelLog(room,'ZEUS_NEGATE',defender.seat,{kind});return true
}
function tryHunterTrap(room,summoner,monsterZone){
 const owner=duelPlayer(room,duelOpponentSeat(summoner.seat)),z=firstSupport(owner,x=>x.id==='DM-006'&&x.faceDown);if(z<0)return false;
 const atk=effectiveStats(room,summoner,monsterZone).atk;if(atk<3000)return false;
 owner.supports[z].faceDown=false;const ownMax=Math.max(0,...owner.monsters.map((id,i)=>id?effectiveStats(room,owner,i).atk:0));damagePlayer(room,summoner,Math.max(0,atk-ownMax),owner.seat);
 if(atk>=6000)destroyMonster(room,summoner,monsterZone,{ignoreProtection:true,sourceSeat:owner.seat,reason:'DEMON_HUNT'});
 if(atk>=10000)summoner.effectLockUntil=Math.max(summoner.effectLockUntil,room.duel.turn+1);
 if(atk>=15000){summoner.monsters.forEach((id,i)=>{if(id&&effectiveStats(room,summoner,i).atk<atk/2)destroyMonster(room,summoner,i,{ignoreProtection:true,sourceSeat:owner.seat,reason:'DEMON_HUNT_SWEEP'})})}
 discardSupportToGrave(owner,z);duelLog(room,'TRAP_TRIGGER','SYSTEM',{id:'DM-006',owner:owner.seat,attackerAtk:atk});return true
}
function tryTitanTrap(room,attacker,from){
 const owner=duelPlayer(room,duelOpponentSeat(attacker.seat)),z=firstSupport(owner,x=>x.id==='DM-019'&&x.faceDown);if(z<0)return false;
 const atk=effectiveStats(room,attacker,from).atk;owner.supports[z].faceDown=false;damagePlayer(room,attacker,Math.max(2000,atk),owner.seat);owner.titanShieldUntil=room.duel.turn+1;discardSupportToGrave(owner,z);
 duelLog(room,'TRAP_TRIGGER','SYSTEM',{id:'DM-019',owner:owner.seat,damage:Math.max(2000,atk)});return true
}

function addSeal(p,n=1){p.archetype=p.archetype||{};p.archetype.seals=Math.min(7,Math.max(0,Number(p.archetype.seals||0)+n));return p.archetype.seals}
function spendSeal(p,n){if(Number(p.archetype?.seals||0)<n)return false;p.archetype.seals-=n;return true}
function addMark(p,zone,n=1,room=null){
 if(!p.monsters[zone])return 0;const st=monsterState(p,zone);st.marks=Math.min(8,Math.max(0,Number(st.marks||0)+n));
 if(room&&equippedAnywhere(p,'IDR-018')&&p.archetype?.crownMarkTurn!==room.duel.turn){const other=p.monsters.findIndex((x,i)=>i!==zone&&x?.startsWith('IDR-'));if(other>=0){monsterState(p,other).marks=Math.min(8,(monsterState(p,other).marks||0)+1);p.archetype.crownMarkTurn=room.duel.turn}}
 return st.marks
}
function searchDeckToHand(p,pred){const i=p.deck.findIndex(id=>pred(id,catalogCard(id)));if(i<0)return null;const id=p.deck.splice(i,1)[0];p.hand.push(id);return id}
function reviveFirstMonster(p,pred=()=>true){const free=firstFreeMonster(p);if(free<0)return null;const gi=p.grave.findIndex(id=>catalogCard(id)?.kind==='MONSTER'&&pred(id,catalogCard(id)));if(gi<0)return null;const id=p.grave.splice(gi,1)[0];p.monsters[free]=id;p.cardState[free]=initMonsterState(id);return {id,zone:free}}
function removeReserveCard(p,id){let i=p.hand.indexOf(id);if(i>=0){p.hand.splice(i,1);return true}i=p.deck.indexOf(id);if(i>=0){p.deck.splice(i,1);return true}return false}
function strongestSupportZone(p){let z=-1;for(let i=0;i<p.supports.length;i++)if(p.supports[i]){z=i;break}return z}
function genericEquip(room,p,supportZone,targetZone,id,kind,atk=0,def=0){
 if(!p.monsters[targetZone])return {error:'TARGET_REQUIRED'};const st=monsterState(p,targetZone);
 if(st.equipment[kind])p.grave.push(st.equipment[kind]);st.equipment[kind]=id;st.atkMod+=atk;st.defMod+=def;p.supports[supportZone]=null;
 duelLog(room,'EQUIP',p.seat,{id,targetZone,kind,atk,def});return {ok:true}
}
function mgrMagicPulse(room,p){
 addSeal(p,1);p.archetype.magicUses=(p.archetype.magicUses||0)+1;
 if(equippedAnywhere(p,'MGR-018'))p.archetype.flames=Math.min(7,(p.archetype.flames||0)+1);
}
function resolveMgrSupport(room,p,body){
 const z=Number(body.supportZone),slot=p.supports[z];if(!slot)return {error:'INVALID_SUPPORT'};const id=slot.id,opp=duelPlayer(room,duelOpponentSeat(p.seat));slot.faceDown=false;slot.active=true;
 if(['MGR-015','MGR-016','MGR-017'].includes(id))return {error:'TRAP_AUTO'};
 mgrMagicPulse(room,p);
 if(id==='MGR-011'){searchDeckToHand(p,(x)=>x.startsWith('MGR-')&&x!=='MGR-011');if((p.archetype.seals||0)>=3)searchDeckToHand(p,x=>x==='MGR-008'||x==='MGR-009');discardSupportToGrave(p,z);return {ok:true}}
 if(id==='MGR-012'){let dmg=1500;if(p.monsters.filter(Boolean).length>=2)dmg+=500;damagePlayer(room,opp,dmg,p.seat);discardSupportToGrave(p,z);return {ok:true}}
 if(id==='MGR-013'){const r=reviveFirstMonster(p,id2=>id2.startsWith('MGR-'));if(!r)return {error:'NO_REVIVE_TARGET'};const st=monsterState(p,r.zone),b=(p.archetype.seals||0)>=2?800:500;st.atkMod=b-(catalogCard(r.id)?.atk||0);st.defMod=b-(catalogCard(r.id)?.def||0);discardSupportToGrave(p,z);return {ok:true}}
 if(id==='MGR-014'){const a=findMonster(p,'MGR-008'),b=findMonster(p,'MGR-009');if(a<0||b<0||!removeReserveCard(p,'MGR-019'))return {error:'FUSION_REQUIREMENT'};destroyMonster(room,p,Math.max(a,b),{ignoreProtection:true,reason:'FUSION'});destroyMonster(room,p,Math.min(a,b),{ignoreProtection:true,reason:'FUSION'});const free=firstFreeMonster(p);if(free<0)return {error:'NO_ZONE'};p.monsters[free]='MGR-019';p.cardState[free]=initMonsterState('MGR-019');p.monsters.forEach((x,i)=>{if(x&&x.startsWith('MGR-')&&i!==free){monsterState(p,i).atkMod+=800;monsterState(p,i).defMod+=800}});discardSupportToGrave(p,z);duelLog(room,'MGR_FUSION',p.seat,{to:'MGR-019'});return {ok:true}}
 if(id==='MGR-018'){const t=Number(body.targetZone);const r=genericEquip(room,p,z,t,id,'relic',0,0);if(!r.error)p.archetype.flames=Math.max(1,p.archetype.flames||0);return r}
 if(id==='MGR-020')return genericEquip(room,p,z,Number(body.targetZone),id,'weapon',1800,1200);
 return {error:'UNKNOWN_MGR_EFFECT'}
}
function resolveMgrAbility(room,p,zone){
 const id=p.monsters[zone],st=monsterState(p,zone),opp=duelPlayer(room,duelOpponentSeat(p.seat));if(!id||!id.startsWith('MGR-'))return {error:'INVALID_SOURCE'};
 const target=strongestZone(room,opp);
 if(id==='MGR-001'){if(!spendSeal(p,3))return {error:'SEALS_REQUIRED'};const gi=p.grave.findIndex(x=>x.startsWith('MGR-')&&catalogCard(x)?.kind==='SUPPORT');if(gi<0){addSeal(p,3);return {error:'NO_MAGIC_IN_GRAVE'}}p.hand.push(p.grave.splice(gi,1)[0])}
 else if(id==='MGR-002'){const gi=p.grave.findIndex(x=>x.startsWith('MGR-')&&catalogCard(x)?.kind==='SUPPORT');if(gi>=0)p.hand.push(p.grave.splice(gi,1)[0]);else return {error:'NO_MAGIC_IN_GRAVE'}}
 else if(id==='MGR-003'){addSeal(p,1)}
 else if(id==='MGR-004'){const t=p.monsters.findIndex(Boolean);if(t<0)return {error:'NO_TARGET'};const ts=monsterState(p,t);ts.flags.protectedUntil=room.duel.turn;ts.defMod+=1000}
 else if(id==='MGR-005'){if(!spendSeal(p,1))return {error:'SEALS_REQUIRED'};if(target<0)return {error:'NO_TARGET'};monsterState(opp,target).atkMod-=1500}
 else if(id==='MGR-006'){const t=p.monsters.findIndex(Boolean);if(t<0)return {error:'NO_TARGET'};monsterState(p,t).defMod+=700;monsterState(p,t).flags.protectedUntil=room.duel.turn}
 else if(id==='MGR-007'){if((p.archetype.seals||0)<3)return {error:'SEALS_REQUIRED'};st.atkMod+=500}
 else if(id==='MGR-008'){p.monsters.forEach((x,i)=>{if(x&&x.startsWith('MGR-'))monsterState(p,i).atkMod+=600});if(target>=0){monsterState(opp,target).atkMod-=400;monsterState(opp,target).defMod-=400}}
 else if(id==='MGR-009'){const s=strongestSupportZone(opp);if(s>=0)discardSupportToGrave(opp,s);else damagePlayer(room,opp,700,p.seat)}
 else if(id==='MGR-010'){st.atkMod+=700;if((p.archetype.seals||0)>=3)searchDeckToHand(p,x=>x.startsWith('MGR-')&&x!=='MGR-010')}
 else if(id==='MGR-019'){if(spendSeal(p,2))st.atkMod+=1200;st.flags.protectedUntil=room.duel.turn}
 else return {error:'PASSIVE_ONLY'};
 st.uses++;duelLog(room,'MGR_ABILITY',p.seat,{id,seals:p.archetype.seals});return {ok:true}
}
function transformIdr(room,p,zone,to,need){
 const id=p.monsters[zone],st=monsterState(p,zone);if(!id||st.marks<need||!removeReserveCard(p,to))return false;
 const next=initMonsterState(to);next.marks=st.marks;next.fieldTurns=st.fieldTurns;next.equipment=st.equipment;p.grave.push(id);p.monsters[zone]=to;p.cardState[zone]=next;duelLog(room,'IDR_TRANSFORM',p.seat,{from:id,to,marks:next.marks});return true
}
function fusionIdr(room,p,to){
 let a=-1,b=-1;if(to==='IDR-019'){a=findMonster(p,'IDR-003');b=findMonster(p,'IDR-004')}
 else{a=p.monsters.findIndex((x,i)=>x&&(x==='IDR-009'||x==='IDR-010'));b=findMonster(p,'IDR-008')}
 if(a<0||b<0||a===b||!removeReserveCard(p,to))return false;
 const marks=(monsterState(p,a).marks||0)+(monsterState(p,b).marks||0);destroyMonster(room,p,Math.max(a,b),{ignoreProtection:true,reason:'FUSION'});destroyMonster(room,p,Math.min(a,b),{ignoreProtection:true,reason:'FUSION'});
 const z=firstFreeMonster(p);if(z<0)return false;p.monsters[z]=to;p.cardState[z]=initMonsterState(to);p.cardState[z].marks=marks;
 if(to==='IDR-019'){p.cardState[z].atkMod+=marks*300;p.cardState[z].flags.unlimitedAttacksUntil=room.duel.turn;const opp=duelPlayer(room,duelOpponentSeat(p.seat));opp.supports.forEach((s,i)=>{if(s)discardSupportToGrave(opp,i)})}
 else{p.archetype.sky=true}
 duelLog(room,'IDR_FUSION',p.seat,{to,marks});return true
}
function resolveIdrSupport(room,p,body){
 const z=Number(body.supportZone),slot=p.supports[z];if(!slot)return {error:'INVALID_SUPPORT'};const id=slot.id;slot.faceDown=false;slot.active=true;
 if(['IDR-014','IDR-015'].includes(id))return {error:'TRAP_AUTO'};
 if(id==='IDR-011'){searchDeckToHand(p,(x,c)=>x.startsWith('IDR-')&&c?.kind==='MONSTER'&&!c.specialOnly);const t=p.monsters.findIndex((x,i)=>x&&(x==='IDR-009'||x==='IDR-010'));if(t>=0)addMark(p,t,1,room);discardSupportToGrave(p,z);return {ok:true}}
 if(id==='IDR-012'){const t=Number(body.targetZone);if(!p.monsters[t]||!p.monsters[t].startsWith('IDR-'))return {error:'TARGET_REQUIRED'};addMark(p,t,1,room);if(p.monsters[t]==='IDR-001'&&monsterState(p,t).marks>=2)transformIdr(room,p,t,'IDR-009',2);if(p.monsters[t]==='IDR-008'&&monsterState(p,t).marks>=4)transformIdr(room,p,t,'IDR-010',4);discardSupportToGrave(p,z);return {ok:true}}
 if(id==='IDR-013'){p.archetype.sky=true;return {ok:true}}
 if(id==='IDR-016')return genericEquip(room,p,z,Number(body.targetZone),id,'weapon',1400,0);
 if(id==='IDR-017')return genericEquip(room,p,z,Number(body.targetZone),id,'weapon',1000,400);
 if(id==='IDR-018')return genericEquip(room,p,z,Number(body.targetZone),id,'relic',0,0);
 return {error:'UNKNOWN_IDR_EFFECT'}
}
function resolveIdrAbility(room,p,zone){
 const id=p.monsters[zone],st=monsterState(p,zone),opp=duelPlayer(room,duelOpponentSeat(p.seat));if(!id||!id.startsWith('IDR-'))return {error:'INVALID_SOURCE'};
 if(id==='IDR-001'&&st.marks>=2&&transformIdr(room,p,zone,'IDR-009',2))return {ok:true};
 if(id==='IDR-008'&&st.marks>=4&&transformIdr(room,p,zone,'IDR-010',4))return {ok:true};
 if((id==='IDR-003'||id==='IDR-004')&&findMonster(p,'IDR-003')>=0&&findMonster(p,'IDR-004')>=0&&fusionIdr(room,p,'IDR-019'))return {ok:true};
 if((id==='IDR-008'||id==='IDR-009'||id==='IDR-010')&&findMonster(p,'IDR-008')>=0&&p.monsters.some(x=>x==='IDR-009'||x==='IDR-010')&&fusionIdr(room,p,'IDR-020'))return {ok:true};
 const target=strongestZone(room,opp);
 if(id==='IDR-001')addMark(p,zone,1,room);
 else if(id==='IDR-002'){st.atkMod+=500;st.flags.unlimitedAttacksUntil=room.duel.turn}
 else if(id==='IDR-003'){const s=strongestSupportZone(opp);if(s>=0){discardSupportToGrave(opp,s);st.atkMod+=500}}
 else if(id==='IDR-004')damagePlayer(room,opp,opp.monsters.filter(Boolean).length*400,p.seat);
 else if(id==='IDR-005'){let n=0;for(let i=opp.monsters.length-1;i>=0&&n<2;i--)if(opp.monsters[i]&&destroyMonster(room,opp,i,{sourceSeat:p.seat,reason:'VUELO_SUPREMO'}))n++}
 else if(id==='IDR-006'){const t=p.monsters.findIndex(x=>x&&x.startsWith('IDR-'));if(t<0)return {error:'NO_TARGET'};monsterState(p,t).flags.protectedUntil=room.duel.turn}
 else if(id==='IDR-007'){if(target<0)return {error:'NO_TARGET'};const gain=effectiveStats(room,opp,target).atk;if(destroyMonster(room,opp,target,{sourceSeat:p.seat,reason:'VORTEX'}))st.atkMod+=gain}
 else if(id==='IDR-008'){if(target<0)return {error:'NO_TARGET'};if(destroyMonster(room,opp,target,{sourceSeat:p.seat,reason:'DOMINION'})){st.atkMod+=500;damagePlayer(room,opp,500,p.seat)}}
 else if(id==='IDR-009')st.atkMod+=500;
 else if(id==='IDR-010'){let n=0;for(let i=opp.monsters.length-1;i>=0&&n<2;i--)if(opp.monsters[i]&&destroyMonster(room,opp,i,{sourceSeat:p.seat,reason:'THRONE'}))n++;st.flags.extraAttacks=(st.flags.extraAttacks||0)+1}
 else if(id==='IDR-019')st.flags.unlimitedAttacksUntil=room.duel.turn;
 else if(id==='IDR-020'){let n=0;for(let i=opp.monsters.length-1;i>=0&&n<3;i--)if(opp.monsters[i]&&destroyMonster(room,opp,i,{sourceSeat:p.seat,reason:'APOCALYPSE'}))n++;st.atkMod+=n*500}
 else return {error:'NO_ABILITY_HANDLER'};
 st.uses++;duelLog(room,'IDR_ABILITY',p.seat,{id,marks:st.marks});return {ok:true}
}
function archetypePreventDestroy(room,p,zone,opts){
 const id=p.monsters[zone],st=monsterState(p,zone),opp=duelPlayer(room,duelOpponentSeat(p.seat));
 if(id?.startsWith('MGR-')&&equippedAnywhere(p,'MGR-018')&&(p.archetype?.flames||0)>=2&&p.archetype.grimSaveTurn!==room.duel.turn){p.archetype.grimSaveTurn=room.duel.turn;return 'GRIMORIO_PROTECTION'}
 if(id?.startsWith('MGR-')){
  if(st.flags.protectedUntil>=room.duel.turn)return 'MGR_GUARD';
  if(id==='MGR-009'&&!st.flags.ancestorSave){const gi=p.grave.findIndex(x=>x.startsWith('MGR-'));if(gi>=0){p.grave.splice(gi,1);st.flags.ancestorSave=true;st.defMod+=1000;return 'MGR_ANCESTOR'}}
  const tz=firstSupport(p,x=>x.id==='MGR-017'&&x.faceDown);if(tz>=0&&(p.archetype.seals||0)>=3){spendSeal(p,3);discardSupportToGrave(p,tz);return 'MGR_LAST_FLAME'}
 }
 if(id?.startsWith('IDR-')){
  if(st.flags.protectedUntil>=room.duel.turn){st.flags.protectedUntil=0;addMark(p,zone,1,room);return 'IDR_FORGE_SCALES'}
  if(id==='IDR-008'){const gi=p.grave.findIndex(x=>x.startsWith('IDR-'));if(gi>=0){p.banished.push(p.grave.splice(gi,1)[0]);return 'IDR_INFERNAL_SURVIVE'}}
  if(id==='IDR-020'){let total=p.monsters.reduce((n,x,i)=>n+(x?monsterState(p,i).marks||0:0),0);if(total>=3){for(let i=0;i<5&&total>0;i++){const s=p.monsters[i]?monsterState(p,i):null;if(!s)continue;const take=Math.min(3,s.marks||0);s.marks-=take;total-=take;if(total<=p.monsters.reduce((n,x,j)=>n+(x?monsterState(p,j).marks||0:0),0)-3)break}return 'IDR_END_EMPEROR'}}
  const tz=firstSupport(p,x=>x.id==='IDR-015'&&x.faceDown);if(tz>=0){discardSupportToGrave(p,tz);const t=strongestZone(room,opp);if(t>=0)destroyMonster(room,opp,t,{ignoreProtection:true,sourceSeat:p.seat,reason:'LAST_DRAGON_RAGE'});return 'IDR_LAST_DRAGON'}
 }
 return false
}
function archetypeAttackTrap(room,attacker,from,target){
 const defender=duelPlayer(room,duelOpponentSeat(attacker.seat));
 if(defender.deckName==='MAGO_ROJO'){
  const z=firstSupport(defender,x=>x.id==='MGR-015'&&x.faceDown);if(z>=0&&target!==null&&defender.monsters[target]?.startsWith('MGR-')){discardSupportToGrave(defender,z);const ast=monsterState(attacker,from);ast.atkMod-=1000;ast.flags.attackDisabledUntil=room.duel.turn;duelLog(room,'MGR_PRISON',defender.seat,{from});return 'CANCEL'}
 }
 if(defender.deckName==='IMPERIO_DRAGON'){
  const z=firstSupport(defender,x=>x.id==='IDR-014'&&x.faceDown);if(z>=0&&target!==null&&defender.monsters[target]?.startsWith('IDR-')){discardSupportToGrave(defender,z);monsterState(defender,target).defMod+=1200;monsterState(attacker,from).atkMod-=600;duelLog(room,'IDR_SCALE_COUNTER',defender.seat,{from,target})}
 }
 return null
}
function archetypeOnSummon(room,p,zone){
 const id=p.monsters[zone];if(!id)return;
 if(id==='MGR-002'){const gi=p.grave.findIndex(x=>x.startsWith('MGR-')&&catalogCard(x)?.kind==='SUPPORT');if(gi>=0)p.hand.push(p.grave.splice(gi,1)[0])}
 if(id==='MGR-005')addSeal(p,2);
 if(id==='MGR-019')p.monsters.forEach((x,i)=>{if(x&&x.startsWith('MGR-')&&i!==zone){monsterState(p,i).atkMod+=800;monsterState(p,i).defMod+=800}});
}
function archetypeAfterAttack(room,p,zone,killed,defender,target){
 const id=p.monsters[zone],st=p.monsters[zone]?monsterState(p,zone):null;if(!id||!st)return;
 if(id==='IDR-001')addMark(p,zone,1,room);
 if(st.equipment.weapon==='IDR-016'&&killed)addMark(p,zone,1,room);
 if(st.equipment.weapon==='IDR-017'&&(hasTag(id,'VIENTO')||id==='IDR-009'||id==='IDR-010'))st.flags.extraAttacks=(st.flags.extraAttacks||0)+1;
 if(p.archetype?.sky&&id.startsWith('IDR-'))addMark(p,zone,1,room);
 if(defender&&target!==null&&defender.monsters[target]==='MGR-003'&&!killed)addSeal(defender,1);
}
function archetypeTurnStart(room,p){
 if(p.deckName==='MAGO_ROJO'&&equippedAnywhere(p,'MGR-018')){
  const flames=p.archetype.flames||0;if(flames>=3&&p.archetype.grimDrawTurn!==room.duel.turn){drawOne(p);p.archetype.grimDrawTurn=room.duel.turn}if(flames>=5)healPlayer(room,p,1000,p.seat);
  if(flames>=7&&!p.monsters.includes('MGR-019')&&removeReserveCard(p,'MGR-019')){const z=firstFreeMonster(p);if(z>=0){p.monsters[z]='MGR-019';p.cardState[z]=initMonsterState('MGR-019');archetypeOnSummon(room,p,z)}}
 }
}
function tryArchetypeResponse(room,actingPlayer){
 const defender=duelPlayer(room,duelOpponentSeat(actingPlayer.seat));
 if(defender?.deckName==='MAGO_ROJO'){
  const mirror=firstSupport(defender,x=>x.id==='MGR-016'&&x.faceDown);
  if(mirror>=0){discardSupportToGrave(defender,mirror);damagePlayer(room,actingPlayer,800,defender.seat);duelLog(room,'MGR_MIRROR',defender.seat,{damage:800});return true}
  if(equippedAnywhere(defender,'MGR-018')&&(defender.archetype?.flames||0)>=6&&defender.archetype.grimNegateTurn!==room.duel.turn){defender.archetype.grimNegateTurn=room.duel.turn;duelLog(room,'GRIMORIO_NEGATE',defender.seat,{});return true}
 }
 return false
}
function resolveArchetypeAbility(room,p,zone,ultimate=false){
 if(p.deckName!=='DUEL_MASTER'&&tryArchetypeResponse(room,p))return {ok:true,negated:true};
 if(p.deckName==='MAGO_ROJO')return ultimate?{error:'NO_ULTIMATE'}:resolveMgrAbility(room,p,zone);
 if(p.deckName==='IMPERIO_DRAGON')return ultimate?{error:'NO_ULTIMATE'}:resolveIdrAbility(room,p,zone);
 return resolveDmAbility(room,p,zone,ultimate)
}
function makeProbeRoom(deckName){
 const p=initOnlinePlayer({deckName},'HOST'),opp=initOnlinePlayer({deckName:deckName==='MAGO_ROJO'?'IMPERIO_DRAGON':'MAGO_ROJO'},'GUEST');
 p.deck=[];p.hand=[];p.grave=[];p.banished=[];p.monsters=Array(5).fill(null);p.supports=Array(5).fill(null);p.cardState={};p.archetype={seals:7,flames:7,magicUses:0,sky:false};
 opp.deck=[];opp.hand=[];opp.grave=[];opp.banished=[];opp.monsters=Array(5).fill(null);opp.supports=Array(5).fill(null);opp.cardState={};opp.archetype={seals:3,flames:3,magicUses:0,sky:false};
 const room={status:'ACTIVE',duel:{mode:'MULTI_DECK',turn:1,activeSeat:'HOST',phase:'MAIN',winnerSeat:null,players:{HOST:p,GUEST:opp},log:[]},events:[],seq:0};
 return {room,p,opp}
}
function probeMgrCard(id){
 const {room,p,opp}=makeProbeRoom('MAGO_ROJO');const card=catalogCard(id);if(!card)return {id,ok:false,error:'MISSING_CARD'};
 opp.monsters[0]='IDR-001';opp.cardState[0]=initMonsterState('IDR-001');opp.supports[0]={id:'IDR-013',faceDown:false,active:true};
 p.grave=['MGR-011','MGR-002'];p.deck=MGR_DECK.filter(x=>x!==id&&x!=='MGR-019');
 if(card.kind==='MONSTER'){
  p.monsters[0]=id;p.cardState[0]=initMonsterState(id);
  const r=resolveMgrAbility(room,p,0);return {id,ok:!['INVALID_SOURCE','NO_ABILITY_HANDLER'].includes(r?.error),error:r?.error||null,kind:'MONSTER'}
 }
 p.supports[0]={id,faceDown:true,active:false};
 if(id==='MGR-015'){p.monsters[0]='MGR-001';p.cardState[0]=initMonsterState('MGR-001');opp.monsters[0]='IDR-001';opp.cardState[0]=initMonsterState('IDR-001');const x=archetypeAttackTrap(room,opp,0,0);return {id,ok:x==='CANCEL',error:x==='CANCEL'?null:'TRAP_NOT_TRIGGERED',kind:'TRAP'}}
 if(id==='MGR-016'){const x=tryArchetypeResponse(room,opp);return {id,ok:x===true,error:x?null:'TRAP_NOT_TRIGGERED',kind:'TRAP'}}
 if(id==='MGR-017'){p.monsters[0]='MGR-001';p.cardState[0]=initMonsterState('MGR-001');const x=archetypePreventDestroy(room,p,0,{});return {id,ok:!!x,error:x?null:'TRAP_NOT_TRIGGERED',kind:'TRAP'}}
 if(id==='MGR-014'){p.monsters[0]='MGR-008';p.cardState[0]=initMonsterState('MGR-008');p.monsters[1]='MGR-009';p.cardState[1]=initMonsterState('MGR-009');p.deck.push('MGR-019')}
 else{p.monsters[0]='MGR-001';p.cardState[0]=initMonsterState('MGR-001');if(id==='MGR-013')p.grave.unshift('MGR-002')}
 const r=resolveMgrSupport(room,p,{supportZone:0,targetZone:0});
 return {id,ok:!['UNKNOWN_MGR_EFFECT','INVALID_SUPPORT'].includes(r?.error),error:r?.error||null,kind:'SUPPORT'}
}
function probeIdrCard(id){
 const {room,p,opp}=makeProbeRoom('IMPERIO_DRAGON');const card=catalogCard(id);if(!card)return {id,ok:false,error:'MISSING_CARD'};
 opp.monsters[0]='MGR-001';opp.cardState[0]=initMonsterState('MGR-001');opp.supports[0]={id:'MGR-011',faceDown:false,active:true};
 p.grave=['IDR-001'];p.deck=IDR_DECK.filter(x=>x!==id&&x!=='IDR-009'&&x!=='IDR-010'&&x!=='IDR-019'&&x!=='IDR-020');
 if(card.kind==='MONSTER'){
  p.monsters[0]=id;p.cardState[0]=initMonsterState(id);
  const r=resolveIdrAbility(room,p,0);return {id,ok:!['INVALID_SOURCE','NO_ABILITY_HANDLER'].includes(r?.error),error:r?.error||null,kind:'MONSTER'}
 }
 p.supports[0]={id,faceDown:true,active:false};p.monsters[0]='IDR-001';p.cardState[0]=initMonsterState('IDR-001');
 if(id==='IDR-014'){const x=archetypeAttackTrap(room,opp,0,0);return {id,ok:x===null||x==='CANCEL',error:null,kind:'TRAP'}}
 if(id==='IDR-015'){const x=archetypePreventDestroy(room,p,0,{});return {id,ok:!!x,error:x?null:'TRAP_NOT_TRIGGERED',kind:'TRAP'}}
 if(id==='IDR-012')p.deck.push('IDR-009');
 const r=resolveIdrSupport(room,p,{supportZone:0,targetZone:0});
 return {id,ok:!['UNKNOWN_IDR_EFFECT','INVALID_SUPPORT'].includes(r?.error),error:r?.error||null,kind:'SUPPORT'}
}
function onlineRuntimeProbe(){
 const mgr=MGR_DECK.map(probeMgrCard),idr=IDR_DECK.map(probeIdrCard);
 return {MAGO_ROJO:{count:mgr.length,ok:mgr.every(x=>x.ok),cards:mgr},IMPERIO_DRAGON:{count:idr.length,ok:idr.every(x=>x.ok),cards:idr}}
}

function resolveArchetypeSupport(room,p,body){
 if(p.deckName==='MAGO_ROJO')return resolveMgrSupport(room,p,body);
 if(p.deckName==='IMPERIO_DRAGON')return resolveIdrSupport(room,p,body);
 return useSupport(room,p,body)
}

function useSupport(room,p,body){
 const z=Number(body.supportZone),slot=p.supports[z];if(!Number.isInteger(z)||z<0||z>4||!slot)return {error:'INVALID_SUPPORT'};
 const id=slot.id;
 if(['DM-013','DM-014','DM-015','DM-016','DM-017'].includes(id))return equipSupport(room,p,z,Number(body.targetZone));
 if(id==='DM-006'||id==='DM-019')return {error:'TRAP_AUTO'};
 if(tryZeusNegate(room,p.seat,'SUPPORT')){discardSupportToGrave(p,z);return {ok:true,negated:true}}
 slot.faceDown=false;slot.active=true;
 if(id==='DM-005'){p.originsUntil=room.duel.turn+2;drawMany(p,2);duelLog(room,'ORIGINS',p.seat,{until:p.originsUntil});return {ok:true}}
 if(id==='DM-020'){
   healPlayer(room,p,3000,p.seat);p.monsters.forEach((x,i)=>{if(x){const st=monsterState(p,i);st.flags.eclipseUntil=room.duel.turn;st.flags.directUntil=room.duel.turn}});
   let revived=0;for(let i=p.grave.length-1;i>=0&&revived<3;i--){const id2=p.grave[i],c=catalogCard(id2),free=firstFreeMonster(p);if(free<0)break;if(c?.kind==='MONSTER'&&(c.atk||0)<=2000){p.grave.splice(i,1);p.monsters[free]=id2;p.cardState[free]=initMonsterState(id2);revived++}}
   discardSupportToGrave(p,z);duelLog(room,'ECLIPSE_REALMS',p.seat,{revived});return {ok:true}
 }
 return {error:'UNKNOWN_SUPPORT_EFFECT'}
}
function stealStrongest(room,me,opp){
 const z=strongestZone(room,opp),free=firstFreeMonster(me);if(z<0||free<0)return false;
 const id=opp.monsters[z],st=monsterState(opp,z);opp.monsters[z]=null;delete opp.cardState[z];me.monsters[free]=id;me.cardState[free]=st;duelLog(room,'STEAL',me.seat,{id,from:opp.seat,toZone:free});return true
}
function abilityCost(st,n){if(st.energy<n)return false;st.energy-=n;return true}
function resolveDmAbility(room,p,zone,ultimate=false){
 const id=p.monsters[zone],c=catalogCard(id);if(!id||c?.kind!=='MONSTER')return {error:'INVALID_SOURCE'};
 const st=monsterState(p,zone),opp=duelPlayer(room,duelOpponentSeat(p.seat));
 if(st.flags.petrifiedUntil>=room.duel.turn||st.flags.attackDisabledUntil>=room.duel.turn)return {error:'SOURCE_DISABLED'};
 if(p.effectLockUntil>=room.duel.turn)return {error:'EFFECTS_LOCKED'};
 if(!ultimate&&tryZeusNegate(room,p.seat,'ABILITY'))return {ok:true,negated:true};
 if(ultimate){
   if(!c.ultimate)return {error:'NO_ULTIMATE'};if(st.ultimateUsed)return {error:'ULTIMATE_USED'};
   if(id==='DM-001'){if(!abilityCost(st,4))return {error:'ENERGY'};let n=0;opp.monsters.forEach((x,i)=>{if(x&&destroyMonster(room,opp,i,{sourceSeat:p.seat,reason:'JUDGEMENT'}))n++});damagePlayer(room,opp,n*8000,p.seat)}
   else if(id==='DM-002'){if(!abilityCost(st,5))return {error:'ENERGY'};let n=0;opp.monsters.forEach((x,i)=>{if(x&&destroyMonster(room,opp,i,{sourceSeat:p.seat,reason:'EMPEROR_WRATH'}))n++});st.atkMod+=n*3000;st.flags.unlimitedAttacksUntil=room.duel.turn}
   else if(id==='DM-003'){if(!abilityCost(st,6))return {error:'ENERGY'};drawMany(p,2);st.atkMod+=3000;st.flags.oracleUntil=room.duel.turn+1}
   else if(id==='DM-004'){if(st.charges<3||!abilityCost(st,5))return {error:'THOR_REQUIREMENT'};st.charges-=3;damagePlayer(room,opp,6000,p.seat);const a=effectiveStats(room,p,zone).atk;opp.monsters.forEach((x,i)=>{if(x&&effectiveStats(room,opp,i).def<=Math.floor(a/2))destroyMonster(room,opp,i,{sourceSeat:p.seat,reason:'RAGNAROK_THUNDER'})})}
   else if(id==='DM-007'){const cost=st.flags.ascended?4:8;if(!abilityCost(st,cost))return {error:'ENERGY'};st.flags.ascended=true;st.flags.immortalUntil=room.duel.turn+2;st.atkMod+=5000;st.defMod+=5000;healPlayer(room,p,2000,p.seat)}
   else if(id==='DM-008'){if(st.solar<5||!abilityCost(st,10))return {error:'SOLAR_REQUIREMENT'};st.solar-=5;let total=0;for(const q of [p,opp])q.monsters.forEach((x,i)=>{if(x&&!(q===p&&i===zone)){total+=effectiveStats(room,q,i).atk;destroyMonster(room,q,i,{ignoreProtection:true,sourceSeat:p.seat,reason:'FIFTH_SUN'})}});damagePlayer(room,opp,total,p.seat);st.atkMod+=5000;st.defMod+=5000}
   else if(id==='DM-009'){if(st.pact<6||!abilityCost(st,12))return {error:'PACT_REQUIREMENT'};st.pact-=6;opp.monsters.forEach((x,i)=>{if(x){const os=monsterState(opp,i);os.atkMod-=1200;os.defMod-=1200;os.flags.attackDisabledUntil=room.duel.turn+1}});opp.effectLockUntil=Math.max(opp.effectLockUntil,room.duel.turn+1);if(!opp.monsters.some(Boolean))damagePlayer(room,opp,5000,p.seat)}
   else if(id==='DM-010'){if(st.energy<16&&p.hp>2000&&p.monsters.filter(Boolean).length>1)return {error:'AURORA_REQUIREMENT'};st.energy=Math.max(0,st.energy-16);st.austral+=5;healPlayer(room,p,3000,p.seat);opp.monsters.forEach((x,i)=>{if(x)destroyMonster(room,opp,i,{sourceSeat:p.seat,reason:'AURORA'})});for(let n=0;n<5;n++){const gi=p.grave.findIndex(x=>catalogCard(x)?.kind==='MONSTER'),free=firstFreeMonster(p);if(gi<0||free<0)break;const rid=p.grave.splice(gi,1)[0];p.monsters[free]=rid;p.cardState[free]=initMonsterState(rid);p.cardState[free].atkMod+=1500;p.cardState[free].defMod+=1500;p.cardState[free].flags.directUntil=room.duel.turn}}
   else return {error:'NO_ULTIMATE'};
   st.ultimateUsed=true;duelLog(room,'ULTIMATE',p.seat,{id,name:c.ultimate});return {ok:true}
 }
 const k=st.uses%(c.abilities?.length||1);let target=strongestZone(room,opp);
 if(id==='DM-001'){
  if(k===0&&target>=0){const victim=opp.monsters[target],ally=catalogCard(victim)?.kind==='MONSTER';destroyMonster(room,opp,target,{ignoreProtection:true,banish:true,sourceSeat:p.seat,reason:'CELESTIAL_DOMAIN'});if(ally)damagePlayer(room,opp,3000,p.seat)}
  else if(k===1)st.flags.chainThunderUntil=room.duel.turn;
  else if(k===2)st.flags.olympusShield=true;
  else if(k===3&&opp.hand.length){const ix=crypto.randomInt(0,opp.hand.length),gone=opp.hand.splice(ix,1)[0];opp.banished.push(gone);duelLog(room,'HAND_BANISH',p.seat,{count:1})}
  else if(k===4)opp.effectLockUntil=Math.max(opp.effectLockUntil,room.duel.turn+1);
 }else if(id==='DM-002'){
  if(k===0&&target>=0){const os=monsterState(opp,target);os.defMod-=6000;if(effectiveStats(room,opp,target).def===0){destroyMonster(room,opp,target,{sourceSeat:p.seat,reason:'GOLDEN_COMET'});damagePlayer(room,opp,3000,p.seat)}}
  else if(k===1){opp.effectLockUntil=Math.max(opp.effectLockUntil,room.duel.turn+1);st.energy+=2;const sz=firstSupport(opp);if(sz>=0)discardSupportToGrave(opp,sz)}
  else if(k===2){st.flags.zeroDamageUntil=room.duel.turn+1}
  else if(k===3&&opp.grave.length){let bi=0,bv=-1;opp.grave.forEach((x,i)=>{const a=catalogCard(x)?.atk||0;if(a>bv){bv=a;bi=i}});const gone=opp.grave.splice(bi,1)[0];opp.banished.push(gone);if(catalogCard(gone)?.kind==='MONSTER')damagePlayer(room,opp,4000,p.seat)}
 }else if(id==='DM-003'){
  if(k===0)drawOne(p);
  else if(k===1&&p.hand.length&&p.hand.length<6)p.hand.push(p.hand[0]);
  else if(k===2)opp.effectLockUntil=Math.max(opp.effectLockUntil,room.duel.turn+1);
  else if(k===3&&p.monsters.filter(x=>x&&hasTag(x,'DIVINA')).length>=2){drawMany(p,2);st.energy++}
 }else if(id==='DM-004'){
  if(k===0){if(st.charges<1)return {error:'CHARGES'};st.charges--;damagePlayer(room,opp,2500,p.seat);const z=opp.monsters.findIndex((x,i)=>x&&effectiveStats(room,opp,i).def<=4000);if(z>=0)destroyMonster(room,opp,z,{sourceSeat:p.seat,reason:'THUNDER_STRIKE'})}
  else if(k===1){if(st.equipment.weapon){opp.monsters.forEach((x,i)=>{if(x)monsterState(opp,i).defMod-=3000})}else st.atkMod+=3000}
  else if(k===2){if(st.charges<2)return {error:'CHARGES'};st.charges-=2;st.flags.extraAttacks=(st.flags.extraAttacks||0)+1;st.atkMod+=1000}
  else if(k===3){if(!st.equipment.weapon)return {error:'WEAPON_REQUIRED'};p.grave.push(st.equipment.weapon);st.equipment.weapon=null;st.flags.thorGuard=true}
 }else if(id==='DM-007'){
  if(k===0){st.flags.ascended=true;st.flags.immortalUntil=room.duel.turn+1}
  else if(k===1){st.atkMod+=3000;st.defMod+=3000;st.charges=Math.min(3,st.charges+1)}
  else if(k===2){healPlayer(room,p,3000,p.seat);const sz=firstSupport(opp);if(sz>=0){const gone=opp.supports[sz].id;opp.supports[sz]=null;opp.banished.push(gone)}}
  else if(k===3){opp.monsters.forEach((x,i)=>{if(x)monsterState(opp,i).defMod-=2000});st.flags.sweepUntil=room.duel.turn}
 }else if(id==='DM-008'){
  if(k===0&&p.deck.length>=3){const top=p.deck.splice(0,3).reverse();p.deck.unshift(...top)}
  else if(k===1){const sacrifice=p.monsters.findIndex((x,i)=>x&&i!==zone);if(sacrifice<0)return {error:'SACRIFICE_REQUIRED'};destroyMonster(room,p,sacrifice,{ignoreProtection:true,sourceSeat:p.seat,reason:'WAR_OFFERING'});st.atkMod+=2000}
  else if(k===2){if(st.solar<5)return {error:'SOLAR_REQUIREMENT'};p.monsters.forEach((x,i)=>{if(x&&hasTag(x,'FUEGO')){monsterState(p,i).atkMod+=1500;monsterState(p,i).defMod+=1500}})}
  else if(k===3){let total=0,n=0;p.monsters.forEach((x,i)=>{if(x&&i!==zone&&n<5){total+=effectiveStats(room,p,i).atk;destroyMonster(room,p,i,{ignoreProtection:true,sourceSeat:p.seat,reason:'LAST_TLATOANI'});n++}});damagePlayer(room,opp,total,p.seat)}
 }else if(id==='DM-009'){
  if(k===0){const sz=firstSupport(opp);if(sz>=0){const gone=opp.supports[sz].id;opp.supports[sz]=null;opp.banished.push(gone)}}
  else if(k===1)st.pact=Math.min(6,st.pact+1);
  else if(k===2&&opp.grave.length)opp.banished.push(opp.grave.shift());
  else if(k===3)drawOne(p);
 }else if(id==='DM-010'){
  if(k===0&&p.hp<=4000)st.flags.immortalUntil=room.duel.turn+1;
  else if(k===1){let n=Math.min(3,st.austral);while(n-->0){if(banishStrongest(room,opp,p.seat))st.austral--}}
  else if(k===2){const gi=p.grave.findIndex(x=>catalogCard(x)?.kind==='MONSTER'),free=firstFreeMonster(p);if(gi>=0&&free>=0){const rid=p.grave.splice(gi,1)[0];p.monsters[free]=rid;p.cardState[free]=initMonsterState(rid)}}
  else if(k===3){if(st.austral<5)return {error:'AUSTRAL_REQUIREMENT'};st.austral-=5;drawMany(p,2);healPlayer(room,p,1000,p.seat)}
 }else if(id==='DM-011'){
  if(k===0&&target>=0){monsterState(opp,target).atkMod-=1500;monsterState(opp,target).flags.attackDisabledUntil=room.duel.turn+1}
  else if(k===1)st.flags.bondUntil=room.duel.turn+1;
  else if(k===2){if(st.fieldTurns<3)return {error:'FIELD_TURNS'};if(!stealStrongest(room,p,opp))return {error:'NO_TARGET'}}
 }else if(id==='DM-012'){
  if(k===0&&target>=0){const os=monsterState(opp,target);os.flags.petrifiedUntil=room.duel.turn+1;os.flags.attackDisabledUntil=room.duel.turn+1;st.atkMod+=500;st.defMod+=500}
  else if(k===1)st.flags.reflectUntil=room.duel.turn+1;
  else if(k===2){const n=opp.monsters.filter((x,i)=>x&&monsterState(opp,i).flags.petrifiedUntil>=room.duel.turn).length,b=Math.min(2000,n*500);st.atkMod+=b;st.defMod+=b}
 }else if(id==='DM-018'){
  if(k===0){opp.monsters.forEach((x,i)=>{if(x)monsterState(opp,i).atkMod-=1500});damagePlayer(room,opp,2500,p.seat)}
  else if(k===1){const gods=[...p.monsters,...p.grave].filter(x=>x&&hasTag(x,'DIVINA')).length;st.atkMod+=Math.max(1000,gods*1000)}
  else if(k===2)p.monsters.forEach((x,i)=>{if(x){monsterState(p,i).defMod+=1000;monsterState(p,i).flags.protectedUntil=room.duel.turn+1}});
  else if(k===3){if(!abilityCost(st,3))return {error:'ENERGY'};opp.monsters.forEach((x,i)=>{if(x&&effectiveStats(room,opp,i).atk<=4000)destroyMonster(room,opp,i,{sourceSeat:p.seat,reason:'BIFROST'})});damagePlayer(room,opp,4000,p.seat);st.ultimateUsed=true}
 }else return {error:'NO_ABILITY_HANDLER'};
 st.uses++;duelLog(room,'ABILITY',p.seat,{id,index:k,name:c.abilities?.[k]||'Habilidad'});return {ok:true}
}
function afterAttackEffects(room,p,zone,killed){
 const id=p.monsters[zone];if(!id)return;const st=monsterState(p,zone),opp=duelPlayer(room,duelOpponentSeat(p.seat));
 if(st.equipment.weapon==='DM-015'){damagePlayer(room,opp,1000,p.seat);if(killed&&(id==='DM-004'||id==='DM-018'))st.flags.extraAttacks=(st.flags.extraAttacks||0)+1}
 if(st.equipment.weapon==='DM-017'){for(const k of ['petrifiedUntil','attackDisabledUntil','aphroditeLockUntil'])delete st.flags[k]}
 if(id==='DM-001'&&st.flags.chainThunderUntil>=room.duel.turn){let n=0;opp.monsters.forEach((x,i)=>{if(x){monsterState(opp,i).defMod-=4000;n++}});if(n)damagePlayer(room,opp,Math.min(8000,n*4000),p.seat);drawOne(p);st.flags.chainThunderUntil=0}
}
function finishDuel(room,winnerSeat,reason){room.duel.winnerSeat=winnerSeat;room.duel.phase='END';room.status='ENDED';room.result={reason,winnerSeat};duelLog(room,'DUEL_END','SYSTEM',{winnerSeat,reason});pushEvent(room,'DUEL_END','SYSTEM',{winnerSeat,reason})}
function startTurn(room,p){
 p.attacked=[];p.summonedThisTurn=false;drawOne(p);
 p.monsters.forEach((id,i)=>{if(!id)return;const st=monsterState(p,i);st.fieldTurns++;if(id==='DM-004')st.charges=Math.min(5,st.charges+1);if(id==='DM-002')st.flags.extraAttacks=1});archetypeTurnStart(room,p);
}
function applyDuelAction(room,p,body){
 const duel=room.duel;if(!duel||duel.phase==='END')return {error:'DUEL_NOT_ACTIVE'};
 const seat=p.seat,me=duelPlayer(room,seat),opp=duelPlayer(room,duelOpponentSeat(seat));
 if(body.duelAction==='concede'){finishDuel(room,duelOpponentSeat(seat),'CONCEDE');return {ok:true}}
 if(duel.activeSeat!==seat)return {error:'NOT_YOUR_TURN'};
 if(body.duelAction==='play'){
   const cardId=String(body.cardId||''),card=catalogCard(cardId),hi=findHand(me,cardId),zone=Number(body.zone);
   if(!card||hi<0||!Number.isInteger(zone)||zone<0||zone>4)return {error:'INVALID_PLAY'};
   if(card.kind==='MONSTER'){
     if(card.specialOnly)return {error:'SPECIAL_SUMMON_ONLY'};
     if(me.summonedThisTurn)return {error:'SUMMON_ALREADY_USED'};
     if(me.monsters[zone])return {error:'ZONE_OCCUPIED'};
     me.monsters[zone]=cardId;me.cardState[zone]=initMonsterState(cardId);me.summonedThisTurn=true;
   }else{
     if(me.supports[zone])return {error:'ZONE_OCCUPIED'};
     me.supports[zone]={id:cardId,faceDown:Boolean(body.faceDown),active:false};
   }
   me.hand.splice(hi,1);duelLog(room,'PLAY',seat,{cardId,zone,kind:card.kind,faceDown:Boolean(body.faceDown)});
   if(card.kind==='MONSTER'){tryHunterTrap(room,me,zone);archetypeOnSummon(room,me,zone)}
   return {ok:true};
 }
 if(body.duelAction==='activate_support')return resolveArchetypeSupport(room,me,body);
 if(body.duelAction==='ability')return resolveArchetypeAbility(room,me,Number(body.from),false);
 if(body.duelAction==='ultimate')return resolveArchetypeAbility(room,me,Number(body.from),true);
 if(body.duelAction==='attack'){
   const from=Number(body.from),target=body.target===null||body.target===undefined?null:Number(body.target);
   if(!Number.isInteger(from)||from<0||from>4||!me.monsters[from])return {error:'INVALID_ATTACKER'};
   const ast=monsterState(me,from);if(ast.flags.petrifiedUntil>=duel.turn||ast.flags.attackDisabledUntil>=duel.turn)return {error:'ATTACK_DISABLED'};
   const already=me.attacked.includes(from),unlimited=ast.flags.unlimitedAttacksUntil>=duel.turn;
   if(already&&!unlimited){if((ast.flags.extraAttacks||0)>0)ast.flags.extraAttacks--;else return {error:'ALREADY_ATTACKED'}}
   if(tryTitanTrap(room,me,from)){if(!already)me.attacked.push(from);return {ok:true,trap:true}}
   const archTrap=archetypeAttackTrap(room,me,from,target);if(archTrap==='CANCEL'){if(!already)me.attacked.push(from);return {ok:true,trap:true}}
   const attackerId=me.monsters[from],a=effectiveStats(room,me,from).atk;
   const occupied=opp.monsters.map((x,i)=>x?i:null).filter(x=>x!==null);
   if(target===null){
     const directAllowed=ast.flags.directUntil>=duel.turn;
     if(occupied.length&&!directAllowed)return {error:'DIRECT_BLOCKED'};
     const directDamage=already&&ast.equipment.weapon==='IDR-017'?Math.min(1500,a):a;damagePlayer(room,opp,directDamage,seat);if(!already)me.attacked.push(from);duelLog(room,'DIRECT_ATTACK',seat,{attackerId,damage:directDamage});afterAttackEffects(room,me,from,false);archetypeAfterAttack(room,me,from,false,opp,null);return {ok:true};
   }
   if(!Number.isInteger(target)||target<0||target>4||!opp.monsters[target])return {error:'INVALID_TARGET'};
   const defenderId=opp.monsters[target];let d=effectiveStats(room,opp,target).atk;if(ast.equipment.weapon==='IDR-016'&&!ast.flags.idrPierceUsed){d=Math.floor(effectiveStats(room,opp,target).def*.5);ast.flags.idrPierceUsed=true}if(!already)me.attacked.push(from);let killed=false;
   if(a>d){const banish=ast.equipment.weapon==='DM-013';killed=destroyMonster(room,opp,target,{banish,attackerSeat:seat,sourceSeat:seat,reason:'BATTLE'});if(killed)damagePlayer(room,opp,a-d,seat);duelLog(room,'BATTLE_WIN',seat,{attackerId,defenderId,damage:killed?a-d:0,target})}
   else if(a<d){const dead=destroyMonster(room,me,from,{attackerSeat:opp.seat,sourceSeat:opp.seat,reason:'BATTLE'});if(dead)damagePlayer(room,me,d-a,opp.seat);duelLog(room,'BATTLE_LOSS',seat,{attackerId,defenderId,damage:dead?d-a:0,target})}
   else{const aDead=destroyMonster(room,me,from,{attackerSeat:opp.seat,sourceSeat:opp.seat,reason:'BATTLE'}),dDead=destroyMonster(room,opp,target,{attackerSeat:seat,sourceSeat:seat,reason:'BATTLE'});killed=dDead;duelLog(room,'BATTLE_DRAW',seat,{attackerId,defenderId,target,aDead,dDead})}
   if(me.monsters[from]){afterAttackEffects(room,me,from,killed);archetypeAfterAttack(room,me,from,killed,opp,target)}
   return {ok:true};
 }
 if(body.duelAction==='end_turn'){
   const next=duelOpponentSeat(seat);duel.turn+=1;duel.activeSeat=next;duel.phase='MAIN';startTurn(room,duelPlayer(room,next));duelLog(room,'TURN_END',seat,{next});return {ok:true};
 }
 return {error:'UNKNOWN_DUEL_ACTION'};
}

async function redisClient(){
 if(!hasRedisCloud())return null;
 if(!globalThis.__NEMESIS_REDIS_CLIENT){
  const {createClient}=require('redis');
  const client=createClient({url:REDIS_URL,socket:{connectTimeout:5000,reconnectStrategy:retries=>Math.min(250+retries*250,2500)}});
  client.on('error',err=>console.error('NEMESIS_REDIS',err?.message||err));
  globalThis.__NEMESIS_REDIS_CLIENT=client;
 }
 const client=globalThis.__NEMESIS_REDIS_CLIENT;
 if(!client.isOpen)await client.connect();
 return client;
}
async function restKv(command,...args){
 if(!hasRestKv())return null;
 const r=await fetch(REST_URL,{method:'POST',headers:{Authorization:'Bearer '+REST_TOKEN,'Content-Type':'application/json'},body:JSON.stringify([command,...args])});
 if(!r.ok)throw new Error('REST_KV '+r.status);
 const j=await r.json();
 return j.result;
}
async function persistentGet(key){
 if(hasRedisCloud()){const c=await redisClient();return c.get(key)}
 if(hasRestKv())return restKv('GET',key);
 return null;
}
async function persistentSet(key,value,ttlMs){
 if(hasRedisCloud()){const c=await redisClient();return c.set(key,value,{PX:ttlMs})}
 if(hasRestKv())return restKv('SET',key,value,'PX',String(ttlMs));
 return null;
}
async function persistentDel(key){
 if(hasRedisCloud()){const c=await redisClient();return c.del(key)}
 if(hasRestKv())return restKv('DEL',key);
 return null;
}
async function readRoom(c){
 c=String(c||'').toUpperCase();
 let room=null;
 if(hasPersistentStorage()){const raw=await persistentGet(roomKey(c));if(raw)room=JSON.parse(raw)}
 else room=MEMORY.get(c)||null;
 if(room&&room.expiresAt<now()){await deleteRoom(c);return null}
 return room;
}
async function writeRoom(room){
 room.updatedAt=now();
 room.expiresAt=now()+ROOM_TTL_MS;
 room.version=(room.version||0)+1;
 if(hasPersistentStorage())await persistentSet(roomKey(room.code),JSON.stringify(room),ROOM_TTL_MS);
 else MEMORY.set(room.code,room);
 return room;
}
async function deleteRoom(c){
 if(hasPersistentStorage())await persistentDel(roomKey(c));
 else MEMORY.delete(c);
}
function playerByToken(room,token){
 const h=tokenHash(token);
 return room.players.find(p=>p.tokenHash===h);
}
function publicRoom(room,token){
 const me=playerByToken(room,token);
 if(!me)return null;
 const t=now();
 return {
  code:room.code,status:room.status,version:room.version,createdAt:room.createdAt,updatedAt:room.updatedAt,
  serverTime:t,transport:storageMode(),persistent:hasPersistentStorage(),tickMs:1200,
  me:{id:me.id,seat:me.seat,name:me.name,ready:me.ready,connected:t-me.lastSeen<10000,deckName:me.deckName||'DUEL_MASTER',deckClass:me.deckClass||'LEGACY'},
  players:room.players.map(p=>({id:p.id,seat:p.seat,name:p.name,ready:p.ready,connected:t-p.lastSeen<10000,deckName:p.deckName||'DUEL_MASTER',deckClass:p.deckClass||'LEGACY'})),
  countdownAt:room.countdownAt||null,result:room.result||null,
  events:(room.events||[]).slice(-40).map(e=>({seq:e.seq,type:e.type,seat:e.seat,at:e.at,payload:e.payload})),
  duel:sanitizeDuel(room,me.seat)
 };
}
function pushEvent(room,type,seat,payload={}){
 room.seq=(room.seq||0)+1;
 room.events=room.events||[];
 room.events.push({seq:room.seq,type,seat,at:now(),payload});
 if(room.events.length>120)room.events=room.events.slice(-120);
}
function cors(res){
 res.setHeader('Access-Control-Allow-Origin','*');
 res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 res.setHeader('Cache-Control','no-store');
}
module.exports=async function handler(req,res){
 cors(res);
 if(req.method==='OPTIONS')return res.status(204).end();
 try{
  if(req.method==='GET'&&req.query?.action==='health'){
   if(hasRedisCloud()){
    try{const c=await redisClient();await c.ping()}catch(err){return res.status(503).json({ok:false,service:'NEMESIS ONLINE 1V1',authority:'server',storage:'REDIS_CLOUD_ERROR',persistent:false,error:'REDIS_UNAVAILABLE',time:now()})}
   }
   return res.status(storageReady()?200:503).json({ok:storageReady(),service:'NEMESIS ONLINE 1V1',authority:'server',storage:storageMode(),persistent:hasPersistentStorage(),production:isProduction(),ownerAuthReady:ownerAuthReady(),time:now()});
  }

  if(req.method==='POST'){
   const authBody=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
   if(authBody.action==='owner_verify'){
    const owner=ownerAuth.verifyRequest(req)||(!isProduction()&&verifyOwnerToken(authBody.ownerToken));return res.status(owner?200:403).json({ok:owner,owner,error:owner?undefined:'OWNER_AUTH_INVALID'});
   }
   if(authBody.action==='engine_audit'){
    return res.status(200).json({ok:true,mode:'MULTI_DECK',engines:onlineEngineAudit(),ownerAuthReady:ownerAuthReady()});
   }
   if(authBody.action==='engine_probe'&&!isProduction()){
    const runtime=onlineRuntimeProbe();return res.status(200).json({ok:runtime.MAGO_ROJO.ok&&runtime.IMPERIO_DRAGON.ok,runtime});
   }
  }
  if(!storageReady())return res.status(503).json({ok:false,error:'PERSISTENCE_REQUIRED'});
  if(req.method==='GET'){
   const room=await readRoom(req.query?.room);
   if(!room)return res.status(404).json({ok:false,error:'ROOM_NOT_FOUND'});
   const p=playerByToken(room,req.query?.token);
   if(!p)return res.status(403).json({ok:false,error:'INVALID_SESSION'});
   p.lastSeen=now();
   await writeRoom(room);
   return res.status(200).json({ok:true,room:publicRoom(room,req.query.token)});
  }
  if(req.method!=='POST')return res.status(405).json({ok:false,error:'METHOD'});
  const b=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
  if(b.action==='create'){
   let c;do{c=code()}while(await readRoom(c));
   const token=id(),pid=id(10),t=now(),meta=playerDeckMeta(b,req);if(meta.error)return res.status(403).json({ok:false,error:meta.error});
   const room={code:c,status:'WAITING',createdAt:t,updatedAt:t,expiresAt:t+ROOM_TTL_MS,version:0,seq:0,players:[{id:pid,tokenHash:tokenHash(token),seat:'HOST',name:cleanName(b.name),ready:false,lastSeen:t,...meta}],events:[]};
   pushEvent(room,'ROOM_CREATED','SYSTEM');
   await writeRoom(room);
   return res.status(201).json({ok:true,token,room:publicRoom(room,token)});
  }
  if(b.action==='join'){
   const c=String(b.code||'').toUpperCase().trim(),room=await readRoom(c);
   if(!room)return res.status(404).json({ok:false,error:'ROOM_NOT_FOUND'});
   if(room.players.length>=2)return res.status(409).json({ok:false,error:'ROOM_FULL'});
   const token=id(),t=now(),meta=playerDeckMeta(b,req);if(meta.error)return res.status(403).json({ok:false,error:meta.error});
   room.players.push({id:id(10),tokenHash:tokenHash(token),seat:'GUEST',name:cleanName(b.name),ready:false,lastSeen:t,...meta});
   room.status='READY';
   pushEvent(room,'PLAYER_JOINED','GUEST');
   await writeRoom(room);
   return res.status(200).json({ok:true,token,room:publicRoom(room,token)});
  }
  const room=await readRoom(b.code);
  if(!room)return res.status(404).json({ok:false,error:'ROOM_NOT_FOUND'});
  const p=playerByToken(room,b.token);
  if(!p)return res.status(403).json({ok:false,error:'INVALID_SESSION'});
  p.lastSeen=now();
  if(b.action==='heartbeat'){
   await writeRoom(room);
   return res.status(200).json({ok:true,room:publicRoom(room,b.token)});
  }
  if(b.action==='ready'){
   p.ready=Boolean(b.ready);
   pushEvent(room,p.ready?'PLAYER_READY':'PLAYER_NOT_READY',p.seat);
   if(room.players.length===2&&room.players.every(x=>x.ready)&&room.status!=='ACTIVE'){
    room.status='COUNTDOWN';
    room.countdownAt=now()+3000;
    pushEvent(room,'COUNTDOWN','SYSTEM',{ms:3000});
   }else if(room.status==='COUNTDOWN'){
    room.status='READY';
    room.countdownAt=null;
   }
   await writeRoom(room);
   return res.status(200).json({ok:true,room:publicRoom(room,b.token)});
  }
  if(b.action==='sync'){
   if(room.status==='COUNTDOWN'&&room.countdownAt&&now()>=room.countdownAt){
    room.status='ACTIVE';
    initDuel(room);
    pushEvent(room,'MATCH_ACTIVE','SYSTEM');
   }
   await writeRoom(room);
   return res.status(200).json({ok:true,room:publicRoom(room,b.token)});
  }
  if(b.action==='duel'){
   if(room.status!=='ACTIVE'&&room.status!=='ENDED')return res.status(409).json({ok:false,error:'MATCH_NOT_ACTIVE'});
   if(!room.duel&&room.status==='ACTIVE')initDuel(room);
   const result=applyDuelAction(room,p,b);
   if(result.error)return res.status(409).json({ok:false,error:result.error});
   await writeRoom(room);
   return res.status(200).json({ok:true,room:publicRoom(room,b.token)});
  }
  if(b.action==='event'){
   if(room.status!=='ACTIVE')return res.status(409).json({ok:false,error:'MATCH_NOT_ACTIVE'});
   const type=String(b.type||'').toUpperCase();
   const allowed=new Set(['CLIENT_READY_FOR_DUELMASTER','PING_MARK','EMOTE']);
   if(!allowed.has(type))return res.status(400).json({ok:false,error:'EVENT_NOT_ALLOWED'});
   pushEvent(room,type,p.seat,typeof b.payload==='object'&&b.payload?b.payload:{});
   await writeRoom(room);
   return res.status(200).json({ok:true,room:publicRoom(room,b.token)});
  }
  if(b.action==='leave'){
   pushEvent(room,'PLAYER_LEFT',p.seat);
   room.status='ENDED';
   room.result={reason:'LEAVE',winnerSeat:room.players.find(x=>x.id!==p.id)?.seat||null};
   await writeRoom(room);
   return res.status(200).json({ok:true});
  }
  return res.status(400).json({ok:false,error:'UNKNOWN_ACTION'});
 }catch(err){
  console.error('NEMESIS_ONLINE_1V1',err);
  return res.status(500).json({ok:false,error:'SERVER_ERROR'});
 }
};
