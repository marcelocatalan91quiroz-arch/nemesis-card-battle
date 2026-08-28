
const fs=require('fs'),path=require('path');
const s=fs.readFileSync(path.join(__dirname,'..','js/game.js'),'utf8');

const fn=s.search(/\bfunction\s+card\s*\(/);
if(fn<0){
 console.error('FAIL: card debe ser function declaration para permitir llamadas durante migraciones.');
 process.exit(1);
}

const lexical=s.search(/\b(?:const|let)\s+card\b/);
if(lexical>=0){
 const early=[...s.matchAll(/\bcard\s*\(/g)].map(m=>m.index).filter(i=>i<lexical);
 if(early.length){
   console.error('FAIL: existen llamadas card() antes de const/let card:',early.length);
   process.exit(1);
 }
}
console.log('PASS: card() está disponible antes de las migraciones.');
