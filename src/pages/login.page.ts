import { Locator, Page } from "@playwright/test";
import { AccountPage } from "@pages/account.page";

export class LoginPage extends AccountPage {
  readonly usernameInputLocator: Locator;
  readonly passwordInputLocator: Locator;
  readonly loginButtonLocator: Locator;

  constructor(page: Page) {
    super(page);
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

  async login(username: string, password: string) {
    await this.usernameInputLocator.fill(username);
    await this.passwordInputLocator.fill(password);

    await this.loginButtonLocator.click();
  }
}
