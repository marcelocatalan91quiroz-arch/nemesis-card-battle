export class DrawService{
  constructor({deckService,eventBus}={}){if(!deckService)throw new Error('DECK_SERVICE_REQUIRED');this.decks=deckService;this.events=eventBus??null}
  draw(owner,count=1,{reason='turn'}={}){
    if(!Number.isInteger(count)||count<0)throw new Error('INVALID_DRAW_COUNT');
    const cards=this.decks.draw(owner,count);
    if(this.events)this.events.emit('cards:drawn',{owner,count:cards.length,reason,uids:cards.map(c=>c.uid)});
    return cards;
  }
  openingHand(owner,size){return this.draw(owner,size,{reason:'opening-hand'})}
}