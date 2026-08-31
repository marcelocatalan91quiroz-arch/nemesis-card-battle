const assert=require('assert');
process.env.NEMESIS_OWNER_KEY='nemesis-owner-key-test-2026';
process.env.NEMESIS_OWNER_SIGNING_SECRET='nemesis-owner-signing-secret-test-2026-very-long';
delete process.env.VERCEL_ENV;
const handler=require('../api/owner-auth.js');

function invoke({method='GET',body={},cookie=''}={}){
 return new Promise((resolve,reject)=>{
  const headers={};
  const req={method,body,headers:{cookie,'x-forwarded-proto':'https'}};
  const res={statusCode:200,setHeader(k,v){headers[k.toLowerCase()]=v},status(n){this.statusCode=n;return this},json(payload){resolve({status:this.statusCode,headers,payload});return this},end(){resolve({status:this.statusCode,headers,payload:null});return this}};
  Promise.resolve(handler(req,res)).catch(reject);
 });
}
(async()=>{
 const pre=await invoke();assert.equal(pre.status,200);assert.equal(pre.payload.owner,false);assert.equal(pre.payload.configured,true);
 const bad=await invoke({method:'POST',body:{action:'login',key:'incorrecta'}});assert.equal(bad.status,403);
 const login=await invoke({method:'POST',body:{action:'login',key:process.env.NEMESIS_OWNER_KEY}});assert.equal(login.status,200);assert.equal(login.payload.owner,true);
 const set=String(login.headers['set-cookie']||'');assert.ok(set.includes('HttpOnly'));assert.ok(set.includes('SameSite=Strict'));assert.ok(set.includes('Secure'));
 const cookie=set.split(';')[0];
 const ok=await invoke({cookie});assert.equal(ok.payload.owner,true);
 const logout=await invoke({method:'POST',body:{action:'logout'},cookie});assert.equal(logout.status,200);assert.ok(String(logout.headers['set-cookie']).includes('Max-Age=0'));
 console.log('NÉMESIS OWNER AUTH HTTPONLY: PASS');
})().catch(e=>{console.error(e);process.exit(1)});
