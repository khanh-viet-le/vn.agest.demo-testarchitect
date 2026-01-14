import { Locator, Page } from "@playwright/test";
import { RouteConstants } from "@constants/route.constants";
import { ProductPage } from "@pages/product.page";
import { Product } from "@models/product.model";

export class ShopPage {
  private page: Page;
  private productItemLocator: Locator;
  private productTitleLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productItemLocator = this.page
      .locator(".products")
      .locator(".product");

    this.productTitleLocator = this.productItemLocator
      .locator(".product-title")
      .getByRole("link");
  }

  async goto() {
    await this.page.goto(RouteConstants.SHOP);
  }

  async selectProduct(product: Product): Promise<ProductPage> {
    await this.productTitleLocator
      .filter({
        hasText: product.title,
      })
      .click();

    return new ProductPage(this.page);
  }

  async selectFirstAvailableProduct(): Promise<ProductPage> {
    await this.productTitleLocator.first().click();
    await this.page.waitForLoadState("networkidle");

    return new ProductPage(this.page);
  }
}
