export function applyImageFallback(img,placeholder){
  if(!img||!placeholder)return false;
  if(img.src===placeholder||String(img.src||'').endsWith(placeholder))return false;
  img.src=placeholder;return true;
}
export class CardRenderer{
  constructor({placeholder='../public/assets/placeholder.svg'}={}){this.placeholder=placeholder}
  render(vm,host){
    if(!host)throw new Error('RENDER_HOST_REQUIRED');
    if(!vm?.uid)throw new Error('VIEWMODEL_UID_REQUIRED');
    const el=document.createElement('article');
    el.className='clean-card';el.dataset.uid=vm.uid;el.dataset.cardId=vm.cardId;
    el.innerHTML='<div class="clean-card__title"></div><img class="clean-card__image" alt=""><div class="clean-card__stats"></div><div class="clean-card__meta"></div>';
    el.querySelector('.clean-card__title').textContent=vm.name;
    const img=el.querySelector('.clean-card__image');
    img.src=vm.imageUrl;img.alt=vm.name;img.dataset.uid=vm.uid;
    img.onerror=()=>applyImageFallback(img,this.placeholder);
    el.querySelector('.clean-card__stats').textContent='ATK '+vm.atk+' / DEF '+vm.def;
    el.querySelector('.clean-card__meta').textContent=vm.type+' · '+(vm.rarity||'SIN RAREZA')+' · '+vm.zone;
    host.replaceChildren(el);return el;
  }
}