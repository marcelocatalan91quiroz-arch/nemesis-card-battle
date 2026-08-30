(function(){
 const art=()=>window.NEMESIS_CARD_ART||{};
 window.nemesisRealCardArt=(id,fallback='')=>art()[String(id)]||fallback||'';
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
   ...Array.from({length:10},(_,i)=>'DM-'+String(i+11).padStart(3,'0')),
   'TN-MAG-001','TN-MAG-002','TN-ARM-001','TN-ARM-002','TN-TRP-001'
 ];
 window.NEMESIS_CARD_ART_AUDIT=()=>({
   count:Object.keys(art()).length,
   ids:Object.keys(art()),
   missing:required.filter(id=>!art()[id]),
   required:required.length
 });
})();