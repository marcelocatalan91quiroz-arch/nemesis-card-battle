import assert from'node:assert/strict';
import{CardRegistry}from'../src/core/CardRegistry.js';
import{createCardInstance}from'../src/core/CardInstance.js';
import{GameState}from'../src/core/GameState.js';
import{GraveyardService}from'../src/services/GraveyardService.js';
import{RendererGuard}from'../src/renderer/RendererGuard.js';
import{buildCardViewModel}from'../src/viewmodel/CardViewModel.js';
let pass=0;const ok=(x,m)=>{assert.ok(x,m);pass++};

const reg=new CardRegistry();
reg.register({id:'MGR-001',name:'Mago Rojo',atk:2800,def:2400,type:'CRIATURA',rarity:'EPICA'});
reg.register({id:'IDR-001',name:'Dragón Carmesí Joven',atk:1800,def:1600,type:'CRIATURA',rarity:'COMUN'});
const state=new GameState();
const mgr=createCardInstance('MGR-001',{uid:'lab-mgr-001-copy-1'});
const idr=createCardInstance('IDR-001',{uid:'lab-idr-001-copy-1'});
state.add(mgr,'field');state.add(idr,'field');
const grave=new GraveyardService(state);

grave.destroy(mgr.uid,{reason:'battle'});
ok(mgr.zone==='graveyard','destroy moves to graveyard');
ok(state.zones.graveyard.includes(mgr.uid),'graveyard contains same uid');
ok(state.instances.get(mgr.uid)===mgr,'same instance survives destruction');
ok(state.audit().ok,'state valid after destruction');

const beforeUid=mgr.uid;
grave.resurrect(mgr.uid);
ok(mgr.zone==='field','resurrection returns to field');
ok(mgr.uid===beforeUid,'resurrection preserves uid');
ok(state.instances.get(beforeUid)===mgr,'resurrection preserves instance');
ok(state.audit().ok,'state valid after resurrection');

let failed=false;try{grave.destroy('missing')}catch{failed=true}ok(failed,'unknown uid fails closed');
failed=false;try{grave.resurrect(idr.uid)}catch{failed=true}ok(failed,'cannot resurrect non-graveyard');

const vm=buildCardViewModel({definition:reg.get(mgr.cardId),instance:mgr,imageUrl:'../public/assets/cards/MGR-001.svg'});
const stateBefore=JSON.stringify({zones:state.zones,uid:mgr.uid,zone:mgr.zone,cardId:mgr.cardId});
let captured=null;
const guard=new RendererGuard({onError:(e,ctx)=>captured={message:e.message,...ctx}});
const explodingRenderer={render(){throw new Error('INTENTIONAL_RENDER_FAILURE')}};
const result=guard.render(explodingRenderer,vm,{});
ok(result.ok===false,'renderer failure captured');
ok(result.uid===mgr.uid,'failure reports uid');
ok(captured?.message==='INTENTIONAL_RENDER_FAILURE','intentional error observed');
ok(JSON.stringify({zones:state.zones,uid:mgr.uid,zone:mgr.zone,cardId:mgr.cardId})===stateBefore,'renderer failure cannot mutate state');
ok(state.instances.get(mgr.uid)===mgr,'card remains in game state after render failure');
ok(state.audit().ok,'state valid after render failure');

const harmless={render(v){return{uid:v.uid}}};
const good=guard.render(harmless,vm,{});
ok(good.ok===true&&good.uid===mgr.uid,'renderer recovery works');
ok(mgr.uid===beforeUid&&mgr.zone==='field','uid and zone intact after recovery');

grave.destroy(idr.uid,{reason:'effect'});
const resurrectable=grave.listResurrectable();
ok(resurrectable.length===1&&resurrectable[0].uid===idr.uid,'resurrectable list is real state');
grave.resurrect(idr.uid);
ok(idr.uid==='lab-idr-001-copy-1'&&idr.zone==='field','second card preserves uid through cycle');
ok(state.audit().ok,'final state valid');

console.log('NEMESIS RUNTIME CLEAN RESILIENCE: PASS — '+pass+'/'+pass);