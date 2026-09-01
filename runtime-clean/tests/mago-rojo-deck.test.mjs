import assert from'node:assert/strict';
import fs from'node:fs/promises';
import path from'node:path';
import{fileURLToPath}from'node:url';
import{FrozenDataLoader,DataRepository,CardRegistry,GameState,DeckRegistry,DeckService,registerMagoRojo}from'../src/index.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const repoRoot=path.resolve(here,'../..');
let pass=0;const ok=(x,m)=>{assert.ok(x,m);pass++};
const readJson=async relative=>JSON.parse(await fs.readFile(path.join(repoRoot,relative),'utf8'));

const loader=new FrozenDataLoader({readJson});
const entries=await loader.loadAll();
ok(entries.length===13,'13 frozen JSON loaded');
ok(new Set(entries.map(x=>x.sourcePath)).size===13,'13 source paths unique');
ok(entries.every(x=>x.sourceSha&&x.frozenPath.startsWith('runtime-clean/frozen-source/data/')),'source provenance preserved');

const data=new DataRepository(entries);
ok(data.size===13,'data repository contains 13');
ok(data.has('data/mago_rojo_deck_v1.json'),'Mago Rojo source loaded');
ok(data.has('data/imperio_dragon_deck_v1.json'),'Imperio Dragon source loaded');
ok(data.has('data/nemesis_collection_33_cards.json'),'global collection source loaded');
ok(data.has('data/nemesis_treasures_5_cards.json'),'treasures source loaded');

const cards=new CardRegistry(),decks=new DeckRegistry(),state=new GameState();
const mago=registerMagoRojo({dataRepository:data,cardRegistry:cards,deckRegistry:decks});
ok(mago.cardIds.length===20,'Mago Rojo deck has 20 slots');
ok(cards.size===20,'Mago Rojo registered 20 definitions');
ok(decks.size===1&&decks.has('MAGO_ROJO'),'Mago Rojo deck registered');
ok(mago.cardIds[0]==='MGR-001'&&mago.cardIds[19]==='MGR-020','Mago Rojo canonical range 001-020');
ok(cards.get('MGR-001').atk===2800&&cards.get('MGR-001').def===2400,'MGR-001 real stats loaded');
ok(cards.get('MGR-020')!==null,'MGR-020 loaded');

let uidN=0;
const deckService=new DeckService({cardRegistry:cards,deckRegistry:decks,state,uidFactory:(deckId,cardId)=>'deck-'+(++uidN)+'-'+cardId});
const validation=deckService.validate('MAGO_ROJO');
ok(validation.ok&&validation.size===20,'deck validation passes');

const session=deckService.instantiate('MAGO_ROJO',{owner:'player'});
ok(session.uids.length===20,'20 card instances created');
ok(new Set(session.uids).size===20,'20 UIDs unique');
ok(state.instances.size===20,'GameState owns all 20 instances');
ok(deckService.count('player','deck')===20,'20 cards start in deck');
ok(state.audit().ok,'state valid after deck instantiate');

const beforeShuffle=new Set(session.uids);
deckService.shuffle('player',()=>0.37);
ok(session.uids.length===20&&session.uids.every(uid=>beforeShuffle.has(uid)),'shuffle preserves exact UIDs');
ok(state.audit().ok,'state valid after shuffle');

const drawn=deckService.draw('player',5);
ok(drawn.length===5,'draw 5 cards');
ok(deckService.count('player','hand')===5,'5 cards in hand');
ok(deckService.count('player','deck')===15,'15 cards remain in deck');
ok(new Set(drawn.map(x=>x.uid)).size===5,'drawn UIDs unique');
ok(drawn.every(x=>x.owner==='player'&&x.controller==='player'),'ownership preserved');
ok(state.audit().ok,'state valid after draw');

const first=drawn[0],uid=first.uid;
state.move(uid,'field');state.move(uid,'graveyard');state.move(uid,'field');
ok(first.uid===uid,'full deck card preserves UID through zones');
ok(state.instances.get(uid)===first,'same instance survives zone cycle');
ok(state.audit().ok,'final full-deck state valid');

let duplicateOwnerBlocked=false;try{deckService.instantiate('MAGO_ROJO',{owner:'player'})}catch{duplicateOwnerBlocked=true}
ok(duplicateOwnerBlocked,'second deck for same owner blocked');

console.log('NEMESIS RUNTIME CLEAN MAGO ROJO DECK: PASS — '+pass+'/'+pass);