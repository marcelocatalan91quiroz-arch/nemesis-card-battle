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
  events:(room.events||[]).slice(-40).map(e=>({seq:e.seq,type:e.type,seat:e.seat,at:e.at,payload:e.payload}))
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
    pushEvent(room,'MATCH_ACTIVE','SYSTEM');
   }
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
