import { test, expect } from '@playwright/test';

test.describe('QA Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.confirm = () => true;
    });

    page._alerts = [];
    page.on('dialog', dialog => {
      if (dialog.type() === 'alert') {
        page._alerts.push(dialog.message());
        dialog.accept();
      } else {
        dialog.accept();
      }
    });
    await page.goto('/frontend/index.html', { waitUntil: 'networkidle' });
    // wait for the main header to ensure frontend rendered and scripts ran
    await page.waitForSelector('text=QA Dashboard', { timeout: 10000 });
  });

  test('should load the dashboard page', async ({ page }) => {
    await expect(page.locator('text=QA Dashboard')).toBeVisible();
  });

  test('should display bug table', async ({ page }) => {
    await expect(page.locator('[data-cy="bug-table"]')).toBeVisible();
  });

  test('should open create bug modal', async ({ page }) => {
    await page.locator('[data-cy="create-bug-button"]').click();
    await expect(page.locator('[data-cy="bug-title-input"]')).toBeVisible();
  });

  test('should create a new bug', async ({ page }) => {
    await page.locator('[data-cy="create-bug-button"]').click();
    await page.locator('[data-cy="bug-title-input"]').fill('API login failure');
    await page.selectOption('#priority', 'LOW');
    await page.locator('[data-cy="save-bug-button"]').click();
    await expect(page.locator('[data-cy="bug-table"]')).toContainText('API login failure');
    await expect(page.locator('[data-cy="bug-table"]')).toContainText('LOW');
  });

  test('should not create bug without title', async ({ page, request }) => {
    const beforeResponse = await request.get('http://localhost:3000/api/bugs');
    const bugCountBefore = (await beforeResponse.json()).length;

    await page.locator('[data-cy="create-bug-button"]').click();
    await page.locator('[data-cy="save-bug-button"]').click();

    expect(page._alerts).toContain('Bug title is required');

    const afterResponse = await request.get('http://localhost:3000/api/bugs');
    const bugCountAfter = (await afterResponse.json()).length;
    expect(bugCountAfter).toBe(bugCountBefore);
  });

  test('should create bug with selected priority', async ({ page }) => {
    await page.locator('[data-cy="create-bug-button"]').click();
    await page.locator('[data-cy="bug-title-input"]').fill('Payment error');
    await page.selectOption('#priority', 'HIGH');
    await page.locator('[data-cy="save-bug-button"]').click();
    await expect(page.locator('[data-cy="bug-table"]')).toContainText('Payment error');
    await expect(page.locator('[data-cy="bug-table"]')).toContainText('HIGH');
  });

  test('should get bugs from API', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/bugs');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('should return bugs with required fields', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/bugs');
    expect(response.status()).toBe(200);
    const body = await response.json();
    for (const bug of body) {
      expect(bug.id).toBeDefined();
      expect(bug.title).toBeDefined();
      expect(bug.priority).toBeDefined();
      expect(bug.status).toBeDefined();
    }
  });

  test('should not have duplicate bug IDs', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/bugs');
    const body = await response.json();
    const ids = body.map(b => b.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });

  test('should not allow duplicate bug title', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/bugs');
    const body = await response.json();
    const existingTitle = body[0].title;

    const postResponse = await request.post('http://localhost:3000/api/bugs', { data: { title: existingTitle, priority: 'HIGH' } });
    expect(postResponse.status()).toBe(400);
  });

  test('should update bug status', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/bugs');
    const body = await response.json();
    const bugId = body[0].id;

    const putResponse = await request.put(`http://localhost:3000/api/bugs/${bugId}`, { data: { status: 'CLOSED' } });
    expect(putResponse.status()).toBe(200);
    const putBody = await putResponse.json();
    expect(putBody.status).toBe('CLOSED');
  });

  test('should delete a bug', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/bugs');
    const body = await response.json();
    const bugId = body[0].id;

    const deleteResponse = await request.delete(`http://localhost:3000/api/bugs/${bugId}`);
    expect(deleteResponse.status()).toBe(200);

    const getResponse = await request.get('http://localhost:3000/api/bugs');
    const getBody = await getResponse.json();
    const deletedBug = getBody.find(b => b.id === bugId);
    expect(deletedBug).toBeUndefined();
  });

  test('should change bug status from UI', async ({ page }) => {
    await page.locator('[data-cy="bug-status"]').first().click();
    await page.locator('[data-cy="status-closed"]').click();
    await expect(page.locator('[data-cy="bug-table"]')).toContainText('CLOSED');
  });

  test('should display API status as OK', async ({ page }) => {
    await expect(page.locator('#systemStatus')).toBeVisible();
    await expect(page.locator('#systemStatus')).toContainText('OK');
  });

});