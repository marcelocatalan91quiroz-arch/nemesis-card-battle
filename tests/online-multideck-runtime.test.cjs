const assert=require('assert');
delete process.env.VERCEL_ENV;
delete process.env.NODE_ENV;
delete process.env.REDIS_URL;
delete process.env.KV_REST_API_URL;
delete process.env.KV_REST_API_TOKEN;
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;
process.env.NEMESIS_OWNER_KEY='nemesis-owner-key-test-2026';
process.env.NEMESIS_OWNER_SIGNING_SECRET='nemesis-owner-signing-secret-test-2026-very-long';
const online=require('../api/online1v1.js');
const owner=require('../api/owner-auth.js');

function invoke(handler,{method='POST',query={},body={},cookie=''}={}){
 return new Promise((resolve,reject)=>{
  const headers={};const req={method,query,body,headers:{cookie,'x-forwarded-proto':'https'}};
  const res={statusCode:200,setHeader(k,v){headers[k.toLowerCase()]=v},status(n){this.statusCode=n;return this},json(payload){resolve({status:this.statusCode,headers,payload});return this},end(){resolve({status:this.statusCode,headers,payload:null});return this}};
  Promise.resolve(handler(req,res)).catch(reject);
 });
}
(async()=>{
 const audit=await invoke(online,{body:{action:'engine_audit'}});
 assert.equal(audit.status,200);
 for(const name of ['DUEL_MASTER','MAGO_ROJO','IMPERIO_DRAGON']){assert.equal(audit.payload.engines[name].count,20,name+' 20 cartas');assert.equal(audit.payload.engines[name].all,true,name+' handlers')}
 const probe=await invoke(online,{body:{action:'engine_probe'}});
 assert.equal(probe.status,200);assert.equal(probe.payload.ok,true);
 assert.equal(probe.payload.runtime.MAGO_ROJO.count,20);assert.equal(probe.payload.runtime.MAGO_ROJO.ok,true);
 assert.equal(probe.payload.runtime.IMPERIO_DRAGON.count,20);assert.equal(probe.payload.runtime.IMPERIO_DRAGON.ok,true);
 const badMgr=probe.payload.runtime.MAGO_ROJO.cards.filter(x=>!x.ok);const badIdr=probe.payload.runtime.IMPERIO_DRAGON.cards.filter(x=>!x.ok);assert.deepEqual(badMgr,[]);assert.deepEqual(badIdr,[]);

 const dmDenied=await invoke(online,{body:{action:'create',name:'NoOwner',deckName:'DUEL_MASTER'}});
 assert.equal(dmDenied.status,403);assert.equal(dmDenied.payload.error,'OWNER_AUTH_REQUIRED');

 const login=await invoke(owner,{body:{action:'login',key:process.env.NEMESIS_OWNER_KEY}});const cookie=String(login.headers['set-cookie']).split(';')[0];assert.ok(cookie.includes('nemesis_owner_session='));
 const dmAllowed=await invoke(online,{body:{action:'create',name:'Owner',deckName:'DUEL_MASTER'},cookie});
 assert.equal(dmAllowed.status,201);assert.equal(dmAllowed.payload.room.me.deckClass,'OWNER');

 const mgr=await invoke(online,{body:{action:'create',name:'Rojo',deckName:'MAGO_ROJO'}});assert.equal(mgr.status,201);assert.equal(mgr.payload.room.me.deckName,'MAGO_ROJO');
 const idr=await invoke(online,{body:{action:'join',name:'Dragon',code:mgr.payload.room.code,deckName:'IMPERIO_DRAGON'}});assert.equal(idr.status,200);assert.equal(idr.payload.room.me.deckName,'IMPERIO_DRAGON');
 console.log('NÉMESIS ONLINE MULTIMAZO 20/20 + OWNER AUTH: PASS');
})().catch(e=>{console.error(e);process.exit(1)});
