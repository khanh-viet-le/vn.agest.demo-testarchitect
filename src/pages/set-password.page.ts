import { Locator, Page } from "@playwright/test";
import { AccountPage } from "./account.page";

export class SetPasswordPage extends AccountPage {
  readonly inputPasswordLocator: Locator;
  readonly confirmPasswordLocator: Locator;
  readonly saveButtonLocator: Locator;

  constructor(page: Page) {
    super(page);
    const inputLocator = this.page
      .locator(".password-input")
      .getByRole("textbox");

    this.inputPasswordLocator = inputLocator.first();
    this.confirmPasswordLocator = inputLocator.last();
    this.saveButtonLocator = this.page.getByRole("button", {
      name: "Save",
    });
  }

  async setPassword(password: string) {
    await this.inputPasswordLocator.waitFor({
      state: "visible",
      timeout: 60_000,
    });
    await this.inputPasswordLocator.fill(password);
    await this.confirmPasswordLocator.fill(password);

    await this.saveButtonLocator.click();
  }
}
