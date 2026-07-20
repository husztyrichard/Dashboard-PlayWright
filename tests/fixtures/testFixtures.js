import { test as baseTest, expect as baseExpect } from '@playwright/test';
import DashboardPage from '../pages/dashboard.page.js';

export const test = baseTest.extend({
  dashboard: async ({ page }, use) => {
    // ensure confirm/alert handling before navigation
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

    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await use(dashboard);
  }
});

export const expect = baseExpect;
