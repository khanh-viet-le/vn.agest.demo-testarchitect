import test from "@/fixtures";
import { IBillingInfoRequiredField } from "@interfaces/billing-info-required-field.interface";
import { IBillingInfo } from "@interfaces/billing-info.interface";
import { getDataset } from "@utils/data-helper";
import { expect } from "@playwright/test";
import { PaymentMethod } from "@/src/constants/payment-method.constants";

const requiredBillingInfoFields = getDataset<IBillingInfoRequiredField>(
  "billing-info-required-fields"
);

// User is at checkout
test.beforeEach(async ({ shopPage, homePage, checkoutPage }) => {
  await shopPage.goto();
  await homePage.closeSalesPopupIfVisible();
  await homePage.acceptCookiesIfVisible();

  const productPage = await shopPage.selectFirstAvailableProduct();
  await productPage.addToCart();

  await checkoutPage.goto();
});

test("TC_06: Verify Error Handling for Mandatory Checkout Fields", async ({
  checkoutPage,
}) => {
  // 1. Leave mandatory fields (address, payment info) blank
  // 2. Click 'Confirm Order'
  await checkoutPage.placeOrder({
    billingInfo: {} as IBillingInfo,
    paymentMethod: PaymentMethod.CASH_ON_DELIVERY,
  });

  // 3. Verify error messages
  //   System should highlight missing fields and show an error message
  expect
    .soft(await checkoutPage.getMessages())
    .toHaveLength(
      requiredBillingInfoFields.filter((field) => !field.defaultValue).length
    );

  for (const field of requiredBillingInfoFields) {
    if (!field.defaultValue) {
      expect
        .soft(await checkoutPage.isFieldHasError(field.fieldName))
        .toBeTruthy();
    }

    expect
      .soft(await checkoutPage.isFieldHighlighted(field.fieldName))
      .toBeTruthy();
  }
});
