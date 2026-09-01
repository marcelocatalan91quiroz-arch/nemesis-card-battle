export class DrawService{
  constructor({deckService,eventBus}={}){
    if(!deckService)throw new Error('DECK_SERVICE_REQUIRED');this.decks=deckService;this.events=eventBus??null;this.turnDraws=new Set();
  }
  draw(owner,count=1,{reason='effect'}={}){
    if(!Number.isInteger(count)||count<0)throw new Error('INVALID_DRAW_COUNT');
    const cards=this.decks.draw(owner,count);
    this.events?.emit('cards:drawn',{owner,count:cards.length,reason,uids:cards.map(c=>c.uid)});
    return cards;
  }
  openingHand(owner,size){return this.draw(owner,size,{reason:'opening-hand'})}
  drawTurnCard(owner,turnNumber){
    if(!Number.isInteger(turnNumber)||turnNumber<1)throw new Error('INVALID_TURN_NUMBER');
    const key=turnNumber+':'+owner;if(this.turnDraws.has(key))throw new Error('TURN_DRAW_ALREADY_USED:'+owner);
    const cards=this.draw(owner,1,{reason:'turn'});this.turnDraws.add(key);return cards;
  }
}