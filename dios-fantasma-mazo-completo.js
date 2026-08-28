// NÉMESIS V18.9.58 — Dios Fantasma mazo completo 10/10.
// Capa aditiva: registra cartas 6–10, Esencia Celestial, IA y cierre de Campaña II.
(function(){
const EXTRA = [{"id": "df-06", "n": 6, "name": "Puerta Celestial del Más Allá", "kind": "MAGICA", "cost": 5, "effect": "Gasta 5 Esencias Celestiales. Revive 1 criatura DIVINA o ESPECTRAL del Cementerio con estadísticas originales y +1000 ATK/+1000 DEF durante 2 turnos.", "ai": "Alta: usar si existe objetivo fuerte en Cementerio; evitar desperdiciarla sin objetivo útil."}, {"id": "df-07", "n": 7, "name": "Ojo del Dios Fantasma", "kind": "MAGICA", "cost": 4, "effect": "Gasta 4 Esencias Celestiales. Anula 1 efecto, habilidad o invocación enemiga activa; si el objetivo es una FUSIÓN, también niega su invocación.", "ai": "Alta reactiva: reservar para FUSIONES DIVINAS, resurrecciones masivas o amenazas decisivas."}, {"id": "df-08", "n": 8, "name": "Juicio Celestial del Más Allá", "kind": "MAGICA_SUPREMA", "cost": 7, "once_per_duel": true, "effect": "Gasta 7 Esencias Celestiales. Destruye o anula hasta 2 cartas enemigas según la amenaza y luego invoca o revive 1 criatura DIVINA o ESPECTRAL propia.", "ai": "Muy alta situacional: no usar apenas llegue a 7; buscar cambio de partida o cierre."}, {"id": "df-09", "n": 9, "name": "Resurrección Celestial del Más Allá", "kind": "MAGICA_SUPREMA", "cost": 6, "effect": "Gasta 6 Esencias Celestiales. Selecciona hasta 2 criaturas del Cementerio; vuelven con 1000 ATK/1000 DEF o 50% de sus estadísticas originales, usando el valor mayor. Son INMORTALES durante 1 turno. Si revive 2, Dios Fantasma recupera 1500 HP. Luego esta mágica se destruye.", "ai": "Alta: priorizar con 2 objetivos útiles, HP bajo o posibilidad de combo letal."}, {"id": "df-10", "n": 10, "name": "Decreto Celestial del Más Allá", "kind": "MAGICA_SUPREMA", "cost": 8, "once_per_duel": true, "effect": "Gasta 8 Esencias. Si HP <30%, elige un efecto: DESTRUCCIÓN ABSOLUTA (destruye cartas del campo/Cementerio/deck rival, sin afectar Invocadas Inmortales); DOMINIO ETERNO (toma control permanente de 1 criatura enemiga potenciada); JUICIO FINAL (daño directo igual al ATK total de las criaturas propias, no reducible ni evitable). Luego se destruye.", "ai": "Suprema: solo con HP <30%; elegir destrucción contra campo amplio, dominio contra una amenaza clave y juicio final si asegura victoria."}];
const KEY="nemesis_campaign_progress";
window.NEMESIS_DIOS_FANTASMA = window.NEMESIS_DIOS_FANTASMA || {};
Object.assign(window.NEMESIS_DIOS_FANTASMA,{
  hp:35000, finalFormHp:5000, phases:[
   {name:"Dios del Umbral",min:22001,max:35000},
   {name:"Trono Celestial Espectral",min:10001,max:22000},
   {name:"Juicio de las Almas",min:1,max:10000},
   {name:"Forma Celestial Final",hp:5000,once:true}
  ],
  essence:{value:0,max:null},
  passive:{name:"Cuerpo Entre Dos Mundos",normalDamageReduction:.30,divineIgnores:true,divineFusionIgnores:true},
  ultimate:{name:"Juicio Celestial del Más Allá",cost:7,once:true},
  extraCards:EXTRA
});
window.nemesisCelestialEssence=function(delta){
 const s=window.NEMESIS_DIOS_FANTASMA.essence;
 s.value=Math.max(0,s.value+(Number(delta)||0)); return s.value;
};
window.nemesisDiosFantasmaAI=function(state={}){
 const e=Number(state.essence ?? window.NEMESIS_DIOS_FANTASMA.essence.value);
 const hp=Number(state.hp ?? 35000), max=35000, grave=state.graveyard||[], enemy=state.enemy||{};
 if(hp/max<.30 && e>=8) return {card:"df-10",reason:"decreto-final"};
 if(e>=7 && (enemy.criticalThreats>=2 || state.canLethalWithJudgment)) return {card:"df-08",reason:"juicio-decisivo"};
 if(e>=4 && enemy.pendingCriticalEffect) return {card:"df-07",reason:"negacion-inteligente"};
 if(e>=6 && grave.length>=2 && (hp/max<.5 || state.reviveCombo)) return {card:"df-09",reason:"resurreccion-doble"};
 if(e>=5 && grave.length>=1 && state.bestRevive) return {card:"df-06",reason:"revivir-clave"};
 return {card:null,reason:"reservar-esencia"};
};
window.nemesisFinishCampaign2=function(rewards={}){
 let p={}; try{p=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){}
 p.campaign1Completed = p.campaign1Completed!==false;
 p.campaign2Completed = true;
 p.campaign3Unlocked = true;
 p.completedBosses = Array.from(new Set([...(p.completedBosses||[]),"dios-fantasma"]));
 p.wonCards = Array.from(new Set([...(p.wonCards||[]),...(rewards.wonCards||[])]));
 p.collection = Array.from(new Set([...(p.collection||[]),...(rewards.wonCards||[])]));
 p.lastCheckpoint="campaign-2-complete";
 localStorage.setItem(KEY,JSON.stringify(p));
 localStorage.setItem("nemesis_campaign3_unlocked","true");
 const old=document.getElementById("nf-c2-ending"); if(old) old.remove();
 const d=document.createElement("div"); d.id="nf-c2-ending";
 d.style.cssText="position:fixed;inset:0;z-index:100000;background:radial-gradient(circle,#3d1266,#050008 62%,#000);color:white;display:grid;place-items:center;text-align:center;font-family:Georgia,serif;padding:30px";
 d.innerHTML='<div><div style="font-size:clamp(34px,6vw,80px);color:#d5a5ff;text-shadow:0 0 30px #8a2be2">DIOS FANTASMA DERROTADO</div><p style="font-size:clamp(22px,3vw,38px)">“Me vengaré...”</p><p>Campaña II completada · Cartas y progreso conservados</p><button id="nf-c2-home" style="padding:14px 28px;font-size:18px;cursor:pointer">VOLVER AL INICIO</button></div>';
 document.body.appendChild(d);
 document.getElementById("nf-c2-home").onclick=()=>{d.remove(); if(typeof window.showMainMenu==="function") window.showMainMenu(); else location.href="./";};
 return p;
};
})();