#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..'),game=fs.readFileSync(path.join(ROOT,'js/game.js'),'utf8');
const collection=JSON.parse(fs.readFileSync(path.join(ROOT,'data/nemesis_collection_33_cards.json'),'utf8')).cards;
const bossProfiles=JSON.parse(fs.readFileSync(path.join(ROOT,'data/boss-profiles-v1.json'),'utf8')).campaigns;
function block(name){
 const at=game.indexOf('const '+name+'='); if(at<0)return '';
 const start=game.indexOf('[',at); if(start<0)return '';
 let d=0,q='',esc=false;
 for(let i=start;i<game.length;i++){const ch=game[i];if(q){if(esc)esc=false;else if(ch==='\\')esc=true;else if(ch===q)q='';continue}if(ch==="'"||ch==='"'||ch==='\x60'){q=ch;continue}if(ch==='[')d++;else if(ch===']'&&--d===0)return game.slice(start,i+1)}return ''
}
function objects(name){
 const b=block(name),out=[];let d=0,s=-1,q='',esc=false;
 for(let i=0;i<b.length;i++){const ch=b[i];if(q){if(esc)esc=false;else if(ch==='\\')esc=true;else if(ch===q)q='';continue}if(ch==="'"||ch==='"'||ch==='\x60'){q=ch;continue}if(ch==='{'){if(d++===0)s=i}else if(ch==='}'&&--d===0&&s>=0){const x=b.slice(s,i+1),get=(k)=>{const m=x.match(new RegExp(k+"\\s*:\\s*['\x22]([^'\x22]+)['\x22]"));return m&&m[1]},num=(k)=>{const m=x.match(new RegExp(k+'\\s*:\\s*(-?\\d+)'));return m?+m[1]:0};const id=get('id');if(id)out.push({id,name:get('name')||id,atk:num('atk'),def:num('def'),type:get('type')||'monster',rarity:get('rarity')||'',effect:get('effect')||'',text:x})}}return out
}
const allArrays=['OLIMPO_PLAYER_CARDS','APOLO_PLAYER_CARDS','DIVINE_PLAYER_CARDS','BASE_CARDS','NEW_CARDS','NEW_CARDS','PLAYER_EXCLUSIVE_CARDS','DIVINE_PLAYER_CARDS','DRAGON_OJO_CARDS','ANCESTRAL_CARDS','SPECTRAL_CARDS','REY_ESPECTRAL_CARDS','DIOS_FANTASMA_CARDS','ARES_CARDS_1_5','HADES_CARDS','OLIMPO_CARDS','CABALLEROS_SUBMUNDO_CARDS','MAGO_ROJO_CARDS','IMPERIO_DRAGON_CARDS'];
const pool=new Map();for(const a of allArrays)for(const c of objects(a))pool.set(c.id,c);
for(const c of collection){pool.set(c.id,{id:c.id,name:c.nombre||c.id,atk:+(c.atk||c.atk_bonus||c.bonos?.atk||0),def:+(c.def||c.def_bonus||c.bonos?.def||0),type:/TRAMPA/i.test(c.clase)?'trap':/(MAGICA|ARMA|ARMADURA|RELIQUIA)/i.test(c.clase)?'magic':'monster',rarity:c.rareza||'',effect:'external',text:JSON.stringify(c)})}
function ids(name){const b=block(name);return [...b.matchAll(/['"]([^'"]+)['"]/g)].map(m=>m[1])}
function fromIds(ar){return ar.map(id=>pool.get(id)).filter(Boolean)}
function prefix(p){return [...pool.values()].filter(c=>c.id.startsWith(p)).sort((a,b)=>a.id.localeCompare(b.id))}
const defs={
 DUEL_MASTER:{cards:prefix('DM-'),hp:30000},
 MAGO_ROJO:{cards:objects('MAGO_ROJO_CARDS'),hp:30000},
 IMPERIO_DRAGON:{cards:objects('IMPERIO_DRAGON_CARDS'),hp:30000},
 CABALLEROS_SUBMUNDO:{cards:objects('CABALLEROS_SUBMUNDO_CARDS'),hp:30000},
 OLIMPO:{cards:fromIds(ids('OLIMPO_DECK_IDS')),hp:30000},
 GUARDIAN:{cards:fromIds(ids('GUARDIAN_BOSS_CARD_IDS')),hp:bossProfiles['1'].guardian.hp},
 DRAGON_OJO:{cards:fromIds(ids('DRAGON_OJO_DECK_SLOTS')),hp:bossProfiles['1'].dragon.hp},
 IRA_DE_RA:{cards:objects('ANCESTRAL_CARDS'),hp:bossProfiles['1'].ra.hp},
 CABALLERO_ALMAS:{cards:objects('SPECTRAL_CARDS'),hp:bossProfiles['2']['caballero-almas'].hp},
 REY_ESPECTRAL:{cards:objects('REY_ESPECTRAL_CARDS'),hp:bossProfiles['2']['rey-espectral'].hp},
 DIOS_FANTASMA:{cards:objects('DIOS_FANTASMA_CARDS'),hp:bossProfiles['2']['dios-fantasma'].hp},
 ARES:{cards:objects('ARES_CARDS_1_5'),hp:bossProfiles['3'].ares.hp},
 HADES:{cards:objects('HADES_CARDS'),hp:bossProfiles['3'].hades.hp}
};
const EXPECTED={DUEL_MASTER:20,MAGO_ROJO:20,IMPERIO_DRAGON:20,CABALLEROS_SUBMUNDO:20,OLIMPO:11,GUARDIAN:9,DRAGON_OJO:12,IRA_DE_RA:15,CABALLERO_ALMAS:10,REY_ESPECTRAL:10,DIOS_FANTASMA:10,ARES:12,HADES:12};
for(const [n,d] of Object.entries(defs)){if(!d.cards.length)throw Error('Arena Global: '+n+' sin cartas');if(d.cards.length!==EXPECTED[n])throw Error('Arena Global: '+n+' incompleto '+d.cards.length+'/'+EXPECTED[n]);}
// El perfil GUARDIAN declara 10 IDs, pero "dragon" es una clave legacy de jefe y no una carta definida.
const guardianDeclared=ids('GUARDIAN_BOSS_CARD_IDS');
const guardianMissing=guardianDeclared.filter(id=>!pool.has(id));
if(guardianMissing.some(id=>id!=='dragon'))throw Error('Arena Global: GUARDIAN IDs reales faltantes '+guardianMissing.join(','));
const deckAudit=Object.fromEntries(Object.entries(defs).map(([n,d])=>[n,{loaded:d.cards.length,expected:EXPECTED[n],ok:d.cards.length===EXPECTED[n],ids:d.cards.map(c=>c.id)}]));
function hash(s){let h=2166136261>>>0;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function shuffle(a,r){a=a.map(x=>({...x}));for(let i=a.length-1;i;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function text(c){return String(c.text||'').toUpperCase()}
function score(c){const t=text(c);let v=c.atk+.7*c.def;if(/DIVINA|SUPREMA|ÚNICA|UNICA|PRIMORD/.test(t))v+=1800;if(/ANCESTRAL|MITIC/.test(t))v+=1100;if(/RESURRE|EVITA SU DESTRU|PROTEG/.test(t))v+=1300;if(/DESTRU|DESTIERR|TÁRTARO|TARTARO|ANULA|NIEGA/.test(t))v+=1100;if(/SEGUNDO ATAQUE|ATACAR.*NUEV|PERFOR/.test(t))v+=900;if(/DAÑO DIRECTO|DAMAGEOPPONENT/.test(t))v+=700;return v}
function player(name,r){const d=shuffle(defs[name].cards,r);while(d.length<20)d.push(...shuffle(defs[name].cards,r));return{name,hp:defs[name].hp,deck:d.slice(0,20),hand:[],field:[],grave:[],damage:0,res:0};}
function draw(p){if(p.deck.length)p.hand.push(p.deck.shift())}
function support(p,o,c,r){p.hand.splice(p.hand.indexOf(c),1);p.grave.push(c);const t=text(c);if(/HEAL|CURA|RECUPERA.*HP/.test(t))p.hp+=1200;if(/DAÑO DIRECTO|DAMAGEOPPONENT|INFLIGE/.test(t)){o.hp-=1000;p.damage+=1000}if(/DESTRU|DESTIERR|TÁRTARO|TARTARO|ANULA/.test(t)&&o.field.length&&r()<.55){const v=o.field.slice().sort((a,b)=>score(b)-score(a))[0];o.field.splice(o.field.indexOf(v),1);o.grave.push(v)}if(/RESURRE|CEMENTERIO.*CAMPO|RECUPERA/.test(t)&&p.grave.length>1&&p.field.length<5){const m=p.grave.filter(x=>x.type==='monster').sort((a,b)=>score(b)-score(a))[0];if(m){p.grave.splice(p.grave.indexOf(m),1);p.field.push(m)}}}
function turn(p,o,r){draw(p);const su=p.hand.filter(c=>c.type!=='monster').sort((a,b)=>score(b)-score(a))[0];if(su)support(p,o,su,r);const m=p.hand.filter(c=>c.type==='monster').sort((a,b)=>score(b)-score(a))[0];if(m&&p.field.length<5){p.hand.splice(p.hand.indexOf(m),1);p.field.push(m);const t=text(m);if(/AL ENTRAR|AL SER INVOC/.test(t)&&/DAÑO DIRECTO|INFLIGE/.test(t)){o.hp-=1000;p.damage+=1000}}
 for(const a of [...p.field].sort((x,y)=>score(y)-score(x))){if(o.hp<=0)break;let attacks=/SEGUNDO ATAQUE|ATACAR.*NUEV|TRES FAUCES/.test(text(a))?2:1;while(attacks--&&o.hp>0){if(!o.field.length){o.hp-=a.atk;p.damage+=a.atk;continue}const v=o.field.slice().sort((x,y)=>x.def-y.def)[0],pen=/PERFOR|IGNORA 50% DEF|PENETR/.test(text(a))?.5:1,df=v.def*pen;if(a.atk>df){const dmg=Math.round(a.atk-df);o.hp-=dmg;p.damage+=dmg;const prot=/EVITA SU DESTRU|PRIMERA DESTRUCCIÓN|PRIMERA DESTRUCCION/.test(text(v))&&o.res++<1;if(!prot){o.field.splice(o.field.indexOf(v),1);o.grave.push(v)}}else if(df>a.atk)p.hp-=Math.min(2200,Math.round((df-a.atk)*.25))}}
 }
function one(a,b,seed,first){const r=rng(seed),A=player(a,r),B=player(b,r);for(let i=0;i<5;i++){draw(A);draw(B)}const order=first?[A,B]:[B,A];for(let t=0;t<80&&A.hp>0&&B.hp>0;t++){const p=order[t%2],o=p===A?B:A;turn(p,o,r)}const w=A.hp===B.hp?(A.damage===B.damage?'DRAW':A.damage>B.damage?a:b):A.hp>B.hp?a:b;return w}
const N=Math.max(50,+(process.argv[2]||250)),seed=process.argv[3]||'arena-global-v1',names=Object.keys(defs),stats=Object.fromEntries(names.map(n=>[n,{wins:0,losses:0,draws:0,games:0}]));
const matchups=[];for(let i=0;i<names.length;i++)for(let j=i+1;j<names.length;j++){const a=names[i],b=names[j];let wa=0,wb=0,dr=0;for(let k=0;k<N;k++){const w=one(a,b,hash(seed+a+b+k),k%2===0);if(w===a)wa++;else if(w===b)wb++;else dr++}stats[a].wins+=wa;stats[a].losses+=wb;stats[a].draws+=dr;stats[a].games+=N;stats[b].wins+=wb;stats[b].losses+=wa;stats[b].draws+=dr;stats[b].games+=N;matchups.push({a,b,games:N,winsA:wa,winsB:wb,draws:dr,winRateA:+(100*wa/N).toFixed(1),winRateB:+(100*wb/N).toFixed(1)})}
const ranking=names.map(name=>({name,cards:defs[name].cards.length,hp:defs[name].hp,...stats[name],winRate:+(100*stats[name].wins/stats[name].games).toFixed(2)})).sort((a,b)=>b.winRate-a.winRate);
const cardRanking=[...pool.values()].map(c=>({id:c.id,name:c.name,atk:c.atk,def:c.def,power:Math.round(score(c))})).sort((a,b)=>b.power-a.power).slice(0,30);
const report={simulator:'NEMESIS_ARENA_GLOBAL_V1',method:'seeded deterministic Monte Carlo + strategic effect heuristics',gamesPerMatchup:N,totalGames:matchups.length*N,decks:names.length,deckAudit,seed,ranking,matchups,topCards:cardRanking,note:'Laboratorio de balance: aproxima efectos complejos mediante heurísticas; no reemplaza pruebas runtime/humanas.'};
fs.writeFileSync(path.join(__dirname,'ARENA_GLOBAL_RESULTS.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
