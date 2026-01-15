import { Locator, Page } from "@playwright/test";
import { RouteConstants } from "../constants/route.constants";
import { BillingInfo } from "../models/billing-info.model";
import { DeliveryOption } from "../constants/delivery-option.constants";

export class CheckoutPage {
  private page: Page;
  private placeOrderButtonLocator: Locator;
  private messageLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.placeOrderButtonLocator = this.page.getByRole("button", {
      name: "Place order",
    });
    this.messageLocator = this.page
      .locator("ul[role=alert]")
      .getByRole("listitem");
  }

  async goto() {
    await this.page.goto(RouteConstants.CHECKOUT);
  }

  async addBillingDetails(info: BillingInfo) {
    // logic add billing info here
  }

  async placeOrder(
    info: BillingInfo,
    createAccount: boolean = false,
    orderNotes: string = "",
    deliveryOption: DeliveryOption = DeliveryOption.CASH_ON_DELIVERY
  ) {
    await this.addBillingDetails(info);

    // logic for ontion create account here
    // logic for order notes here
    // logic for delivery option here

    await this.placeOrderButtonLocator.click();
  }

  async getMessages() {
    await this.messageLocator.first().waitFor({ state: "visible" });
    return await this.messageLocator.allTextContents();
  }

  async isFieldHighlighted(fieldName: string) {
    const messages = await this.getMessages();

    return !!messages.find((message) => {
      return message.includes(fieldName);
    });
  }
}
