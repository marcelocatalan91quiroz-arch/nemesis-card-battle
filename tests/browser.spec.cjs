
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
  const audit=await page.evaluate(() => {
    const all=window.NEMESIS_COLLECTION||[];
    const ids=[
      ...Array.from({length:20},(_,i)=>'IDR-'+String(i+1).padStart(3,'0')),
      ...Array.from({length:20},(_,i)=>'MGR-'+String(i+1).padStart(3,'0')),
      ...Array.from({length:10},(_,i)=>'DM-'+String(i+11).padStart(3,'0'))
    ];
    const cards=ids.map(id=>all.find(c=>c.id===id)).filter(Boolean);
    return {
      expected:ids.length,
      found:cards.length,
      real:cards.filter(c=>/^data:image\//i.test(c.img||'')).length,
      missing:ids.filter(id=>!all.find(c=>c.id===id)),
      bad:cards.filter(c=>!/^(data:image\/|https?:|assets\/)/i.test(c.img||'')).map(c=>c.id)
    };
  });
  expect(audit.expected).toBe(50);
  expect(audit.found).toBe(50);
  expect(audit.real).toBe(50);
  expect(audit.missing).toEqual([]);
  expect(audit.bad).toEqual([]);
});
