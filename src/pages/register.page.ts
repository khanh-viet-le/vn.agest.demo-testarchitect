import { Locator, Page } from "@playwright/test";
import { RouteConstants } from "@constants/route.constants";

export class RegisterPage {
  private page: Page;
  private emailInputLocator: Locator;
  private registerButtonLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInputLocator = this.page.locator("#reg_email");
    this.registerButtonLocator = this.page.getByRole("button", {
      name: "Register",
    });
  }

  async goto() {
    await this.page.goto(RouteConstants.MY_ACCOUNT);
  }

  async register(email: string) {
    await this.emailInputLocator.fill(email);
    await this.registerButtonLocator.click();
  }
}
