import { Locator, Page } from "@playwright/test";
import { AccountPage } from "@pages/account.page";

export class RegisterPage extends AccountPage {
  readonly emailInputLocator: Locator;
  readonly registerButtonLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInputLocator = this.page.locator("#reg_email");
    this.registerButtonLocator = this.page.getByRole("button", {
      name: "Register",
    });
  }

  async register(email: string) {
    await this.emailInputLocator.fill(email);
    await this.registerButtonLocator.click();
  }
}
