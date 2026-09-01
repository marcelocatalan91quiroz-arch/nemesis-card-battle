(()=>{
'use strict';
const API='/api/owner-auth';
const PRIVATE=new Set(['OLIMPO','DUEL_MASTER','CABALLEROS_SUBMUNDO']);
const state={ready:false,isOwner:false,configured:false,lastError:null};
const canon=v=>String(v||'').trim().toUpperCase().replaceAll(' ','_').replace('DRAGÓN','DRAGON').replace('CABALLEROS_DEL_SUBMUNDO','CABALLEROS_SUBMUNDO');
class OwnerAuthError extends Error{
 constructor(code,status=0,payload=null){
  super(code||'OWNER_AUTH_UNKNOWN');this.name='OwnerAuthError';this.code=code||'OWNER_AUTH_UNKNOWN';this.status=Number(status)||0;this.payload=payload
 }
}
async function call(body=null){
 const opt=body?{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',cache:'no-store',body:JSON.stringify(body)}:{method:'GET',cache:'no-store',credentials:'same-origin'};
 let r;
 try{r=await fetch(API,opt)}catch(err){throw new OwnerAuthError('OWNER_AUTH_NETWORK_ERROR',0,{message:String(err?.message||err)})}
 let j;
 try{j=await r.json()}catch{throw new OwnerAuthError('OWNER_AUTH_BAD_RESPONSE',r.status,null)}
 if(!r.ok&&!j?.owner)throw new OwnerAuthError(j?.error||('HTTP_'+r.status),r.status,j);
 return j
}
async function refresh(){
 state.lastError=null;
 try{const j=await call();state.isOwner=!!j.owner;state.configured=!!j.configured}
 catch(err){state.isOwner=false;state.configured=false;state.lastError={code:err?.code||err?.message||'UNKNOWN',status:Number(err?.status)||0};console.warn('[NÉMESIS OWNER AUTH · REFRESH]',state.lastError)}
 state.ready=true;window.dispatchEvent(new CustomEvent('nemesis-owner-auth',{detail:{...state}}));inject();return state.isOwner
}
async function login(key){
 const candidate=String(key??'');state.lastError=null;
 try{
  const j=await call({action:'login',key:candidate});state.isOwner=!!j.owner;state.ready=true;state.configured=true;
  window.dispatchEvent(new CustomEvent('nemesis-owner-auth',{detail:{...state}}));inject();return state.isOwner
 }catch(err){
  state.isOwner=false;state.ready=true;
  if(err?.status===403&&err?.code==='OWNER_AUTH_INVALID')state.configured=true;
  if(err?.status===503&&err?.code==='OWNER_AUTH_NOT_CONFIGURED')state.configured=false;
  state.lastError={
   code:err?.code||err?.message||'UNKNOWN',
   status:Number(err?.status)||0,
   submittedLength:candidate.length,
   hasLeadingWhitespace:candidate.length!==candidate.trimStart().length,
   hasTrailingWhitespace:candidate.length!==candidate.trimEnd().length
  };
  console.warn('[NÉMESIS OWNER AUTH · LOGIN]',state.lastError);
  window.dispatchEvent(new CustomEvent('nemesis-owner-auth',{detail:{...state}}));throw err
 }
}
async function logout(){
 await call({action:'logout'}).catch(()=>{});state.isOwner=false;state.ready=true;window.dispatchEvent(new CustomEvent('nemesis-owner-auth',{detail:{...state}}));inject();return true
}
function canUseDeck(name){return !PRIVATE.has(canon(name))||state.isOwner}
function inject(){
 const b=document.getElementById('ownerBtn');if(!b)return;
 b.textContent=state.isOwner?'PROPIETARIO ✓ · PANEL':'MODO PROPIETARIO · BLOQUEADO';
 b.onclick=async()=>{
  if(state.isOwner){
   if(typeof window.NEMESIS_OWNER_CONTROL?.panel==='function')return window.NEMESIS_OWNER_CONTROL.panel();
   window.dispatchEvent(new CustomEvent('nemesis-owner-open'));return;
  }
  if(typeof window.NEMESIS_OWNER_CONTROL?.login==='function')return window.NEMESIS_OWNER_CONTROL.login();
  if(!state.configured){alert('La autenticación de propietario aún no está configurada en el servidor.');return}
  const key=prompt('CLAVE PRIVADA DEL PROPIETARIO');if(!key)return;
  try{
   const ok=await login(key);
   if(ok&&typeof window.NEMESIS_OWNER_CONTROL?.panel==='function')window.NEMESIS_OWNER_CONTROL.panel();
  }catch(e){alert(e.message==='OWNER_AUTH_INVALID'?'Clave de propietario incorrecta.':'No se pudo autenticar al propietario.')}
 };
}
Object.defineProperties(state,{canUseDeck:{value:canUseDeck},refresh:{value:refresh},login:{value:login},logout:{value:logout}});
window.NEMESIS_OWNER_AUTH=state;
window.NEMESIS_OWNER_AUTH_INJECT=inject;
const boot=()=>{inject();refresh()};
if(document.readyState==='loading')addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
