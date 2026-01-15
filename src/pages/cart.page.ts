import { Locator, Page } from "@playwright/test";
import { RouteConstants } from "@constants/route.constants";
import { CheckoutPage } from "@pages/checkout.page";
import { extractNumbers } from "@utils/text-helper.util";

export class CartPage {
  private page: Page;
  private productQuantityInputLocatior: Locator;
  private updateCartButtonLocator: Locator;
  private messageLocator: Locator;
  private clearCartButtonLocator: Locator;
  private cartEmptyTitleLocator: Locator;
  private proceedToCheckoutButtonLocator: Locator;
  private cartTotalLocator: Locator;

  constructor(page: Page) {
    this.page = page;
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

  async proceedToCheckout(): Promise<CheckoutPage> {
    await this.proceedToCheckoutButtonLocator.click();

    return new CheckoutPage(this.page);
  }

  async getCartTotal() {
    const rawText = (await this.cartTotalLocator.textContent()) ?? "";
    const total = extractNumbers(rawText)[0] ?? 0;

    return total;
  }
}
