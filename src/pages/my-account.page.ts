import { Locator, Page } from "@playwright/test";
import { AccountPage } from "@pages/account.page";

export class MyAccountPage extends AccountPage {
  readonly titleLocator: Locator;
  readonly logoutLinkLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.titleLocator = this.page.locator("h1.title");
    this.logoutLinkLocator = this.page.getByRole("link", {
      name: "Logout",
    });
  }

  async getTitle() {
    const title = (await this.titleLocator.textContent()) ?? "";

    return title.trim();
  }

  async logout() {
    await this.logoutLinkLocator.click();
  }
}
