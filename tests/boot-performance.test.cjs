const fs=require('fs');
const assert=require('assert');

const index=fs.readFileSync('index.html','utf8');
const game=fs.readFileSync('js/game.js','utf8');

assert(index.includes('id="nemesisBootShell"'),'Debe existir un shell de carga inmediato.');
assert(index.includes('rel="modulepreload" href="js/game.js"'),'El core debe precargarse desde el HTML.');
assert(game.includes('function nemesisScheduleBootMaintenance()'),'Debe existir mantenimiento diferido de arranque.');
assert(game.indexOf('title();') < game.indexOf('nemesisScheduleBootMaintenance();'),'El menú debe dibujarse antes del mantenimiento no crítico.');
assert(game.includes("requestIdleCallback(run,{timeout:1200})") || game.includes('setTimeout(run,40)'),'El mantenimiento debe salir del camino crítico.');
assert(game.includes('nemesisMigrateCompletedCampaignRewards();'),'La migración de recompensas debe conservarse.');
assert(game.includes('window.nemesisIntegrityAudit?.();'),'La auditoría de integridad debe conservarse.');
assert(game.indexOf('const NEMESIS_CAMPAIGN_PROFILES=Object.freeze({') < game.indexOf('function nemesisUnlockCampaignDecks(campaignId,silent=false){'),'Los perfiles de campaña deben seguir definidos antes de su uso.');

console.log('PASS boot performance: shell inmediato, core preload y mantenimiento diferido protegidos.');
