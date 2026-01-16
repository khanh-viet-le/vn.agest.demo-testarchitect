import test from "@fixtures/common.fixture";
import { IBillingInfoRequiredField } from "@interfaces/billing-info-required-field.interface";
import { IBillingInfo } from "@interfaces/billing-info.interface";
import { DataHelper } from "@utils/data-helper.util";
import { expect } from "@playwright/test";
import { PaymentMethod } from "@constants/payment-method.constants";
import { ShopPage } from "@pages/shop.page";
import { ProductPage } from "@pages/product.page";
import { CheckoutPage } from "@pages/checkout.page";

const requiredBillingInfoFields =
  DataHelper.getDataset<IBillingInfoRequiredField>(
    "billing-info-required-fields"
  ).filter((field) => !field.defaultValue);

// User is at checkout
test.beforeEach(async ({ homePage, page }) => {
  await homePage.navigateToPageInMainMenu("Shop");

  const shopPage = new ShopPage(page);
  await shopPage.selectFirstAvailableProduct();

  const productPage = new ProductPage(page);
  await productPage.addToCart();
  await productPage.navigateToCheckoutPage();
});

test("TC_06: Verify Error Handling for Mandatory Checkout Fields", async ({
  page,
}) => {
  const checkoutPage = new CheckoutPage(page);

  // 1. Leave mandatory fields (address, payment info) blank
  // 2. Click 'Confirm Order'
  await checkoutPage.placeOrder({
    billingInfo: {} as IBillingInfo,
    paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
  });

  // 3. Verify error messages
  //   System should highlight missing fields and show an error message
  const messages = await checkoutPage.getMessages();
  const fields = await checkoutPage.getHighlightedFields();

  for (const field of requiredBillingInfoFields) {
    expect
      .soft(
        messages.some((message) =>
          new RegExp(field.fieldName, "i").test(message)
        )
      )
      .toBeTruthy();

    expect
      .soft(
        fields.some((fieldText) =>
          new RegExp(field.fieldName, "i").test(fieldText)
        )
      )
      .toBeTruthy();
  }
});
