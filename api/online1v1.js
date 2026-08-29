const crypto=require('crypto');

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
 'DM-001':{name:'El Gran Zeus — Soberano del Juicio',kind:'MONSTER',atk:20000,def:18000,img:'assets/images/external33/dm-001.svg'},
 'DM-002':{name:'Dragón Dorado — Emperador Celestial',kind:'MONSTER',atk:20000,def:18000,img:'assets/images/external33/dm-002.svg'},
 'DM-003':{name:'Oráculo de Delfos — La Visión Inevitable',kind:'MONSTER',atk:12000,def:11000,img:'assets/images/external33/dm-003.svg'},
 'DM-004':{name:'Thor — Heredero de la Tormenta',kind:'MONSTER',atk:15000,def:13000,img:'assets/images/external33/dm-004.svg'},
 'DM-005':{name:'Orígenes — Antes del Primer Dios',kind:'SUPPORT',atk:0,def:0,img:'assets/images/external33/dm-005.svg'},
 'DM-006':{name:'Cacería de Demonios — Sentencia del Cazador',kind:'SUPPORT',atk:0,def:0,img:'assets/images/external33/dm-006.svg'},
 'DM-007':{name:'Quetzalcóatl — Serpiente del Cielo Eterno',kind:'MONSTER',atk:13000,def:12000,img:'assets/images/external33/dm-007.svg'},
 'DM-008':{name:'Moctezuma — Emperador del Último Sol',kind:'MONSTER',atk:12500,def:10500,img:'assets/images/external33/dm-008.svg'},
 'DM-009':{name:'La Tirana — Reina del Pacto Oscuro',kind:'MONSTER',atk:0,def:0,img:'assets/images/external33/dm-009.svg'},
 'DM-010':{name:'Onkolxón — Espíritu del Fin Austral',kind:'MONSTER',atk:0,def:0,img:'assets/images/external33/dm-010.svg'},
 'DM-011':{name:'Alma de Afrodita',kind:'MONSTER',atk:8500,def:12000,img:'assets/images/external33/dm-011.svg'},
 'DM-012':{name:'Medusa',kind:'MONSTER',atk:9000,def:10500,img:'assets/images/external33/dm-012.svg'},
 'DM-013':{name:'Arma del Tártaro',kind:'SUPPORT',atk:0,def:0,img:'assets/images/external33/dm-013.svg'},
 'DM-014':{name:'Antorcha del Olimpo',kind:'SUPPORT',atk:0,def:0,img:'assets/images/external33/dm-014.svg'},
 'DM-015':{name:'Martillo de Thor',kind:'SUPPORT',atk:0,def:0,img:'assets/images/external33/dm-015.svg'},
 'DM-016':{name:'Corona del Dominio',kind:'SUPPORT',atk:0,def:0,img:'assets/images/external33/dm-016.svg'},
 'DM-017':{name:'Arma Santa',kind:'SUPPORT',atk:0,def:0,img:'assets/images/external33/dm-017.svg'},
 'DM-018':{name:'Thor Shiny — Señor de la Tormenta Eterna',kind:'MONSTER',atk:6000,def:4500,img:'assets/images/external33/dm-018.svg'},
 'DM-019':{name:'El Juicio de los Titanes',kind:'SUPPORT',atk:0,def:0,img:'assets/images/external33/dm-019.svg'},
 'DM-020':{name:'Eclipse de los Reinos',kind:'SUPPORT',atk:0,def:0,img:'assets/images/external33/dm-020.svg'}
};
const DM_DECK=Object.keys(DM_CATALOG);
const DM_START_HP=30000;
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=crypto.randomInt(0,i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function initDmPlayer(seat){
 const deck=shuffle(DM_DECK),hand=deck.splice(0,5);
 return {seat,hp:DM_START_HP,deck,hand,monsters:Array(5).fill(null),supports:Array(5).fill(null),grave:[],attacked:[],summonedThisTurn:false};
}
function initDuel(room){
 if(room.duel)return;
 room.duel={mode:'DUEL_MASTER',turn:1,activeSeat:'HOST',phase:'MAIN',winnerSeat:null,players:{HOST:initDmPlayer('HOST'),GUEST:initDmPlayer('GUEST')},log:[]};
 pushEvent(room,'DUELMASTER_BOARD_READY','SYSTEM',{deckSize:20,zones:{monsters:5,supports:5}});
}
function duelPlayer(room,seat){return room.duel?.players?.[seat]||null}
function duelOpponentSeat(seat){return seat==='HOST'?'GUEST':'HOST'}
function cardPublic(id){const c=DM_CATALOG[id];return c?{id,name:c.name,kind:c.kind,atk:c.atk,def:c.def,img:c.img}:null}
function sanitizeDuel(room,seat){
 if(!room.duel)return null;
 const me=duelPlayer(room,seat),opp=duelPlayer(room,duelOpponentSeat(seat));
 const exposeField=p=>({
   hp:p.hp,deckCount:p.deck.length,handCount:p.hand.length,graveCount:p.grave.length,
   monsters:p.monsters.map(id=>id?cardPublic(id):null),
   supports:p.supports.map(x=>x?{id:x.faceDown?null:x.id,faceDown:!!x.faceDown,card:x.faceDown?null:cardPublic(x.id)}:null)
 });
 return {
   mode:room.duel.mode,turn:room.duel.turn,activeSeat:room.duel.activeSeat,phase:room.duel.phase,winnerSeat:room.duel.winnerSeat,
   mySeat:seat,isMyTurn:room.duel.activeSeat===seat,
   me:{...exposeField(me),hand:me.hand.map(cardPublic),attacked:me.attacked.slice(),summonedThisTurn:me.summonedThisTurn},
   opponent:exposeField(opp),
   log:room.duel.log.slice(-30)
 };
}
function duelLog(room,type,seat,payload={}){room.duel.log.push({at:now(),type,seat,payload});if(room.duel.log.length>120)room.duel.log=room.duel.log.slice(-120)}
function drawOne(p){if(!p.deck.length)return null;const id=p.deck.shift();p.hand.push(id);return id}
function findHand(p,id){return p.hand.indexOf(id)}
function finishDuel(room,winnerSeat,reason){room.duel.winnerSeat=winnerSeat;room.duel.phase='END';room.status='ENDED';room.result={reason,winnerSeat};duelLog(room,'DUEL_END','SYSTEM',{winnerSeat,reason});pushEvent(room,'DUEL_END','SYSTEM',{winnerSeat,reason})}
function applyDuelAction(room,p,body){
 const duel=room.duel;if(!duel||duel.phase==='END')return {error:'DUEL_NOT_ACTIVE'};
 const seat=p.seat,me=duelPlayer(room,seat),opp=duelPlayer(room,duelOpponentSeat(seat));
 if(body.duelAction==='concede'){finishDuel(room,duelOpponentSeat(seat),'CONCEDE');return {ok:true}}
 if(duel.activeSeat!==seat)return {error:'NOT_YOUR_TURN'};
 if(body.duelAction==='play'){
   const cardId=String(body.cardId||''),card=DM_CATALOG[cardId],hi=findHand(me,cardId),zone=Number(body.zone);
   if(!card||hi<0||!Number.isInteger(zone)||zone<0||zone>4)return {error:'INVALID_PLAY'};
   if(card.kind==='MONSTER'){
     if(me.summonedThisTurn)return {error:'SUMMON_ALREADY_USED'};
     if(me.monsters[zone])return {error:'ZONE_OCCUPIED'};
     me.monsters[zone]=cardId;me.summonedThisTurn=true;
   }else{
     if(me.supports[zone])return {error:'ZONE_OCCUPIED'};
     me.supports[zone]={id:cardId,faceDown:Boolean(body.faceDown)};
   }
   me.hand.splice(hi,1);duelLog(room,'PLAY',seat,{cardId,zone,kind:card.kind,faceDown:Boolean(body.faceDown)});return {ok:true};
 }
 if(body.duelAction==='attack'){
   const from=Number(body.from),target=body.target===null||body.target===undefined?null:Number(body.target);
   if(!Number.isInteger(from)||from<0||from>4||!me.monsters[from])return {error:'INVALID_ATTACKER'};
   if(me.attacked.includes(from))return {error:'ALREADY_ATTACKED'};
   const attackerId=me.monsters[from],attacker=DM_CATALOG[attackerId];
   const occupied=opp.monsters.map((x,i)=>x?i:null).filter(x=>x!==null);
   if(target===null){
     if(occupied.length)return {error:'DIRECT_BLOCKED'};
     const damage=Math.max(0,attacker.atk||0);opp.hp=Math.max(0,opp.hp-damage);me.attacked.push(from);
     duelLog(room,'DIRECT_ATTACK',seat,{attackerId,damage});
     if(opp.hp<=0)finishDuel(room,seat,'HP_ZERO');
     return {ok:true};
   }
   if(!Number.isInteger(target)||target<0||target>4||!opp.monsters[target])return {error:'INVALID_TARGET'};
   const defenderId=opp.monsters[target],defender=DM_CATALOG[defenderId],a=attacker.atk||0,d=defender.atk||0;me.attacked.push(from);
   if(a>d){opp.monsters[target]=null;opp.grave.push(defenderId);opp.hp=Math.max(0,opp.hp-(a-d));duelLog(room,'BATTLE_WIN',seat,{attackerId,defenderId,damage:a-d,target})}
   else if(a<d){me.monsters[from]=null;me.grave.push(attackerId);me.hp=Math.max(0,me.hp-(d-a));duelLog(room,'BATTLE_LOSS',seat,{attackerId,defenderId,damage:d-a,target})}
   else{opp.monsters[target]=null;opp.grave.push(defenderId);me.monsters[from]=null;me.grave.push(attackerId);duelLog(room,'BATTLE_DRAW',seat,{attackerId,defenderId,target})}
   if(me.hp<=0)finishDuel(room,duelOpponentSeat(seat),'HP_ZERO');else if(opp.hp<=0)finishDuel(room,seat,'HP_ZERO');
   return {ok:true};
 }
 if(body.duelAction==='end_turn'){
   const next=duelOpponentSeat(seat);duel.turn+=1;duel.activeSeat=next;duel.phase='MAIN';
   const np=duelPlayer(room,next);np.attacked=[];np.summonedThisTurn=false;const drawn=drawOne(np);
   duelLog(room,'TURN_END',seat,{next,drawn:!!drawn});return {ok:true};
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
  me:{id:me.id,seat:me.seat,name:me.name,ready:me.ready,connected:t-me.lastSeen<10000},
  players:room.players.map(p=>({id:p.id,seat:p.seat,name:p.name,ready:p.ready,connected:t-p.lastSeen<10000})),
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
   return res.status(storageReady()?200:503).json({ok:storageReady(),service:'NEMESIS ONLINE 1V1',authority:'server',storage:storageMode(),persistent:hasPersistentStorage(),production:isProduction(),time:now()});
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
   const token=id(),pid=id(10),t=now();
   const room={code:c,status:'WAITING',createdAt:t,updatedAt:t,expiresAt:t+ROOM_TTL_MS,version:0,seq:0,players:[{id:pid,tokenHash:tokenHash(token),seat:'HOST',name:cleanName(b.name),ready:false,lastSeen:t}],events:[]};
   pushEvent(room,'ROOM_CREATED','SYSTEM');
   await writeRoom(room);
   return res.status(201).json({ok:true,token,room:publicRoom(room,token)});
  }
  if(b.action==='join'){
   const c=String(b.code||'').toUpperCase().trim(),room=await readRoom(c);
   if(!room)return res.status(404).json({ok:false,error:'ROOM_NOT_FOUND'});
   if(room.players.length>=2)return res.status(409).json({ok:false,error:'ROOM_FULL'});
   const token=id(),t=now();
   room.players.push({id:id(10),tokenHash:tokenHash(token),seat:'GUEST',name:cleanName(b.name),ready:false,lastSeen:t});
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
