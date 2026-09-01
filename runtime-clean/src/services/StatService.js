export class StatService{
  constructor({cardRegistry}={}){if(!cardRegistry)throw new Error('CARD_REGISTRY_REQUIRED');this.cards=cardRegistry}
  derived(instance){
    if(!instance?.cardId)throw new Error('CARD_INSTANCE_REQUIRED');
    const def=this.cards.get(instance.cardId);if(!def)throw new Error('CARD_DEFINITION_MISSING:'+instance.cardId);
    let atk=Number(def.atk??0),defense=Number(def.def??0);
    for(const mod of instance.modifiers??[]){
      if(!mod||mod.active===false)continue;
      atk+=Number(mod.atk??0);defense+=Number(mod.def??0);
    }
    return Object.freeze({atk:Math.max(0,atk),def:Math.max(0,defense),baseAtk:Number(def.atk??0),baseDef:Number(def.def??0)});
  }
}