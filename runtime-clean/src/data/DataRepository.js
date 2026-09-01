export class DataRepository{
  constructor(entries=[]){this.bySource=new Map();for(const e of entries)this.add(e)}
  add(entry){if(!entry?.sourcePath)throw new Error('SOURCE_PATH_REQUIRED');if(this.bySource.has(entry.sourcePath))throw new Error('DUPLICATE_SOURCE:'+entry.sourcePath);this.bySource.set(entry.sourcePath,entry);return entry}
  get(sourcePath){return this.bySource.get(sourcePath)?.value??null}
  entry(sourcePath){return this.bySource.get(sourcePath)||null}
  has(sourcePath){return this.bySource.has(sourcePath)}
  list(){return [...this.bySource.values()]}
  get size(){return this.bySource.size}
}