export class VictoryService{
  constructor({players,eventBus}={}){
    if(!Array.isArray(players)||players.length!==2)throw new Error('TWO_PLAYERS_REQUIRED');
    this.players=[...players];this.events=eventBus??null;this.result=null;
  }
  check(hp){
    if(this.result)return this.result;
    const defeated=this.players.filter(p=>Number(hp?.[p]??0)<=0);
    if(!defeated.length)return null;
    const winner=this.players.find(p=>!defeated.includes(p))??null;
    this.result=Object.freeze({winner,defeated:Object.freeze([...defeated]),reason:'HP_ZERO'});
    this.events?.emit('duel:ended',this.result);return this.result;
  }
}