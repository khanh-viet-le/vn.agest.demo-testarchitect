import { Page } from "@playwright/test";
import { RouteConstants } from "@constants/route.constants";
import { BasePage } from "./base.page";

export abstract class AccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto(RouteConstants.MY_ACCOUNT);
  }
}
