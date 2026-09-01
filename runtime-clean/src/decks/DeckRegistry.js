export class DeckRegistry{
  #m=new Map();
  register(def){
    if(!def?.id)throw new Error('DECK_ID_REQUIRED');
    if(this.#m.has(def.id))throw new Error('DUPLICATE_DECK_ID:'+def.id);
    if(!Array.isArray(def.cardIds)||!def.cardIds.length)throw new Error('DECK_CARDS_REQUIRED:'+def.id);
    const frozen=Object.freeze({...def,cardIds:Object.freeze([...def.cardIds])});
    this.#m.set(def.id,frozen);return frozen;
  }
  get(id){return this.#m.get(id)||null}
  has(id){return this.#m.has(id)}
  list(){return [...this.#m.values()]}
  get size(){return this.#m.size}
}