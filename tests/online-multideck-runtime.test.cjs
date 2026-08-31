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
 for(const name of ['DUEL_MASTER','MAGO_ROJO','IMPERIO_DRAGON','CABALLEROS_SUBMUNDO']){assert.equal(audit.payload.engines[name].count,20,name+' 20 cartas');assert.equal(audit.payload.engines[name].all,true,name+' handlers')}assert.equal(audit.payload.engines.OLIMPO.count,11,'OLIMPO 11 cartas');assert.equal(audit.payload.engines.OLIMPO.all,true,'OLIMPO handlers')
 const probe=await invoke(online,{body:{action:'engine_probe'}});
 assert.equal(probe.status,200);if(!probe.payload.ok)console.error('ENGINE_PROBE_FAIL',JSON.stringify(Object.fromEntries(Object.entries(probe.payload.runtime).map(([k,v])=>[k,v.cards.filter(x=>!x.ok)]))));assert.equal(probe.payload.ok,true);
 assert.equal(probe.payload.runtime.MAGO_ROJO.count,20);assert.equal(probe.payload.runtime.MAGO_ROJO.ok,true);
 assert.equal(probe.payload.runtime.IMPERIO_DRAGON.count,20);assert.equal(probe.payload.runtime.IMPERIO_DRAGON.ok,true);
 assert.equal(probe.payload.runtime.OLIMPO.count,11);assert.equal(probe.payload.runtime.OLIMPO.ok,true);
 assert.equal(probe.payload.runtime.CABALLEROS_SUBMUNDO.count,20);assert.equal(probe.payload.runtime.CABALLEROS_SUBMUNDO.ok,true);
 assert.equal(probe.payload.runtime.ECLIPSE_MS001.count,1);assert.equal(probe.payload.runtime.ECLIPSE_MS001.ok,true);
 for(const v of Object.values(probe.payload.runtime))assert.deepEqual(v.cards.filter(x=>!x.ok),[]);

 const dmDenied=await invoke(online,{body:{action:'create',name:'NoOwner',deckName:'DUEL_MASTER'}});
 assert.equal(dmDenied.status,403);assert.equal(dmDenied.payload.error,'OWNER_AUTH_REQUIRED');

 const login=await invoke(owner,{body:{action:'login',key:process.env.NEMESIS_OWNER_KEY}});const cookie=String(login.headers['set-cookie']).split(';')[0];assert.ok(cookie.includes('nemesis_owner_session='));
 const dmAllowed=await invoke(online,{body:{action:'create',name:'Owner',deckName:'DUEL_MASTER'},cookie});
 assert.equal(dmAllowed.status,201);assert.equal(dmAllowed.payload.room.me.deckClass,'OWNER');
 const olAllowed=await invoke(online,{body:{action:'create',name:'OwnerOlimpo',deckName:'OLIMPO'},cookie});assert.equal(olAllowed.status,201);assert.equal(olAllowed.payload.room.me.deckName,'OLIMPO');
 const csAllowed=await invoke(online,{body:{action:'create',name:'OwnerCS',deckName:'CABALLEROS_SUBMUNDO'},cookie});assert.equal(csAllowed.status,201);assert.equal(csAllowed.payload.room.me.deckName,'CABALLEROS_SUBMUNDO');

 const invalid=await invoke(online,{body:{action:'create',name:'Trampa',deckName:'MAGO_ROJO',deckIds:['MGR-001','MS-001']}});assert.equal(invalid.status,403);assert.equal(invalid.payload.error,'ONLINE_REDEEM_PROOF_REQUIRED');
 const mgr=await invoke(online,{body:{action:'create',name:'Rojo',deckName:'MAGO_ROJO',deckIds:['MGR-001','MGR-002','MGR-003','MGR-004','MGR-005']}});assert.equal(mgr.status,201);assert.equal(mgr.payload.room.me.deckName,'MAGO_ROJO');
 const idr=await invoke(online,{body:{action:'join',name:'Dragon',code:mgr.payload.room.code,deckName:'IMPERIO_DRAGON'}});assert.equal(idr.status,200);assert.equal(idr.payload.room.me.deckName,'IMPERIO_DRAGON');
 console.log('NÉMESIS ONLINE MULTIMAZO 20/20 + OWNER AUTH: PASS');
})().catch(e=>{console.error(e);process.exit(1)});
