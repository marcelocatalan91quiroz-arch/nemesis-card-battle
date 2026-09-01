import{createCardInstance}from'../core/CardInstance.js';
export class DeckService{
  constructor({cardRegistry,deckRegistry,state,uidFactory}={}){
    if(!cardRegistry||!deckRegistry||!state)throw new Error('DECK_SERVICE_DEPENDENCIES_REQUIRED');
    this.cards=cardRegistry;this.decks=deckRegistry;this.state=state;this.uidFactory=uidFactory??((deckId,cardId,i)=>deckId.toLowerCase()+'-'+cardId.toLowerCase()+'-'+String(i+1).padStart(2,'0'));this.owners=new Map();
  }
  validate(deckId){
    const deck=this.decks.get(deckId);if(!deck)throw new Error('UNKNOWN_DECK:'+deckId);
    const missing=deck.cardIds.filter(id=>!this.cards.get(id));
    const counts=new Map();for(const id of deck.cardIds)counts.set(id,(counts.get(id)||0)+1);
    const copyErrors=[];for(const[id,n]of counts){const max=this.cards.get(id)?.maxCopies??1;if(n>max)copyErrors.push({id,count:n,max})}
    return{ok:!missing.length&&!copyErrors.length,missing,copyErrors,size:deck.cardIds.length};
  }
  instantiate(deckId,{owner='player'}={}){
    if(this.owners.has(owner))throw new Error('OWNER_ALREADY_HAS_DECK:'+owner);
    const check=this.validate(deckId);if(!check.ok)throw new Error('INVALID_DECK:'+deckId);
    const deck=this.decks.get(deckId),uids=[];
    deck.cardIds.forEach((cardId,i)=>{const uid=this.uidFactory(deckId,cardId,i);const c=createCardInstance(cardId,{uid});c.owner=owner;c.controller=owner;this.state.add(c,'deck');uids.push(uid)});
    const session={owner,deckId,uids:[...uids],drawn:[]};this.owners.set(owner,session);return session;
  }
  session(owner='player'){return this.owners.get(owner)||null}
  count(owner='player',zone='deck'){const s=this.session(owner);if(!s)return 0;return s.uids.filter(uid=>this.state.instances.get(uid)?.zone===zone).length}
  draw(owner='player',count=1){
    const s=this.session(owner);if(!s)throw new Error('NO_DECK_FOR_OWNER:'+owner);
    const drawn=[];for(let i=0;i<count;i++){const uid=s.uids.find(x=>this.state.instances.get(x)?.zone==='deck');if(!uid)break;this.state.move(uid,'hand');s.drawn.push(uid);drawn.push(this.state.instances.get(uid))}
    return drawn;
  }
  shuffle(owner='player',rng=Math.random){
    const s=this.session(owner);if(!s)throw new Error('NO_DECK_FOR_OWNER:'+owner);
    const deckUids=s.uids.filter(uid=>this.state.instances.get(uid)?.zone==='deck');
    for(let i=deckUids.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[deckUids[i],deckUids[j]]=[deckUids[j],deckUids[i]]}
    const other=this.state.zones.deck.filter(uid=>!s.uids.includes(uid));this.state.zones.deck=[...other,...deckUids];
    const nonDeck=s.uids.filter(uid=>this.state.instances.get(uid)?.zone!=='deck');s.uids=[...deckUids,...nonDeck];return [...deckUids];
  }
}