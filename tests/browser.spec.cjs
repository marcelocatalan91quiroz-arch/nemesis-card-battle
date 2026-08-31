
const { test, expect } = require('@playwright/test');

test('arranque del juego sin pantalla negra', async ({ page }) => {
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('/');
  await expect(page.locator('#app')).toBeVisible();
  await expect(page.locator('body')).toBeVisible();
  await page.waitForTimeout(1200);
  expect(errors).toEqual([]);
});

test('auditoría runtime NÉMESIS', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(700);
  const audit=await page.evaluate(() => ({
    core:window.NEMESIS_CORE_VERSION,
    bosses:Object.keys(window.NEMESIS_BOSS_REGISTRY||{}),
    battle:typeof window.battle==='function',
    collection:!!window.NEMESIS_COLLECTION
  }));
  expect(audit.core).toBe('19.2.8');
  expect(audit.bosses).toEqual(expect.arrayContaining(['guardian','dragon','ra','caballero-almas','rey-espectral','dios-fantasma','ares','hades']));
  expect(audit.battle).toBeTruthy();
  expect(audit.collection).toBeTruthy();
});

test('Santuario está registrado sin alterar campañas', async ({ page }) => {
  await page.goto('/');
  const result=await page.evaluate(() => ({
    sanctuary:!!window.NEMESIS_SANCTUARY,
    sanctuaryScene:typeof window.sanctuaryScene==='function',
    battle:typeof window.battle==='function',
    bosses:Object.keys(window.NEMESIS_BOSS_REGISTRY||{}).length
  }));
  expect(result).toEqual({sanctuary:true,sanctuaryScene:true,battle:true,bosses:8});
});


test('auditoría Duel Master 20/20 y assets', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.battle('guardian'));
  await page.waitForTimeout(1800);
  const audit=await page.evaluate(() => typeof window.NEMESIS_DUEL_MASTER_AUDIT==='function' ? window.NEMESIS_DUEL_MASTER_AUDIT() : null);
  expect(audit).not.toBeNull();
  expect(audit.total).toBe(20);
  expect(audit.ok).toBeTruthy();
  expect(audit.onkolxon).toEqual({hp:13000,energia:14});
  expect(audit.handlers.every(x=>x.handler)).toBeTruthy();
  for(const src of audit.images){
    if(/^data:image\//i.test(src)){
      expect(src.length).toBeGreaterThan(100);
      continue;
    }
    const res=await page.request.get(new URL(src,page.url()).href);
    expect(res.ok()).toBeTruthy();
  }
});


test('colección usa arte real en los mazos recientes', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(500);
  const audit=await page.evaluate(async () => {
    const ids=[
      ...Array.from({length:20},(_,i)=>'IDR-'+String(i+1).padStart(3,'0')),
      ...Array.from({length:20},(_,i)=>'MGR-'+String(i+1).padStart(3,'0')),
      ...Array.from({length:10},(_,i)=>'DM-'+String(i+11).padStart(3,'0'))
    ];
    const map=window.NEMESIS_CARD_ART||{};
    const sources=ids.map(id=>window.nemesisRealCardArt?.(id,'')||'');
    const loaded=await Promise.all(sources.map(src=>new Promise(resolve=>{
      if(!src)return resolve(false);
      const img=new Image();
      img.onload=()=>resolve(img.naturalWidth>0&&img.naturalHeight>0);
      img.onerror=()=>resolve(false);
      img.src=src;
    })));
    return {
      expected:ids.length,
      mapped:ids.filter(id=>typeof map[id]==='string'&&map[id].endsWith('.avif')).length,
      pathImages:sources.filter(src=>/\.avif(?:$|\?)/i.test(src)).length,
      decoded:loaded.filter(Boolean).length
    };
  });
  expect(audit).toEqual({expected:50,mapped:50,pathImages:50,decoded:50});
});


test('arte autoritativo 65/65 y colección de mazos recientes', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(700);
  const audit=await page.evaluate(async()=>{
    const ids=[
      ...Array.from({length:20},(_,i)=>'IDR-'+String(i+1).padStart(3,'0')),
      ...Array.from({length:20},(_,i)=>'MGR-'+String(i+1).padStart(3,'0')),
      ...Array.from({length:20},(_,i)=>'DM-'+String(i+1).padStart(3,'0')),
      'TN-MAG-001','TN-MAG-002','TN-ARM-001','TN-ARM-002','TN-TRP-001'
    ];
    const artAudit=window.NEMESIS_CARD_ART_AUDIT?.();
    const decoded=await Promise.all(ids.map(id=>new Promise(resolve=>{
      const src=window.nemesisRealCardArt?.(id,'')||'';
      const img=new Image();
      img.onload=()=>resolve({id,ok:img.naturalWidth>=300&&img.naturalHeight>=440,w:img.naturalWidth,h:img.naturalHeight});
      img.onerror=()=>resolve({id,ok:false,w:0,h:0});
      img.src=src;
    })));
    const owned=window.NEMESIS_COLLECTION?.owned||[];
    const publicIds=ids.filter(id=>id.startsWith('IDR-')||id.startsWith('MGR-'));
    const privateDm=ids.filter(id=>id.startsWith('DM-'));
    return {
      artAudit,
      badImages:decoded.filter(x=>!x.ok),
      missingPublicOwned:publicIds.filter(id=>!owned.includes(id)),
      privateDmOwned:privateDm.filter(id=>owned.includes(id)),
      treasures:window.NEMESIS_TREASURE_AUDIT?.()
    };
  });
  expect(audit.artAudit.required).toBe(65);
  expect(audit.artAudit.count).toBeGreaterThanOrEqual(65);
  expect(audit.artAudit.missing).toEqual([]);
  expect(audit.badImages).toEqual([]);
  expect(audit.missingPublicOwned).toEqual([]);
  expect(audit.privateDmOwned).toEqual([]);
  expect(audit.treasures.count).toBe(5);
  expect(audit.treasures.unique).toBeTruthy();
});


test('runtime de mecánicas 20/20', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.battle('guardian'));
  await page.waitForTimeout(1600);
  const audit=await page.evaluate(()=>window.NEMESIS_RUNTIME_MECHANICS_AUDIT?.());
  expect(audit).toBeTruthy();
  expect(audit.ok).toBeTruthy();
  expect(audit.dm.total).toBe(20);
  expect(audit.dm.handlers.every(x=>x.handler)).toBeTruthy();
  expect(audit.mgr.count).toBe(20);
  expect(audit.mgr.ok).toBeTruthy();
  expect(audit.idr.count).toBe(20);
  expect(audit.idr.ok).toBeTruthy();
  expect(audit.idr.handlers.every(x=>x.handler)).toBeTruthy();
  expect(audit.idr.systems.transform).toBeTruthy();
  expect(audit.idr.systems.fusion).toBeTruthy();
  expect(audit.idr.systems.magic).toBeTruthy();
  expect(audit.idr.systems.traps).toBeTruthy();
  expect(audit.treasures.count).toBe(5);
  expect(audit.phases.valid).toBeTruthy();
});


test('auditoría total de cartas, imágenes y pantallas de colección', async ({ page }) => {
  test.setTimeout(120000);
  const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('/');
  await page.evaluate(()=>{ localStorage.clear(); localStorage.setItem('nemesis_memory_card_v1',JSON.stringify({name:'QA NEMESIS',profileCreated:true})); location.reload(); });
  await page.waitForLoadState('load'); await page.waitForTimeout(900);
  const cards=await page.evaluate(()=>window.NEMESIS_FULL_CARD_AUDIT?.()||[]);
  expect(cards.length).toBeGreaterThan(0);
  expect(new Set(cards.map(c=>c.id)).size).toBe(cards.length);
  const decoded=await page.evaluate(async()=>{
    const all=window.NEMESIS_FULL_CARD_AUDIT?.()||[], out=[];
    for(let p=0;p<all.length;p+=12){
      const batch=all.slice(p,p+12);
      out.push(...await Promise.all(batch.map(c=>new Promise(resolve=>{
        const img=new Image(),done=ok=>resolve({id:c.id,ok:ok&&img.naturalWidth>0&&img.naturalHeight>0,w:img.naturalWidth,h:img.naturalHeight,src:c.img});
        const timer=setTimeout(()=>done(false),5000);
        img.onload=()=>{clearTimeout(timer);done(true)};img.onerror=()=>{clearTimeout(timer);done(false)};img.src=c.img;
      }))));
    }
    return out;
  });
  expect(decoded.filter(x=>!x.ok)).toEqual([]);

  await page.locator('#deckBtn').click(); await expect(page.locator('.collection-global')).toBeVisible();
  expect(await page.locator('.inventory-grid img').count()).toBeGreaterThan(0);
  const brokenCollection=await page.locator('.inventory-grid img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute('src')));
  expect(brokenCollection).toEqual([]);
  await page.locator('#backMenu').click();

  await page.locator('#treasureBtn').click(); await expect(page.getByText('TESOROS NÉMESIS',{exact:true})).toBeVisible();
  expect(await page.locator('.shop-grid img').count()).toBe(5);
  const brokenTreasures=await page.locator('.shop-grid img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute('src')));
  expect(brokenTreasures).toEqual([]);
  await page.locator('#treasureBack').click();

  await page.locator('#sanctuaryBtn').click(); await expect(page.getByText('SANTUARIO DE LAS TRES ÚNICAS')).toBeVisible();
  expect(await page.locator('.unique-pedestal img').count()).toBe(3);
  const brokenUnique=await page.locator('.unique-pedestal img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute('src')));
  expect(brokenUnique).toEqual([]);
  expect(errors).toEqual([]);
});

test('menú de revancha y flujo de batalla permanecen operativos', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/');
  await page.evaluate(()=>{localStorage.setItem('nemesis_memory_card_v1',JSON.stringify({name:'QA NEMESIS',profileCreated:true,guardianDefeated:true,dragonDefeated:true,raDefeated:true,caballeroAlmasDefeated:true,reyEspectralDefeated:true,diosFantasmaDefeated:true,aresDefeated:true,hadesDefeated:true}));location.reload()});
  await page.waitForLoadState('load'); await page.waitForTimeout(800);
  await page.locator('#retryBtn').click();
  await expect(page.getByText('RETOS · REVANCHA')).toBeVisible();
  const challenge=page.locator('.retry-grid button').first(); await expect(challenge).toBeEnabled();
  expect(await page.locator('.retry-grid button').count()).toBeGreaterThanOrEqual(8);
});
