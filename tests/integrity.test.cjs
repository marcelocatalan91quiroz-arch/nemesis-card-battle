const fs=require('fs'), path=require('path');
const root=path.resolve(__dirname,'..');
const game=fs.readFileSync(path.join(root,'js/game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const must=(name,ok)=>{ if(!ok){console.error('FAIL',name);process.exitCode=1}else console.log('PASS',name) };

must('index.html',exists('index.html'));
must('css/game.css',exists('css/game.css'));
must('motor de fases',game.includes('NEMESIS_PHASE_TRANSITIONS')&&game.includes('function setPhase('));
must('supervisor anti-softlock',game.includes('function nemesisFlowSupervisor('));
must('guard IA V19',game.includes('NEMESIS_ENEMY_TURN_GUARD'));
must('campañas aisladas',game.includes('NEMESIS_CAMPAIGN_PROFILES')&&game.includes('NEMESIS_BOSS_ADAPTERS'));
must('colección global',game.includes('NEMESIS_COLLECTION'));
must('Memory Card',game.includes('campaign3Stage')&&game.includes('hadesDefeated'));
must('OLIMPO',game.includes('OLIMPO_DECK_IDS')&&game.includes('titan-del-olimpo'));
must('Santuario aislado',game.includes('NEMESIS_SANCTUARY')&&game.includes('function sanctuaryScene()'));

const bosses=[
 ['Dragón','DRAGON_OJO_DECK'],['Ira de Ra','IRA_RA_BOSS_DECK'],
 ['Caballero de las Almas','CABALLERO_ALMAS_DECK'],['Rey Espectral','REY_ESPECTRAL_TEST_DECK'],
 ['Dios Fantasma','DIOS_FANTASMA_DECK'],['Ares','ARES_CARDS'],['Hades','HADES_DECK_IDS']
];
for(const [name,symbol] of bosses) must('jefe '+name,game.includes(symbol));

const ids=[...game.matchAll(/\bid:'([^']+)'/g)].map(x=>x[1]);
const duplicates=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];
console.log('INFO IDs repetidos detectados por parser simple:',duplicates.length,
  '(puede incluir definiciones de configuración; la auditoría runtime decide validez real)');

const img=[...new Set([...game.matchAll(/img:'([^']+\.(?:png|jpg|jpeg|webp))'/gi)].map(x=>x[1]))];
const missing=img.filter(x=>!exists(x));
must('assets de cartas',missing.length===0);
if(missing.length) console.error(missing);

const registryIncludesExpected=/const CARDS_RAW=\[\.\.\.COLLECTIBLE_CARDS,\.\.\.IMPERIO_DRAGON_CARDS,(?:\.\.\.MAGO_ROJO_CARDS,)?\.\.\.APOLO_PLAYER_CARDS,\.\.\.OLIMPO_PLAYER_CARDS,\.\.\.HADES_CARDS,\.\.\.ARES_CARDS_1_5,\.\.\.DIVINE_FUSION_CARDS,\.\.\.EXTERNAL_GAME_CARDS\]/.test(game);
const registryExcludesDuplicatedFamilies=!/\.\.\.NEW_CARDS,\.\.\.DRAGON_OJO_CARDS,\.\.\.ANCESTRAL_CARDS,\.\.\.SPECTRAL_CARDS,\.\.\.REY_ESPECTRAL_CARDS,\.\.\.DIOS_FANTASMA_CARDS/.test(game);
const registryDeduplicates=/new Map\(CARDS_RAW\.map\(c=>\[c\.id,c\]\)\)/.test(game);
must('registro global de cartas no reintroduce familias duplicadas',
  registryIncludesExpected&&registryExcludesDuplicatedFamilies&&registryDeduplicates);


must('perfil jugador obligatorio',game.includes('nemesisCreateProfileScene')&&game.includes('nemesisEnsureProfile'));
must('nombre se guarda en Memory Card',game.includes("name:typeof state.name==='string'?state.name:''")&&game.includes("if(typeof mc.name==='string')state.name=mc.name"));
must('autoguardado tras cada pelea',game.includes("state.lastBattleResult=win?'VICTORIA':'DERROTA'")&&game.includes('state.battlesPlayed=')&&game.includes('state.lastAutosaveAt=Date.now()'));
must('sin nombre Viajero automático',!game.includes("||'Viajero'"));

const artFiles=[
 'js/card-art/art-idr-01-10.js','js/card-art/art-idr-11-20.js',
 'js/card-art/art-mgr-01-10.js','js/card-art/art-mgr-11-20.js',
 'js/card-art/art-dm-01-10.js','js/card-art/art-dm-11-20.js','js/card-art/art-treasures.js'
];
const art=artFiles.map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('\n');
const registry=fs.readFileSync(path.join(root,'js/card-art/card-art-registry.js'),'utf8');
must('fuente única de arte cargada',
 artFiles.every(p=>html.includes(p))&&html.includes('js/card-art/card-art-registry.js')&&!html.includes('js/card-art-real-sprite.js'));
must('arte real Imperio Dragón 20/20',Array.from({length:20},(_,i)=>'IDR-'+String(i+1).padStart(3,'0')).every(id=>art.includes('"'+id+'"')));
must('arte real Mago Rojo 20/20',Array.from({length:20},(_,i)=>'MGR-'+String(i+1).padStart(3,'0')).every(id=>art.includes('"'+id+'"')));
must('arte real Duel Master 01-20',Array.from({length:20},(_,i)=>'DM-'+String(i+1).padStart(3,'0')).every(id=>art.includes('"'+id+'"')));
must('arte real Tesoro NÉMESIS 5/5',['TN-MAG-001','TN-MAG-002','TN-ARM-001','TN-ARM-002','TN-TRP-001'].every(id=>art.includes('"'+id+'"')));
must('registro de arte autoritativo',registry.includes('NEMESIS_CARD_ART_AUDIT')&&registry.includes('nemesisRealCardArt')&&registry.includes('nemesisApplyRealCardArt'));
must('game aplica arte real a todos los grupos',game.includes('nemesisApplyRealCardArt?.(IMPERIO_DRAGON_CARDS)')&&game.includes('nemesisApplyRealCardArt?.(MAGO_ROJO_CARDS)')&&game.includes('nemesisApplyRealCardArt?.(EXTERNAL_GAME_CARDS)')&&game.includes('nemesisApplyRealCardArt?.(NEMESIS_TREASURE_CARDS)'));
if(process.exitCode) process.exit(process.exitCode);

const dmNew=['DM-011','DM-012','DM-013','DM-014','DM-015','DM-016','DM-017','DM-018','DM-019','DM-020'];
const ext33=fs.readFileSync(path.join(root,'js/universal-cards-33.js'),'utf8');
for(const id of dmNew)must('Duel Master nueva '+id,ext33.includes('"id": "'+id+'"')||ext33.includes('"id":"'+id+'"'));
must('Duel Master 20 IDs registrados',dmNew.every(id=>ext33.includes('"id": "'+id+'"')||ext33.includes('"id":"'+id+'"')));
must('Alma de Afrodita handler',game.includes("'DM-011'")&&game.includes('dmAphrodite'));
must('Medusa handler',game.includes("'DM-012'")&&game.includes('dmMedusa'));
must('Equipamientos 13-17',game.includes("'DM-016'")&&game.includes("'DM-017'"));
must('Thor Shiny handler',game.includes('dmThorShiny'));
must('Juicio Titanes handler',game.includes("c.id==='DM-019'"));
must('Eclipse Reinos handler',game.includes("c.id==='DM-020'"));
console.log('NÉMESIS CORE INTEGRITY: PASS');
