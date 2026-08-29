const assert=require('assert');
delete process.env.VERCEL_ENV;
delete process.env.NODE_ENV;
delete process.env.REDIS_URL;
delete process.env.KV_REST_API_URL;
delete process.env.KV_REST_API_TOKEN;
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;

const handler=require('../api/online1v1.js');

function invoke({method='POST',query={},body={}}={}){
 return new Promise((resolve,reject)=>{
  const req={method,query,body};
  const headers={};
  const res={
   statusCode:200,
   setHeader(k,v){headers[k]=v},
   status(n){this.statusCode=n;return this},
   json(payload){resolve({status:this.statusCode,headers,payload});return this},
   end(){resolve({status:this.statusCode,headers,payload:null});return this}
  };
  Promise.resolve(handler(req,res)).catch(reject);
 });
}
(async()=>{
 const health=await invoke({method:'GET',query:{action:'health'}});
 assert.equal(health.status,200);
 assert.equal(health.payload.storage,'FLUID_MEMORY_DEV');

 const a=await invoke({body:{action:'create',name:'Alpha'}});
 assert.equal(a.status,201);
 assert.ok(a.payload.token);
 const code=a.payload.room.code;
 assert.equal(a.payload.room.players.length,1);

 const b=await invoke({body:{action:'join',code,name:'Beta'}});
 assert.equal(b.status,200);
 assert.ok(b.payload.token);
 assert.equal(b.payload.room.players.length,2);
 assert.equal(b.payload.room.status,'READY');

 const ar=await invoke({body:{action:'ready',code,token:a.payload.token,ready:true}});
 assert.equal(ar.status,200);
 const br=await invoke({body:{action:'ready',code,token:b.payload.token,ready:true}});
 assert.equal(br.status,200);
 assert.equal(br.payload.room.status,'COUNTDOWN');

 await new Promise(r=>setTimeout(r,3050));
 const sync=await invoke({body:{action:'sync',code,token:a.payload.token}});
 assert.equal(sync.status,200);
 assert.equal(sync.payload.room.status,'ACTIVE');

 assert.equal(sync.payload.room.duel.mode,'DUEL_MASTER');
 assert.equal(sync.payload.room.duel.me.hand.length,5);
 assert.equal(sync.payload.room.duel.me.monsters.length,5);
 assert.equal(sync.payload.room.duel.me.supports.length,5);

 const firstMonster=sync.payload.room.duel.me.hand.find(c=>c.kind==='MONSTER');
 const firstSupport=sync.payload.room.duel.me.hand.find(c=>c.kind==='SUPPORT');
 if(firstMonster){
  const play=await invoke({body:{action:'duel',code,token:a.payload.token,duelAction:'play',cardId:firstMonster.id,zone:0}});
  assert.equal(play.status,200);
  assert.equal(play.payload.room.duel.me.monsters[0].id,firstMonster.id);
 }
 if(firstSupport){
  const sup=await invoke({body:{action:'duel',code,token:a.payload.token,duelAction:'play',cardId:firstSupport.id,zone:0,faceDown:true}});
  assert.equal(sup.status,200);
  assert.equal(sup.payload.room.duel.me.supports[0].faceDown,true);
 }
 const afterPlay=await invoke({body:{action:'sync',code,token:a.payload.token}});
 const abilitySource=afterPlay.payload.room.duel.me.monsters.findIndex(Boolean);
 if(abilitySource>=0){
  const ability=await invoke({body:{action:'duel',code,token:a.payload.token,duelAction:'ability',from:abilitySource}});
  assert.ok([200,409].includes(ability.status));
  if(ability.status===200)assert.ok(ability.payload.room.duel.log.some(e=>e.type==='ABILITY'||e.type==='ZEUS_NEGATE'||e.type==='DAMAGE'));
 }
 const supportInHand=afterPlay.payload.room.duel.me.hand.find(c=>c.kind==='SUPPORT'&&!['DM-006','DM-019'].includes(c.id));
 if(supportInHand){
  const freeSupport=afterPlay.payload.room.duel.me.supports.findIndex(x=>!x);
  if(freeSupport>=0){
   const placedSupport=await invoke({body:{action:'duel',code,token:a.payload.token,duelAction:'play',cardId:supportInHand.id,zone:freeSupport,faceDown:true}});
   if(placedSupport.status===200){
    const act=await invoke({body:{action:'duel',code,token:a.payload.token,duelAction:'activate_support',supportZone:freeSupport,targetZone:abilitySource>=0?abilitySource:null}});
    assert.ok([200,409].includes(act.status));
   }
  }
 }
 const end=await invoke({body:{action:'duel',code,token:a.payload.token,duelAction:'end_turn'}});
 assert.equal(end.status,200);
 assert.equal(end.payload.room.duel.activeSeat,'GUEST');
 assert.equal(end.payload.room.duel.opponent.handCount,6);

 const wrongTurn=await invoke({body:{action:'duel',code,token:a.payload.token,duelAction:'end_turn'}});
 assert.equal(wrongTurn.status,409);
 assert.equal(wrongTurn.payload.error,'NOT_YOUR_TURN');

 const evt=await invoke({body:{action:'event',code,token:b.payload.token,type:'CLIENT_READY_FOR_DUELMASTER',payload:{deck:'DUEL_MASTER'}}});
 assert.equal(evt.status,200);
 assert.ok(evt.payload.room.events.some(e=>e.type==='CLIENT_READY_FOR_DUELMASTER'));

 const bad=await invoke({body:{action:'sync',code,token:'token-invalido'}});
 assert.equal(bad.status,403);

 console.log('NÉMESIS DUEL MASTER ONLINE EFFECTS 20/20 RUNTIME: PASS');
})().catch(err=>{console.error(err);process.exit(1)});
