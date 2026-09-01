export class FrozenDataLoader{
  constructor({readJson,manifest=null}={}){if(typeof readJson!=='function')throw new Error('READ_JSON_REQUIRED');this.readJson=readJson;this.manifest=manifest}
  async loadManifest(){if(!this.manifest)this.manifest=await this.readJson('runtime-clean/frozen-source/DATA_MANIFEST.json');return this.manifest}
  async loadAll(){
    const manifest=await this.loadManifest();
    if(!Array.isArray(manifest?.files))throw new Error('INVALID_DATA_MANIFEST');
    const entries=[];
    for(const file of manifest.files){
      const sourcePath=file.path;
      if(!/^data\/.+\.json$/.test(sourcePath))throw new Error('INVALID_SOURCE_PATH:'+sourcePath);
      const frozenPath='runtime-clean/frozen-source/'+sourcePath;
      const value=await this.readJson(frozenPath);
      entries.push(Object.freeze({sourcePath,frozenPath,sourceSha:file.sha,size:file.size,value}));
    }
    if(entries.length!==manifest.count)throw new Error('DATA_COUNT_MISMATCH');
    return Object.freeze(entries);
  }
  static browser({base='../../'}={}){
    const readJson=async p=>{const r=await fetch(new URL(base+p,import.meta.url));if(!r.ok)throw new Error('DATA_FETCH_FAILED:'+p+':'+r.status);return r.json()};
    return new FrozenDataLoader({readJson});
  }
}