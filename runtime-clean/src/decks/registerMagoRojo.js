import{normalizeDeckFile}from'../cards/CardNormalizer.js';
export function registerMagoRojo({dataRepository,cardRegistry,deckRegistry}){
  const sourcePath='data/mago_rojo_deck_v1.json';
  const raw=dataRepository.get(sourcePath);if(!raw)throw new Error('MAGO_ROJO_SOURCE_MISSING');
  const deck=normalizeDeckFile(raw,{sourcePath});
  if(deck.cardIds.length!==20)throw new Error('MAGO_ROJO_REQUIRES_20_CARDS');
  if(deck.cards.length!==20)throw new Error('MAGO_ROJO_REQUIRES_20_DEFINITIONS');
  const ids=new Set(deck.cards.map(c=>c.id));for(const id of deck.cardIds)if(!ids.has(id))throw new Error('MAGO_ROJO_DEFINITION_MISSING:'+id);
  for(const c of deck.cards)cardRegistry.register(c);
  return deckRegistry.register({id:'MAGO_ROJO',name:'Mago Rojo',mechanic:deck.mechanic,cardIds:deck.cardIds,sourcePath});
}