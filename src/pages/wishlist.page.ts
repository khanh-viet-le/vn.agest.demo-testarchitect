import { RouteConstants } from "@constants/route.constants";
import { Page } from "@playwright/test";
import { BasePage } from "@pages/base.page";

export class WishlistPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto(RouteConstants.WISHLIST);
  }
}
