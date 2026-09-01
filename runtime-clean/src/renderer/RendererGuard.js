export class RendererGuard{
  constructor({onError=()=>{}}={}){this.onError=onError}
  render(renderer,vm,host){
    if(!renderer||typeof renderer.render!=='function')return{ok:false,error:new Error('INVALID_RENDERER'),uid:vm?.uid??null};
    try{
      const element=renderer.render(vm,host);
      return{ok:true,element,uid:vm?.uid??null};
    }catch(error){
      this.onError(error,{uid:vm?.uid??null,cardId:vm?.cardId??null});
      return{ok:false,error,uid:vm?.uid??null,cardId:vm?.cardId??null};
    }
  }
}