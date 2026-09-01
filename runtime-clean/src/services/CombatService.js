export class CombatService{
  constructor({state,cardRegistry,turnService,phaseService,graveyardService,statService,victoryService,hp,eventBus}={}){
    if(!state||!cardRegistry||!turnService||!phaseService||!graveyardService||!statService||!victoryService||!hp)throw new Error('COMBAT_SERVICE_DEPENDENCIES_REQUIRED');
    this.state=state;this.cards=cardRegistry;this.turns=turnService;this.phases=phaseService;this.graveyard=graveyardService;this.stats=statService;this.victory=victoryService;this.hp=hp;this.events=eventBus??null;this.attackedTurn=new Map();
  }
  #fieldCreature(uid){
    const c=this.state.instances.get(uid);if(!c)throw new Error('UNKNOWN_UID:'+uid);
    if(c.zone!=='field')throw new Error('BATTLE_REQUIRES_FIELD:'+uid);
    const def=this.cards.get(c.cardId);if(!def)throw new Error('CARD_DEFINITION_MISSING:'+c.cardId);
    if(String(def.type).toUpperCase()!=='CRIATURA')throw new Error('BATTLE_REQUIRES_CREATURE:'+c.cardId);
    return{instance:c,definition:def};
  }
  canAttack(player,uid){return this.attackedTurn.get(uid)!==this.turns.turnNumber&&this.state.instances.get(uid)?.controller===player}
  attack(player,attackerUid,targetUid){
    this.phases.assert(player,'BATTLE');
    if(this.victory.result)throw new Error('DUEL_ALREADY_FINISHED');
    for(const p of this.turns.players)if(!Number.isFinite(this.hp[p])||this.hp[p]<=0)throw new Error('COMBAT_HP_NOT_CONFIGURED:'+p);
    if(attackerUid===targetUid)throw new Error('ATTACK_TARGET_MUST_DIFFER');
    const attacker=this.#fieldCreature(attackerUid),target=this.#fieldCreature(targetUid);
    if(attacker.instance.controller!==player)throw new Error('ATTACKER_NOT_CONTROLLED_BY_PLAYER:'+attackerUid);
    if(target.instance.controller===player)throw new Error('TARGET_MUST_BE_OPPONENT:'+targetUid);
    if(this.attackedTurn.get(attackerUid)===this.turns.turnNumber)throw new Error('ATTACK_ALREADY_USED:'+attackerUid);
    const a=this.stats.derived(attacker.instance),d=this.stats.derived(target.instance);
    this.attackedTurn.set(attackerUid,this.turns.turnNumber);
    this.events?.emit('attack:declared',{player,attackerUid,targetUid,turnNumber:this.turns.turnNumber,attackerAtk:a.atk,targetDef:d.def});
    let destroyedUid=null,damage=0,damagedPlayer=null,outcome='TIE';
    if(a.atk>d.def){
      destroyedUid=targetUid;damage=a.atk-d.def;damagedPlayer=target.instance.controller;
      this.graveyard.destroy(targetUid,{reason:'battle'});
      this.hp[damagedPlayer]=Math.max(0,Number(this.hp[damagedPlayer])-damage);outcome='ATTACKER_WINS';
    }else if(a.atk<d.def){
      destroyedUid=attackerUid;damage=d.def-a.atk;damagedPlayer=attacker.instance.controller;
      this.graveyard.destroy(attackerUid,{reason:'battle'});
      this.hp[damagedPlayer]=Math.max(0,Number(this.hp[damagedPlayer])-damage);outcome='DEFENDER_WINS';
    }
    const result=Object.freeze({outcome,attackerUid,targetUid,attackerAtk:a.atk,targetDef:d.def,destroyedUid,damage,damagedPlayer,hp:Object.freeze({...this.hp}),victory:this.victory.check(this.hp)});
    this.events?.emit('attack:resolved',result);return result;
  }
}