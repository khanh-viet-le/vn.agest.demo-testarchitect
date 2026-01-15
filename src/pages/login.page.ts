import { Locator, Page } from "@playwright/test";
import { RouteConstants } from "@constants/route.constants";

export class LoginPage {
  private page: Page;
  private usernameInputLocator: Locator;
  private passwordInputLocator: Locator;
  private loginButtonLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInputLocator = this.page.getByRole("textbox", {
      name: "username",
    });
    this.passwordInputLocator = this.page.getByRole("textbox", {
      name: "password",
    });
    this.loginButtonLocator = this.page.getByRole("button", {
      name: "Log in",
    });
  }

  async goto() {
    await this.page.goto(RouteConstants.MY_ACCOUNT);
  }

  async login(username: string, password: string) {
    await this.usernameInputLocator.fill(username);
    await this.passwordInputLocator.fill(password);

    await this.loginButtonLocator.click();
  }
}
