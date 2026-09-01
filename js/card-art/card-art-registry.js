(function(){
 const art=()=>window.NEMESIS_CARD_ART||{};
 const sprite=id=>{try{return window.nemesisSpriteCardArt?.(String(id))||''}catch{return ''}};
 window.nemesisCardArtCandidates=(id,fallback='')=>[sprite(id),art()[String(id)]||'',fallback||''].filter((v,i,a)=>v&&a.indexOf(v)===i);
 window.nemesisRealCardArt=(id,fallback='')=>window.nemesisCardArtCandidates(id,fallback)[0]||'';
 window.nemesisApplyRealCardArt=(cards=[])=>{
   for(const card of cards){
     if(card?.id){
       const resolved=window.nemesisRealCardArt(card.id,card.img||'');
       if(resolved)card.img=resolved;
     }
   }
   return cards;
 };
 const required=[
   ...Array.from({length:20},(_,i)=>'IDR-'+String(i+1).padStart(3,'0')),
   ...Array.from({length:20},(_,i)=>'MGR-'+String(i+1).padStart(3,'0')),
   ...Array.from({length:20},(_,i)=>'DM-'+String(i+1).padStart(3,'0')),
   'TN-MAG-001','TN-MAG-002','TN-ARM-001','TN-ARM-002','TN-TRP-001'
 ];
 window.NEMESIS_CARD_ART_AUDIT=()=>({
   count:Object.keys(art()).length,
   ids:Object.keys(art()),
   spriteLoaded:typeof window.nemesisSpriteCardArt==='function',
   spritePath:window.NEMESIS_REAL_CARD_ART_SPRITE||null,
   missing:required.filter(id=>!window.nemesisRealCardArt(id,'')),
   required:required.length
 });
})();