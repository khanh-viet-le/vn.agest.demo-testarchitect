import { Locator, Page } from "@playwright/test";
import { RouteConstants } from "@constants/route.constants";
import { BasePage } from "@pages/base.page";

export class ShopPage extends BasePage {
  readonly productItemLocator: Locator;
  readonly productTitleLocator: Locator;
  readonly wishListIconLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.productItemLocator = this.page
      .locator(".products")
      .locator(".product");

    this.productTitleLocator = this.productItemLocator
      .locator(".product-title")
      .getByRole("link");
    this.wishListIconLocator = this.page.locator(".add_to_wishlist");
  }

  async goto() {
    await this.page.goto(RouteConstants.SHOP);
  }

  async selectFirstAvailableProduct() {
    await this.productTitleLocator.first().click();
    await this.page.waitForLoadState("networkidle");
  }

  async addFistAvailableProductToWishList() {
    const thisProductLocator = this.productTitleLocator.first();
    await thisProductLocator.hover();
    const thisWishListIconLocator = thisProductLocator.locator(
      this.wishListIconLocator
    );
    await thisWishListIconLocator.click();
    await thisWishListIconLocator.waitFor({ state: "visible" });
  }
}
