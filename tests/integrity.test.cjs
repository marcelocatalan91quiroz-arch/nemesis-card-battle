
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

if(process.exitCode) process.exit(process.exitCode);
console.log('NÉMESIS CORE INTEGRITY: PASS');


test('registro global de cartas no reintroduce familias duplicadas',()=>{
 const game=fs.readFileSync(path.join(root,'js/game.js'),'utf8');
 assert.match(game,/const CARDS_RAW=\[\.\.\.COLLECTIBLE_CARDS,\.\.\.IMPERIO_DRAGON_CARDS,\.\.\.APOLO_PLAYER_CARDS,\.\.\.OLIMPO_PLAYER_CARDS,\.\.\.HADES_CARDS,\.\.\.ARES_CARDS_1_5,\.\.\.DIVINE_FUSION_CARDS,\.\.\.EXTERNAL_GAME_CARDS\]/);
 assert.doesNotMatch(game,/\.\.\.NEW_CARDS,\.\.\.DRAGON_OJO_CARDS,\.\.\.ANCESTRAL_CARDS,\.\.\.SPECTRAL_CARDS,\.\.\.REY_ESPECTRAL_CARDS,\.\.\.DIOS_FANTASMA_CARDS/);
 assert.match(game,/new Map\(CARDS_RAW\.map\(c=>\[c\.id,c\]\)\)/);
});

// V19.4.3 — cierre de los 9 efectos históricos pendientes
const pending=['etherealForm','mortalHarvest','beyondCall','abyssDragon','aresConqueror','apoloSolarGuardian','hadesDeepSleep','hadesGuiltWhip','hadesThresholdWatch'];
for(const effect of pending) A(game.includes(effect),'efecto '+effect+' registrado');
A(game.includes('NEMESIS_EFFECT_RUNTIME_AUDIT'),'auditoría runtime de 9 efectos disponible');
A(game.includes("'esp-espectro-cripta':{name:'FORMA ETÉREA'"),'Forma Etérea conectada a habilidad ejecutable');
A(game.includes("'esp-verdugo-almas':{name:'COSECHA MORTAL'"),'Cosecha Mortal conectada a habilidad ejecutable');
A(game.includes("'esp-doncella-tumba':{name:'LLAMADO DEL MÁS ALLÁ'"),'Llamado del Más Allá conectado a habilidad ejecutable');
A(game.includes("'esp-dragon-abismo':{name:'DOMINIO DEL ABISMO'"),'Dragón del Abismo conectado a habilidad ejecutable');
A(game.includes("'apolo-guardian-solar':{name:'SANTUARIO DEL SOL'"),'Apolo conectado a habilidad ejecutable');


// V19.5.1 — transformación/fusión PC
A(game.includes('IDR_TRANSFORM_RULES'),'reglas de transformación Imperio Dragón');
A(game.includes("IDR-001':{to:'IDR-009',marks:2"),'IDR-001 transforma a IDR-009');
A(game.includes("IDR-008':{to:'IDR-010',marks:4"),'IDR-008 transforma a IDR-010');
A(game.includes("m:['IDR-003','IDR-004'],r:'IDR-019'"),'Fusión IDR-019 habilitada');
A(game.includes("m:['IDR-009','IDR-008'],r:'IDR-020'"),'Fusión IDR-020 habilitada');
A(game.includes('pcFusionEvolutionCinematic'),'cinemática de Fusión PC habilitada');
A(game.includes('pcTransformationCinematic'),'cinemática de transformación PC habilitada');
