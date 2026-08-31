
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
