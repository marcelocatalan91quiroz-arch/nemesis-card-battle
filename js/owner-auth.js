(()=>{
'use strict';
const API='/api/owner-auth';
const PRIVATE=new Set(['OLIMPO','DUEL_MASTER','CABALLEROS_SUBMUNDO']);
const state={ready:false,isOwner:false,configured:false};
const canon=v=>String(v||'').trim().toUpperCase().replaceAll(' ','_').replace('DRAGÓN','DRAGON').replace('CABALLEROS_DEL_SUBMUNDO','CABALLEROS_SUBMUNDO');
async function call(body=null){
 const opt=body?{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify(body)}:{cache:'no-store',credentials:'same-origin'};
 const r=await fetch(API,opt);const j=await r.json().catch(()=>({ok:false}));
 if(!r.ok&&!j.owner)throw new Error(j.error||('HTTP_'+r.status));return j
}
async function refresh(){
 try{const j=await call();state.isOwner=!!j.owner;state.configured=!!j.configured}
 catch{state.isOwner=false}
 state.ready=true;window.dispatchEvent(new CustomEvent('nemesis-owner-auth',{detail:{...state}}));inject();return state.isOwner
}
async function login(key){
 const j=await call({action:'login',key:String(key||'')});state.isOwner=!!j.owner;state.ready=true;state.configured=true;window.dispatchEvent(new CustomEvent('nemesis-owner-auth',{detail:{...state}}));inject();return state.isOwner
}
async function logout(){
 await call({action:'logout'}).catch(()=>{});state.isOwner=false;state.ready=true;window.dispatchEvent(new CustomEvent('nemesis-owner-auth',{detail:{...state}}));inject();return true
}
function canUseDeck(name){return !PRIVATE.has(canon(name))||state.isOwner}
function inject(){
 const host=document.querySelector('.menu-actions');if(!host)return;
 let b=document.getElementById('ownerAuthBtn');
 if(!b){b=document.createElement('button');b.id='ownerAuthBtn';b.className='btn owner-auth-entry';host.appendChild(b)}
 b.textContent=state.isOwner?'PROPIETARIO · AUTENTICADO ✓':'ACCESO PROPIETARIO';
 b.onclick=async()=>{
  if(state.isOwner){if(confirm('¿Cerrar sesión de propietario?')){await logout();location.reload()}return}
  if(!state.configured){alert('La autenticación de propietario aún no está configurada en el servidor.');return}
  const key=prompt('CLAVE PRIVADA DEL PROPIETARIO');if(!key)return;
  try{await login(key);location.reload()}catch(e){alert(e.message==='OWNER_AUTH_INVALID'?'Clave de propietario incorrecta.':'No se pudo autenticar al propietario.')}
 };
}
Object.defineProperties(state,{canUseDeck:{value:canUseDeck},refresh:{value:refresh},login:{value:login},logout:{value:logout}});
window.NEMESIS_OWNER_AUTH=state;
new MutationObserver(inject).observe(document.documentElement,{childList:true,subtree:true});
addEventListener('DOMContentLoaded',()=>{inject();refresh()});
})();
