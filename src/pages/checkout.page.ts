import { Locator, Page } from "@playwright/test";
import { RouteConstants } from "@constants/route.constants";
import { PaymentMethod } from "@constants/payment-method.constants";
import { IOrderInfo } from "@interfaces/order-info.interface";
import { IBillingInfo } from "@interfaces/billing-info.interface";
import { BasePage } from "./base.page";
import { TextHelper } from "@utils/text-helper.util";

export class CheckoutPage extends BasePage {
  readonly placeOrderButtonLocator: Locator;
  readonly messageLocator: Locator;
  readonly firstNameInputLocator: Locator;
  readonly lastNameInputLocatior: Locator;
  readonly countryOrRegionInputLocator: Locator;
  readonly streetAddressInputLocator: Locator;
  readonly townOrCityInputLocator: Locator;
  readonly stateInputLocator: Locator;
  readonly zipCodeInputLocator: Locator;
  readonly phoneInputLocator: Locator;
  readonly emailInputLocator: Locator;
  readonly orderNumberLocator: Locator;
  readonly invalidWrapperLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.placeOrderButtonLocator = this.page.getByRole("button", {
      name: "Place order",
    });
    this.messageLocator = this.page
      .locator("ul[role=alert]")
      .getByRole("listitem");

    this.firstNameInputLocator = this.page.locator("#billing_first_name");
    this.lastNameInputLocatior = this.page.locator("#billing_last_name");
    this.countryOrRegionInputLocator = this.page.locator(
      "#select2-billing_country-container"
    );
    this.streetAddressInputLocator = this.page.locator("#billing_address_1");
    this.townOrCityInputLocator = this.page.locator("#billing_city");
    this.stateInputLocator = this.page.locator(
      "#select2-billing_state-container"
    );
    this.zipCodeInputLocator = this.page.locator("#billing_postcode");
    this.phoneInputLocator = this.page.locator("#billing_phone");
    this.emailInputLocator = this.page.locator("#billing_email");
    this.orderNumberLocator = this.page.getByText("Order number");

    this.invalidWrapperLocator = this.page.locator(".woocommerce-invalid");
  }

  async goto() {
    await this.page.goto(RouteConstants.CHECKOUT);
  }

  private async selectOption(name: string) {
    const targetOption = this.page
      .getByRole("option", {
        name: new RegExp(name, "i"),
      })
      .first();
    await targetOption.click();
  }

  async addBillingDetails(info: IBillingInfo) {
    if (info.firstName) {
      await this.firstNameInputLocator.fill(info.firstName);
    }

    if (info.lassName) {
      await this.lastNameInputLocatior.fill(info.lassName);
    }

    if (info.countryOrRegion) {
      await this.countryOrRegionInputLocator.first().click();
      await this.selectOption(info.countryOrRegion);
      await this.countryOrRegionInputLocator.first().click();
    }

    if (info.streetAddress) {
      await this.streetAddressInputLocator.fill(info.streetAddress);
    }

    if (info.townOrCity) {
      await this.townOrCityInputLocator.first().fill(info.townOrCity);
    }

    if (info.state) {
      await this.stateInputLocator.click();
      await this.selectOption(info.state);
      await this.stateInputLocator.click();
    }

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

  async getHighlightedFields() {
    return await this.invalidWrapperLocator
      .locator(this.page.locator("label"))
      .allTextContents();
  }

  async getOrderNumber() {
    await this.orderNumberLocator.waitFor({
      state: "visible",
      timeout: 30_000,
    });
    const rawText = (await this.orderNumberLocator.textContent()) ?? "";
    const orderNumber = TextHelper.extractNumbers(rawText).shift() ?? 0;

    return orderNumber;
  }
}
