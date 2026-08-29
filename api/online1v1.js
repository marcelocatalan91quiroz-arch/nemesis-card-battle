const crypto=require('crypto');

const ROOM_TTL_MS=1000*60*60*2;
const MEMORY=globalThis.__NEMESIS_ONLINE_ROOMS||(globalThis.__NEMESIS_ONLINE_ROOMS=new Map());
const KV_URL=process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL||'';
const KV_TOKEN=process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN||'';
const hasKv=()=>Boolean(KV_URL&&KV_TOKEN);
const isProduction=()=>process.env.VERCEL_ENV==='production'||process.env.NODE_ENV==='production';
const storageMode=()=>hasKv()?'PERSISTENT_KV':(isProduction()?'PERSISTENCE_REQUIRED':'FLUID_MEMORY_DEV');
const storageReady=()=>hasKv()||!isProduction();
const now=()=>Date.now();
const code=()=>Array.from({length:6},()=> 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[crypto.randomInt(0,32)]).join('');
const id=(n=18)=>crypto.randomBytes(n).toString('base64url');
const cleanName=v=>String(v||'Jugador').replace(/[<>]/g,'').trim().slice(0,24)||'Jugador';
const roomKey=c=>'nemesis:online1v1:'+c;

async function kv(command,...args){
 if(!hasKv())return null;
 const r=await fetch(KV_URL,{method:'POST',headers:{Authorization:'Bearer '+KV_TOKEN,'Content-Type':'application/json'},body:JSON.stringify([command,...args])});
 if(!r.ok)throw new Error('KV '+r.status);
 const j=await r.json();return j.result;
}
async function readRoom(c){
 c=String(c||'').toUpperCase();
 let room=null;
 if(hasKv()){const raw=await kv('GET',roomKey(c));if(raw)room=JSON.parse(raw)}
 else room=MEMORY.get(c)||null;
 if(room&&room.expiresAt<now()){await deleteRoom(c);return null}
 return room;
}
async function writeRoom(room){
 room.updatedAt=now();room.version=(room.version||0)+1;
 if(hasKv())await kv('SET',roomKey(room.code),JSON.stringify(room),'PX',String(ROOM_TTL_MS));
 else MEMORY.set(room.code,room);
 return room;
}
async function deleteRoom(c){if(hasKv())await kv('DEL',roomKey(c));else MEMORY.delete(c)}
function playerByToken(room,token){return room.players.find(p=>p.token===token)}
function publicRoom(room,token){
 const me=playerByToken(room,token);
 if(!me)return null;
 const t=now();
 return {
  code:room.code,status:room.status,version:room.version,createdAt:room.createdAt,updatedAt:room.updatedAt,
  serverTime:t,transport:storageMode(),persistent:hasKv(),tickMs:1200,
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
 cors(res);if(req.method==='OPTIONS')return res.status(204).end();
 try{
  if(req.method==='GET'&&req.query?.action==='health')return res.status(storageReady()?200:503).json({ok:storageReady(),service:'NEMESIS ONLINE 1V1',authority:'server',storage:storageMode(),persistent:hasKv(),production:isProduction(),time:now()});
  if(!storageReady())return res.status(503).json({ok:false,error:'PERSISTENCE_REQUIRED',message:'Configure KV_REST_API_URL/KV_REST_API_TOKEN or UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN before enabling production multiplayer.'});
  if(req.method==='GET'){
   const room=await readRoom(req.query?.room);if(!room)return res.status(404).json({ok:false,error:'ROOM_NOT_FOUND'});
   const view=publicRoom(room,req.query?.token);if(!view)return res.status(403).json({ok:false,error:'INVALID_SESSION'});
   const p=playerByToken(room,req.query.token);p.lastSeen=now();await writeRoom(room);
   return res.status(200).json({ok:true,room:view});
  }
  if(req.method!=='POST')return res.status(405).json({ok:false,error:'METHOD'});
  const b=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
  if(b.action==='create'){
   let c;do{c=code()}while(await readRoom(c));
   const token=id(),pid=id(10),t=now();
   const room={code:c,status:'WAITING',createdAt:t,updatedAt:t,expiresAt:t+ROOM_TTL_MS,version:0,seq:0,players:[{id:pid,token,seat:'HOST',name:cleanName(b.name),ready:false,lastSeen:t}],events:[]};
   pushEvent(room,'ROOM_CREATED','SYSTEM');await writeRoom(room);
   return res.status(201).json({ok:true,token,room:publicRoom(room,token)});
  }
  if(b.action==='join'){
   const c=String(b.code||'').toUpperCase().trim(),room=await readRoom(c);
   if(!room)return res.status(404).json({ok:false,error:'ROOM_NOT_FOUND'});
   if(room.players.length>=2)return res.status(409).json({ok:false,error:'ROOM_FULL'});
   const token=id(),t=now();
   room.players.push({id:id(10),token,seat:'GUEST',name:cleanName(b.name),ready:false,lastSeen:t});
   room.status='READY';pushEvent(room,'PLAYER_JOINED','GUEST');await writeRoom(room);
   return res.status(200).json({ok:true,token,room:publicRoom(room,token)});
  }
  const room=await readRoom(b.code);if(!room)return res.status(404).json({ok:false,error:'ROOM_NOT_FOUND'});
  const p=playerByToken(room,b.token);if(!p)return res.status(403).json({ok:false,error:'INVALID_SESSION'});
  p.lastSeen=now();
  if(b.action==='heartbeat'){await writeRoom(room);return res.status(200).json({ok:true,room:publicRoom(room,b.token)})}
  if(b.action==='ready'){
   p.ready=Boolean(b.ready);pushEvent(room,p.ready?'PLAYER_READY':'PLAYER_NOT_READY',p.seat);
   if(room.players.length===2&&room.players.every(x=>x.ready)&&room.status!=='ACTIVE'){
    room.status='COUNTDOWN';room.countdownAt=now()+3000;pushEvent(room,'COUNTDOWN','SYSTEM',{ms:3000});
   }else if(room.status==='COUNTDOWN'){room.status='READY';room.countdownAt=null}
   await writeRoom(room);return res.status(200).json({ok:true,room:publicRoom(room,b.token)});
  }
  if(b.action==='sync'){
   if(room.status==='COUNTDOWN'&&room.countdownAt&&now()>=room.countdownAt){room.status='ACTIVE';pushEvent(room,'MATCH_ACTIVE','SYSTEM')}
   await writeRoom(room);return res.status(200).json({ok:true,room:publicRoom(room,b.token)});
  }
  if(b.action==='event'){
   if(room.status!=='ACTIVE')return res.status(409).json({ok:false,error:'MATCH_NOT_ACTIVE'});
   const type=String(b.type||'').toUpperCase();
   const allowed=new Set(['CLIENT_READY_FOR_DUELMASTER','PING_MARK','EMOTE']);
   if(!allowed.has(type))return res.status(400).json({ok:false,error:'EVENT_NOT_ALLOWED'});
   pushEvent(room,type,p.seat,typeof b.payload==='object'&&b.payload?b.payload:{});
   await writeRoom(room);return res.status(200).json({ok:true,room:publicRoom(room,b.token)});
  }
  if(b.action==='leave'){
   pushEvent(room,'PLAYER_LEFT',p.seat);room.status='ENDED';room.result={reason:'LEAVE',winnerSeat:room.players.find(x=>x.id!==p.id)?.seat||null};
   await writeRoom(room);return res.status(200).json({ok:true});
  }
  return res.status(400).json({ok:false,error:'UNKNOWN_ACTION'});
 }catch(err){console.error('NEMESIS_ONLINE_1V1',err);return res.status(500).json({ok:false,error:'SERVER_ERROR'})}
};
