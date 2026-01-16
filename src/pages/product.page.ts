import { Locator, Page } from "@playwright/test";
import { RouteConstants } from "@constants/route.constants";
import { MessageStatusConstants } from "@constants/message-status.constants";
import { Product } from "@models/product.model";
import { TextHelper } from "@utils/text-helper.util";
import { BasePage } from "@pages/base.page";

export class ProductPage extends BasePage {
  readonly productTitleLocator: Locator;
  readonly productPriceLocator: Locator;
  readonly amountInputLocator: Locator;
  readonly addToCartButtonLocator: Locator;
  readonly messageLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitleLocator = this.page.locator("h1.product_title");
    this.productPriceLocator = this.page.locator("h1.product_title ~ .price");

    this.amountInputLocator = this.page.locator("input[name=quantity]");
    this.addToCartButtonLocator = this.page.getByRole("button", {
      name: "Add to Cart",
    });
    this.messageLocator = this.page.locator(".et-notify");
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

  async getProduct(): Promise<Product> {
    await this.productTitleLocator.waitFor({ timeout: 10000 });
    const title = (await this.productTitleLocator.textContent()) ?? "";
    let price: number | string =
      (await this.productPriceLocator.textContent()) ?? "";

    price = TextHelper.extractNumbers(price)[0] ?? 0;

    const product = new Product(title);
    product.price = price;
    return product;
  }
}
