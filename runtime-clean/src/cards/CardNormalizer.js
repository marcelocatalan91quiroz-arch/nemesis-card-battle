export function normalizeCard(raw,{sourcePath=null}={}){
  if(!raw?.id)throw new Error('CARD_ID_REQUIRED');
  const effects=Array.isArray(raw.efectos)?raw.efectos:Array.isArray(raw.effects)?raw.effects:[];
  return Object.freeze({
    id:String(raw.id),
    name:raw.name??raw.nombre??String(raw.id),
    type:raw.type??raw.tipo??'UNKNOWN',
    subtype:raw.subtype??raw.subtipo??null,
    affinities:Object.freeze([...(raw.afinidades??raw.affinities??[])]),
    archetypes:Object.freeze([...(raw.arquetipos??raw.archetypes??[])]),
    rarity:raw.rarity??raw.rareza??null,
    level:Number.isFinite(raw.level)?raw.level:(Number.isFinite(raw.nivel)?raw.nivel:null),
    atk:Number(raw.atk??0),
    def:Number(raw.def??raw.defense??0),
    maxCopies:Number(raw.copias_max??raw.maxCopies??1),
    image:raw.img_game??raw.img??raw.image??null,
    ability:raw.habilidad??raw.ability??null,
    effects:Object.freeze([...effects]),
    transformation:raw.transformacion??raw.transformation??null,
    sourcePath
  });
}
export function normalizeDeckFile(file,{sourcePath}={}){
  if(!file||!Array.isArray(file.cards)||!Array.isArray(file.deck_ids))throw new Error('INVALID_DECK_FILE');
  const cards=file.cards.map(x=>normalizeCard(x,{sourcePath}));
  return Object.freeze({id:file.set??file.id??'UNKNOWN_DECK',name:file.set??file.name??'UNKNOWN_DECK',mechanic:file.mecanica??null,cardIds:Object.freeze([...file.deck_ids]),cards:Object.freeze(cards),sourcePath});
}