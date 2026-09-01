const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync(require('node:path').join(__dirname,'../js/core-clean-runtime.js'),'utf8');
const events=[];const window={dispatchEvent:e=>events.push(e)};class CustomEvent{constructor(type,init){this.type=type;this.detail=init?.detail}}
vm.runInNewContext(src,{window,CustomEvent,console});
const core=window.NEMESIS_CORE_CLEAN;
let n=0,mirror={};
assert.equal(core.status,'READY_WITH_SAFE_FALLBACK');
assert.equal(core.cards['strategic-prometeo'].priceStars,1700);
assert.equal(core.resolveMGR016({turn:3,mirror,damage:x=>n+=x}).cancelled,true);
assert.equal(n,800);
core.resolveMGR016({turn:3,mirror,damage:x=>n+=x});assert.equal(n,800);
assert.equal(core.resolveMGR016({turn:4,mirror,damage:x=>n+=x,reflect:()=>true}).mode,'TYPED_REFLECT');
assert.equal(n,1600);
assert.equal(core.isGreatPower({rarity:'ANCESTRAL'}),false);
assert.equal(core.isGreatPower({powerClass:'GREAT_POWER'}),true);
const save=core.sanitizeSave({owned:['MGR-021','MGR-SHINY-001','strategic-prometeo'],deck:['MGR-021','MGR-021']});
assert.deepEqual([...save.owned],['MGR-SHINY-001','strategic-prometeo']);assert.deepEqual([...save.deck],['MGR-SHINY-001']);
assert.equal(events[0].type,'nemesis-core-clean-ready');
console.log('CORE CLEAN PRODUCTION RUNTIME: PASS — 10/10');