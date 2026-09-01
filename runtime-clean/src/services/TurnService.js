export class TurnService{
  constructor({players,eventBus}={}){
    if(!Array.isArray(players)||players.length!==2||new Set(players).size!==2)throw new Error('TWO_UNIQUE_PLAYERS_REQUIRED');
    this.players=[...players];this.events=eventBus??null;this.turnNumber=0;this.currentPlayer=null;this.started=false;this.ended=false;
  }
  start({firstPlayer}={}){
    if(this.started)throw new Error('TURN_SERVICE_ALREADY_STARTED');
    const first=firstPlayer??this.players[0];if(!this.players.includes(first))throw new Error('INVALID_FIRST_PLAYER');
    this.started=true;this.turnNumber=1;this.currentPlayer=first;
    this.events?.emit('turn:started',{turnNumber:this.turnNumber,player:first,initial:true});
    return this.snapshot();
  }
  endTurn(){
    if(!this.started||this.ended)throw new Error('TURN_SERVICE_NOT_ACTIVE');
    const from=this.currentPlayer,to=this.players.find(p=>p!==from);
    this.events?.emit('turn:ended',{turnNumber:this.turnNumber,player:from});
    this.turnNumber++;this.currentPlayer=to;
    this.events?.emit('turn:started',{turnNumber:this.turnNumber,player:to,initial:false});
    return this.snapshot();
  }
  assertPriority(player){if(!this.started||this.ended)throw new Error('TURN_SERVICE_NOT_ACTIVE');if(this.currentPlayer!==player)throw new Error('NO_TURN_PRIORITY:'+player);return true}
  finish(){this.ended=true;this.events?.emit('turn:service-ended',{turnNumber:this.turnNumber,player:this.currentPlayer})}
  snapshot(){return Object.freeze({started:this.started,ended:this.ended,turnNumber:this.turnNumber,currentPlayer:this.currentPlayer,players:Object.freeze([...this.players])})}
}