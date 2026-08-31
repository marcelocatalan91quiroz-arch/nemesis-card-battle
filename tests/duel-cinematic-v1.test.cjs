const fs=require('fs');
const assert=require('assert');

const game=fs.readFileSync('js/game.js','utf8');

assert(game.includes('function nemesisBattleResolution('),'Debe existir el feedback cinematográfico de resolución de batalla.');
assert(game.includes("nemesisBattleResolution('ATAQUE',A.name"),'El ataque debe mostrar resolución visual.');
assert(game.includes("nemesisBattleResolution('DEFENSA',D.name"),'La defensa debe mostrar resolución visual.');
assert(game.includes("nemesisBattleResolution('DESTRUCCIÓN',victim.name"),'La destrucción debe mostrar transición visual al Cementerio.');
assert(game.includes("v188Sound('defense')"),'La defensa debe conservar feedback sonoro.');
assert(game.includes("await attackAnim(attSide,ai,defSide,di,A,Math.max(0,diff))"),'La mejora no debe sustituir el motor de ataque existente.');
assert(game.includes("async function destroyCard(side,i,cause='effect')"),'La mejora no debe sustituir el motor de destrucción existente.');
assert(game.includes('v18917SendVisualToGrave(side,g)'),'Debe conservarse el Cementerio 3D existente.');

console.log('PASS duel cinematic V1: ataque, defensa, destrucción y Cementerio protegidos.');
