import{normalizeDeckFile}from'../cards/CardNormalizer.js';
export function registerImperioDragon({dataRepository,cardRegistry,deckRegistry}){
  const sourcePath='data/imperio_dragon_deck_v1.json';
  const raw=dataRepository.get(sourcePath);if(!raw)throw new Error('IMPERIO_DRAGON_SOURCE_MISSING');
  const deck=normalizeDeckFile(raw,{sourcePath});
  if(deck.cardIds.length!==20)throw new Error('IMPERIO_DRAGON_REQUIRES_20_CARDS');
  if(deck.cards.length!==20)throw new Error('IMPERIO_DRAGON_REQUIRES_20_DEFINITIONS');
  const ids=new Set(deck.cards.map(c=>c.id));for(const id of deck.cardIds)if(!ids.has(id))throw new Error('IMPERIO_DRAGON_DEFINITION_MISSING:'+id);
  for(const c of deck.cards)cardRegistry.register(c);
  return deckRegistry.register({id:'IMPERIO_DRAGON',name:'Imperio Dragón',mechanic:deck.mechanic,cardIds:deck.cardIds,sourcePath});
}