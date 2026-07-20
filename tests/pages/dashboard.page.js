export default class DashboardPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.header = page.locator('text=QA Dashboard');
    this.createButton = page.locator('[data-cy="create-bug-button"]');
    this.titleInput = page.locator('[data-cy="bug-title-input"]');
    this.saveButton = page.locator('[data-cy="save-bug-button"]');
    this.bugTable = page.locator('[data-cy="bug-table"]');
    this.priority = page.locator('#priority');
    this.systemStatus = page.locator('#systemStatus');
    this.bugStatus = page.locator('[data-cy="bug-status"]');
    this.statusClosed = page.locator('[data-cy="status-closed"]');
  }

  async goto() {
    await this.page.goto('/frontend/index.html', { waitUntil: 'networkidle' });
    await this.header.waitFor({ state: 'visible', timeout: 10000 });
  }

  async openCreate() {
    await this.createButton.click();
    await this.titleInput.waitFor({ state: 'visible' });
  }

  async save() {
    await this.saveButton.click();
  }

  async createBug(title, priority = 'LOW') {
    await this.openCreate();
    await this.titleInput.fill(title);
    await this.priority.selectOption(priority);
    await this.save();
  }

  async changeStatusFromUI() {
    await this.bugStatus.first().click();
    await this.statusClosed.click();
  }

  async getAlerts() {
    return this.page._alerts || [];
  }

}
