export class GraveyardService{
  constructor(state){if(!state)throw new Error('GAME_STATE_REQUIRED');this.state=state}
  destroy(uid,{reason='effect'}={}){
    const card=this.state.instances.get(uid);
    if(!card)throw new Error('UNKNOWN_UID:'+uid);
    if(card.zone!=='field')throw new Error('DESTROY_REQUIRES_FIELD:'+uid);
    this.state.move(uid,'graveyard');
    card.lastDestroyReason=reason;
    return card;
  }
  resurrect(uid,{to='field'}={}){
    const card=this.state.instances.get(uid);
    if(!card)throw new Error('UNKNOWN_UID:'+uid);
    if(card.zone!=='graveyard')throw new Error('RESURRECT_REQUIRES_GRAVEYARD:'+uid);
    const originalUid=card.uid;
    this.state.move(uid,to);
    if(card.uid!==originalUid)throw new Error('UID_CHANGED_DURING_RESURRECTION:'+uid);
    return card;
  }
  listResurrectable(){return this.state.zones.graveyard.map(uid=>this.state.instances.get(uid)).filter(Boolean)}
}