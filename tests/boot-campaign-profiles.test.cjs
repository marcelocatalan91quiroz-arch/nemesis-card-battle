const fs=require('fs');
const assert=require('assert');

const game=fs.readFileSync('js/game.js','utf8');
const decl='const NEMESIS_CAMPAIGN_PROFILES=Object.freeze({';
const use='function nemesisUnlockCampaignDecks(campaignId,silent=false){';

const declIndex=game.indexOf(decl);
const useIndex=game.indexOf(use);
assert(declIndex>=0,'Deben existir los perfiles de campaña.');
assert(useIndex>=0,'Debe existir el desbloqueo global de campañas.');
assert(declIndex<useIndex,'Los perfiles de campaña deben declararse antes de cualquier función global que los use.');
assert.strictEqual((game.match(/const NEMESIS_CAMPAIGN_PROFILES=Object\.freeze\(\{/g)||[]).length,1,'Debe existir una sola definición autoritativa de perfiles de campaña.');
assert(game.includes('window.NEMESIS_CAMPAIGN_PROFILES=NEMESIS_CAMPAIGN_PROFILES;'),'Los perfiles deben exponerse para auditoría global.');
assert(game.includes('nemesisMigrateCompletedCampaignRewards();'),'La migración de recompensas debe conservarse.');

console.log('PASS boot campaign profiles: definición global y orden de arranque correctos.');
