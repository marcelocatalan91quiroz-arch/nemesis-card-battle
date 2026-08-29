const fs=require('fs'), path=require('path');
const root=path.resolve(__dirname,'..');
const game=fs.readFileSync(path.join(root,'js/game.js'),'utf8');
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

const registryIncludesExpected=/const CARDS_RAW=\[\.\.\.COLLECTIBLE_CARDS,\.\.\.IMPERIO_DRAGON_CARDS,\.\.\.APOLO_PLAYER_CARDS,\.\.\.OLIMPO_PLAYER_CARDS,\.\.\.HADES_CARDS,\.\.\.ARES_CARDS_1_5,\.\.\.DIVINE_FUSION_CARDS,\.\.\.EXTERNAL_GAME_CARDS\]/.test(game);
const registryExcludesDuplicatedFamilies=!/\.\.\.NEW_CARDS,\.\.\.DRAGON_OJO_CARDS,\.\.\.ANCESTRAL_CARDS,\.\.\.SPECTRAL_CARDS,\.\.\.REY_ESPECTRAL_CARDS,\.\.\.DIOS_FANTASMA_CARDS/.test(game);
const registryDeduplicates=/new Map\(CARDS_RAW\.map\(c=>\[c\.id,c\]\)\)/.test(game);
must('registro global de cartas no reintroduce familias duplicadas',
  registryIncludesExpected&&registryExcludesDuplicatedFamilies&&registryDeduplicates);

if(process.exitCode) process.exit(process.exitCode);
console.log('NÉMESIS CORE INTEGRITY: PASS');
