import { Locator, Page } from "@playwright/test";
import { RouteConstants } from "@constants/route.constants";

export class MyAccountPage {
  private page: Page;
  private titleLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleLocator = this.page.locator("h1.title");
  }

  async goto() {
    await this.page.goto(RouteConstants.MY_ACCOUNT);
  }

  async getTitle() {
    const title = await this.titleLocator.textContent();
  }
}
