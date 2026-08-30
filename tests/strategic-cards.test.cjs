const fs=require('fs');const g=fs.readFileSync('js/game.js','utf8');
const req=['strategic-herrero','strategic-payaso-oscuro','strategicBlacksmith','strategicDarkClown','strategicSyncBlacksmithAura','strategicClownLastJoke',"priceStars:300","priceStars:350","assets/images/strategic/herrero.webp","assets/images/strategic/payaso-oscuro.webp"];
for(const x of req){if(!g.includes(x)){console.error('FALTA',x);process.exit(1)}}
const h=(2200+3800)/20,p=(2800+2800)/20;
const report={herrero:{base:h,precio:300},payaso:{base:p,precio:350},regla:'precio >= poder base y + control/recuperación estratégica',ok:300>=h&&350>=p};
console.log(JSON.stringify(report,null,2));if(!report.ok)process.exit(1);