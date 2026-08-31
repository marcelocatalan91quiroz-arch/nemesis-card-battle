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
assert(!html.includes('<script src="js/owner-auth.js"'),'Owner Auth debe ser opcional/diferido.');
assert(!html.includes('<script src="js/online1v1.js"'),'Online debe ser opcional/diferido.');
assert(!html.includes('<script src="js/dios-fantasma-intro.js"'),'Intro Dios Fantasma no debe bloquear el menú.');
assert(!html.includes('<script src="dios-fantasma-mazo-completo.js"'),'Mazo legado Dios Fantasma no debe bloquear el menú.');
assert(!html.includes('<script src="campaign3-ares.js"'),'Ares no debe bloquear el menú.');
assert(game.includes("nemesisLoadOptionalScript('js/dios-fantasma-intro.js','dios-fantasma-intro')"),'Intro Dios Fantasma debe cargarse bajo demanda.');
assert(game.includes("nemesisLoadOptionalScript('campaign3-ares.js','campaign3-ares')"),'Ares debe cargarse bajo demanda.');
assert(game.includes('if(isAres)await nemesisEnsureAresModule();'),'El duelo de Ares debe garantizar su módulo antes de usarlo.');
assert(game.includes("nemesisLoadOptionalScript('js/owner-auth.js','owner-auth')"),'Owner Auth debe tener cargador bajo demanda.');
assert(game.includes("nemesisLoadOptionalScript('js/online1v1.js','online1v1')"),'Online debe tener cargador bajo demanda.');
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
assert(!game.includes('assets/images/imperio-dragon/idr-001.png'),'No deben quedar fallbacks PNG antiguos del Imperio Dragón.');
assert(game.includes('assets/card-art/idr/IDR-001.avif')&&game.includes('assets/card-art/idr/IDR-020.avif'),'Los metadatos oficiales IDR deben apuntar al arte AVIF real.');
assert(game.includes('assets/images/dios-fantasma/dios-fantasma.png'),'La victoria de Dios Fantasma debe usar una ruta real.');

console.log('PASS art/performance: 65 AVIF bajo demanda, arranque ligero y motores preservados.');
