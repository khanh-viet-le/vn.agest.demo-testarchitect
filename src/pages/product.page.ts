import { Locator, Page } from "@playwright/test";
import { RouteConstants } from "@constants/route.constants";
import { Product } from "@models/product.model";
import { MessageStatusConstants } from "@constants/message-status.constants";
import { extractNumbers } from "@utils/text-helper.util";

export class ProductPage {
  private page: Page;
  private productTitleLocator: Locator;
  private productPriceLocator: Locator;
  private amountInputLocator: Locator;
  private addToCartButtonLocator: Locator;
  private messageLocator: Locator;
  private cartCountLocator: Locator;
  private productsInCartLocator: Locator;
  private productTitleInCartLocator: Locator;
  private cartTotalPriceLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitleLocator = this.page.locator("h1.product_title");
    this.productPriceLocator = this.page.locator("h1.product_title ~ .price");

    this.amountInputLocator = this.page.locator("input[name=quantity]");
    this.addToCartButtonLocator = this.page.getByRole("button", {
      name: "Add to Cart",
    });
    this.messageLocator = this.page.locator(".et-notify");
    this.cartCountLocator = this.page.locator(
      ".header-wrapper span ~ .et-cart-quantity"
    );

    // CART POPUP
    this.productsInCartLocator = this.page
      .locator(".cart-widget-products")
      .getByRole("listitem");

    this.productTitleInCartLocator = this.page.locator(".product-title");
    this.cartTotalPriceLocator = this.page
      .locator(".header-wrapper")
      .locator(".big-coast");
  }

  async goto(product: Product) {
    await this.page.goto(`${RouteConstants.PRODUCT}/${product.slug}`);
  }

  async addToCart(amount: number = 1) {
    await this.amountInputLocator.fill(amount.toString());
    await this.addToCartButtonLocator.click();
    await this.messageLocator.waitFor({ state: "visible" });
  }

  async getMessageStatus(): Promise<MessageStatusConstants> {
    const status =
      ((await this.messageLocator.getAttribute(
        "data-type"
      )) as MessageStatusConstants) ?? MessageStatusConstants.UNKNOWN;

    return status;
  }

  async getProductsInCart(): Promise<Product[]> {
    await this.cartCountLocator.hover();
    await this.productsInCartLocator.waitFor({ state: "visible" });

    const productTitles = await this.productsInCartLocator
      .locator(this.productTitleInCartLocator)
      .allTextContents();

    return productTitles.map(
      (title) => new Product(title.trim().replace(/\s+/g, " "))
    );
  }

  async getProduct(): Promise<Product> {
    await this.productTitleLocator.waitFor({ timeout: 10000 });
    const title = (await this.productTitleLocator.textContent()) ?? "";
    let price: number | string =
      (await this.productPriceLocator.textContent()) ?? "";

    price = extractNumbers(price)[0] ?? 0;

    const product = new Product(title);
    product.price = price;
    return product;
  }

  async getCartCount(): Promise<number> {
    await this.cartCountLocator.waitFor({ state: "attached" });

    if (!(await this.cartCountLocator.isVisible())) {
      await this.cartCountLocator.scrollIntoViewIfNeeded();
    }

    const countText = (await this.cartCountLocator.textContent()) ?? "";
    const count = extractNumbers(countText)[0] ?? 0;
    return count;
  }

  async getCartTotalPrice(): Promise<number> {
    const rawText = (await this.cartTotalPriceLocator.textContent()) ?? "";
    const totalPrice = extractNumbers(rawText)[0] ?? 0;

    return totalPrice;
  }
}
