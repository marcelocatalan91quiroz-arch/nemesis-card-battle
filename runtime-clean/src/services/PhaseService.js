export class PhaseService{
  static ORDER=Object.freeze(['DRAW','MAIN1','BATTLE','MAIN2','END']);
  constructor({turnService,eventBus}={}){
    if(!turnService)throw new Error('TURN_SERVICE_REQUIRED');
    this.turns=turnService;this.events=eventBus??null;this.phase=null;this.turnNumber=0;this.player=null;
  }
  startTurn(player){
    this.turns.assertPriority(player);this.player=player;this.turnNumber=this.turns.turnNumber;this.phase='DRAW';
    this.events?.emit('phase:started',{player,turnNumber:this.turnNumber,phase:this.phase});return this.snapshot();
  }
  assert(player,allowed){
    this.turns.assertPriority(player);
    const list=Array.isArray(allowed)?allowed:[allowed];
    if(!list.includes(this.phase))throw new Error('ACTION_NOT_ALLOWED_IN_PHASE:'+this.phase);
    return true;
  }
  advance(player){
    this.turns.assertPriority(player);
    if(this.player!==player||this.turnNumber!==this.turns.turnNumber)throw new Error('PHASE_TURN_MISMATCH');
    const i=PhaseService.ORDER.indexOf(this.phase);if(i<0)throw new Error('PHASE_NOT_STARTED');
    if(i===PhaseService.ORDER.length-1)throw new Error('END_PHASE_REQUIRES_TURN_END');
    const from=this.phase;this.events?.emit('phase:ended',{player,turnNumber:this.turnNumber,phase:from});
    this.phase=PhaseService.ORDER[i+1];this.events?.emit('phase:started',{player,turnNumber:this.turnNumber,phase:this.phase});
    return this.snapshot();
  }
  resetForNextTurn(player){return this.startTurn(player)}
  snapshot(){return Object.freeze({player:this.player,turnNumber:this.turnNumber,phase:this.phase,order:PhaseService.ORDER})}
}