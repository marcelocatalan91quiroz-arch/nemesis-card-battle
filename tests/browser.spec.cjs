
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
  const audit=await page.evaluate(() => typeof window.NEMESIS_V19_AUDIT==='function' ? window.NEMESIS_V19_AUDIT() : null);
  expect(audit).not.toBeNull();
  expect(audit.ok).toBeTruthy();
  expect(audit.hades).toBeTruthy();
  expect(audit.olympo).toBeTruthy();
});

test('Santuario está registrado sin alterar campañas', async ({ page }) => {
  await page.goto('/');
  const result=await page.evaluate(() => ({
    sanctuary:!!window.NEMESIS_SANCTUARY,
    campaigns:!!window.NEMESIS_CAMPAIGN_PROFILES,
    adapters:!!window.NEMESIS_BOSS_ADAPTERS
  }));
  expect(result).toEqual({sanctuary:true,campaigns:true,adapters:true});
});


test('auditoría Duel Master 10/10 y assets', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(900);
  const audit=await page.evaluate(() => typeof window.NEMESIS_DUEL_MASTER_AUDIT==='function' ? window.NEMESIS_DUEL_MASTER_AUDIT() : null);
  expect(audit).not.toBeNull();
  expect(audit.total).toBe(10);
  expect(audit.ok).toBeTruthy();
  expect(audit.onkolxon).toEqual({hp:13000,energia:14});
  expect(audit.handlers.every(x=>x.handler)).toBeTruthy();
  for(const src of audit.images){
    const res=await page.request.get(new URL(src,page.url()).href);
    expect(res.ok()).toBeTruthy();
  }
});
