import { test, expect } from './fixtures/testFixtures.js';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('QA Dashboard', () => {

  test('should load the dashboard page', async ({ dashboard }) => {
    await expect(dashboard.header).toBeVisible();
  });

  test('should display bug table', async ({ dashboard }) => {
    await expect(dashboard.bugTable).toBeVisible();
  });

  test('should have no critical accessibility violations', async ({ dashboard }) => {
    const accessibilityScanResults = await new AxeBuilder({ page: dashboard.page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should open create bug modal', async ({ dashboard }) => {
    await dashboard.openCreate();
    await expect(dashboard.titleInput).toBeVisible();
  });

  test('should create a new bug', async ({ dashboard }) => {
    await dashboard.createBug('API login failure');
    await expect(dashboard.bugTable).toContainText('API login failure');
    await expect(dashboard.bugTable).toContainText('LOW');
  });

  test('should not create bug without title', async ({ dashboard, request }) => {
    const beforeResponse = await request.get('http://localhost:3000/api/bugs');
    const bugCountBefore = (await beforeResponse.json()).length;

    await dashboard.openCreate();
    await dashboard.save();

    const alerts = await dashboard.getAlerts();
    expect(alerts).toContain('Bug title is required');

    const afterResponse = await request.get('http://localhost:3000/api/bugs');
    const bugCountAfter = (await afterResponse.json()).length;
    expect(bugCountAfter).toBe(bugCountBefore);
  });

  test('should create bug with selected priority', async ({ dashboard }) => {
    await dashboard.createBug('Payment error', 'HIGH');
    await expect(dashboard.bugTable).toContainText('Payment error');
    await expect(dashboard.bugTable).toContainText('HIGH');
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

  test('should change bug status from UI', async ({ dashboard }) => {
    await dashboard.changeStatusFromUI();
    await expect(dashboard.bugTable).toContainText('CLOSED');
  });

  test('should display API status as OK', async ({ dashboard }) => {
    await expect(dashboard.systemStatus).toBeVisible();
    await expect(dashboard.systemStatus).toContainText('OK');
  });

});