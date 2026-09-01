(()=>{'use strict';
const STATUS='READY_WITH_SAFE_FALLBACK';
const VERSION='CORE_CLEAN_PROD_2026-09-01';
const PROMETHEUS_ID='strategic-prometeo';
const dedupe=a=>[...new Set((Array.isArray(a)?a:[]).map(x=>x==='MGR-021'?'MGR-SHINY-001':x).filter(Boolean))];
function resolveMGR016({turn=0,mirror=null,damage=null,reflect=null}={}){
 if(!mirror)return{cancelled:false,reflected:false,damage:0,mode:'NO_MIRROR'};
 let reflected=false;
 if(typeof reflect==='function'){try{reflected=reflect()!==false}catch{reflected=false}}
 const first=mirror._coreMirrorDamageTurn!==turn;
 if(first){mirror._coreMirrorDamageTurn=turn;if(typeof damage==='function')damage(800)}
 return{cancelled:true,reflected,damage:first?800:0,mode:reflected?'TYPED_REFLECT':'SAFE_NEGATE_ONLY'};
}
function isGreatPower(effect){
 return !!effect&&(effect.greatPower===true||effect.powerClass==='GREAT_POWER'||effect.powerClass==='GRAN_PODER');
}
function sanitizeSave(save={}){
 const out={...save};
 if(Array.isArray(save.owned))out.owned=dedupe(save.owned);
 if(Array.isArray(save.deck))out.deck=dedupe(save.deck);
 if(save.savedDecks&&typeof save.savedDecks==='object'){
  out.savedDecks={};for(const [k,v] of Object.entries(save.savedDecks))out.savedDecks[k]=Array.isArray(v)?dedupe(v):v;
 }
 return out;
}
const cards=Object.freeze({
 [PROMETHEUS_ID]:Object.freeze({id:PROMETHEUS_ID,name:'Prometeo — Portador del Fuego Eterno',status:STATUS,identityPolicy:'LEGACY_RESERVED_OPERATIONAL_ID',atk:10000,def:9000,level:10,priceStars:1700})
});
const api=Object.freeze({status:STATUS,version:VERSION,cards,resolveMGR016,isGreatPower,sanitizeSave,health:()=>({ok:true,status:STATUS,version:VERSION,blockers:0})});
Object.defineProperty(window,'NEMESIS_CORE_CLEAN',{value:api,configurable:false,writable:false});
window.NEMESIS_CORE_CLEAN_STATUS=STATUS;
window.dispatchEvent(new CustomEvent('nemesis-core-clean-ready',{detail:api.health()}));
})();