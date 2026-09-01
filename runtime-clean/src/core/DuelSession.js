import{GameState}from'./GameState.js';import{EventBus}from'./EventBus.js';import{DeckService}from'../decks/DeckService.js';import{DrawService}from'../services/DrawService.js';import{TurnService}from'../services/TurnService.js';
export class DuelSession{
  constructor({cardRegistry,deckRegistry,players=['player','enemy'],uidFactory}={}){
    if(!cardRegistry||!deckRegistry)throw new Error('DUEL_REGISTRIES_REQUIRED');
    this.state=new GameState();this.events=new EventBus();
    this.decks=new DeckService({cardRegistry,deckRegistry,state:this.state,uidFactory});
    this.draws=new DrawService({deckService:this.decks,eventBus:this.events});
    this.turns=new TurnService({players,eventBus:this.events});
    this.players=[...players];this.started=false;
  }
  prepareDeck(player,deckId){if(this.started)throw new Error('DUEL_ALREADY_STARTED');return this.decks.instantiate(deckId,{owner:player})}
  start({firstPlayer,openingHandSize}={}){
    if(this.started)throw new Error('DUEL_ALREADY_STARTED');
    if(!Number.isInteger(openingHandSize)||openingHandSize<0)throw new Error('OPENING_HAND_SIZE_REQUIRED');
    for(const p of this.players)if(!this.decks.session(p))throw new Error('PLAYER_DECK_MISSING:'+p);
    const opening={};for(const p of this.players)opening[p]=this.draws.openingHand(p,openingHandSize);
    const turn=this.turns.start({firstPlayer});this.started=true;
    this.events.emit('duel:started',{firstPlayer:turn.currentPlayer,openingHandSize});
    return{turn,opening,state:this.state.audit()};
  }
  drawForTurn(player,count=1){this.turns.assertPriority(player);return this.draws.draw(player,count,{reason:'turn'})}
  endTurn(player){this.turns.assertPriority(player);return this.turns.endTurn()}
}