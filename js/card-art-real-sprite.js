/* NÉMESIS CARD ART V2 · FUENTE ÚNICA · 65 cartas · 192x272 por carta
   El sprite físico vive en assets/images/cards/nemesis-card-art-v2.webp.
   Las definiciones de cartas conservan efectos/habilidades; este módulo solo resuelve arte. */
(function(){
 const IDS=["IDR-001","IDR-002","IDR-003","IDR-004","IDR-005","IDR-006","IDR-007","IDR-008","IDR-009","IDR-010","IDR-011","IDR-012","IDR-013","IDR-014","IDR-015","IDR-016","IDR-017","IDR-018","IDR-019","IDR-020","MGR-001","MGR-002","MGR-003","MGR-004","MGR-005","MGR-006","MGR-007","MGR-008","MGR-009","MGR-010","MGR-011","MGR-012","MGR-013","MGR-014","MGR-015","MGR-016","MGR-017","MGR-018","MGR-019","MGR-020","DM-001","DM-002","DM-003","DM-004","DM-005","DM-006","DM-007","DM-008","DM-009","DM-010","DM-011","DM-012","DM-013","DM-014","DM-015","DM-016","DM-017","DM-018","DM-019","DM-020","TN-MAG-001","TN-MAG-002","TN-ARM-001","TN-ARM-002","TN-TRP-001"];
 const MAP=Object.freeze(Object.fromEntries(IDS.map((id,i)=>[id,i])));
 const W=192,H=272,COLS=5,SW=960,SH=3536;
 const SPRITE_PATH='assets/images/cards/nemesis-card-art-v2.webp';
 const CACHE=new Map();
 function absoluteSprite(){return new URL(SPRITE_PATH,document.baseURI).href}
 function buildArt(id){
   const i=MAP[id]; if(i===undefined)return '';
   if(CACHE.has(id))return CACHE.get(id);
   const x=-(i%COLS)*W, y=-Math.floor(i/COLS)*H;
   const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'">'+
     '<image href="'+absoluteSprite()+'" x="'+x+'" y="'+y+'" width="'+SW+'" height="'+SH+'" preserveAspectRatio="none"/></svg>';
   const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
   CACHE.set(id,url); return url;
 }
 window.NEMESIS_REAL_CARD_ART_INDEX=MAP;
 window.NEMESIS_REAL_CARD_ART_SPRITE=SPRITE_PATH;
 window.NEMESIS_REAL_CARD_ART_VERSION='v2-192x272-65';
 window.nemesisSpriteCardArt=buildArt;
 if(typeof window.nemesisRealCardArt!=='function')window.nemesisRealCardArt=function(id,fallback=''){return buildArt(id)||fallback||''};
 window.nemesisApplySpriteCardArt=function(cards){
   for(const c of cards||[]){const art=buildArt(c?.id);if(art)c.img=art}
   return cards;
 };
 window.nemesisCardArtAudit=function(){
   return {version:window.NEMESIS_REAL_CARD_ART_VERSION,count:IDS.length,cell:[W,H],sprite:[SW,SH],spritePath:SPRITE_PATH,ids:IDS.slice()};
 };
})();