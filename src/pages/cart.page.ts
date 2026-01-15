import { Locator, Page } from "@playwright/test";
import { RouteConstants } from "../constants/route.constants";

export class CartPage {
  private page: Page;
  private productQuantityInputLocatior: Locator;
  private updateCartButtonLocator: Locator;
  private messageLocator: Locator;
  private clearCartButtonLocator: Locator;
  private cartEmptyTitleLocator: Locator;

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

    return rawText ? parseInt(rawText, 10) : 0;
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
}
