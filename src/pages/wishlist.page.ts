import { RouteConstants } from "@constants/route.constants";
import { Locator, Page } from "@playwright/test";
import { BasePage } from "@pages/base.page";
import { Product } from "@models/product.model";

export class WishlistPage extends BasePage {
  readonly productTitleLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitleLocator = this.page
      .locator(".wishlist-items-wrapper")
      .locator(".product-name")
      .getByRole("link");
  }

  async goto() {
    await this.page.goto(RouteConstants.WISHLIST);
  }

  async getProducts(): Promise<Product[]> {
    const productTitles = await this.productTitleLocator.allTextContents();

    return productTitles.map((title) => new Product(title.trim()));
  }
}
