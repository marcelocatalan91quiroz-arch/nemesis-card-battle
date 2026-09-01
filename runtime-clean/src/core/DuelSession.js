import{GameState}from'./GameState.js';
import{EventBus}from'./EventBus.js';
import{DeckService}from'../decks/DeckService.js';
import{DrawService}from'../services/DrawService.js';
import{TurnService}from'../services/TurnService.js';
import{PhaseService}from'../services/PhaseService.js';
import{ActionService}from'../services/ActionService.js';

export class DuelSession{
  constructor({cardRegistry,deckRegistry,players=['player','enemy'],uidFactory,monsterZoneLimit=Infinity}={}){
    if(!cardRegistry||!deckRegistry)throw new Error('DUEL_REGISTRIES_REQUIRED');
    this.state=new GameState();this.events=new EventBus();this.players=[...players];
    this.decks=new DeckService({cardRegistry,deckRegistry,state:this.state,uidFactory});
    this.draws=new DrawService({deckService:this.decks,eventBus:this.events});
    this.turns=new TurnService({players,eventBus:this.events});
    this.phases=new PhaseService({turnService:this.turns,eventBus:this.events});
    this.actions=new ActionService({state:this.state,cardRegistry,turnService:this.turns,phaseService:this.phases,eventBus:this.events,monsterZoneLimit});
    this.started=false;
  }
  prepareDeck(player,deckId){if(this.started)throw new Error('DUEL_ALREADY_STARTED');return this.decks.instantiate(deckId,{owner:player})}
  start({firstPlayer,openingHandSize}={}){
    if(this.started)throw new Error('DUEL_ALREADY_STARTED');
    if(!Number.isInteger(openingHandSize)||openingHandSize<0)throw new Error('OPENING_HAND_SIZE_REQUIRED');
    for(const p of this.players)if(!this.decks.session(p))throw new Error('PLAYER_DECK_MISSING:'+p);
    const opening={};for(const p of this.players)opening[p]=this.draws.openingHand(p,openingHandSize);
    const turn=this.turns.start({firstPlayer});this.phases.startTurn(turn.currentPlayer);this.started=true;
    this.events.emit('duel:started',{firstPlayer:turn.currentPlayer,openingHandSize,phase:this.phases.phase});
    return{turn,phase:this.phases.snapshot(),opening,state:this.state.audit()};
  }
  drawForTurn(player){this.phases.assert(player,'DRAW');return this.draws.drawTurnCard(player,this.turns.turnNumber)}
  advancePhase(player){return this.phases.advance(player)}
  normalSummon(player,uid){return this.actions.normalSummon(player,uid)}
  authorizeSpecialSummon(options){return this.actions.authorizeSpecialSummon(options)}
  specialSummon(player,uid,permit){return this.actions.specialSummon(player,uid,permit)}
  endTurn(player){
    this.phases.assert(player,'END');
    const next=this.turns.endTurn();this.phases.resetForNextTurn(next.currentPlayer);return{turn:next,phase:this.phases.snapshot()};
  }
}