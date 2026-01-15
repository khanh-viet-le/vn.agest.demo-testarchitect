import { Locator, Page } from "@playwright/test";
import { RouteConstants } from "@constants/route.constants";
import { PaymentMethod } from "@constants/payment-method.constants";
import { IOrderInfo } from "../interfaces/order-info.interface";
import { IBillingInfo } from "../interfaces/billing-info.interface";

export class CheckoutPage {
  private page: Page;
  private placeOrderButtonLocator: Locator;
  private messageLocator: Locator;
  private firstNameInputLocator: Locator;
  private lastNameInputLocatior: Locator;
  private countryOrRegionInputLocator: Locator;
  private streetAddressInputLocator: Locator;
  private townOrCityInputLocator: Locator;
  private stateInputLocator: Locator;
  private zipCodeInputLocator: Locator;
  private phoneInputLocator: Locator;
  private emailInputLocator: Locator;
  private orderNumberLocator: Locator;
  private invalidWrapperLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.placeOrderButtonLocator = this.page.getByRole("button", {
      name: "Place order",
    });
    this.messageLocator = this.page
      .locator("ul[role=alert]")
      .getByRole("listitem");

    this.firstNameInputLocator = this.page.locator("#billing_first_name");
    this.lastNameInputLocatior = this.page.locator("#billing_last_name");
    this.countryOrRegionInputLocator = this.page.locator("#billing_country");
    this.streetAddressInputLocator = this.page.locator("#billing_address_1");
    this.townOrCityInputLocator = this.page.locator("#billing_city");
    this.stateInputLocator = this.page.locator("#billing_state");
    this.zipCodeInputLocator = this.page.locator("#billing_postcode");
    this.phoneInputLocator = this.page.locator("#billing_phone");
    this.emailInputLocator = this.page.locator("#billing_email");
    this.orderNumberLocator = this.page.getByText("Order number");

    this.invalidWrapperLocator = this.page.locator(".woocommerce-invalid");
  }

  async goto() {
    await this.page.goto(RouteConstants.CHECKOUT);
  }

  async addBillingDetails(info: IBillingInfo) {
    if (info.firstName) {
      await this.firstNameInputLocator.fill(info.firstName);
    }

    if (info.lassName) {
      await this.lastNameInputLocatior.fill(info.lassName);
    }

    // await this.countryOrRegionInputLocator.click();
    // const countryOrRegionOption =
    //   await this.countryOrRegionInputLocator.getByText(info.countryOrRegion);
    // await countryOrRegionOption.scrollIntoViewIfNeeded();
    // await countryOrRegionOption.click();

    if (info.streetAddress) {
      await this.streetAddressInputLocator.fill(info.streetAddress);
    }

    if (info.townOrCity) {
      await this.townOrCityInputLocator.fill(info.townOrCity);
    }

    // await this.stateInputLocator.click();
    // const stateOption = await this.stateInputLocator.getByText(info.state);
    // await stateOption.scrollIntoViewIfNeeded();
    // await stateOption.click();

    if (info.zipCode) {
      await this.zipCodeInputLocator.fill(info.zipCode);
    }

    if (info.phone) {
      await this.phoneInputLocator.fill(info.phone);
    }

    if (info.email) {
      await this.emailInputLocator.fill(info.email);
    }
  }

  async placeOrder(orderInfo: IOrderInfo) {
    await this.addBillingDetails(orderInfo.billingInfo);

    if (orderInfo.createAccount) {
      // logic for ontion create account here
    }

    if (orderInfo.orderNotes) {
      // logic for order notes here
    }

    const paymentMethod =
      PaymentMethod[
        orderInfo.paymentMethod as unknown as keyof typeof PaymentMethod
      ];
    if (orderInfo.paymentMethod && paymentMethod) {
      await this.page.locator(`#${paymentMethod}`).setChecked(true);
    }

    await this.placeOrderButtonLocator.waitFor({ state: "visible" });
    await this.placeOrderButtonLocator.click();
  }

  async getMessages() {
    await this.messageLocator.first().waitFor({ state: "visible" });
    return await this.messageLocator.allTextContents();
  }

  async isFieldHighlighted(fieldName: string) {
    return await this.invalidWrapperLocator
      .locator(this.page.getByLabel(fieldName))
      .isVisible();
  }

  async isFieldHasError(fieldName: string) {
    const messages = await this.getMessages();

    return !!messages.find((message) => {
      return message.includes(fieldName);
    });
  }

  async getOrderNumber() {
    const rawText = await this.orderNumberLocator.textContent();
    const orderNumber = rawText
      ? parseFloat(rawText.replace(/[^\d.]/g, ""))
      : 0;

    return orderNumber;
  }
}
