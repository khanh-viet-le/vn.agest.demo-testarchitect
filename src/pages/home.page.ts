import { Locator, Page } from "@playwright/test";
import { Product } from "@models/product.model";
import { Category } from "@models/category.model";
import { RouteConstants } from "@constants/route.constants";
import { BasePage } from "@pages/base.page";

export class HomePage extends BasePage {
  readonly productItemLocator: Locator;
  readonly productCategoryLocator: Locator;
  readonly productTitleLocator: Locator;

  constructor(page: Page, isMobile: boolean = false) {
    super(page, isMobile);

    this.productItemLocator = this.page
      .locator(".products")
      .locator(".product");
    this.productCategoryLocator = this.page
      .locator(".products-page-cats")
      .getByRole("link");
    this.productTitleLocator = this.page
      .locator(".product-title")
      .getByRole("link");
  }

  async goto() {
    await this.page.goto(RouteConstants.HOME);
  }

  async getProductList(): Promise<Product[]> {
    await this.productItemLocator.first().waitFor({ timeout: 10000 });
    const productItems = await this.productItemLocator.all();

    const products: Product[] = [];

    for (const item of productItems) {
      const title =
        (await item.locator(this.productTitleLocator).textContent()) ?? "";
      const categoryName = await item
        .locator(this.productCategoryLocator)
        .textContent();

      const category = categoryName
        ? new Category(categoryName.trim())
        : undefined;
      const product = new Product(title, category);

      products.push(product);
    }

    return products;
  }
}
