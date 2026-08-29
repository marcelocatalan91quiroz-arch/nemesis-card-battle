(()=>{
'use strict';
const API='/api/online1v1';
const SESSION_KEY='nemesis_online1v1_session';
let pollTimer=null,lastPing=0,lastVersion=0,current=null;

const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const api=async(body,method='POST')=>{
 const t=performance.now();
 const r=await fetch(API+(method==='GET'?body:''),method==='GET'?{cache:'no-store'}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
 lastPing=Math.max(1,Math.round(performance.now()-t));
 const j=await r.json().catch(()=>({ok:false,error:'BAD_RESPONSE'}));
 if(!r.ok||!j.ok)throw new Error(j.error||('HTTP_'+r.status));
 return j;
};
const saveSession=()=>{if(current)sessionStorage.setItem(SESSION_KEY,JSON.stringify({code:current.code,token:current.token,name:current.name}))};
const clearSession=()=>sessionStorage.removeItem(SESSION_KEY);
const stopPoll=()=>{if(pollTimer)clearTimeout(pollTimer);pollTimer=null};
const menuName=()=>document.querySelector('#nm')?.value?.trim()||'Jugador';

function injectEntry(){
 const host=document.querySelector('.menu-actions');
 if(!host||document.querySelector('#online1v1Btn'))return;
 const b=document.createElement('button');
 b.className='btn online1v1-entry';b.id='online1v1Btn';b.textContent='ONLINE 1 VS 1 · NÚCLEO';
 b.onclick=()=>onlineHome(menuName());
 host.appendChild(b);
 const raw=sessionStorage.getItem(SESSION_KEY);
 if(raw){
  try{const s=JSON.parse(raw);if(s.code&&s.token){const badge=document.createElement('button');badge.className='btn online1v1-resume';badge.textContent='REANUDAR SALA '+s.code;badge.onclick=()=>resume(s);host.appendChild(badge)}}catch(_){}
 }
}
new MutationObserver(injectEntry).observe(document.documentElement,{childList:true,subtree:true});
addEventListener('DOMContentLoaded',injectEntry);

function onlineHome(name='Jugador'){
 stopPoll();
 document.getElementById('app').innerHTML=`<section class="online-shell">
  <div class="online-stars"></div>
  <header class="online-top"><button class="online-back" id="olBack">← VOLVER</button><div><small>NÉMESIS NETWORK CORE</small><h1>ONLINE 1 VS 1</h1><p>Base multijugador autoritativa · preparada para Duel Master Online</p></div><div class="online-security">◈ SERVER AUTHORITY</div></header>
  <main class="online-home-grid">
   <article class="online-hero">
    <div class="holo-orb"><span>1</span><i>VS</i><span>1</span></div>
    <h2>ARENA DE CONEXIÓN</h2>
    <p>Salas privadas, sesión recuperable, heartbeat, sincronización versionada, countdown y registro de eventos.</p>
    <div class="online-tech"><span>AUTH</span><span>SYNC</span><span>RECONNECT</span><span>EVENT LOG</span></div>
   </article>
   <article class="online-console">
    <label>NOMBRE DEL JUGADOR</label><input id="olName" maxlength="24" value="${esc(name)}">
    <button class="online-primary" id="olCreate">CREAR SALA PRIVADA</button>
    <div class="online-divider"><span>O</span></div>
    <label>CÓDIGO DE SALA</label><input id="olCode" maxlength="6" autocomplete="off" placeholder="ABC123">
    <button class="online-secondary" id="olJoin">UNIRME A SALA</button>
    <p class="online-msg" id="olMsg"></p>
   </article>
  </main>
  <footer class="online-foot">FASE ONLINE BASE · EL MOTOR DUEL MASTER SE CONECTA DESPUÉS</footer>
 </section>`;
 document.getElementById('olBack').onclick=()=>location.reload();
 document.getElementById('olCreate').onclick=async()=>{const n=document.getElementById('olName').value.trim()||'Jugador';busy(true);try{const j=await api({action:'create',name:n});current={code:j.room.code,token:j.token,name:n};saveSession();renderRoom(j.room)}catch(e){msg(errorText(e.message))}finally{busy(false)}};
 document.getElementById('olJoin').onclick=async()=>{const n=document.getElementById('olName').value.trim()||'Jugador',c=document.getElementById('olCode').value.trim().toUpperCase();if(c.length!==6)return msg('Ingresa un código de 6 caracteres.');busy(true);try{const j=await api({action:'join',name:n,code:c});current={code:c,token:j.token,name:n};saveSession();renderRoom(j.room)}catch(e){msg(errorText(e.message))}finally{busy(false)}};
}
function busy(v){document.querySelectorAll('.online-console button').forEach(b=>b.disabled=v)}
function msg(t){const e=document.getElementById('olMsg');if(e)e.textContent=t}
function errorText(e){return ({ROOM_NOT_FOUND:'Sala no encontrada.',ROOM_FULL:'La sala ya tiene 2 jugadores.',INVALID_SESSION:'La sesión ya no es válida.',SERVER_ERROR:'El servidor no pudo completar la operación.'})[e]||e}

async function resume(s){
 current={code:s.code,token:s.token,name:s.name||'Jugador'};
 try{const j=await api('?room='+encodeURIComponent(s.code)+'&token='+encodeURIComponent(s.token),'GET');renderRoom(j.room)}
 catch(_){clearSession();onlineHome(s.name)}
}
function playerCard(p,me){
 if(!p)return `<div class="online-player empty"><div class="online-avatar">?</div><b>ESPERANDO RIVAL</b><small>Comparte el código de sala</small></div>`;
 return `<div class="online-player ${me?'me':''} ${p.connected?'connected':'offline'}"><div class="online-avatar">${esc((p.name||'?').slice(0,1).toUpperCase())}</div><div><small>${p.seat==='HOST'?'ANFITRIÓN':'INVITADO'}</small><b>${esc(p.name)}</b><span>${p.connected?'● CONECTADO':'○ RECONECTANDO'}</span></div><em>${p.ready?'LISTO':'NO LISTO'}</em></div>`;
}
function renderRoom(room){
 stopPoll();lastVersion=room.version||0;
 const me=room.me,op=room.players.find(p=>p.id!==me.id);
 document.getElementById('app').innerHTML=`<section class="online-shell room">
  <div class="online-gridfx"></div>
  <header class="online-top"><button class="online-back" id="olLeave">← SALIR</button><div><small>SALA PRIVADA</small><h1>${esc(room.code)}</h1><p id="olStatusText">${statusText(room)}</p></div><div class="online-net"><b id="olPing">${lastPing} ms</b><small id="olTransport">${esc(room.transport)}</small></div></header>
  <main class="online-room-core">
   <section class="online-versus">
    <div id="olMe">${playerCard(me,true)}</div><div class="online-vs-core"><span>VS</span><i></i></div><div id="olOp">${playerCard(op,false)}</div>
   </section>
   <section class="online-control">
    <div class="room-code"><small>CÓDIGO DE INVITACIÓN</small><b>${esc(room.code)}</b><button id="olCopy">COPIAR</button></div>
    <div class="sync-meter"><div><span>SESIÓN</span><b id="olSession">${esc(room.status)}</b></div><div><span>SINCRONÍA</span><b id="olVersion">V${room.version}</b></div><div><span>HEARTBEAT</span><b>ACTIVO</b></div></div>
    <button class="online-primary ready" id="olReady">${me.ready?'CANCELAR LISTO':'ESTOY LISTO'}</button>
    <div id="olCountdown" class="online-countdown"></div>
   </section>
   <section class="online-log"><header><b>EVENT STREAM</b><span>últimos eventos</span></header><div id="olEvents">${eventsHtml(room.events)}</div></section>
  </main>
  <footer class="online-foot">NÚCLEO 1 VS 1 AISLADO · SIN MODIFICAR EL MOTOR DE CAMPAÑA</footer>
 </section>`;
 document.getElementById('olCopy').onclick=async()=>{try{await navigator.clipboard.writeText(room.code);document.getElementById('olCopy').textContent='COPIADO ✓'}catch(_){}};
 document.getElementById('olReady').onclick=async()=>{try{const j=await api({action:'ready',code:current.code,token:current.token,ready:!room.me.ready});updateRoom(j.room)}catch(e){}};
 document.getElementById('olLeave').onclick=async()=>{stopPoll();try{await api({action:'leave',code:current.code,token:current.token})}catch(_){}clearSession();location.reload()};
 updateRoom(room);schedulePoll();
}
function statusText(r){
 if(r.status==='WAITING')return 'Esperando a un segundo jugador';
 if(r.status==='READY')return 'Rival conectado · ambos deben confirmar';
 if(r.status==='COUNTDOWN')return 'Sincronizando inicio de partida';
 if(r.status==='ACTIVE')return 'Núcleo online 1 vs 1 activo';
 if(r.status==='ENDED')return 'Sala finalizada';
 return r.status;
}
function eventsHtml(events=[]){return events.slice().reverse().slice(0,10).map(e=>`<div><time>#${e.seq}</time><b>${esc(e.type)}</b><span>${esc(e.seat)}</span></div>`).join('')||'<p>Esperando eventos…</p>'}
function updateRoom(room){
 if(!document.getElementById('olSession'))return renderRoom(room);
 lastVersion=room.version||lastVersion;
 const me=room.me,op=room.players.find(p=>p.id!==me.id);
 document.getElementById('olMe').innerHTML=playerCard(me,true);
 document.getElementById('olOp').innerHTML=playerCard(op,false);
 document.getElementById('olPing').textContent=lastPing+' ms';
 document.getElementById('olTransport').textContent=room.transport;
 document.getElementById('olSession').textContent=room.status;
 document.getElementById('olVersion').textContent='V'+room.version;
 document.getElementById('olStatusText').textContent=statusText(room);
 document.getElementById('olEvents').innerHTML=eventsHtml(room.events);
 const rb=document.getElementById('olReady');rb.textContent=me.ready?'CANCELAR LISTO':'ESTOY LISTO';
 rb.disabled=room.status==='ACTIVE'||room.status==='ENDED';
 const cd=document.getElementById('olCountdown');
 if(room.status==='COUNTDOWN'&&room.countdownAt){
  const sec=Math.max(0,Math.ceil((room.countdownAt-room.serverTime)/1000));cd.innerHTML=`<b>${sec||'GO'}</b><span>ENLACE DE ARENA</span>`;
 }else if(room.status==='ACTIVE'){cd.innerHTML='<b>ONLINE</b><span>BASE 1 VS 1 LISTA · DUEL MASTER PENDIENTE DE INTEGRACIÓN</span>'}
 else cd.innerHTML='';
 current.room=room;saveSession();
}
function schedulePoll(){
 stopPoll();
 pollTimer=setTimeout(async()=>{
  if(!current)return;
  try{
   let j=await api({action:'sync',code:current.code,token:current.token});
   updateRoom(j.room);
  }catch(e){
   const s=document.getElementById('olStatusText');if(s)s.textContent='Reconectando con el núcleo online…';
  }
  schedulePoll();
 },1200);
}
window.NEMESIS_ONLINE_1V1={open:()=>onlineHome(menuName()),resume:()=>{const s=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');if(s)resume(s)},version:'1.0.0'};
})();