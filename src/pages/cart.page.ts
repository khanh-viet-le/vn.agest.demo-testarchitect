import { Locator, Page } from "@playwright/test";
import { RouteConstants } from "@constants/route.constants";
import { extractNumbers } from "@utils/text-helper.util";
import { BasePage } from "@pages/base.page";

export class CartPage extends BasePage {
  readonly productQuantityInputLocatior: Locator;
  readonly updateCartButtonLocator: Locator;
  readonly messageLocator: Locator;
  readonly clearCartButtonLocator: Locator;
  readonly cartEmptyTitleLocator: Locator;
  readonly proceedToCheckoutButtonLocator: Locator;
  readonly cartTotalLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.productQuantityInputLocatior = this.page.getByTitle("Qty");
    this.updateCartButtonLocator = this.page.getByRole("button", {
      name: "Update cart",
    });
    this.messageLocator = this.page.locator("*[role=alert]");
    this.clearCartButtonLocator = this.page.locator(".clear-cart");
    this.cartEmptyTitleLocator = this.page.getByRole("heading", {
      level: 1,
      name: "YOUR SHOPPING CART IS EMPTY",
    });
    this.proceedToCheckoutButtonLocator = this.page.getByRole("link", {
      name: "Proceed to checkout",
    });
    this.cartTotalLocator = this.page.locator(".cart-subtotal");
  }

  async goto() {
    await this.page.goto(RouteConstants.CART);
  }

  async updateFirstAvailableProductQuantity(quatity: number) {
    await this.productQuantityInputLocatior.first().fill(quatity.toString());
    await this.updateCartButtonLocator.click();

    await this.messageLocator.waitFor({ state: "visible" });
  }

  async getFirstAvailableProductQuantity(): Promise<number> {
    const rawText = await this.productQuantityInputLocatior
      .first()
      .inputValue();

    const quantity = extractNumbers(rawText)[0] ?? 0;

    return quantity;
  }

  async getMessage() {
    return (await this.messageLocator.textContent()) ?? "";
  }

  async clearCart() {
    this.page.on("dialog", (dialog) => dialog.accept());
    await this.clearCartButtonLocator.click();
  }

  async isCartEmpty() {
    return await this.cartEmptyTitleLocator.isVisible();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButtonLocator.click();
  }

  async getCartTotal() {
    const rawText = (await this.cartTotalLocator.textContent()) ?? "";
    const total = extractNumbers(rawText)[0] ?? 0;

    return total;
  }
}
