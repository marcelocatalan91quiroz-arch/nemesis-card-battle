const fs=require('fs');
const assert=require('assert');

const html=fs.readFileSync('index.html','utf8');
const game=fs.readFileSync('js/game.js','utf8');
const css=fs.readFileSync('css/game.css','utf8');
const art=fs.readFileSync('js/card-art/card-art-paths.js','utf8');

const legacy=[
 'art-idr-01-10.js','art-idr-11-20.js','art-mgr-01-10.js','art-mgr-11-20.js',
 'art-dm-01-10.js','art-dm-11-20.js','art-treasures.js'
];
for(const name of legacy)assert(!html.includes(name),'No debe cargarse '+name+' en el arranque.');

assert(html.includes('js/card-art/card-art-paths.js'),'Debe cargarse el manifiesto ligero de arte.');
assert(!art.includes('data:image/'),'El manifiesto no debe incrustar imágenes Base64.');
assert(!art.includes(';base64,'),'El manifiesto no debe contener Base64.');
assert((art.match(/\.avif/g)||[]).length===65,'Deben existir 65 rutas AVIF autoritativas.');
assert(game.includes('state.deck.slice(0,6)'),'El menú solo debe renderizar un subconjunto inicial del mazo.');
assert(game.includes('loading="lazy"'),'Las vistas masivas deben usar lazy loading.');
assert(game.includes('decoding="async"'),'Las imágenes deben decodificarse de forma asíncrona.');
assert(game.includes('fetchpriority="low"'),'Las imágenes secundarias no deben competir con el core.');
assert(css.includes('content-visibility:auto'),'Colección y tienda deben evitar render fuera de viewport.');
assert(css.includes('contain-intrinsic-size'),'Debe reservarse tamaño para evitar saltos de layout.');
assert(game.includes('function resolveBattle('),'El motor de duelo debe permanecer intacto.');
assert(game.includes('NEMESIS_CAMPAIGN_PROFILES'),'Las campañas deben permanecer intactas.');
assert(game.includes('NEMESIS_OFFICIAL_DECK_REGISTRY'),'Los mazos oficiales deben permanecer intactos.');

console.log('PASS art/performance: 65 AVIF bajo demanda, arranque ligero y motores preservados.');
