export class AssetResolver{
  constructor({base='../public/assets/cards/',placeholder='../public/assets/placeholder.svg',map={}}={}){this.base=base;this.placeholder=placeholder;this.map=new Map(Object.entries(map))}
  resolve(card){if(!card)return this.placeholder;const mapped=this.map.get(card.id);if(mapped)return mapped;if(card.sprite)return card.sprite;if(card.image)return card.image;if(card.img)return card.img;return this.placeholder}
}