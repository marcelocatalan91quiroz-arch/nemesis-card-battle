
const fs=require('fs'),path=require('path');
const game=fs.readFileSync(path.join(__dirname,'..','js/game.js'),'utf8');
const must=(n,v)=>{if(!v){console.error('FAIL',n);process.exitCode=1}else console.log('PASS',n)};
must('ACTION recupera controles',/t==='ACTION'.*battleActions\.classList\.remove\('hidden'\)/s.test(game));
must('TARGET oculta acciones',/t==='TARGET'.*battleActions\.classList\.add\('hidden'\)/s.test(game));
must('TARGET sin enemigo vuelve a ACTION',/phase==='TARGET'&&!enemyCards\.some\(Boolean\).*setPhase\('ACTION'/s.test(game));
must('PLACE inválido vuelve a ACTION',/phase==='PLACE'.*setPhase\('ACTION'/s.test(game));
must('IA tiene try/catch de recuperación',/async function enemyTurn\(\).*NEMESIS_ENEMY_TURN_GUARD.*catch/s.test(game));
must('Rey Espectral continúa tras Corona',game.includes('spectralKingContinueAfterCrown'));
must('Dios Fantasma continúa tras Forma Final',game.includes('ghostGodContinueAfterFinalForm'));
must('END protegido',game.includes("if(phase==='END')return"));
if(process.exitCode)process.exit(process.exitCode);
console.log('NÉMESIS FLOW REGRESSION: PASS');
