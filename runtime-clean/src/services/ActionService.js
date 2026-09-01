export class ActionService{
  #permits=new Map();#permitSeq=0;
  constructor({state,cardRegistry,turnService,phaseService,eventBus,monsterZoneLimit=Infinity}={}){
    if(!state||!cardRegistry||!turnService||!phaseService)throw new Error('ACTION_SERVICE_DEPENDENCIES_REQUIRED');
    if(monsterZoneLimit!==Infinity&&(!Number.isInteger(monsterZoneLimit)||monsterZoneLimit<1))throw new Error('INVALID_MONSTER_ZONE_LIMIT');
    this.state=state;this.cards=cardRegistry;this.turns=turnService;this.phases=phaseService;this.events=eventBus??null;this.monsterZoneLimit=monsterZoneLimit;this.normalUsedTurn=new Map();
  }
  #instance(player,uid){
    this.turns.assertPriority(player);
    const c=this.state.instances.get(uid);if(!c)throw new Error('UNKNOWN_UID:'+uid);
    if(c.owner!==player||c.controller!==player)throw new Error('CARD_NOT_CONTROLLED_BY_PLAYER:'+uid);
    if(c.zone!=='hand')throw new Error('SUMMON_REQUIRES_HAND:'+uid);
    const def=this.cards.get(c.cardId);if(!def)throw new Error('CARD_DEFINITION_MISSING:'+c.cardId);
    if(String(def.type).toUpperCase()!=='CRIATURA')throw new Error('CARD_NOT_NORMAL_SUMMONABLE:'+c.cardId);
    const fieldCount=[...this.state.instances.values()].filter(x=>x.controller===player&&x.zone==='field').length;
    if(fieldCount>=this.monsterZoneLimit)throw new Error('MONSTER_ZONE_FULL:'+player);
    return{instance:c,definition:def};
  }
  normalSummon(player,uid){
    this.phases.assert(player,['MAIN1','MAIN2']);
    if(this.normalUsedTurn.get(player)===this.turns.turnNumber)throw new Error('NORMAL_SUMMON_ALREADY_USED:'+player);
    const {instance,definition}=this.#instance(player,uid);
    this.state.move(uid,'field');this.normalUsedTurn.set(player,this.turns.turnNumber);
    this.events?.emit('summon:normal',{player,uid,cardId:definition.id,turnNumber:this.turns.turnNumber,phase:this.phases.phase});
    return instance;
  }
  authorizeSpecialSummon({player,uid,source,phases=['MAIN1','MAIN2']}={}){
    if(!player||!uid||!source)throw new Error('SPECIAL_SUMMON_AUTHORIZATION_INCOMPLETE');
    this.turns.assertPriority(player);
    const token='special-'+(++this.#permitSeq);
    const permit=Object.freeze({token,player,uid,source,phases:Object.freeze([...phases]),turnNumber:this.turns.turnNumber,used:false});
    this.#permits.set(token,{...permit,used:false});return permit;
  }
  specialSummon(player,uid,permit){
    if(!permit?.token)throw new Error('SPECIAL_SUMMON_PERMIT_REQUIRED');
    const stored=this.#permits.get(permit.token);if(!stored||stored.used)throw new Error('SPECIAL_SUMMON_PERMIT_INVALID');
    if(stored.player!==player||stored.uid!==uid||stored.turnNumber!==this.turns.turnNumber)throw new Error('SPECIAL_SUMMON_PERMIT_MISMATCH');
    this.phases.assert(player,stored.phases);
    const {instance,definition}=this.#instance(player,uid);
    stored.used=true;this.#permits.set(stored.token,stored);this.state.move(uid,'field');
    this.events?.emit('summon:special',{player,uid,cardId:definition.id,source:stored.source,turnNumber:this.turns.turnNumber,phase:this.phases.phase});
    return instance;
  }
  normalSummonAvailable(player){return this.normalUsedTurn.get(player)!==this.turns.turnNumber}
}