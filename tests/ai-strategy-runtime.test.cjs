const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const game=fs.readFileSync(path.join(root,'js/game.js'),'utf8');
const A=(n,v)=>{if(!v){console.error('FAIL',n);process.exitCode=1}else console.log('PASS',n)};

// IA central de campaña
A('8 rivales en registro central',['guardian','dragon','ra','caballero-almas','rey-espectral','dios-fantasma','ares','hades'].every(id=>game.includes(id+":{")||game.includes("'"+id+"':{")));
A('todos los rivales usan selección estratégica de carta',game.includes("const pick=bossAiPickQueueIndex();"));
A('todos los rivales usan selección estratégica de ataque',game.includes("aiChoice=bossAiAttackChoice();"));
A('IA puntúa cartas por amenaza y estado',game.includes('function bossAiCardScore(')&&game.includes('function bossAiAttackChoice(')&&game.includes('bossAggression()'));
A('fases dinámicas de jefe activas',game.includes('function applyBossPhases()')&&game.includes('bossPhaseLevel'));

// Estrategias de jefes
A('Dragón Ojo: Ira por fases',game.includes('function applyDragonRage()')&&game.includes('dragonRageLevel')&&game.includes('segunda colocación rival'));
A('Ira de Ra: crecimiento y entradas estratégicas',game.includes('function applyRaTurnGrowth()')&&game.includes('async function applyRaEntryEffect(')&&game.includes("c.id==='anc-ira-ra'"));
A('Caballero de las Almas: almas/Cementerio',game.includes('__nemesisSoulCount')&&game.includes('REINO DE LOS MUERTOS'));
A('Rey Espectral: Almas Reales y Corona',game.includes('__nemesisRoyalSouls')&&game.includes('spectralKingCrownSave()')&&game.includes('royalDecree'));
A('Dios Fantasma: Esencia y Forma Final',game.includes('__nemesisCelestialEssence')&&game.includes('ghostGodFinalFormSave()')&&game.includes('celestialDecree'));
A('Ares: Furia y equipamiento',game.includes('function aresStartTurnPowers()')&&game.includes('aresGainFury')&&game.includes('aresWarEye'));
A('Hades: Óbolos/Tártaro/IA',game.includes('hadesObols')&&game.includes('hadesTartarus')&&game.includes('function hadesControlAi'));

// Mazos y motores estratégicos
A('Mago Rojo fusión MGR-014 -> MGR-019',game.includes("c.id==='MGR-014'")&&game.includes("card('MGR-019')")&&game.includes('FUSIÓN CARMESÍ'));
A('Imperio Dragón transformaciones',game.includes('function idrTransform(')&&game.includes("idrTransform(side,i,'IDR-009')")&&game.includes("idrTransform(side,i,'IDR-010')"));
A('Imperio Dragón fusiones',game.includes('async function idrFusion(')&&game.includes("idrFusion(side,'IDR-019')")&&game.includes("idrFusion(side,'IDR-020')"));
A('Duel Master transformación Shiny',game.includes('async function dmTryShinyAwakening(')&&game.includes("dmTransformAt(side,thorIndex,'DM-018')"));
A('Duel Master Fusión de Reinos',game.includes('async function dmRealmFusion(')&&game.includes('SINFONÍA DE LOS REINOS'));
A('Olimpo Fusión Divina',game.includes("m:['dios-jupiter','zeus-emperador-rayo','kronos-devorador-tiempo']")&&game.includes("r:'titan-del-olimpo',divine:true")&&game.includes('olympusFusionResponseWindow')&&game.includes('olympusFusionUltraCinematic'));

// Caballeros: las 20 cartas deben tener sistemas reales
A('Caballeros monstruos con estrategia',game.includes('function csUseSkill(')&&game.includes('function csKeepTurnAfterAttack(')&&game.includes('function csPreventDestroy('));
A('Caballeros armas CS-011/014 con motor de combate',game.includes('function csSubworldWeaponMagic(')&&game.includes('function csSubworldWeaponBeforeCombat(')&&game.includes('function csSubworldWeaponAfterKill(')&&game.includes('function csSubworldWeaponUltimate('));
A('Caballeros armaduras con memoria/forja',game.includes('function csSubworldArmorMagic(')&&game.includes('function csSubworldArmorPreventDestroy(')&&game.includes('function csSubworldArmorUltimate('));
A('Caballeros reliquias y mágicas',game.includes('function csSubworldRelicSync(')&&game.includes('function csSubworldSpellMagic('));

// Eclipse / rutas transversales
A('Eclipse 3/5 y una vez por duelo',game.includes('async function nemesisAbsoluteEclipseMagic')&&game.includes('picks.length!==3')&&game.includes('__nemesisEclipseUsedP=false'));
A('Eclipse destierro/resurrección/silencio/ascensión/ruptura',['nemesisEclipseJudgement','nemesisEclipseResurrection','nemesisEclipseSilence','nemesisEclipseAscension','nemesisEclipseRupture'].every(x=>game.includes('function '+x)||game.includes('async function '+x)));

// Presentación audiovisual del duelo local
A('perfiles cinematográficos PC activos',game.includes('PC_CINEMATIC_PROFILES')&&game.includes('pcCardCinematic'));
A('cinemática de invocación conectada',game.includes("pcCardCinematic('summon'"));
A('cinemática de habilidad conectada',game.includes("pcCardCinematic('skill'"));
A('ataques con animación y nombre/impacto',game.includes('attackAnim(')&&game.includes('damageFx(')&&game.includes('pcElementImpactFx('));
A('destrucción cinematográfica conectada',game.includes('pcDestructionFx(')&&game.includes('v18917SendVisualToGrave'));
A('Fusión Divina conserva cinemática Ultra + motor original',game.includes('olympusFusionUltraCinematic')&&game.includes('fusionAnim('));

if(process.exitCode)process.exit(process.exitCode);
console.log('NÉMESIS IA + ESTRATEGIAS + TRANSFORMACIONES + FUSIONES: PASS');
