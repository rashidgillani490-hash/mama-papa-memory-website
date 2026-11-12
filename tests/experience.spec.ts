import { test, expect } from '@playwright/test';
import { content } from '../app/content';

test('story, gallery, keyboard navigation and the complete original letter', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload();
  await expect.poll(() => page.locator('.front-photo img').evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBeTruthy();
  await expect(page.getByRole('heading', { name: /Happy Anniversary/ })).toBeVisible();
  await page.getByRole('tab', { name: /The beginning/ }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('tab', { name: /A home full of love/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel').locator('img')).toHaveAttribute('alt', content.memories[2].alt);
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: /Today & always/ })).toHaveAttribute('aria-selected', 'true');
  const trigger = page.getByRole('button', { name: 'View photo 1: Where it all began', exact: true });
  await trigger.click();
  const viewer = page.getByRole('dialog', { name: 'Memory photo viewer' });
  await expect(viewer).toBeVisible();
  await expect(viewer.locator('img')).toHaveJSProperty('complete', true);
  await page.keyboard.press('ArrowRight');
  await expect(viewer.getByRole('heading')).toHaveText(content.memories[1].title);
  await page.keyboard.press('ArrowLeft');
  await viewer.getByRole('button', { name: 'Previous photo' }).click();
  await expect(viewer.getByRole('heading')).toHaveText(content.memories[3].title);
  await viewer.getByRole('button', { name: 'Go to photo 2' }).click();
  await expect(viewer.getByRole('heading')).toHaveText(content.memories[1].title);
  await page.keyboard.press('Escape');
  await expect(viewer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.locator('.letter summary').click();
  for (const paragraph of content.letter) await expect(page.locator('.letter-paper').getByText(paragraph, { exact: true })).toBeVisible();
  await page.locator('.letter-paper').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'test-results/dreamy-letter-open.png' });
  await page.locator('.letter summary').click();
  await expect(page.locator('.letter')).not.toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Open your surprise' }).click();
  await expect(page.getByRole('dialog', { name: 'Anniversary surprise' })).toBeVisible();
  await page.getByRole('button', { name: /Keep these memories close/ }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  expect(errors).toEqual([]);
});

test('responsive widths, real photos, reduced motion and review screenshots', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    const images = page.locator('.memory-grid img');
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBeTruthy();
      await expect(image).toBeVisible();
      expect(await image.evaluate(el => getComputedStyle(el).opacity)).toBe('1');
    }
    expect(await page.locator('.front-photo').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    if (width === 390 || width === 1440) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `test-results/dreamy-${width}-intro.png` });
      await page.locator('#memories').evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY));
      await page.screenshot({ path: `test-results/dreamy-${width}-gallery.png` });
    }
  }
});

test('touch viewer swipe and locally generated QR sharing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => Object.defineProperty(navigator, 'share', { value: undefined, configurable: true }));
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('button', { name: 'View photo 1: Where it all began', exact: true }).click();
  const swipe = page.locator('.photo-viewer .modal-content');
  await swipe.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: 300 });
  await swipe.dispatchEvent('pointerup', { pointerType: 'touch', clientX: 100 });
  await expect(page.getByRole('dialog').getByRole('heading')).toHaveText(content.memories[1].title);
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: /Share this little gift/ }).click();
  await expect(page.getByRole('status')).toHaveText('Link copied. Ready to share with love.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('https://mama-papa-memory-website.vercel.app');
  await page.locator('.qr-details summary').click();
  await expect(page.getByAltText('QR code linking to this anniversary website')).toBeVisible();
  await expect(page.locator('.qr-content img')).toHaveAttribute('src', /^data:image\/png;base64,/);
  await expect(page.getByLabel('Website address')).toHaveValue('https://mama-papa-memory-website.vercel.app');
});

test('blocked image requests recover through the retry control', async ({ page }) => {
  await page.route('**/photos/**', route => route.abort());
  await page.goto('/');
  await expect(page.locator('.front-photo .image-error')).toBeVisible();
  await expect(page.getByText('Loading memory', { exact: false })).toHaveCount(0);
  await page.unroute('**/photos/**');
  await page.locator('.front-photo').getByRole('button', { name: 'Try again' }).click();
  const image = page.locator('.front-photo img');
  await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBeTruthy();
  await expect(image).toBeVisible();
});

test('cached and JavaScript-disabled photos stay visible; native letter opens', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3100/');
  const heroPhoto = page.locator('.front-photo img');
  await expect(heroPhoto).toBeVisible();
  await expect(heroPhoto).not.toHaveAttribute('style', /opacity:\s*0/);
  await page.locator('.letter summary').click();
  await expect(page.locator('.letter-paper')).toBeVisible();
  for (const paragraph of content.letter) await expect(page.locator('.letter-paper').getByText(paragraph, { exact: true })).toBeVisible();
  await context.close();
});
