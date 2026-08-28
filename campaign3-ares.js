
// ================================================================
// V18.9.63 — CAMPAÑA III · GUERRA DE LOS DIOSES · ARES
// Framework completo del primer dios: presentación, fases, Furia,
// eventos de campo e IA Modo Dios. El mazo se agregará carta por carta
// en la siguiente etapa; no se inventan cartas aquí.
// ================================================================
(function(){
 const KEY='nemesis_campaign_progress';
 const ARES={
   id:'ares-god-war',
   name:'Ares — Dios de la Guerra',
   title:'MODO BESTIA DIVINA',
   hp:30000,
   maxHp:30000,
   fury:0,
   maxFury:null,
   asset:'assets/images/campaign3/ares/ares-personaje.png',
   background:'assets/images/campaign3/ares/ares-arena-pc-ultra.png',
   phases:[
     {id:1,name:'ESTRATEGA DEL OLIMPO',min:20001,max:30000,rule:'control',arena:'intacta'},
     {id:2,name:'DIOS DE LA GUERRA',min:8001,max:20000,rule:'weapon-combo',arena:'fracturada'},
     {id:3,name:'BESTIA DIVINA DE ARES',min:1,max:8000,rule:'lethal',arena:'guerra-celestial'}
   ],
   furyActions:{
     2:'CONTRAATAQUE DIVINO',
     3:'EQUIPAMIENTO INMEDIATO',
     4:'ATAQUE ADICIONAL',
     5:'INVOCACIÓN DEL CEMENTERIO',
     7:'IRA DE ARES'
   },
   dialogue:[
     ['NARRADOR','El cielo del mundo se fractura. Una nueva guerra despierta más allá del portal.'],
     ['NARRADOR','La cámara atraviesa un campo de batalla detenido en el tiempo. Espadas, ceniza y guerreros permanecen suspendidos.'],
     ['NARRADOR','Una lanza divina cae desde el cielo y golpea el suelo. Todo vuelve a moverse.'],
     ['ARES','Has derrotado muertos, reyes y fantasmas...'],
     ['ARES','Pero todavía no conoces la guerra.'],
     ['ARES','Entra en mi campo. Aquí cada decisión deja una cicatriz.']
   ],
   fieldEvents:[
     {id:'spear-rain',name:'LLUVIA DE LANZAS',warning:'¡LLUVIA DE LANZAS!',desc:'Golpea aleatoriamente una criatura de cada lado y puede dañar equipamiento.'},
     {id:'olympus-storm',name:'TORMENTA DEL OLIMPO',warning:'¡TORMENTA DEL OLIMPO!',desc:'Durante 1 turno, las cartas DIVINAS ganan prioridad y los efectos celestiales se intensifican.'},
     {id:'burning-ground',name:'SUELO EN LLAMAS',warning:'¡SUELO EN LLAMAS!',desc:'Las criaturas que entren al campo reciben daño de entrada salvo DIVINAS o de FUEGO.'},
     {id:'army-clash',name:'CHOQUE DE EJÉRCITOS',warning:'¡CHOQUE DE EJÉRCITOS!',desc:'El campo favorece criaturas equipadas y castiga posiciones defensivas débiles.'}
   ]
 };
 window.NEMESIS_ARES=ARES;

 function loadProgress(){
   try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}
 }
 function saveProgress(p){localStorage.setItem(KEY,JSON.stringify(p))}
 function phaseFor(hp){
   return ARES.phases.find(p=>hp>=p.min&&hp<=p.max)||ARES.phases[2]
 }
 window.nemesisAresPhaseFor=phaseFor;

 window.nemesisAresGainFury=function(amount,reason=''){
   ARES.fury=Math.max(0,(ARES.fury||0)+(Number(amount)||0));
   if(reason&&typeof pcLog==='function')pcLog(`ARES gana ${amount} Furia: ${reason}. Total ${ARES.fury}.`,'effect');
   return ARES.fury;
 };

 window.nemesisAresSpendFury=function(cost){
   if((ARES.fury||0)<cost)return false;
   ARES.fury-=cost;
   return true;
 };

 window.nemesisAresAiDecision=function(state={}){
   const hp=Number(state.hp ?? ARES.hp);
   const fury=Number(state.fury ?? ARES.fury ?? 0);
   const p=phaseFor(hp);
   const playerHp=Number(state.playerHp ?? 0);
   const visible=state.playerCards||[];
   const grave=state.playerGrave||[];
   const equipment=state.playerEquipment||[];
   const fusionSetup=state.fusionSetup||{};
   const lethal=Number(state.possibleDamage||0)>=playerHp&&playerHp>0;

   // IA MODO DIOS: no decide por una sola métrica.
   if(lethal&&fury>=4)return {action:'ATAQUE ADICIONAL',cost:4,phase:p.id,reason:'letal disponible'};
   if(fusionSetup.jupiter&&fusionSetup.zeus&&fusionSetup.kronos&&!fusionSetup.apoloProtection){
      if(fury>=7)return {action:'IRA DE ARES',cost:7,phase:p.id,reason:'romper preparación de Fusión Divina'};
      return {action:'PRESIONAR COMPONENTE DE FUSIÓN',cost:0,phase:p.id,reason:'Titán del Olimpo detectado'};
   }
   if(state.aresWeaponDestroyed&&fury>=3)return {action:'EQUIPAMIENTO INMEDIATO',cost:3,phase:p.id,reason:'recuperar tempo'};
   if(grave.length&&fury>=5&&p.id>=2)return {action:'INVOCACIÓN DEL CEMENTERIO',cost:5,phase:p.id,reason:'recuperar atacante'};
   if(state.incomingHeavyHit&&fury>=2)return {action:'CONTRAATAQUE DIVINO',cost:2,phase:p.id,reason:'respuesta defensiva'};
   if(p.id===3&&fury>=7)return {action:'IRA DE ARES',cost:7,phase:p.id,reason:'fase final agresiva'};
   if(equipment.length&&p.id>=2)return {action:'ATACAR EQUIPO CLAVE',cost:0,phase:p.id,reason:'debilitar motor de equipamiento'};
   if(visible.length)return {action:'ATACAR AMENAZA MAYOR',cost:0,phase:p.id,reason:'control de tablero'};
   return {action:'CONSERVAR FURIA',cost:0,phase:p.id,reason:'sin objetivo de alto impacto'};
 };

 window.nemesisAresFieldEvent=function(turn,forcedId=null){
   // No dispara en todos los turnos: ventana inicial y luego intervalos.
   const list=ARES.fieldEvents;
   let ev=null;
   if(forcedId)ev=list.find(x=>x.id===forcedId)||null;
   else{
     if(turn<3)return null;
     if(turn%3!==0)return null;
     ev=list[(Math.floor(turn/3)-1)%list.length];
   }
   if(!ev)return null;
   window.nemesisShowAresFieldWarning(ev);
   return ev;
 };

 window.nemesisShowAresFieldWarning=function(ev){
   const old=document.getElementById('nemesis-ares-event');if(old)old.remove();
   const d=document.createElement('div');d.id='nemesis-ares-event';
   d.innerHTML=`<div class="ares-event-card"><div class="ares-event-title">${ev.warning}</div><div class="ares-event-desc">${ev.desc}</div></div>`;
   document.body.appendChild(d);
   requestAnimationFrame(()=>d.classList.add('show'));
   setTimeout(()=>d.remove(),2200);
 };

 window.nemesisShowAresIntro=function(opts={}){
   const old=document.getElementById('nemesis-ares-intro');if(old)old.remove();
   const root=document.createElement('div');root.id='nemesis-ares-intro';
   root.innerHTML=`
    <div class="ares-bg"></div>
    <div class="ares-vignette"></div>
    <div class="ares-lightning"></div>
    <img class="ares-character" alt="Ares">
    <div class="ares-campaign-title">CAMPAÑA III<small>GUERRA DE LOS DIOSES</small></div>
    <div class="ares-boss-title">ARES<small>DIOS DE LA GUERRA · 30.000 HP</small></div>
    <div class="ares-dialogue"><div class="speaker"></div><div class="line"></div><div class="hint">clic para continuar</div>
      <div class="actions">
       <button data-action="world">VOLVER AL INICIO</button>
       <button data-action="ares">ENTRAR AL CAMPO DE ARES</button>
      </div>
    </div>`;
   root.querySelector('.ares-bg').style.backgroundImage=`url("${ARES.background}")`;
   root.querySelector('.ares-character').src=ARES.asset;
   document.body.appendChild(root);
   let i=0;
   const speaker=root.querySelector('.speaker'),line=root.querySelector('.line');
   function paint(){
     speaker.textContent=ARES.dialogue[i][0];
     line.textContent=ARES.dialogue[i][1];
     if(i>=2)root.classList.add('reveal');
     if(i===ARES.dialogue.length-1)root.classList.add('done');
   }
   root.addEventListener('click',e=>{
     if(e.target.closest('button'))return;
     if(i<ARES.dialogue.length-1){i++;paint()}
   });
   root.querySelector('[data-action="world"]').onclick=()=>{root.remove();opts.onWorld?.()};
   root.querySelector('[data-action="ares"]').onclick=()=>{
      root.remove();
      window.nemesisShowAresEncounter(opts);
   };
   paint();
 };

 window.nemesisShowAresEncounter=function(opts={}){
   const old=document.getElementById('nemesis-ares-encounter');if(old)old.remove();
   const root=document.createElement('div');root.id='nemesis-ares-encounter';
   root.innerHTML=`
     <div class="ares-bg"></div><div class="ares-vignette"></div>
     <img class="ares-character static" alt="Ares">
     <div class="ares-panel">
       <h1>ARES — DIOS DE LA GUERRA</h1>
       <div class="ares-sub">MODO BESTIA DIVINA · 30.000 HP</div>
       <div class="ares-phase-list">
        <div><b>FASE I</b> — Estratega del Olimpo</div>
        <div><b>FASE II</b> — Dios de la Guerra</div>
        <div><b>FASE III</b> — Bestia Divina de Ares</div>
       </div>
       <div class="ares-feature">FURIA DE GUERRA · EVENTOS DE CAMPO · IA MODO DIOS · ARENA PC ULTRA</div>
       <div class="ares-status">Mazo de Ares: 12 / 12 · MODO DIOS COMPLETO.</div>
       <div class="ares-actions">
        <button data-action="back">VOLVER</button>
        <button data-action="deck">⚔ RETAR A ARES · MODO DIOS</button>
       </div>
     </div>`;
   root.querySelector('.ares-bg').style.backgroundImage=`url("${ARES.background}")`;
   root.querySelector('.ares-character').src=ARES.asset;
   document.body.appendChild(root);
   root.querySelector('[data-action="back"]').onclick=()=>{root.remove();opts.onWorld?.()};
   root.querySelector('[data-action="deck"]').onclick=()=>{root.remove();window.NEMESIS_ARES_DUEL_ACTIVE=true;if(typeof window.battle==='function')window.battle('ares')};
 };

 window.nemesisUnlockCampaign3Ares=function(){
   const p=loadProgress();
   p.campaign3Unlocked=true;
   p.campaign3Started=true;
   p.campaign3Stage=p.campaign3Stage||'ares-intro';
   saveProgress(p);
   return p;
 };

 window.nemesisMaybeShowCampaign3=function(){
   const p=loadProgress();
   if(!p.campaign3Unlocked)return false;
   if(p.campaign3Stage==='ares-intro' || !p.campaign3Stage){
      nemesisShowAresIntro({
        onWorld:()=>{if(typeof showMainMenu==='function')showMainMenu();},
        onAres:()=>{}
      });
      return true;
   }
   return false;
 };
})();

window.nemesisAresEncounter=()=>window.nemesisShowAresIntro({onWorld:()=>{if(typeof window.menuScene==='function')window.menuScene()}});
