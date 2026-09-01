import{
  FrozenDataLoader,DataRepository,CardRegistry,DeckRegistry,
  registerMagoRojo,registerImperioDragon,DuelSession,
  AssetResolver,buildCardViewModel,CardRenderer,RendererGuard
}from'../src/index.js';

export class MainIntegrationBridge{
  constructor({root=document.getElementById('app')}={}){
    if(!root)throw new Error('APP_ROOT_REQUIRED');
    this.root=root;this.data=null;this.cards=null;this.decks=null;this.duel=null;this.pendingPermit=null;
    this.renderer=new CardRenderer({placeholder:'./public/assets/placeholder.svg'});
    this.guard=new RendererGuard({onError:(error,ctx)=>this.showStatus('Render aislado: '+error.message+' · '+(ctx.uid||'sin uid'),'warn')});
    this.assets=new AssetResolver({map:this.#assetMap(),placeholder:'./public/assets/placeholder.svg'});
  }
  #assetMap(){
    const map={};
    for(const prefix of['MGR','IDR'])for(let i=1;i<=20;i++){
      const id=prefix+'-'+String(i).padStart(3,'0');
      map[id]='./public/assets/cards/'+id+'.svg';
    }
    return map;
  }
  async boot(){
    this.root.innerHTML=this.#homeMarkup('Cargando fuentes congeladas…');
    try{
      const entries=await FrozenDataLoader.browser().loadAll();
      this.data=new DataRepository(entries);this.cards=new CardRegistry();this.decks=new DeckRegistry();
      registerMagoRojo({dataRepository:this.data,cardRegistry:this.cards,deckRegistry:this.decks});
      registerImperioDragon({dataRepository:this.data,cardRegistry:this.cards,deckRegistry:this.decks});
      if(this.data.size!==13||this.cards.size!==40||this.decks.size!==2)throw new Error('BOOT_INTEGRITY_FAILED');
      this.renderHome();
      window.dispatchEvent(new CustomEvent('nemesis:runtime-clean-ready',{detail:{dataFiles:this.data.size,cards:this.cards.size,decks:this.decks.size}}));
    }catch(error){
      this.root.innerHTML=this.#fatalMarkup(error);
      throw error;
    }
  }
  #homeMarkup(status=''){
    return `<main class="app-shell">
      <header class="hero"><div><span class="eyebrow">RUNTIME CLEAN</span><h1>NÉMESIS CARD BATTLE</h1><p>Motor moderno aislado del código heredado.</p></div><div class="health" id="health">${status}</div></header>
      <section class="menu-grid">
        <button class="menu-card" id="play-clean"><strong>DUELO LIMPIO</strong><span>Mago Rojo vs Imperio Dragón</span></button>
        <article class="menu-card locked"><strong>CAMPAÑAS</strong><span>Pendiente de migración al runtime moderno</span></article>
        <article class="menu-card locked"><strong>COLECCIÓN COMPLETA</strong><span>Pendiente de migración al runtime moderno</span></article>
        <article class="menu-card locked"><strong>ONLINE</strong><span>Pendiente de migración al runtime moderno</span></article>
      </section>
      <section class="runtime-status"><h2>Integridad del puente</h2><pre id="home-status"></pre></section>
    </main>`;
  }
  renderHome(){
    this.root.innerHTML=this.#homeMarkup('READY');
    document.getElementById('home-status').textContent=
      'JSON congelados: '+this.data.size+'\nDefiniciones activas: '+this.cards.size+'\nMazos activos: '+this.decks.size+'\nLegacy game.js: 0 imports';
    document.getElementById('play-clean').onclick=()=>this.createDuel();
  }
  createDuel(){
    let n=0;this.pendingPermit=null;
    this.duel=new DuelSession({
      cardRegistry:this.cards,deckRegistry:this.decks,players:['player','enemy'],
      uidFactory:(deck,card)=>'prod-'+(++n)+'-'+card,
      monsterZoneLimit:5,startingHp:4000
    });
    this.duel.prepareDeck('player','MAGO_ROJO');this.duel.prepareDeck('enemy','IMPERIO_DRAGON');
    this.root.innerHTML=this.#duelMarkup();this.#wireDuel();this.renderDuel('PREPARADO · 40 UID ÚNICOS');
  }
  #duelMarkup(){
    return `<main class="app-shell duel-shell">
      <header class="duel-header"><button id="back-home" class="ghost">← Menú</button><div><strong id="phase-label">PREPARADO</strong><span id="turn-label"></span></div><div class="hp-box"><span>MAGO <b id="hp-player">4000</b></span><span>IMPERIO <b id="hp-enemy">4000</b></span></div></header>
      <section class="board">
        <div class="side enemy"><h2>Imperio Dragón</h2><div class="zone"><h3>Campo</h3><div id="enemy-field" class="card-strip"></div></div><div class="zone"><h3>Mano</h3><div id="enemy-hand" class="card-strip"></div></div></div>
        <div class="center-panel"><div id="duel-status" class="status-panel"></div><div class="controls">
          <button id="start-duel">Iniciar</button><button id="draw-card">Robar</button><button id="advance-phase">Fase</button>
          <button id="normal-summon">Normal</button><button id="authorize-special">Autorizar Especial</button><button id="special-summon">Especial</button>
          <button id="attack">Atacar</button><button id="end-turn">Fin Turno</button>
        </div></div>
        <div class="side player"><h2>Mago Rojo</h2><div class="zone"><h3>Campo</h3><div id="player-field" class="card-strip"></div></div><div class="zone"><h3>Mano</h3><div id="player-hand" class="card-strip"></div></div></div>
      </section>
    </main>`;
  }
  #wireDuel(){
    const run=fn=>{try{fn()}catch(error){this.renderDuel('BLOQUEADO: '+error.message)}};
    document.getElementById('back-home').onclick=()=>this.renderHome();
    document.getElementById('start-duel').onclick=()=>run(()=>{if(this.duel.started)throw new Error('DUEL_ALREADY_STARTED');this.duel.start({firstPlayer:'player',openingHandSize:5});this.renderDuel('DUELO INICIADO')});
    document.getElementById('draw-card').onclick=()=>run(()=>{const p=this.duel.turns.currentPlayer,c=this.duel.drawForTurn(p)[0];this.renderDuel('ROBO · '+p+' · '+(c?.cardId||'SIN CARTA'))});
    document.getElementById('advance-phase').onclick=()=>run(()=>{const p=this.duel.turns.currentPlayer,ph=this.duel.advancePhase(p);this.renderDuel('FASE → '+ph.phase)});
    document.getElementById('normal-summon').onclick=()=>run(()=>{const p=this.duel.turns.currentPlayer,c=this.#summonable(p)[0];if(!c)throw new Error('NO_SUMMONABLE_CREATURE_IN_HAND');this.duel.normalSummon(p,c.uid);this.renderDuel('NORMAL · '+c.cardId+' · '+c.uid)});
    document.getElementById('authorize-special').onclick=()=>run(()=>{const p=this.duel.turns.currentPlayer,c=this.#summonable(p)[0];if(!c)throw new Error('NO_SUMMONABLE_CREATURE_IN_HAND');this.pendingPermit=this.duel.authorizeSpecialSummon({player:p,uid:c.uid,source:'MAIN_INTEGRATION_BRIDGE'});this.renderDuel('PERMISO ESPECIAL · '+c.cardId)});
    document.getElementById('special-summon').onclick=()=>run(()=>{if(!this.pendingPermit)throw new Error('NO_PENDING_SPECIAL_PERMIT');const p=this.duel.turns.currentPlayer,uid=this.pendingPermit.uid,c=this.duel.state.instances.get(uid);this.duel.specialSummon(p,uid,this.pendingPermit);this.pendingPermit=null;this.renderDuel('ESPECIAL · '+c.cardId+' · '+uid)});
    document.getElementById('attack').onclick=()=>run(()=>{const p=this.duel.turns.currentPlayer,op=p==='player'?'enemy':'player',a=this.#field(p)[0],t=this.#field(op)[0];if(!a)throw new Error('NO_ATTACKER_IN_FIELD');if(!t)throw new Error('NO_TARGET_IN_FIELD');const r=this.duel.attack(p,a.uid,t.uid);this.renderDuel('ATAQUE · '+a.cardId+' → '+t.cardId+' · '+r.outcome+' · '+r.damage+(r.victory?' · GANADOR '+r.victory.winner:''))});
    document.getElementById('end-turn').onclick=()=>run(()=>{const p=this.duel.turns.currentPlayer,x=this.duel.endTurn(p);this.pendingPermit=null;this.renderDuel('TURNO → '+x.turn.currentPlayer)});
  }
  #summonable(player){return this.duel.decks.session(player).uids.map(uid=>this.duel.state.instances.get(uid)).filter(c=>c.zone==='hand'&&this.cards.get(c.cardId)?.type==='CRIATURA')}
  #field(player){return [...this.duel.state.instances.values()].filter(c=>c.controller===player&&c.zone==='field')}
  #renderZone(player,zone,id){
    const host=document.getElementById(id);if(!host)return;host.replaceChildren();
    const session=this.duel.decks.session(player);for(const uid of session.uids){const inst=this.duel.state.instances.get(uid);if(inst.zone!==zone)continue;
      const def=this.cards.get(inst.cardId),vm=buildCardViewModel({definition:def,instance:inst,imageUrl:this.assets.resolve(def)}),wrap=document.createElement('div');
      wrap.className='card-wrap';this.guard.render(this.renderer,vm,wrap);host.appendChild(wrap);
    }
  }
  renderDuel(message=''){
    if(!this.duel)return;
    for(const [p,z,id] of [['player','hand','player-hand'],['player','field','player-field'],['enemy','hand','enemy-hand'],['enemy','field','enemy-field']])this.#renderZone(p,z,id);
    const turn=this.duel.turns.snapshot(),phase=this.duel.phases.snapshot();
    document.getElementById('phase-label').textContent=phase.phase??'PREPARADO';
    document.getElementById('turn-label').textContent=turn.currentPlayer?' · Turno '+turn.turnNumber+' · '+turn.currentPlayer:'';
    document.getElementById('hp-player').textContent=this.duel.hp.player;
    document.getElementById('hp-enemy').textContent=this.duel.hp.enemy;
    document.getElementById('duel-status').textContent=message+'\nUID='+this.duel.state.instances.size+'/'+new Set(this.duel.state.instances.keys()).size+'\n'+JSON.stringify(this.duel.state.audit(),null,2);
  }
  showStatus(message){const el=document.getElementById('duel-status')||document.getElementById('home-status');if(el)el.textContent=message}
  #fatalMarkup(error){return `<main class="fatal"><h1>NÉMESIS Runtime Clean</h1><p>No se pudo iniciar.</p><pre>${String(error?.message||error)}</pre></main>`}
}